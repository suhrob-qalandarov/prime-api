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
            // Mobile header logic
            if (scrollTop > 100) {
                if (scrollTop > lastScrollTop) {
                    // Scrolling down - hide header
                    mobileHeader?.classList.remove("scrolled-up")
                } else {
                    // Scrolling up - show header with red background
                    mobileHeader?.classList.add("scrolled-up")
                }
            } else {
                // At top - transparent header
                mobileHeader?.classList.remove("scrolled-up")
            }
        } else {
            // Desktop header logic
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
    let isFirstLoad = true

    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop

        if (window.innerWidth <= 768) {
            if (isFirstLoad && scrollTop > 50) {
                isFirstLoad = false
            }

            if (scrollTop > 100) {
                if (scrollTop > lastScrollTop) {
                    // Scrolling down - hide header
                    mobileHeader?.classList.add("scrolled-down")
                    mobileHeader?.classList.remove("scrolled-up")
                } else {
                    // Scrolling up - show header with red background
                    mobileHeader?.classList.remove("scrolled-down")
                    mobileHeader?.classList.add("scrolled-up")
                }
            } else {
                // At top - show transparent header only on first load
                if (isFirstLoad) {
                    mobileHeader?.classList.remove("scrolled-down", "scrolled-up")
                } else {
                    mobileHeader?.classList.add("scrolled-down")
                }
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
// CART FUNCTIONALITY
// ======================================================
let cartItems = []
let cartCount = 0
let cartTotal = 0

// Sample product data
const productData = {
    cap: {
        name: "Kepka",
        currentPrice: 129000,
        originalPrice: 160000,
        images: ["/images/polo-cap.png"],
        category: "AKSESSUARLAR",
        description: "Yuqori sifatli kepka, zamonaviy dizayn bilan.",
        sizes: ["S", "M", "L", "XL"],
    },
    shopper: {
        name: "Shopper",
        currentPrice: 109000,
        originalPrice: 150000,
        images: ["/images/shopper.png"],
        category: "AKSESSUARLAR",
        description: "Keng va qulay shopper sumka.",
        sizes: [],
    },
    watch: {
        name: "Soat",
        currentPrice: 299000,
        originalPrice: 399000,
        images: ["/images/watch-2.png", "/images/polo-watch.png"],
        category: "AKSESSUARLAR",
        description: "Premium sifatli qo'l soati.",
        sizes: [],
    },
    wallet: {
        name: "Hamyon",
        currentPrice: 89000,
        originalPrice: 120000,
        images: ["/images/polo-wallet.png"],
        category: "AKSESSUARLAR",
        description: "Zamonaviy va funksional hamyon.",
        sizes: [],
    },
    shoes: {
        name: "Krossovka",
        currentPrice: 399000,
        originalPrice: 499000,
        images: ["/images/polo-sneakers.png"],
        category: "AKSESSUARLAR",
        description: "Sport va kundalik kiyish uchun krossovka.",
        sizes: ["39", "40", "41", "42", "43", "44"],
    },
    tshirt: {
        name: "T-shirt",
        currentPrice: 199000,
        originalPrice: 249000,
        images: ["/images/bmw-t-shirt.jpg", "/images/hero-badge.jpg"],
        category: "AKSESSUARLAR",
        description: "Yumshoq va qulay t-shirt.",
        sizes: ["S", "M", "L", "XL", "XXL"],
    },
}

function formatPrice(price) {
    return new Intl.NumberFormat("uz-UZ").format(price) + " So'm"
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
        const product = productData[item.productId]
        return total + (product ? product.currentPrice * item.quantity : 0)
    }, 0)

    const cartTotalPrice = document.getElementById("cartTotalPrice")
    if (cartTotalPrice) {
        cartTotalPrice.textContent = formatPrice(cartTotal)
    }

    const cartCheckoutBtn = document.getElementById("cartCheckoutBtn")
    if (cartCheckoutBtn) {
        cartCheckoutBtn.disabled = cartItems.length === 0
    }
}

function renderCartItems() {
    const cartEmpty = document.getElementById("cartEmpty")
    const cartItemsContainer = document.getElementById("cartItems")
    const cartFooter = document.getElementById("cartFooter")

    if (cartItems.length === 0) {
        cartEmpty.style.display = "block"
        cartItemsContainer.style.display = "none"
        cartFooter.style.display = "none"
    } else {
        cartEmpty.style.display = "none"
        cartItemsContainer.style.display = "block"
        cartFooter.style.display = "block"

        cartItemsContainer.innerHTML = ""

        cartItems.forEach((item, index) => {
            const product = productData[item.productId]
            if (!product) return

            const cartItem = document.createElement("div")
            cartItem.className = "cart-item"
            cartItem.innerHTML = `
        <img src="${product.images[0]}" alt="${product.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${product.name}</h4>
          ${item.size ? `<div class="cart-item-size">O'lcham: ${item.size}</div>` : ""}
          <div class="cart-item-price">${formatPrice(product.currentPrice)}</div>
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

function addToCart(productId, quantity = 1, size = null) {
    const existingItemIndex = cartItems.findIndex((item) => item.productId === productId && item.size === size)

    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity
    } else {
        cartItems.push({
            productId: productId,
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
    background: ${type === "success" ? "#4CAF50" : "#2196F3"};
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
// CART MODAL FUNCTIONALITY
// ======================================================
function initializeCartModal() {
    const cartModal = document.getElementById("cartModal")
    const cartIcon = document.getElementById("cartIcon")
    const mobileCartIcon = document.getElementById("mobileCartIcon")
    const cartClose = document.getElementById("cartClose")

    // Open cart modal
    cartIcon?.addEventListener("click", (e) => {
        e.preventDefault()
        cartModal?.classList.add("show")
        document.body.style.overflow = "hidden"
    })

    mobileCartIcon?.addEventListener("click", (e) => {
        e.preventDefault()
        cartModal?.classList.add("show")
        document.body.style.overflow = "hidden"
    })

    // Close cart modal
    cartClose?.addEventListener("click", () => {
        cartModal?.classList.remove("show")
        document.body.style.overflow = "auto"
    })

    // Close on outside click
    cartModal?.addEventListener("click", (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove("show")
            document.body.style.overflow = "auto"
        }
    })
}

// ======================================================
// QUICK VIEW MODAL FUNCTIONALITY
// ======================================================
function initializeQuickViewModal() {
    const quickViewModal = document.getElementById("quickViewModal")
    const quickViewClose = document.getElementById("quickViewClose")
    const addToCartBtn = document.getElementById("addToCartBtn")
    const quantityInput = document.getElementById("quantityInput")
    const decreaseQty = document.getElementById("decreaseQty")
    const increaseQty = document.getElementById("increaseQty")

    let currentProductId = null
    let currentImageIndex = 0
    let selectedSize = null

    // Close quick view modal
    quickViewClose?.addEventListener("click", () => {
        quickViewModal?.classList.remove("show")
        document.body.style.overflow = "auto"
    })

    // Close on outside click
    quickViewModal?.addEventListener("click", (e) => {
        if (e.target === quickViewModal) {
            quickViewModal.classList.remove("show")
            document.body.style.overflow = "auto"
        }
    })

    // Quantity controls
    decreaseQty?.addEventListener("click", () => {
        const currentValue = Number.parseInt(quantityInput.value)
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1
        }
    })

    increaseQty?.addEventListener("click", () => {
        const currentValue = Number.parseInt(quantityInput.value)
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1
        }
    })

    // Add to cart from quick view
    addToCartBtn?.addEventListener("click", () => {
        if (currentProductId) {
            const quantity = Number.parseInt(quantityInput.value)
            addToCart(currentProductId, quantity, selectedSize)
            quickViewModal.classList.remove("show")
            document.body.style.overflow = "auto"
        }
    })

    // Open quick view modal
    window.openQuickView = (productId) => {
        const product = productData[productId]
        if (!product) return

        currentProductId = productId
        currentImageIndex = 0
        selectedSize = null

        // Populate modal content
        document.getElementById("quickViewTitle").textContent = product.name
        document.getElementById("quickViewCategory").textContent = product.category
        document.getElementById("quickViewCurrentPrice").textContent = formatPrice(product.currentPrice)
        document.getElementById("quickViewOriginalPrice").textContent = formatPrice(product.originalPrice)
        document.getElementById("quickViewDescription").textContent = product.description

        // Calculate discount
        const discount = Math.round((1 - product.currentPrice / product.originalPrice) * 100)
        document.getElementById("quickViewDiscount").textContent = `-${discount}%`

        // Set main image
        document.getElementById("quickViewMainImage").src = product.images[0]

        // Populate thumbnails
        const thumbnailsContainer = document.getElementById("quickViewThumbnails")
        thumbnailsContainer.innerHTML = ""
        product.images.forEach((image, index) => {
            const thumbnail = document.createElement("img")
            thumbnail.src = image
            thumbnail.className = `product-thumbnail-large ${index === 0 ? "active" : ""}`
            thumbnail.addEventListener("click", () => {
                document.getElementById("quickViewMainImage").src = image
                thumbnailsContainer.querySelectorAll(".product-thumbnail-large").forEach((t) => t.classList.remove("active"))
                thumbnail.classList.add("active")
                currentImageIndex = index
            })
            thumbnailsContainer.appendChild(thumbnail)
        })

        // Populate sizes
        const sizesContainer = document.getElementById("quickViewSizes")
        const sizeSelectionContainer = document.getElementById("sizeSelectionContainer")

        if (product.sizes && product.sizes.length > 0) {
            sizeSelectionContainer.style.display = "block"
            sizesContainer.innerHTML = ""
            product.sizes.forEach((size) => {
                const sizeOption = document.createElement("div")
                sizeOption.className = "size-option"
                sizeOption.textContent = size
                sizeOption.addEventListener("click", () => {
                    sizesContainer.querySelectorAll(".size-option").forEach((s) => s.classList.remove("selected"))
                    sizeOption.classList.add("selected")
                    selectedSize = size
                })
                sizesContainer.appendChild(sizeOption)
            })
        } else {
            sizeSelectionContainer.style.display = "none"
        }

        // Reset quantity
        quantityInput.value = 1

        // Show modal
        quickViewModal.classList.add("show")
        document.body.style.overflow = "hidden"
    }

    // Image navigation
    document.getElementById("imagePrev")?.addEventListener("click", () => {
        if (currentProductId && productData[currentProductId].images.length > 1) {
            currentImageIndex =
                currentImageIndex > 0 ? currentImageIndex - 1 : productData[currentProductId].images.length - 1
            document.getElementById("quickViewMainImage").src = productData[currentProductId].images[currentImageIndex]

            // Update active thumbnail
            const thumbnails = document.querySelectorAll(".product-thumbnail-large")
            thumbnails.forEach((t) => t.classList.remove("active"))
            thumbnails[currentImageIndex]?.classList.add("active")
        }
    })

    document.getElementById("imageNext")?.addEventListener("click", () => {
        if (currentProductId && productData[currentProductId].images.length > 1) {
            currentImageIndex =
                currentImageIndex < productData[currentProductId].images.length - 1 ? currentImageIndex + 1 : 0
            document.getElementById("quickViewMainImage").src = productData[currentProductId].images[currentImageIndex]

            // Update active thumbnail
            const thumbnails = document.querySelectorAll(".product-thumbnail-large")
            thumbnails.forEach((t) => t.classList.remove("active"))
            thumbnails[currentImageIndex]?.classList.add("active")
        }
    })
}

// ======================================================
// PRODUCT INTERACTIONS
// ======================================================
function initializeProductInteractions() {
    // Quick view triggers
    document.querySelectorAll(".quick-view-overlay, .mobile-quick-view-icon").forEach((element) => {
        element.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()
            const productCard = element.closest(".product-card")
            const productId = productCard?.getAttribute("data-product-id")
            if (productId) {
                window.openQuickView(productId)
            }
        })
    })

    // Product thumbnail hover effects (desktop only)
    if (window.innerWidth > 768) {
        document.querySelectorAll(".product-thumbnail").forEach((thumbnail) => {
            thumbnail.addEventListener("click", (e) => {
                e.preventDefault()
                const productCard = thumbnail.closest(".product-card")
                const productImage = productCard?.querySelector(".product-image")
                if (productImage) {
                    productImage.src = thumbnail.src
                }
            })
        })
    }
}

// ======================================================
// 3D HERO PRODUCT INTERACTIONS
// ======================================================
function initializeHeroProductInteractions() {
    const productItems = document.querySelectorAll(".product-item")

    productItems.forEach((item) => {
        item.addEventListener("click", () => {
            // Remove selected class from all items
            productItems.forEach((p) => p.classList.remove("selected"))
            // Add selected class to clicked item
            item.classList.add("selected")

            // Get product data
            const productType = item.getAttribute("data-product")
            if (productType && productData[productType]) {
                // You can add modal or other interactions here
                console.log("Selected product:", productType)
            }
        })
    })
}

// ======================================================
// LOAD CART FROM LOCALSTORAGE
// ======================================================
function loadCartFromStorage() {
    const savedCartItems = localStorage.getItem("cartItems")
    const savedCartCount = localStorage.getItem("cartCount")

    if (savedCartItems) {
        try {
            cartItems = JSON.parse(savedCartItems)
            cartCount = Number.parseInt(savedCartCount) || 0
            updateCartBadge()
            renderCartItems()
        } catch (error) {
            console.error("Error loading cart from storage:", error)
            cartItems = []
            cartCount = 0
        }
    }
}

// ======================================================
// INITIALIZE ALL FUNCTIONALITY
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    // Initialize all components
    initializeResponsiveHeaders()
    initializeMobileScrollEffects() // Updated function
    initializeMobileSidebar()
    initializeMobileBottomNav() // New function
    initializeCartModal()
    initializeQuickViewModal()
    initializeProductInteractions()
    initializeHeroProductInteractions()
    loadCartFromStorage()

    // Handle window resize
    window.addEventListener("resize", () => {
        // Reinitialize product interactions on resize
        setTimeout(() => {
            initializeProductInteractions()
        }, 100)
    })

    console.log("Prime77 website initialized successfully!")
})
