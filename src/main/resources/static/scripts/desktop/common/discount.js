// ======================================================
// DISCOUNT CALCULATION UTILITIES
// ======================================================

/**
 * Discount calculation utilities for reuse across the application
 */
let DiscountUtils = {
    /**
     * Calculate discount information for a product
     * @param {Object} product - Product object with price, discount, and status
     * @returns {Object} - Discount calculation results
     */
    calculateDiscount: (product) => {
        const discountPercent = product.discount || 0
        const hasDiscount = product.status === "SALE" && discountPercent > 0

        // Backend sends original price
        const originalPrice = product.price
        const discountedPrice = hasDiscount ? originalPrice * (1 - discountPercent / 100) : originalPrice

        return {
            hasDiscount,
            discountedPrice,
            originalPrice,
            discountPercent,
        }
    },

    /**
     * Format discount percentage for display
     * @param {number} discountPercent - Discount percentage
     * @returns {string} - Formatted discount string
     */
    formatDiscountPercent: (discountPercent) => {
        return `-${discountPercent}%`
    },

    /**
     * Calculate savings amount
     * @param {number} originalPrice - Original price
     * @param {number} discountedPrice - Discounted price
     * @returns {number} - Savings amount
     */
    calculateSavings: (originalPrice, discountedPrice) => {
        return originalPrice - discountedPrice
    },
}

// Export for global use
if (typeof window !== "undefined") {
    window.DiscountUtils = DiscountUtils
}

// Export for module use
if (typeof module !== "undefined" && module.exports) {
    module.exports = DiscountUtils
}
