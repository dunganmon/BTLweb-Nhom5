document.addEventListener("DOMContentLoaded", () => {

    function getCurrentUser() {
        const userJSON = localStorage.getItem("currentUser");
        return userJSON ? JSON.parse(userJSON) : null;
    }

    function getCartStorageKey(user) {
        if (user && user.email) {
            return `cart:${user.email}`;
        }
        return "cart:guest";
    }

    function readCartFromStorage(storageKey) {
        const cartJSON = localStorage.getItem(storageKey);
        return cartJSON ? JSON.parse(cartJSON) : [];
    }
    function writeCartToStorage(cartArray, storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(cartArray));
    }

    function calculateTotalQuantity(cartArray) {
        let total = 0;
        for (const item of cartArray) {
            total += item.qty;
        }
        return total;
    }

    const currentUser = getCurrentUser();
    const CART_KEY = getCartStorageKey(currentUser);

    if (currentUser) {
        const guestCart = readCartFromStorage('cart:guest');
        const userCartExists = localStorage.getItem(CART_KEY) !== null;
        if (guestCart.length > 0 && !userCartExists) {
            writeCartToStorage(guestCart, CART_KEY);
            localStorage.removeItem('cart:guest'); 
        }
    }
    
  
    const floatingCartButton = document.createElement("button");
    floatingCartButton.className = "cart-btn"; 
    
  
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
        .cart-btn {
          position: fixed;
          right: 16px;
          bottom: 16px;
          background: #FFD200;
          color: #000;
          border: none;
          padding: 17px 10px;
          border-radius: 50%;
          font-weight: 700;
          font-size: 20px; 
          cursor: pointer;
          z-index: 9999;
          transition: transform 0.2s;
        }
        .cart-btn:hover {
            transform: scale(1.05);
        }
    `;

    document.body.appendChild(floatingCartButton);
    document.head.appendChild(styleElement);
    
    function updateCartButtonCount() {
        const cart = readCartFromStorage(CART_KEY);
        const totalQuantity = calculateTotalQuantity(cart);
        floatingCartButton.textContent = `🛒 ${totalQuantity}`;
    }

    document.body.addEventListener("click", (event) => {
        const orderButton = event.target.closest(".btn-order");

        if (!orderButton) {
            return;
        }
        const productCard = orderButton.closest(".product-card");
        if (productCard) {
            const name = productCard.querySelector(".title").textContent.trim();
            const priceText = productCard.querySelector(".price").textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, "")); 
            const id = name.toLowerCase().replace(/\s+/g, '-'); 

            const cart = readCartFromStorage(CART_KEY);
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.qty++;
            } else {
                cart.push({ id, name, price, qty: 1 });
            }
            writeCartToStorage(cart, CART_KEY);
            
            updateCartButtonCount();
            
            orderButton.textContent = "ĐÃ THÊM!";
            orderButton.style.background = "#28a745"; 
            setTimeout(() => {
                orderButton.textContent = "ĐẶT HÀNG";
                orderButton.style.background = ""; 
            }, 1000); 
        }
    });


    floatingCartButton.addEventListener("click", () => {
        const isInPagesFolder = window.location.pathname.includes("/pages/");
        
        if (window.location.pathname.endsWith("cart.html")) {
            return;
        }

        if (isInPagesFolder) {
            window.location.href = "cart.html";
        } else {
            window.location.href = "pages/cart.html";
        }
    });


    window.addEventListener("storage", () => {
        updateCartButtonCount();
    });

    updateCartButtonCount();
});