// ======================================================
// FEATURED PRODUCTS FUNCTIONALITY - FIXED VERSION
// ======================================================

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

        this.init()
    }

    async init() {
        try {
            console.log("Initializing Featured Products...")
            await this.loadFeaturedProducts()
            this.initializeTabs()
            this.initializeCarousels()
            this.showTab("new")
            console.log("Featured Products initialized successfully!")
        } catch (error) {
            console.error("Error initializing featured products:", error)
            this.loadFallbackData()
            this.initializeTabs()
            this.initializeCarousels()
            this.showTab("new")
        }
    }

    async loadFeaturedProducts() {
        try {
            this.showLoading()
            console.log("Loading featured products from API...")

            // Use axios to fetch featured products
            const response = await axios.get(`${this.API_BASE_URL}/api/v1/products/featured`)

            console.log("Featured products API response:", response.data)

            if (!response.data) {
                throw new Error("No featured products data received")
            }

            // Map API response to our structure
            this.products = {
                new: response.data.saleStatusProducts || [],
                hot: response.data.newStatusProducts || [],
                sale: response.data.hotStatusProducts || [],
            }

            console.log("Featured products loaded successfully:", {
                new: this.products.new.length,
                hot: this.products.hot.length,
                sale: this.products.sale.length,
            })

            this.hideLoading()
        } catch (error) {
            console.error("Error loading featured products from API:", error)
            this.hideLoading()
            this.loadFallbackData()
        }
    }

    loadFallbackData() {
        console.log("Loading fallback featured products data...")

        // Create sample fallback data
        const sampleProduct = (id, name, status, price, discount = 0) => ({
            id: id,
            name: name,
            description: `${name} mahsuloti haqida ma'lumot`,
            price: price,
            discount: discount,
            status: status,
            categoryName: "KIYIM",
            attachmentKeys: ["sample-image.jpg"],
            productSizes: [
                { size: "M", amount: 5 },
                { size: "L", amount: 3 },
                { size: "XL", amount: 2 },
            ],
        })

        this.products = {
            new: [
                sampleProduct(1, "Yangi T-shirt", "NEW", 150000),
                sampleProduct(2, "Yangi Ko'ylak", "NEW", 200000),
                sampleProduct(3, "Yangi Shim", "NEW", 180000),
                sampleProduct(4, "Yangi Kurtka", "NEW", 350000),
                sampleProduct(5, "Yangi Polo", "NEW", 120000),
                sampleProduct(6, "Yangi Jins", "NEW", 250000),
            ],
            hot: [
                sampleProduct(7, "Mashhur Polo", "HOT", 120000),
                sampleProduct(8, "Mashhur Jins", "HOT", 250000),
                sampleProduct(9, "Mashhur Kepka", "HOT", 80000),
                sampleProduct(10, "Mashhur Krossovka", "HOT", 400000),
                sampleProduct(11, "Mashhur Ko'ylak", "HOT", 180000),
                sampleProduct(12, "Mashhur Shim", "HOT", 220000),
            ],
            sale: [
                sampleProduct(13, "Chegirmadagi Ko'ylak", "SALE", 200000, 25),
                sampleProduct(14, "Chegirmadagi Shim", "SALE", 180000, 30),
                sampleProduct(15, "Chegirmadagi Kurtka", "SALE", 350000, 20),
                sampleProduct(16, "Chegirmadagi Ayoqqabı", "SALE", 300000, 35),
                sampleProduct(17, "Chegirmadagi T-shirt", "SALE", 150000, 40),
                sampleProduct(18, "Chegirmadagi Jins", "SALE", 250000, 25),
            ],
        }

        console.log("Fallback products loaded:", this.products)
    }

    initializeTabs() {
        console.log("Initializing tabs...")
        const tabs = document.querySelectorAll(".featured-tab")

        tabs.forEach((tab) => {
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

        // Initialize navigation for each carousel
        ;["new", "hot", "sale"].forEach((type) => {
            const prevBtn = document.querySelector(`#${type}-products .featured-nav-prev`)
            const nextBtn = document.querySelector(`#${type}-products .featured-nav-next`)

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

        // Update navigation states
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
        }

        // Update active content
        document.querySelectorAll(".featured-content").forEach((content) => {
            content.classList.remove("active")
        })

        const activeContent = document.getElementById(`${tabType}-products`)
        if (activeContent) {
            activeContent.classList.add("active")
        }

        this.currentTab = tabType

        // Render products for this tab
        this.renderProducts(tabType)
        this.updateNavigationStates()
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
        <div class="featured-error">
          <i class="fas fa-box-open" style="font-size: 48px; color: #ddd; margin-bottom: 15px;"></i>
          <p>Bu kategoriyada mahsulotlar topilmadi</p>
        </div>
      `
            return
        }

        container.innerHTML = ""

        products.forEach((product, index) => {
            console.log(`Creating card for product ${index + 1}:`, product.name)
            const productCard = this.createProductCard(product)
            container.appendChild(productCard)
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

        // Get main image URL - use placeholder if no image
        let mainImageUrl = "/placeholder.svg?height=200&width=200&text=Product"

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
                <button class="featured-quick-view-btn" onclick="openProductQuickView(${product.id})">Quick View</button>
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

        // Add click handler for the card (excluding quick view button)
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
        ;["NEW", "HOT", "SALE"].forEach((type) => {
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
                <div class="featured-loading">
                    <div class="featured-loading-spinner"></div>
                    <p>Mahsulotlar yuklanmoqda...</p>
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
                <div class="featured-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Xatolik yuz berdi</h4>
                    <p>Mahsulotlarni yuklashda muammo bo'ldi</p>
                    <button class="btn-custom" onclick="location.reload()">Qayta urinish</button>
                </div>
            `
        })
    }

    // Format price function
    formatPrice(price) {
        if (window.API && window.API.formatPrice) {
            return window.API.formatPrice(price)
        }
        return new Intl.NumberFormat("uz-UZ").format(price) + " So'm"
    }

    // Open product quick view
    openProductQuickView(productId) {
        console.log("Opening quick view for product:", productId)
        if (window.openProductQuickView) {
            window.openProductQuickView(productId)
        } else {
            console.log("Quick view function not available")
        }
    }

    // Update visible cards based on screen size
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
}

// Initialize Featured Products when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing Featured Products...")

    // Wait a bit for other scripts to load
    setTimeout(() => {
        try {
            window.featuredProducts = new FeaturedProducts()
        } catch (error) {
            console.error("Error creating FeaturedProducts instance:", error)
        }
    }, 1000)
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
        // Implement quick view logic here or call existing function
        if (window.openQuickView) {
            window.openQuickView(productId)
        }
    })

console.log("Featured Products script loaded successfully!")
