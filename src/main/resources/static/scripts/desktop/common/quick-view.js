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
        const response = await fetch(`${window.API_BASE_URL || ""}/assets/modals/desktop/quick-view-modal.html`)
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

    // Initialize mobile carousel
    initializeMobileCarousel(modal)

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
            <!-- Desktop Images -->
            <div class="quick-view-images" id="quickViewImages">
                <!-- Images will be populated here -->
            </div>
            
            <!-- Mobile Image Carousel -->
            <div class="mobile-image-carousel" id="mobileImageCarousel">
                <div class="mobile-images-container" id="mobileImagesContainer">
                    <!-- Mobile images will be populated here -->
                </div>
                <div class="mobile-image-dots" id="mobileImageDots">
                    <!-- Dots will be populated here -->
                </div>
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
                            <div class="available-quantity" id="availableQuantity" style="display: none;"></div>
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
                        <img src="/placeholder.svg?height=24&width=60&text=Click" alt="Click" />
                        <img src="/placeholder.svg?height=24&width=60&text=Payme" alt="Payme" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
}

/**
 * Enhanced mobile carousel initialization
 */
function initializeMobileCarousel(modal) {
    const carousel = modal.querySelector("#mobileImageCarousel")
    const container = modal.querySelector("#mobileImagesContainer")
    const dotsContainer = modal.querySelector("#mobileImageDots")

    if (!carousel || !container || !dotsContainer) {
        console.error("Mobile carousel elements not found") // Debug log
        return
    }

    console.log("Initializing mobile carousel") // Debug log

    let currentIndex = 0
    const totalImages = 0
    let startX = 0
    let currentX = 0
    let isDragging = false

    // Store carousel state
    modal._carouselState = {
        currentIndex: 0,
        totalImages: 0,
        updateCarousel: (index) => {
            console.log("Updating carousel to index:", index, "of", totalImages) // Debug log

            if (index < 0 || index >= totalImages) return

            currentIndex = index
            modal._carouselState.currentIndex = currentIndex

            // Update transform - show 2 images at a time
            const translateX = -(currentIndex * 50) // 50% per image since we show 2 at a time
            container.style.transform = `translateX(${translateX}%)`

            console.log("Applied transform:", `translateX(${translateX}%)`) // Debug log

            // Update dots
            const dots = dotsContainer.querySelectorAll(".mobile-dot")
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === currentIndex)
            })
        },
    }

    // Touch events for swipe
    container.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX
        isDragging = true
        container.style.transition = "none"
    })

    container.addEventListener("touchmove", (e) => {
        if (!isDragging) return

        currentX = e.touches[0].clientX
        const diffX = currentX - startX
        const currentTranslateX = -(currentIndex * 50)
        const newTranslateX = currentTranslateX + (diffX / container.offsetWidth) * 100

        container.style.transform = `translateX(${newTranslateX}%)`
    })

    container.addEventListener("touchend", (e) => {
        if (!isDragging) return

        isDragging = false
        container.style.transition = "transform 0.3s ease"

        const diffX = currentX - startX
        const threshold = 50 // Minimum swipe distance

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && currentIndex > 0) {
                // Swipe right - go to previous
                modal._carouselState.updateCarousel(currentIndex - 1)
            } else if (diffX < 0 && currentIndex < totalImages - 1) {
                // Swipe left - go to next
                modal._carouselState.updateCarousel(currentIndex + 1)
            } else {
                // Snap back to current
                modal._carouselState.updateCarousel(currentIndex)
            }
        } else {
            // Snap back to current
            modal._carouselState.updateCarousel(currentIndex)
        }
    })

    // Mouse events for desktop testing
    container.addEventListener("mousedown", (e) => {
        startX = e.clientX
        isDragging = true
        container.style.transition = "none"
        e.preventDefault()
    })

    container.addEventListener("mousemove", (e) => {
        if (!isDragging) return

        currentX = e.clientX
        const diffX = currentX - startX
        const currentTranslateX = -(currentIndex * 50)
        const newTranslateX = currentTranslateX + (diffX / container.offsetWidth) * 100

        container.style.transform = `translateX(${newTranslateX}%)`
    })

    container.addEventListener("mouseup", (e) => {
        if (!isDragging) return

        isDragging = false
        container.style.transition = "transform 0.3s ease"

        const diffX = currentX - startX
        const threshold = 50

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && currentIndex > 0) {
                modal._carouselState.updateCarousel(currentIndex - 1)
            } else if (diffX < 0 && currentIndex < totalImages - 1) {
                modal._carouselState.updateCarousel(currentIndex + 1)
            } else {
                modal._carouselState.updateCarousel(currentIndex)
            }
        } else {
            modal._carouselState.updateCarousel(currentIndex)
        }
    })

    // Prevent context menu on long press
    container.addEventListener("contextmenu", (e) => {
        e.preventDefault()
    })
}

/**
 * Enhanced quantity controls with size-based validation
 */
function initializeQuantityControls(modal) {
    let currentQuantity = 1
    let maxQuantity = 10
    const decreaseBtn = modal.querySelector("#decreaseQty")
    const increaseBtn = modal.querySelector("#increaseQty")
    const quantityDisplay = modal.querySelector("#quantityDisplay")

    const updateQuantityDisplay = () => {
        if (quantityDisplay) {
            quantityDisplay.textContent = currentQuantity
        }
        if (decreaseBtn) {
            decreaseBtn.disabled = currentQuantity <= 1
        }
        if (increaseBtn) {
            increaseBtn.disabled = currentQuantity >= maxQuantity
        }
    }

    decreaseBtn?.addEventListener("click", () => {
        if (currentQuantity > 1) {
            currentQuantity--
            updateQuantityDisplay()
        }
    })

    increaseBtn?.addEventListener("click", () => {
        if (currentQuantity < maxQuantity) {
            currentQuantity++
            updateQuantityDisplay()
        }
    })

    updateQuantityDisplay()

    modal._resetQuantity = () => {
        currentQuantity = 1
        updateQuantityDisplay()
    }

    modal._updateMaxQuantity = (newMaxQuantity) => {
        maxQuantity = newMaxQuantity
        if (currentQuantity > maxQuantity) {
            currentQuantity = maxQuantity
        }
        updateQuantityDisplay()
    }

    modal._getCurrentQuantity = () => currentQuantity
}

/**
 * Initialize copy link functionality
 */
function initializeCopyLink(modal) {
    const copyLinkSection = modal.querySelector("#copyLinkSection")
    copyLinkSection?.addEventListener("click", () => {
        const productId = modal.getAttribute("data-product-id")
        const productLink = `${window.API_BASE_URL || "https://prime77.uz"}/api/v1/product/${productId}`

        navigator.clipboard
            .writeText(productLink)
            .then(() => {
                showCopySuccess(copyLinkSection)
            })
            .catch(() => {
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
 * Update available quantity display and set max quantity for controls
 */
function updateAvailableQuantity(modal, selectedSize) {
    const availableQuantityElement = modal.querySelector("#availableQuantity")
    if (availableQuantityElement && selectedSize) {
        availableQuantityElement.textContent = `Mavjud: ${selectedSize.amount} ta`
        availableQuantityElement.style.display = "block"

        if (modal._updateMaxQuantity) {
            modal._updateMaxQuantity(selectedSize.amount)
        }
    } else if (availableQuantityElement) {
        availableQuantityElement.style.display = "none"
    }
}

/**
 * Enhanced populate function with better mobile carousel support
 */
function populateQuickViewModal(modal, product) {
    modal.setAttribute("data-product-id", product.id)

    const imageUrls = product.attachmentKeys?.map((key) => window.API.getImageUrl(key)) || []

    // FIXED: Ensure we have at least one image
    const imagesToShow = imageUrls.length > 0 ? imageUrls : [window.API.getImageUrl(null)]

    // Populate desktop images
    const imagesContainer = modal.querySelector("#quickViewImages")
    if (imagesContainer) {
        imagesContainer.innerHTML = ""
        imagesToShow.forEach((imageUrl, index) => {
            const imageItem = document.createElement("div")
            imageItem.className = "product-image-item"
            imageItem.innerHTML = `<img src="${imageUrl}" alt="${product.name} ${index + 1}" loading="lazy">`
            imagesContainer.appendChild(imageItem)
        })
    }

    // FIXED: Populate mobile carousel with proper error handling
    const mobileContainer = modal.querySelector("#mobileImagesContainer")
    const mobileDotsContainer = modal.querySelector("#mobileImageDots")

    if (mobileContainer && mobileDotsContainer) {
        console.log("Populating mobile carousel with", imagesToShow.length, "images") // Debug log

        mobileContainer.innerHTML = ""
        mobileDotsContainer.innerHTML = ""

        // Create mobile images
        imagesToShow.forEach((imageUrl, index) => {
            const imageItem = document.createElement("div")
            imageItem.className = "mobile-image-item"

            const img = document.createElement("img")
            img.src = imageUrl
            img.alt = `${product.name} ${index + 1}`
            img.loading = "lazy"

            // FIXED: Add error handling for images
            img.onerror = function () {
                console.log("Image failed to load:", imageUrl)
                this.src = window.API.getImageUrl(null) // Fallback image
            }

            img.onload = () => {
                console.log("Image loaded successfully:", imageUrl) // Debug log
            }

            imageItem.appendChild(img)
            mobileContainer.appendChild(imageItem)
        })

        // Create dots
        imagesToShow.forEach((_, index) => {
            const dot = document.createElement("div")
            dot.className = `mobile-dot ${index === 0 ? "active" : ""}`
            dot.addEventListener("click", () => {
                console.log("Dot clicked:", index) // Debug log
                if (modal._carouselState) {
                    modal._carouselState.updateCarousel(index)
                }
            })
            mobileDotsContainer.appendChild(dot)
        })

        // FIXED: Update carousel state with proper total count
        if (modal._carouselState) {
            modal._carouselState.totalImages = imagesToShow.length
            modal._carouselState.currentIndex = 0
            modal._carouselState.updateCarousel(0)
            console.log("Carousel state updated:", modal._carouselState) // Debug log
        }
    } else {
        console.error("Mobile carousel containers not found") // Debug log
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
        const originalPrice = product.price
        const discountedPrice = hasDiscount ? originalPrice * (1 - discountPercent / 100) : originalPrice

        if (hasDiscount) {
            pricingContainer.innerHTML = `
        <span class="product-current-price">${window.API.formatPrice(discountedPrice)}</span>
        <span class="product-original-price">${window.API.formatPrice(originalPrice)}</span>
        <span class="product-discount-badge">-${discountPercent}%</span>
      `
        } else {
            pricingContainer.innerHTML = `
        <span class="product-current-price">${window.API.formatPrice(originalPrice)}</span>
      `
        }
    }

    // Set description
    const descriptionElement = modal.querySelector("#quickViewDescription")
    if (descriptionElement) {
        descriptionElement.textContent = product.description || "Bu mahsulot haqida qo'shimcha ma'lumot mavjud emas."
    }

    // Set sizes
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

            sizeOption.textContent = sizeData.size

            if (isAvailable) {
                sizeOption.addEventListener("click", () => {
                    sizesContainer.querySelectorAll(".size-option").forEach((s) => s.classList.remove("selected"))
                    sizeOption.classList.add("selected")
                    updateAvailableQuantity(modal, sizeData)
                })
            }

            sizesContainer.appendChild(sizeOption)
        })

        const firstAvailableSize = allSizes.find((size) => size.amount > 0)
        if (firstAvailableSize) {
            updateAvailableQuantity(modal, firstAvailableSize)
        }
    } else if (sizesGroup) {
        sizesGroup.style.display = "none"
        if (modal._updateMaxQuantity) {
            modal._updateMaxQuantity(10)
        }
    }

    // Handle quantity controls
    const quantityControls = modal.querySelectorAll("#decreaseQty, #increaseQty, #quantityDisplay")
    const addToCartBtn = modal.querySelector("#addToCartBtn")

    if (!hasAvailableSizes && allSizes.length > 0) {
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
        quantityControls.forEach((control) => {
            if (control.id !== "decreaseQty") {
                control.disabled = false
            }
            if (control.id === "quantityDisplay") {
                control.style.opacity = "1"
            }
        })
        if (addToCartBtn) {
            addToCartBtn.disabled = false
            addToCartBtn.textContent = "SAVATGA"
        }
    }

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
