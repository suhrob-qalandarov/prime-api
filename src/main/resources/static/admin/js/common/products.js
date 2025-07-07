// Global variables
let dashboardData = null
let allProducts = []
let activeProducts = []
let inactiveProducts = []
let categories = []
let filteredProducts = []
let selectedSizes = []
let uploadedAttachments = []
const bootstrap = window.bootstrap

// API Base URL
//const API_BASE_URL = "http://13.61.34.28/"

// Initialize products panel
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded - Products")
    checkAuth()
    initializeProductsPanel()
    loadProductsDashboard()
})

// Check authentication
function checkAuth() {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        console.log("No token found, redirecting to login")
        // window.location.href = "login.html"
        // return
    }
}

// Initialize products panel
function initializeProductsPanel() {
    setupSidebar()
    setupEventListeners()
    setupSearchInput()
    setupFileUpload()
}

// Setup sidebar
function setupSidebar() {
    const sidebarToggle = document.getElementById("sidebar-toggle")
    const sidebar = document.getElementById("sidebar")

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("show")
        })
    }
}

// Setup search input
function setupSearchInput() {
    const searchInput = document.getElementById("search-input")
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                searchProducts()
            }
        })
    }
}

// Setup event listeners
function setupEventListeners() {
    // Make functions available globally
    window.showAddProductModal = showAddProductModal
    window.showEditProductModal = showEditProductModal
    window.showViewProductModal = showViewProductModal
    window.saveProduct = saveProduct
    window.toggleProduct = toggleProduct
    window.filterProducts = filterProducts
    window.searchProducts = searchProducts
    window.clearSearch = clearSearch
    window.refreshData = refreshData
    window.toggleFullscreen = toggleFullscreen
    window.logout = logout
    window.removePreview = removePreview
    window.addSize = addSize
    window.removeSize = removeSize
}

// API request with token
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("accessToken")

    if (!token) {
        console.log("No token found")
        // For demo purposes, we'll continue without token
    }

    const headers = {
        ...options.headers,
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
        })

        console.log(`API Request: ${url}, Status: ${response.status}`)

        if (response.status === 401) {
            console.log("Unauthorized")
            // window.location.href = "login.html"
            // return null
        }

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            return await response.json()
        } else {
            return await response.text()
        }
    } catch (error) {
        console.error("API request error:", error)
        // For demo purposes, return mock data
        return getMockData(url)
    }
}

// Mock data for demo
function getMockData(url) {
    if (url.includes("/api/v1/admin/products")) {
        return {
            count: 15,
            activeCount: 12,
            inactiveCount: 3,
            productResList: [
                {
                    id: 1,
                    name: "iPhone 14 Pro",
                    status: "HOT",
                    active: true,
                    categoryName: "Elektronika",
                    attachmentCount: 3,
                    collectionName: "Apple Collection",
                    sizeCount: 2,
                },
                {
                    id: 2,
                    name: "Nike Air Max",
                    status: "NEW",
                    active: true,
                    categoryName: "Poyabzal",
                    attachmentCount: 5,
                    collectionName: "Nike Collection",
                    sizeCount: 6,
                },
                {
                    id: 3,
                    name: "Samsung Galaxy S23",
                    status: "SALE",
                    active: true,
                    categoryName: "Elektronika",
                    attachmentCount: 4,
                    collectionName: "Samsung Collection",
                    sizeCount: 1,
                },
                {
                    id: 4,
                    name: "Adidas Ultraboost",
                    status: "HOT",
                    active: false,
                    categoryName: "Poyabzal",
                    attachmentCount: 3,
                    collectionName: "Adidas Collection",
                    sizeCount: 5,
                },
            ],
            activeProductResList: [
                {
                    id: 1,
                    name: "iPhone 14 Pro",
                    status: "HOT",
                    active: true,
                    categoryName: "Elektronika",
                    attachmentCount: 3,
                    collectionName: "Apple Collection",
                    sizeCount: 2,
                },
                {
                    id: 2,
                    name: "Nike Air Max",
                    status: "NEW",
                    active: true,
                    categoryName: "Poyabzal",
                    attachmentCount: 5,
                    collectionName: "Nike Collection",
                    sizeCount: 6,
                },
                {
                    id: 3,
                    name: "Samsung Galaxy S23",
                    status: "SALE",
                    active: true,
                    categoryName: "Elektronika",
                    attachmentCount: 4,
                    collectionName: "Samsung Collection",
                    sizeCount: 1,
                },
            ],
            inactiveProductResList: [
                {
                    id: 4,
                    name: "Adidas Ultraboost",
                    status: "HOT",
                    active: false,
                    categoryName: "Poyabzal",
                    attachmentCount: 3,
                    collectionName: "Adidas Collection",
                    sizeCount: 5,
                },
            ],
        }
    }

    if (url.includes("/api/v1/categories/active")) {
        return [
            { id: 1, name: "Elektronika" },
            { id: 2, name: "Poyabzal" },
            { id: 3, name: "Kiyim" },
            { id: 4, name: "Aksessuarlar" },
        ]
    }

    if (url.includes("/api/v1/admin/product/")) {
        const productId = url.split("/").pop()
        return {
            id: Number.parseInt(productId),
            name: "iPhone 14 Pro",
            description: "Apple iPhone 14 Pro with advanced camera system",
            price: 15000000,
            active: true,
            status: "HOT",
            categoryName: "Elektronika",
            collectionName: "Apple Collection",
            attachments: [
                { id: 1, key: "img1", filename: "iphone1.jpg" },
                { id: 2, key: "img2", filename: "iphone2.jpg" },
                { id: 3, key: "img3", filename: "iphone3.jpg" },
            ],
            productSizes: [
                { size: "SIZE_128GB", amount: 10 },
                { size: "SIZE_256GB", amount: 5 },
            ],
            createdAt: "2024-01-15T10:30:00",
            updatedAt: "2024-01-15T10:30:00",
        }
    }

    return null
}

// Upload multiple attachments
async function uploadAttachments(files) {
    try {
        const formData = new FormData()
        Array.from(files).forEach((file) => {
            formData.append("files", file)
        })

        const response = await fetch(`${API_BASE_URL}/api/v1/admin/attachments/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData,
        })

        if (!response.ok) {
            throw new Error("Attachments upload failed")
        }

        return await response.json()
    } catch (error) {
        console.error("Error uploading attachments:", error)
        // Mock response for demo
        return Array.from(files).map((file, index) => ({
            id: Date.now() + index,
            key: `mock-key-${Date.now()}-${index}`,
            filename: file.name,
            contentType: file.type,
        }))
    }
}

// Load products dashboard data
async function loadProductsDashboard() {
    try {
        showLoading()

        console.log("Loading products dashboard...")

        // Single API call to get all product data
        dashboardData = await apiRequest("/api/v1/admin/products")

        if (dashboardData) {
            console.log("Dashboard data loaded:", dashboardData)

            // Update local data
            allProducts = dashboardData.productResList || []
            activeProducts = dashboardData.activeProductResList || []
            inactiveProducts = dashboardData.inactiveProductResList || []
            filteredProducts = [...allProducts]

            // Update statistics
            updateProductStats()

            // Render table
            renderProductsTable(filteredProducts)
        } else {
            console.error("No dashboard data received")
            showNotification("error", "Ma'lumotlar yuklanmadi")
        }

        hideLoading()
    } catch (error) {
        console.error("Error loading products dashboard:", error)
        showNotification("error", "Mahsulotlar ma'lumotlarini yuklashda xatolik")
        hideLoading()
    }
}

// Update product statistics
function updateProductStats() {
    if (dashboardData) {
        console.log("Updating stats:", dashboardData)
        animateCounter("total-products", dashboardData.count || 0)
        animateCounter("active-products", dashboardData.activeCount || 0)
        animateCounter("inactive-products", dashboardData.inactiveCount || 0)
    }
}

// Render products table
function renderProductsTable(products) {
    const tbody = document.getElementById("products-table")
    if (!tbody) {
        console.error("Products table tbody not found")
        return
    }

    console.log("Rendering products:", products)

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Ma\'lumotlar mavjud emas</td></tr>'
        return
    }

    tbody.innerHTML = products
        .map(
            (product) => `
        <tr class="fade-in">
            <td>${product.id}</td>
            <td class="fw-bold">${product.name}</td>
            <td>${product.categoryName || "-"}</td>
            <td>
                <span class="product-status-badge ${product.status?.toLowerCase() || "new"}">
                    ${getStatusText(product.status)}
                </span>
            </td>
            <td>
                <span class="status-badge ${product.active ? "active" : "inactive"}">
                    ${product.active ? "FAOL" : "NOFAOL"}
                </span>
            </td>
            <td>
                <span class="badge bg-info">${product.attachmentCount || 0}</span>
            </td>
            <td>
                <span class="badge bg-secondary">${product.sizeCount || 0}</span>
            </td>
            <td>
                <button class="action-btn edit" onclick="showViewProductModal(${product.id})" title="Ko'rish">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="showEditProductModal(${product.id})" title="Tahrirlash">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn ${product.active ? "delete" : "edit"}" onclick="toggleProduct(${product.id})" title="${product.active ? "Nofaollashtirish" : "Faollashtirish"}">
                    <i class="fas fa-${product.active ? "pause" : "play"}"></i>
                </button>
            </td>
        </tr>
    `,
        )
        .join("")
}

// Get status text
function getStatusText(status) {
    switch (status) {
        case "NEW":
            return "Yangi"
        case "HOT":
            return "Mashhur"
        case "SALE":
            return "Chegirma"
        default:
            return "Yangi"
    }
}

// Load categories for select options
async function loadCategories() {
    try {
        if (categories.length === 0) {
            categories = (await apiRequest("/api/v1/categories/active")) || []
        }
        return categories
    } catch (error) {
        console.error("Error loading categories:", error)
        showNotification("error", "Kategoriyalar yuklashda xatolik")
        return []
    }
}

// Populate category select
async function populateCategorySelect(selectId, selectedId = null) {
    const select = document.getElementById(selectId)
    if (!select) return

    const categoriesList = await loadCategories()

    select.innerHTML =
        '<option value="">Kategoriya tanlang</option>' +
        categoriesList
            .map(
                (category) =>
                    `<option value="${category.id}" ${selectedId === category.id ? "selected" : ""}>${category.name}</option>`,
            )
            .join("")
}

// Show add product modal
async function showAddProductModal() {
    document.getElementById("productModalTitle").textContent = "Mahsulot qo'shish"
    document.getElementById("save-btn-text").textContent = "Saqlash"
    document.getElementById("product-form").reset()
    document.getElementById("product-id").value = ""
    document.getElementById("product-active").checked = true
    document.getElementById("product-file-preview").innerHTML = ""
    document.getElementById("selected-sizes").innerHTML = ""

    // Reset global variables
    selectedSizes = []
    uploadedAttachments = []

    // Populate category select
    await populateCategorySelect("product-category")

    const modal = new bootstrap.Modal(document.getElementById("productModal"))
    modal.show()
}

// Show edit product modal
async function showEditProductModal(productId) {
    try {
        // Find product in local data first
        let product = allProducts.find((prod) => prod.id === productId)

        if (!product) {
            // Fallback to API call for full product details
            product = await apiRequest(`/api/v1/admin/product/${productId}`)
        }

        if (!product) {
            showNotification("error", "Mahsulot ma'lumotlari topilmadi")
            return
        }

        document.getElementById("productModalTitle").textContent = "Mahsulotni tahrirlash"
        document.getElementById("save-btn-text").textContent = "Yangilash"
        document.getElementById("product-id").value = product.id
        document.getElementById("product-name").value = product.name
        document.getElementById("product-description").value = product.description || ""
        document.getElementById("product-price").value = product.price || ""
        document.getElementById("product-active").checked = product.active

        // Set status
        if (product.status) {
            document.getElementById("product-status").value = product.status
        }

        // Populate category select with current selection
        await populateCategorySelect("product-category", product.categoryId)

        // Load existing sizes if available
        if (product.productSizes) {
            selectedSizes = product.productSizes.map((ps) => ({
                size: ps.size,
                amount: ps.amount,
            }))
            renderSelectedSizes()
        }

        // Load existing images if available
        if (product.attachments) {
            uploadedAttachments = product.attachments
            renderImagePreviews()
        }

        const modal = new bootstrap.Modal(document.getElementById("productModal"))
        modal.show()
    } catch (error) {
        console.error("Error loading product for edit:", error)
        showNotification("error", "Mahsulot ma'lumotlarini yuklashda xatolik")
    }
}

// Show view product modal
async function showViewProductModal(productId) {
    try {
        // Get full product details
        const product = await apiRequest(`/api/v1/admin/product/${productId}`)

        if (!product) {
            showNotification("error", "Mahsulot ma'lumotlari topilmadi")
            return
        }

        // Populate view modal
        document.getElementById("view-product-id").textContent = product.id
        document.getElementById("view-product-name").textContent = product.name
        document.getElementById("view-product-description").textContent = product.description || "-"
        document.getElementById("view-product-price").innerHTML = product.price
            ? `<span class="price-display">${formatPrice(product.price)}</span>`
            : "-"
        document.getElementById("view-product-category").textContent = product.categoryName || "-"
        document.getElementById("view-product-collection").textContent = product.collectionName || "-"

        // Status
        document.getElementById("view-product-status").innerHTML = `
            <span class="product-status-badge ${product.status?.toLowerCase() || "new"}">
                ${getStatusText(product.status)}
            </span>
        `

        // Active status
        document.getElementById("view-product-active").innerHTML = `
            <span class="status-badge ${product.active ? "active" : "inactive"}">
                ${product.active ? "FAOL" : "NOFAOL"}
            </span>
        `

        document.getElementById("view-product-created-at").textContent = formatDate(product.createdAt)
        document.getElementById("view-product-updated-at").textContent = formatDate(product.updatedAt)

        // Display images
        displayProductImages(product.attachments)

        // Display sizes
        displayProductSizes(product.productSizes)

        const modal = new bootstrap.Modal(document.getElementById("viewProductModal"))
        modal.show()
    } catch (error) {
        console.error("Error viewing product:", error)
        showNotification("error", "Mahsulot ma'lumotlarini yuklashda xatolik")
    }
}

// Display product images in view modal
function displayProductImages(attachments) {
    const container = document.getElementById("view-product-images")

    if (!attachments || attachments.length === 0) {
        container.innerHTML = `
            <div class="d-flex align-items-center justify-content-center bg-light rounded" style="height: 300px;">
                <div class="text-center">
                    <i class="fas fa-image fa-3x text-muted mb-3"></i>
                    <div class="text-muted">Rasmlar mavjud emas</div>
                </div>
            </div>
        `
        return
    }

    container.innerHTML = `
        <div class="product-images-grid">
            ${attachments
        .map(
            (attachment) => `
                <div class="product-image-item">
                    <img src="${API_BASE_URL}/api/v1/attachment/${attachment.key}" 
                         alt="${attachment.filename}"
                         onerror="this.src='/placeholder.svg?height=150&width=150'">
                </div>
            `,
        )
        .join("")}
        </div>
    `
}

// Display product sizes in view modal
function displayProductSizes(productSizes) {
    const container = document.getElementById("view-product-sizes")

    if (!productSizes || productSizes.length === 0) {
        container.innerHTML = "<p class=\"text-muted\">O'lchamlar ma'lumoti mavjud emas</p>"
        return
    }

    container.innerHTML = `
        <div class="sizes-display">
            ${productSizes
        .map(
            (ps) => `
                <div class="size-badge">
                    <span>${getSizeDisplayText(ps.size)}</span>
                    <span class="size-count">${ps.amount}</span>
                </div>
            `,
        )
        .join("")}
        </div>
    `
}

// Setup file upload
function setupFileUpload() {
    const uploadArea = document.getElementById("product-file-upload-area")
    const fileInput = document.getElementById("product-file-input")
    const preview = document.getElementById("product-file-preview")

    if (!uploadArea || !fileInput || !preview) return

    uploadArea.addEventListener("click", () => fileInput.click())

    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault()
        uploadArea.classList.add("dragover")
    })

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("dragover")
    })

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault()
        uploadArea.classList.remove("dragover")
        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFileSelection(files)
        }
    })

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files)
        }
    })
}

// Handle file selection
function handleFileSelection(files) {
    const preview = document.getElementById("product-file-preview")

    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const previewItem = document.createElement("div")
                previewItem.className = "preview-item"
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="preview-remove" onclick="removePreview(this, ${uploadedAttachments.length + index})">
                        <i class="fas fa-times"></i>
                    </button>
                `
                preview.appendChild(previewItem)
            }
            reader.readAsDataURL(file)

            // Add to uploaded attachments for tracking
            uploadedAttachments.push({
                file: file,
                isNew: true,
                index: uploadedAttachments.length + index,
            })
        }
    })
}

// Render existing image previews
function renderImagePreviews() {
    const preview = document.getElementById("product-file-preview")
    preview.innerHTML = ""

    uploadedAttachments.forEach((attachment, index) => {
        const previewItem = document.createElement("div")
        previewItem.className = "preview-item"

        if (attachment.isNew) {
            // New file - show from file reader
            const reader = new FileReader()
            reader.onload = (e) => {
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="preview-remove" onclick="removePreview(this, ${index})">
                        <i class="fas fa-times"></i>
                    </button>
                `
            }
            reader.readAsDataURL(attachment.file)
        } else {
            // Existing attachment
            previewItem.innerHTML = `
                <img src="${API_BASE_URL}/api/v1/attachment/${attachment.key}" 
                     alt="${attachment.filename}"
                     onerror="this.src='/placeholder.svg?height=100&width=100'">
                <button type="button" class="preview-remove" onclick="removePreview(this, ${index})">
                    <i class="fas fa-times"></i>
                </button>
            `
        }

        preview.appendChild(previewItem)
    })
}

// Remove preview
function removePreview(button, index) {
    button.parentElement.remove()
    uploadedAttachments.splice(index, 1)
    renderImagePreviews() // Re-render to fix indices
}

// Add size
function addSize() {
    const sizeSelect = document.getElementById("size-select")
    const amountInput = document.getElementById("size-amount")

    const selectedSize = sizeSelect.value
    const amount = Number.parseInt(amountInput.value)

    if (!selectedSize) {
        showNotification("warning", "O'lcham tanlang")
        return
    }

    if (!amount || amount <= 0) {
        showNotification("warning", "Miqdorni kiriting")
        return
    }

    // Check if size already exists
    const existingIndex = selectedSizes.findIndex((s) => s.size === selectedSize)
    if (existingIndex !== -1) {
        selectedSizes[existingIndex].amount = amount
    } else {
        selectedSizes.push({ size: selectedSize, amount: amount })
    }

    // Reset inputs
    sizeSelect.value = ""
    amountInput.value = ""

    renderSelectedSizes()
}

// Remove size
function removeSize(index) {
    selectedSizes.splice(index, 1)
    renderSelectedSizes()
}

// Render selected sizes
function renderSelectedSizes() {
    const container = document.getElementById("selected-sizes")

    if (selectedSizes.length === 0) {
        container.innerHTML = '<p class="text-muted">Hech qanday o\'lcham tanlanmagan</p>'
        return
    }

    container.innerHTML = selectedSizes
        .map(
            (sizeItem, index) => `
        <div class="size-item">
            <div class="size-info">
                <span class="size-label">${getSizeDisplayText(sizeItem.size)}</span>
                <span class="size-amount">${sizeItem.amount} dona</span>
            </div>
            <button type="button" class="size-remove" onclick="removeSize(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `,
        )
        .join("")
}

// Get size display text
function getSizeDisplayText(size) {
    if (size.startsWith("SIZE_")) {
        return size.replace("SIZE_", "")
    }
    return size
}

// Save product
async function saveProduct() {
    try {
        const productId = document.getElementById("product-id").value
        const name = document.getElementById("product-name").value.trim()
        const description = document.getElementById("product-description").value.trim()
        const price = Number.parseFloat(document.getElementById("product-price").value)
        const categoryId = document.getElementById("product-category").value
        const status = document.getElementById("product-status").value
        const isActive = document.getElementById("product-active").checked

        if (!name) {
            showNotification("warning", "Mahsulot nomini kiriting")
            return
        }

        if (!categoryId) {
            showNotification("warning", "Kategoriya tanlang")
            return
        }

        if (!status) {
            showNotification("warning", "Status tanlang")
            return
        }

        if (selectedSizes.length === 0) {
            showNotification("warning", "Kamida bitta o'lcham qo'shing")
            return
        }

        // Upload new images first
        let attachmentIds = []
        const newFiles = uploadedAttachments.filter((att) => att.isNew).map((att) => att.file)

        if (newFiles.length > 0) {
            showNotification("info", "Rasmlar yuklanmoqda...")
            const uploadedFiles = await uploadAttachments(newFiles)
            attachmentIds = uploadedFiles.map((file) => file.id)
        }

        // Add existing attachment IDs
        const existingAttachmentIds = uploadedAttachments.filter((att) => !att.isNew).map((att) => att.id)

        attachmentIds = [...attachmentIds, ...existingAttachmentIds]

        const productData = {
            name: name,
            description: description,
            price: price,
            active: isActive,
            status: status,
            categoryId: Number.parseInt(categoryId),
            attachmentIds: attachmentIds,
            productSizes: selectedSizes.map((s) => ({
                sizes: s.size,
                amount: s.amount,
            })),
        }

        let response
        let newProduct

        if (productId) {
            // Update existing product
            response = await apiRequest(`/api/v1/admin/product/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            })
            newProduct = response
        } else {
            // Create new product
            response = await apiRequest("/api/v1/admin/product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            })
            newProduct = response
        }

        if (newProduct) {
            showNotification("success", "Mahsulot muvaffaqiyatli saqlandi")

            // Update local data
            if (productId) {
                updateProductInLocalData(newProduct)
            } else {
                addProductToLocalData(newProduct)
            }

            // Update filtered products based on current filter
            applyCurrentFilter()

            // Re-render table and update stats
            renderProductsTable(filteredProducts)
            updateProductStats()

            const modal = bootstrap.Modal.getInstance(document.getElementById("productModal"))
            modal.hide()
        }
    } catch (error) {
        console.error("Error saving product:", error)
        showNotification("error", "Mahsulotni saqlashda xatolik")
    }
}

// Toggle product active status
async function toggleProduct(productId) {
    try {
        const response = await apiRequest(`/api/v1/admin/product/toggle/${productId}`, {
            method: "PATCH",
        })

        if (response === "OK" || response === 200) {
            // Find product in all products
            const productIndex = allProducts.findIndex((prod) => prod.id === productId)
            if (productIndex !== -1) {
                const product = allProducts[productIndex]
                const wasActive = product.active
                product.active = !product.active

                // Move product between active and inactive arrays
                if (wasActive) {
                    // Move from active to inactive
                    const activeIndex = activeProducts.findIndex((prod) => prod.id === productId)
                    if (activeIndex !== -1) {
                        const [movedProduct] = activeProducts.splice(activeIndex, 1)
                        movedProduct.active = false
                        inactiveProducts.push(movedProduct)
                    }
                } else {
                    // Move from inactive to active
                    const inactiveIndex = inactiveProducts.findIndex((prod) => prod.id === productId)
                    if (inactiveIndex !== -1) {
                        const [movedProduct] = inactiveProducts.splice(inactiveIndex, 1)
                        movedProduct.active = true
                        activeProducts.push(movedProduct)
                    }
                }

                // Update dashboard data counts
                if (dashboardData) {
                    dashboardData.activeCount = activeProducts.length
                    dashboardData.inactiveCount = inactiveProducts.length
                    dashboardData.activeProductResList = [...activeProducts]
                    dashboardData.inactiveProductResList = [...inactiveProducts]
                }

                // Update filtered products based on current filter
                applyCurrentFilter()

                // Re-render and update stats without page refresh
                renderProductsTable(filteredProducts)
                updateProductStats()

                showNotification("success", `Mahsulot ${product.active ? "faollashtirildi" : "nofaollashtirildi"}`)
            }
        }
    } catch (error) {
        console.error("Error toggling product:", error)
        showNotification("error", "Mahsulot holatini o'zgartirishda xatolik")
    }
}

// Helper functions for local data management
function addProductToLocalData(newProduct) {
    allProducts.push(newProduct)

    if (newProduct.active) {
        activeProducts.push(newProduct)
        if (dashboardData) dashboardData.activeCount++
    } else {
        inactiveProducts.push(newProduct)
        if (dashboardData) dashboardData.inactiveCount++
    }

    if (dashboardData) {
        dashboardData.count++
        dashboardData.productResList = [...allProducts]
        dashboardData.activeProductResList = [...activeProducts]
        dashboardData.inactiveProductResList = [...inactiveProducts]
    }
}

function updateProductInLocalData(updatedProduct) {
    const updateInArray = (array) => {
        const index = array.findIndex((prod) => prod.id === updatedProduct.id)
        if (index !== -1) {
            array[index] = { ...array[index], ...updatedProduct }
        }
    }

    updateInArray(allProducts)
    updateInArray(activeProducts)
    updateInArray(inactiveProducts)

    // Update dashboard data
    if (dashboardData) {
        dashboardData.productResList = [...allProducts]
        dashboardData.activeProductResList = [...activeProducts]
        dashboardData.inactiveProductResList = [...inactiveProducts]
    }
}

// Apply current filter to update filteredProducts
function applyCurrentFilter() {
    const statusFilter = document.getElementById("status-filter")?.value || "all"

    switch (statusFilter) {
        case "all":
            filteredProducts = [...allProducts]
            break
        case "active":
            filteredProducts = [...activeProducts]
            break
        case "inactive":
            filteredProducts = [...inactiveProducts]
            break
        default:
            filteredProducts = [...allProducts]
    }
}

// Filter products
function filterProducts() {
    applyCurrentFilter()
    renderProductsTable(filteredProducts)
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById("search-input")?.value.trim().toLowerCase()

    if (!searchTerm) {
        filterProducts() // Reset to current filter
        return
    }

    filteredProducts = allProducts.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.categoryName && product.categoryName.toLowerCase().includes(searchTerm)) ||
            (product.status && product.status.toLowerCase().includes(searchTerm)),
    )

    renderProductsTable(filteredProducts)
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById("search-input")
    if (searchInput) {
        searchInput.value = ""
    }
    filterProducts()
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return "-"

    try {
        const date = new Date(dateString)
        return (
            date.toLocaleDateString("uz-UZ") + " " + date.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
        )
    } catch (error) {
        return "-"
    }
}

function formatPrice(price) {
    if (!price) return "0"
    return new Intl.NumberFormat("uz-UZ").format(price)
}

function refreshData() {
    loadProductsDashboard()
    showNotification("success", "Ma'lumotlar yangilandi")
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId)
    if (!element) return

    const startValue = 0
    const duration = 1000
    const startTime = performance.now()

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        element.textContent = Math.floor(startValue + (targetValue - startValue) * progress)

        if (progress < 1) {
            requestAnimationFrame(updateCounter)
        }
    }

    requestAnimationFrame(updateCounter)
}

function showLoading() {
    const overlay = document.createElement("div")
    overlay.id = "loading-overlay"
    overlay.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Yuklanmoqda...</p>
    `
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255, 255, 255, 0.9); display: flex; flex-direction: column;
        align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(5px);
    `
    document.body.appendChild(overlay)
}

function hideLoading() {
    const overlay = document.getElementById("loading-overlay")
    if (overlay) {
        overlay.remove()
    }
}

function showNotification(type, message) {
    const notification = document.createElement("div")
    notification.className = `alert alert-${type === "success" ? "success" : type === "error" ? "danger" : type === "warning" ? "warning" : "info"} alert-dismissible fade show position-fixed`
    notification.style.cssText = "top: 20px; right: 20px; z-index: 10000; max-width: 350px; animation: slideIn 0.3s ease;"

    notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : type === "warning" ? "exclamation-triangle" : "info-circle"} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove()
        }
    }, 5000)
}

function logout() {
    if (confirm("Chiqishni xohlaysizmi?")) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        showNotification("success", "Muvaffaqiyatli chiqildi")
        setTimeout(() => {
            window.location.href = "login.html"
        }, 1000)
    }
}
