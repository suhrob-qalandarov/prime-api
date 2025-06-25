// ======================================================
// GLOBAL API CONFIGURATION AND FUNCTIONS
// ======================================================

// Import Axios library
const axios = window.axios;

// API Base URL - Updated to correct URL
const API_BASE_URL = 'http://192.168.1.2/';

// Configure Axios defaults (Axios is already loaded via CDN in HTML)
if (typeof axios !== 'undefined') {
    axios.defaults.timeout = 10000; // 10 seconds timeout
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    // Add request interceptor for debugging
    axios.interceptors.request.use(
        config => {
            console.log('API Request:', config.method?.toUpperCase(), config.url);
            return config;
        },
        error => {
            console.error('Request Error:', error);
            return Promise.reject(error);
        }
    );

    // Add response interceptor for error handling
    axios.interceptors.response.use(
        response => {
            console.log('API Response:', response.status, response.config.url);
            return response;
        },
        error => {
            console.error('Response Error:', error.response?.status, error.response?.data || error.message);

            // Handle different error types
            if (error.code === 'ECONNABORTED') {
                showErrorMessage('Server bilan bog\'lanishda vaqt tugadi');
            } else if (error.response?.status === 404) {
                showErrorMessage('API endpoint topilmadi');
            } else if (error.response?.status >= 500) {
                showErrorMessage('Server xatoligi yuz berdi');
            } else if (!error.response) {
                showErrorMessage('Internet aloqasini tekshiring');
            }

            return Promise.reject(error);
        }
    );
}

// ======================================================
// API FUNCTIONS
// ======================================================

/**
 * Fetch all products from API
 * @returns {Promise<Array>} Array of products
 */
async function fetchAllProducts() {
    try {
        const response = await axios.get(`${API_BASE_URL}api/v1/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
}

/**
 * Fetch products by category from API
 * @param {number} categoryId - Category ID
 * @returns {Promise<Array>} Array of products
 */
async function fetchProductsByCategory(categoryId) {
    try {
        const response = await axios.get(`${API_BASE_URL}api/v1/products/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
}

/**
 * Fetch spotlight categories for catalog
 * @returns {Promise<Array>} Array of spotlight categories
 */
async function fetchSpotlightCategories() {
    try {
        const response = await axios.get(`${API_BASE_URL}api/v1/spotlights/catalog`);
        return response.data;
    } catch (error) {
        console.error('Error fetching spotlight categories:', error);
        throw error;
    }
}

/**
 * Fetch single product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Product object
 */
async function fetchProductById(productId) {
    try {
        const response = await axios.get(`${API_BASE_URL}api/v1/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
}

/**
 * Search products by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of products
 */
async function searchProducts(query) {
    try {
        const response = await axios.get(`${API_BASE_URL}api/v1/products/search`, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
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
    if (!attachmentId) return '/placeholder.svg?height=350&width=280';
    return `${API_BASE_URL}api/v1/attachment/${attachmentId}`;
}

/**
 * Format price with currency
 * @param {number} price - Price value
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    if (!price) return '0 So\'m';
    return new Intl.NumberFormat('uz-UZ').format(price) + ' So\'m';
}

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current price
 * @returns {number} Discount percentage
 */
function calculateDiscountPercentage(originalPrice, currentPrice) {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
    return Math.round((1 - currentPrice / originalPrice) * 100);
}

/**
 * Get status badge configuration
 * @param {string} status - Product status
 * @returns {Object|null} Status configuration
 */
function getStatusConfig(status) {
    const statusConfigs = {
        'NEW': { text: 'YANGI', class: 'status-new', color: '#4CAF50' },
        'HOT': { text: 'ISSIQ', class: 'status-hot', color: '#FF5722' },
        'SALE': { text: 'CHEGIRMA', class: 'status-sale', color: '#FF9800' }
    };

    return statusConfigs[status] || null;
}

/**
 * Show loading spinner
 * @param {boolean} show - Show or hide spinner
 */
function showLoading(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const productsGrid = document.getElementById('productsGrid');

    if (show) {
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
        if (productsGrid) productsGrid.style.opacity = '0.5';
    } else {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (productsGrid) productsGrid.style.opacity = '1';
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fas fa-exclamation-triangle mb-2" style="font-size: 2rem;"></i>
                    <h4>Xatolik yuz berdi</h4>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Qayta yuklash</button>
                </div>
            </div>
        `;
    }
}

/**
 * Show success notification
 * @param {string} message - Success message
 */
function showSuccessNotification(message) {
    showNotification(message, 'success');
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Debounce function for search
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other files
window.API = {
    fetchAllProducts,
    fetchProductsByCategory,
    fetchSpotlightCategories,
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
    debounce
};
