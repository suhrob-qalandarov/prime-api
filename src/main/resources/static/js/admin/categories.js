// Global variables
let dashboardData = null
let allCategories = []
let activeCategories = []
let inactiveCategories = []
let spotlights = []
let filteredCategories = []
const bootstrap = window.bootstrap

// API Base URL
const API_BASE_URL = "http://localhost"

// Initialize categories panel
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded - Categories")
    checkAuth()
    initializeCategoriesPanel()
    loadCategoriesDashboard()
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

// Initialize categories panel
function initializeCategoriesPanel() {
    setupSidebar()
    setupEventListeners()
    setupSearchInput()
    setupImageUploadToggle()
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
                searchCategories()
            }
        })
    }
}

// Setup event listeners
function setupEventListeners() {
    // Make functions available globally
    window.showAddCategoryModal = showAddCategoryModal
    window.showEditCategoryModal = showEditCategoryModal
    window.showViewCategoryModal = showViewCategoryModal
    window.showOrderCategoriesModal = showOrderCategoriesModal
    window.saveCategory = saveCategory
    window.saveCategoryOrder = saveCategoryOrder
    window.toggleCategory = toggleCategory
    window.filterCategories = filterCategories
    window.searchCategories = searchCategories
    window.clearSearch = clearSearch
    window.refreshData = refreshData
    window.toggleFullscreen = toggleFullscreen
    window.logout = logout
    window.removePreview = removePreview

    // Setup file upload
    setupCategoryFileUpload()
}

// Setup image upload toggle
function setupImageUploadToggle() {
    setTimeout(() => {
        const enableImageUpload = document.getElementById("enable-image-upload")
        const imageUploadSection = document.getElementById("image-upload-section")

        if (enableImageUpload && imageUploadSection) {
            enableImageUpload.addEventListener("change", function () {
                if (this.checked) {
                    imageUploadSection.style.display = "block"
                } else {
                    imageUploadSection.style.display = "none"
                    const fileInput = document.getElementById("category-file-input")
                    const filePreview = document.getElementById("category-file-preview")
                    if (fileInput) fileInput.value = ""
                    if (filePreview) filePreview.innerHTML = ""
                    updateCategoryImagePreview()
                }
            })
        }
    }, 100)
}

// API request with token
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("accessToken")

    if (!token) {
        console.log("No token found")
        // For demo purposes, we'll continue without token
        // window.location.href = "login.html"
        // return null
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
    if (url.includes("/api/v1/admin/categories/dashboard")) {
        return {
            count: 8,
            activeCount: 6,
            inactiveCount: 2,
            categoryResList: [
                {
                    id: 1,
                    name: "Elektronika",
                    spotlightName: "ELECTRONICS",
                    order: 1,
                    active: true,
                    imageKey: "electronics-img-key",
                },
                { id: 2, name: "Kiyim", spotlightName: "CLOTHING", order: 2, active: true, imageKey: null },
                { id: 3, name: "Kitoblar", spotlightName: "BOOKS", order: 3, active: true, imageKey: "books-img-key" },
                { id: 4, name: "Sport", spotlightName: "SPORTS", order: 4, active: true, imageKey: null },
                { id: 5, name: "Uy-ro'zg'or", spotlightName: "HOME", order: 5, active: true, imageKey: "home-img-key" },
                { id: 6, name: "Avtomobil", spotlightName: "AUTO", order: 6, active: true, imageKey: null },
                { id: 7, name: "Salomatlik", spotlightName: "HEALTH", order: 7, active: false, imageKey: null },
                { id: 8, name: "Go'zallik", spotlightName: "BEAUTY", order: 8, active: false, imageKey: "beauty-img-key" },
            ],
            activeCategoryResList: [
                {
                    id: 1,
                    name: "Elektronika",
                    spotlightName: "ELECTRONICS",
                    order: 1,
                    active: true,
                    imageKey: "electronics-img-key",
                },
                { id: 2, name: "Kiyim", spotlightName: "CLOTHING", order: 2, active: true, imageKey: null },
                { id: 3, name: "Kitoblar", spotlightName: "BOOKS", order: 3, active: true, imageKey: "books-img-key" },
                { id: 4, name: "Sport", spotlightName: "SPORTS", order: 4, active: true, imageKey: null },
                { id: 5, name: "Uy-ro'zg'or", spotlightName: "HOME", order: 5, active: true, imageKey: "home-img-key" },
                { id: 6, name: "Avtomobil", spotlightName: "AUTO", order: 6, active: true, imageKey: null },
            ],
            inactiveCategoryResList: [
                { id: 7, name: "Salomatlik", spotlightName: "HEALTH", order: 7, active: false, imageKey: null },
                { id: 8, name: "Go'zallik", spotlightName: "BEAUTY", order: 8, active: false, imageKey: "beauty-img-key" },
            ],
        }
    }

    if (url.includes("/api/v1/spotlights/category")) {
        return [
            { id: 1, name: "Electronics" },
            { id: 2, name: "Clothing" },
            { id: 3, name: "Books" },
            { id: 4, name: "Sports" },
            { id: 5, name: "Home" },
            { id: 6, name: "Auto" },
            { id: 7, name: "Health" },
            { id: 8, name: "Beauty" },
        ]
    }

    if (url.includes("/api/v1/admin/attachment/with-key/")) {
        const key = url.split("/").pop()
        return {
            id: 1,
            key: key,
            filename: `${key}.jpg`,
            contentType: "image/jpeg",
            active: true,
            createdAt: "2024-01-15T10:30:00",
            updatedAt: "2024-01-15T10:30:00",
            createdBy: "admin",
            updatedBy: "admin",
        }
    }

    return null
}

// Upload image file
async function uploadImageFile(file) {
    try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch(`${API_BASE_URL}/api/v1/admin/attachment`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData,
        })

        if (!response.ok) {
            throw new Error("Image upload failed")
        }

        return await response.json()
    } catch (error) {
        console.error("Error uploading image:", error)
        // Mock response for demo
        return {
            id: Date.now(),
            key: `mock-key-${Date.now()}`,
            filename: file.name,
            contentType: file.type,
        }
    }
}

// Load categories dashboard data (single API call)
async function loadCategoriesDashboard() {
    try {
        showLoading()

        console.log("Loading categories dashboard...")

        // Single API call to get all category data
        dashboardData = await apiRequest("/api/v1/admin/categories/dashboard")

        if (dashboardData) {
            console.log("Dashboard data loaded:", dashboardData)

            // Update local data
            allCategories = dashboardData.categoryResList || []
            activeCategories = dashboardData.activeCategoryResList || []
            inactiveCategories = dashboardData.inactiveCategoryResList || []
            filteredCategories = [...allCategories]

            // Update statistics (removed categories with images)
            updateCategoryStats()

            // Render table
            renderCategoriesTable(filteredCategories)
        } else {
            console.error("No dashboard data received")
            showNotification("error", "Ma'lumotlar yuklanmadi")
        }

        hideLoading()
    } catch (error) {
        console.error("Error loading categories dashboard:", error)
        showNotification("error", "Kategoriyalar ma'lumotlarini yuklashda xatolik")
        hideLoading()
    }
}

// Update category statistics (removed categories with images)
function updateCategoryStats() {
    if (dashboardData) {
        console.log("Updating stats:", dashboardData)
        animateCounter("total-categories", dashboardData.count || 0)
        animateCounter("active-categories", dashboardData.activeCount || 0)
        animateCounter("inactive-categories", dashboardData.inactiveCount || 0)
    }
}

// Render categories table
function renderCategoriesTable(categories) {
    const tbody = document.getElementById("categories-table")
    if (!tbody) {
        console.error("Categories table tbody not found")
        return
    }

    console.log("Rendering categories:", categories)

    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Ma\'lumotlar mavjud emas</td></tr>'
        return
    }

    tbody.innerHTML = categories
        .map(
            (category) => `
        <tr class="fade-in">
            <td><strong>T-${category.order}</strong></td>
            <td>${category.id}</td>
            <td class="fw-bold">${category.name}</td>
            <td class="text-uppercase fw-light fs-8 text-secondary">${category.spotlightName || "-"}</td>
            <td>
                <span class="status-badge ${category.active ? "active" : "inactive"}">
                    ${category.active ? "FAOL" : "NOFAOL"}
                </span>
            </td>
            <td>${formatDate(new Date())}</td>
            <td>
                <button class="action-btn edit" onclick="showViewCategoryModal(${category.id})" title="Ko'rish">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="showEditCategoryModal(${category.id})" title="Tahrirlash">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn ${category.active ? "delete" : "edit"}" onclick="toggleCategory(${category.id})" title="${category.active ? "Nofaollashtirish" : "Faollashtirish"}">
                    <i class="fas fa-${category.active ? "pause" : "play"}"></i>
                </button>
            </td>
        </tr>
    `,
        )
        .join("")
}

// Load spotlights for select options
async function loadSpotlights() {
    try {
        if (spotlights.length === 0) {
            spotlights = (await apiRequest("/api/v1/spotlights/category")) || []
        }
        return spotlights
    } catch (error) {
        console.error("Error loading spotlights:", error)
        showNotification("error", "Spotlights yuklashda xatolik")
        return []
    }
}

// Populate spotlight select
async function populateSpotlightSelect(selectId, selectedId = null) {
    const select = document.getElementById(selectId)
    if (!select) return

    const spotlightsList = await loadSpotlights()

    select.innerHTML =
        '<option value="">Spotlight tanlang</option>' +
        spotlightsList
            .map(
                (spotlight) =>
                    `<option value="${spotlight.id}" ${selectedId === spotlight.id ? "selected" : ""}>${spotlight.name}</option>`,
            )
            .join("")
}

// Show add category modal
async function showAddCategoryModal() {
    document.getElementById("categoryModalTitle").textContent = "Kategoriya qo'shish"
    document.getElementById("save-btn-text").textContent = "Saqlash"
    document.getElementById("category-form").reset()
    document.getElementById("category-id").value = ""
    document.getElementById("category-active").checked = true
    document.getElementById("enable-image-upload").checked = false
    document.getElementById("image-upload-section").style.display = "none"
    document.getElementById("category-file-preview").innerHTML = ""
    updateCategoryImagePreview()

    // Populate spotlight select
    await populateSpotlightSelect("category-spotlight")

    const modal = new bootstrap.Modal(document.getElementById("categoryModal"))
    modal.show()
}

// Show edit category modal
async function showEditCategoryModal(categoryId) {
    try {
        // Find category in local data first
        let category = allCategories.find((cat) => cat.id === categoryId)

        if (!category) {
            // Fallback to API call
            category = await apiRequest(`/api/v1/admin/category/${categoryId}`)
        }

        if (!category) {
            showNotification("error", "Kategoriya ma'lumotlari topilmadi")
            return
        }

        document.getElementById("categoryModalTitle").textContent = "Kategoriyani tahrirlash"
        document.getElementById("save-btn-text").textContent = "Yangilash"
        document.getElementById("category-id").value = category.id
        document.getElementById("category-name").value = category.name
        document.getElementById("category-active").checked = category.active

        // Populate spotlight select with current selection
        await populateSpotlightSelect("category-spotlight", category.spotlightId)

        // Handle image if exists
        if (category.imageKey) {
            document.getElementById("enable-image-upload").checked = true
            document.getElementById("image-upload-section").style.display = "block"
            // Load and display existing image
            loadCategoryImage(category.imageKey)
        } else {
            document.getElementById("enable-image-upload").checked = false
            document.getElementById("image-upload-section").style.display = "none"
        }

        const modal = new bootstrap.Modal(document.getElementById("categoryModal"))
        modal.show()
    } catch (error) {
        console.error("Error loading category for edit:", error)
        showNotification("error", "Kategoriya ma'lumotlarini yuklashda xatolik")
    }
}

// Load category image for editing
async function loadCategoryImage(imageKey) {
    try {
        const imageUrl = `${API_BASE_URL}/api/v1/attachment/${imageKey}`
        updateCategoryImagePreview(imageUrl)
    } catch (error) {
        console.error("Error loading category image:", error)
    }
}

// Show view category modal with improved layout
async function showViewCategoryModal(categoryId) {
    try {
        // Find category in local data first
        let category = allCategories.find((cat) => cat.id === categoryId)

        if (!category) {
            // Fallback to API call
            category = await apiRequest(`/api/v1/admin/category/${categoryId}`)
        }

        if (!category) {
            showNotification("error", "Kategoriya ma'lumotlari topilmadi")
            return
        }

        // Populate view modal - right side details
        document.getElementById("view-category-id").textContent = category.id
        document.getElementById("view-category-name").textContent = category.name
        document.getElementById("view-category-spotlight").textContent = category.spotlightName || "-"
        document.getElementById("view-category-order").textContent = `T-${category.order}`
        document.getElementById("view-category-status").innerHTML = `
            <span class="status-badge ${category.active ? "active" : "inactive"}">
                ${category.active ? "FAOL" : "NOFAOL"}
            </span>
        `
        document.getElementById("view-category-created-at").textContent = formatDate(new Date())
        document.getElementById("view-category-created-by").textContent = "Admin"
        document.getElementById("view-category-updated-at").textContent = formatDate(new Date())
        document.getElementById("view-category-updated-by").textContent = "Admin"

        // Handle image display - left side
        const imageContainer = document.getElementById("view-category-image")
        const imageDetails = document.getElementById("view-image-details")

        if (category.imageKey) {
            try {
                // Load image details using the new API endpoint
                const imageData = await apiRequest(`/api/v1/admin/attachment/with-key/${category.imageKey}`)

                if (imageData) {
                    // Display image
                    const imageUrl = `${API_BASE_URL}/api/v1/attachment/${category.imageKey}`
                    imageContainer.innerHTML = `
                        <img src="${imageUrl}" 
                             class="img-fluid rounded" 
                             alt="Category Image"
                             style="width: 100%; height: 200px; object-fit: cover;">
                    `

                    // Display image details
                    document.getElementById("view-image-filename").textContent = imageData.filename || "-"
                    document.getElementById("view-image-type").textContent = imageData.contentType || "-"
                    document.getElementById("view-image-created").textContent = formatDate(imageData.createdAt)
                    imageDetails.style.display = "block"
                } else {
                    showNoImagePlaceholder(imageContainer)
                    imageDetails.style.display = "none"
                }
            } catch (error) {
                console.error("Error loading image details:", error)
                showNoImagePlaceholder(imageContainer)
                imageDetails.style.display = "none"
            }
        } else {
            showNoImagePlaceholder(imageContainer)
            imageDetails.style.display = "none"
        }

        const modal = new bootstrap.Modal(document.getElementById("viewCategoryModal"))
        modal.show()
    } catch (error) {
        console.error("Error viewing category:", error)
        showNotification("error", "Kategoriya ma'lumotlarini yuklashda xatolik")
    }
}

// Show no image placeholder
function showNoImagePlaceholder(container) {
    container.innerHTML = `
        <div class="d-flex align-items-center justify-content-center bg-light rounded" style="height: 200px;">
            <div class="text-center">
                <i class="fas fa-image fa-3x text-muted mb-3"></i>
                <div class="text-muted">Rasm mavjud emas</div>
            </div>
        </div>
    `
}

// Show order categories modal
function showOrderCategoriesModal() {
    const modalBody = document.getElementById("order-categories-list")

    // Create sortable list of active categories
    modalBody.innerHTML = activeCategories
        .sort((a, b) => a.order - b.order)
        .map(
            (category) => `
            <div class="order-item" data-id="${category.id}" data-order="${category.order}">
                <div class="order-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="order-content">
                    <span class="order-number">T-${category.order}</span>
                    <span class="order-name">${category.name}</span>
                </div>
            </div>
        `,
        )
        .join("")

    // Initialize drag and drop
    initializeDragAndDrop()

    const modal = new bootstrap.Modal(document.getElementById("orderCategoriesModal"))
    modal.show()
}

// Initialize drag and drop functionality
function initializeDragAndDrop() {
    const container = document.getElementById("order-categories-list")
    let draggedElement = null

    container.addEventListener("dragstart", (e) => {
        draggedElement = e.target.closest(".order-item")
        e.target.style.opacity = "0.5"
    })

    container.addEventListener("dragend", (e) => {
        e.target.style.opacity = ""
        draggedElement = null
    })

    container.addEventListener("dragover", (e) => {
        e.preventDefault()
    })

    container.addEventListener("drop", (e) => {
        e.preventDefault()
        const dropTarget = e.target.closest(".order-item")

        if (dropTarget && draggedElement && dropTarget !== draggedElement) {
            const rect = dropTarget.getBoundingClientRect()
            const midpoint = rect.top + rect.height / 2

            if (e.clientY < midpoint) {
                container.insertBefore(draggedElement, dropTarget)
            } else {
                container.insertBefore(draggedElement, dropTarget.nextSibling)
            }

            updateOrderNumbers()
        }
    })

    // Make items draggable
    container.querySelectorAll(".order-item").forEach((item) => {
        item.draggable = true
    })
}

// Update order numbers after drag and drop
function updateOrderNumbers() {
    const items = document.querySelectorAll("#order-categories-list .order-item")
    items.forEach((item, index) => {
        const orderNumber = item.querySelector(".order-number")
        orderNumber.textContent = `T-${index + 1}`
        item.dataset.order = index + 1
    })
}

// Save category with image upload support
async function saveCategory() {
    try {
        const categoryId = document.getElementById("category-id").value
        const name = document.getElementById("category-name").value.trim()
        const spotlightId = document.getElementById("category-spotlight").value
        const isActive = document.getElementById("category-active").checked
        const enableImageUpload = document.getElementById("enable-image-upload").checked

        if (!name) {
            showNotification("warning", "Kategoriya nomini kiriting")
            return
        }

        if (!spotlightId) {
            showNotification("warning", "Spotlight tanlang")
            return
        }

        const categoryData = {
            name: name,
            spotlightId: Number.parseInt(spotlightId),
            imageId : categoryData.imageId,
            active: isActive,
        }

        // Handle image upload if enabled
        if (enableImageUpload) {
            const fileInput = document.getElementById("category-file-input")
            if (fileInput && fileInput.files.length > 0) {
                const uploadResult = await uploadImageFile(fileInput.files[0])
                if (uploadResult && uploadResult.key) {
                    categoryData.imageKey = uploadResult.key
                }
            }
        }

        let response
        let newCategory

        if (categoryId) {
            // Update existing category - using PUT method as requested
            response = await apiRequest(`/api/v1/admin/category/${categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoryData),
            })
            newCategory = response
        } else {
            // Create new category
            response = await apiRequest("/api/v1/admin/category", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoryData),
            })
            newCategory = response
        }

        if (newCategory) {
            showNotification("success", "Kategoriya muvaffaqiyatli saqlandi")

            // Update local data properly
            if (categoryId) {
                // Update existing category in local arrays
                updateCategoryInLocalData(newCategory)
            } else {
                // Add new category to local arrays
                addCategoryToLocalData(newCategory)
            }

            // Update filtered categories based on current filter
            applyCurrentFilter()

            // Re-render table and update stats
            renderCategoriesTable(filteredCategories)
            updateCategoryStats()

            const modal = bootstrap.Modal.getInstance(document.getElementById("categoryModal"))
            modal.hide()
        }
    } catch (error) {
        console.error("Error saving category:", error)
        showNotification("error", "Kategoriyani saqlashda xatolik")
    }
}

// Save category order
async function saveCategoryOrder() {
    try {
        const items = document.querySelectorAll("#order-categories-list .order-item")
        const categoryOrderMap = {}

        items.forEach((item, index) => {
            const categoryId = Number.parseInt(item.dataset.id)
            categoryOrderMap[categoryId] = index + 1
        })

        const response = await apiRequest("/api/v1/admin/categories/order", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryOrderMap),
        })

        if (response) {
            // Update local active categories with new order
            activeCategories = response

            // Update all categories array
            response.forEach((updatedCategory) => {
                const index = allCategories.findIndex((cat) => cat.id === updatedCategory.id)
                if (index !== -1) {
                    allCategories[index] = updatedCategory
                }
            })

            // Update filtered categories
            applyCurrentFilter()

            showNotification("success", "Kategoriyalar tartibi yangilandi")

            // Re-render table
            renderCategoriesTable(filteredCategories)

            const modal = bootstrap.Modal.getInstance(document.getElementById("orderCategoriesModal"))
            modal.hide()
        }
    } catch (error) {
        console.error("Error saving category order:", error)
        showNotification("error", "Kategoriyalar tartibini saqlashda xatolik")
    }
}

// Toggle category active status with proper local data update
async function toggleCategory(categoryId) {
    try {
        const response = await apiRequest(`/api/v1/admin/category/toggle/${categoryId}`, {
            method: "PATCH",
        })

        if (response === "OK" || response === 200) {
            // Find category in all categories
            const categoryIndex = allCategories.findIndex((cat) => cat.id === categoryId)
            if (categoryIndex !== -1) {
                const category = allCategories[categoryIndex]
                const wasActive = category.active
                category.active = !category.active

                // Move category between active and inactive arrays
                if (wasActive) {
                    // Move from active to inactive
                    const activeIndex = activeCategories.findIndex((cat) => cat.id === categoryId)
                    if (activeIndex !== -1) {
                        const [movedCategory] = activeCategories.splice(activeIndex, 1)
                        movedCategory.active = false
                        inactiveCategories.push(movedCategory)
                    }
                } else {
                    // Move from inactive to active
                    const inactiveIndex = inactiveCategories.findIndex((cat) => cat.id === categoryId)
                    if (inactiveIndex !== -1) {
                        const [movedCategory] = inactiveCategories.splice(inactiveIndex, 1)
                        movedCategory.active = true
                        activeCategories.push(movedCategory)
                    }
                }

                // Update dashboard data counts
                if (dashboardData) {
                    dashboardData.activeCount = activeCategories.length
                    dashboardData.inactiveCount = inactiveCategories.length
                    dashboardData.activeCategoryResList = [...activeCategories]
                    dashboardData.inactiveCategoryResList = [...inactiveCategories]
                }

                // Update filtered categories based on current filter
                applyCurrentFilter()

                // Re-render and update stats without page refresh
                renderCategoriesTable(filteredCategories)
                updateCategoryStats()

                showNotification("success", `Kategoriya ${category.active ? "faollashtirildi" : "nofaollashtirildi"}`)
            }
        }
    } catch (error) {
        console.error("Error toggling category:", error)
        showNotification("error", "Kategoriya holatini o'zgartirishda xatolik")
    }
}

// Helper functions for local data management
function addCategoryToLocalData(newCategory) {
    allCategories.push(newCategory)

    if (newCategory.active) {
        activeCategories.push(newCategory)
        if (dashboardData) dashboardData.activeCount++
    } else {
        inactiveCategories.push(newCategory)
        if (dashboardData) dashboardData.inactiveCount++
    }

    if (dashboardData) {
        dashboardData.count++
        dashboardData.categoryResList = [...allCategories]
        dashboardData.activeCategoryResList = [...activeCategories]
        dashboardData.inactiveCategoryResList = [...inactiveCategories]
    }
}

function updateCategoryInLocalData(updatedCategory) {
    const updateInArray = (array) => {
        const index = array.findIndex((cat) => cat.id === updatedCategory.id)
        if (index !== -1) {
            array[index] = { ...array[index], ...updatedCategory }
        }
    }

    updateInArray(allCategories)
    updateInArray(activeCategories)
    updateInArray(inactiveCategories)

    // Update dashboard data
    if (dashboardData) {
        dashboardData.categoryResList = [...allCategories]
        dashboardData.activeCategoryResList = [...activeCategories]
        dashboardData.inactiveCategoryResList = [...inactiveCategories]
    }
}

// Apply current filter to update filteredCategories
function applyCurrentFilter() {
    const statusFilter = document.getElementById("status-filter")?.value || "all"

    switch (statusFilter) {
        case "all":
            filteredCategories = [...allCategories]
            break
        case "active":
            filteredCategories = [...activeCategories]
            break
        case "inactive":
            filteredCategories = [...inactiveCategories]
            break
        default:
            filteredCategories = [...allCategories]
    }
}

// Filter categories
function filterCategories() {
    applyCurrentFilter()
    renderCategoriesTable(filteredCategories)
}

// Search categories
function searchCategories() {
    const searchTerm = document.getElementById("search-input")?.value.trim().toLowerCase()

    if (!searchTerm) {
        filterCategories() // Reset to current filter
        return
    }

    filteredCategories = allCategories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm) ||
            (category.spotlightName && category.spotlightName.toLowerCase().includes(searchTerm)),
    )

    renderCategoriesTable(filteredCategories)
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById("search-input")
    if (searchInput) {
        searchInput.value = ""
    }
    filterCategories()
}

// Setup category file upload
function setupCategoryFileUpload() {
    const uploadArea = document.getElementById("category-file-upload-area")
    const fileInput = document.getElementById("category-file-input")
    const preview = document.getElementById("category-file-preview")

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
            fileInput.files = files
            handleCategoryFilePreview(files[0], preview)
        }
    })

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleCategoryFilePreview(e.target.files[0], preview)
        }
    })
}

// Handle category file preview
function handleCategoryFilePreview(file, preview) {
    preview.innerHTML = ""

    if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const previewItem = document.createElement("div")
            previewItem.className = "preview-item"
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="preview-remove" onclick="removePreview(this)">
                    <i class="fas fa-times"></i>
                </button>
            `
            preview.appendChild(previewItem)
            updateCategoryImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)
    }
}

// Remove preview
function removePreview(button) {
    button.parentElement.remove()
    const fileInput = document.getElementById("category-file-input")
    if (fileInput) fileInput.value = ""
    updateCategoryImagePreview()
}

// Update category image preview
function updateCategoryImagePreview(imageSrc = null) {
    const previewContainer = document.getElementById("category-image-preview")
    if (!previewContainer) return

    if (imageSrc) {
        previewContainer.innerHTML = `
            <img src="${imageSrc}" 
                 class="img-fluid rounded" 
                 alt="Category Image"
                 style="max-height: 200px; object-fit: contain;">
        `
    } else {
        previewContainer.innerHTML = `
            <div class="d-flex align-items-center justify-content-center bg-light rounded" style="height: 200px;">
                <div class="text-center">
                    <i class="fas fa-image fa-3x text-muted mb-3"></i>
                    <div class="text-muted">Rasm tanlanmagan</div>
                </div>
            </div>
        `
    }
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

function refreshData() {
    loadCategoriesDashboard()
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
