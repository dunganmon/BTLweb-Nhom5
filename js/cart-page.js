document.addEventListener("DOMContentLoaded", () => {
    
    function getCurrentUser() {
        const userJSON = localStorage.getItem("currentUser");
        return userJSON ? JSON.parse(userJSON) : null;
    }
    function getCartStorageKey(user) {
        return user && user.email ? `cart:${user.email}` : "cart:guest";
    }
    function readCartFromStorage(storageKey) {
        const cartJSON = localStorage.getItem(storageKey);
        return cartJSON ? JSON.parse(cartJSON) : [];
    }
    function writeCartToStorage(cartArray, storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(cartArray));
        window.dispatchEvent(new Event('storage'));
    }
    function formatVND(number) {
        return (number || 0).toLocaleString("vi-VN") + " đ";
    }
    function calculateTotal(cartArray) {
        return cartArray.reduce((sum, item) => sum + item.qty * item.price, 0);
    }
    
    const currentUser = getCurrentUser();
    const CART_KEY = getCartStorageKey(currentUser);
    const cartItemsContainer = document.getElementById("cart-items-body");
    const totalPriceElement = document.getElementById("cart-page-total");
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const checkoutActionButton = document.getElementById("checkout-action-btn"); 
    const nameInput = document.getElementById("ship-name");
    const phoneInput = document.getElementById("ship-phone");
    const addressInput = document.getElementById("ship-address");
    const modalOverlay = document.getElementById("qr-modal-overlay");
    const modalCloseButton = document.getElementById("modal-close-btn");
    const qrConfirmButton = document.getElementById("qr-confirm-paid-btn");

    function renderCartPage() {
        const cart = readCartFromStorage(CART_KEY);
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "";
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item-row" data-id="${item.id}">
                    <div class="cart-item-name">
                        <p>${item.name}</p>
                        <small>${formatVND(item.price)}</small>
                    </div>
                    <div class="cart-item-qty">
                        <button class="dec-btn" data-id="${item.id}">-</button>
                        <span>${item.qty}</span>
                        <button class="inc-btn" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-total">${formatVND(item.price * item.qty)}</div>
                    <div>
                        <button class="cart-item-remove" data-id="${item.id}">x</button>
                    </div>
                </div>
            `).join("");
        }
        
        totalPriceElement.textContent = formatVND(calculateTotal(cart));
    }

    function handleCartActions(event) {
        const target = event.target;
        const itemId = target.dataset.id;
        
        if (!itemId) return; 

        const cart = readCartFromStorage(CART_KEY);
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex === -1) return; 

        if (target.classList.contains("inc-btn")) {
            cart[itemIndex].qty++;
        } 
        else if (target.classList.contains("dec-btn")) {
            if (cart[itemIndex].qty > 1) {
                cart[itemIndex].qty--;
            }
        }
        else if (target.classList.contains("cart-item-remove")) {
            if (confirm(`Bạn có chắc muốn xóa "${cart[itemIndex].name}"?`)) {
                 cart.splice(itemIndex, 1);
            }
        }
        
        writeCartToStorage(cart, CART_KEY);
        renderCartPage();
    }

    function showQrModal() {
        if (modalOverlay) modalOverlay.style.display = 'flex';
    }
    function hideQrModal() {
        if (modalOverlay) modalOverlay.style.display = 'none';
    }

    function handlePaymentMethodChange() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        if (selectedMethod === 'qr') {
            checkoutActionButton.textContent = "TIẾP TỤC VỚI QR";
        } else {
            checkoutActionButton.textContent = "HOÀN TẤT ĐẶT HÀNG (COD)";
        }
    }

    function validateShippingInfo() {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();

        if (!name || !phone || !address) {
            alert("Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ giao hàng!");
            return false;
        }
        if (!currentUser) {
            alert("Bạn cần đăng nhập để đặt hàng!");
            window.location.href = "login.html";
            return false;
        }
        
        return true;
    }

    function handleCheckoutAction() {
        if (!validateShippingInfo()) {
            return; 
        }

        const cart = readCartFromStorage(CART_KEY);
        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (selectedMethod === 'cod') {
            alert(`Đặt hàng thành công!
            \nCảm ơn ${nameInput.value.trim()} đã tin tưởng Junlly.
            \nĐơn hàng sẽ được giao tới địa chỉ: ${addressInput.value.trim()}
            \nTổng tiền: ${formatVND(calculateTotal(cart))}`);

            writeCartToStorage([], CART_KEY);
            window.location.href = "../index.html";

        } else if (selectedMethod === 'qr') {
            showQrModal();
        }
    }

    function handleQrConfirmPaid() {
        const cart = readCartFromStorage(CART_KEY); 
        
        alert(`Đặt hàng (QR) thành công!
        \nCảm ơn ${nameInput.value.trim()} đã tin tưởng Junlly.
        \nĐơn hàng sẽ được giao tới địa chỉ: ${addressInput.value.trim()}
        \nTổng tiền: ${formatVND(calculateTotal(cart))}`);
        
        hideQrModal();

        writeCartToStorage([], CART_KEY);
        window.location.href = "../index.html";
    }

    cartItemsContainer.addEventListener("click", handleCartActions);
    paymentRadios.forEach(radio => radio.addEventListener("change", handlePaymentMethodChange));
    checkoutActionButton.addEventListener("click", handleCheckoutAction);
    qrConfirmButton.addEventListener("click", handleQrConfirmPaid);
    modalCloseButton.addEventListener("click", hideQrModal);
    modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
            hideQrModal();
        }
    });
    
    if (currentUser) {
        nameInput.value = `${currentUser.ho || ''} ${currentUser.name || ''}`.trim();
        phoneInput.value = currentUser.phone || '';
    }

    renderCartPage();
    handlePaymentMethodChange(); 
});