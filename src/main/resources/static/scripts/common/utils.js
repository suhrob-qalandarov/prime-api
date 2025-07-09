// ======================================================
// UTILITY FUNCTIONS
// ======================================================

window.Utils = {
    /**
     * Format price with currency
     */
    formatPrice(price) {
        if (!price) return "0 So'm"
        return new Intl.NumberFormat("uz-UZ").format(price) + " So'm"
    },

    /**
     * Calculate discount percentage
     */
    calculateDiscountPercentage(originalPrice, currentPrice) {
        if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0
        return Math.round((1 - currentPrice / originalPrice) * 100)
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    },

    /**
     * Show notification
     */
    showNotification(message, type = "info", duration = 3000) {
        const notification = document.createElement("div")
        notification.className = `notification ${type}`
        notification.textContent = message

        document.body.appendChild(notification)

        // Show notification
        setTimeout(() => {
            notification.classList.add("show")
        }, 100)

        // Hide notification
        setTimeout(() => {
            notification.classList.remove("show")
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification)
                }
            }, 300)
        }, duration)
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2)
    },

    /**
     * Check if device is mobile
     */
    isMobile() {
        return window.innerWidth <= 768
    },

    /**
     * Sanitize HTML
     */
    sanitizeHtml(str) {
        const temp = document.createElement("div")
        temp.textContent = str
        return temp.innerHTML
    },

    /**
     * Get query parameters
     */
    getQueryParams() {
        const params = new URLSearchParams(window.location.search)
        const result = {}
        for (const [key, value] of params) {
            result[key] = value
        }
        return result
    },

    /**
     * Set query parameters
     */
    setQueryParams(params) {
        const url = new URL(window.location)
        Object.keys(params).forEach((key) => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key])
            } else {
                url.searchParams.delete(key)
            }
        })
        window.history.replaceState({}, "", url)
    },
}
