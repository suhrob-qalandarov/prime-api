// ======================================================
// QUICK VIEW MODAL FUNCTIONALITY
// ======================================================

/**
 * Open product quick view modal with full product information
 */
async function openProductQuickView(productId) {
    try {
        // Show loading
        window.API.showLoading(true)

        // Fetch product details
        const product = await window.API.fetchProductById(productId)

        if (!product) {
            window.API.showErrorMessage("Mahsulot ma'lumotlari topilmadi")
            window.API.showLoading(false)
            return
        }

        // Create modal if it doesn't exist
        let modal = document.getElementById("productQuickViewModal")
        if (!modal) {
            modal = await createQuickViewModal()
            document.body.appendChild(modal)
        }

        // Populate modal with product data
        populateQuickViewModal(modal, product)

        // Show modal
        modal.classList.add("show")
        document.body.style.overflow = "hidden"

        window.API.showLoading(false)
    } catch (error) {
        console.error("Error opening quick view:", error)
        window.API.showLoading(false)
        window.API.showErrorMessage("Mahsulot ma'lumotlarini yuklashda xatolik yuz berdi")
    }
}

/**
 * Create quick view modal HTML structure by loading from external file
 */
async function createQuickViewModal() {
    const modal = document.createElement("div")
    modal.id = "productQuickViewModal"
    modal.className = "product-quick-view-modal"

    try {
        // Load modal HTML from external file
        const response = await fetch("quick-view-modal.html")
        const modalHTML = await response.text()
        modal.innerHTML = modalHTML
    } catch (error) {
        console.error("Error loading modal HTML:", error)
        // Fallback to inline HTML if file loading fails
        modal.innerHTML = getFallbackModalHTML()
    }

    // Add click outside to close
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeQuickViewModal()
        }
    })

    // Initialize quantity controls
    initializeQuantityControls(modal)

    // Add copy link functionality
    initializeCopyLink(modal)

    return modal
}

/**
 * Fallback modal HTML if external file fails to load
 */
function getFallbackModalHTML() {
    return `
    <div class="quick-view-content">
        <button class="quick-view-close" onclick="closeQuickViewModal()">&times;</button>
        <div class="quick-view-body">
            <div class="quick-view-images" id="quickViewImages">
                <!-- Images will be populated here -->
            </div>
            <div class="quick-view-info">
                <div class="quick-view-header">
                    <h2 class="quick-view-title">Quickview</h2>
                </div>
                
                <div class="quick-view-content-scroll">
                    <div class="product-category-small" id="quickViewCategory"></div>
                    <h3 class="product-title-large" id="quickViewTitle"></h3>
                    
                    <div class="product-price-section" id="quickViewPricing">
                        <!-- Pricing will be populated here -->
                    </div>
                    
                    <div class="product-description" id="quickViewDescription">
                        <!-- Description will be populated here -->
                    </div>
                    
                    <hr class="product-divider">
                    
                    <div class="product-options">
                        <div class="option-group" id="quickViewSizesGroup" style="display: none;">
                            <label class="option-label">O'lcham:</label>
                            <div class="size-options" id="quickViewSizes">
                                <!-- Sizes will be populated here -->
                            </div>
                        </div>
                        
                        <div class="option-group">
                            <label class="option-label">Miqdori:</label>
                            <div class="quantity-cart-section">
                                <div class="quantity-selector">
                                    <button class="quantity-btn" id="decreaseQty">−</button>
                                    <div class="quantity-display" id="quantityDisplay">1</div>
                                    <button class="quantity-btn" id="increaseQty">+</button>
                                </div>
                                <button class="add-to-cart-btn" id="addToCartBtn">SAVATGA</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="copy-link-section" id="copyLinkSection">
                        <svg class="copy-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                        </svg>
                        <span class="copy-link-text">Kiyim havolasini nusxala!</span>
                    </div>
                    
                    <div class="product-guarantee">
                        <svg class="guarantee-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <span>Kafolatlangan xarid</span>
                    </div>
                    
                    <div class="payment-methods">
                        <span>To'lov:</span>
                        <img src="/placeholder.svg?height=20&width=40&text=Click" alt="Click" />
                        <img src="/placeholder.svg?height=20&width=40&text=Payme" alt="Payme" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
}

/**
 * Initialize quantity controls
 */
function initializeQuantityControls(modal) {
    let currentQuantity = 1
    const decreaseBtn = modal.querySelector("#decreaseQty")
    const increaseBtn = modal.querySelector("#increaseQty")
    const quantityDisplay = modal.querySelector("#quantityDisplay")

    const updateQuantityDisplay = () => {
        if (quantityDisplay) {
            quantityDisplay.textContent = currentQuantity
        }
        if (decreaseBtn && !decreaseBtn.disabled) {
            decreaseBtn.disabled = currentQuantity <= 1
        }
        if (increaseBtn && !increaseBtn.disabled) {
            increaseBtn.disabled = currentQuantity >= 10
        }
    }

    decreaseBtn?.addEventListener("click", () => {
        if (currentQuantity > 1 && !decreaseBtn.disabled) {
            currentQuantity--
            updateQuantityDisplay()
        }
    })

    increaseBtn?.addEventListener("click", () => {
        if (currentQuantity < 10 && !increaseBtn.disabled) {
            currentQuantity++
            updateQuantityDisplay()
        }
    })

    // Initial state
    updateQuantityDisplay()

    // Store reference for reset
    modal._resetQuantity = () => {
        currentQuantity = 1
        updateQuantityDisplay()
    }

    // Store current quantity getter
    modal._getCurrentQuantity = () => currentQuantity
}

/**
 * Initialize copy link functionality
 */
function initializeCopyLink(modal) {
    const copyLinkSection = modal.querySelector("#copyLinkSection")
    copyLinkSection?.addEventListener("click", () => {
        const productId = modal.getAttribute("data-product-id")
        const productLink = `${window.API_BASE_URL || "https://api.prime77.uz"}/api/v1/product/${productId}`

        navigator.clipboard
            .writeText(productLink)
            .then(() => {
                showCopySuccess(copyLinkSection)
            })
            .catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement("textarea")
                textArea.value = productLink
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand("copy")
                document.body.removeChild(textArea)
                showCopySuccess(copyLinkSection)
            })
    })
}

/**
 * Show copy success message
 */
function showCopySuccess(copyLinkSection) {
    const copyText = copyLinkSection.querySelector(".copy-link-text")
    if (copyText) {
        const originalText = copyText.textContent
        copyText.textContent = "Nusxalandi!"
        copyText.classList.add("copy-success")

        setTimeout(() => {
            copyText.textContent = originalText
            copyText.classList.remove("copy-success")
        }, 2000)
    }
}

/**
 * Populate quick view modal with product data
 */
function populateQuickViewModal(modal, product) {
    // Store product ID for copy link functionality
    modal.setAttribute("data-product-id", product.id)

    // Get all image URLs
    const imageUrls = product.attachmentKeys?.map((key) => window.API.getImageUrl(key)) || []

    // Populate images
    const imagesContainer = modal.querySelector("#quickViewImages")
    if (imagesContainer) {
        imagesContainer.innerHTML = ""

        if (imageUrls.length > 0) {
            imageUrls.forEach((imageUrl, index) => {
                const imageItem = document.createElement("div")
                imageItem.className = "product-image-item"
                imageItem.innerHTML = `<img src="${imageUrl}" alt="${product.name} ${index + 1}">`
                imagesContainer.appendChild(imageItem)
            })
        } else {
            // Add placeholder if no images
            const imageItem = document.createElement("div")
            imageItem.className = "product-image-item"
            imageItem.innerHTML = `<img src="${window.API.getImageUrl(null)}" alt="${product.name}">`
            imagesContainer.appendChild(imageItem)
        }
    }

    // Set category
    const categoryElement = modal.querySelector("#quickViewCategory")
    if (categoryElement) {
        categoryElement.textContent = product.categoryName?.toUpperCase() || "MAHSULOT"
    }

    // Set title
    const titleElement = modal.querySelector("#quickViewTitle")
    if (titleElement) {
        titleElement.textContent = product.name
    }

    // Set pricing
    const pricingContainer = modal.querySelector("#quickViewPricing")
    if (pricingContainer) {
        const discountPercent = product.discount || 0
        const hasDiscount = product.status === "SALE" && discountPercent > 0
        const originalPrice = hasDiscount ? product.price / (1 - discountPercent / 100) : product.price

        if (hasDiscount) {
            pricingContainer.innerHTML = `
        <span class="product-current-price">${window.API.formatPrice(product.price)}</span>
        <span class="product-price-divider">|</span>
        <span class="product-original-price">${window.API.formatPrice(originalPrice)}</span>
        <span class="product-discount-badge">-${discountPercent}%</span>
      `
        } else {
            pricingContainer.innerHTML = `
        <span class="product-current-price">${window.API.formatPrice(product.price)}</span>
      `
        }
    }

    // Set description
    const descriptionElement = modal.querySelector("#quickViewDescription")
    if (descriptionElement) {
        descriptionElement.textContent = product.description || "Bu mahsulot haqida qo'shimcha ma'lumot mavjud emas."
    }

    // Set sizes with quantity display
    const sizesGroup = modal.querySelector("#quickViewSizesGroup")
    const sizesContainer = modal.querySelector("#quickViewSizes")
    const allSizes = product.productSizes || []
    const hasAvailableSizes = allSizes.some((size) => size.amount > 0)

    if (allSizes.length > 0 && sizesGroup && sizesContainer) {
        sizesGroup.style.display = "block"
        sizesContainer.innerHTML = ""

        allSizes.forEach((sizeData, index) => {
            const sizeOption = document.createElement("div")
            const isAvailable = sizeData.amount > 0
            sizeOption.className = `size-option ${index === 0 && isAvailable ? "selected" : ""} ${!isAvailable ? "disabled" : ""}`

            // Create size display with quantity on the side
            sizeOption.innerHTML = `
        <span>${sizeData.size}</span>
        <span class="size-quantity">(${sizeData.amount})</span>
      `

            if (isAvailable) {
                sizeOption.addEventListener("click", () => {
                    sizesContainer.querySelectorAll(".size-option").forEach((s) => s.classList.remove("selected"))
                    sizeOption.classList.add("selected")
                })
            }

            sizesContainer.appendChild(sizeOption)
        })
    } else if (sizesGroup) {
        sizesGroup.style.display = "none"
    }

    // Disable quantity controls if no available sizes
    const quantityControls = modal.querySelectorAll("#decreaseQty, #increaseQty, #quantityDisplay")
    const addToCartBtn = modal.querySelector("#addToCartBtn")

    if (!hasAvailableSizes && allSizes.length > 0) {
        // Disable quantity controls if product has sizes but none available
        quantityControls.forEach((control) => {
            control.disabled = true
            if (control.id === "quantityDisplay") {
                control.style.opacity = "0.5"
            }
        })
        if (addToCartBtn) {
            addToCartBtn.disabled = true
            addToCartBtn.textContent = "MAVJUD EMAS"
        }
    } else {
        // Enable quantity controls
        quantityControls.forEach((control) => {
            control.disabled = false
            if (control.id === "quantityDisplay") {
                control.style.opacity = "1"
            }
        })
        if (addToCartBtn) {
            addToCartBtn.disabled = false
            addToCartBtn.textContent = "SAVATGA"
        }
    }

    // Reset quantity
    if (modal._resetQuantity) {
        modal._resetQuantity()
    }
}

/**
 * Close quick view modal
 */
function closeQuickViewModal() {
    const modal = document.getElementById("productQuickViewModal")
    if (modal) {
        modal.classList.remove("show")
        document.body.style.overflow = ""
    }
}

// Make functions globally available
window.openProductQuickView = openProductQuickView
window.closeQuickViewModal = closeQuickViewModal

// Export for module use
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        openProductQuickView,
        closeQuickViewModal,
        createQuickViewModal,
        populateQuickViewModal,
    }
}
