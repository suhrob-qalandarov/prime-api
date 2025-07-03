
// Global variables
let allCategories = []
let filteredCategories = []
const bootstrap = window.bootstrap

// Initialize categories panel
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded - Categories") // Debug
    checkAuth()
    initializeCategoriesPanel()
    loadCategoriesData()

    // Manual setup for image upload toggle
    setTimeout(() => {
        const enableImageUpload = document.getElementById("enable-image-upload")
        const imageUploadSection = document.getElementById("image-upload-section")

        console.log("Enable image upload element:", enableImageUpload) // Debug
        console.log("Image upload section:", imageUploadSection) // Debug

        if (enableImageUpload) {
            enableImageUpload.addEventListener("change", function () {
                console.log("Toggle changed:", this.checked) // Debug
                if (this.checked) {
                    imageUploadSection.style.display = "block"
                } else {
                    imageUploadSection.style.display = "none"
                    document.getElementById("category-file-input").value = ""
                    document.getElementById("category-file-preview").innerHTML = ""
                    updateCategoryImagePreview()
                }
            })
        }
    }, 100)
})

// Check authentication
/*function checkAuth() {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        window.location.href = "login.html"
        return
    }
}*/

// Initialize categories panel
function initializeCategoriesPanel() {
    setupSidebar()
    setupEventListeners()
    setupSearchInput()

    // Setup image upload toggle with delay
    setTimeout(() => {
        setupImageUploadToggle()
    }, 1000)
}

// Setup sidebar
function setupSidebar() {
    const sidebarToggle = document.getElementById("sidebar-toggle")
    const sidebar = document.getElementById("sidebar")

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("show")
    })
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
    window.saveCategory = saveCategory
    window.activateCategory = activateCategory
    window.deactivateCategory = deactivateCategory
    window.loadCategories = loadCategories
    window.filterCategories = filterCategories
    window.searchCategories = searchCategories
    window.clearSearch = clearSearch
    window.refreshData = refreshData
    window.toggleFullscreen = toggleFullscreen
    window.logout = logout
    window.showActiveCategoriesModal = showActiveCategoriesModal
    window.showInactiveCategoriesModal = showInactiveCategoriesModal
    window.removePreview = removePreview

    // Setup file upload
    setupCategoryFileUpload()
}

// Setup image upload toggle
function setupImageUploadToggle() {
    const enableImageUpload = document.getElementById("enable-image-upload")
    const imageUploadSection = document.getElementById("image-upload-section")

    console.log("Setting up image upload toggle...")
    console.log("Enable image upload:", enableImageUpload)
    console.log("Image upload section:", imageUploadSection)

    if (enableImageUpload && imageUploadSection) {
        // Remove existing listeners
        enableImageUpload.removeEventListener("change", toggleImageUploadSection)

        // Add new listener
        enableImageUpload.addEventListener("change", function () {
            console.log("Toggle state changed:", this.checked)
            if (this.checked) {
                imageUploadSection.style.display = "block"
                console.log("Image upload section displayed")
            } else {
                imageUploadSection.style.display = "none"
                document.getElementById("category-file-input").value = ""
                document.getElementById("category-file-preview").innerHTML = ""
                updateCategoryImagePreview()
                console.log("Image upload section hidden")
            }
        })

        console.log("Image upload toggle setup completed")
    } else {
        console.error("Image upload elements not found!")
    }
}

// API request with token
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("accessToken")
    console.log("Making API request to:", `${API_BASE_URL}${url}`) // Debug

    if (!token) {
        console.log("No token found, redirecting to login") // Debug
        window.location.href = "login.html"
        return null
    }

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
        })

        console.log("API Response status:", response.status) // Debug

        if (response.status === 401) {
            console.log("Unauthorized, redirecting to login") // Debug
            window.location.href = "login.html"
            return null
        }

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json()
            console.log("API Response data:", data) // Debug
            return data
        } else {
            const text = await response.text()
            console.log("API Response text:", text) // Debug
            return text
        }
    } catch (error) {
        console.error("API request error:", error)
        throw error
    }
}

// Load categories data
async function loadCategoriesData() {
    try {
        showLoading()

        await Promise.all([loadCategoryStats(), loadCategories()])

        hideLoading()
    } catch (error) {
        console.error("Error loading categories data:", error)
        showNotification("error", "Kategoriyalar ma'lumotlarini yuklashda xatolik")
        hideLoading()
    }
}

// Load category statistics
async function loadCategoryStats() {
    try {
        const [activeCategories, inactiveCategories] = await Promise.all([
            apiRequest("/api/v1/admin/categories/active"),
            apiRequest("/api/v1/admin/categories/inactive"),
        ])

        const totalCategories = (activeCategories?.length || 0) + (inactiveCategories?.length || 0)
        const categoriesWithImages = [...(activeCategories || []), ...(inactiveCategories || [])].filter(
            (cat) => cat.attachmentId,
        ).length

        animateCounter("total-categories", totalCategories)
        animateCounter("active-categories", activeCategories?.length || 0)
        animateCounter("inactive-categories", inactiveCategories?.length || 0)
        animateCounter("categories-with-images", categoriesWithImages)
    } catch (error) {
        console.error("Error loading category stats:", error)
        showNotification("error", "Statistika ma'lumotlarini yuklashda xatolik")
    }
}

// Load categories
async function loadCategories() {
    try {
        console.log("Loading categories...") // Debug
        const allCategoriesData = await apiRequest("/api/v1/admin/categories")
        console.log("Categories data:", allCategoriesData) // Debug

        allCategories = allCategoriesData || []
        filteredCategories = [...allCategories]
        console.log("All categories:", allCategories) // Debug
        renderCategoriesTable(filteredCategories)
    } catch (error) {
        console.error("Error loading categories:", error)
        showNotification("error", "Kategoriyalarni yuklashda xatolik")
    }
}

// Render categories table
function renderCategoriesTable(categories) {
    const tbody = document.getElementById("categories-table")
    if (!tbody) {
        console.error("Categories table tbody not found") // Debug
        return
    }

    console.log("Rendering categories:", categories) // Debug

    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Ma\'lumotlar mavjud emas</td></tr>'
        return
    }

    tbody.innerHTML = categories
        .map(
            (category) => `
        <tr class="fade-in">
            <td>${category.id}</td>
            <td class="fw-bold">${category.name}</td>
            <td>
                <span class="status-badge ${category.active ? "active" : "inactive"}">
                    ${category.active ? "FAOL" : "NOFAOL"}
                </span>
            </td>
            <td>${formatDate(category.createdAt)}</td>
            <td>
                <button class="action-btn edit" onclick="showViewCategoryModal(${category.id})" title="Ko\'rish">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="showEditCategoryModal(${category.id})" title="Tahrirlash">
                    <i class="fas fa-edit"></i>
                </button>
                ${
                category.active
                    ? `<button class="action-btn delete" onclick="deactivateCategory(${category.id})" title="Nofaollashtirish">
                       <i class="fas fa-pause"></i>
                     </button>`
                    : `<button class="action-btn edit" onclick="activateCategory(${category.id})" title="Faollashtirish">
                       <i class="fas fa-play"></i>
                     </button>`
            }
            </td>
        </tr>
    `,
        )
        .join("")
}

// Show add category modal
function showAddCategoryModal() {
    document.getElementById("categoryModalTitle").textContent = "Kategoriya qo'shish"
    document.getElementById("save-btn-text").textContent = "Saqlash"
    document.getElementById("category-form").reset()
    document.getElementById("category-id").value = ""
    document.getElementById("category-active").checked = true
    document.getElementById("enable-image-upload").checked = false
    document.getElementById("image-upload-section").style.display = "none"
    document.getElementById("category-file-preview").innerHTML = ""
    updateCategoryImagePreview()

    const modal = new bootstrap.Modal(document.getElementById("categoryModal"))
    modal.show()

    // Setup toggle after modal is shown
    setTimeout(() => {
        setupImageUploadToggle()
    }, 500)
}

// Show edit category modal
async function showEditCategoryModal(categoryId) {
    try {
        const category = await apiRequest(`/api/v1/admin/category/${categoryId}`)

        if (!category) {
            showNotification("error", "Kategoriya ma'lumotlari topilmadi")
            return
        }

        document.getElementById("categoryModalTitle").textContent = "Kategoriyani tahrirlash"
        document.getElementById("save-btn-text").textContent = "Yangilash"
        document.getElementById("category-id").value = category.id
        document.getElementById("category-name").value = category.name
        document.getElementById("category-attachment").value = category.attachment?.id || ""
        document.getElementById("category-active").checked = category.active
        updateImagePreview()

        const modal = new bootstrap.Modal(document.getElementById("categoryModal"))
        modal.show()
    } catch (error) {
        console.error("Error loading category for edit:", error)
        showNotification("error", "Kategoriya ma'lumotlarini yuklashda xatolik")
    }
}

function setCategoryOrderModal() {

}

// Show view category modal
async function showViewCategoryModal(categoryId) {
    try {
        // Close any existing modals first
        const existingModals = document.querySelectorAll(".modal.show")
        existingModals.forEach((modal) => {
            const modalInstance = bootstrap.Modal.getInstance(modal)
            if (modalInstance) {
                modalInstance.hide()
            }
        })

        // Clean up backdrops
        setTimeout(() => {
            const backdrops = document.querySelectorAll(".modal-backdrop")
            backdrops.forEach((backdrop) => backdrop.remove())

            document.body.classList.remove("modal-open")
            document.body.style.overflow = ""
            document.body.style.paddingRight = ""
        }, 200)

        const category = await apiRequest(`/api/v1/admin/category/${categoryId}`)

        if (!category) {
            showNotification("error", "Kategoriya ma'lumotlari topilmadi")
            return
        }

        // Populate view modal
        document.getElementById("view-category-id").textContent = category.id
        document.getElementById("view-category-name").textContent = category.name
        document.getElementById("view-category-status").innerHTML = `
      <span class="status-badge ${category.active ? "active" : "inactive"}">
          ${category.active ? "FAOL" : "NOFAOL"}
      </span>
    `
        document.getElementById("view-category-attachment-id").textContent = category.attachment?.id || "-"
        document.getElementById("view-category-created-at").textContent = formatDate(category.createdAt)
        document.getElementById("view-category-created-by").textContent = category.createdBy || "-"
        document.getElementById("view-category-updated-at").textContent = formatDate(category.updatedAt)
        document.getElementById("view-category-updated-by").textContent = category.updatedBy || "-"

        // Show category image
        const imageContainer = document.getElementById("view-category-image")
        if (category.attachment?.id) {
            imageContainer.innerHTML = `
        <img src="${API_BASE_URL}/api/v1/attachment/${category.attachment.id}" 
             class="img-fluid rounded" 
             alt="${category.name}"
             style="max-height: 300px; object-fit: contain;"
             onerror="this.src='/placeholder.svg?height=300&width=300'">
      `
        } else {
            imageContainer.innerHTML = `
        <div class="d-flex align-items-center justify-content-center bg-light rounded" style="height: 200px;">
            <div class="text-center">
                <i class="fas fa-image fa-3x text-muted mb-3"></i>
                <div class="text-muted">Rasm mavjud emas</div>
            </div>
        </div>
      `
        }

        setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById("viewCategoryModal"), {
                backdrop: true,
                keyboard: true,
                focus: true,
            })
            modal.show()
        }, 300)
    } catch (error) {
        console.error("Error viewing category:", error)
        showNotification("error", "Kategoriya ma'lumotlarini yuklashda xatolik")
    }
}

// Save category
async function saveCategory() {
    try {
        const categoryId = document.getElementById("category-id").value
        const name = document.getElementById("category-name").value.trim()
        const active = document.getElementById("category-active").checked
        const enableImageUpload = document.getElementById("enable-image-upload").checked
        const fileInput = document.getElementById("category-file-input")

        if (!name) {
            showNotification("warning", "Kategoriya nomini kiriting")
            return
        }

        let attachmentId = null

        // If image upload is enabled and file is selected, upload it first
        if (enableImageUpload && fileInput.files.length > 0) {
            const file = fileInput.files[0]

            try {
                const formData = new FormData()
                formData.append("file", file)

                const uploadResponse = await fetch(`${API_BASE_URL}/api/v1/admin/attachment`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    body: formData,
                })

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload image")
                }

                const uploadResult = await uploadResponse.json()
                attachmentId = uploadResult.id
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError)
                showNotification("error", "Rasmni yuklashda xatolik")
                return
            }
        }

        const categoryData = {
            name: name,
            attachmentId: attachmentId,
            active: active,
        }

        let response
        if (categoryId) {
            // Update existing category
            response = await fetch(`${API_BASE_URL}/api/v1/admin/category/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(categoryData),
            })
        } else {
            // Create new category
            response = await fetch(`${API_BASE_URL}/api/v1/admin/category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(categoryData),
            })
        }

        if (!response.ok) {
            throw new Error("Failed to save category")
        }

        const result = await response.json()

        if (result.success) {
            showNotification("success", result.message || "Kategoriya muvaffaqiyatli saqlandi")

            const modal = bootstrap.Modal.getInstance(document.getElementById("categoryModal"))
            modal.hide()

            // Refresh data
            loadCategoriesData()
        } else {
            showNotification("error", result.message || "Kategoriyani saqlashda xatolik")
        }
    } catch (error) {
        console.error("Error saving category:", error)
        showNotification("error", "Kategoriyani saqlashda xatolik")
    }
}

// Activate category
async function activateCategory(categoryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/admin/category/activate/${categoryId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        })

        if (!response.ok) {
            throw new Error("Failed to activate category")
        }

        const result = await response.json()

        if (result.success) {
            showNotification("success", result.message || "Kategoriya muvaffaqiyatli faollashtirildi")
            loadCategoriesData()
        } else {
            showNotification("error", result.message || "Kategoriyani faollashtirish xatolik")
        }
    } catch (error) {
        console.error("Error activating category:", error)
        showNotification("error", "Kategoriyani faollashtirish xatolik")
    }
}

// Deactivate category
async function deactivateCategory(categoryId) {
    if (!confirm("Kategoriyani nofaollashtirish xohlaysizmi?")) {
        return
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/admin/category/deactivate/${categoryId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        })

        if (!response.ok) {
            throw new Error("Failed to deactivate category")
        }

        const result = await response.json()

        if (result.success) {
            showNotification("success", result.message || "Kategoriya muvaffaqiyatli nofaollashtirildi")
            loadCategoriesData()
        } else {
            showNotification("error", result.message || "Kategoriyani nofaollashtirish xatolik")
        }
    } catch (error) {
        console.error("Error deactivating category:", error)
        showNotification("error", "Kategoriyani nofaollashtirish xatolik")
    }
}

// Filter categories
function filterCategories() {
    const statusFilter = document.getElementById("status-filter").value

    if (statusFilter === "all") {
        filteredCategories = [...allCategories]
    } else if (statusFilter === "active") {
        filteredCategories = allCategories.filter((cat) => cat.active)
    } else if (statusFilter === "inactive") {
        filteredCategories = allCategories.filter((cat) => !cat.active)
    }

    renderCategoriesTable(filteredCategories)
}

// Search categories
function searchCategories() {
    const searchTerm = document.getElementById("search-input").value.trim().toLowerCase()

    if (!searchTerm) {
        filteredCategories = [...allCategories]
    } else {
        filteredCategories = allCategories.filter((category) => category.name.toLowerCase().includes(searchTerm))
    }

    // Apply status filter as well
    filterCategories()
}

// Clear search
function clearSearch() {
    document.getElementById("search-input").value = ""
    filteredCategories = [...allCategories]
    filterCategories()
}

// Show categories modal
async function showCategoriesModal() {
    try {
        const activeCategories = await apiRequest("/api/v1/admin/categories")
        showCategoriesListModal("Kategoriyalar", activeCategories || [])
    } catch (error) {
        console.error("Error loading active categories:", error)
        showNotification("error", "Kategoriyalarni yuklashda xatolik")
    }
}

// Show active categories modal
async function showActiveCategoriesModal() {
    try {
        const activeCategories = await apiRequest("/api/v1/admin/categories/active")
        showCategoriesListModal("Faol kategoriyalar", activeCategories || [])
    } catch (error) {
        console.error("Error loading active categories:", error)
        showNotification("error", "Faol kategoriyalarni yuklashda xatolik")
    }
}

// Show inactive categories modal
async function showInactiveCategoriesModal() {
    try {
        const inactiveCategories = await apiRequest("/api/v1/admin/categories/inactive")
        showCategoriesListModal("Nofaol kategoriyalar", inactiveCategories || [])
    } catch (error) {
        console.error("Error loading inactive categories:", error)
        showNotification("error", "Nofaol kategoriyalarni yuklashda xatolik")
    }
}

// Show categories list modal
function showCategoriesListModal(title, categories) {
    document.getElementById("categoriesListModalTitle").textContent = title

    const tbody = document.getElementById("categories-list-table")
    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Ma\'lumotlar mavjud emas</td></tr>'
    } else {
        tbody.innerHTML = categories
            .map(
                (category) => `
          <tr>
              <td>${category.id}</td>
              <td class="fw-bold">${category.name}</td>
              <td>
                  <span class="status-badge ${category.active ? "active" : "inactive"}">
                      ${category.active ? "FAOL" : "NOFAOL"}
                  </span>
              </td>
              <td>
                  <button class="action-btn edit" onclick="showViewCategoryModal(${category.id})" title="Ko\'rish">
                      <i class="fas fa-eye"></i>
                  </button>
                  <button class="action-btn edit" onclick="showEditCategoryModal(${category.id})" title="Tahrirlash">
                      <i class="fas fa-edit"></i>
                  </button>
                  ${
                    category.active
                        ? `<button class="action-btn delete" onclick="deactivateCategory(${category.id})" title="Nofaollashtirish">
                         <i class="fas fa-pause"></i>
                       </button>`
                        : `<button class="action-btn edit" onclick="activateCategory(${category.id})" title="Faollashtirish">
                         <i class="fas fa-play"></i>
                       </button>`
                }
              </td>
          </tr>
      `,
            )
            .join("")
    }

    const modal = new bootstrap.Modal(document.getElementById("categoriesListModal"))
    modal.show()
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

            // Update main preview
            updateCategoryImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)
    }
}

// Toggle image upload section
function toggleImageUploadSection() {
    const enableImageUpload = document.getElementById("enable-image-upload")
    const imageUploadSection = document.getElementById("image-upload-section")

    if (enableImageUpload.checked) {
        imageUploadSection.style.display = "block"
    } else {
        imageUploadSection.style.display = "none"
        // Clear file input and preview
        document.getElementById("category-file-input").value = ""
        document.getElementById("category-file-preview").innerHTML = ""
        updateCategoryImagePreview()
    }
}

// Remove preview
function removePreview(button) {
    button.parentElement.remove()
    document.getElementById("category-file-input").value = ""
    updateCategoryImagePreview()
}

// Update category image preview
function updateCategoryImagePreview(imageSrc = null) {
    const previewContainer = document.getElementById("category-image-preview")

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

// Update image preview
function updateImagePreview() {
    const attachmentId = document.getElementById("category-attachment").value
    const previewContainer = document.getElementById("category-image-preview")

    if (attachmentId) {
        previewContainer.innerHTML = `
      <img src="${API_BASE_URL}/api/v1/attachment/${attachmentId}" 
           class="img-fluid rounded" 
           alt="Category Image"
           style="max-height: 200px; object-fit: contain;"
           onerror="this.src='/placeholder.svg?height=200&width=200'">
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

// Format date
function formatDate(dateString) {
    if (!dateString) return "-"

    try {
        const date = new Date(dateString)
        return (
            date.toLocaleDateString("uz-UZ") +
            " " +
            date.toLocaleTimeString("uz-UZ", {
                hour: "2-digit",
                minute: "2-digit",
            })
        )
    } catch (error) {
        return "-"
    }
}

// Refresh data
function refreshData() {
    loadCategoriesData()
    showNotification("success", "Ma'lumotlar yangilandi")
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

// Animate counter
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId)
    if (!element) return

    const startValue = 0
    const duration = 1000
    const startTime = performance.now()

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress)
        element.textContent = currentValue

        if (progress < 1) {
            requestAnimationFrame(updateCounter)
        }
    }

    requestAnimationFrame(updateCounter)
}

// Show loading
function showLoading() {
    const overlay = document.createElement("div")
    overlay.id = "loading-overlay"
    overlay.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Yuklanmoqda...</p>
  `
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(5px);
  `
    document.body.appendChild(overlay)
}

// Hide loading
function hideLoading() {
    const overlay = document.getElementById("loading-overlay")
    if (overlay) {
        overlay.remove()
    }
}

// Show notification
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

// Logout function
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
