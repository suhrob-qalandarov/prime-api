// ======================================================
// CART MODAL FUNCTIONALITY
// ======================================================

console.log("cart-modal.js yuklanmoqda...")

/**
 * Initialize cart modal functionality
 */
async function initializeCartModal() {
    const cartModal = document.getElementById("cartModal")
    const cartIcon = document.getElementById("cartIcon")
    const mobileCartIcon = document.getElementById("mobileBottomCartBtn") // Corrected ID for mobile cart icon
    let updatedCartClose,
        updatedCartViewBtn,
        updatedCartCheckoutBtn,
        updatedCartBody,
        updatedCartItemsContainer,
        updatedCartEmpty,
        updatedCartFooter,
        updatedCartTotalPrice

    // Load modal HTML from external file
    try {
        const response = await fetch("/assets/modals/desktop/cart-modal.html")
        const modalHTML = await response.text()
        if (cartModal) {
            cartModal.innerHTML = modalHTML
        }
    } catch (error) {
        console.error("Error loading cart modal HTML:", error)
        // Fallback to a simple message if HTML fails to load
        if (cartModal) {
            cartModal.innerHTML = `<div class="cart-modal-content"><div class="cart-header"><h3 class="cart-title">Savat</h3><button class="cart-close" id="cartClose"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg></button></div><div class="cart-body"><p class="text-center text-danger">Savat yuklashda xatolik yuz berdi.</p></div></div>`
        }
    }

    // Re-get elements after HTML is loaded
    updatedCartClose = document.getElementById("cartClose")
    updatedCartViewBtn = document.getElementById("cartViewBtn")
    updatedCartCheckoutBtn = document.getElementById("cartCheckoutBtn")
    updatedCartBody = document.getElementById("cartBody") // Get cartBody for rendering items
    updatedCartItemsContainer = document.getElementById("cartItems") // Get cartItems container
    updatedCartEmpty = document.getElementById("cartEmpty") // Get cartEmpty div
    updatedCartFooter = document.getElementById("cartFooter") // Get cartFooter div
    updatedCartTotalPrice = document.getElementById("cartTotalPrice") // Get total price span

    // Function to render cart items in the modal
    window.renderCartModalItems = async () => {
        if (!updatedCartItemsContainer || !updatedCartEmpty || !updatedCartFooter || !updatedCartTotalPrice) {
            console.error("Cart modal elements not found after loading HTML.")
            return
        }

        window.loadCartFromStorage() // Ensure cartItems is up-to-date

        if (!window.cartItems || window.cartItems.length === 0) {
            updatedCartEmpty.style.display = "block"
            updatedCartItemsContainer.innerHTML = ""
            updatedCartFooter.style.display = "none"
            updatedCartTotalPrice.textContent = window.API.formatPrice(0)
        } else {
            updatedCartEmpty.style.display = "none"
            updatedCartFooter.style.display = "block"
            updatedCartItemsContainer.innerHTML = "" // Clear previous items

            let totalCartPrice = 0

            // Iterate directly over window.cartItems as it now contains full product data
            window.cartItems.forEach((item, index) => {
                const pricingInfo = window.DiscountUtils.calculateDiscount(item)
                const itemTotalPrice = pricingInfo.displayPrice * item.quantity
                totalCartPrice += itemTotalPrice

                const cartItemElement = document.createElement("div")
                cartItemElement.className = "cart-item"
                cartItemElement.setAttribute("data-item-id", item.id)
                cartItemElement.setAttribute("data-item-size", item.size || "")
                cartItemElement.setAttribute("data-index", index)

                const imageUrl =
                    window.API.getImageUrl(item.attachmentKeys?.[0]) ||
                    item.image ||
                    "/placeholder.svg?height=100&width=100&text=No+Image"
                const sizeInfo = window.getItemSizeInfo(item)

                cartItemElement.innerHTML = `
          <img src="${imageUrl}" alt="${item.name}" class="cart-item-image" onerror="this.src='/placeholder.svg?height=60&width=60&text=No+Image'">
          <div class="cart-item-details">
              <h4 class="cart-item-name">${item.name}</h4>
              ${sizeInfo.html}
              <div class="cart-item-pricing">
                  <span class="cart-current-price">${window.API.formatPrice(pricingInfo.displayPrice)}</span>
                  ${pricingInfo.hasDiscount ? `<span class="cart-original-price">${window.API.formatPrice(pricingInfo.originalPrice)}</span>` : ""}
              </div>
          </div>
          <div class="cart-item-quantity-and-remove">
              <span class="cart-quantity-display">${item.quantity}</span>
              <button class="cart-remove-btn" onclick="window.removeCartItem(${index})" title="Savatdan o'chirish">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
              </button>
          </div>
        `
                updatedCartItemsContainer.appendChild(cartItemElement)
            })
            updatedCartTotalPrice.textContent = window.API.formatPrice(totalCartPrice)
        }
        // Update checkout button state
        if (updatedCartCheckoutBtn) {
            updatedCartCheckoutBtn.disabled =
                !window.cartItems ||
                window.cartItems.length === 0 ||
                window.cartItems.some((item) => window.checkItemStock(item))
        }
    }

    // Open cart modal (desktop icon)
    cartIcon?.addEventListener("click", (e) => {
        e.preventDefault()
        cartModal?.classList.add("show")
        document.body.style.overflow = "hidden"
        window.renderCartModalItems() // Render items when modal opens
        console.log("Desktop cart opened")
    })

    // Open cart modal (mobile icon, if exists)
    mobileCartIcon?.addEventListener("click", (e) => {
        e.preventDefault()
        cartModal?.classList.add("show")
        document.body.style.overflow = "hidden"
        window.renderCartModalItems() // Render items when modal opens
        console.log("Mobile cart opened")
    })

    // Close cart modal
    updatedCartClose?.addEventListener("click", () => {
        cartModal?.classList.remove("show")
        document.body.style.overflow = "auto"
        console.log("Cart closed")
    })

    // Close on outside click
    cartModal?.addEventListener("click", (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove("show")
            document.body.style.overflow = "auto"
        }
    })

    // Cart View Button functionality
    updatedCartViewBtn?.addEventListener("click", () => {
        console.log("Savat ko'rish tugmasi bosildi")
        window.API.showNotification("Savat sahifasiga o'tish", "info")
        // Close cart modal
        cartModal?.classList.remove("show")
        document.body.style.overflow = "auto"
        window.location.href = "/cart.html" // Navigate to cart page
    })

    // Cart Checkout Button functionality
    updatedCartCheckoutBtn?.addEventListener("click", () => {
        if (window.cartItems.length === 0) {
            window.API.showNotification("Savat bo'sh!", "warning")
            return
        }

        const outOfStockItems = window.cartItems.filter((item) => window.checkItemStock(item))
        if (outOfStockItems.length > 0) {
            window.API.showNotification("Ba'zi mahsulotlar omborda mavjud emas!", "warning")
            return
        }

        // Calculate total for modal checkout
        const modalCartTotal = window.cartItems.reduce((total, item) => {
            const pricingInfo = window.DiscountUtils.calculateDiscount(item)
            return total + pricingInfo.displayPrice * item.quantity
        }, 0)

        console.log("Buyurtma berish tugmasi bosildi")
        console.log("Cart items:", window.cartItems)
        console.log("Total:", window.API.formatPrice(modalCartTotal))

        window.API.showNotification(`Buyurtma: ${window.API.formatPrice(modalCartTotal)} - Tasdiqlash...`, "success")

        // Simulate checkout process and clear cart
        setTimeout(() => {
            window.cartItems = [] // Clear cart
            window.cartCount = 0
            window.saveCartToStorage()
            window.renderCartModalItems() // Re-render modal to show empty state
            cartModal?.classList.remove("show")
            document.body.style.overflow = "auto"
            window.API.showNotification("Buyurtma muvaffaqiyatli yuborildi!", "success")
        }, 2000)
    })

    console.log("Cart modal initialized with buttons")
}

// Make initializeCartModal globally available
window.initializeCartModal = initializeCartModal

// Expose renderCartModalItems globally for cart-add-logic.js to call after updates
// This is already handled by the previous response, but ensuring it's here.
// window.renderCartModalItems is defined inside initializeCartModal, so it will be available after init.
