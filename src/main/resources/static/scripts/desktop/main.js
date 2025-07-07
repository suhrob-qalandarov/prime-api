// ======================================================
// DESKTOP MAIN APPLICATION
// ======================================================

window.DesktopApp = {
    /**
     * Initialize desktop-specific functionality
     */
    init() {
        if (!window.Utils.isMobile()) {
            this.initializeDesktopComponents()
            this.setupDesktopEventListeners()
        }
    },

    /**
     * Initialize desktop components
     */
    initializeDesktopComponents() {
        this.initializeDesktopHeader()
        this.initializeDesktopModals()
        this.initializeDesktopCart()
    },

    /**
     * Setup desktop event listeners
     */
    setupDesktopEventListeners() {
        // Desktop-specific event listeners
        this.setupDesktopScrollEffects()
        this.setupDesktopHoverEffects()
    },

    /**
     * Initialize desktop header
     */
    initializeDesktopHeader() {
        const mainHeader = document.getElementById("main-header")
        if (!mainHeader) return

        let lastScrollTop = 0

        window.addEventListener("scroll", () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop

            if (scrollTop > 100) {
                if (scrollTop > lastScrollTop) {
                    // Scrolling down
                    mainHeader.classList.add("scrolled-down")
                    mainHeader.classList.remove("scrolled-up")
                } else {
                    // Scrolling up
                    mainHeader.classList.remove("scrolled-down")
                    mainHeader.classList.add("scrolled-up")
                }
            } else {
                // At top
                mainHeader.classList.remove("scrolled-down", "scrolled-up")
            }

            lastScrollTop = scrollTop
        })
    },

    /**
     * Initialize desktop modals
     */
    initializeDesktopModals() {
        // Modal initialization logic
    },

    /**
     * Initialize desktop cart
     */
    initializeDesktopCart() {
        // Cart initialization logic
    },

    /**
     * Setup desktop scroll effects
     */
    setupDesktopScrollEffects() {
        // Scroll effects for desktop
    },

    /**
     * Setup desktop hover effects
     */
    setupDesktopHoverEffects() {
        // Hover effects for desktop
    },
}

// ======================================================
// MAIN APPLICATION CONTROLLER
// ======================================================

window.Prime77App = {
    isInitialized: false,
    loadingProgress: 0,
    totalResources: 0,
    loadedResources: 0,

    /**
     * Initialize the entire application
     */
    async init() {
        try {
            console.log("Initializing Prime77 Application...")

            // Show loading screen
            this.showLoadingScreen()

            // Initialize core systems
            await this.initializeCore()

            // Initialize router
            window.Router.init()

            // Initialize device-specific apps
            window.DesktopApp.init()
            window.MobileApp.init()

            // Hide loading screen
            this.hideLoadingScreen()

            this.isInitialized = true
            console.log("Prime77 Application initialized successfully!")
        } catch (error) {
            console.error("Failed to initialize application:", error)
            this.showErrorScreen()
        }
    },

    /**
     * Initialize core systems
     */
    async initializeCore() {
        // Initialize utilities
        if (window.Utils) {
            console.log("Utils initialized")
        }

        // Initialize API
        if (window.API) {
            console.log("API initialized")
        }

        // Initialize Auth
        if (window.Auth) {
            console.log("Auth initialized")
        }

        this.updateLoadingProgress(25)
    },

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById("loadingScreen")
        const app = document.getElementById("app")

        if (loadingScreen) {
            loadingScreen.style.display = "flex"
        }

        if (app) {
            app.style.display = "none"
        }
    },

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById("loadingScreen")
        const app = document.getElementById("app")

        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = "0"
                setTimeout(() => {
                    loadingScreen.style.display = "none"
                }, 500)
            }

            if (app) {
                app.style.display = "block"
            }
        }, 1000)
    },

    /**
     * Update loading progress
     */
    updateLoadingProgress(progress) {
        const progressBar = document.getElementById("progressBar")
        if (progressBar) {
            progressBar.style.width = `${progress}%`
        }
        this.loadingProgress = progress
    },

    /**
     * Show error screen
     */
    showErrorScreen() {
        const loadingScreen = document.getElementById("loadingScreen")
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="loading-content">
                    <div class="loading-logo">PRIME<span>77</span></div>
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b6b; margin: 20px 0;"></i>
                    <div class="loading-text">Xatolik yuz berdi</div>
                    <button class="btn-custom" onclick="window.location.reload()" style="margin-top: 20px;">
                        Qayta yuklash
                    </button>
                </div>
            `
        }
    },

    /**
     * Initialize page components
     */
    initializeComponents() {
        // Initialize common components that are used across pages
        this.initializeCart()
        this.initializeSearch()
        this.initializeNotifications()

        // Load categories if on home page
        if (window.location.pathname === "/") {
            this.loadCategories()
        }
    },

    /**
     * Initialize cart functionality
     */
    initializeCart() {
        // Cart initialization logic
        console.log("Cart initialized")
    },

    /**
     * Initialize search functionality
     */
    initializeSearch() {
        // Search initialization logic
        console.log("Search initialized")
    },

    /**
     * Initialize notifications
     */
    initializeNotifications() {
        // Notification system initialization
        console.log("Notifications initialized")
    },

    /**
     * Load categories for home page
     */
    async loadCategories() {
        const categoriesContainer = document.getElementById("categoriesContainer")
        const categoryLoading = document.getElementById("categoryLoading")
        const categoryError = document.getElementById("categoryError")

        if (!categoriesContainer) return

        try {
            // Show loading
            if (categoryLoading) categoryLoading.style.display = "block"
            if (categoryError) categoryError.style.display = "none"
            categoriesContainer.style.display = "none"

            console.log("Loading spotlight categories...")

            const spotlights = await window.API.fetchSpotlightCategories()

            // Hide loading
            if (categoryLoading) categoryLoading.style.display = "none"

            if (!spotlights || spotlights.length === 0) {
                throw new Error("No spotlight categories found")
            }

            // Clear existing content
            categoriesContainer.innerHTML = ""

            // Render spotlight categories
            spotlights.forEach((spotlight, index) => {
                const categoryCard = this.createSpotlightCard(spotlight, index)
                categoriesContainer.appendChild(categoryCard)
            })

            // Show categories
            categoriesContainer.style.display = "flex"

            console.log(`Successfully loaded ${spotlights.length} spotlight categories`)
        } catch (error) {
            console.error("Error loading spotlight categories:", error)

            // Hide loading
            if (categoryLoading) categoryLoading.style.display = "none"

            // Show error
            if (categoryError) categoryError.style.display = "block"

            // Load fallback categories
            this.loadFallbackCategories()
        }
    },

    /**
     * Create spotlight card element
     */
    createSpotlightCard(spotlight, index) {
        const colDiv = document.createElement("div")
        colDiv.className = "col-lg-3 col-md-6 col-6"

        const categoryCard = document.createElement("div")
        categoryCard.className = "category-card"
        categoryCard.setAttribute("data-spotlight-id", spotlight.id)
        categoryCard.style.cssText = `
            position: relative;
            overflow: hidden;
            margin-bottom: 30px;
            height: 250px;
            cursor: pointer;
            border-radius: 12px;
            transition: all 0.3s ease;
        `

        // Get image URL
        const imageUrl = spotlight.imageKey
            ? window.API.getImageUrl(spotlight.imageKey)
            : "/placeholder.svg?height=250&width=300"

        categoryCard.innerHTML = `
            <img src="${imageUrl}" alt="${spotlight.name}" 
                 style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;"
                 loading="lazy">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                        background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)); 
                        display: flex; align-items: center; justify-content: center; padding: 25px;">
                <h3 style="color: #f5f5dc; font-size: 1.4rem; font-weight: 600; margin: 0; text-align: center;">
                    ${spotlight.name.toUpperCase()}
                </h3>
            </div>
        `

        // Add hover effects
        categoryCard.addEventListener("mouseenter", () => {
            categoryCard.style.transform = "translateY(-5px)"
            categoryCard.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.15)"
            const img = categoryCard.querySelector("img")
            if (img) img.style.transform = "scale(1.1)"
        })

        categoryCard.addEventListener("mouseleave", () => {
            categoryCard.style.transform = "translateY(0)"
            categoryCard.style.boxShadow = "none"
            const img = categoryCard.querySelector("img")
            if (img) img.style.transform = "scale(1)"
        })

        // Add click event
        categoryCard.addEventListener("click", () => {
            this.handleSpotlightClick(spotlight)
        })

        // Handle image error
        const img = categoryCard.querySelector("img")
        img.onerror = function () {
            console.log("Spotlight image failed to load:", imageUrl)
            this.src = "/placeholder.svg?height=250&width=300"
        }

        colDiv.appendChild(categoryCard)
        return colDiv
    },

    /**
     * Handle spotlight click
     */
    handleSpotlightClick(spotlight) {
        console.log("Spotlight clicked:", spotlight)
        window.Utils.showNotification(`${spotlight.name} spotlight tanlandi`, "success")
        // Navigate to catalog with spotlight filter
        window.Router.navigate(`/catalog?spotlight=${spotlight.id}`)
    },

    /**
     * Load fallback categories
     */
    loadFallbackCategories() {
        const categoriesContainer = document.getElementById("categoriesContainer")
        if (!categoriesContainer) return

        const fallbackCategories = [
            { id: 1, name: "Ko'ylaklar", imageKey: null },
            { id: 2, name: "Shimlar", imageKey: null },
            { id: 3, name: "Poyabzallar", imageKey: null },
            { id: 4, name: "Aksessuarlar", imageKey: null },
        ]

        categoriesContainer.innerHTML = ""

        fallbackCategories.forEach((category, index) => {
            const categoryCard = this.createSpotlightCard(category, index)
            categoriesContainer.appendChild(categoryCard)
        })

        categoriesContainer.style.display = "flex"
        console.log("Fallback categories loaded")
    },
}
