class LoginManager {
    constructor() {
        this.codeInputs = document.querySelectorAll(".code-input")
        this.loginForm = document.getElementById("loginForm")
        this.errorMessage = document.getElementById("errorMessage")
        this.successMessage = document.getElementById("successMessage")
        this.loadingSpinner = document.getElementById("loadingSpinner")
        this.statusText = document.getElementById("statusText")

        this.init()
    }

    init() {
        this.setupCodeInputs()
        if (this.codeInputs.length > 0) {
            this.codeInputs[0].focus()
        }
    }

    setupCodeInputs() {
        this.codeInputs.forEach((input, index) => {
            input.addEventListener("input", (e) => {
                const value = e.target.value

                // Only allow numbers
                if (!/^\d*$/.test(value)) {
                    e.target.value = ""
                    return
                }

                // Move to next input
                if (value && index < this.codeInputs.length - 1) {
                    this.codeInputs[index + 1].focus()
                }

                // Auto submit when all fields are filled
                if (this.getCode().length === 6) {
                    this.handleLogin()
                }

                this.hideMessages()
            })

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !e.target.value && index > 0) {
                    this.codeInputs[index - 1].focus()
                }
            })

            input.addEventListener("paste", (e) => {
                e.preventDefault()
                const pastedData = e.clipboardData.getData("text")
                const digits = pastedData.replace(/\D/g, "").slice(0, 6)

                digits.split("").forEach((digit, i) => {
                    if (this.codeInputs[i]) {
                        this.codeInputs[i].value = digit
                    }
                })

                if (digits.length === 6) {
                    this.handleLogin()
                }
            })
        })
    }

    getCode() {
        return Array.from(this.codeInputs)
            .map((input) => input.value)
            .join("")
    }

    clearCode() {
        this.codeInputs.forEach((input) => {
            input.value = ""
        })
        this.codeInputs[0].focus()
    }

    async handleLogin() {
        const code = this.getCode()

        if (code.length !== 6) {
            return
        }

        this.setLoading(true)
        this.statusText.textContent = "Kod tekshirilmoqda..."

        try {
            const response = await fetch(`http://localhost/api/v1/auth/code/${code}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Noto'g'ri kod kiritildi")
                } else if (response.status === 500) {
                    throw new Error("Server xatosi")
                } else {
                    throw new Error("Kirish jarayonida xatolik")
                }
            }

            const data = await response.json()

            if (!data.token || !data.userRes) {
                throw new Error("Noto'g'ri javob formati")
            }

            // Save token and user data
            this.setCookie("prime-token", data.token, 30)
            localStorage.setItem("prime-user", JSON.stringify(data.userRes))

            this.showSuccessMessage(`Xush kelibsiz, ${data.userRes.firstName}!`)
            this.statusText.textContent = "Muvaffaqiyatli kirildi!"

            // Redirect to main page (index.html)
            setTimeout(() => {
                window.location.href = "/index.html"
            }, 1500)
        } catch (error) {
            console.error("Login error:", error)
            this.showErrorMessage(error.message)
            this.statusText.textContent = ""
            this.clearCode()
        } finally {
            this.setLoading(false)
        }
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.loadingSpinner.style.display = "inline-block"
            this.codeInputs.forEach((input) => (input.disabled = true))
        } else {
            this.loadingSpinner.style.display = "none"
            this.codeInputs.forEach((input) => (input.disabled = false))
        }
    }

    showErrorMessage(message) {
        this.hideMessages()
        this.errorMessage.textContent = message
        this.errorMessage.style.display = "block"

        setTimeout(() => {
            this.hideMessages()
        }, 5000)
    }

    showSuccessMessage(message) {
        this.hideMessages()
        this.successMessage.textContent = message
        this.successMessage.style.display = "block"
    }

    hideMessages() {
        this.errorMessage.style.display = "none"
        this.successMessage.style.display = "none"
    }

    setCookie(name, value, days) {
        const expires = new Date()
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
    }
}

// Initialize login manager
document.addEventListener("DOMContentLoaded", () => {
    // Check if already logged in
    const token = document.cookie.split("; ").find((row) => row.startsWith("prime-token="))
    if (token) {
        window.location.href = "/index.html"
        return
    }

    new LoginManager()
})
