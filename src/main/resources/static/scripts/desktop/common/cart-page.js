// ======================================================
// CART PAGE FUNCTIONALITY - IMPROVED WITH FULL API INTEGRATION
// ======================================================

// Global variables
let cartPageItems = []
let cartPageTotal = 0
let cartPageSubtotal = 0
let cartPageDiscount = 0
let isLoading = false

// Initialize cart page when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    // Wait for API and other dependencies to be available
    if (typeof window.API === "undefined") {
        console.error("API not loaded")
        showErrorState("API yuklanmadi. Sahifani qayta yuklang.")
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
        showLoading(true)

        // Load cart items from localStorage
        loadCartPageItems()

        // Render cart page with API data
        await renderCartPage()

        // Initialize event listeners
        initializeCartPageEvents()

        // Update cart badge
        updateCartBadge()

        showLoading(false)
    } catch (error) {
        console.error("Error initializing cart page:", error)
        showLoading(false)
        showErrorState("Savatni yuklashda xatolik yuz berdi")
    }
}

/**
 * Show/hide loading overlay
 */
function showLoading(show) {
    const loadingOverlay = document.getElementById("loadingOverlay")
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? "flex" : "none"
    }
    isLoading = show
}

/**
 * Load cart items from localStorage
 */
function loadCartPageItems() {
    try {
        const savedCartItems = localStorage.getItem("cartItems")

        if (savedCartItems) {
            cartPageItems = JSON.parse(savedCartItems)
            console.log("Loaded cart items from localStorage:", cartPageItems)
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
        cartEmptyState.style.display = "flex"
        cartWithItems.style.display = "none"
    } else {
        // Show cart with items
        cartEmptyState.style.display = "none"
        cartWithItems.style.display = "block"

        // Render cart items with full API data
        await renderCartItemsWithAPI()

        // Calculate and update totals
        calculateCartTotals()
        updateOrderSummary()
    }
}

/**
 * Render cart items with full API data
 */
async function renderCartItemsWithAPI() {
    const cartProductsList = document.getElementById("cartProductsList")
    if (!cartProductsList) return

    // Show loading state
    cartProductsList.innerHTML =
        '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Mahsulotlar yuklanmoqda...</p></div>'

    try {
        // Fetch full product details for each cart item
        const enrichedCartItems = []

        for (const item of cartPageItems) {
            try {
                console.log(`Fetching product details for ID: ${item.id}`)

                // Fetch full product details from API
                const fullProduct = await window.API.fetchProductById(item.id)

                if (fullProduct) {
                    // Merge cart item data with full product data
                    const enrichedItem = {
                        ...fullProduct,
                        quantity: item.quantity,
                        size: item.size,
                        addedAt: item.addedAt,
                        cartItemId: `${item.id}_${item.size || "no-size"}`,
                    }
                    enrichedCartItems.push(enrichedItem)
                    console.log(`Successfully fetched product: ${fullProduct.name}`)
                } else {
                    console.warn(`Product not found for ID: ${item.id}`)
                    // Keep original item if API call fails
                    enrichedCartItems.push(item)
                }
            } catch (error) {
                console.error(`Error fetching product ${item.id}:`, error)
                // Keep original item if API call fails
                enrichedCartItems.push(item)
            }
        }

        // Update cartPageItems with enriched data
        cartPageItems = enrichedCartItems

        // Clear loading state
        cartProductsList.innerHTML = ""

        // Render each cart item
        enrichedCartItems.forEach((item, index) => {
            const cartItemElement = createCartItemElement(item, index)
            cartProductsList.appendChild(cartItemElement)
        })

        console.log("Cart items rendered successfully with API data")
    } catch (error) {
        console.error("Error rendering cart items with API:", error)
        cartProductsList.innerHTML = `
            <div class="text-center py-4 text-danger">
                <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                <p>Mahsulotlarni yuklashda xatolik yuz berdi</p>
                <button class="btn btn-primary" onclick="renderCartItemsWithAPI()">Qayta urinish</button>
            </div>
        `
    }
}

/**
 * Create cart item HTML element with full product data
 */
function createCartItemElement(item, index) {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-product-item"
    cartItem.setAttribute("data-item-id", item.id)
    cartItem.setAttribute("data-item-size", item.size || "")
    cartItem.setAttribute("data-index", index)

    // Check if item is out of stock
    const isOutOfStock = checkItemStock(item)
    if (isOutOfStock) {
        cartItem.classList.add("out-of-stock")
    }

    // Get image URL using API
    const imageUrl = getItemImageUrl(item)

    // Calculate pricing with discount using DiscountUtils
    const pricingInfo = calculateItemPricing(item)

    // Get size info with stock count
    const sizeInfo = getItemSizeInfo(item)

    cartItem.innerHTML = `
        <img src="${imageUrl}" alt="${item.name}" class="cart-product-image" onerror="this.src='/placeholder.svg?height=100&width=100&text=No+Image'">
        <div class="cart-product-details">
            <div class="cart-product-info">
                <h4 class="cart-product-name">${item.name}</h4>
                ${sizeInfo.html}
                ${item.categoryName ? `<div class="cart-product-category">Kategoriya: ${item.categoryName}</div>` : ""}
            </div>
            <div class="cart-product-pricing">
                <span class="cart-current-price">${formatPrice(pricingInfo.displayPrice)}</span>
                ${pricingInfo.hasDiscount ? `<span class="cart-original-price">${formatPrice(pricingInfo.originalPrice)}</span>` : ""}
            </div>
            <div class="cart-product-controls">
                <div class="cart-quantity-controls">
                    <button class="cart-quantity-btn" onclick="updateCartPageItemQuantity(${index}, -1)" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
                    <span class="cart-quantity-display">${item.quantity}</span>
                    <button class="cart-quantity-btn" onclick="updateCartPageItemQuantity(${index}, 1)" ${isOutOfStock ? "disabled" : ""}>+</button>
                </div>
                <div class="cart-item-total">${formatPrice(pricingInfo.displayPrice * item.quantity)}</div>
                <button class="cart-remove-btn" onclick="removeCartPageItem(${index})" title="Savatdan o'chirish">
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
 * Get item image URL using API
 */
function getItemImageUrl(item) {
    // Use API to get image URL
    if (item.attachmentKeys && item.attachmentKeys.length > 0) {
        return window.API.getImageUrl(item.attachmentKeys[0])
    }

    // Fallback to item.image if available
    if (item.image) {
        return item.image
    }

    // Default placeholder
    return "/placeholder.svg?height=100&width=100&text=No+Image"
}

/**
 * Calculate item pricing with discounts using DiscountUtils
 */
function calculateItemPricing(item) {
    if (typeof window.DiscountUtils !== "undefined") {
        return window.DiscountUtils.calculateDiscount(item)
    }

    // Fallback calculation
    const discountPercent = item.discount || 0
    const hasDiscount = item.status === "SALE" && discountPercent > 0
    const originalPrice = item.price
    const discountedPrice = hasDiscount ? Math.round(originalPrice * (1 - discountPercent / 100)) : originalPrice

    return {
        hasDiscount,
        discountedPrice,
        originalPrice,
        displayPrice: discountedPrice,
        discountPercent,
    }
}

/**
 * Get item size information with stock count
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

    const stockText = stockCount !== null ? ` (<span class="stock-count">${stockCount} ta mavjud</span>)` : ""

    return {
        html: `<div class="cart-product-size">O'lcham: <strong>${item.size}</strong>${stockText}</div>`,
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
async function updateCartPageItemQuantity(itemIndex, change) {
    if (isLoading) return

    if (itemIndex < 0 || itemIndex >= cartPageItems.length) {
        console.error("Invalid item index:", itemIndex)
        return
    }

    const item = cartPageItems[itemIndex]
    const newQuantity = item.quantity + change

    if (newQuantity <= 0) {
        removeCartPageItem(itemIndex)
        return
    }

    // Check stock availability
    if (change > 0) {
        const sizeInfo = getItemSizeInfo(item)
        if (sizeInfo.stockCount !== null && newQuantity > sizeInfo.stockCount) {
            showNotification("Omborda yetarli mahsulot yo'q!", "warning")
            return
        }
    }

    // Update quantity
    item.quantity = newQuantity

    // Update localStorage
    saveCartToStorage()

    // Re-render cart
    await renderCartPage()

    // Update cart badge
    updateCartBadge()

    showNotification("Miqdor yangilandi", "success")
}

/**
 * Remove item from cart
 */
async function removeCartPageItem(itemIndex) {
    if (isLoading) return

    if (itemIndex < 0 || itemIndex >= cartPageItems.length) {
        console.error("Invalid item index:", itemIndex)
        return
    }

    const removedItem = cartPageItems[itemIndex]
    cartPageItems.splice(itemIndex, 1)

    // Update localStorage
    saveCartToStorage()

    // Re-render cart
    await renderCartPage()

    // Update cart badge
    updateCartBadge()

    showNotification(`${removedItem.name} savatdan o'chirildi`, "info")
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage() {
    try {
        // Save only essential cart data (not full product details)
        const cartDataToSave = cartPageItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            size: item.size,
            addedAt: item.addedAt,
            // Keep basic info for fallback
            name: item.name,
            price: item.price,
            image: item.image || (item.attachmentKeys ? window.API.getImageUrl(item.attachmentKeys[0]) : null),
        }))

        localStorage.setItem("cartItems", JSON.stringify(cartDataToSave))

        const totalCount = cartPageItems.reduce((total, item) => total + item.quantity, 0)
        localStorage.setItem("cartCount", totalCount.toString())

        // Update global cart variables if they exist
        if (typeof window.cartItems !== "undefined") {
            window.cartItems = cartDataToSave
            window.cartCount = totalCount
        }

        console.log("Cart saved to localStorage successfully")
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

    // Cart icon click - navigate to cart page
    const cartIcon = document.getElementById("cartIcon")
    if (cartIcon) {
        cartIcon.addEventListener("click", (e) => {
            e.preventDefault()
            // Already on cart page, just scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" })
        })
    }
}

/**
 * Handle checkout process
 */
async function handleCheckout() {
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

    showLoading(true)

    try {
        console.log("Processing checkout...")
        console.log("Cart items:", cartPageItems)
        console.log("Total amount:", formatPrice(cartPageTotal))

        // Simulate API call for checkout
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Show success message
        showNotification(`Buyurtma qabul qilindi! Jami: ${formatPrice(cartPageTotal)}`, "success")

        // Here you would typically:
        // 1. Send order to backend
        // 2. Process payment
        // 3. Clear cart
        // 4. Redirect to success page

        // For now, simulate success
        setTimeout(async () => {
            // Clear cart
            cartPageItems = []
            saveCartToStorage()
            await renderCartPage()
            updateCartBadge()

            showNotification("Buyurtma muvaffaqiyatli yuborildi!", "success")
        }, 1000)
    } catch (error) {
        console.error("Checkout error:", error)
        showNotification("Buyurtma berishda xatolik yuz berdi", "error")
    } finally {
        showLoading(false)
    }
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
    if (typeof window.API !== "undefined" && window.API.showNotification) {
        window.API.showNotification(message, type)
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
        border-radius: 12px;
        z-index: 9999;
        font-weight: 600;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-family: "Montserrat", sans-serif;
    `
    notification.textContent = message
    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
        notification.style.transform = "translateX(0)"
    }, 100)

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = "translateX(100%)"
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification)
            }
        }, 300)
    }, 4000)
}

/**
 * Show error state
 */
function showErrorState(message = "Savatni yuklashda muammo bo'ldi") {
    const cartEmptyState = document.getElementById("cartEmptyState")
    const cartWithItems = document.getElementById("cartWithItems")

    if (cartEmptyState) {
        cartEmptyState.innerHTML = `
            <div class="empty-cart-content">
                <div class="empty-cart-icon" style="color: #dc3545;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2 class="empty-cart-title" style="color: #dc3545;">Xatolik yuz berdi</h2>
                <p style="color: #666; margin-bottom: 30px; font-size: 1.1rem;">${message}</p>
                <button class="empty-cart-btn" onclick="location.reload()" style="background: #dc3545;">Qayta yuklash</button>
            </div>
        `
        cartEmptyState.style.display = "flex"
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
    renderCartItemsWithAPI,
    updateCartPageItemQuantity,
    removeCartPageItem,
    handleCheckout,
    showLoading,
    showErrorState,
}

// Export for debugging
window.cartPageDebug = {
    cartPageItems,
    cartPageTotal,
    cartPageSubtotal,
    cartPageDiscount,
    isLoading,
}
