import axios from "axios"

class FeaturedProducts {
    constructor() {
        this.currentTab = "new"
        this.products = {
            new: [],
            hot: [],
            sale: [],
        }
        this.carouselPositions = {
            new: 0,
            hot: 0,
            sale: 0,
        }
        this.cardWidth = 300 // 280px + 20px gap
        this.visibleCards = 4
        this.API_BASE_URL = "https://prime77.uz"
        this.isLoading = false

        console.log("FeaturedProducts constructor called")
        this.init()
    }

    async init() {
        try {
            console.log("Initializing Featured Products...")

            // Initialize UI components first
            this.initializeTabs()
            this.initializeCarousels()

            // Show loading state
            this.showLoading()

            // Load products from API
            await this.loadFeaturedProducts()

            // Show first tab
            this.showTab("new")

            console.log("Featured Products initialized successfully!")
        } catch (error) {
            console.error("Error initializing featured products:", error)
            this.showError()
        }
    }

    async loadFeaturedProducts() {
        try {
            this.isLoading = true
            console.log("Loading featured products from API...")

            // Check if axios is available
            if (typeof axios === "undefined") {
                throw new Error("Axios library not loaded")
            }

            const response = await axios.get(`${this.API_BASE_URL}/api/v1/products/featured`, {
                timeout: 10000, // 10 second timeout
                headers: {
                    "Content-Type": "application/json",
                },
            })

            console.log("Featured products API response:", response.data)

            if (!response.data) {
                throw new Error("No data received from API")
            }

            // Extract products from API response
            const newProducts = response.data.newStatusProducts || []
            const hotProducts = response.data.hotStatusProducts || []
            const saleProducts = response.data.saleStatusProducts || []

            this.products = {
                new: newProducts,
                hot: hotProducts,
                sale: saleProducts,
            }

            console.log("Featured products loaded successfully:", {
                new: this.products.new.length,
                hot: this.products.hot.length,
                sale: this.products.sale.length,
            })

            this.isLoading = false
            this.hideLoading()
        } catch (error) {
            console.error("Error loading featured products from API:", error)
            this.isLoading = false
            this.hideLoading()

            // Set empty products
            this.products = {
                new: [],
                hot: [],
                sale: [],
            }

            throw error
        }
    }

    initializeTabs() {
        console.log("Initializing tabs...")
        const tabs = document.querySelectorAll(".featured-tab")
        console.log("Found tabs:", tabs.length)

        tabs.forEach((tab, index) => {
            console.log(`Tab ${index}:`, tab.getAttribute("data-tab"))

            tab.addEventListener("click", (e) => {
                e.preventDefault()
                const tabType = tab.getAttribute("data-tab")
                console.log("Tab clicked:", tabType)
                this.showTab(tabType)
            })
        })
    }

    initializeCarousels() {
        console.log("Initializing carousels...")
        ;["new", "hot", "sale"].forEach((type) => {
            const prevBtn = document.querySelector(`#${type}-products .featured-nav-prev`)
            const nextBtn = document.querySelector(`#${type}-products .featured-nav-next`)

            console.log(`Carousel ${type}:`, { prevBtn: !!prevBtn, nextBtn: !!nextBtn })

            if (prevBtn && nextBtn) {
                prevBtn.addEventListener("click", (e) => {
                    e.preventDefault()
                    console.log(`Navigate ${type} carousel: prev`)
                    this.navigateCarousel(type, "prev")
                })

                nextBtn.addEventListener("click", (e) => {
                    e.preventDefault()
                    console.log(`Navigate ${type} carousel: next`)
                    this.navigateCarousel(type, "next")
                })
            }
        })

        this.updateNavigationStates()
    }

    showTab(tabType) {
        console.log("Showing tab:", tabType)

        // Update active tab
        document.querySelectorAll(".featured-tab").forEach((tab) => {
            tab.classList.remove("active")
        })

        const activeTab = document.querySelector(`[data-tab="${tabType}"]`)
        if (activeTab) {
            activeTab.classList.add("active")
            console.log("Active tab set:", tabType)
        } else {
            console.error("Active tab not found:", tabType)
        }

        // Update active content
        document.querySelectorAll(".featured-content").forEach((content) => {
            content.classList.remove("active")
            content.style.display = "none"
        })

        const activeContent = document.getElementById(`${tabType}-products`)
        if (activeContent) {
            activeContent.classList.add("active")
            activeContent.style.display = "block"
            console.log("Active content set:", tabType)
        } else {
            console.error("Active content not found:", `${tabType}-products`)
        }

        this.currentTab = tabType

        // Render products for this tab
        if (!this.isLoading) {
            this.renderProducts(tabType)
            this.updateNavigationStates()
        }
    }

    renderProducts(type) {
        console.log(`Rendering products for type: ${type}`)

        const container = document.querySelector(`#${type}-products-grid`)
        if (!container) {
            console.error(`Container not found for type: ${type}`)
            return
        }

        const products = this.products[type] || []
        console.log(`Products to render for ${type}:`, products.length)

        if (products.length === 0) {
            container.innerHTML = `
                <div class="featured-no-products" style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-box-open" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                    <h3 style="font-size: 24px; margin-bottom: 10px;">Mahsulotlar mavjud emas</h3>
                    <p style="font-size: 16px; color: #888;">Hozirda ushbu kategoriyada mahsulotlar yo'q. Keyinroq qayta urinib ko'ring!</p>
                </div>
            `
            return
        }

        container.innerHTML = ""

        products.forEach((product, index) => {
            console.log(`Creating card for product ${index + 1}:`, product.name)
            try {
                const productCard = this.createProductCard(product)
                container.appendChild(productCard)
            } catch (error) {
                console.error(`Error creating product card for ${product.name}:`, error)
            }
        })

        // Reset carousel position
        this.carouselPositions[type] = 0
        this.updateCarouselPosition(type)

        console.log(`Rendered ${products.length} products for ${type}`)
    }

    createProductCard(product) {
        const card = document.createElement("div")
        card.className = "featured-product-card"
        card.setAttribute("data-product-id", product.id)

        // Get main image URL
        let mainImageUrl = "/placeholder.svg?height=200&width=200&text=No+Image"

        if (product.attachmentKeys && product.attachmentKeys.length > 0) {
            if (window.API && window.API.getImageUrl) {
                mainImageUrl = window.API.getImageUrl(product.attachmentKeys[0])
            } else {
                mainImageUrl = `${this.API_BASE_URL}/api/v1/attachment/${product.attachmentKeys[0]}`
            }
        }

        // Calculate discount
        const discountPercent = product.discount || 0
        const hasDiscount = product.status === "SALE" && discountPercent > 0
        const originalPrice = product.price
        const discountedPrice = hasDiscount ? Math.round(originalPrice * (1 - discountPercent / 100)) : originalPrice

        // Status badge
        const statusConfig = this.getStatusConfig(product.status)
        const statusBadge = statusConfig
            ? `<div class="featured-status-badge ${statusConfig.class}">${statusConfig.text}</div>`
            : ""

        // Discount banner for SALE items
        const discountBanner = hasDiscount
            ? `<div class="featured-discount-banner">
                <div class="featured-discount-text" data-text="🔥 CHEGIRMA ${discountPercent}% 🔥   "></div>
            </div>`
            : ""

        card.innerHTML = `
            <div class="featured-product-image-container">
                ${discountBanner}
                ${statusBadge}
                <img src="${mainImageUrl}" alt="${product.name}" class="featured-product-image" onerror="this.src='/placeholder.svg?height=200&width=200&text=No+Image'">
                <button class="featured-quick-view-btn" onclick="window.openProductQuickView(${product.id})">Quick View</button>
            </div>
            <div class="featured-product-info">
                <div class="featured-product-category">${product.categoryName?.toUpperCase() || "MAHSULOT"}</div>
                <h3 class="featured-product-name">${product.name}</h3>
                <div class="featured-product-pricing">
                    <span class="featured-current-price">${this.formatPrice(hasDiscount ? discountedPrice : originalPrice)}</span>
                    ${
            hasDiscount
                ? `
                        <span class="featured-original-price">${this.formatPrice(originalPrice)}</span>
                        <span class="featured-discount-badge">-${discountPercent}%</span>
                    `
                : ""
        }
                </div>
            </div>
        `

        // Add click handler for the card
        card.addEventListener("click", (e) => {
            if (!e.target.classList.contains("featured-quick-view-btn")) {
                console.log("Product card clicked:", product.id)
                this.openProductQuickView(product.id)
            }
        })

        return card
    }

    getStatusConfig(status) {
        const configs = {
            NEW: { class: "new", text: "YANGI" },
            HOT: { class: "hot", text: "MASHHUR" },
            SALE: { class: "sale", text: "CHEGIRMA" },
        }
        return configs[status] || null
    }

    navigateCarousel(type, direction) {
        const products = this.products[type] || []
        const maxPosition = Math.max(0, products.length - this.visibleCards)

        console.log(`Navigate ${type} ${direction}, current: ${this.carouselPositions[type]}, max: ${maxPosition}`)

        if (direction === "prev") {
            this.carouselPositions[type] = Math.max(0, this.carouselPositions[type] - 1)
        } else {
            this.carouselPositions[type] = Math.min(maxPosition, this.carouselPositions[type] + 1)
        }

        this.updateCarouselPosition(type)
        this.updateNavigationStates()
    }

    updateCarouselPosition(type) {
        const track = document.querySelector(`#${type}-products-grid`)
        if (track) {
            const translateX = -this.carouselPositions[type] * this.cardWidth
            track.style.transform = `translateX(${translateX}px)`
            console.log(`Updated ${type} carousel position: ${translateX}px`)
        }
    }

    updateNavigationStates() {
        ;["new", "hot", "sale"].forEach((type) => {
            const products = this.products[type] || []
            const maxPosition = Math.max(0, products.length - this.visibleCards)
            const currentPosition = this.carouselPositions[type]

            const prevBtn = document.querySelector(`#${type}-products .featured-nav-prev`)
            const nextBtn = document.querySelector(`#${type}-products .featured-nav-next`)

            if (prevBtn) {
                prevBtn.disabled = currentPosition <= 0
                prevBtn.style.opacity = currentPosition <= 0 ? "0.3" : "1"
            }

            if (nextBtn) {
                const shouldDisable = currentPosition >= maxPosition || products.length <= this.visibleCards
                nextBtn.disabled = shouldDisable
                nextBtn.style.opacity = shouldDisable ? "0.3" : "1"
            }
        })
    }

    showLoading() {
        const containers = document.querySelectorAll('[id$="-products-grid"]')
        containers.forEach((container) => {
            container.innerHTML = `
                <div class="featured-loading" style="text-align: center; padding: 40px; color: #666;">
                    <div class="featured-loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <p style="font-size: 18px;">Mahsulotlar yuklanmoqda...</p>
                </div>
            `
        })
    }

    hideLoading() {
        // Loading will be hidden when products are rendered
    }

    showError() {
        const containers = document.querySelectorAll('[id$="-products-grid"]')
        containers.forEach((container) => {
            container.innerHTML = `
                <div class="featured-error" style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff6b6b; margin-bottom: 20px;"></i>
                    <h3 style="font-size: 24px; margin-bottom: 10px;">Xatolik yuz berdi</h3>
                    <p style="font-size: 16px; color: #888;">Mahsulotlarni yuklashda muammo bo'ldi. Iltimos, keyinroq qayta urinib ko'ring.</p>
                    <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: var(--burgundy-color); color: white; border: none; border-radius: 5px; cursor: pointer;">Qayta urinish</button>
                </div>
            `
        })
    }

    formatPrice(price) {
        if (window.API && window.API.formatPrice) {
            return window.API.formatPrice(price)
        }
        return new Intl.NumberFormat("uz-UZ").format(price) + " So'm"
    }

    openProductQuickView(productId) {
        console.log("Opening quick view for product:", productId)
        if (window.openProductQuickView) {
            window.openProductQuickView(productId)
        } else {
            console.log("Quick view function not available")
        }
    }

    updateVisibleCards() {
        const width = window.innerWidth
        if (width <= 480) {
            this.visibleCards = 1
        } else if (width <= 768) {
            this.visibleCards = 2
        } else if (width <= 1024) {
            this.visibleCards = 3
        } else {
            this.visibleCards = 4
        }

        this.updateNavigationStates()
    }

    // Public method to refresh products
    async refresh() {
        console.log("Refreshing featured products...")
        this.showLoading()
        try {
            await this.loadFeaturedProducts()
            this.renderProducts(this.currentTab)
            this.updateNavigationStates()
        } catch (error) {
            this.showError()
        }
    }
}

// Initialize Featured Products when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing Featured Products...")

    // Check if required elements exist
    const featuredSection = document.querySelector(".featured-products-section")
    const featuredTabs = document.querySelectorAll(".featured-tab")

    console.log("Featured section found:", !!featuredSection)
    console.log("Featured tabs found:", featuredTabs.length)

    if (!featuredSection) {
        console.error("Featured products section not found in DOM!")
        return
    }

    if (featuredTabs.length === 0) {
        console.error("Featured tabs not found in DOM!")
        return
    }

    // Check if axios is loaded
    if (typeof axios === "undefined") {
        console.error("Axios library not loaded! Please include axios in your HTML.")
        return
    }

    try {
        console.log("Creating FeaturedProducts instance...")
        window.featuredProducts = new FeaturedProducts()
        console.log("FeaturedProducts instance created successfully")
    } catch (error) {
        console.error("Error creating FeaturedProducts instance:", error)
    }
})

// Handle window resize
window.addEventListener("resize", () => {
    if (window.featuredProducts) {
        window.featuredProducts.updateVisibleCards()
    }
})

// Global function for quick view
window.openProductQuickView =
    window.openProductQuickView ||
    ((productId) => {
        console.log("Opening quick view for product ID:", productId)
        if (window.openQuickView) {
            window.openQuickView(productId)
        }
    })

console.log("Featured Products script loaded successfully!")