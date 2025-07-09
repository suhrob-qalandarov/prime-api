// ======================================================
// SPA ROUTER SYSTEM
// ======================================================

window.Router = {
    routes: {},
    currentRoute: null,

    /**
     * Initialize router
     */
    init() {
        // Define routes
        this.routes = {
            "/": () => this.loadPage("home"),
            "/catalog": () => this.loadPage("catalog"),
            "/about": () => this.loadPage("about"),
            "/contact": () => this.loadPage("contact"),
            "/collection": () => this.loadPage("collection"),
        }

        // Handle browser navigation
        window.addEventListener("popstate", () => {
            this.handleRoute()
        })

        // Handle initial route
        this.handleRoute()

        // Setup navigation links
        this.setupNavigation()
    },

    /**
     * Setup navigation event listeners
     */
    setupNavigation() {
        document.addEventListener("click", (e) => {
            const link = e.target.closest("a[href]")
            if (link && this.isInternalLink(link.href)) {
                e.preventDefault()
                const path = new URL(link.href).pathname
                this.navigate(path)
            }
        })
    },

    /**
     * Check if link is internal
     */
    isInternalLink(href) {
        try {
            const url = new URL(href)
            return url.origin === window.location.origin
        } catch {
            return true // Relative URLs
        }
    },

    /**
     * Navigate to route
     */
    navigate(path) {
        if (path !== window.location.pathname) {
            window.history.pushState({}, "", path)
        }
        this.handleRoute()
    },

    /**
     * Handle current route
     */
    handleRoute() {
        const path = window.location.pathname
        const route = this.routes[path] || this.routes["/"]

        if (route) {
            route()
        }
    },

    /**
     * Load page content
     */
    async loadPage(pageName) {
        try {
            // Show loading if needed
            this.showPageTransition()

            // Load page content
            const content = await this.fetchPageContent(pageName)

            // Render page
            this.renderPage(content)
        } catch (error) {
            console.error(`Error loading page ${pageName}:`, error)
            this.showErrorPage()
        }
    },

    /**
     * Fetch page content
     */
    async fetchPageContent(pageName) {
        const pageTemplates = {
            home: this.getHomeTemplate(),
            catalog: this.getCatalogTemplate(),
            about: this.getAboutTemplate(),
            contact: this.getContactTemplate(),
            collection: this.getCollectionTemplate(),
        }

        return pageTemplates[pageName] || pageTemplates.home
    },

    /**
     * Render page content
     */
    renderPage(content) {
        const app = document.getElementById("app")
        app.innerHTML = content

        // Initialize page-specific functionality
        this.initializePageComponents()

        // Show page with transition
        this.hidePageTransition()

        // Update current route
        this.currentRoute = window.location.pathname

        // Update page title
        this.updatePageTitle()
    },

    /**
     * Show page transition
     */
    showPageTransition() {
        const app = document.getElementById("app")
        app.classList.remove("active")
        app.classList.add("page-transition")
    },

    /**
     * Hide page transition
     */
    hidePageTransition() {
        const app = document.getElementById("app")
        setTimeout(() => {
            app.classList.add("active")
        }, 50)
    },

    /**
     * Initialize page components
     */
    initializePageComponents() {
        // Initialize common components
        if (window.Prime77App && window.Prime77App.initializeComponents) {
            window.Prime77App.initializeComponents()
        }
    },

    /**
     * Update page title
     */
    updatePageTitle() {
        const titles = {
            "/": "Prime77 - Erkaklar Kiyimi",
            "/catalog": "Katalog - Prime77",
            "/about": "Biz haqimizda - Prime77",
            "/contact": "Biz bilan bog'lanish - Prime77",
            "/collection": "Kolleksiya - Prime77",
        }

        document.title = titles[window.location.pathname] || titles["/"]
    },

    /**
     * Show error page
     */
    showErrorPage() {
        const app = document.getElementById("app")
        app.innerHTML = `
            <div class="error-page">
                <div class="container-custom">
                    <div class="text-center py-5">
                        <i class="fas fa-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
                        <h2 class="mt-4">Sahifa yuklanmadi</h2>
                        <p class="text-muted">Sahifani yuklashda xatolik yuz berdi.</p>
                        <button class="btn-custom" onclick="window.location.reload()">
                            Qayta yuklash
                        </button>
                    </div>
                </div>
            </div>
        `
    },

    // Page Templates
    getHomeTemplate() {
        return `
            <!-- Top Header (Desktop Only) -->
            <div class="top-header">
                <div class="container-custom">
                    <div class="row align-items-center">
                        <div class="col-md-6"></div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-center justify-content-end">
                                <div class="social-icons me-4">
                                    <a href="#"><i class="fab fa-telegram-plane"></i></a>
                                    <a href="#"><i class="fab fa-instagram"></i></a>
                                </div>
                                <div>
                                    <i class="fas fa-phone-alt me-2"></i>
                                    <a href="tel:+998901234567">+998 90 123 45 67</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Header (Desktop Only) -->
            <header class="main-header" id="main-header">
                <div class="container-custom">
                    <div class="row align-items-center">
                        <div class="col-lg-3">
                            <h1 id="main-logo" style="font-weight: 700; font-size: 24px; margin: 0; color: var(--burgundy-dark);">
                                <a href="/" style="text-decoration: none; color: inherit;">PRIME<span style="color: #ff6b6b">77</span></a>
                            </h1>
                        </div>
                        <div class="col-lg-6">
                            <nav class="navbar navbar-expand-lg">
                                <div class="collapse navbar-collapse justify-content-start">
                                    <ul class="navbar-nav">
                                        <li class="nav-item">
                                            <a class="nav-link" href="/catalog">KATALOG</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="/collection">KOLLEKSIYA</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="/about">BIZ HAQIMIZDA</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="/contact">KONTAKTLAR</a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                        <div class="col-lg-3">
                            <div class="d-flex justify-content-end align-items-center">
                                <div class="header-icons">
                                    <a href="#" class="header-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                                        </svg>
                                    </a>
                                    <span class="header-separator">|</span>
                                    <a href="/admin/pages/dashboard.html" class="header-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                                        </svg>
                                    </a>
                                    <div class="position-relative">
                                        <a href="#" class="header-icon" id="cartIcon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                                <path d="M239.89,198.12l-14.26-120a16,16,0,0,0-16-14.12H176a48,48,0,0,0-96,0H46.33a16,16,0,0,0-16,14.12l-14.26,120A16,16,0,0,0,20,210.6a16.13,16.13,0,0,0,12,5.4H223.92A16.13,16.13,0,0,0,236,210.6,16,16,0,0,0,239.89,198.12ZM128,32a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32ZM32,200,46.33,80H80v24a8,8,0,0,0,16,0V80h64v24a8,8,0,0,0,16,0V80h33.75l14.17,120Z"></path>
                                            </svg>
                                            <span class="badge" id="cartBadge">0</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Hero Section -->
            <section class="hero-section" style="position: relative; height: 650px; background: #f0f0f0; display: flex; align-items: center;">
                <div class="container-custom">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <div class="hero-content">
                                <h1 style="font-size: 2.6rem; font-weight: 700; color: var(--burgundy-color); margin-bottom: 25px;">
                                    YANGI KOLLEKSIYASI
                                </h1>
                                <p style="font-size: 18px; color: var(--burgundy-color); margin-bottom: 35px;">
                                    Zamonaviy va sifatli erkaklar kiyimi kolleksiyasi. Har bir mahsulot diqqat bilan tanlab olingan va yuqori sifat standartlariga javob beradi.
                                </p>
                                <a href="/collection" class="btn-custom">Kolleksiyani ko'rish</a>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="hero-image text-center">
                                <img src="/placeholder.svg?height=500&width=500" alt="Hero Image" style="max-width: 100%; height: auto;">
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Categories Section -->
            <section class="category-section" style="padding: 80px 0; background: #f5f5dc;">
                <div class="container-custom">
                    <div class="text-center mb-5">
                        <h2 style="font-size: 2.2rem; font-weight: 700; color: var(--burgundy-color);">KATEGORIYALAR</h2>
                    </div>
                    
                    <!-- Loading State -->
                    <div class="category-loading" id="categoryLoading" style="display: none;">
                        <div class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Yuklanmoqda...</span>
                            </div>
                            <p class="mt-3">Kategoriyalar yuklanmoqda...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div class="category-error" id="categoryError" style="display: none;">
                        <div class="text-center py-5">
                            <i class="fas fa-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
                            <h4 class="mt-3">Backend bilan bog'lanishda xatolik</h4>
                            <p class="text-muted">Backend serverga ulanib bo'lmadi. Server ishlab turganini tekshiring.</p>
                            <button class="btn-custom" onclick="window.Prime77App.loadCategories()">Qayta urinish</button>
                        </div>
                    </div>

                    <!-- Categories Container -->
                    <div class="row g-4" id="categoriesContainer">
                        <!-- Categories will be loaded here dynamically -->
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer style="background: linear-gradient(135deg, var(--burgundy-color), var(--burgundy-light)); color: #f5f5dc; padding: 60px 0 20px;">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-3 col-md-6 col-6 mb-4">
                            <h1 style="font-weight: 700; font-size: 24px; margin-bottom: 25px; color: #F5F5DC;">
                                PRIME<span style="color: #ff6b6b">77</span>
                            </h1>
                        </div>
                        <div class="col-lg-2 col-md-6 col-6 mb-4">
                            <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: #f5f5dc;">KOMPANIYA</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin-bottom: 5px;"><a href="/contact" style="color: #f5f5dc; text-decoration: none; font-size: 14px; opacity: 0.8;">Biz bilan bog'lanish</a></li>
                                <li style="margin-bottom: 5px;"><a href="/about" style="color: #f5f5dc; text-decoration: none; font-size: 14px; opacity: 0.8;">Biz haqimizda</a></li>
                            </ul>
                        </div>
                        <div class="col-lg-2 col-md-6 col-6 mb-4">
                            <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: #f5f5dc;">QO'LLAB-QUVVATLASH</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin-bottom: 5px;"><a href="#" style="color: #f5f5dc; text-decoration: none; font-size: 14px; opacity: 0.8;">Yetkazib berish</a></li>
                                <li style="margin-bottom: 5px;"><a href="#" style="color: #f5f5dc; text-decoration: none; font-size: 14px; opacity: 0.8;">FAQ</a></li>
                            </ul>
                        </div>
                        <div class="col-lg-2 col-md-6 col-6 mb-4">
                            <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: #f5f5dc;">IJTIMOIY TARMOQLAR</h3>
                            <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
                                <a href="#" style="display: flex; align-items: center; gap: 10px; color: #f5f5dc; text-decoration: none; font-size: 14px;">
                                    <i class="fab fa-telegram-plane"></i>
                                    <span>Telegram</span>
                                </a>
                                <a href="#" style="display: flex; align-items: center; gap: 10px; color: #f5f5dc; text-decoration: none; font-size: 14px;">
                                    <i class="fab fa-instagram"></i>
                                    <span>Instagram</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div style="border-top: 1px solid rgba(245, 245, 220, 0.2); padding-top: 20px; margin-top: 40px;">
                        <div class="row">
                            <div class="col-md-6">
                                <p style="margin: 0; color: #f5f5dc; font-size: 14px; opacity: 0.8;">&copy; 2024 Prime77. All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `
    },

    getCatalogTemplate() {
        return `
            <div class="catalog-page">
                <div class="container-custom">
                    <h1>Katalog sahifasi</h1>
                    <p>Bu yerda mahsulotlar ro'yxati bo'ladi.</p>
                </div>
            </div>
        `
    },

    getAboutTemplate() {
        return `
            <div class="about-page">
                <div class="container-custom">
                    <h1>Biz haqimizda</h1>
                    <p>Prime77 haqida ma'lumot.</p>
                </div>
            </div>
        `
    },

    getContactTemplate() {
        return `
            <div class="contact-page">
                <div class="container-custom">
                    <h1>Biz bilan bog'lanish</h1>
                    <p>Kontakt ma'lumotlari.</p>
                </div>
            </div>
        `
    },

    getCollectionTemplate() {
        return `
            <div class="collection-page">
                <div class="container-custom">
                    <h1>Kolleksiya</h1>
                    <p>Mahsulotlar kolleksiyasi.</p>
                </div>
            </div>
        `
    },
}
