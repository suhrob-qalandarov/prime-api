// Global variables
let dashboardData = null
let allUsers = []
let activeUsers = []
let inactiveUsers = []
let filteredUsers = []
const bootstrap = window.bootstrap

// API Base URL
const API_BASE_URL = "http://localhost" // Using the same base URL as products.js

// Initialize users panel
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded - Users")
    checkAuth()
    initializeUsersPanel()
    loadUsersDashboard()
})

// Check authentication
function checkAuth() {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        console.log("No token found, redirecting to login")
        // window.location.href = "login.html" // Uncomment for actual auth flow
        // return
    }
}

// Initialize users panel
function initializeUsersPanel() {
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
                searchUsers()
            }
        })
    }
}

// Setup event listeners
function setupEventListeners() {
    // Make functions available globally
    window.initializeUsersPanel = initializeUsersPanel
    window.loadUsersDashboard = loadUsersDashboard
    window.filterUsers = filterUsers
    window.searchUsers = searchUsers
    window.clearSearch = clearSearch
    window.refreshData = refreshData
    window.toggleFullscreen = toggleFullscreen
    window.logout = logout
    window.toggleUser = toggleUser // Keep toggle function
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
            // window.location.href = "login.html" // Uncomment for actual auth flow
            // return null
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`API request failed: ${response.status} - ${errorText}`)
        }

        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            return await response.json()
        } else {
            return await response.text()
        }
    } catch (error) {
        console.error("API request error:", error)
        throw error // Re-throw the error so calling functions can handle it.
    }
}

// Load users dashboard data
async function loadUsersDashboard() {
    try {
        showLoading()

        console.log("Loading users dashboard...")

        // API call to get all user data
        dashboardData = await apiRequest("/api/v1/admin/users/dashboard")

        if (dashboardData) {
            console.log("Dashboard data loaded:", dashboardData)

            // Update local data
            allUsers = dashboardData.adminUserResList || [] // Use adminUserResList
            activeUsers = allUsers.filter((user) => user.active)
            inactiveUsers = allUsers.filter((user) => !user.active)
            filteredUsers = [...allUsers]

            // Update statistics
            updateUserStats()

            // Render table
            renderUsersTable(filteredUsers)
        } else {
            console.error("No dashboard data received")
            showNotification("error", "Ma'lumotlar yuklanmadi")
        }

        hideLoading()
    } catch (error) {
        console.error("Error loading users dashboard:", error)
        showNotification("error", "Foydalanuvchilar ma'lumotlarini yuklashda xatolik")
        hideLoading()
    }
}

// Update user statistics
function updateUserStats() {
    if (dashboardData) {
        console.log("Updating stats:", dashboardData)
        animateCounter("total-users", dashboardData.count || 0)
        animateCounter("active-users", dashboardData.activeCount || 0)
        animateCounter("inactive-users", dashboardData.inactiveCount || 0)
    }
}

// Render users table
function renderUsersTable(users) {
    const tbody = document.getElementById("users-table")
    if (!tbody) {
        console.error("Users table tbody not found")
        return
    }

    console.log("Rendering users:", users)

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Ma\'lumotlar mavjud emas</td></tr>'
        return
    }

    tbody.innerHTML = users
        .map(
            (user) => `
        <tr class="fade-in">
            <td data-label="ID">${user.id}</td>
            <td data-label="Ism" class="fw-bold">${user.firstName || "-"}</td>
            <td data-label="Familiya">${user.lastName || "-"}</td>
            <td data-label="Email">${user.email || "-"}</td>
            <td data-label="Telefon">${user.phone || "-"}</td>
            <td data-label="Holati">
                <span class="status-badge ${user.active ? "active" : "inactive"}">
                    ${user.active ? "FAOL" : "NOFAOL"}
                </span>
            </td>
            <td data-label="Yaratilgan">${formatDate(user.createdAt)}</td>
            <td data-label="Amallar">
                <button class="action-btn ${user.active ? "delete" : "edit"}" onclick="toggleUser(${user.id})" title="${user.active ? "Nofaollashtirish" : "Faollashtirish"}">
                    <i class="fas fa-${user.active ? "pause" : "play"}"></i>
                </button>
            </td>
        </tr>
    `,
        )
        .join("")
}

// Toggle user active status
async function toggleUser(userId) {
    try {
        const response = await apiRequest(`/api/v1/admin/user/toogle/${userId}`, {
            method: "PATCH",
        })

        if (response === "OK" || response === 200) {
            showNotification("success", `Foydalanuvchi holati o'zgartirildi`)
            await loadUsersDashboard() // Refresh data after toggle
        }
    } catch (error) {
        console.error("Error toggling user:", error)
        showNotification("error", "Foydalanuvchi holatini o'zgartirishda xatolik")
    }
}

// Apply current filter to update filteredUsers
function applyCurrentFilter() {
    const statusFilter = document.getElementById("status-filter")?.value || "all"

    switch (statusFilter) {
        case "all":
            filteredUsers = [...allUsers]
            break
        case "active":
            filteredUsers = [...activeUsers]
            break
        case "inactive":
            filteredUsers = [...inactiveUsers]
            break
        default:
            filteredUsers = [...allUsers]
    }
}

// Filter users
function filterUsers() {
    applyCurrentFilter()
    renderUsersTable(filteredUsers)
}

// Search users
function searchUsers() {
    const searchTerm = document.getElementById("search-input")?.value.trim().toLowerCase()

    if (!searchTerm) {
        filterUsers() // Reset to current filter
        return
    }

    filteredUsers = allUsers.filter(
        (user) =>
            (user.firstName && user.firstName.toLowerCase().includes(searchTerm)) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchTerm)) ||
            (user.email && user.email.toLowerCase().includes(searchTerm)) ||
            (user.phone && user.phone.toLowerCase().includes(searchTerm)),
    )

    renderUsersTable(filteredUsers)
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById("search-input")
    if (searchInput) {
        searchInput.value = ""
    }
    filterUsers()
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return "-"

    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            return "-"
        }
        return (
            date.toLocaleDateString("uz-UZ") + " " + date.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
        )
    } catch (error) {
        console.error("Error formatting date:", dateString, error)
        return "-"
    }
}

function refreshData() {
    loadUsersDashboard()
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
            window.location.href = "login.html" // Redirect to login page
        }, 1000)
    }
}
