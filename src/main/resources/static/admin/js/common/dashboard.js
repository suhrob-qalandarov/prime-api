// API Configuration
const API_BASE_URL = ""

// Global variables
let allCategories = []
let allProducts = []
let allUsers = []
const uploadedFiles = []
let isRefreshing = false
const bootstrap = window.bootstrap

// Initialize admin panel
document.addEventListener("DOMContentLoaded", () => {
    checkAuth()
    initializeAdminPanel()
    loadDashboardData()
})

/*// Check authentication
function checkAuth() {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        window.location.href = "login.html"
        return
    }
}*/

// Initialize admin panel
function initializeAdminPanel() {
    setupSidebar()
    setupEventListeners()
    addAnimations()
}

// Setup sidebar
function setupSidebar() {
    const sidebarToggle = document.getElementById("sidebar-toggle")
    const sidebar = document.getElementById("sidebar")

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("show")
    })

    // Set active navigation based on current page
    setActiveNavigation()
}

// Set active navigation based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "admin.html"
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link")

    navLinks.forEach((link) => {
        link.classList.remove("active")
        const href = link.getAttribute("href")
        if (href === currentPage) {
            link.classList.add("active")
        }
    })
}

// Setup event listeners
function setupEventListeners() {
    // Refresh data button
    window.refreshData = () => {
        loadDashboardData()
        showNotification("success", "Ma'lumotlar yangilandi")
    }

    // Fullscreen toggle
    window.toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    // Make functions available globally
    window.loadCategories = loadCategories
    window.loadProducts = loadProducts
    window.logout = logout
}

// API request with token
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("accessToken")

    if (!token && !isRefreshing) {
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

        if (response.status === 401 && !isRefreshing) {
            // Try to refresh token
            const refreshed = await refreshToken()
            if (refreshed) {
                // Retry the request with new token
                return apiRequest(url, options)
            } else {
                // Redirect to login if refresh failed
                window.location.href = "login.html"
                return null
            }
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`API request failed: ${response.status} - ${errorText}`)
        }

        // For attachment GET requests, return the response directly
        if (url.startsWith("/api/v1/attachment/") && !options.method) {
            return response
        }

        // For other requests, parse JSON if content type is JSON
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

// Refresh token
async function refreshToken() {
    isRefreshing = true
    const refreshTokenValue = localStorage.getItem("refreshToken")

    if (!refreshTokenValue) {
        isRefreshing = false
        return false
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh/${refreshTokenValue}`, {
            method: "POST",
        })

        if (!response.ok) {
            throw new Error("Token refresh failed")
        }

        const data = await response.json()
        localStorage.setItem("accessToken", data.accessToken)
        isRefreshing = false
        return true
    } catch (error) {
        console.error("Token refresh error:", error)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        isRefreshing = false
        return false
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        showLoading()

        await Promise.all([loadActiveCategories(), loadActiveProducts(), loadUsers()])

        updateDashboardStats()
        updateRecentItems()

        hideLoading()
    } catch (error) {
        console.error("Error loading dashboard data:", error)
        showNotification("error", "Dashboard ma'lumotlarini yuklashda xatolik")
        hideLoading()
    }
}

// Update dashboard stats
function updateDashboardStats() {
    // Animate counters
    animateCounter("total-categories", allCategories.length)
    animateCounter("total-products", allProducts.length)
    animateCounter("total-users", allUsers.length)
    animateCounter("total-attachments", uploadedFiles.length)
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

// Update recent items
function updateRecentItems() {
    // Recent categories
    const recentCategories = document.getElementById("recent-categories")
    if (recentCategories) {
        const latestCategories = allCategories.slice(-5).reverse()

        recentCategories.innerHTML =
            latestCategories.length > 0
                ? latestCategories
                    .map(
                        (cat) => `
              <div class="recent-item">
                  <div class="recent-icon category">
                      <i class="fas fa-tag"></i>
                  </div>
                  <div class="recent-content">
                      <div class="recent-title">${cat.name}</div>
                      <div class="recent-meta">ID: ${cat.id}</div>
                  </div>
              </div>
          `,
                    )
                    .join("")
                : '<div class="loading-state"><p>Kategoriyalar mavjud emas</p></div>'
    }

    // Recent products
    const recentProducts = document.getElementById("recent-products")
    if (recentProducts) {
        const latestProducts = allProducts.slice(-5).reverse()

        recentProducts.innerHTML =
            latestProducts.length > 0
                ? latestProducts
                    .map(
                        (prod) => `
              <div class="recent-item">
                  <div class="recent-icon product">
                      <i class="fas fa-box-open"></i>
                  </div>
                  <div class="recent-content">
                      <div class="recent-title">${prod.name}</div>
                      <div class="recent-meta">
                          <span class="recent-price">${formatPrice(prod.price)} so'm</span>
                      </div>
                  </div>
              </div>
          `,
                    )
                    .join("")
                : '<div class="loading-state"><p>Mahsulotlar mavjud emas</p></div>'
    }
}

// Load active categories (for dashboard and public)
async function loadActiveCategories() {
    try {
        const data = await apiRequest("/api/v1/admin/categories")
        if (data) {
            allCategories = data || []
        }
    } catch (error) {
        console.error("Error loading active categories:", error)
        showNotification("error", "Faol kategoriyalarni yuklashda xatolik")
    }
}

// Load categories (for refresh button)
async function loadCategories() {
    await loadActiveCategories()
    updateRecentItems()
    showNotification("success", "Kategoriyalar yangilandi")
}

// Load active products (for dashboard and public)
async function loadActiveProducts() {
    try {
        const data = await apiRequest("/api/v1/admin/products")
        if (data) {
            allProducts = data || []
        }
    } catch (error) {
        console.error("Error loading active products:", error)
        showNotification("error", "Faol mahsulotlarni yuklashda xatolik")
    }
}

// Load products (for refresh button)
async function loadProducts() {
    await loadActiveProducts()
    updateRecentItems()
    showNotification("success", "Mahsulotlar yangilandi")
}

// Load users (placeholder - no API provided)
async function loadUsers() {
    try {
        // Since no user API is provided, we'll use placeholder data
        allUsers = []
    } catch (error) {
        console.error("Error loading users:", error)
        showNotification("error", "Foydalanuvchilarni yuklashda xatolik")
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat("uz-UZ").format(price)
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

// Add animations
function addAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in")
            }
        })
    })

    document.querySelectorAll(".stats-card, .dashboard-card").forEach((card) => {
        observer.observe(card)
    })
}

// Show notification
function showNotification(type, message) {
    const notification = document.createElement("div")
    notification.className = `alert alert-${type === "success" ? "success" : type === "error" ? "danger" : type === "warning" ? "warning" : "info"} alert-dismissible fade show position-fixed`
    notification.style.cssText = "top: 20px; right: 20px; z-index: 9999; max-width: 350px; animation: slideIn 0.3s ease;"

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
