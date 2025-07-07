// Product catalog functionality - DESKTOP VERSION (FIXED)

document.addEventListener("DOMContentLoaded", async () => {
    // Wait for API to be available
    if (typeof window.API === "undefined") {
        console.error("API not loaded")
        return
    }

    // Load existing functionality from script.js
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

    // Initialize spotlight catalog functionality
    await initializeSpotlightCatalog()
    initializeSearch()
    initializeFilterEvents()

    console.log("Spotlight Catalog initialized successfully!")
})

// Quick view modal opener - FIXED
function openProductQuickView(productId) {
    console.log("Opening quick view for product:", productId)

    // Trigger quick view modal
    if (typeof window.showQuickView === "function") {
        window.showQuickView(productId)
    } else {
        console.error("showQuickView function not found")
    }
}

// ======================================================
// GLOBAL VARIABLES - UPDATED
// ======================================================
let spotlights = []
let allCategories = []
let currentSpotlight = null
let currentCategories = []
let products = []
let currentCategoryId = null
let currentSortBy = ""
let isAllCategoriesMode = true

// ======================================================
// SPOTLIGHT API FUNCTIONS
// ======================================================

/**
 * Fetch spotlight categories from catalog API
 * @returns {Promise<Array>} Array of spotlight categories
 */
async function fetchSpotlightCategories() {
    try {
        console.log(
            "Fetching spotlight categories from:",
            `${window.API_BASE_URL}/api/v1/spotlights/catalog`,
        )

        const response = await fetch(`${window.API_BASE_URL}/api/v1/spotlights/catalog`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Spotlight categories fetched successfully:", data)
        return data
    } catch (error) {
        console.error("Error fetching spotlight categories:", error)
        throw error
    }
}

// ======================================================
// INITIALIZATION FUNCTIONS - UPDATED
// ======================================================

/**
 * Initialize spotlight catalog page - UPDATED
 */
async function initializeSpotlightCatalog() {
    try {
        window.API.showLoading(true)

        // Load spotlights and all categories
        const [spotlightsData, categoriesData] = await Promise.all([
            fetchSpotlightCategories(),
            window.API.fetchCategories(),
        ])

        spotlights = spotlightsData
        allCategories = categoriesData

        // Populate custom spotlight dropdown
        populateCustomSpotlightDropdown()

        // Initialize custom spotlight dropdown events
        initializeCustomSpotlightDropdown()

        // Show all categories by default and auto-select "Barcha kategoriyalar"
        await handleAllCategoriesSelection()
        await autoSelectAllProducts() // NEW: Auto-select all products

        window.API.showLoading(false)
        console.log("Spotlight catalog initialized successfully!")
    } catch (error) {
        console.error("Error initializing spotlight catalog:", error)
        window.API.showLoading(false)
        window.API.showErrorMessage("Sahifani yuklashda xatolik yuz berdi")
        showErrorState()
    }
}

/**
 * Populate custom spotlight dropdown - NEW
 */
function populateCustomSpotlightDropdown() {
    const spotlightCustomDropdown = document.getElementById("spotlightCustomDropdown")
    if (!spotlightCustomDropdown) return

    // Clear existing items
    spotlightCustomDropdown.innerHTML = ""

    // Add "Barchasi" option - UPDATED to "Spotlights"
    const allItem = document.createElement("div")
    allItem.className = "spotlight-dropdown-item selected"
    allItem.setAttribute("data-value", "all")
    allItem.textContent = "Spotlights"
    spotlightCustomDropdown.appendChild(allItem)

    // Add spotlight options
    spotlights.forEach((spotlight) => {
        const item = document.createElement("div")
        item.className = "spotlight-dropdown-item"
        item.setAttribute("data-value", spotlight.id)
        item.textContent = spotlight.name
        spotlightCustomDropdown.appendChild(item)
    })

    console.log(`Populated ${spotlights.length} spotlights in custom dropdown`)
}

/**
 * Initialize custom spotlight dropdown events - NEW
 */
function initializeCustomSpotlightDropdown() {
    const spotlightCustomBtn = document.getElementById("spotlightCustomBtn")
    const spotlightCustomDropdown = document.getElementById("spotlightCustomDropdown")

    if (!spotlightCustomBtn || !spotlightCustomDropdown) return

    // Toggle dropdown on button click
    spotlightCustomBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const isVisible = spotlightCustomDropdown.style.display === "block"
        spotlightCustomDropdown.style.display = isVisible ? "none" : "block"
        spotlightCustomBtn.classList.toggle("active", !isVisible)
    })

    // Handle dropdown item clicks
    spotlightCustomDropdown.addEventListener("click", async (e) => {
        const item = e.target.closest(".spotlight-dropdown-item")
        if (!item) return

        const selectedValue = item.getAttribute("data-value")
        const selectedText = item.textContent

        // Update button text
        spotlightCustomBtn.textContent = selectedText

        // Update selected state
        spotlightCustomDropdown.querySelectorAll(".spotlight-dropdown-item").forEach((i) => {
            i.classList.remove("selected")
        })
        item.classList.add("selected")

        // Close dropdown
        spotlightCustomDropdown.style.display = "none"
        spotlightCustomBtn.classList.remove("active")

        // Handle selection
        if (selectedValue === "all") {
            await handleAllCategoriesSelection()
            clearSpotlightFilter()
        } else {
            const selectedSpotlight = spotlights.find((s) => s.id.toString() === selectedValue)
            if (selectedSpotlight) {
                await handleSpotlightSelection(selectedSpotlight)
                updateSpotlightFilter(selectedSpotlight.name)
            }
        }
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!spotlightCustomDropdown.contains(e.target) && !spotlightCustomBtn.contains(e.target)) {
            spotlightCustomDropdown.style.display = "none"
            spotlightCustomBtn.classList.remove("active")
        }
    })
}

// ======================================================
// SPOTLIGHT HANDLING FUNCTIONS - UPDATED
// ======================================================

/**
 * Handle spotlight selection - UPDATED
 */
async function handleSpotlightSelection(spotlight) {
    try {
        window.API.showLoading(true)

        isAllCategoriesMode = false
        currentSpotlight = spotlight
        currentCategories = spotlight.categories || []

        console.log("Selected spotlight:", spotlight)
        console.log("Available categories:", currentCategories)

        // Render spotlight categories (without "Barcha kategoriyalar" button)
        renderSpotlightCategories(currentCategories)

        // Clear products initially
        clearProducts()

        window.API.showLoading(false)
    } catch (error) {
        console.error("Error handling spotlight selection:", error)
        window.API.showLoading(false)
        window.API.showErrorMessage("Spotlight ma'lumotlarini yuklashda xatolik yuz berdi")
    }
}

/**
 * Show spotlight information
 */
function showSpotlightInfo(spotlight) {
    const spotlightInfo = document.getElementById("spotlightInfo")
    const spotlightTitle = document.getElementById("spotlightTitle")

    if (spotlightInfo && spotlightTitle) {
        spotlightTitle.textContent = spotlight.name
        spotlightInfo.style.display = "block"
    }
}

/**
 * Render spotlight categories - UPDATED
 */
function renderSpotlightCategories(categories) {
    const topCategories = document.getElementById("topCategories")
    if (!topCategories) return

    topCategories.innerHTML = ""

    if (!categories || categories.length === 0) {
        topCategories.innerHTML = `
            <div class="no-categories-message">
                <p>Bu spotlight uchun kategoriyalar mavjud emas</p>
            </div>
        `
        return
    }

    // Create category buttons
    categories.forEach((category) => {
        const categoryBtn = document.createElement("button")
        categoryBtn.className = "top-category-btn"
        categoryBtn.setAttribute("data-category-id", category.id)
        categoryBtn.textContent = category.name

        // Add click event
        categoryBtn.addEventListener("click", async () => {
            await handleCategorySelection(category)

            // Update active states
            topCategories.querySelectorAll(".top-category-btn").forEach((btn) => {
                btn.classList.remove("active")
            })
            categoryBtn.classList.add("active")
        })

        topCategories.appendChild(categoryBtn)
    })

    console.log(`Rendered ${categories.length} categories`)
}

/**
 * Handle category selection - UPDATED
 */
async function handleCategorySelection(category) {
    try {
        window.API.showLoading(true)

        currentCategoryId = category.id

        console.log("Selected category:", category)

        // Fetch products for this category
        products = await window.API.fetchProductsByCategory(category.id)

        // Update products count
        updateProductsCount(products.length)

        // Clear filters when changing category
        clearAllFilters()

        // Render products
        if (currentSortBy) {
            sortProducts(products, currentSortBy)
        } else {
            renderProducts(products)
        }

        // Update selected filters display - keep spotlight filter
        updateSelectedCategoryTag(category.name)

        window.API.showLoading(false)
    } catch (error) {
        console.error("Error handling category selection:", error)
        window.API.showLoading(false)
        window.API.showErrorMessage("Mahsulotlarni yuklashda xatolik yuz berdi")
    }
}

// ======================================================
// UI STATE FUNCTIONS - UPDATED
// ======================================================

/**
 * Show no spotlight selected state
 */
function showNoSpotlightState() {
    const noSpotlightSelected = document.getElementById("noSpotlightSelected")
    const spotlightInfo = document.getElementById("spotlightInfo")
    const topCategories = document.getElementById("topCategories")

    if (noSpotlightSelected) {
        noSpotlightSelected.style.display = "block"
    }
    if (spotlightInfo) {
        spotlightInfo.style.display = "none"
    }
    if (topCategories) {
        topCategories.innerHTML = ""
    }

    // Clear products
    clearProducts()

    // Reset current state
    currentSpotlight = null
    currentCategories = []
    currentCategoryId = null
}

/**
 * Hide no spotlight selected state
 */
function hideNoSpotlightState() {
    const noSpotlightSelected = document.getElementById("noSpotlightSelected")
    if (noSpotlightSelected) {
        noSpotlightSelected.style.display = "none"
    }
}

/**
 * Show error state
 */
function showErrorState() {
    const topCategories = document.getElementById("topCategories")
    if (topCategories) {
        topCategories.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Xatolik yuz berdi</h4>
                <p>Spotlight ma'lumotlarini yuklashda muammo bo'ldi</p>
                <button class="btn-custom" onclick="location.reload()">Qayta yuklash</button>
            </div>
        `
    }
}

/**
 * Clear products display
 */
function clearProducts() {
    const productsGrid = document.getElementById("productsGrid")
    const noProducts = document.getElementById("noProducts")

    if (productsGrid) {
        productsGrid.innerHTML = ""
        productsGrid.style.display = "none"
    }
    if (noProducts) {
        noProducts.style.display = "none"
    }

    // Update products count
    updateProductsCount(0)
}

// ======================================================
// PRODUCT RENDERING FUNCTIONS
// ======================================================

/**
 * Render products - UPDATED with proper quick view
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

    // Re-initialize quick view buttons after rendering
    initializeQuickViewButtons()
}

/**
 * Initialize quick view buttons - NEW
 */
function initializeQuickViewButtons() {
    const quickViewBtns = document.querySelectorAll(".catalog-quick-view-btn")
    const mobileQuickViewBtns = document.querySelectorAll(".catalog-mobile-quick-view-icon")

    quickViewBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation()
            const productId = this.dataset.productId
            openProductQuickView(productId)
        })
    })

    mobileQuickViewBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation()
            const productId = this.getAttribute("onclick").match(/\d+/)[0]
            openProductQuickView(productId)
        })
    })

    // Product hover effects for name and price
    const productCards = document.querySelectorAll(".catalog-product-card")

    productCards.forEach((card) => {
        const productName = card.querySelector(".catalog-product-name")
        const productPrice = card.querySelector(".catalog-product-pricing")

        // Add click handlers for name and price
        if (productName) {
            productName.addEventListener("click", () => {
                const quickViewBtn = card.querySelector(".catalog-quick-view-btn")
                if (quickViewBtn) {
                    const productId = quickViewBtn.dataset.productId
                    openProductQuickView(productId)
                }
            })
        }

        if (productPrice) {
            productPrice.addEventListener("click", () => {
                const quickViewBtn = card.querySelector(".catalog-quick-view-btn")
                if (quickViewBtn) {
                    const productId = quickViewBtn.dataset.productId
                    openProductQuickView(productId)
                }
            })
        }
    })
}

/**
 * Create product card HTML
 */
function createProductCard(product) {
    const productCard = document.createElement("div")
    productCard.className = "catalog-product-card"
    productCard.setAttribute("data-product-id", product.id)
    productCard.setAttribute("data-category", product.categoryName)

    // Get main image URL
    const mainImageUrl = window.API.getImageUrl(product.attachmentKeys?.[0])

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
    const originalPrice = product.price
    const discountedPrice = hasDiscount ? Math.round(product.price * (1 - discountPercent / 100)) : product.price
    const displayPrice = hasDiscount ? discountedPrice : product.price

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
          <button class="catalog-quick-view-btn" data-product-id="${product.id}">
              Quick View
          </button>
          <button class="catalog-mobile-quick-view-icon" onclick="openProductQuickView(${product.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128A133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
              </svg>
          </button>
      </div>
      <div class="catalog-product-info">
          <h3 class="catalog-product-name">${product.name}</h3>
          <div class="catalog-product-pricing">
              <span class="catalog-current-price">${window.API.formatPrice(displayPrice)}</span>
              ${
        hasDiscount
            ? `
                      <span class="catalog-original-price">${window.API.formatPrice(originalPrice)}</span>
                      <span class="catalog-discount-badge">-${discountPercent}%</span>
                  `
            : ""
    }
          </div>
      </div>
  `

    return productCard
}

// ======================================================
// FILTER FUNCTIONALITY
// ======================================================

/**
 * Initialize filter events
 */
function initializeFilterEvents() {
    setTimeout(() => {
        setupFilterDropdown()
        setupSizeFilters()
        setupStatusFilters()
        setupSortSelect()
    }, 100)
}

/**
 * Setup filter dropdown toggle
 */
function setupFilterDropdown() {
    const filterBtn = document.getElementById("filterBtn")
    const filterDropdown = document.getElementById("filterDropdown")

    if (!filterBtn || !filterDropdown) return

    filterDropdown.style.display = "none"

    filterBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const isVisible = filterDropdown.style.display === "block"
        filterDropdown.style.display = isVisible ? "none" : "block"
    })

    document.addEventListener("click", (e) => {
        if (!filterDropdown.contains(e.target) && !filterBtn.contains(e.target)) {
            filterDropdown.style.display = "none"
        }
    })
}

/**
 * Setup size filters
 */
function setupSizeFilters() {
    const sizeFilterItems = document.querySelectorAll(".size-filter-item")

    sizeFilterItems.forEach((item) => {
        const newItem = item.cloneNode(true)
        item.parentNode.replaceChild(newItem, item)

        newItem.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()

            newItem.classList.toggle("active")
            applyAllFilters()
            updateSelectedFilters()
        })
    })
}

/**
 * Setup status filters
 */
function setupStatusFilters() {
    const statusBtns = document.querySelectorAll(".status-filter-btn")

    statusBtns.forEach((btn) => {
        const newBtn = btn.cloneNode(true)
        btn.parentNode.replaceChild(newBtn, btn)

        newBtn.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()

            if (newBtn.classList.contains("active")) {
                newBtn.classList.remove("active")
            } else {
                document.querySelectorAll(".status-filter-btn").forEach((otherBtn) => {
                    otherBtn.classList.remove("active")
                })
                newBtn.classList.add("active")
            }

            applyAllFilters()
        })
    })
}

/**
 * Setup sort select
 */
function setupSortSelect() {
    const sortSelect = document.getElementById("sortSelect")
    if (!sortSelect) return

    const newSelect = sortSelect.cloneNode(true)
    sortSelect.parentNode.replaceChild(newSelect, sortSelect)

    newSelect.addEventListener("change", (e) => {
        currentSortBy = e.target.value

        if (e.target.value && e.target.value !== "") {
            e.target.classList.add("has-selection")
        } else {
            e.target.classList.remove("has-selection")
        }

        if (currentSortBy) {
            sortProducts(getFilteredProducts(), currentSortBy)
        } else {
            renderProducts(getFilteredProducts())
        }
    })
}

/**
 * Get currently filtered products
 */
function getFilteredProducts() {
    let filteredProducts = [...products]

    // Apply size filters
    const activeSizeItems = document.querySelectorAll(".size-filter-item.active")
    const selectedSizes = Array.from(activeSizeItems)
        .map((item) => {
            const sizeText = item.querySelector("span")?.textContent?.trim() || ""
            return sizeText.split(" ")[0]
        })
        .filter((size) => size)

    if (selectedSizes.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
            const hasMatchingSize = product.productSizes?.some((size) => selectedSizes.includes(size.size) && size.amount > 0)
            return hasMatchingSize
        })
    }

    // Apply status filters
    const activeStatusBtns = document.querySelectorAll(".status-filter-btn.active")
    const selectedStatuses = Array.from(activeStatusBtns)
        .map((btn) => btn.dataset.status)
        .filter((status) => status)

    if (selectedStatuses.length > 0) {
        filteredProducts = filteredProducts.filter((product) => selectedStatuses.includes(product.status))
    }

    return filteredProducts
}

/**
 * Apply all active filters
 */
function applyAllFilters() {
    const filteredProducts = getFilteredProducts()
    updateProductsCount(filteredProducts.length)

    if (currentSortBy) {
        sortProducts(filteredProducts, currentSortBy)
    } else {
        renderProducts(filteredProducts)
    }
}

/**
 * Sort products based on selected criteria
 */
function sortProducts(productsData, sortBy) {
    if (!productsData || productsData.length === 0) return

    const sortedProducts = [...productsData]

    switch (sortBy) {
        case "price-low":
            sortedProducts.sort((a, b) => a.price - b.price)
            break
        case "price-high":
            sortedProducts.sort((a, b) => b.price - a.price)
            break
        default:
            break
    }

    renderProducts(sortedProducts)
}

/**
 * Clear all filters
 */
function clearAllFilters() {
    // Clear size filters
    document.querySelectorAll(".size-filter-item.active").forEach((item) => {
        item.classList.remove("active")
    })

    // Clear status filters
    document.querySelectorAll(".status-filter-btn.active").forEach((btn) => {
        btn.classList.remove("active")
    })

    // Clear sort
    const sortSelect = document.getElementById("sortSelect")
    if (sortSelect) {
        sortSelect.value = ""
        sortSelect.classList.remove("has-selection")
    }
    currentSortBy = ""

    updateSelectedFilters()
}

// ======================================================
// UTILITY FUNCTIONS - UPDATED
// ======================================================

/**
 * Update products count display
 */
function updateProductsCount(count) {
    const productsCount = document.getElementById("productsCount")
    if (productsCount) {
        productsCount.textContent = count
    }
}

/**
 * Update selected category filter tag
 */
function updateSelectedCategoryTag(categoryName) {
    const selectedFilters = document.getElementById("selectedFilters")
    if (!selectedFilters) return

    // Clear existing category tags (but keep spotlight tags)
    const existingCategoryTags = selectedFilters.querySelectorAll(
        ".selected-filter-tag:not(.size-filter-tag):not(.status-filter-tag):not(.spotlight-filter-tag)",
    )
    existingCategoryTags.forEach((tag) => tag.remove())

    // Add category tag
    if (categoryName) {
        const tag = document.createElement("div")
        tag.className = "selected-filter-tag"
        tag.innerHTML = `
        <span>${categoryName}</span>
        <button class="remove-filter" onclick="clearCategoryFilter()">×</button>
    `
        selectedFilters.appendChild(tag)
    }
}

/**
 * Update selected filters display
 */
function updateSelectedFilters() {
    const selectedFilters = document.getElementById("selectedFilters")
    if (!selectedFilters) return

    // Clear existing size filter tags
    const existingFilterTags = selectedFilters.querySelectorAll(".size-filter-tag")
    existingFilterTags.forEach((tag) => tag.remove())

    // Add size filter tags
    const activeSizeItems = document.querySelectorAll(".size-filter-item.active")
    activeSizeItems.forEach((item) => {
        const sizeText = item.querySelector("span")?.textContent?.trim()
        if (!sizeText) return

        const tag = document.createElement("div")
        tag.className = "selected-filter-tag size-filter-tag"
        tag.innerHTML = `
        <span>${sizeText}</span>
        <button class="remove-filter" data-size-text="${sizeText}">×</button>
    `

        const removeBtn = tag.querySelector(".remove-filter")
        removeBtn.addEventListener("click", () => {
            removeSizeFilter(sizeText)
        })

        selectedFilters.appendChild(tag)
    })
}

/**
 * Remove specific size filter
 */
function removeSizeFilter(sizeText) {
    const sizeItems = document.querySelectorAll(".size-filter-item")
    sizeItems.forEach((item) => {
        const span = item.querySelector("span")
        if (span && span.textContent.trim() === sizeText) {
            item.classList.remove("active")
        }
    })

    applyAllFilters()
    updateSelectedFilters()
}

/**
 * Clear category filter
 */
function clearCategoryFilter() {
    // Reset category selection
    currentCategoryId = null

    // Clear products
    clearProducts()

    // Clear category tag
    updateSelectedCategoryTag("")

    // Remove active state from category buttons
    document.querySelectorAll(".top-category-btn").forEach((btn) => {
        btn.classList.remove("active")
    })
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
                    updateProductsCount(searchResults.length)
                    window.API.showLoading(false)
                } catch (error) {
                    console.error("Search error:", error)
                    window.API.showLoading(false)
                    window.API.showErrorMessage("Qidirishda xatolik yuz berdi")
                }
            } else if (query.length === 0) {
                // Reset to current category
                if (currentCategoryId && products.length > 0) {
                    renderProducts(products)
                    updateProductsCount(products.length)
                } else {
                    clearProducts()
                }
            }
        }, 300)

        searchInput.addEventListener("input", (e) => {
            debouncedSearch(e.target.value.trim())
        })
    }
}

/**
 * Handle "Barchasi" (All categories) selection - UPDATED
 */
async function handleAllCategoriesSelection() {
    try {
        window.API.showLoading(true)

        isAllCategoriesMode = true
        currentSpotlight = null
        currentCategories = allCategories

        console.log("Showing all categories:", allCategories)

        // Render all categories with "Barcha kategoriyalar" button
        renderAllCategories(allCategories)

        // Clear products initially
        clearProducts()

        window.API.showLoading(false)
    } catch (error) {
        console.error("Error handling all categories selection:", error)
        window.API.showLoading(false)
        window.API.showErrorMessage("Kategoriyalarni yuklashda xatolik yuz berdi")
    }
}

/**
 * Render all categories with "Barcha kategoriyalar" button - UPDATED
 */
function renderAllCategories(categories) {
    const topCategories = document.getElementById("topCategories")
    if (!topCategories) return

    topCategories.innerHTML = ""

    // Add "Barcha kategoriyalar" button first
    const allCategoriesBtn = document.createElement("button")
    allCategoriesBtn.className = "top-category-btn"
    allCategoriesBtn.setAttribute("data-category-id", "all")
    allCategoriesBtn.textContent = "Barcha kategoriyalar"

    // Add click event for all products
    allCategoriesBtn.addEventListener("click", async () => {
        await handleAllProductsSelection()

        // Update active states
        topCategories.querySelectorAll(".top-category-btn").forEach((btn) => {
            btn.classList.remove("active")
        })
        allCategoriesBtn.classList.add("active")
    })

    topCategories.appendChild(allCategoriesBtn)

    // Add individual category buttons
    if (categories && categories.length > 0) {
        categories.forEach((category) => {
            const categoryBtn = document.createElement("button")
            categoryBtn.className = "top-category-btn"
            categoryBtn.setAttribute("data-category-id", category.id)
            categoryBtn.textContent = category.name

            // Add click event
            categoryBtn.addEventListener("click", async () => {
                await handleCategorySelection(category)

                // Update active states
                topCategories.querySelectorAll(".top-category-btn").forEach((btn) => {
                    btn.classList.remove("active")
                })
                categoryBtn.classList.add("active")
            })

            topCategories.appendChild(categoryBtn)
        })
    }

    console.log(`Rendered ${categories.length} categories with "Barcha kategoriyalar" button`)
}

/**
 * Handle "Barcha kategoriyalar" button selection - UPDATED
 */
async function handleAllProductsSelection() {
    try {
        window.API.showLoading(true)

        currentCategoryId = null

        console.log("Loading all products")

        // Fetch all products
        products = await window.API.fetchAllProducts()

        // Update products count
        updateProductsCount(products.length)

        // Clear filters when showing all products
        clearAllFilters()

        // Render products
        if (currentSortBy) {
            sortProducts(products, currentSortBy)
        } else {
            renderProducts(products)
        }

        // Update selected filters display
        updateSelectedCategoryTag("Barcha kategoriyalar")

        window.API.showLoading(false)
    } catch (error) {
        console.error("Error handling all products selection:", error)
        window.API.showLoading(false)
        window.API.showErrorMessage("Barcha mahsulotlarni yuklashda xatolik yuz berdi")
    }
}

/**
 * Auto-select all products on page load - NEW
 */
async function autoSelectAllProducts() {
    try {
        // Auto-click "Barcha kategoriyalar" button
        const allCategoriesBtn = document.querySelector('[data-category-id="all"]')
        if (allCategoriesBtn) {
            allCategoriesBtn.click()
        }
    } catch (error) {
        console.error("Error auto-selecting all products:", error)
    }
}

/**
 * Update spotlight filter display - UPDATED
 */
function updateSpotlightFilter(spotlightName) {
    const selectedFilters = document.getElementById("selectedFilters")
    if (!selectedFilters) return

    // Clear existing spotlight tags
    const existingSpotlightTags = selectedFilters.querySelectorAll(".spotlight-filter-tag")
    existingSpotlightTags.forEach((tag) => tag.remove())

    // Add spotlight tag
    if (spotlightName) {
        const tag = document.createElement("div")
        tag.className = "selected-filter-tag spotlight-filter-tag"
        tag.innerHTML = `
        <span>Spotlight: ${spotlightName}</span>
        <button class="remove-filter" onclick="clearSpotlightFilter()">×</button>
    `
        selectedFilters.insertBefore(tag, selectedFilters.firstChild)
    }
}

/**
 * Clear spotlight filter - UPDATED
 */
function clearSpotlightFilter() {
    const selectedFilters = document.getElementById("selectedFilters")
    if (selectedFilters) {
        const spotlightTags = selectedFilters.querySelectorAll(".spotlight-filter-tag")
        spotlightTags.forEach((tag) => tag.remove())
    }

    // Reset custom spotlight button to "Spotlights" - UPDATED
    const spotlightCustomBtn = document.getElementById("spotlightCustomBtn")
    const spotlightCustomDropdown = document.getElementById("spotlightCustomDropdown")

    if (spotlightCustomBtn) {
        spotlightCustomBtn.textContent = "Spotlights"
    }

    if (spotlightCustomDropdown) {
        // Update selected state in dropdown
        spotlightCustomDropdown.querySelectorAll(".spotlight-dropdown-item").forEach((item) => {
            item.classList.remove("selected")
        })
        const allItem = spotlightCustomDropdown.querySelector('[data-value="all"]')
        if (allItem) {
            allItem.classList.add("selected")
        }
    }
}

// Export functions for global access
window.SpotlightCatalogAPI = {
    initializeSpotlightCatalog,
    handleSpotlightSelection,
    handleCategorySelection,
    renderProducts,
    sortProducts,
    applyAllFilters,
    clearAllFilters,
}

// Make functions globally available
window.clearCategoryFilter = clearCategoryFilter
window.removeSizeFilter = removeSizeFilter
window.clearSpotlightFilter = clearSpotlightFilter
window.openProductQuickView = openProductQuickView
