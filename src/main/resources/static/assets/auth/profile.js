import axios from 'axios';

class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.ordersData = {
            pendingOrders: [],
            confirmedOrders: [],
            shippedOrders: []
        };
        this.currentFilter = 'all';

        this.init();
    }

    init() {
        // Check authentication
        if (!this.checkAuth()) {
            window.location.href = 'login.html';
            return;
        }

        this.loadUserData();
        this.setupEventListeners();
        this.loadOrders();
    }

    checkAuth() {
        const token = this.getCookie('prime-token');
        const userData = localStorage.getItem('prime-user');

        if (!token || !userData) {
            return false;
        }

        try {
            this.currentUser = JSON.parse(userData);
            return true;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return false;
        }
    }

    loadUserData() {
        if (!this.currentUser) return;

        const userName = document.getElementById('userName');
        const userPhone = document.getElementById('userPhone');
        const adminBtn = document.getElementById('adminBtn');

        userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        userPhone.textContent = this.currentUser.phone || 'Telefon raqam kiritilmagan';

        // Show admin button if user has ROLE_ADMIN
        if (this.currentUser.roles && this.currentUser.roles.includes('ROLE_ADMIN')) {
            adminBtn.style.display = 'inline-block';
        }
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', () => {
            this.logout();
        });

        // Order tabs
        const orderTabs = document.querySelectorAll('.order-tab');
        orderTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                orderTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Filter orders
                this.currentFilter = tab.dataset.status;
                this.renderOrders();
            });
        });
    }

    async loadOrders() {
        if (!this.currentUser || !this.currentUser.telegramId) {
            this.showNoOrders('Foydalanuvchi ma\'lumotlari topilmadi');
            return;
        }

        try {
            const token = this.getCookie('prime-token');

            const response = await axios.get(`https://prime77.uz/api/v1/orders/${this.currentUser.telegramId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000 // 15 seconds timeout
            });

            const data = response.data;

            // Store the grouped orders data
            this.ordersData = {
                pendingOrders: data.pendingOrders || [],
                confirmedOrders: data.confirmedOrders || [],
                shippedOrders: data.shippedOrders || []
            };

            this.renderOrders();

        } catch (error) {
            console.error('Error loading orders:', error);

            let errorMessage = 'Buyurtmalarni yuklashda xatolik yuz berdi';

            if (error.response) {
                // Server responded with error status
                switch (error.response.status) {
                    case 401:
                        errorMessage = 'Avtorizatsiya xatosi. Qayta kiring';
                        // Redirect to login after 2 seconds
                        setTimeout(() => {
                            this.logout();
                        }, 2000);
                        break;
                    case 403:
                        errorMessage = 'Ruxsat yo\'q. Buyurtmalarni ko\'rish huquqi mavjud emas';
                        break;
                    case 404:
                        errorMessage = 'Foydalanuvchi topilmadi';
                        break;
                    case 500:
                        errorMessage = 'Server xatosi. Iltimos, qayta urinib ko\'ring';
                        break;
                    default:
                        errorMessage = `Server xatosi: ${error.response.status}`;
                }
            } else if (error.request) {
                // Network error
                errorMessage = 'Internet aloqasi bilan muammo. Ulanishni tekshiring';
            } else if (error.code === 'ECONNABORTED') {
                // Timeout error
                errorMessage = 'So\'rov vaqti tugadi. Qayta urinib ko\'ring';
            }

            this.showError(errorMessage);
        }
    }

    async refreshUserData() {
        try {
            const token = this.getCookie('prime-token');

            const response = await axios.get('https://prime77.uz/api/v1/user/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 seconds timeout
            });

            const userData = response.data;

            // Update stored user data
            localStorage.setItem('prime-user', JSON.stringify(userData));
            this.currentUser = userData;
            this.loadUserData();

        } catch (error) {
            console.error('Error refreshing user data:', error);

            if (error.response && error.response.status === 401) {
                // Token expired, logout
                this.logout();
            }
        }
    }

    getFilteredOrders() {
        switch (this.currentFilter) {
            case 'PENDING':
                return this.ordersData.pendingOrders;
            case 'ACCEPTED':
                return this.ordersData.confirmedOrders;
            case 'SHIPPED':
                return this.ordersData.shippedOrders;
            case 'all':
            default:
                return [
                    ...this.ordersData.pendingOrders,
                    ...this.ordersData.confirmedOrders,
                    ...this.ordersData.shippedOrders
                ];
        }
    }

    renderOrders() {
        const container = document.getElementById('ordersContainer');

        // Get filtered orders
        const filteredOrders = this.getFilteredOrders();

        if (filteredOrders.length === 0) {
            this.showNoOrders('Buyurtmalar topilmadi');
            return;
        }

        container.innerHTML = '';

        // Sort orders by creation date (newest first)
        const sortedOrders = filteredOrders.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        sortedOrders.forEach(order => {
            const orderElement = this.createOrderElement(order);
            container.appendChild(orderElement);
        });
    }

    createOrderElement(order) {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';

        const statusClass = this.getStatusClass(order.status);
        const statusText = this.getStatusText(order.status);
        const orderDate = new Date(order.createdAt).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        orderDiv.innerHTML = `
            <div class="order-header">
                <div>
                    <h6 style="margin: 0; font-weight: 700;">Buyurtma #${order.id}</h6>
                    <small class="text-muted">${orderDate}</small>
                </div>
                <div>
                    <span class="order-status ${statusClass}">${statusText}</span>
                </div>
            </div>
            <div class="order-items">
                ${order.orderItems.map(item => this.createOrderItemElement(item)).join('')}
            </div>
            <div class="text-end mt-3">
                <strong style="color: var(--burgundy-color); font-size: 18px;">
                    Jami: ${this.formatPrice(order.totalSum)}
                </strong>
            </div>
        `;

        return orderDiv;
    }

    createOrderItemElement(item) {
        const imageUrl = item.imageKey ? `https://prime77.uz/api/v1/attachment/${item.imageKey}` : '/images/default/box.jpeg';
        const discountText = item.discount > 0 ? `(-${item.discount}%)` : '';
        const originalPrice = item.discount > 0 ? item.price : null;
        const discountedPrice = item.discount > 0 ? (item.price * (100 - item.discount) / 100) : item.price;

        return `
            <div class="order-product">
                <img src="${imageUrl}" alt="${item.name}" class="product-image" onerror="this.src='/images/default/box.jpeg'">
                <div class="product-info">
                    <div class="product-name">${item.name}</div>
                    <div class="product-details">
                        O'lcham: ${item.size} | Miqdor: ${item.count}
                        ${item.discount > 0 ? `<span style="color: #dc3545; font-weight: 600;"> ${discountText}</span>` : ''}
                    </div>
                    ${originalPrice ? `
                        <div class="product-details">
                            <span style="text-decoration: line-through; color: #999;">
                                ${this.formatPrice(originalPrice)} x ${item.count}
                            </span>
                        </div>
                    ` : ''}
                </div>
                <div class="product-price">
                    ${this.formatPrice(item.totalSum)}
                </div>
            </div>
        `;
    }

    getStatusClass(status) {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'ACCEPTED':
            case 'CONFIRMED': return 'status-accepted';
            case 'SHIPPED': return 'status-shipped';
            default: return 'status-pending';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'PENDING': return 'Kutilmoqda';
            case 'ACCEPTED':
            case 'CONFIRMED': return 'Rasmiylashtirildi';
            case 'SHIPPED': return 'Bajarildi';
            default: return status;
        }
    }

    formatPrice(price) {
        if (!price) return '0 So\'m';
        return new Intl.NumberFormat('uz-UZ').format(price) + ' So\'m';
    }

    showNoOrders(message) {
        const container = document.getElementById('ordersContainer');
        container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-shopping-bag" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                <h5 style="color: #666;">${message}</h5>
                <p style="color: #999;">Hozircha buyurtmalar yo'q</p>
                <a href="index.html" class="btn btn-primary mt-3" style="background: var(--burgundy-color); border-color: var(--burgundy-color);">
                    Xarid qilishni boshlash
                </a>
            </div>
        `;
    }

    showError(message) {
        const container = document.getElementById('ordersContainer');
        container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #dc3545; margin-bottom: 20px;"></i>
                <h5 style="color: #dc3545;">Xatolik</h5>
                <p style="color: #666;">${message}</p>
                <button class="btn btn-primary" onclick="window.profileManager.loadOrders()" style="background: var(--burgundy-color); border-color: var(--burgundy-color);">
                    Qayta yuklash
                </button>
            </div>
        `;
    }

    logout() {
        // Clear cookie and localStorage
        document.cookie = 'prime-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('prime-user');

        // Show logout message
        const container = document.getElementById('ordersContainer');
        container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-sign-out-alt" style="font-size: 48px; color: var(--burgundy-color); margin-bottom: 20px;"></i>
                <h5 style="color: var(--burgundy-color);">Tizimdan chiqildi</h5>
                <p style="color: #666;">Siz muvaffaqiyatli tizimdan chiqdingiz</p>
            </div>
        `;

        // Redirect to home after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}

// Initialize profile manager and make it globally available
let profileManager;
document.addEventListener('DOMContentLoaded', () => {
    profileManager = new ProfileManager();
    window.profileManager = profileManager; // Make it globally available for error retry
});