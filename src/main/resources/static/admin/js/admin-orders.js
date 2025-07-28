// WebSocket ulanish
const socket = new SockJS("http://localhost/ws")
const stompClient = Stomp.over(socket)
let movingOrderId = null

// Order statuslari
const ORDER_STATUSES = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
}

// Global o'zgaruvchilar
let allOrders = []
const API_BASE_URL = "http://localhost/api/v1"

// DOM yuklanganda ishga tushadi
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM yuklandi - Buyurtmalar sahifasi")
    checkAuth()
    initializeOrdersPanel()
    connectWebSocket()
    loadOrdersData()
})

// Autentifikatsiyani tekshirish
function checkAuth() {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        console.log("Token topilmadi, login sahifasiga yo'naltirilmoqda")
        // window.location.href = 'login.html';
        // return;
    }
}

// Buyurtmalar panelini ishga tushirish
function initializeOrdersPanel() {
    setupSidebar()
    setupEventListeners()
}

// Sidebar sozlash
function setupSidebar() {
    const sidebarToggle = document.getElementById("sidebar-toggle")
    const sidebar = document.getElementById("sidebar")

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("show")
        })
    }

    // Tashqarida bosilganda sidebar yopish
    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove("show")
        }
    })
}

// Event listenerlarni sozlash
function setupEventListeners() {
    window.handleDragOver = handleDragOver
    window.handleDrop = handleDrop
    window.handleDragStart = handleDragStart
    window.showOrderDetails = showOrderDetails
    window.refreshData = refreshData
    window.toggleFullscreen = toggleFullscreen
    window.logout = logout
}

// WebSocket ulanish
function connectWebSocket() {
    stompClient.connect(
        {},
        (frame) => {
            console.log("WebSocket ulandi:", frame)

            // Yangi buyurtma kelganda
            stompClient.subscribe("/topic/order/new", (message) => {
                console.log("Yangi buyurtma keldi:", message.body)
                loadOrdersData()
                showNotification("info", "Yangi buyurtma keldi!")
            })

            // Buyurtma to'xtatilganda
            stompClient.subscribe("/topic/order/stop", (message) => {
                const orderId = message.body
                console.log("Buyurtma to'xtatildi:", orderId)
                updateOrderVisualStatus(orderId, "stopped")
            })

            // Buyurtma bekor qilinganda
            stompClient.subscribe("/topic/order/dropped", (message) => {
                console.log("Buyurtma bekor qilindi:", message.body)
                loadOrdersData()
                showNotification("warning", "Buyurtma bekor qilindi")
            })
        },
        (error) => {
            console.error("WebSocket ulanish xatosi:", error)
            showNotification("error", "Serverga ulanishda xato yuz berdi!")

            // Qayta ulanishga harakat qilish
            setTimeout(() => {
                console.log("WebSocket qayta ulanishga harakat qilinmoqda...")
                connectWebSocket()
            }, 5000)
        },
    )
}

// Buyurtmalar ma'lumotlarini yuklash
async function loadOrdersData() {
    try {
        showLoading()
        console.log("Buyurtmalar ma'lumotlari yuklanmoqda...")

        const token = localStorage.getItem("accessToken")
        const response = await fetch(`${API_BASE_URL}/admin/orders`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const orders = await response.json()
        console.log("Buyurtmalar yuklandi:", orders)

        // Ma'lumotlarni o'zgartirish (backend formatidan frontend formatiga)
        allOrders = orders.map((order) => ({
            id: order.id,
            customerName: order.user?.firstName + " " + order.user.lastName || "Noma'lum mijoz",
            customerPhone: order.user?.phone || "Telefon ko'rsatilmagan",
            status: order.status || "PENDING",
            totalAmount: order.totalPrice || 0,
            orderDate: order.createdAt || new Date().toISOString(),
            note: order.note || "",
            items:
                order.ordersItems?.map((item) => ({
                    id: item.productRes?.id || 0,
                    name: item.productRes?.name || "Noma'lum mahsulot",
                    quantity: item.quantity || 1,
                    price: item.productRes?.price || 0,
                    image: item.productRes?.image || "/placeholder.svg?height=50&width=50",
                })) || [],
        }))

        // Statistikani yangilash
        updateOrderStats()

        // Buyurtmalar taxtasini render qilish
        renderOrdersBoard()

        hideLoading()
    } catch (error) {
        console.error("Buyurtmalarni yuklashda xato:", error)
        showNotification("error", "Buyurtmalar ma'lumotlarini yuklashda xatolik yuz berdi")
        hideLoading()

        // Mock ma'lumotlardan foydalanish (development uchun)
        loadMockData()
    }
}

// Mock ma'lumotlarni yuklash (development uchun)
function loadMockData() {
    console.log("Mock ma'lumotlar yuklanmoqda...")

    allOrders = [
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
            status: "CONFIRMED",
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
            status: "SHIPPED",
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
            customerName: "Gulnora Saidova",
            customerPhone: "+998912345678",
            customerAddress: "Andijon sh., Bobur shoh ko'chasi, 22-uy",
            status: "DELIVERED",
            totalAmount: 120000,
            orderDate: "2024-01-14T14:00:00",
            note: "Eshik oldiga qoldirish",
            items: [{ id: 6, name: "Smart soat", quantity: 1, price: 120000, image: "/placeholder.svg?height=50&width=50" }],
        },
        {
            id: 1005,
            customerName: "Farhod Olimov",
            customerPhone: "+998934567890",
            customerAddress: "Farg'ona sh., Alisher Navoiy ko'chasi, 7-uy",
            status: "CANCELLED",
            totalAmount: 75000,
            orderDate: "2024-01-13T16:45:00",
            note: "Mijoz bekor qildi",
            items: [
                { id: 7, name: "Simsiz quloqchin", quantity: 1, price: 75000, image: "/placeholder.svg?height=50&width=50" },
            ],
        },
    ]

    updateOrderStats()
    renderOrdersBoard()
}

// Buyurtma statistikasini yangilash
function updateOrderStats() {
    const stats = {
        total: allOrders.length,
        pending: allOrders.filter((order) => order.status === "PENDING").length,
        confirmed: allOrders.filter((order) => order.status === "CONFIRMED").length,
        shipped: allOrders.filter((order) => order.status === "SHIPPED").length,
        delivered: allOrders.filter((order) => order.status === "DELIVERED").length,
        cancelled: allOrders.filter((order) => order.status === "CANCELLED").length,
    }

    console.log("Statistika yangilanmoqda:", stats)

    // Asosiy statistika kartalarini yangilash
    animateCounter("total-orders", stats.total)
    animateCounter("pending-orders", stats.pending)
    animateCounter("shipped-orders", stats.shipped)
    animateCounter("delivered-orders", stats.delivered)

    // Ustun hisoblagichlarini yangilash
    document.getElementById("pending-count").textContent = stats.pending
    document.getElementById("confirmed-count").textContent = stats.confirmed
    document.getElementById("shipped-count").textContent = stats.shipped
    document.getElementById("delivered-count").textContent = stats.delivered
    document.getElementById("cancelled-count").textContent = stats.cancelled
}

// Buyurtmalar taxtasini render qilish
function renderOrdersBoard() {
    const columns = {
        PENDING: document.getElementById("PENDING"),
        CONFIRMED: document.getElementById("CONFIRMED"),
        SHIPPED: document.getElementById("SHIPPED"),
        DELIVERED: document.getElementById("DELIVERED"),
        CANCELLED: document.getElementById("CANCELLED"),
    }

    // Barcha ustunlarni tozalash
    Object.values(columns).forEach((column) => {
        if (column) column.innerHTML = ""
    })

    // Buyurtmalarni status bo'yicha guruhlash
    const ordersByStatus = {
        PENDING: [],
        CONFIRMED: [],
        SHIPPED: [],
        DELIVERED: [],
        CANCELLED: [],
    }

    allOrders.forEach((order) => {
        if (ordersByStatus[order.status]) {
            ordersByStatus[order.status].push(order)
        }
    })

    // Har bir ustunda buyurtmalarni render qilish
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

// Buyurtma kartasi HTML yaratish
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

          <div class="order-date">
              <i class="fas fa-clock"></i>
              <span>${formatDate(order.orderDate)}</span>
          </div>

          <div class="order-items-count">
              <i class="fas fa-box"></i>
              <span>${order.items.length} ta mahsulot</span>
          </div>

          <div class="order-total">${formatPrice(order.totalAmount)} so'm</div>
      </div>
  `
}

// Status matnini o'zbek tilida olish
function getStatusText(status) {
    switch (status) {
        case "PENDING":
            return "Kutilmoqda"
        case "CONFIRMED":
            return "Tasdiqlandi"
        case "SHIPPED":
            return "Yo'lda"
        case "DELIVERED":
            return "Yetkazildi"
        case "CANCELLED":
            return "Bekor qilindi"
        default:
            return status
    }
}

// Drag and Drop funksiyalari
function handleDragOver(ev) {
    ev.preventDefault()
    const column = ev.target.closest(".order-column")
    if (column) {
        column.classList.add("dragging-over")
    }
}

function handleDrop(ev, status) {
    ev.preventDefault()
    const column = ev.target.closest(".order-column")
    if (column) {
        column.classList.remove("dragging-over")
    }

    if (!movingOrderId) {
        console.error("Ko'chirish uchun buyurtma tanlanmagan")
        return
    }

    console.log(`Buyurtma ${movingOrderId} ni ${status} holatiga ko'chirish`)
    updateOrderStatus(movingOrderId, status)
}

function handleDragStart(id) {
    if (!id) {
        console.error("Noto'g'ri buyurtma ID:", id)
        return
    }
    movingOrderId = id
    console.log("Drag boshlandi:", id)

    // Vizual feedback qo'shish
    const orderCard = event.target.closest(".order-card")
    if (orderCard) {
        orderCard.classList.add("dragging")
    }
}

// Buyurtma statusini yangilash
async function updateOrderStatus(orderId, newStatus) {
    try {
        const token = localStorage.getItem("accessToken")
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Local ma'lumotlarni yangilash
        const orderIndex = allOrders.findIndex((order) => order.id === orderId)
        if (orderIndex !== -1) {
            const oldStatus = allOrders[orderIndex].status
            allOrders[orderIndex].status = newStatus

            // Bildirishnoma ko'rsatish
            const order = allOrders[orderIndex]
            showNotification("success", `Buyurtma #${order.id} holati "${getStatusText(newStatus)}" ga o'zgartirildi`)

            // UI ni yangilash
            updateOrderStats()
            renderOrdersBoard()
        }

        console.log(`Buyurtma ${orderId} holati ${newStatus} ga o'zgartirildi`)
    } catch (error) {
        console.error("Buyurtma holatini yangilashda xato:", error)
        showNotification("error", "Buyurtma holatini yangilashda xatolik yuz berdi")
    }

    // Drag holatini tozalash
    movingOrderId = null
    document.querySelectorAll(".order-card.dragging").forEach((card) => {
        card.classList.remove("dragging")
    })
}

// Buyurtma tafsilotlarini ko'rsatish
function showOrderDetails(orderId) {
    const order = allOrders.find((o) => o.id === orderId)
    if (!order) {
        showNotification("error", "Buyurtma topilmadi")
        return
    }

    // Modal ma'lumotlarini to'ldirish
    document.getElementById("view-order-id").textContent = `#${order.id}`
    document.getElementById("view-order-customer").textContent = order.customerName
    document.getElementById("view-order-phone").textContent = order.customerPhone
    document.getElementById("view-order-total").textContent = formatPrice(order.totalAmount) + " so'm"
    document.getElementById("view-order-date").textContent = formatDate(order.orderDate)

    // Status badge
    document.getElementById("view-order-status").innerHTML = `
      <span class="order-status-badge ${order.status.toLowerCase()}">
          ${getStatusText(order.status)}
      </span>
  `

    // Buyurtma mahsulotlari
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
          <div class="order-item-price">${formatPrice(item.price)} so'm</div>
      </div>
  `,
        )
        .join("")

    // Modalni ko'rsatish
    const modal = new bootstrap.Modal(document.getElementById("viewOrderModal"))
    modal.show()
}

// Buyurtma vizual holatini yangilash
function updateOrderVisualStatus(orderId, visualStatus) {
    const orderCard = document.querySelector(`[ondragstart="handleDragStart(${orderId})"]`)
    if (orderCard) {
        if (visualStatus === "stopped") {
            orderCard.style.backgroundColor = "#6c757d"
            orderCard.style.opacity = "0.7"
        }
    }
}

// Yordamchi funksiyalar
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
    notification.className = `alert alert-${type === "success" ? "success" : type === "error" ? "danger" : type === "warning" ? "warning" : "info"} alert-dismissible fade show notification`

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

// WebSocket orqali real-time yangilanishlar
function sendWebSocketMessage(destination, message) {
    if (stompClient && stompClient.connected) {
        stompClient.send(destination, {}, message)
    } else {
        console.error("WebSocket ulanmagan")
    }
}

// Buyurtmani to'xtatish
function stopOrder(orderId) {
    sendWebSocketMessage("/app/stop", orderId.toString())
}

// Buyurtmani bekor qilish
function dropOrder(orderId) {
    sendWebSocketMessage("/app/dropped", orderId.toString())
}
