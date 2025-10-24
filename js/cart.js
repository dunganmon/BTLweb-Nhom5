// js/cart.js - mini + gắn tài khoản
(() => {
  const user = JSON.parse(localStorage.getItem("currentUser")||"null");
  const KEY  = `cart:${user?.email||"guest"}`;
  const get  = (k=KEY)=>JSON.parse(localStorage.getItem(k)||"[]");
  const set  = (v,k=KEY)=>localStorage.setItem(k, JSON.stringify(v));
  const money= n=> (n||0).toLocaleString("vi-VN")+" đ";
  const num  = s=>parseInt(String(s||"").replace(/[^\d]/g,""))||0;

  // Gộp giỏ guest -> tài khoản lần đầu đăng nhập
  if (user) {
    const guest = get("cart:guest");
    if (guest.length && !localStorage.getItem(KEY)) { set(guest); localStorage.removeItem("cart:guest"); }
  }

  // Nút + Panel
  const btn = document.createElement("button");
  btn.className = "cart-btn"; btn.textContent = "🛒 0"; document.body.appendChild(btn);
  const box = document.createElement("div");
  box.className = "cart-panel";
  box.innerHTML = `
    <div class="row head"><b>Giỏ hàng</b><span class="close">✕</span></div>
    <div class="list"></div>
    <div class="row"><span>Tổng:</span><b class="sum">0 đ</b></div>
    <button class="checkout">Thanh toán</button>
    <div class="pay" style="display:none;margin-top:8px">
      <input class="inp name" placeholder="Họ tên *">
      <input class="inp phone" placeholder="SĐT *">
      <textarea class="inp addr" rows="2" placeholder="Địa chỉ *"></textarea>
      <button class="place">Giao</button>
    </div>`;
  document.body.appendChild(box);

  // CSS gọn
  const css = document.createElement("style");
  css.textContent = `
  .cart-btn{position:fixed;right:16px;bottom:16px;background:#E31837;color:#fff;border:0;padding:10px 14px;border-radius:8px;font-weight:700;z-index:9999}
  .cart-panel{position:fixed;right:16px;bottom:64px;width:300px;max-height:60vh;overflow:auto;background:#fff;border:1px solid #ddd;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,.12);padding:10px;display:none;z-index:9999;font:14px system-ui}
  .row{display:flex;justify-content:space-between;align-items:center;margin:6px 0}
  .head .close{cursor:pointer}
  .item{display:flex;gap:6px;align-items:center;justify-content:space-between;border-top:1px solid #eee;padding:6px 0}
  .name{font-weight:600}.price{color:#E31837;font-weight:700}
  .qty{display:flex;align-items:center;gap:6px}
  .qty button{width:24px;height:24px;border:1px solid #ddd;background:#fff;border-radius:6px;cursor:pointer}
  .rmv{border:0;background:#fff;color:#999;cursor:pointer;margin-left:6px}
  .checkout,.place{width:100%;margin-top:6px;background:#E31837;color:#fff;border:0;border-radius:8px;padding:10px;font-weight:700;cursor:pointer}
  .inp{width:100%;border:1px solid #ced4da;border-radius:6px;padding:8px;margin-top:6px}
  `; document.head.appendChild(css);

  const $ = (sel,root=document)=>root.querySelector(sel);
  const list = $(".list", box), sumEl = $(".sum", box);
  const closeBtn = $(".close", box), checkout = $(".checkout", box);
  const pay = $(".pay", box), nameI = $(".name", box), phoneI = $(".phone", box), addrI = $(".addr", box);

  function syncBtn(){ const c=get(); btn.textContent = `🛒 ${c.reduce((a,i)=>a+i.qty,0)}`; }
  function total(c){ return c.reduce((a,i)=>a+i.qty*i.price,0); }

  function render(){
    const c = get();
    list.innerHTML = c.length ? c.map(i=>`
      <div class="item" data-id="${i.id}">
        <div style="flex:1">
          <div class="name">${i.name}</div>
          <div class="price">${money(i.price)}</div>
        </div>
        <div class="qty">
          <button class="dec">-</button><span>${i.qty}</span><button class="inc">+</button>
          <button class="rmv">xóa</button>
        </div>
      </div>`).join("") : `<div style="padding:10px;color:#666;text-align:center">Giỏ hàng trống</div>`;
    sumEl.textContent = money(total(c)); syncBtn();
  }

  // Thêm từ card
  function addFromCard(card){
    const name = card.querySelector(".title")?.textContent.trim()||"Món ăn";
    const price = num(card.querySelector(".price")?.textContent);
    const id = name.toLowerCase();
    const c = get(); const i = c.findIndex(x=>x.id===id);
    if(i>=0) c[i].qty++; else c.push({id,name,price,qty:1});
    set(c); render();
  }

  // Sự kiện
  btn.onclick = ()=> box.style.display = box.style.display==="block" ? "none" : "block";
  closeBtn.onclick = ()=> box.style.display = "none";

  // + / − / xóa
  list.addEventListener("click", e=>{
    const row = e.target.closest(".item"); if(!row) return;
    const id = row.dataset.id; const c = get(); const i = c.findIndex(x=>x.id===id); if(i<0) return;
    if(e.target.classList.contains("inc")) c[i].qty++;
    else if(e.target.classList.contains("dec")) c[i].qty=Math.max(1,c[i].qty-1);
    else if(e.target.classList.contains("rmv")) c.splice(i,1);
    set(c); render();
  });

  // Bắt bấm ĐẶT HÀNG trên menu
  document.addEventListener("click", e=>{
    const b = e.target.closest(".btn-order"); if(!b) return;
    const card = b.closest(".product-card"); if(card) addFromCard(card);
  });

  // Thanh toán (yêu cầu đăng nhập)
  checkout.onclick = ()=>{
    if(get().length===0) return alert("Giỏ hàng đang trống");
    if(!user){ alert("Vui lòng đăng nhập để thanh toán"); location.href="login.html"; return; }
    pay.style.display="block";
    nameI.value = user.name||""; phoneI.value = user.phone||"";
  };

  $(".place", box).onclick = ()=>{
    if(!nameI.value.trim()||!phoneI.value.trim()||!addrI.value.trim()) return alert("Nhập đủ họ tên, SĐT, địa chỉ");
    list.innerHTML = `<div style="padding:12px;text-align:center">Đang giao hàng đến: <b>${addrI.value.replace(/</g,"&lt;")}</b>...</div>`;
    sumEl.textContent = money(0);
    set([]); syncBtn();
    setTimeout(()=>{ alert("Đặt hàng thành công!"); box.style.display="none"; pay.style.display="none"; nameI.value=phoneI.value=addrI.value=""; render(); }, 1200);
  };

  render();
})();
