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
    const mobileCartIcon = document.getElementById("mobileCartIcon") // Assuming this exists on mobile
    const cartClose = document.getElementById("cartClose")
    const cartViewBtn = document.getElementById("cartViewBtn")
    const cartCheckoutBtn = document.getElementById("cartCheckoutBtn")

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
            cartModal.innerHTML = `<div class="cart-modal-content"><div class="cart-header"><h3 class="cart-title">Savat</h3><button class="cart-close" id="cartClose">&times;</button></div><div class="cart-body"><p class="text-center text-danger">Savat yuklashda xatolik yuz berdi.</p></div></div>`
        }
    }

    // Re-get elements after HTML is loaded
    const updatedCartClose = document.getElementById("cartClose")
    const updatedCartViewBtn = document.getElementById("cartViewBtn")
    const updatedCartCheckoutBtn = document.getElementById("cartCheckoutBtn")

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
        window.location.href = "/assets/pages/desktop/cart.html" // Navigate to cart page
    })

    // Cart Checkout Button functionality
    // Make the event listener function async
    updatedCartCheckoutBtn?.addEventListener("click", async () => {
        if (window.cartItems.length === 0) {
            window.API.showNotification("Savat bo'sh!", "warning")
            return
        }

        const outOfStockItems = window.cartItems.filter((item) => window.checkItemStock(item))
        if (outOfStockItems.length > 0) {
            window.API.showNotification("Ba'zi mahsulotlar omborda mavjud emas!", "warning")
            return
        }

        window.API.showLoading(true) // Show loading for modal checkout

        try {
            // Construct the CreateOrderReq object
            const userId = 777777777 // Placeholder: Replace with actual user ID from authentication context
            const orderItems = window.cartItems.map((item) => ({
                productId: item.id,
                productSizeId: 4, // Assuming item.size is the productSizeId (a number) or null
                quantity: item.quantity,
            }))

            const createOrderRequest = {
                userId: userId,
                orderItems: orderItems,
            }

            console.log("Sending order request from modal:", createOrderRequest)

            const response = await fetch("/api/v1/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add any necessary authorization headers here
                },
                body: JSON.stringify(createOrderRequest),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Buyurtma berishda xatolik yuz berdi.")
            }

            // Order successful
            const modalCartTotal = window.cartItems.reduce((total, item) => {
                // For simplicity, using item.price directly as in original modal logic
                return total + item.price * item.quantity
            }, 0)
            window.API.showNotification(
                `Buyurtma muvaffaqiyatli yuborildi! Jami: ${window.API.formatPrice(modalCartTotal)}`,
                "success",
            )

            // Clear cart and update UI
            setTimeout(() => {
                window.cartItems = [] // Clear cart
                window.cartCount = 0
                window.saveCartToStorage()
                window.updateCartBadge()
                window.renderCartModalItems() // Re-render modal to show empty state
                cartModal?.classList.remove("show")
                document.body.style.overflow = "auto"
                window.API.showNotification("Savat tozalandi va buyurtma yuborildi!", "info")
            }, 1000)
        } catch (error) {
            console.error("Modal checkout error:", error)
            window.API.showNotification(error.message || "Buyurtma berishda kutilmagan xatolik yuz berdi", "error")
        } finally {
            window.API.showLoading(false)
        }
    })

    console.log("Cart modal initialized with buttons")
}

// Make initializeCartModal globally available
window.initializeCartModal = initializeCartModal
