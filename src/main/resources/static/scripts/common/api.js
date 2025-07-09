// ======================================================
// GLOBAL API CONFIGURATION AND FUNCTIONS
// ======================================================

// API Base URL - Updated to correct URL
const API_BASE_URL = "https://prime77.uz" //192.168.1.2

// Configure fetch defaults
const defaultFetchOptions = {
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 seconds timeout
}

// ======================================================
// API FUNCTIONS
// ======================================================

/**
 * Fetch spotlight categories from API
 * @returns {Promise<Array>} Array of spotlight categories
 */
async function fetchSpotlightCategories() {
    try {
        console.log("Fetching spotlight categories from:", `${API_BASE_URL}/api/v1/spotlights`)

        const response = await fetch(`${API_BASE_URL}/api/v1/spotlights`, {
            method: "GET",
            ...defaultFetchOptions,
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

/**
 * Fetch all products from API
 * @returns {Promise<Array>} Array of products
 */
async function fetchAllProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
            method: "GET",
            ...defaultFetchOptions,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching all products:", error)
        throw error
    }
}

/**
 * Fetch products by category from API
 * @param {number} categoryId - Category ID
 * @returns {Promise<Array>} Array of products
 */
async function fetchProductsByCategory(categoryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/products/by-category/${categoryId}`, {
            method: "GET",
            ...defaultFetchOptions,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching products by category:", error)
        throw error
    }
}

/**
 * Fetch all categories from API
 * @returns {Promise<Array>} Array of categories
 */
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
            method: "GET",
            ...defaultFetchOptions,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching categories:", error)
        throw error
    }
}

/**
 * Fetch single product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Product object
 */
async function fetchProductById(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/product/${productId}`, {
            method: "GET",
            ...defaultFetchOptions,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching product by ID:", error)
        throw error
    }
}

/**
 * Search products by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of products
 */
async function searchProducts(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/products/search?q=${encodeURIComponent(query)}`, {
            method: "GET",
            ...defaultFetchOptions,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error searching products:", error)
        throw error
    }
}

// ======================================================
// UTILITY FUNCTIONS
// ======================================================

/**
 * Get image URL from attachment ID
 * @param {number} attachmentId - Attachment ID
 * @returns {string} Image URL
 */
function getImageUrl(attachmentId) {
    if (!attachmentId) return "/images/default/box.jpeg"
    return `${API_BASE_URL}/api/v1/attachment/${attachmentId}`
}

/**
 * Format price with currency
 * @param {number} price - Price value
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    if (!price) return "0 So'm"
    return new Intl.NumberFormat("uz-UZ").format(price) + " So'm"
}

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current price
 * @returns {number} Discount percentage
 */
function calculateDiscountPercentage(originalPrice, currentPrice) {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0
    return Math.round((1 - currentPrice / originalPrice) * 100)
}

/**
 * Get status badge configuration
 * @param {string} status - Product status
 * @returns {Object|null} Status configuration
 */
function getStatusConfig(status) {
    const statusConfigs = {
        NEW: { text: status, class: "status-new", color: "#4CAF50" },
        HOT: { text: status, class: "status-hot", color: "#FF5722" },
        SALE: { text: status, class: "status-sale", color: "#FF9800" },
    }

    return statusConfigs[status] || null
}

/**
 * Show loading spinner
 * @param {boolean} show - Show or hide spinner
 */
function showLoading(show) {
    const loadingSpinner = document.getElementById("categoryLoading")
    const categoriesContainer = document.getElementById("categoriesContainer")

    if (show) {
        if (loadingSpinner) loadingSpinner.style.display = "block"
        if (categoriesContainer) categoriesContainer.style.opacity = "0.5"
    } else {
        if (loadingSpinner) loadingSpinner.style.display = "none"
        if (categoriesContainer) categoriesContainer.style.opacity = "1"
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    const categoryError = document.getElementById("categoryError")
    const categoriesContainer = document.getElementById("categoriesContainer")

    if (categoryError) {
        categoryError.style.display = "block"
        categoryError.querySelector("p").textContent = message
    }

    if (categoriesContainer) {
        categoriesContainer.style.display = "none"
    }
}

/**
 * Show success notification
 * @param {string} message - Success message
 */
function showSuccessNotification(message) {
    showNotification(message, "success")
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification)
            }
        }, 300)
    }, 3000)
}

/**
 * Debounce function for search
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Export functions for use in other files
window.API = {
    fetchSpotlightCategories,
    fetchAllProducts,
    fetchProductsByCategory,
    fetchCategories,
    fetchProductById,
    searchProducts,
    getImageUrl,
    formatPrice,
    calculateDiscountPercentage,
    getStatusConfig,
    showLoading,
    showErrorMessage,
    showSuccessNotification,
    showNotification,
    debounce,
}
