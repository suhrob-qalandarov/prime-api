// ======================================================
// CART ADD LOGIC - CENTRALIZED CART MANAGEMENT
// ======================================================

// Global cart state
window.cartItems = [];
window.cartCount = 0;

// Global variables for cart page totals (updated by cart-page.js)
window.cartPageSubtotal = 0;
window.cartPageDiscount = 0;
window.cartPageTotal = 0;

/**
 * Loads cart items and count from localStorage.
 */
function loadCartFromStorage() {
    const savedCartItems = localStorage.getItem("cartItems");
    const savedCartCount = localStorage.getItem("cartCount");

    if (savedCartItems) {
        try {
            window.cartItems = JSON.parse(savedCartItems);
            window.cartCount = Number.parseInt(savedCartCount) || 0;
            console.log("Cart loaded from storage:", window.cartItems, "Count:", window.cartCount);
        } catch (error) {
            console.error("Error parsing cart from storage:", error);
            window.cartItems = [];
            window.cartCount = 0;
        }
    } else {
        window.cartItems = [];
        window.cartCount = 0;
    }
    updateCartBadge();
}

/**
 * Saves current cart items and count to localStorage.
 */
function saveCartToStorage() {
    localStorage.setItem("cartItems", JSON.stringify(window.cartItems));
    localStorage.setItem("cartCount", window.cartCount.toString());
    console.log("Cart saved to storage:", window.cartItems, "Count:", window.cartCount);
}

/**
 * Updates the cart badges in the header and mobile bottom navigation.
 */
function updateCartBadge() {
    const cartBadge = document.getElementById("cartBadge");
    const mobileCartBadge = document.getElementById("mobileCartBadge");
    const bottomNavCartBadge = document.getElementById("bottomNavCartBadge");

    if (cartBadge) {
        cartBadge.textContent = window.cartCount;
        cartBadge.style.display = window.cartCount > 0 ? "flex" : "none";
    }

    if (mobileCartBadge) {
        mobileCartBadge.textContent = window.cartCount;
        mobileCartBadge.style.display = window.cartCount > 0 ? "flex" : "none";
    }

    if (bottomNavCartBadge) {
        bottomNavCartBadge.textContent = window.cartCount;
        if (window.cartCount > 0) {
            bottomNavCartBadge.classList.add("show");
        } else {
            bottomNavCartBadge.classList.remove("show");
        }
    }
}

/**
 * Renders cart items in the cart modal.
 */
function renderCartModalItems() {
    const cartEmpty = document.getElementById("cartEmpty");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartFooter = document.getElementById("cartFooter");
    const cartTotalPrice = document.getElementById("cartTotalPrice");
    const cartCheckoutBtn = document.getElementById("cartCheckoutBtn");

    let currentCartTotal = 0;

    if (window.cartItems.length === 0) {
        if (cartEmpty) cartEmpty.style.display = "block";
        if (cartItemsContainer) cartItemsContainer.style.display = "none";
        if (cartFooter) cartFooter.style.display = "block"; // Always show footer, but disable buttons
        if (cartCheckoutBtn) cartCheckoutBtn.disabled = true;
    } else {
        if (cartEmpty) cartEmpty.style.display = "none";
        if (cartItemsContainer) cartItemsContainer.style.display = "block";
        if (cartFooter) cartFooter.style.display = "block";
        if (cartCheckoutBtn) cartCheckoutBtn.disabled = false;

        if (cartItemsContainer) cartItemsContainer.innerHTML = "";

        window.cartItems.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            // Corrected template literal for innerHTML
            cartItem.innerHTML = `
                <img src="${item.image || '/placeholder.svg?height=50&width=50&text=No+Image'}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    ${item.size ? `<div class="cart-item-size">O'lcham: ${item.size}</div>` : ''}
                    <div class="cart-item-price">${window.API.formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <button class="cart-quantity-btn" onclick="window.updateCartItemQuantity(${index}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                        <span class="cart-quantity">${item.quantity}</span>
                        <button class="cart-quantity-btn" onclick="window.updateCartItemQuantity(${index}, 1)">+</button>
                        <button class="cart-remove-btn" onclick="window.removeCartItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            if (cartItemsContainer) cartItemsContainer.appendChild(cartItem);
            currentCartTotal += item.price * item.quantity;
        });
    }

    if (cartTotalPrice) {
        cartTotalPrice.textContent = window.API.formatPrice(currentCartTotal);
    }
}

/**
 * Adds a product to the cart or updates its quantity if it already exists.
 * @param {Object} productData - The product object to add.
 * @param {number} quantity - The quantity to add.
 * @param {string|null} size - The selected size of the product.
 */
function addToCart(productData, quantity = 1, size = null) {
    const existingItemIndex = window.cartItems.findIndex((item) => item.id === productData.id && item.size === size);

    if (existingItemIndex !== -1) {
        window.cartItems[existingItemIndex].quantity += quantity;
    } else {
        window.cartItems.push({
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image, // Assuming productData has an image URL
            quantity: quantity,
            size: size,
            addedAt: new Date().toISOString(),
        });
    }

    window.cartCount += quantity;
    updateCartBadge();
    renderCartModalItems();
    saveCartToStorage();

    window.API.showNotification("Mahsulot savatga qo'shildi!", "success");
}

/**
 * Updates the quantity of a specific item in the cart.
 * @param {number} index - The index of the item in the cartItems array.
 * @param {number} change - The amount to change the quantity by (+1 or -1).
 */
function updateCartItemQuantity(index, change) {
    if (index < 0 || index >= window.cartItems.length) return;

    const item = window.cartItems[index];
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        removeCartItem(index);
    } else {
        window.cartCount += change;
        item.quantity = newQuantity;
        updateCartBadge();
        renderCartModalItems();
        saveCartToStorage();
    }

    // If on cart page, re-render cart page items as well
    if (typeof window.CartPageAPI !== "undefined" && typeof window.CartPageAPI.renderCartPage === "function") {
        window.CartPageAPI.renderCartPage();
    }
}

/**
 * Removes an item from the cart.
 * @param {number} index - The index of the item to remove from the cartItems array.
 */
function removeCartItem(index) {
    if (index < 0 || index >= window.cartItems.length) return;

    const item = window.cartItems[index];
    window.cartCount -= item.quantity;
    window.cartItems.splice(index, 1);

    updateCartBadge();
    renderCartModalItems();
    saveCartToStorage();

    window.API.showNotification("Mahsulot savatdan o'chirildi!", "info");

    // If on cart page, re-render cart page items as well
    if (typeof window.CartPageAPI !== "undefined" && typeof window.CartPageAPI.renderCartPage === "function") {
        window.CartPageAPI.renderCartPage();
    }
}

/**
 * Placeholder function to check if an item is out of stock.
 * In a real application, this would involve checking product stock levels.
 * @param {Object} item - The cart item.
 * @returns {boolean} True if out of stock, false otherwise.
 */
function checkItemStock(item) {
    // For demonstration, assume items are always in stock unless explicitly marked.
    // In a real app, you'd fetch actual stock from your backend.
    return item.stock === 0; // Example: if product data includes a 'stock' property
}

/**
 * Placeholder function to get size information with stock count.
 * @param {Object} item - The cart item.
 * @returns {Object} An object containing HTML for size info and stock count.
 */
function getItemSizeInfo(item) {
    let html = '';
    if (item.size) {
        html += `<div class="cart-product-size">O'lcham: ${item.size}`;
        // Example: if item has sizes array with stock
        if (item.sizes && Array.isArray(item.sizes)) {
            const selectedSize = item.sizes.find(s => s.name === item.size);
            if (selectedSize && selectedSize.stock !== undefined) {
                html += ` (Omborda: <span class="stock-count">${selectedSize.stock}</span>)`;
            }
        }
        html += `</div>`;
    }
    return { html };
}


// Expose functions globally
window.loadCartFromStorage = loadCartFromStorage;
window.saveCartToStorage = saveCartToStorage;
window.addToCart = addToCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeCartItem = removeCartItem;
window.updateCartBadge = updateCartBadge;
window.renderCartModalItems = renderCartModalItems;
window.checkItemStock = checkItemStock;
window.getItemSizeInfo = getItemSizeInfo;

// For cart-page.js to use these functions
window.updateCartPageItemQuantity = updateCartItemQuantity;
window.removeCartPageItem = removeCartItem;
