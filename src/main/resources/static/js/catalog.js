// ======================================================
// CATALOG PAGE SPECIFIC FUNCTIONALITY
// ======================================================

// Global variables
let spotlights = []
let products = []
let currentCategoryId = "all"
let currentSpotlightId = null
let selectedSpotlightId = null

// ======================================================
// RENDER FUNCTIONS
// ======================================================

/**
 * Render spotlight navigation buttons
 */
function renderSpotlightCategories() {
    const spotlightContainer = document.getElementById("spotlightCategories")
    if (!spotlightContainer) return

    // Create simple navigation with buttons
    const navigationHtml = `
        <div class="spotlight-navigation">
            ${spotlights
        .map(
            (spotlight) => `
                <button class="spotlight-btn ${selectedSpotlightId === spotlight.id ? "active" : ""}" 
                        data-spotlight-id="${spotlight.id}">
                    ${spotlight.name}
                </button>
            `,
        )
        .join("")}
        </div>
    `

    spotlightContainer.innerHTML = navigationHtml

    // Add event listeners
    initializeSpotlightEvents()
}

/**
 * Render sidebar categories
 */
function renderSidebarCategories() {
    const sidebarCategories = document.getElementById("sidebarCategories")
    if (!sidebarCategories) return

    let categoriesToShow = []

    if (currentCategoryId === "all") {
        // Show all categories from all spotlights
        spotlights.forEach((spotlight) => {
            categoriesToShow = categoriesToShow.concat(spotlight.categories)
        })
    } else if (selectedSpotlightId) {
        // Show categories from selected spotlight
        const selectedSpotlight = spotlights.find((s) => s.id === selectedSpotlightId)
        if (selectedSpotlight) {
            categoriesToShow = selectedSpotlight.categories
        }
    }

    // Remove duplicates if showing all categories
    if (currentCategoryId === "all") {
        const uniqueCategories = categoriesToShow.filter(
            (category, index, self) => index === self.findIndex((c) => c.id === category.id),
        )
        categoriesToShow = uniqueCategories
    }

    const categoriesHtml = categoriesToShow
        .map(
            (category) => `
            <button class="sidebar-category-item ${currentCategoryId === category.id ? "active" : ""}" 
                    data-category-id="${category.id}" 
                    data-spotlight-id="${selectedSpotlightId || ""}">
                ${category.name}
            </button>
        `,
        )
        .join("")

    sidebarCategories.innerHTML = categoriesHtml

    // Add event listeners to category items
    sidebarCategories.querySelectorAll(".sidebar-category-item").forEach((item) => {
        item.addEventListener("click", async () => {
            const categoryId = Number.parseInt(item.getAttribute("data-category-id"))
            const spotlightId = item.getAttribute("data-spotlight-id")
            const categoryName = item.textContent.trim()

            await handleCategorySelection(categoryId, spotlightId ? Number.parseInt(spotlightId) : null, categoryName)

            // Update active states
            sidebarCategories.querySelectorAll(".sidebar-category-item").forEach((btn) => {
                btn.classList.remove("active")
            })
            item.classList.add("active")

            // Remove active from "Barcha mahsulotlar" button
            const barchasiBtn = document.getElementById("barchasiSidebarBtn")
            if (barchasiBtn) {
                barchasiBtn.classList.remove("active")
            }
        })
    })
}

/**
 * Render products
 */
function renderProducts(productsData) {
    const productsGrid = document.getElementById("productsGrid")
    const noProducts = document.getElementById("noProducts")

    if (!productsData || productsData.length === 0) {
        if (productsGrid) productsGrid.style.display = "none"
        if (noProducts) noProducts.style.display = "block"
        return
    }

    if (productsGrid) productsGrid.style.display = "grid"
    if (noProducts) noProducts.style.display = "none"
    if (productsGrid) productsGrid.innerHTML = ""

    productsData.forEach((product) => {
        const productCard = createProductCard(product)
        if (productsGrid) productsGrid.appendChild(productCard)
    })
}

/**
 * Create product card HTML - Original design
 */
function createProductCard(product) {
    const productCard = document.createElement("div")
    productCard.className = "catalog-product-card"
    productCard.setAttribute("data-product-id", product.id)
    productCard.setAttribute("data-category", product.categoryName)

    // Get main image URL
    const mainImageUrl = window.API.getImageUrl(product.attachmentIds?.[0])

    // Get status configuration
    const statusConfig = window.API.getStatusConfig(product.status)
    const statusBadge = statusConfig
        ? `<div class="product-status-badge ${statusConfig.class}" style="background: ${statusConfig.color};">
            ${statusConfig.text}
        </div>`
        : ""

    // Calculate discount
    const discountPercent = product.discount || 0
    const hasDiscount = product.status === "SALE" && discountPercent > 0

    // Calculate original price if there's a discount
    const originalPrice = hasDiscount ? product.price / (1 - discountPercent / 100) : product.price

    // Get available sizes
    const availableSizes = product.productSizes?.filter((size) => size.amount > 0) || []

    // Show category name only when "Barcha mahsulotlar" is selected
    const showCategoryName = currentCategoryId === "all"

    productCard.innerHTML = `
        <div class="catalog-product-image-container">
            ${
        hasDiscount
            ? `
                <div class="catalog-discount-banner">
                    <div class="catalog-discount-text" data-text="🔥 QAYNOQ CHEGIRMA ${discountPercent}% 🔥   "></div>
                </div>
            `
            : ""
    }
            ${statusBadge}
            <img src="${mainImageUrl}" alt="${product.name}" class="catalog-product-image">
            <button class="catalog-quick-view-btn" onclick="openProductQuickView(${product.id})">
                Quick View
            </button>
            <button class="catalog-mobile-quick-view-icon" onclick="openProductQuickView(${product.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                </svg>
            </button>
        </div>
        <div class="catalog-product-info">
            ${showCategoryName ? `<div class="catalog-product-category">${product.categoryName.toUpperCase()}</div>` : ""}
            <h3 class="catalog-product-name">${product.name}</h3>
            <div class="catalog-product-pricing">
                <span class="catalog-current-price">${window.API.formatPrice(product.price)}</span>
                ${
        hasDiscount
            ? `
                    <span class="catalog-original-price">${window.API.formatPrice(originalPrice)}</span>
                    <span class="catalog-discount-badge">-${discountPercent}%</span>
                `
            : ""
    }
            </div>
            ${
        availableSizes.length > 0
            ? `
                <div class="catalog-product-sizes">
                    <small>Mavjud o'lchamlar: ${availableSizes.map((s) => s.size).join(", ")}</small>
                </div>
            `
            : ""
    }
        </div>
    `

    return productCard
}

// ======================================================
// EVENT HANDLERS
// ======================================================

/**
 * Initialize spotlight events
 */
function initializeSpotlightEvents() {
    // Spotlight buttons
    document.querySelectorAll(".spotlight-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const spotlightId = Number.parseInt(button.getAttribute("data-spotlight-id"))
            selectSpotlight(spotlightId, button)
        })
    })

    // "Barcha mahsulotlar" sidebar button
    const barchasiSidebarBtn = document.getElementById("barchasiSidebarBtn")
    barchasiSidebarBtn?.addEventListener("click", async () => {
        await handleCategorySelection("all", null, "Barcha mahsulotlar")

        // Update active states
        document.querySelectorAll(".spotlight-btn").forEach((btn) => {
            btn.classList.remove("active")
        })
        barchasiSidebarBtn.classList.add("active")

        // Remove active from sidebar categories
        document.querySelectorAll(".sidebar-category-item").forEach((item) => {
            item.classList.remove("active")
        })

        selectedSpotlightId = null
        renderSidebarCategories()
    })
}

/**
 * Select spotlight and update sidebar
 */
function selectSpotlight(spotlightId, buttonElement) {
    selectedSpotlightId = spotlightId

    // Update active states for spotlight buttons
    document.querySelectorAll(".spotlight-btn").forEach((btn) => {
        btn.classList.remove("active")
    })
    buttonElement.classList.add("active")

    // Remove active from "Barcha mahsulotlar" button
    const barchasiBtn = document.getElementById("barchasiSidebarBtn")
    if (barchasiBtn) {
        barchasiBtn.classList.remove("active")
    }

    // Update sidebar categories
    renderSidebarCategories()
}

/**
 * Handle category selection
 */
async function handleCategorySelection(categoryId, spotlightId, categoryName) {
    try {
        window.API.showLoading(true)

        currentCategoryId = categoryId
        currentSpotlightId = spotlightId

        // Update breadcrumb
        const activeCategoryName = document.getElementById("activeCategoryName")
        if (activeCategoryName) {
            activeCategoryName.textContent = categoryName
        }

        // Fetch products
        if (categoryId === "all") {
            products = await window.API.fetchAllProducts()
        } else {
            products = await window.API.fetchProductsByCategory(categoryId)
        }

        renderProducts(products)
        window.API.showLoading(false)
    } catch (error) {
        console.error("Error handling category selection:", error)
        window.API.showLoading(false)
        window.API.showErrorMessage("Mahsulotlarni yuklashda xatolik yuz berdi")
    }
}

/**
 * Open product quick view (placeholder function)
 */
function openProductQuickView(productId) {
    console.log("Opening quick view for product:", productId)
    window.API.showNotification("Quick view funksiyasi tez orada qo'shiladi", "info")
}

// ======================================================
// INITIALIZATION
// ======================================================

/**
 * Initialize catalog page
 */
async function initializeCatalog() {
    try {
        window.API.showLoading(true)

        // Load spotlight categories and all products in parallel
        const [spotlightData, productsData] = await Promise.all([
            window.API.fetchSpotlightCategories(),
            window.API.fetchAllProducts(),
        ])

        spotlights = spotlightData
        products = productsData

        // Set initial state - "Barcha mahsulotlar" active
        currentCategoryId = "all"
        selectedSpotlightId = null

        // Render components
        renderSpotlightCategories()
        renderSidebarCategories() // Show all categories initially
        renderProducts(products)

        window.API.showLoading(false)
        console.log("Catalog initialized successfully!")
    } catch (error) {
        console.error("Error initializing catalog:", error)
        window.API.showLoading(false)
        window.API.showErrorMessage("Sahifani yuklashda xatolik yuz berdi")
    }
}

// ======================================================
// SEARCH FUNCTIONALITY
// ======================================================

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
        const debouncedSearch = window.API.debounce(async (query) => {
            if (query.length >= 2) {
                try {
                    window.API.showLoading(true)
                    const searchResults = await window.API.searchProducts(query)
                    renderProducts(searchResults)
                    window.API.showLoading(false)
                } catch (error) {
                    console.error("Search error:", error)
                    window.API.showLoading(false)
                    window.API.showErrorMessage("Qidirishda xatolik yuz berdi")
                }
            } else if (query.length === 0) {
                // Reset to current category
                if (currentCategoryId === "all") {
                    renderProducts(products)
                } else {
                    handleCategorySelection(
                        currentCategoryId,
                        currentSpotlightId,
                        document.getElementById("activeCategoryName")?.textContent || "",
                    )
                }
            }
        }, 300)

        searchInput.addEventListener("input", (e) => {
            debouncedSearch(e.target.value.trim())
        })
    }
}

// ======================================================
// PAGE INITIALIZATION
// ======================================================

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    // Wait for API to be available
    if (typeof window.API === "undefined") {
        console.error("API not loaded")
        return
    }

    // Load existing functionality
    const initializeMobileScrollEffects = window.initializeMobileScrollEffects
    const initializeDesktopScrollEffects = window.initializeDesktopScrollEffects
    const initializeMobileSidebar = window.initializeMobileSidebar
    const initializeMobileBottomNav = window.initializeMobileBottomNav
    const initializeCartModal = window.initializeCartModal
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
    if (typeof initializeCartModal === "function") {
        initializeCartModal()
    }
    if (typeof loadCartFromStorage === "function") {
        loadCartFromStorage()
    }

    // Initialize catalog specific functionality
    await initializeCatalog()
    initializeSearch()
})

// Export functions for global access
window.CatalogAPI = {
    initializeCatalog,
    renderSpotlightCategories,
    renderProducts,
    handleCategorySelection,
    openProductQuickView,
}
