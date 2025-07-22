class LoginManager {
    constructor() {
        this.codeInputs = document.querySelectorAll('.code-input');
        this.loginForm = document.getElementById('loginForm');
        this.loginButton = document.getElementById('loginButton');
        this.loginButtonText = document.getElementById('loginButtonText');
        this.loginSpinner = document.getElementById('loginSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.successMessage = document.getElementById('successMessage');
        this.resendButton = document.getElementById('resendCode');

        this.init();
    }

    init() {
        this.setupCodeInputs();
        this.setupFormSubmission();
        this.setupResendButton();

        // Focus first input on load
        this.codeInputs[0].focus();
    }

    setupCodeInputs() {
        this.codeInputs.forEach((input, index) => {
            // Handle input
            input.addEventListener('input', (e) => {
                const value = e.target.value;

                // Only allow numbers
                if (!/^\d*$/.test(value)) {
                    e.target.value = '';
                    return;
                }

                // Move to next input if current is filled
                if (value && index < this.codeInputs.length - 1) {
                    this.codeInputs[index + 1].focus();
                }

                // Clear error message when user starts typing
                this.hideMessage();
            });

            // Handle backspace
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    this.codeInputs[index - 1].focus();
                }

                // Handle Enter key
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleLogin();
                }
            });

            // Handle paste
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text');
                const digits = pastedData.replace(/\D/g, '').slice(0, 6);

                digits.split('').forEach((digit, i) => {
                    if (this.codeInputs[i]) {
                        this.codeInputs[i].value = digit;
                    }
                });

                // Focus the next empty input or the last one
                const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
                this.codeInputs[nextEmptyIndex].focus();
            });
        });
    }

    setupFormSubmission() {
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    setupResendButton() {
        this.resendButton.addEventListener('click', () => {
            this.showSuccessMessage('Kod qayta yuborildi!');
            // Here you would typically make an API call to resend the code
        });
    }

    getCode() {
        return Array.from(this.codeInputs).map(input => input.value).join('');
    }

    clearCode() {
        this.codeInputs.forEach(input => {
            input.value = '';
        });
        this.codeInputs[0].focus();
    }

    async handleLogin() {
        const code = this.getCode();

        // Validate code length
        if (code.length !== 6) {
            this.showErrorMessage('Iltimos, 6 xonali kodni to\'liq kiriting');
            return;
        }

        // Validate code contains only numbers
        if (!/^\d{6}$/.test(code)) {
            this.showErrorMessage('Kod faqat raqamlardan iborat bo\'lishi kerak');
            return;
        }

        this.setLoading(true);

        try {
            const response = await fetch(`/api/v1/bot/auth/${code}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();

            // Validate response structure
            if (!userData || !userData.id) {
                throw new Error('Noto\'g\'ri javob formati');
            }

            // Store token in cookie (assuming the token comes in response or generate one)
            const token = userData.token || `prime-token-${userData.id}-${Date.now()}`;
            this.setCookie('prime-token', token, 30); // 30 days expiry

            // Store user data in localStorage for easy access
            localStorage.setItem('prime-user', JSON.stringify(userData));

            this.showSuccessMessage(`Xush kelibsiz, ${userData.firstName}!`);

            // Redirect after successful login
            setTimeout(() => {
                window.location.href = '/dashboard.html'; // or wherever you want to redirect
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);

            if (error.message.includes('404')) {
                this.showErrorMessage('Noto\'g\'ri kod kiritildi');
            } else if (error.message.includes('500')) {
                this.showErrorMessage('Server xatosi. Iltimos, qayta urinib ko\'ring');
            } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                this.showErrorMessage('Internet aloqasi bilan muammo. Iltimos, ulanishni tekshiring');
            } else {
                this.showErrorMessage('Kirish jarayonida xatolik yuz berdi. Qayta urinib ko\'ring');
            }

            this.clearCode();
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        this.loginButton.disabled = isLoading;

        if (isLoading) {
            this.loginButtonText.classList.add('hidden');
            this.loginSpinner.classList.remove('hidden');
            this.codeInputs.forEach(input => input.disabled = true);
        } else {
            this.loginButtonText.classList.remove('hidden');
            this.loginSpinner.classList.add('hidden');
            this.codeInputs.forEach(input => input.disabled = false);
        }
    }

    showErrorMessage(message) {
        this.hideMessage();
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideMessage();
        }, 5000);
    }

    showSuccessMessage(message) {
        this.hideMessage();
        this.successMessage.textContent = message;
        this.successMessage.classList.remove('hidden');

        // Auto hide after 3 seconds
        setTimeout(() => {
            this.hideMessage();
        }, 3000);
    }

    hideMessage() {
        this.errorMessage.classList.add('hidden');
        this.successMessage.classList.add('hidden');
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
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

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('prime-token='));
    if (token) {
        // User is already logged in, redirect to dashboard
        window.location.href = '/dashboard.html';
    }
});