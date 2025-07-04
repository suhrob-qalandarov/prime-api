// Import necessary libraries
const SockJS = require("sockjs-client")
const Stomp = require("stompjs")

const socket = new SockJS("http://localhost/ws")
const stompClient = Stomp.over(socket)
let movingOrderId = null
const bootstrap = window.bootstrap

// Order statuses
const ORDER_STATUSES = {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    INPROGRESS: "INPROGRESS",
    DELIVERED: "DELIVERED",
    CANCELED: "CANCELED",
}

// Global variables
let allOrders = []

const PENDING = document.getElementById("PENDING")
const ACCEPTED = document.getElementById("ACCEPTED")
const INPROGRESS = document.getElementById("INPROGRESS")
const DELIVERED = document.getElementById("DELIVERED")
const CANCELED = document.getElementById("CANCELED")

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded - Orders")
    checkAuth()
    initializeOrdersPanel()
    loadOrdersData()
})

// Check authentication
function checkAuth() {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        console.log("No token found, redirecting to login")
        // window.location.href = "login.html";
        // return;
    }
}

// Initialize orders panel
function initializeOrdersPanel() {
    setupSidebar()
    setupEventListeners()
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

// Setup event listeners
function setupEventListeners() {
    // Make functions available globally
    window.handleDragOver = handleDragOver
    window.handleDrop = handleDrop
    window.handleDragStart = handleDragStart
    window.showOrderDetails = showOrderDetails
    window.refreshData = refreshData
    window.toggleFullscreen = toggleFullscreen
    window.logout = logout
}

// Mock data for orders
function getMockOrdersData() {
    return [
        {
            id: 1001,
            customerName: "Alisher Karimov",
            customerPhone: "+998901234567",
            customerAddress: "Toshkent sh., Chilonzor t., 5-uy",
            status: "PENDING",
            totalAmount: 250000,
            orderDate: "2024-01-15T10:30:00",
            note: "Tezroq yetkazib bering",
            items: [
                { id: 1, name: "iPhone 14", quantity: 1, price: 200000, image: "/placeholder.svg?height=50&width=50" },
                { id: 2, name: "Telefon g'ilofi", quantity: 1, price: 50000, image: "/placeholder.svg?height=50&width=50" },
            ],
        },
        {
            id: 1002,
            customerName: "Malika Toshmatova",
            customerPhone: "+998907654321",
            customerAddress: "Samarqand sh., Registon ko'chasi, 12-uy",
            status: "PENDING",
            totalAmount: 180000,
            orderDate: "2024-01-15T11:15:00",
            note: "",
            items: [
                { id: 3, name: "Samsung Galaxy", quantity: 1, price: 180000, image: "/placeholder.svg?height=50&width=50" },
            ],
        },
        {
            id: 1003,
            customerName: "Bobur Rahimov",
            customerPhone: "+998901111111",
            customerAddress: "Buxoro sh., Mustaqillik ko'chasi, 8-uy",
            status: "ACCEPTED",
            totalAmount: 320000,
            orderDate: "2024-01-15T09:45:00",
            note: "Kechqurun yetkazish",
            items: [
                { id: 4, name: "MacBook Air", quantity: 1, price: 300000, image: "/placeholder.svg?height=50&width=50" },
                { id: 5, name: "Sichqoncha", quantity: 1, price: 20000, image: "/placeholder.svg?height=50&width=50" },
            ],
        },
        {
            id: 1004,
            customerName: "Dilnoza Abdullayeva",
            customerPhone: "+998902222222",
            customerAddress: "Andijon sh., Navoi ko'chasi, 15-uy",
            status: "ACCEPTED",
            totalAmount: 150000,
            orderDate: "2024-01-15T08:20:00",
            note: "",
            items: [
                { id: 6, name: "Bluetooth quloqchin", quantity: 2, price: 75000, image: "/placeholder.svg?height=50&width=50" },
            ],
        },
        {
            id: 1005,
            customerName: "Jasur Tursunov",
            customerPhone: "+998903333333",
            customerAddress: "Namangan sh., Uychi ko'chasi, 22-uy",
            status: "INPROGRESS",
            totalAmount: 450000,
            orderDate: "2024-01-14T16:30:00",
            note: "Ofisga yetkazish",
            items: [
                { id: 7, name: "Dell Monitor", quantity: 1, price: 400000, image: "/placeholder.svg?height=50&width=50" },
                { id: 8, name: "HDMI kabel", quantity: 1, price: 50000, image: "/placeholder.svg?height=50&width=50" },
            ],
        },
        {
            id: 1006,
            customerName: "Nigora Ismoilova",
            customerPhone: "+998904444444",
            customerAddress: "Farg'ona sh., Mustaqillik ko'chasi, 7-uy",
            status: "INPROGRESS",
            totalAmount: 280000,
            orderDate: "2024-01-14T14:15:00",
            note: "",
            items: [{ id: 9, name: "iPad", quantity: 1, price: 280000, image: "/placeholder.svg?height=50&width=50" }],
        },
        {
            id: 1007,
            customerName: "Otabek Nazarov",
            customerPhone: "+998905555555",
            customerAddress: "Qarshi sh., Amir Temur ko'chasi, 33-uy",
            status: "DELIVERED",
            totalAmount: 120000,
            orderDate: "2024-01-13T12:00:00",
            note: "Yetkazildi",
            items: [
                { id: 10, name: "Klaviatura", quantity: 1, price: 80000, image: "/placeholder.svg?height=50&width=50" },
                { id: 11, name: "Sichqoncha", quantity: 1, price: 40000, image: "/placeholder.svg?height=50&width=50" },
            ],
        },
        {
            id: 1008,
            customerName: "Zarina Qodirova",
            customerPhone: "+998906666666",
            customerAddress: "Jizzax sh., Sharof Rashidov ko'chasi, 18-uy",
            status: "DELIVERED",
            totalAmount: 350000,
            orderDate: "2024-01-13T10:30:00",
            note: "Muvaffaqiyatli yetkazildi",
            items: [{ id: 12, name: "Noutbuk", quantity: 1, price: 350000, image: "/placeholder.svg?height=50&width=50" }],
        },
        {
            id: 1009,
            customerName: "Sardor Mirzayev",
            customerPhone: "+998907777777",
            customerAddress: "Guliston sh., Navoi ko'chasi, 9-uy",
            status: "CANCELED",
            totalAmount: 200000,
            orderDate: "2024-01-12T15:45:00",
            note: "Mijoz bekor qildi",
            items: [{ id: 13, name: "Smartfon", quantity: 1, price: 200000, image: "/placeholder.svg?height=50&width=50" }],
        },
        {
            id: 1010,
            customerName: "Feruza Karimova",
            customerPhone: "+998908888888",
            customerAddress: "Termiz sh., Amir Temur ko'chasi, 25-uy",
            status: "CANCELED",
            totalAmount: 90000,
            orderDate: "2024-01-12T11:20:00",
            note: "Mahsulot mavjud emas",
            items: [
                { id: 14, name: "Telefon aksessuari", quantity: 3, price: 30000, image: "/placeholder.svg?height=50&width=50" },
            ],
        },
    ]
}

// Load orders data
function loadOrdersData() {
    try {
        showLoading()

        console.log("Loading orders data...")

        // Simulate API delay
        setTimeout(() => {
            allOrders = getMockOrdersData()

            console.log("Orders data loaded:", allOrders)

            // Update statistics
            updateOrderStats()

            // Render orders in columns
            renderOrdersBoard()

            hideLoading()
        }, 1000)
    } catch (error) {
        console.error("Error loading orders:", error)
        showNotification("error", "Buyurtmalar ma'lumotlarini yuklashda xatolik")
        hideLoading()
    }
}

// Update order statistics
function updateOrderStats() {
    const stats = {
        total: allOrders.length,
        pending: allOrders.filter((order) => order.status === "PENDING").length,
        accepted: allOrders.filter((order) => order.status === "ACCEPTED").length,
        inprogress: allOrders.filter((order) => order.status === "INPROGRESS").length,
        delivered: allOrders.filter((order) => order.status === "DELIVERED").length,
        canceled: allOrders.filter((order) => order.status === "CANCELED").length,
    }

    console.log("Updating stats:", stats)

    animateCounter("total-orders", stats.total)
    animateCounter("pending-orders", stats.pending)
    animateCounter("inprogress-orders", stats.inprogress)
    animateCounter("delivered-orders", stats.delivered)

    // Update column counts
    document.getElementById("pending-count").textContent = stats.pending
    document.getElementById("accepted-count").textContent = stats.accepted
    document.getElementById("inprogress-count").textContent = stats.inprogress
    document.getElementById("delivered-count").textContent = stats.delivered
    document.getElementById("canceled-count").textContent = stats.canceled
}

// Render orders board
function renderOrdersBoard() {
    const columns = {
        PENDING: document.getElementById("PENDING"),
        ACCEPTED: document.getElementById("ACCEPTED"),
        INPROGRESS: document.getElementById("INPROGRESS"),
        DELIVERED: document.getElementById("DELIVERED"),
        CANCELED: document.getElementById("CANCELED"),
    }

    // Clear all columns
    Object.values(columns).forEach((column) => {
        if (column) column.innerHTML = ""
    })

    // Group orders by status
    const ordersByStatus = {
        PENDING: [],
        ACCEPTED: [],
        INPROGRESS: [],
        DELIVERED: [],
        CANCELED: [],
    }

    allOrders.forEach((order) => {
        if (ordersByStatus[order.status]) {
            ordersByStatus[order.status].push(order)
        }
    })

    // Render orders in each column
    Object.keys(ordersByStatus).forEach((status) => {
        const column = columns[status]
        const orders = ordersByStatus[status]

        if (!column) return

        if (orders.length === 0) {
            column.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>Buyurtmalar mavjud emas</p>
        </div>
      `
        } else {
            column.innerHTML = orders.map((order) => createOrderCard(order)).join("")
        }
    })
}

// Create order card HTML
function createOrderCard(order) {
    return `
    <div class="order-card" 
         draggable="true" 
         ondragstart="handleDragStart(${order.id})"
         onclick="showOrderDetails(${order.id})">
      <div class="order-card-header">
        <div class="order-id">#${order.id}</div>
        <div class="order-status-badge ${order.status.toLowerCase()}">
          ${getStatusText(order.status)}
        </div>
      </div>
      
      <div class="order-customer">
        <i class="fas fa-user"></i>
        <span>${order.customerName}</span>
      </div>
      
      <div class="order-total">${formatPrice(order.totalAmount)}</div>
      
      <div class="order-date">
        <i class="fas fa-clock"></i>
        <span>${formatDate(order.orderDate)}</span>
      </div>
      
      <div class="order-items-count">
        <i class="fas fa-box"></i>
        <span>${order.items.length} ta mahsulot</span>
      </div>
    </div>
  `
}

// Get status text in Uzbek
function getStatusText(status) {
    switch (status) {
        case "PENDING":
            return "Kutilmoqda"
        case "ACCEPTED":
            return "Qabul qilindi"
        case "INPROGRESS":
            return "Yo'lda"
        case "DELIVERED":
            return "Yetkazildi"
        case "CANCELED":
            return "Bekor qilindi"
        default:
            return status
    }
}

stompClient.connect(
    {},
    (frame) => {
        console.log("WebSocket ulandi:", frame)
        stompClient.subscribe("/topic/order/new", (message) => {
            loadOrdersData()
        })
        stompClient.subscribe("/topic/order/stop", (message) => {
            const orderId = message.body
            if (!orderId) {
                console.error("Noto‘g‘ri buyurtma ID:", message.body)
                return
            }
            const li = document.getElementById("order_" + orderId)
            if (li) {
                li.style.backgroundColor = "grey"
            } else {
                console.warn("Element topilmadi: order_" + orderId)
            }
        })
        stompClient.subscribe("/topic/order/dropped", (message) => {
            loadOrdersData()
        })
    },
    (error) => {
        console.error("WebSocket ulanish xatosi:", error)
        alert("Serverga ulanishda xato yuz berdi!")
    },
)

function handleDragOver(ev) {
    ev.preventDefault()
}

function handleDrop(ev, status) {
    ev.preventDefault()
    if (!movingOrderId) {
        console.error("No order selected for moving")
        return
    }

    console.log(`Moving order ${movingOrderId} to ${status}`)

    // Find and update the order
    const orderIndex = allOrders.findIndex((order) => order.id === movingOrderId)
    if (orderIndex !== -1) {
        const oldStatus = allOrders[orderIndex].status
        allOrders[orderIndex].status = status

        // Show notification
        const order = allOrders[orderIndex]
        showNotification("success", `Buyurtma #${order.id} holati "${getStatusText(status)}" ga o'zgartirildi`)

        // Update UI
        updateOrderStats()
        renderOrdersBoard()
    }

    // Reset moving order
    movingOrderId = null

    // Remove dragging class from all cards
    document.querySelectorAll(".order-card.dragging").forEach((card) => {
        card.classList.remove("dragging")
    })
}

function handleDragStart(id) {
    if (!id) {
        console.error("Noto‘g‘ri buyurtma ID:", id)
        return
    }
    movingOrderId = id
    console.log("Drag started for order:", id)

    // Add visual feedback
    const orderCard = event.target.closest(".order-card")
    if (orderCard) {
        orderCard.classList.add("dragging")
    }
}

// Show order details modal
function showOrderDetails(orderId) {
    const order = allOrders.find((o) => o.id === orderId)
    if (!order) {
        showNotification("error", "Buyurtma topilmadi")
        return
    }

    // Populate modal with order data
    document.getElementById("view-order-id").textContent = `#${order.id}`
    document.getElementById("view-order-customer").textContent = order.customerName
    document.getElementById("view-order-phone").textContent = order.customerPhone
    document.getElementById("view-order-address").textContent = order.customerAddress
    document.getElementById("view-order-total").textContent = formatPrice(order.totalAmount)
    document.getElementById("view-order-date").textContent = formatDate(order.orderDate)
    document.getElementById("view-order-note").textContent = order.note || "Izoh yo'q"

    // Status badge
    document.getElementById("view-order-status").innerHTML = `
    <span class="order-status-badge ${order.status.toLowerCase()}">
      ${getStatusText(order.status)}
    </span>
  `

    // Order items
    const itemsContainer = document.getElementById("view-order-items")
    itemsContainer.innerHTML = order.items
        .map(
            (item) => `
    <div class="order-item">
      <div class="order-item-info">
        <img src="${item.image}" alt="${item.name}" class="order-item-image">
        <div class="order-item-details">
          <h6>${item.name}</h6>
          <p>Miqdor: ${item.quantity}</p>
        </div>
      </div>
      <div class="order-item-price">${formatPrice(item.price)}</div>
    </div>
  `,
        )
        .join("")

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("viewOrderModal"))
    modal.show()
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
    loadOrdersData()
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
