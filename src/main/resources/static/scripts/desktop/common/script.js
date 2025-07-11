// ======================================================
// RESPONSIVE HEADER FUNCTIONALITY
// ======================================================
function initializeResponsiveHeaders() {
    // Mobile header scroll effects
    const mobileHeader = document.querySelector(".mobile-header")
    // Desktop header scroll effects
    const mainHeader = document.getElementById("main-header")
    let lastScrollTop = 0

    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop

        if (window.innerWidth <= 768) {
            // Mobile header logic - simplified
            if (scrollTop > 100) {
                // Show red background when scrolled
                mobileHeader?.classList.add("scrolled-up")
            } else {
                // Show default background at top
                mobileHeader?.classList.remove("scrolled-up")
            }

            // Always keep header visible
            if (mobileHeader) {
                mobileHeader.style.transform = "translateY(0)"
                mobileHeader.style.opacity = "1"
                mobileHeader.style.display = "block"
            }
        } else {
            // Desktop header logic remains the same
            if (scrollTop > 100) {
                if (scrollTop > lastScrollTop) {
                    // Scrolling down
                    mainHeader?.classList.add("scrolled-down")
                    mainHeader?.classList.remove("scrolled-up")
                } else {
                    // Scrolling up
                    mainHeader?.classList.remove("scrolled-down")
                    mainHeader?.classList.add("scrolled-up")
                }
            } else {
                // At top
                mainHeader?.classList.remove("scrolled-down", "scrolled-up")
            }
        }

        lastScrollTop = scrollTop
    })
}

// ======================================================
// MOBILE HEADER SCROLL FUNCTIONALITY - UPDATED
// ======================================================
function initializeMobileScrollEffects() {
    const mobileHeader = document.querySelector(".mobile-header")
    let lastScrollTop = 0

    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop

        if (window.innerWidth <= 768) {
            if (scrollTop > 100) {
                // When scrolled down more than 100px, show red background
                mobileHeader?.classList.add("scrolled-up")
                mobileHeader?.classList.remove("scrolled-down")
            } else {
                // At top - show default background (#f0f0f0)
                mobileHeader?.classList.remove("scrolled-up")
                mobileHeader?.classList.remove("scrolled-down")
            }

            // Header should always be visible - never hide it
            if (mobileHeader) {
                mobileHeader.style.transform = "translateY(0)"
                mobileHeader.style.opacity = "1"
            }
        }

        lastScrollTop = scrollTop
    })
}

// ======================================================
// MOBILE SIDEBAR FUNCTIONALITY
// ======================================================
function initializeMobileSidebar() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const mobileSidebar = document.getElementById("mobileSidebar")
    const mobileSidebarClose = document.getElementById("mobileSidebarClose")
    const mobileSidebarOverlay = document.getElementById("mobileSidebarOverlay")

    // Open sidebar
    mobileMenuBtn?.addEventListener("click", () => {
        mobileSidebar?.classList.add("show")
        document.body.style.overflow = "hidden"
    })

    // Close sidebar
    mobileSidebarClose?.addEventListener("click", () => {
        mobileSidebar?.classList.remove("show")
        document.body.style.overflow = "auto"
    })

    // Close on overlay click
    mobileSidebarOverlay?.addEventListener("click", () => {
        mobileSidebar?.classList.remove("show")
        document.body.style.overflow = "auto"
    })

    // Close on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileSidebar?.classList.contains("show")) {
            mobileSidebar.classList.remove("show")
            document.body.style.overflow = "auto"
        }
    })
}

// ======================================================
// MOBILE BOTTOM NAVIGATION FUNCTIONALITY
// ======================================================
function initializeMobileBottomNav() {
    const categoriesBtn = document.getElementById("categoriesBtn")
    const mobileBottomCartBtn = document.getElementById("mobileBottomCartBtn")
    const searchBtn = document.getElementById("searchBtn")
    const bottomNavCartBadge = document.getElementById("bottomNavCartBadge")

    // Categories button
    categoriesBtn?.addEventListener("click", () => {
        // Toggle active state
        document.querySelectorAll(".bottom-nav-item").forEach((item) => item.classList.remove("active"))
        categoriesBtn.classList.add("active")

        // You can add categories modal or navigation here
        console.log("Categories clicked")
    })

    // Cart button
    mobileBottomCartBtn?.addEventListener("click", () => {
        document.querySelectorAll(".bottom-nav-item").forEach((item) => item.classList.remove("active"))
        mobileBottomCartBtn.classList.add("active")

        // Open cart modal
        const cartModal = document.getElementById("cartModal")
        cartModal?.classList.add("show")
        document.body.style.overflow = "hidden"
    })

    // Search button
    searchBtn?.addEventListener("click", () => {
        document.querySelectorAll(".bottom-nav-item").forEach((item) => item.classList.remove("active"))
        searchBtn.classList.add("active")

        // You can add search modal or functionality here
        console.log("Search clicked")
    })

    // Update bottom nav cart badge
    window.updateBottomNavCartBadge = () => {
        if (bottomNavCartBadge) {
            bottomNavCartBadge.textContent = cartCount
            if (cartCount > 0) {
                bottomNavCartBadge.classList.add("show")
            } else {
                bottomNavCartBadge.classList.remove("show")
            }
        }
    }
}

// ======================================================
// MOBILE BRAND CAROUSEL FUNCTIONALITY - FIXED
// ======================================================
function initializeMobileBrandCarousel() {
    const brandTrack = document.getElementById("mobileBrandTrack")
    const brandCarousel = document.querySelector(".mobile-brand-carousel")

    if (!brandTrack || !brandCarousel) {
        console.log("Brand carousel elements not found")
        return
    }

    // Force restart animation
    brandTrack.style.animation = "none"
    brandTrack.offsetHeight // Trigger reflow
    brandTrack.style.animation = "brandCarousel 20s linear infinite"

    // Pause animation on touch/hover
    brandCarousel.addEventListener("touchstart", () => {
        brandTrack.style.animationPlayState = "paused"
    })

    brandCarousel.addEventListener("touchend", () => {
        brandTrack.style.animationPlayState = "running"
    })

    brandCarousel.addEventListener("mouseenter", () => {
        brandTrack.style.animationPlayState = "paused"
    })

    brandCarousel.addEventListener("mouseleave", () => {
        brandTrack.style.animationPlayState = "running"
    })

    console.log("Mobile brand carousel initialized successfully")
}

// ======================================================
// CATEGORY LOADING FUNCTIONALITY
// ======================================================
async function loadCategories() {
    const categoriesContainer = document.getElementById("categoriesContainer")
    const categoryLoading = document.getElementById("categoryLoading")
    const categoryError = document.getElementById("categoryError")

    try {
        // Loading holatini ko'rsatish
        categoryLoading.style.display = "block"
        categoryError.style.display = "none"
        categoriesContainer.style.display = "none"

        console.log("Loading spotlight categories from API...")

        // API dan spotlight kategoriyalarni olish
        const spotlights = await window.API.fetchSpotlightCategories()

        // Loading holatini yashirish
        categoryLoading.style.display = "none"

        if (!spotlights || spotlights.length === 0) {
            throw new Error("Spotlight kategoriyalar topilmadi")
        }

        // Mavjud kontentni tozalash
        categoriesContainer.innerHTML = ""

        // Spotlight kategoriyalarni render qilish
        spotlights.forEach((spotlight, index) => {
            const categoryCard = createSpotlightCard(spotlight, index)
            categoriesContainer.appendChild(categoryCard)
        })

        // Kategoriyalar konteynerini ko'rsatish
        categoriesContainer.style.display = "flex"

        console.log(`Successfully loaded ${spotlights.length} spotlight categories`)
    } catch (error) {
        console.error("Error loading spotlight categories:", error)

        // Loading holatini yashirish
        categoryLoading.style.display = "none"

        // Error holatini ko'rsatish
        categoryError.style.display = "block"

        // Update error message
        const errorMessage = categoryError.querySelector("p")
        if (errorMessage) {
            errorMessage.textContent = "Backend serverga ulanib bo'lmadi. Server ishlab turganini tekshiring."
        }
    }
}

// Spotlight card yaratish funksiyasini qo'shing:
function createSpotlightCard(spotlight, index) {
    const colDiv = document.createElement("div")
    colDiv.className = "col-lg-3 col-md-6 col-6"

    const categoryCard = document.createElement("div")
    categoryCard.className = "category-card"
    categoryCard.setAttribute("data-spotlight-id", spotlight.id)

    // imageKey dan rasm URL olish - API dan
    const imageUrl = spotlight.imageKey ? window.API.getImageUrl(spotlight.imageKey) : "/images/default/category.jpeg"

    categoryCard.innerHTML = `
        <img src="${imageUrl}" alt="${spotlight.name}" class="category-img" loading="lazy">
        <div class="category-overlay">
            <h3 class="category-title">${spotlight.name.toUpperCase()}</h3>
        </div>
    `

    // Click event listener qo'shish
    categoryCard.addEventListener("click", () => {
        handleSpotlightClick(spotlight)
    })

    // Rasm yuklashda xatolik bo'lsa fallback rasm
    const img = categoryCard.querySelector(".category-img")
    img.onerror = function () {
        console.log("Spotlight image failed to load:", imageUrl)
        this.src = "/images/default/category.jpeg"
    }

    colDiv.appendChild(categoryCard)
    return colDiv
}

// Spotlight click handler funksiyasini qo'shing:
function handleSpotlightClick(spotlight) {
    console.log("Spotlight clicked:", spotlight)

    // Bu yerda navigation logic qo'shishingiz mumkin
    // Masalan: window.location.href = `/spotlight/${spotlight.id}`

    // API notification ko'rsatish
    if (window.API && window.API.showSuccessNotification) {
        window.API.showSuccessNotification(`${spotlight.name} spotlight tanlandi`)
    }
}

// ======================================================
// CART FUNCTIONALITY - TEST MAHSULOTLARSIZ
// ======================================================
let cartItems = []
let cartCount = 0
let cartTotal = 0

function formatPrice(price) {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
}

function updateCartBadge() {
    const cartBadge = document.getElementById("cartBadge")
    const mobileCartBadge = document.getElementById("mobileCartBadge")

    if (cartBadge) {
        cartBadge.textContent = cartCount
        cartBadge.style.display = cartCount > 0 ? "flex" : "none"
    }

    if (mobileCartBadge) {
        mobileCartBadge.textContent = cartCount
        mobileCartBadge.style.display = cartCount > 0 ? "flex" : "none"
    }

    // Update bottom nav badge
    if (window.updateBottomNavCartBadge) {
        window.updateBottomNavCartBadge()
    }
}

function updateCartTotal() {
    cartTotal = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity
    }, 0)

    const cartTotalPrice = document.getElementById("cartTotalPrice")
    if (cartTotalPrice) {
        cartTotalPrice.textContent = formatPrice(cartTotal)
    }

    const cartCheckoutBtn = document.getElementById("cartCheckoutBtn")
    if (cartCheckoutBtn) {
        cartCheckoutBtn.disabled = cartItems.length === 0
    }

    // Footer ni har doim ko'rsatish
    const cartFooter = document.getElementById("cartFooter")
    if (cartFooter) {
        cartFooter.style.display = "block"
    }
}

function renderCartItems() {
    const cartEmpty = document.getElementById("cartEmpty")
    const cartItemsContainer = document.getElementById("cartItems")
    const cartFooter = document.getElementById("cartFooter")

    console.log("Rendering cart items, count:", cartItems.length)

    if (cartItems.length === 0) {
        cartEmpty.style.display = "block"
        cartItemsContainer.style.display = "none"
        // Footer ni har doim ko'rsatish, lekin tugmalarni disable qilish
        cartFooter.style.display = "block"
        console.log("Cart is empty, showing footer with disabled buttons")
    } else {
        cartEmpty.style.display = "none"
        cartItemsContainer.style.display = "block"
        cartFooter.style.display = "block"

        console.log("Cart has items, showing footer with enabled buttons")

        cartItemsContainer.innerHTML = ""

        cartItems.forEach((item, index) => {
            const cartItem = document.createElement("div")
            cartItem.className = "cart-item"
            cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          ${item.size ? `<div class="cart-item-size">O'lcham: ${item.size}</div>` : ""}
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-controls">
            <button class="cart-quantity-btn" onclick="updateCartItemQuantity(${index}, -1)">-</button>
            <span class="cart-quantity">${item.quantity}</span>
            <button class="cart-quantity-btn" onclick="updateCartItemQuantity(${index}, 1)">+</button>
            <button class="cart-remove-btn" onclick="removeCartItem(${index})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `
            cartItemsContainer.appendChild(cartItem)
        })
    }

    updateCartTotal()
}

function addToCart(productData, quantity = 1, size = null) {
    const existingItemIndex = cartItems.findIndex((item) => item.id === productData.id && item.size === size)

    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity
    } else {
        cartItems.push({
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            quantity: quantity,
            size: size,
            addedAt: new Date(),
        })
    }

    cartCount += quantity
    updateCartBadge()
    renderCartItems()

    // Save to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
    localStorage.setItem("cartCount", cartCount.toString())

    // Show success notification
    showNotification("Mahsulot savatga qo'shildi!", "success")
}

function updateCartItemQuantity(index, change) {
    if (index < 0 || index >= cartItems.length) return

    const item = cartItems[index]
    const newQuantity = item.quantity + change

    if (newQuantity <= 0) {
        removeCartItem(index)
    } else {
        cartCount += change
        item.quantity = newQuantity
        updateCartBadge()
        renderCartItems()

        // Save to localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
        localStorage.setItem("cartCount", cartCount.toString())
    }
}

function removeCartItem(index) {
    if (index < 0 || index >= cartItems.length) return

    const item = cartItems[index]
    cartCount -= item.quantity
    cartItems.splice(index, 1)

    updateCartBadge()
    renderCartItems()

    // Save to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
    localStorage.setItem("cartCount", cartCount.toString())
}

function showNotification(message, type = "info") {
    // Simple notification system
    const notification = document.createElement("div")
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#4CAF50" : type === "warning" ? "#ff9800" : "#2196F3"};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 9999;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease;
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
            document.body.removeChild(notification)
        }, 300)
    }, 3000)
}

// ======================================================
// CART MODAL FUNCTIONALITY - UPDATED
// ======================================================
function initializeCartModal() {
    const cartModal = document.getElementById("cartModal")
    const cartIcon = document.getElementById("cartIcon")
    const mobileCartIcon = document.getElementById("mobileCartIcon")
    const cartClose = document.getElementById("cartClose")
    const cartViewBtn = document.getElementById("cartViewBtn")
    const cartCheckoutBtn = document.getElementById("cartCheckoutBtn")

    // Open cart modal
    cartIcon?.addEventListener("click", (e) => {
        e.preventDefault()
        cartModal?.classList.add("show")
        document.body.style.overflow = "hidden"
        window.renderCartModalItems(); // Render items when modal opens
        console.log("Desktop cart opened")
    })

    mobileCartIcon?.addEventListener("click", (e) => {
        e.preventDefault()
        cartModal?.classList.add("show")
        document.body.style.overflow = "hidden"
        window.renderCartModalItems(); // Render items when modal opens
        console.log("Mobile cart opened")
    })

    // Close cart modal
    cartClose?.addEventListener("click", () => {
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
    cartViewBtn?.addEventListener("click", () => {
        console.log("Savat ko'rish tugmasi bosildi")
        window.API.showNotification("Savat sahifasiga o'tish", "info")
        // Close cart modal
        cartModal?.classList.remove("show")
        document.body.style.overflow = "auto"
        window.location.href = "/assets/pages/desktop/cart.html"; // Navigate to cart page
    })

    // Cart Checkout Button functionality
    cartCheckoutBtn?.addEventListener("click", () => {
        if (window.cartItems.length === 0) {
            window.API.showNotification("Savat bo'sh!", "warning")
            return
        }

        // Calculate total for modal checkout
        const modalCartTotal = window.cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        console.log("Buyurtma berish tugmasi bosildi")
        console.log("Cart items:", window.cartItems)
        console.log("Total:", window.API.formatPrice(modalCartTotal))

        window.API.showNotification(`Buyurtma: ${window.API.formatPrice(modalCartTotal)} - Tasdiqlash...`, "success")

        // Simulate checkout process and clear cart
        setTimeout(() => {
            window.cartItems = []; // Clear cart
            window.cartCount = 0;
            window.saveCartToStorage();
            window.updateCartBadge();
            window.renderCartModalItems(); // Re-render modal to show empty state
            cartModal?.classList.remove("show")
            document.body.style.overflow = "auto"
            window.API.showNotification("Buyurtma muvaffaqiyatli yuborildi!", "success");
        }, 2000)
    })

    console.log("Cart modal initialized with buttons")
}

// ======================================================
// LOAD CART FROM LOCALSTORAGE
// ======================================================
function loadCartFromStorageAndRender() {
    window.loadCartFromStorage(); // Use the global function
    window.renderCartModalItems(); // Render modal items on load
}

// ======================================================
// INITIALIZE ALL FUNCTIONALITY
// ======================================================

// Declare all necessary functions before using them
function initializeResponsiveHeaders() {}
function initializeMobileScrollEffects() {}
function initializeMobileSidebar() {}
function initializeMobileBottomNav() {}
function initializeMobileBrandCarousel() {}
function initializeMessageButtons() {}
function loadCategories() {}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all components
    initializeResponsiveHeaders()
    initializeMobileScrollEffects()
    initializeMobileSidebar()
    initializeMobileBottomNav()
    initializeMobileBrandCarousel()
    initializeCartModal()
    initializeMessageButtons()
    loadCartFromStorageAndRender() // Call the new wrapper function

    // Load categories from API
    loadCategories()

    // Handle window resize
    window.addEventListener("resize", () => {
        // Reinitialize components on resize
        setTimeout(() => {
            initializeMobileBrandCarousel()
        }, 100)
    })

    console.log("Prime77 website initialized successfully!")
})

// Make loadCategories globally available for retry button
window.loadCategories = loadCategories

// Remove these global exports as they are now in cart-add-logic.js
// window.addToCart = addToCart
// window.updateCartItemQuantity = updateCartItemQuantity
// window.removeCartItem = removeCartItem
