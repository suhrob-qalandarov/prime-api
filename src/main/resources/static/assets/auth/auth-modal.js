// Profile dropdown modal functionality
class AuthModal {
    constructor() {
        this.isLoggedIn = false
        this.currentUser = null
        this.dropdown = null

        this.init()
    }

    init() {
        this.checkAuthStatus()
        this.setupProfileButtons()
        //this.createDropdown() /** rest of code here **/
    }

    checkAuthStatus() {
        const token = this.getCookie("prime-token")
        const userData = localStorage.getItem("prime-user")

        if (token && userData) {
            try {
                this.currentUser = JSON.parse(userData)
                this.isLoggedIn = true
            } catch (error) {
                console.error("Error parsing user data:", error)
                this.isLoggedIn = false
            }
        }
    }

    setupProfileButtons() {
        // Desktop profile button
        const profileBtn = document.getElementById("profileBtn")
        // Mobile profile button
        const mobileProfileBtn = document.getElementById("mobileProfileBtn")

        if (profileBtn) {
            profileBtn.addEventListener("click", (e) => {
                e.preventDefault()
                this.handleProfileClick()
            })
        }

        if (mobileProfileBtn) {
            mobileProfileBtn.addEventListener("click", (e) => {
                e.preventDefault()
                this.handleProfileClick()
            })
        }

        // Close dropdown when clicking outside
        //document.addEventListener("click", (e) => { /** rest of code here **/
        //  if (this.dropdown && !e.target.closest(".user-icon") && !e.target.closest(".login-popup")) {
        //    this.hideDropdown()
        //  }
        //})
    }

    handleProfileClick() {
        // Check current auth status
        this.checkAuthStatus()

        if (this.isLoggedIn) {
            // User is logged in - go to profile page
            window.location.href = "/assets/auth/profile.html"
        } else {
            // User is not logged in - go to login page
            window.location.href = "/assets/auth/login.html"
        }
    }

    //createDropdown() { /** rest of code here **/
    //  // Remove existing dropdown if any
    //  const existingDropdown = document.querySelector(".login-popup")
    //  if (existingDropdown) {
    //    existingDropdown.remove()
    //  }

    //  // Find the profile button container
    //  const profileBtn =
    //    document.querySelector('.header-icons a[href*="login"], .header-icons a[id*="profile"]') ||
    //    document.querySelector(".header-icons .header-icon")

    //  if (profileBtn) {
    //    // Make parent container relative
    //    const parentContainer = profileBtn.closest(".header-icons") || profileBtn.parentElement
    //    parentContainer.style.position = "relative"

    //    // Add user-icon class to profile button parent
    //    const userIconContainer = profileBtn.parentElement
    //    if (userIconContainer) {
    //      userIconContainer.classList.add("user-icon")
    //      userIconContainer.style.position = "relative"
    //    }

    //    // Create dropdown HTML matching your structure
    //    const dropdownHTML = `
    //      <div class="login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white text-black box-shadow-small" style="
    //        position: absolute;
    //        top: 74px;
    //        right: 0;
    //        width: 320px;
    //        padding: 28px;
    //        border-radius: 12px;
    //        background: white;
    //        color: black;
    //        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    //        z-index: 9999;
    //        display: none;
    //        border: 1px solid #eee;
    //      ">
    //        ${this.getDropdownContent()}
    //      </div>
    //    `

    //    userIconContainer.insertAdjacentHTML("beforeend", dropdownHTML)
    //    this.dropdown = userIconContainer.querySelector(".login-popup")
    //  }
    //}

    //getDropdownContent() { /** rest of code here **/
    //  if (this.isLoggedIn && this.currentUser) {
    //    return `
    //      <a class="button-main w-full text-center" href="/assets/auth/profile.html" style="
    //        display: block;
    //        width: 100%;
    //        text-align: center;
    //        background: var(--burgundy-color);
    //        color: white;
    //        padding: 12px 24px;
    //        border-radius: 8px;
    //        text-decoration: none;
    //        font-weight: 600;
    //        margin-bottom: 16px;
    //        transition: all 0.3s ease;
    //      " onmouseover="this.style.background='var(--burgundy-dark)'" onmouseout="this.style.background='var(--burgundy-color)'">
    //        Profil
    //      </a>
    //      <div class="bottom mt-4 pt-4 border-t border-line" style="
    //        margin-top: 16px;
    //        padding-top: 16px;
    //        border-top: 1px solid #eee;
    //      ">
    //        <a href="https://t.me/prime_77_uz_bot" target="_blank" class="body1 hover:underline" style="
    //          color: #333;
    //          text-decoration: none;
    //          font-size: 16px;
    //          transition: all 0.3s ease;
    //        " onmouseover="this.style.textDecoration='underline'; this.style.color='var(--burgundy-color)'" onmouseout="this.style.textDecoration='none'; this.style.color='#333'">
    //          Qo'llab-quvvatlash
    //        </a>
    //        <button class="logout-btn" style="
    //          display: block;
    //          background: none;
    //          border: none;
    //          color: #dc3545;
    //          font-size: 16px;
    //          margin-top: 12px;
    //          cursor: pointer;
    //          padding: 0;
    //          text-decoration: none;
    //          transition: all 0.3s ease;
    //        " onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
    //          Chiqish
    //        </button>
    //      </div>
    //    `
    //  } else {
    //    return `
    //      <a class="button-main w-full text-center" href="/assets/auth/login.html" style="
    //        display: block;
    //        width: 100%;
    //        text-align: center;
    //        background: var(--burgundy-color);
    //        color: white;
    //        padding: 12px 24px;
    //        border-radius: 8px;
    //        text-decoration: none;
    //        font-weight: 600;
    //        margin-bottom: 16px;
    //        transition: all 0.3s ease;
    //      " onmouseover="this.style.background='var(--burgundy-dark)'" onmouseout="this.style.background='var(--burgundy-color)'">
    //        Kirish
    //      </a>
    //      <div class="bottom mt-4 pt-4 border-t border-line" style="
    //        margin-top: 16px;
    //        padding-top: 16px;
    //        border-top: 1px solid #eee;
    //      ">
    //        <a href="https://t.me/prime_77_uz_bot" target="_blank" class="body1 hover:underline" style="
    //          color: #333;
    //          text-decoration: none;
    //          font-size: 16px;
    //          transition: all 0.3s ease;
    //        " onmouseover="this.style.textDecoration='underline'; this.style.color='var(--burgundy-color)'" onmouseout="this.style.textDecoration='none'; this.style.color='#333'">
    //          Qo'llab-quvvatlash
    //        </a>
    //      </div>
    //    `
    //  }
    //}

    //toggleDropdown(e, buttonElement) { /** rest of code here **/
    //  if (!this.dropdown) {
    //    this.createDropdown()
    //  }

    //  const isVisible = this.dropdown.style.display === "block"

    //  if (isVisible) {
    //    this.hideDropdown()
    //  } else {
    //    this.showDropdown(buttonElement)
    //  }
    //}

    //showDropdown(buttonElement) { /** rest of code here **/
    //  if (!this.dropdown) return

    //  // Update dropdown content based on current auth status
    //  this.checkAuthStatus()
    //  this.dropdown.innerHTML = this.getDropdownContent()
    //  this.setupDropdownEvents()

    //  this.dropdown.style.display = "block"

    //  // Position dropdown correctly
    //  const rect = buttonElement.getBoundingClientRect()
    //  const dropdownRect = this.dropdown.getBoundingClientRect()

    //  // Adjust position if dropdown goes off screen
    //  if (rect.right - 320 < 0) {
    //    this.dropdown.style.right = "auto"
    //    this.dropdown.style.left = "0"
    //  } else {
    //    this.dropdown.style.right = "0"
    //    this.dropdown.style.left = "auto"
    //  }

    //  // Animate in
    //  this.dropdown.style.opacity = "0"
    //  this.dropdown.style.transform = "translateY(-10px)"
    //  setTimeout(() => {
    //    this.dropdown.style.opacity = "1"
    //    this.dropdown.style.transform = "translateY(0)"
    //    this.dropdown.style.transition = "all 0.3s ease"
    //  }, 10)
    //}

    //hideDropdown() { /** rest of code here **/
    //  if (!this.dropdown) return
    //  this.dropdown.style.display = "none"
    //  this.dropdown.style.transition = "none"
    //}

    //setupDropdownEvents() { /** rest of code here **/
    //  if (!this.dropdown) return

    //  // Logout button event
    //  const logoutBtn = this.dropdown.querySelector(".logout-btn")
    //  if (logoutBtn) {
    //    logoutBtn.addEventListener("click", (e) => {
    //      e.preventDefault()
    //      this.logout()
    //    })
    //  }

    //  // Profile link click tracking
    //  const profileLink = this.dropdown.querySelector('a[href*="profile"]')
    //  if (profileLink) {
    //    profileLink.addEventListener("click", () => {
    //      this.hideDropdown()
    //    })
    //  }

    //  // Login link click tracking
    //  const loginLink = this.dropdown.querySelector('a[href*="login"]')
    //  if (loginLink) {
    //    loginLink.addEventListener("click", () => {
    //      this.hideDropdown()
    //    })
    //  }
    //}

    logout() {
        // Clear cookie and localStorage
        document.cookie = "prime-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        localStorage.removeItem("prime-user")

        // Update auth status
        this.isLoggedIn = false
        this.currentUser = null

        // Hide dropdown
        //this.hideDropdown() /** rest of code here **/

        // Show success message
        this.showNotification("Tizimdan muvaffaqiyatli chiqdingiz", "success")

        // Redirect to home after a short delay
        setTimeout(() => {
            window.location.href = "/index.html"
        }, 1500)
    }

    showNotification(message, type = "info") {
        const notification = document.createElement("div")
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 99999;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `
        notification.textContent = message
        document.body.appendChild(notification)

        // Animate in
        setTimeout(() => {
            notification.style.transform = "translateX(0)"
        }, 100)

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = "translateX(100%)"
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification)
                }
            }, 300)
        }, 3000)
    }

    getCookie(name) {
        const nameEQ = name + "="
        const ca = document.cookie.split(";")
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) === " ") c = c.substring(1, c.length)
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
        }
        return null
    }
}

// Initialize auth modal when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new AuthModal()
})

// Make it globally available
window.AuthModal = AuthModal
