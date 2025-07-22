// Profile dropdown modal functionality
class AuthModal {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.modal = null;

        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupProfileButtons();
        this.createModal();
    }

    checkAuthStatus() {
        const token = this.getCookie('prime-token');
        const userData = localStorage.getItem('prime-user');

        if (token && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isLoggedIn = true;
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.isLoggedIn = false;
            }
        }
    }

    setupProfileButtons() {
        const profileBtn = document.getElementById('profileBtn');
        const mobileProfileBtn = document.getElementById('mobileProfileBtn');

        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleProfileClick();
            });
        }

        if (mobileProfileBtn) {
            mobileProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleProfileClick();
            });
        }
    }

    handleProfileClick() {
        if (this.isLoggedIn) {
            // Redirect to profile page
            window.location.href = 'profile.html';
        } else {
            // Show login modal
            this.showLoginModal();
        }
    }

    createModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('authModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML
        const modalHTML = `
            <div id="authModal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                backdrop-filter: blur(5px);
            ">
                <div style="
                    background: white;
                    border-radius: 15px;
                    padding: 0;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    overflow: hidden;
                    position: relative;
                ">
                    <div style="
                        background: linear-gradient(135deg, var(--burgundy-color), var(--burgundy-light));
                        color: white;
                        padding: 30px;
                        text-align: center;
                        position: relative;
                    ">
                        <button id="closeAuthModal" style="
                            position: absolute;
                            top: 15px;
                            right: 15px;
                            background: none;
                            border: none;
                            color: white;
                            font-size: 24px;
                            cursor: pointer;
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='none'">
                            ×
                        </button>
                        <div style="
                            width: 80px;
                            height: 80px;
                            background: rgba(255,255,255,0.1);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 20px;
                        ">
                            <i class="fas fa-user" style="font-size: 40px;"></i>
                        </div>
                        <h3 style="margin: 0; font-weight: 700;">KIRISH</h3>
                    </div>
                    <div style="padding: 30px; text-align: center;">
                        <p style="
                            color: #666;
                            margin-bottom: 25px;
                            line-height: 1.6;
                        ">Bu yerda birinchi martamisiz? Ro'yxatdan o'tish</p>
                        <a href="login.html" style="
                            display: inline-block;
                            background: var(--burgundy-color);
                            color: white;
                            padding: 12px 30px;
                            border-radius: 25px;
                            text-decoration: none;
                            font-weight: 600;
                            transition: all 0.3s ease;
                            border: 2px solid var(--burgundy-color);
                        " onmouseover="
                            this.style.background='transparent';
                            this.style.color='var(--burgundy-color)';
                        " onmouseout="
                            this.style.background='var(--burgundy-color)';
                            this.style.color='white';
                        ">Qo'llab-quvvatlash</a>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('authModal');

        // Setup modal event listeners
        this.setupModalEvents();
    }

    setupModalEvents() {
        const closeBtn = document.getElementById('closeAuthModal');

        // Close button
        closeBtn.addEventListener('click', () => {
            this.hideModal();
        });

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.hideModal();
            }
        });
    }

    showLoginModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Animate in
            setTimeout(() => {
                this.modal.style.opacity = '1';
            }, 10);
        }
    }

    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
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

// Initialize auth modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthModal();
});

// Make it globally available
window.AuthModal = AuthModal;