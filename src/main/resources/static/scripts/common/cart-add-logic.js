// ======================================================
// CORE CART ADDITION AND MANAGEMENT LOGIC
// This file provides global functions for cart operations.
// ======================================================

// Global cart items array
window.cartPageItems = []

// Function to load cart items from localStorage
window.loadCartPageItems = () => {
    try {
        const savedCartItems = localStorage.getItem("cartItems")
        if (savedCartItems) {
            window.cartPageItems = JSON.parse(savedCartItems)
        } else {
            window.cartPageItems = []
        }
        // Also update global window.cartItems and window.cartCount if they exist
        if (typeof window.cartItems !== "undefined") {
            window.cartItems = window.cartPageItems
            window.cartCount = window.cartPageItems.reduce((total, item) => total + item.quantity, 0)
        }
    } catch (error) {
        console.error("Error loading cart items:", error)
        window.cartPageItems = []
    }
}

// Function to save cart to localStorage
window.saveCartToStorage = () => {
    try {
        const cartDataToSave = window.cartPageItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            size: item.size,
            addedAt: item.addedAt,
            name: item.name,
            price: item.price,
            image: item.image || (item.attachmentKeys ? window.API.getImageUrl(item.attachmentKeys[0]) : null),
        }))
        localStorage.setItem("cartItems", JSON.stringify(cartDataToSave))
        const totalCount = window.cartPageItems.reduce((total, item) => total + item.quantity, 0)
        localStorage.setItem("cartCount", totalCount.toString())

        if (typeof window.cartItems !== "undefined") {
            window.cartItems = cartDataToSave
            window.cartCount = totalCount
        }
    } catch (error) {
        console.error("Error saving cart to storage:", error)
    }
}

// Function to update cart badge in header and bottom nav
window.updateCartBadge = () => {
    const cartBadge = document.getElementById("cartBadge")
    const bottomNavCartBadge = document.getElementById("bottomNavCartBadge")
    const totalCount = window.cartPageItems.reduce((total, item) => total + item.quantity, 0)

    if (cartBadge) {
        cartBadge.textContent = totalCount
        cartBadge.style.display = totalCount > 0 ? "flex" : "none"
    }
    if (bottomNavCartBadge) {
        bottomNavCartBadge.textContent = totalCount
        if (totalCount > 0) {
            bottomNavCartBadge.classList.add("show")
        } else {
            bottomNavCartBadge.classList.remove("show")
        }
    }
}

// Function to format price for display (dependency for notifications)
window.formatPrice = (price) => {
    if (typeof window.API !== "undefined" && window.API.formatPrice) {
        return window.API.formatPrice(price)
    }
    return new Intl.NumberFormat("uz-UZ").format(Math.round(price)) + " So'm"
}

// Function to show notification message (dependency for addProductToCart)
window.showNotification = (message, type = "info") => {
    if (typeof window.API !== "undefined" && window.API.showNotification) {
        window.API.showNotification(message, type)
        return
    }
    const notification = document.createElement("div")
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: ${type === "success" ? "#4CAF50" : type === "warning" ? "#ff9800" : type === "error" ? "#f44336" : "#2196F3"};
        color: white; padding: 15px 20px; border-radius: 12px; z-index: 9999; font-weight: 600; box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        transform: translateX(100%); transition: transform 0.3s ease; max-width: 350px; font-family: "Montserrat", sans-serif;
    `
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => {
        notification.style.transform = "translateX(0)"
    }, 100)
    setTimeout(() => {
        notification.style.transform = "translateX(100%)"
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification)
            }
        }, 300)
    }, 4000)
}

// Helper function to check item stock (dependency for addProductToCart)
window.checkItemStock = (item) => {
    if (!item.productSizes || !item.size) {
        // If no sizes or size selected, check the general product amount if available
        return item.amount !== undefined && item.amount <= 0
    }
    const sizeData = item.productSizes.find((size) => size.size === item.size)
    return !sizeData || sizeData.amount <= 0
}

// Helper function to get item size info (dependency for addProductToCart)
window.getItemSizeInfo = (item) => {
    if (!item.size) {
        return { html: "", stockCount: item.amount !== undefined ? item.amount : null }
    }
    let stockCount = null
    if (item.productSizes) {
        const sizeData = item.productSizes.find((size) => size.size === item.size)
        stockCount = sizeData ? sizeData.amount : 0
    }
    const stockText = stockCount !== null ? ` (<span class="stock-count">${stockCount} ta mavjud</span>)` : ""
    return { html: `<div class="cart-product-size">O'lcham: <strong>${item.size}</strong>${stockText}</div>`, stockCount }
}

// Main function to add product to cart
window.addProductToCart = (product, quantity, size) => {
    // Ensure cartPageItems is loaded before attempting to modify it
    if (window.cartPageItems.length === 0 && localStorage.getItem("cartItems")) {
        window.loadCartPageItems()
    }

    const existingItemIndex = window.cartPageItems.findIndex(
        (item) => item.id === product.id && (item.size || "") === (size || ""),
    )

    if (existingItemIndex > -1) {
        const existingItem = window.cartPageItems[existingItemIndex]
        const newQuantity = existingItem.quantity + quantity

        const sizeData = product.productSizes ? product.productSizes.find((s) => s.size === size) : null
        const stockCount = sizeData
            ? sizeData.amount
            : product.amount !== undefined
                ? product.amount
                : Number.POSITIVE_INFINITY // Use product.amount if no sizes

        if (newQuantity > stockCount) {
            window.showNotification("Omborda yetarli mahsulot yo'q!", "warning")
            return
        }

        existingItem.quantity = newQuantity
        window.showNotification(`${product.name} miqdori yangilandi`, "success")
    } else {
        const itemToAdd = {
            id: product.id,
            name: product.name,
            price: product.price,
            image:
                product.image ||
                (product.attachmentKeys && product.attachmentKeys.length > 0
                    ? window.API.getImageUrl(product.attachmentKeys[0])
                    : null),
            discount: product.discount,
            status: product.status,
            quantity: quantity,
            size: size,
            addedAt: new Date().toISOString(),
            productSizes: product.productSizes, // Include productSizes for stock checking
            amount: product.amount, // Include product.amount for stock checking if no sizes
        }

        // Final stock check for new item
        const sizeData = product.productSizes ? product.productSizes.find((s) => s.size === size) : null
        const stockCount = sizeData
            ? sizeData.amount
            : product.amount !== undefined
                ? product.amount
                : Number.POSITIVE_INFINITY
        if (quantity > stockCount) {
            window.showNotification("Omborda yetarli mahsulot yo'q!", "warning")
            return
        }

        window.cartPageItems.push(itemToAdd)
        window.showNotification(`${itemToAdd.name} savatga qo'shildi`, "success")
    }

    window.saveCartToStorage()
    window.updateCartBadge()
    // If on cart page, re-render it
    if (document.getElementById("cartWithItems") && document.getElementById("cartWithItems").style.display === "block") {
        if (typeof window.CartPageAPI !== "undefined" && typeof window.CartPageAPI.renderCartPage === "function") {
            window.CartPageAPI.renderCartPage()
        }
    }
}

// Load cart items on script load
window.loadCartPageItems()
