// ======================================================
// CART PAGE FUNCTIONALITY
// ======================================================

// Global variables
let cartPageItems = []
let cartPageTotal = 0
let cartPageSubtotal = 0
let cartPageDiscount = 0

// Initialize cart page when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    // Wait for API and other dependencies to be available
    if (typeof window.API === "undefined") {
        console.error("API not loaded")
        return
    }

    // Load existing functionality from script.js
    const initializeMobileScrollEffects = window.initializeMobileScrollEffects
    const initializeDesktopScrollEffects = window.initializeDesktopScrollEffects
    const initializeMobileSidebar = window.initializeMobileSidebar
    const initializeMobileBottomNav = window.initializeMobileBottomNav
    const loadCartFromStorage = window.loadCartFromStorage

    if (typeof initializeMobileScrollEffects === "function") {
        initializeMobileScrollEffects()
    }
    if (typeof initializeDesktopScrollEffects === "function") {
        initializeDesktopScrollEffects()
    }
    if (typeof initializeMobileSidebar === "function") {
        initializeMobileSidebar()
    }
    if (typeof initializeMobileBottomNav === "function") {
        initializeMobileBottomNav()
    }
    if (typeof loadCartFromStorage === "function") {
        loadCartFromStorage()
    }

    // Initialize cart page specific functionality
    await initializeCartPage()

    console.log("Cart page initialized successfully!")
})

/**
 * Initialize cart page functionality
 */
async function initializeCartPage() {
    try {
        // Load cart items from localStorage
        loadCartPageItems()

        // Render cart page
        await renderCartPage()

        // Initialize event listeners
        initializeCartPageEvents()

        // Update cart badge
        updateCartBadge()
    } catch (error) {
        console.error("Error initializing cart page:", error)
        showErrorState()
    }
}

/**
 * Load cart items from localStorage
 */
function loadCartPageItems() {
    try {
        const savedCartItems = localStorage.getItem("cartItems")
        const savedCartCount = localStorage.getItem("cartCount")

        if (savedCartItems) {
            cartPageItems = JSON.parse(savedCartItems)
            console.log("Loaded cart items:", cartPageItems)
        } else {
            cartPageItems = []
        }

        // Update global cart variables if they exist
        if (typeof window.cartItems !== "undefined") {
            window.cartItems = cartPageItems
            window.cartCount = cartPageItems.reduce((total, item) => total + item.quantity, 0)
        }
    } catch (error) {
        console.error("Error loading cart items:", error)
        cartPageItems = []
    }
}

/**
 * Render cart page based on cart state
 */
async function renderCartPage() {
    const cartEmptyState = document.getElementById("cartEmptyState")
    const cartWithItems = document.getElementById("cartWithItems")

    if (!cartPageItems || cartPageItems.length === 0) {
        // Show empty cart state
        cartEmptyState.style.display = "block"
        cartWithItems.style.display = "none"
    } else {
        // Show cart with items
        cartEmptyState.style.display = "none"
        cartWithItems.style.display = "block"

        // Render cart items
        await renderCartItems()

        // Calculate and update totals
        calculateCartTotals()
        updateOrderSummary()
    }
}

/**
 * Render cart items list
 */
async function renderCartItems() {
    const cartProductsList = document.getElementById("cartProductsList")
    if (!cartProductsList) return

    cartProductsList.innerHTML = ""

    for (const item of cartPageItems) {
        try {
            // Get full product details if needed
            let productDetails = item

            // If we only have basic info, fetch full details
            if (!item.productSizes && typeof window.API !== "undefined") {
                try {
                    const fullProduct = await window.API.fetchProductById(item.id)
                    if (fullProduct) {
                        productDetails = { ...item, ...fullProduct }
                    }
                } catch (error) {
                    console.warn("Could not fetch full product details for:", item.id)
                }
            }

            const cartItemElement = createCartItemElement(productDetails)
            cartProductsList.appendChild(cartItemElement)
        } catch (error) {
            console.error("Error rendering cart item:", error)
        }
    }
}

/**
 * Create cart item HTML element
 */
function createCartItemElement(item) {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-product-item"
    cartItem.setAttribute("data-item-id", item.id)
    cartItem.setAttribute("data-item-size", item.size || "")

    // Check if item is out of stock
    const isOutOfStock = checkItemStock(item)
    if (isOutOfStock) {
        cartItem.classList.add("out-of-stock")
    }

    // Get image URL
    const imageUrl = getItemImageUrl(item)

    // Calculate pricing with discount
    const pricingInfo = calculateItemPricing(item)

    // Get size info
    const sizeInfo = getItemSizeInfo(item)

    cartItem.innerHTML = `
        <img src="${imageUrl}" alt="${item.name}" class="cart-product-image">
        <div class="cart-product-details">
            <div class="cart-product-info">
                <h4 class="cart-product-name">${item.name}</h4>
                ${sizeInfo.html}
            </div>
            <div class="cart-product-pricing">
                <span class="cart-current-price">${formatPrice(pricingInfo.displayPrice)}</span>
                ${pricingInfo.hasDiscount ? `<span class="cart-original-price">${formatPrice(pricingInfo.originalPrice)}</span>` : ""}
            </div>
            <div class="cart-product-controls">
                <div class="cart-quantity-controls">
                    <button class="cart-quantity-btn" onclick="updateCartPageItemQuantity('${item.id}', '${item.size || ""}', -1)" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
                    <span class="cart-quantity-display">${item.quantity}</span>
                    <button class="cart-quantity-btn" onclick="updateCartPageItemQuantity('${item.id}', '${item.size || ""}', 1)" ${isOutOfStock ? "disabled" : ""}>+</button>
                </div>
                <div class="cart-item-total">${formatPrice(pricingInfo.displayPrice * item.quantity)}</div>
                <button class="cart-remove-btn" onclick="removeCartPageItem('${item.id}', '${item.size || ""}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `

    return cartItem
}

/**
 * Check if item is out of stock
 */
function checkItemStock(item) {
    if (!item.productSizes || !item.size) {
        return false
    }

    const sizeData = item.productSizes.find((size) => size.size === item.size)
    return !sizeData || sizeData.amount <= 0
}

/**
 * Get item image URL
 */
function getItemImageUrl(item) {
    if (item.image) {
        return item.image
    }

    if (item.attachmentKeys && item.attachmentKeys.length > 0 && typeof window.API !== "undefined") {
        return window.API.getImageUrl(item.attachmentKeys[0])
    }

    return "/placeholder.svg?height=80&width=80&text=No+Image"
}

/**
 * Calculate item pricing with discounts
 */
function calculateItemPricing(item) {
    if (typeof window.DiscountUtils !== "undefined") {
        return window.DiscountUtils.calculateDiscount(item)
    }

    // Fallback calculation
    const discountPercent = item.discount || 0
    const hasDiscount = item.status === "SALE" && discountPercent > 0
    const originalPrice = item.price
    const discountedPrice = hasDiscount ? originalPrice * (1 - discountPercent / 100) : originalPrice

    return {
        hasDiscount,
        discountedPrice,
        originalPrice,
        displayPrice: discountedPrice,
        discountPercent,
    }
}

/**
 * Get item size information
 */
function getItemSizeInfo(item) {
    if (!item.size) {
        return { html: "", stockCount: null }
    }

    let stockCount = null
    if (item.productSizes) {
        const sizeData = item.productSizes.find((size) => size.size === item.size)
        stockCount = sizeData ? sizeData.amount : 0
    }

    const stockText = stockCount !== null ? ` (${stockCount} ta mavjud)` : ""

    return {
        html: `<div class="cart-product-size">O'lcham: ${item.size}<span class="stock-count">${stockText}</span></div>`,
        stockCount,
    }
}

/**
 * Calculate cart totals
 */
function calculateCartTotals() {
    cartPageSubtotal = 0
    cartPageDiscount = 0

    cartPageItems.forEach((item) => {
        const pricingInfo = calculateItemPricing(item)
        const itemSubtotal = pricingInfo.originalPrice * item.quantity
        const itemTotal = pricingInfo.displayPrice * item.quantity

        cartPageSubtotal += itemSubtotal
        cartPageDiscount += itemSubtotal - itemTotal
    })

    cartPageTotal = cartPageSubtotal - cartPageDiscount
}

/**
 * Update order summary display
 */
function updateOrderSummary() {
    const orderSubtotal = document.getElementById("orderSubtotal")
    const orderDiscount = document.getElementById("orderDiscount")
    const orderTotal = document.getElementById("orderTotal")
    const orderCheckoutBtn = document.getElementById("orderCheckoutBtn")

    if (orderSubtotal) {
        orderSubtotal.textContent = formatPrice(cartPageSubtotal)
    }

    if (orderDiscount) {
        orderDiscount.textContent = cartPageDiscount > 0 ? `-${formatPrice(cartPageDiscount)}` : "-0 So'm"
    }

    if (orderTotal) {
        orderTotal.textContent = formatPrice(cartPageTotal)
    }

    if (orderCheckoutBtn) {
        orderCheckoutBtn.disabled = cartPageItems.length === 0
    }
}

/**
 * Update cart item quantity
 */
function updateCartPageItemQuantity(itemId, itemSize, change) {
    const itemIndex = cartPageItems.findIndex(
        (item) => item.id.toString() === itemId.toString() && (item.size || "") === itemSize,
    )

    if (itemIndex === -1) return

    const item = cartPageItems[itemIndex]
    const newQuantity = item.quantity + change

    if (newQuantity <= 0) {
        removeCartPageItem(itemId, itemSize)
    } else {
        // Check stock availability
        if (change > 0) {
            const stockInfo = getItemSizeInfo(item)
            if (stockInfo.stockCount !== null && newQuantity > stockInfo.stockCount) {
                showNotification("Omborda yetarli mahsulot yo'q!", "warning")
                return
            }
        }

        item.quantity = newQuantity

        // Update localStorage
        saveCartToStorage()

        // Re-render cart
        renderCartPage()

        // Update cart badge
        updateCartBadge()

        showNotification("Miqdor yangilandi", "success")
    }
}

/**
 * Remove item from cart
 */
function removeCartPageItem(itemId, itemSize) {
    const itemIndex = cartPageItems.findIndex(
        (item) => item.id.toString() === itemId.toString() && (item.size || "") === itemSize,
    )

    if (itemIndex === -1) return

    const removedItem = cartPageItems[itemIndex]
    cartPageItems.splice(itemIndex, 1)

    // Update localStorage
    saveCartToStorage()

    // Re-render cart
    renderCartPage()

    // Update cart badge
    updateCartBadge()

    showNotification(`${removedItem.name} savatdan o'chirildi`, "info")
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage() {
    try {
        localStorage.setItem("cartItems", JSON.stringify(cartPageItems))

        const totalCount = cartPageItems.reduce((total, item) => total + item.quantity, 0)
        localStorage.setItem("cartCount", totalCount.toString())

        // Update global cart variables if they exist
        if (typeof window.cartItems !== "undefined") {
            window.cartItems = cartPageItems
            window.cartCount = totalCount
        }
    } catch (error) {
        console.error("Error saving cart to storage:", error)
    }
}

/**
 * Update cart badge in header
 */
function updateCartBadge() {
    const cartBadge = document.getElementById("cartBadge")
    const bottomNavCartBadge = document.getElementById("bottomNavCartBadge")

    const totalCount = cartPageItems.reduce((total, item) => total + item.quantity, 0)

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

/**
 * Initialize cart page event listeners
 */
function initializeCartPageEvents() {
    // Empty cart button
    const emptyCartBtn = document.getElementById("emptyCartBtn")
    if (emptyCartBtn) {
        emptyCartBtn.addEventListener("click", () => {
            // Navigate to catalog
            window.location.href = "/index.html"
        })
    }

    // Order checkout button
    const orderCheckoutBtn = document.getElementById("orderCheckoutBtn")
    if (orderCheckoutBtn) {
        orderCheckoutBtn.addEventListener("click", handleCheckout)
    }
}

/**
 * Handle checkout process
 */
function handleCheckout() {
    if (cartPageItems.length === 0) {
        showNotification("Savat bo'sh!", "warning")
        return
    }

    // Check for out of stock items
    const outOfStockItems = cartPageItems.filter((item) => checkItemStock(item))
    if (outOfStockItems.length > 0) {
        showNotification("Ba'zi mahsulotlar omborda mavjud emas!", "warning")
        return
    }

    console.log("Processing checkout...")
    console.log("Cart items:", cartPageItems)
    console.log("Total amount:", formatPrice(cartPageTotal))

    // Show success message
    showNotification(`Buyurtma qabul qilindi! Jami: ${formatPrice(cartPageTotal)}`, "success")

    // Here you would typically:
    // 1. Send order to backend
    // 2. Process payment
    // 3. Clear cart
    // 4. Redirect to success page

    // For now, just simulate success
    setTimeout(() => {
        // Clear cart
        cartPageItems = []
        saveCartToStorage()
        renderCartPage()
        updateCartBadge()

        showNotification("Buyurtma muvaffaqiyatli yuborildi!", "success")
    }, 2000)
}

/**
 * Format price for display
 */
function formatPrice(price) {
    if (typeof window.API !== "undefined" && window.API.formatPrice) {
        return window.API.formatPrice(price)
    }

    // Fallback formatting
    return new Intl.NumberFormat("uz-UZ").format(Math.round(price)) + " So'm"
}

/**
 * Show notification message
 */
function showNotification(message, type = "info") {
    // Use existing notification system if available
    if (typeof window.showNotification === "function") {
        window.showNotification(message, type)
        return
    }

    // Fallback notification
    const notification = document.createElement("div")
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#4CAF50" : type === "warning" ? "#ff9800" : type === "error" ? "#f44336" : "#2196F3"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `
    notification.textContent = message
    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
        notification.style.transform = "translateX(0)"
    }, 100)

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = "translateX(100%)"
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification)
            }
        }, 300)
    }, 3000)
}

/**
 * Show error state
 */
function showErrorState() {
    const cartEmptyState = document.getElementById("cartEmptyState")
    const cartWithItems = document.getElementById("cartWithItems")

    if (cartEmptyState) {
        cartEmptyState.innerHTML = `
            <div class="empty-cart-content">
                <h2 class="empty-cart-title" style="color: #dc3545;">Xatolik yuz berdi</h2>
                <p style="color: #666; margin-bottom: 20px;">Savatni yuklashda muammo bo'ldi</p>
                <button class="empty-cart-btn" onclick="location.reload()">Qayta yuklash</button>
            </div>
        `
        cartEmptyState.style.display = "block"
    }

    if (cartWithItems) {
        cartWithItems.style.display = "none"
    }
}

// Make functions globally available
window.updateCartPageItemQuantity = updateCartPageItemQuantity
window.removeCartPageItem = removeCartPageItem
window.CartPageAPI = {
    initializeCartPage,
    renderCartPage,
    updateCartPageItemQuantity,
    removeCartPageItem,
    handleCheckout,
}
