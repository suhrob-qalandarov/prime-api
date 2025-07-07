// Product catalog functionality - only product-related changes

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

    // Initialize catalog specific functionality
    await initializeCatalog()
    initializeSearch()

    // Remove image zoom functionality
    const productImages = document.querySelectorAll(".product-image")

    productImages.forEach((image) => {
        // Remove any existing zoom event listeners
        image.removeEventListener("click", zoomImage)

        // Add simple click handler without zoom
        image.addEventListener("click", function () {
            // Just trigger quick view instead of zoom
            const productCard = this.closest(".product-card")
            const quickViewBtn = productCard.querySelector(".quick-view-btn")
            if (quickViewBtn) {
                quickViewBtn.click()
            }
        })
    })

    // Quick view button functionality
    const quickViewBtns = document.querySelectorAll(".quick-view-btn")

    quickViewBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation()
            const productId = this.dataset.productId
            openQuickView(productId)
        })
    })

    // Product hover effects for name and price
    const productCards = document.querySelectorAll(".product-card")

    productCards.forEach((card) => {
        const productName = card.querySelector(".product-name")
        const productPrice = card.querySelector(".product-price")

        // Add click handlers for name and price
        if (productName) {
            productName.addEventListener("click", () => {
                const quickViewBtn = card.querySelector(".quick-view-btn")
                if (quickViewBtn) {
                    quickViewBtn.click()
                }
            })
        }

        if (productPrice) {
            productPrice.addEventListener("click", () => {
                const quickViewBtn = card.querySelector(".quick-view-btn")
                if (quickViewBtn) {
                    quickViewBtn.click()
                }
            })
        }
    })
})

// Remove zoom image function
function zoomImage() {
    // This function is now disabled
    return false
}

// Quick view modal opener
function openQuickView(productId) {
    // Your existing quick view logic here
    console.log("Opening quick view for product:", productId)

    // Trigger quick view modal
    const showQuickView = window.showQuickView // Declare the variable before using it
    if (typeof showQuickView === "function") {
        showQuickView(productId)
    }
}

// Filter and sort functionality (unchanged)
function filterProducts(category) {
    const products = document.querySelectorAll(".product-card")

    products.forEach((product) => {
        if (category === "all" || product.dataset.category === category) {
            product.style.display = "block"
        } else {
            product.style.display = "none"
        }
    })
}

// Global variables
let categories = []
let products = []
let currentCategoryId = "all"
let currentSortBy = ""

// ======================================================
// RENDER FUNCTIONS
// ======================================================

/**
 * Render top categories navigation
 */
function renderTopCategories() {
    const topCategories = document.getElementById("topCategories")
    if (!topCategories) return

    const categoriesHtml = categories
        .map(
            (category) => `
      <button class="top-category-btn ${currentCategoryId === category.id ? "active" : ""}" 
              data-category-id="${category.id}">
          ${category.name}
      </button>
  `,
        )
        .join("")

    topCategories.innerHTML = categoriesHtml

    // Add event listeners to category items
    topCategories.querySelectorAll(".top-category-btn").forEach((item) => {
        item.addEventListener("click", async () => {
            const categoryId = Number.parseInt(item.getAttribute("data-category-id"))
            const categoryName = item.textContent.trim()

            await handleCategorySelection(categoryId, categoryName)

            // Update active states
            topCategories.querySelectorAll(".top-category-btn").forEach((btn) => {
                btn.classList.remove("active")
            })
            item.classList.add("active")

            // Remove active from "Barcha mahsulotlar" button
            const barchasiBtn = document.getElementById("barchasiTopBtn")
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
 * Create product card HTML - FIXED DISCOUNT CALCULATION
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

    // FIXED DISCOUNT CALCULATION
    const discountPercent = product.discount || 0
    const hasDiscount = product.status === "SALE" && discountPercent > 0

    // Assuming product.price is the ORIGINAL price, calculate discounted price
    const originalPrice = product.price
    const discountedPrice = hasDiscount ? Math.round(product.price * (1 - discountPercent / 100)) : product.price
    const displayPrice = hasDiscount ? discountedPrice : product.price

    // Show category name only when "Barcha mahsulotlar" is selected
    const showCategoryName = currentCategoryId === "all"

    //${showCategoryName ? `<div class="catalog-product-category">${product.categoryName.toUpperCase()}</div>` : ""}


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
// FILTER FUNCTIONALITY - COMPLETELY REWRITTEN
// ======================================================

/**
 * Initialize filter events - COMPLETELY FIXED
 */
function initializeFilterEvents() {
    console.log("Initializing filter events...")

    // Wait for DOM to be ready
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

    console.log("Filter button:", filterBtn)
    console.log("Filter dropdown:", filterDropdown)

    if (!filterBtn || !filterDropdown) {
        console.error("Filter elements not found!")
        return
    }

    // Initially hide dropdown
    filterDropdown.style.display = "none"

    // Toggle dropdown on button click
    filterBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const isVisible = filterDropdown.style.display === "block"
        filterDropdown.style.display = isVisible ? "none" : "block"

        console.log("Filter dropdown toggled:", !isVisible)
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!filterDropdown.contains(e.target) && !filterBtn.contains(e.target)) {
            filterDropdown.style.display = "none"
        }
    })

    console.log("Filter dropdown setup complete")
}

/**
 * Setup size filters
 */
function setupSizeFilters() {
    const sizeFilterItems = document.querySelectorAll(".size-filter-item")
    console.log("Size filter items found:", sizeFilterItems.length)

    sizeFilterItems.forEach((item, index) => {
        // Remove existing listeners
        const newItem = item.cloneNode(true)
        item.parentNode.replaceChild(newItem, item)

        // Add new listener
        newItem.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()

            console.log("Size filter clicked:", index)

            // Toggle active state
            newItem.classList.toggle("active")

            // Apply filters
            applyAllFilters()
            updateSelectedFilters()
        })
    })

    console.log("Size filters setup complete")
}

/**
 * Setup status filters
 */
function setupStatusFilters() {
    const statusBtns = document.querySelectorAll(".status-filter-btn")
    console.log("Status filter buttons found:", statusBtns.length)

    statusBtns.forEach((btn, index) => {
        // Remove existing listeners
        const newBtn = btn.cloneNode(true)
        btn.parentNode.replaceChild(newBtn, btn)

        // Add new listener
        newBtn.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()

            console.log("Status filter clicked:", index, newBtn.dataset.status)

            // Radio button behavior - only one active at a time
            if (newBtn.classList.contains("active")) {
                newBtn.classList.remove("active")
            } else {
                // Remove active from all status buttons
                document.querySelectorAll(".status-filter-btn").forEach((otherBtn) => {
                    otherBtn.classList.remove("active")
                })
                // Add active to clicked button
                newBtn.classList.add("active")
            }

            // Apply filters
            applyAllFilters()
        })
    })

    console.log("Status filters setup complete")
}

/**
 * Setup sort select
 */
function setupSortSelect() {
    const sortSelect = document.getElementById("sortSelect")
    console.log("Sort select found:", sortSelect)

    if (!sortSelect) {
        console.error("Sort select not found!")
        return
    }

    // Remove existing listeners
    const newSelect = sortSelect.cloneNode(true)
    sortSelect.parentNode.replaceChild(newSelect, sortSelect)

    // Add new listener
    newSelect.addEventListener("change", (e) => {
        currentSortBy = e.target.value
        console.log("Sort changed to:", currentSortBy)

        // Add/remove has-selection class for styling
        if (e.target.value && e.target.value !== "") {
            e.target.classList.add("has-selection")
        } else {
            e.target.classList.remove("has-selection")
        }

        // Apply sorting
        if (currentSortBy) {
            sortProducts(getFilteredProducts(), currentSortBy)
        } else {
            renderProducts(getFilteredProducts())
        }
    })

    console.log("Sort select setup complete")
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
            return sizeText.split(" ")[0] // Extract size letter (XL, L, M)
        })
        .filter((size) => size) // Remove empty values

    console.log("Selected sizes:", selectedSizes)

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

    console.log("Selected statuses:", selectedStatuses)

    if (selectedStatuses.length > 0) {
        filteredProducts = filteredProducts.filter((product) => selectedStatuses.includes(product.status))
    }

    console.log("Filtered products count:", filteredProducts.length)
    return filteredProducts
}

/**
 * Apply all active filters
 */
function applyAllFilters() {
    console.log("Applying all filters...")

    const filteredProducts = getFilteredProducts()

    // Update products count
    updateProductsCount(filteredProducts.length)

    // Apply current sorting if any
    if (currentSortBy) {
        sortProducts(filteredProducts, currentSortBy)
    } else {
        renderProducts(filteredProducts)
    }

    console.log("Filters applied successfully")
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

        // Add click event to remove button
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
    console.log("Removing size filter:", sizeText)

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

// ======================================================
// OTHER FUNCTIONS
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

    // Clear existing category tags
    const existingCategoryTags = selectedFilters.querySelectorAll(
        ".selected-filter-tag:not(.size-filter-tag):not(.status-filter-tag)",
    )
    existingCategoryTags.forEach((tag) => tag.remove())

    // Add category tag if not "Barcha mahsulotlar"
    if (categoryName && categoryName !== "Barcha mahsulotlar") {
        const tag = document.createElement("div")
        tag.className = "selected-filter-tag"
        tag.innerHTML = `
        <span>${categoryName}</span>
        <button class="remove-filter" onclick="clearCategoryFilter()">×</button>
    `
        selectedFilters.insertBefore(tag, selectedFilters.firstChild)
    }
}

/**
 * Clear category filter
 */
function clearCategoryFilter() {
    handleCategorySelection("all", "Barcha mahsulotlar")

    // Update active states
    document.querySelectorAll(".top-category-btn").forEach((btn) => {
        btn.classList.remove("active")
    })

    const barchasiBtn = document.getElementById("barchasiTopBtn")
    if (barchasiBtn) {
        barchasiBtn.classList.add("active")
    }
}

/**
 * Initialize "Barcha mahsulotlar" button events
 */
function initializeBarchasiEvents() {
    const barchasiTopBtn = document.getElementById("barchasiTopBtn")
    if (barchasiTopBtn) {
        barchasiTopBtn.addEventListener("click", async () => {
            await handleCategorySelection("all", "Barcha mahsulotlar")

            // Update active states
            document.querySelectorAll(".top-category-btn").forEach((btn) => {
                btn.classList.remove("active")
            })
            barchasiTopBtn.classList.add("active")
        })
    }
}

/**
 * Sort products based on selected criteria
 */
function sortProducts(productsData, sortBy) {
    if (!productsData || productsData.length === 0) return

    const sortedProducts = [...productsData]

    switch (sortBy) {
        case "popularity-high":
            sortedProducts.sort((a, b) => {
                const statusPriority = { HOT: 3, NEW: 2, SALE: 1 }
                return (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0)
            })
            break
        case "popularity-low":
            sortedProducts.sort((a, b) => {
                const statusPriority = { HOT: 3, NEW: 2, SALE: 1 }
                return (statusPriority[a.status] || 0) - (statusPriority[b.status] || 0)
            })
            break
        case "name-asc":
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
            break
        case "name-desc":
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
            break
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
 * Update breadcrumb based on current selection
 */
function updateBreadcrumb(categoryName) {
    const activeCategoryName = document.getElementById("activeCategoryName")
    if (!activeCategoryName) return

    activeCategoryName.textContent = categoryName || "Barcha mahsulotlar"
}

/**
 * Handle category selection
 */
async function handleCategorySelection(categoryId, categoryName) {
    try {
        window.API.showLoading(true)

        currentCategoryId = categoryId

        // Update breadcrumb
        updateBreadcrumb(categoryName)
        updateSelectedCategoryTag(categoryName)

        // Fetch products
        if (categoryId === "all") {
            products = await window.API.fetchAllProducts()
        } else {
            products = await window.API.fetchProductsByCategory(categoryId)
        }

        // Clear all filters when changing category
        clearAllFilters()

        // Update products count
        updateProductsCount(products.length)

        // Apply current sorting if any
        if (currentSortBy) {
            sortProducts(products, currentSortBy)
        } else {
            renderProducts(products)
        }

        window.API.showLoading(false)
    } catch (error) {
        console.error("Error handling category selection:", error)
        window.API.showLoading(false)
        window.API.showErrorMessage("Mahsulotlarni yuklashda xatolik yuz berdi")
    }
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

    // Update selected filters display
    updateSelectedFilters()
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

        // Load categories and all products in parallel
        const [categoriesData, productsData] = await Promise.all([
            window.API.fetchCategories(),
            window.API.fetchAllProducts(),
        ])

        categories = categoriesData
        products = productsData

        // Set initial state
        currentCategoryId = "all"

        // Update initial breadcrumb
        updateBreadcrumb("Barcha mahsulotlar")

        // Render components
        renderTopCategories()
        renderProducts(products)

        // Initialize events
        initializeFilterEvents()
        initializeBarchasiEvents()

        // Update products count
        updateProductsCount(products.length)

        // Disable "Saralash" option in sort select
        const sortSelect = document.getElementById("sortSelect")
        if (sortSelect) {
            const defaultOption = sortSelect.querySelector('option[value=""]')
            if (defaultOption) {
                defaultOption.disabled = true
            }
        }

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
                    updateProductsCount(searchResults.length)
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
                    updateProductsCount(products.length)
                } else {
                    const selectedCategory = categories.find((c) => c.id === currentCategoryId)
                    handleCategorySelection(currentCategoryId, selectedCategory?.name || "")
                }
            }
        }, 300)

        searchInput.addEventListener("input", (e) => {
            debouncedSearch(e.target.value.trim())
        })
    }
}

// Export functions for global access
window.CatalogAPI = {
    initializeCatalog,
    renderTopCategories,
    renderProducts,
    handleCategorySelection,
    sortProducts,
    applyAllFilters,
    clearAllFilters,
}

// Make functions globally available
window.removeSizeFilter = removeSizeFilter
window.clearCategoryFilter = clearCategoryFilter
