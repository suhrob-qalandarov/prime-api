// Global variables
let dashboardData = null
let allCategories = []
let activeCategories = []
let inactiveCategories = []
let spotlights = []
let filteredCategories = []
let currentSpotlightFilter = "all"
const bootstrap = window.bootstrap

// Global variables for spotlights
let spotlightDashboardData = null
let allSpotlights = []
let activeSpotlights = []
let inactiveSpotlights = []
let filteredSpotlights = []
let currentTab = "categories"

// API Base URL
const API_BASE_URL = "https://prime77.uz"

// Initialize categories panel
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded - Categories")
    checkAuth()
    initializeCategoriesPanel()
    loadSpotlights()
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
    window.filterBySpotlight = filterBySpotlight
    window.searchCategories = searchCategories
    window.clearSearch = clearSearch
    window.refreshData = refreshData
    window.toggleFullscreen = toggleFullscreen
    window.logout = logout
    window.retryLoadData = retryLoadData

    // New spotlight functions
    window.switchTab = switchTab
    window.showAddSpotlightModal = showAddSpotlightModal
    window.showEditSpotlightModal = showEditSpotlightModal
    window.showViewSpotlightModal = showViewSpotlightModal
    window.showOrderSpotlightsModal = showOrderSpotlightsModal
    window.saveSpotlight = saveSpotlight
    window.saveSpotlightOrder = saveSpotlightOrder
    window.toggleSpotlight = toggleSpotlight
    window.filterSpotlights = filterSpotlights
    window.searchSpotlights = searchSpotlights
    window.clearSpotlightSearch = clearSpotlightSearch

    // Setup spotlight image upload
    setupSpotlightImageUpload()
    setupSpotlightSearchInput()
}

// API request with token
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("accessToken")

    if (!token) {
        console.log("No token found, redirecting to login")
        //window.location.href = "login.html"
        //return null
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
            console.log("Unauthorized, redirecting to login")
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            window.location.href = "login.html"
            return null
        }

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} - ${response.statusText}`)
        }

        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            return await response.json()
        } else {
            return await response.text()
        }
    } catch (error) {
        console.error("API request error:", error)
        throw error
    }
}

// Load spotlights and render spotlight buttons
async function loadSpotlights() {
    try {
        console.log("Loading spotlights...")
        const response = await apiRequest("/api/v1/spotlights/category")

        if (response) {
            spotlights = response
            console.log("Spotlights loaded:", spotlights)
            renderSpotlightButtons()
        } else {
            throw new Error("No spotlights data received")
        }
    } catch (error) {
        console.error("Error loading spotlights:", error)
        showErrorState("Spotlights ma'lumotlarini yuklashda xatolik yuz berdi")
        showNotification("error", "Spotlights yuklashda xatolik")
    }
}

// Render spotlight filter buttons
function renderSpotlightButtons() {
    const container = document.getElementById("spotlight-buttons")
    if (!container) return

    // Clear existing buttons except "Barcha toifalar"
    const allButton = container.querySelector('[data-spotlight-id="all"]')
    container.innerHTML = ""
    if (allButton) {
        container.appendChild(allButton)
    }

    // Add spotlight buttons
    spotlights.forEach((spotlight) => {
        const button = document.createElement("button")
        button.className = "spotlight-btn"
        button.setAttribute("data-spotlight-id", spotlight.id)
        button.onclick = () => filterBySpotlight(spotlight.id)
        button.innerHTML = `<i class="fas fa-tag"></i> ${spotlight.name}`
        container.appendChild(button)
    })
}

// Filter categories by spotlight
async function filterBySpotlight(spotlightId) {
    try {
        showLoading()

        // Update active button
        document.querySelectorAll(".spotlight-btn").forEach((btn) => {
            btn.classList.remove("active")
        })
        document.querySelector(`[data-spotlight-id="${spotlightId}"]`).classList.add("active")

        currentSpotlightFilter = spotlightId

        let response
        if (spotlightId === "all") {
            // Load all categories
            response = await apiRequest("/api/v1/admin/categories/dashboard")
        } else {
            // Load categories for specific spotlight
            response = await apiRequest(`/api/v1/admin/spotlight/${spotlightId}/categories`)
        }

        if (response) {
            console.log("Spotlight filtered data loaded:", response)
            dashboardData = response

            // Update local data
            allCategories = dashboardData.categoryResList || []
            activeCategories = dashboardData.activeCategoryResList || []
            inactiveCategories = dashboardData.inactiveCategoryResList || []

            // Apply current status filter
            applyCurrentFilter()

            // Update statistics and render table
            updateCategoryStats()
            renderCategoriesTable(filteredCategories)
            hideErrorState()
        } else {
            throw new Error("No data received from server")
        }

        hideLoading()
    } catch (error) {
        console.error("Error filtering by spotlight:", error)
        hideLoading()
        showErrorState("Ma'lumotlarni yuklashda xatolik yuz berdi")
        showNotification("error", "Spotlight bo'yicha filtrlashda xatolik")
    }
}

// Load categories dashboard data (single API call)
async function loadCategoriesDashboard() {
    try {
        showLoading()

        console.log("Loading categories dashboard...")

        // Single API call to get all category data
        const response = await apiRequest("/api/v1/admin/categories/dashboard")

        if (response) {
            console.log("Dashboard data loaded:", response)
            dashboardData = response

            // Update local data
            allCategories = dashboardData.categoryResList || []
            activeCategories = dashboardData.activeCategoryResList || []
            inactiveCategories = dashboardData.inactiveCategoryResList || []
            filteredCategories = [...allCategories]

            // Update statistics
            updateCategoryStats()

            // Render table
            renderCategoriesTable(filteredCategories)
            hideErrorState()
        } else {
            throw new Error("No dashboard data received from server")
        }

        hideLoading()
    } catch (error) {
        console.error("Error loading categories dashboard:", error)
        hideLoading()
        showErrorState("Kategoriyalar ma'lumotlarini yuklashda xatolik yuz berdi")
        showNotification("error", "Kategoriyalar ma'lumotlarini yuklashda xatolik")
    }
}

// Update category statistics
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
          <td class="spotlight-name">${category.spotlightRes ? category.spotlightRes.name : "-"}</td>
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

// Populate spotlight select
async function populateSpotlightSelect(selectId, selectedId = null) {
    const select = document.getElementById(selectId)
    if (!select) return

    if (spotlights.length === 0) {
        await loadSpotlights()
    }

    select.innerHTML =
        '<option value="">Spotlight tanlang</option>' +
        spotlights
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
            throw new Error("Category not found")
        }

        document.getElementById("categoryModalTitle").textContent = "Kategoriyani tahrirlash"
        document.getElementById("save-btn-text").textContent = "Yangilash"
        document.getElementById("category-id").value = category.id
        document.getElementById("category-name").value = category.name
        document.getElementById("category-active").checked = category.active

        // Populate spotlight select with current selection
        await populateSpotlightSelect("category-spotlight", category.spotlightRes ? category.spotlightRes.id : null)

        const modal = new bootstrap.Modal(document.getElementById("categoryModal"))
        modal.show()
    } catch (error) {
        console.error("Error loading category for edit:", error)
        showNotification("error", "Kategoriya ma'lumotlarini yuklashda xatolik")
    }
}

// Show view category modal
async function showViewCategoryModal(categoryId) {
    try {
        // Find category in local data first
        let category = allCategories.find((cat) => cat.id === categoryId)

        if (!category) {
            // Fallback to API call
            category = await apiRequest(`/api/v1/admin/category/${categoryId}`)
        }

        if (!category) {
            throw new Error("Category not found")
        }

        // Populate view modal
        document.getElementById("view-category-id").textContent = category.id
        document.getElementById("view-category-name").textContent = category.name
        document.getElementById("view-category-order").textContent = `T-${category.order}`
        document.getElementById("view-category-spotlight").textContent = category.spotlightRes
            ? category.spotlightRes.name
            : "-"
        document.getElementById("view-category-status").innerHTML = `
            <span class="status-badge ${category.active ? "active" : "inactive"}">
                ${category.active ? "FAOL" : "NOFAOL"}
            </span>
        `
        document.getElementById("view-category-created-at").textContent = formatDate(new Date())
        document.getElementById("view-category-created-by").textContent = "Admin"
        document.getElementById("view-category-updated-at").textContent = formatDate(new Date())
        document.getElementById("view-category-updated-by").textContent = "Admin"

        const modal = new bootstrap.Modal(document.getElementById("viewCategoryModal"))
        modal.show()
    } catch (error) {
        console.error("Error viewing category:", error)
        showNotification("error", "Kategoriya ma'lumotlarini yuklashda xatolik")
    }
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

// Save category (simplified without image handling)
async function saveCategory() {
    try {
        const categoryId = document.getElementById("category-id").value
        const name = document.getElementById("category-name").value.trim()
        const spotlightId = document.getElementById("category-spotlight").value
        const isActive = document.getElementById("category-active").checked

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
            active: isActive,
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

            // Refresh data based on current spotlight filter
            if (currentSpotlightFilter === "all") {
                await loadCategoriesDashboard()
            } else {
                await filterBySpotlight(currentSpotlightFilter)
            }

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
            showNotification("success", "Kategoriyalar tartibi yangilandi")

            // Refresh data based on current spotlight filter
            if (currentSpotlightFilter === "all") {
                await loadCategoriesDashboard()
            } else {
                await filterBySpotlight(currentSpotlightFilter)
            }

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

        showNotification("success", "Kategoriya holati o'zgartirildi")

        // Refresh data based on current spotlight filter
        if (currentSpotlightFilter === "all") {
            await loadCategoriesDashboard()
        } else {
            await filterBySpotlight(currentSpotlightFilter)
        }
    } catch (error) {
        console.error("Error toggling category:", error)
        showNotification("error", "Kategoriya holatini o'zgartirishda xatolik")
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
            (category.spotlightRes && category.spotlightRes.name.toLowerCase().includes(searchTerm)),
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

// Tab switching functionality
function switchTab(tabName) {
    currentTab = tabName

    // Update tab buttons
    document.querySelectorAll(".page-tab-btn").forEach((btn) => {
        btn.classList.remove("active")
    })
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")

    // Update tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active")
    })
    document.getElementById(`${tabName}-content`).classList.add("active")

    // Load appropriate data
    if (tabName === "categories") {
        loadSpotlightsDashboard()
    } else {
        loadCategoriesDashboard()
    }
}

// Setup spotlight image upload
function setupSpotlightImageUpload() {
    const uploadArea = document.getElementById("spotlight-image-upload")
    const fileInput = document.getElementById("spotlight-image-input")
    const preview = document.getElementById("spotlight-image-preview")

    if (uploadArea && fileInput) {
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
                handleSpotlightImageUpload(files[0])
            }
        })

        fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                handleSpotlightImageUpload(e.target.files[0])
            }
        })
    }
}

// Handle spotlight image upload
async function handleSpotlightImageUpload(file) {
    if (!file.type.startsWith("image/")) {
        showNotification("error", "Faqat rasm fayllari qabul qilinadi")
        return
    }

    if (file.size > 5 * 1024 * 1024) {
        showNotification("error", "Fayl hajmi 5MB dan oshmasligi kerak")
        return
    }

    try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await apiRequest("/api/v1/admin/attachment", {
            method: "POST",
            body: formData,
        })

        if (response && response.id) {
            document.getElementById("spotlight-image-id").value = response.id

            // Show preview
            const preview = document.getElementById("spotlight-image-preview")
            preview.innerHTML = `
        <div class="preview-item">
          <img src="${URL.createObjectURL(file)}" alt="Preview">
          <button class="preview-remove" onclick="removeSpotlightImage()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `

            showNotification("success", "Rasm muvaffaqiyatli yuklandi")
        }
    } catch (error) {
        console.error("Error uploading image:", error)
        showNotification("error", "Rasm yuklashda xatolik")
    }
}

// Remove spotlight image
function removeSpotlightImage() {
    document.getElementById("spotlight-image-id").value = ""
    document.getElementById("spotlight-image-preview").innerHTML = ""
    document.getElementById("spotlight-image-input").value = ""
}

// Setup spotlight search input
function setupSpotlightSearchInput() {
    const searchInput = document.getElementById("spotlight-search-input")
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                searchSpotlights()
            }
        })
    }
}

// Load spotlights dashboard
async function loadSpotlightsDashboard() {
    try {
        showLoading()

        const response = await apiRequest("/api/v1/admin/spotlights/dashboard")

        if (response) {
            spotlightDashboardData = response
            allSpotlights = response.spotlightResList || []
            activeSpotlights = response.activeSpotlightResList || []
            inactiveSpotlights = response.inactiveSpotlightResList || []
            filteredSpotlights = [...allSpotlights]

            updateSpotlightStats()
            renderSpotlightsTable(filteredSpotlights)
            hideErrorState()
        } else {
            throw new Error("No spotlight data received")
        }

        hideLoading()
    } catch (error) {
        console.error("Error loading spotlights dashboard:", error)
        hideLoading()
        showErrorState("Toifalar ma'lumotlarini yuklashda xatolik yuz berdi")
        showNotification("error", "Toifalar ma'lumotlarini yuklashda xatolik")
    }
}

// Update spotlight statistics
function updateSpotlightStats() {
    if (spotlightDashboardData) {
        animateCounter("total-spotlights", spotlightDashboardData.count || 0)
        animateCounter("active-spotlights", spotlightDashboardData.activeCount || 0)
        animateCounter("inactive-spotlights", spotlightDashboardData.inactiveCount || 0)
    }
}

// Render spotlights table
function renderSpotlightsTable(spotlights) {
    const tbody = document.getElementById("spotlights-table")
    if (!tbody) return

    if (spotlights.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Ma\'lumotlar mavjud emas</td></tr>'
        return
    }

    tbody.innerHTML = spotlights
        .map(
            (spotlight) => `
    <tr class="fade-in">
      <td><strong>T-${spotlight.orderNumber}</strong></td>
      <td>${spotlight.id}</td>
      <td class="fw-bold">${spotlight.name}</td>
      <td>${spotlight.categoriesCount || 0}</td>
      <td>
        <span class="status-badge ${spotlight.active ? "active" : "inactive"}">
          ${spotlight.active ? "FAOL" : "NOFAOL"}
        </span>
      </td>
      <td>${formatDate(new Date())}</td>
      <td>
        <button class="action-btn edit" onclick="showViewSpotlightModal(${spotlight.id})" title="Ko'rish">
          <i class="fas fa-eye"></i>
        </button>
        <button class="action-btn edit" onclick="showEditSpotlightModal(${spotlight.id})" title="Tahrirlash">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn ${spotlight.active ? "delete" : "edit"}" onclick="toggleSpotlight(${spotlight.id})" title="${spotlight.active ? "Nofaollashtirish" : "Faollashtirish"}">
          <i class="fas fa-${spotlight.active ? "pause" : "play"}"></i>
        </button>
      </td>
    </tr>
  `,
        )
        .join("")
}

// Show add spotlight modal
function showAddSpotlightModal() {
    document.getElementById("spotlightModalTitle").textContent = "Toifa qo'shish"
    document.getElementById("spotlight-save-btn-text").textContent = "Saqlash"
    document.getElementById("spotlight-form").reset()
    document.getElementById("spotlight-id").value = ""
    document.getElementById("spotlight-active").checked = true
    document.getElementById("spotlight-image-id").value = ""
    document.getElementById("spotlight-image-preview").innerHTML = ""

    const modal = new bootstrap.Modal(document.getElementById("spotlightModal"))
    modal.show()
}

// Show edit spotlight modal
async function showEditSpotlightModal(spotlightId) {
    try {
        let spotlight = allSpotlights.find((s) => s.id === spotlightId)

        if (!spotlight) {
            spotlight = await apiRequest(`/api/v1/admin/spotlight/${spotlightId}`)
        }

        if (!spotlight) {
            throw new Error("Spotlight not found")
        }

        document.getElementById("spotlightModalTitle").textContent = "Toifani tahrirlash"
        document.getElementById("spotlight-save-btn-text").textContent = "Yangilash"
        document.getElementById("spotlight-id").value = spotlight.id
        document.getElementById("spotlight-name").value = spotlight.name
        document.getElementById("spotlight-active").checked = spotlight.active

        const modal = new bootstrap.Modal(document.getElementById("spotlightModal"))
        modal.show()
    } catch (error) {
        console.error("Error loading spotlight for edit:", error)
        showNotification("error", "Toifa ma'lumotlarini yuklashda xatolik")
    }
}

// Show view spotlight modal
async function showViewSpotlightModal(spotlightId) {
    try {
        const response = await apiRequest(`/api/v1/admin/spotlight/${spotlightId}`)

        if (!response) {
            throw new Error("Spotlight not found")
        }

        document.getElementById("view-spotlight-id").textContent = response.id
        document.getElementById("view-spotlight-name").textContent = response.name
        document.getElementById("view-spotlight-order").textContent = `T-${response.orderNumber}`
        document.getElementById("view-spotlight-status").innerHTML = `
      <span class="status-badge ${response.active ? "active" : "inactive"}">
        ${response.active ? "FAOL" : "NOFAOL"}
      </span>
    `

        // Show categories
        if (response.categoriesName && response.categoriesName.length > 0) {
            document.getElementById("view-spotlight-categories").innerHTML = `
        <div class="category-tags">
          ${response.categoriesName.map((name) => `<span class="category-tag">${name}</span>`).join("")}
        </div>
      `
        } else {
            document.getElementById("view-spotlight-categories").textContent = "Kategoriyalar mavjud emas"
        }

        // Show image
        if (response.imageKey) {
            document.getElementById("view-spotlight-image").src = `${API_BASE_URL}/api/v1/attachment/${response.imageKey}`
        } else {
            document.getElementById("view-spotlight-image").src = "/placeholder.svg?height=300&width=300"
        }

        const modal = new bootstrap.Modal(document.getElementById("viewSpotlightModal"))
        modal.show()
    } catch (error) {
        console.error("Error viewing spotlight:", error)
        showNotification("error", "Toifa ma'lumotlarini yuklashda xatolik")
    }
}

// Show order spotlights modal
function showOrderSpotlightsModal() {
    const modalBody = document.getElementById("order-spotlights-list")

    modalBody.innerHTML = activeSpotlights
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map(
            (spotlight) => `
      <div class="order-item" data-id="${spotlight.id}" data-order="${spotlight.orderNumber}">
        <div class="order-handle">
          <i class="fas fa-grip-vertical"></i>
        </div>
        <div class="order-content">
          <span class="order-number">T-${spotlight.orderNumber}</span>
          <span class="order-name">${spotlight.name}</span>
        </div>
      </div>
    `,
        )
        .join("")

    initializeSpotlightDragAndDrop()

    const modal = new bootstrap.Modal(document.getElementById("orderSpotlightsModal"))
    modal.show()
}

// Initialize spotlight drag and drop
function initializeSpotlightDragAndDrop() {
    const container = document.getElementById("order-spotlights-list")
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

            updateSpotlightOrderNumbers()
        }
    })

    container.querySelectorAll(".order-item").forEach((item) => {
        item.draggable = true
    })
}

// Update spotlight order numbers
function updateSpotlightOrderNumbers() {
    const items = document.querySelectorAll("#order-spotlights-list .order-item")
    items.forEach((item, index) => {
        const orderNumber = item.querySelector(".order-number")
        orderNumber.textContent = `T-${index + 1}`
        item.dataset.order = index + 1
    })
}

// Save spotlight
async function saveSpotlight() {
    try {
        const spotlightId = document.getElementById("spotlight-id").value
        const name = document.getElementById("spotlight-name").value.trim()
        const imageId = document.getElementById("spotlight-image-id").value
        const isActive = document.getElementById("spotlight-active").checked

        if (!name) {
            showNotification("warning", "Toifa nomini kiriting")
            return
        }

        if (!imageId && !spotlightId) {
            showNotification("warning", "Rasm yuklang")
            return
        }

        const spotlightData = {
            name: name,
            imageId: imageId ? Number.parseInt(imageId) : null,
        }

        let response
        if (spotlightId) {
            response = await apiRequest(`/api/v1/admin/spotlight/${spotlightId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(spotlightData),
            })
        } else {
            response = await apiRequest("/api/v1/admin/spotlight", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(spotlightData),
            })
        }

        if (response) {
            showNotification("success", "Toifa muvaffaqiyatli saqlandi")
            await loadSpotlightsDashboard()

            const modal = bootstrap.Modal.getInstance(document.getElementById("spotlightModal"))
            modal.hide()
        }
    } catch (error) {
        console.error("Error saving spotlight:", error)
        showNotification("error", "Toifani saqlashda xatolik")
    }
}

// Save spotlight order
async function saveSpotlightOrder() {
    try {
        const items = document.querySelectorAll("#order-spotlights-list .order-item")
        const spotlightOrderMap = {}

        items.forEach((item, index) => {
            const spotlightId = Number.parseInt(item.dataset.id)
            spotlightOrderMap[spotlightId] = index + 1
        })

        const response = await apiRequest("/api/v1/admin/spotlights/order", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spotlightOrderMap),
        })

        if (response) {
            showNotification("success", "Toifalar tartibi yangilandi")
            await loadSpotlightsDashboard()

            const modal = bootstrap.Modal.getInstance(document.getElementById("orderSpotlightsModal"))
            modal.hide()
        }
    } catch (error) {
        console.error("Error saving spotlight order:", error)
        showNotification("error", "Toifalar tartibini saqlashda xatolik")
    }
}

// Toggle spotlight
async function toggleSpotlight(spotlightId) {
    try {
        const response = await apiRequest(`/api/v1/admin/spotlight/toggle/${spotlightId}`, {
            method: "PATCH",
        })

        showNotification("success", "Toifa holati o'zgartirildi")
        await loadSpotlightsDashboard()
    } catch (error) {
        console.error("Error toggling spotlight:", error)
        showNotification("error", "Toifa holatini o'zgartirishda xatolik")
    }
}

// Filter spotlights
function filterSpotlights() {
    const statusFilter = document.getElementById("spotlight-status-filter")?.value || "all"

    switch (statusFilter) {
        case "all":
            filteredSpotlights = [...allSpotlights]
            break
        case "active":
            filteredSpotlights = [...activeSpotlights]
            break
        case "inactive":
            filteredSpotlights = [...inactiveSpotlights]
            break
        default:
            filteredSpotlights = [...allSpotlights]
    }

    renderSpotlightsTable(filteredSpotlights)
}

// Search spotlights
function searchSpotlights() {
    const searchTerm = document.getElementById("spotlight-search-input")?.value.trim().toLowerCase()

    if (!searchTerm) {
        filterSpotlights()
        return
    }

    filteredSpotlights = allSpotlights.filter((spotlight) => spotlight.name.toLowerCase().includes(searchTerm))

    renderSpotlightsTable(filteredSpotlights)
}

// Clear spotlight search
function clearSpotlightSearch() {
    const searchInput = document.getElementById("spotlight-search-input")
    if (searchInput) {
        searchInput.value = ""
    }
    filterSpotlights()
}

// Update refreshData function to handle both tabs
function refreshData() {
    if (currentTab === "spotlights") {
        loadSpotlightsDashboard()
    } else {
        if (currentSpotlightFilter === "all") {
            loadCategoriesDashboard()
        } else {
            filterBySpotlight(currentSpotlightFilter)
        }
    }
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

// Show error state
function showErrorState(message) {
    const tbody = document.getElementById("categories-table")
    const statsCards = document.querySelectorAll(".stats-number")

    if (tbody) {
        tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">
          <div class="error-state">
            <div class="error-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h4>Xatolik yuz berdi</h4>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="retryLoadData()">
              <i class="fas fa-refresh"></i> Qayta urinish
            </button>
          </div>
        </td>
      </tr>
    `
    }

    // Reset stats to 0
    statsCards.forEach((card) => {
        card.textContent = "0"
    })
}

// Hide error state
function hideErrorState() {
    // Error state will be hidden when table is re-rendered with actual data
}

// Retry loading data
function retryLoadData() {
    if (currentSpotlightFilter === "all") {
        loadCategoriesDashboard()
    } else {
        filterBySpotlight(currentSpotlightFilter)
    }
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
