// ======================================================
// CART PAGE FUNCTIONALITY - IMPROVED WITH FULL API INTEGRATION
// ======================================================

// Global variables (now managed by cart-add-logic.js, but referenced here)
let isLoading = false // This remains local to cart-page.js

// Initialize cart page when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    // Wait for API and other dependencies to be available
    if (typeof window.API === "undefined") {
        console.error("API not loaded")
        showErrorState("API yuklanmadi. Sahifani qayta yuklang.")
        return
    }
    // Ensure cart-add-logic functions are available
    if (typeof window.loadCartPageItems === "undefined" || typeof window.saveCartToStorage === "undefined") {
        console.error("Cart add logic not loaded. Please ensure cart-add-logic.js is loaded before cart-page.js.")
        showErrorState("Savat funksiyalari yuklanmadi. Sahifani qayta yuklang.")
        return
    }

    // Load existing functionality from script.js
    const initializeMobileScrollEffects = window.initializeMobileScrollEffects
    const initializeDesktopScrollEffects = window.initializeDesktopScrollEffects
    const initializeMobileSidebar = window.initializeMobileSidebar
    const initializeMobileBottomNav = window.initializeMobileBottomNav

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

        // Load cart items from localStorage (now from cart-add-logic.js)
        window.loadCartPageItems()

        // Render cart page with API data
        await renderCartPage()

        // Initialize event listeners
        initializeCartPageEvents()

        // Update cart badge (now from cart-add-logic.js)
        window.updateCartBadge()

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
 * Render cart page based on cart state
 */
async function renderCartPage() {
    const cartEmptyState = document.getElementById("cartEmptyState")
    const cartWithItems = document.getElementById("cartWithItems")

    if (!window.cartPageItems || window.cartPageItems.length === 0) {
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

    cartProductsList.innerHTML =
        '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Mahsulotlar yuklanmoqda...</p></div>'

    try {
        const enrichedCartItems = []
        for (const item of window.cartPageItems) {
            try {
                const fullProduct = await window.API.fetchProductById(item.id)
                if (fullProduct) {
                    const enrichedItem = {
                        ...fullProduct,
                        quantity: item.quantity,
                        size: item.size,
                        addedAt: item.addedAt,
                        cartItemId: `${item.id}_${item.size || "no-size"}`,
                    }
                    enrichedCartItems.push(enrichedItem)
                } else {
                    enrichedCartItems.push(item) // Keep original if not found
                }
            } catch (error) {
                console.error(`Error fetching product ${item.id}:`, error)
                enrichedCartItems.push(item) // Keep original if API call fails
            }
        }

        // Update global cartPageItems with enriched data
        window.cartPageItems = enrichedCartItems

        cartProductsList.innerHTML = ""
        enrichedCartItems.forEach((item, index) => {
            const cartItemElement = createCartItemElement(item, index)
            cartProductsList.appendChild(cartItemElement)
        })
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

    // Check if item is out of stock (using global function)
    const isOutOfStock = window.checkItemStock(item)
    if (isOutOfStock) {
        cartItem.classList.add("out-of-stock")
    }

    // Get image URL using API
    const imageUrl = getItemImageUrl(item)

    // Calculate pricing with discount using DiscountUtils
    const pricingInfo = calculateItemPricing(item)

    // Get size info with stock count (using global function)
    const sizeInfo = window.getItemSizeInfo(item)

    cartItem.innerHTML = `
        <img src="${imageUrl}" alt="${item.name}" class="cart-product-image" onerror="this.src='/placeholder.svg?height=100&width=100&text=No+Image'">
        <div class="cart-product-details">
            <div class="cart-product-info">
                <h4 class="cart-product-name">${item.name}</h4>
                ${sizeInfo.html}
                ${item.categoryName ? `<div class="cart-product-category">Kategoriya: ${item.categoryName}</div>` : ""}
            </div>
            <div class="cart-product-pricing">
                <span class="cart-current-price">${window.formatPrice(pricingInfo.displayPrice)}</span>
                ${pricingInfo.hasDiscount ? `<span class="cart-original-price">${window.formatPrice(pricingInfo.originalPrice)}</span>` : ""}
            </div>
            <div class="cart-product-controls">
                <div class="cart-quantity-controls">
                    <button class="cart-quantity-btn" onclick="window.updateCartPageItemQuantity(${index}, -1)" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
                    <span class="cart-quantity-display">${item.quantity}</span>
                    <button class="cart-quantity-btn" onclick="window.updateCartPageItemQuantity(${index}, 1)" ${isOutOfStock ? "disabled" : ""}>+</button>
                </div>
                <div class="cart-item-total">${window.formatPrice(pricingInfo.displayPrice * item.quantity)}</div>
                <button class="cart-remove-btn" onclick="window.removeCartPageItem(${index})" title="Savatdan o'chirish">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `

    return cartItem
}

/**
 * Get item image URL using API
 */
function getItemImageUrl(item) {
    if (item.attachmentKeys && item.attachmentKeys.length > 0) {
        return window.API.getImageUrl(item.attachmentKeys[0])
    }
    if (item.image) {
        return item.image
    }
    return "/placeholder.svg?height=100&width=100&text=No+Image"
}

/**
 * Calculate item pricing with discounts using DiscountUtils
 */
function calculateItemPricing(item) {
    if (typeof window.DiscountUtils !== "undefined") {
        return window.DiscountUtils.calculateDiscount(item)
    }
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
 * Calculate cart totals
 */
function calculateCartTotals() {
    window.cartPageSubtotal = 0
    window.cartPageDiscount = 0

    window.cartPageItems.forEach((item) => {
        const pricingInfo = calculateItemPricing(item)
        const itemSubtotal = pricingInfo.originalPrice * item.quantity
        const itemTotal = pricingInfo.displayPrice * item.quantity

        window.cartPageSubtotal += itemSubtotal
        window.cartPageDiscount += itemSubtotal - itemTotal
    })

    window.cartPageTotal = window.cartPageSubtotal - window.cartPageDiscount
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
        orderSubtotal.textContent = window.formatPrice(window.cartPageSubtotal)
    }
    if (orderDiscount) {
        orderDiscount.textContent =
            window.cartPageDiscount > 0 ? `-${window.formatPrice(window.cartPageDiscount)}` : "-0 So'm"
    }
    if (orderTotal) {
        orderTotal.textContent = window.formatPrice(window.cartPageTotal)
    }
    if (orderCheckoutBtn) {
        orderCheckoutBtn.disabled = window.cartPageItems.length === 0
    }
}

/**
 * Update cart item quantity (now globally exposed from cart-add-logic.js)
 */
// window.updateCartPageItemQuantity is now defined in cart-add-logic.js

/**
 * Remove item from cart (now globally exposed from cart-add-logic.js)
 */
// window.removeCartPageItem is now defined in cart-add-logic.js

/**
 * Initialize cart page event listeners
 */
function initializeCartPageEvents() {
    const emptyCartBtn = document.getElementById("emptyCartBtn")
    if (emptyCartBtn) {
        emptyCartBtn.addEventListener("click", () => {
            window.location.href = "/index.html"
        })
    }

    const orderCheckoutBtn = document.getElementById("orderCheckoutBtn")
    if (orderCheckoutBtn) {
        orderCheckoutBtn.addEventListener("click", handleCheckout)
    }

    const cartIcon = document.getElementById("cartIcon")
    if (cartIcon) {
        cartIcon.addEventListener("click", (e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
        })
    }
}

/**
 * Handle checkout process
 */
async function handleCheckout() {
    if (window.cartPageItems.length === 0) {
        window.showNotification("Savat bo'sh!", "warning")
        return
    }

    const outOfStockItems = window.cartPageItems.filter((item) => window.checkItemStock(item))
    if (outOfStockItems.length > 0) {
        window.showNotification("Ba'zi mahsulotlar omborda mavjud emas!", "warning")
        return
    }

    showLoading(true)
    try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        window.showNotification(`Buyurtma qabul qilindi! Jami: ${window.formatPrice(window.cartPageTotal)}`, "success")

        setTimeout(async () => {
            window.cartPageItems = [] // Clear cart
            window.saveCartToStorage()
            await renderCartPage()
            window.updateCartBadge()
            window.showNotification("Buyurtma muvaffaqiyatli yuborildi!", "success")
        }, 1000)
    } catch (error) {
        console.error("Checkout error:", error)
        window.showNotification("Buyurtma berishda xatolik yuz berdi", "error")
    } finally {
        showLoading(false)
    }
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

// Make functions globally available for external access (e.g., debugging)
window.CartPageAPI = {
    initializeCartPage,
    renderCartPage,
    renderCartItemsWithAPI,
    handleCheckout,
    showLoading,
    showErrorState,
}

// Export for debugging
window.cartPageDebug = {
    // cartPageItems, // Now global from cart-add-logic.js
    // cartPageTotal, // These will be updated by cart-page.js logic
    // cartPageSubtotal,
    // cartPageDiscount,
    isLoading,
}
