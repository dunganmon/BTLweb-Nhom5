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

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "../css/cart.css";  
  document.head.appendChild(link);


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


  function addFromCard(card){
    const name = card.querySelector(".title")?.textContent.trim()||"Món ăn";
    const price = num(card.querySelector(".price")?.textContent);
    const id = name.toLowerCase();
    const c = get(); const i = c.findIndex(x=>x.id===id);
    if(i>=0) c[i].qty++; else c.push({id,name,price,qty:1});
    set(c); render();
  }


  btn.onclick = ()=> box.style.display = box.style.display==="block" ? "none" : "block";
  closeBtn.onclick = ()=> box.style.display = "none";

  list.addEventListener("click", e=>{
    const row = e.target.closest(".item"); if(!row) return;
    const id = row.dataset.id; const c = get(); const i = c.findIndex(x=>x.id===id); if(i<0) return;
    if(e.target.classList.contains("inc")) c[i].qty++;
    else if(e.target.classList.contains("dec")) c[i].qty=Math.max(1,c[i].qty-1);
    else if(e.target.classList.contains("rmv")) c.splice(i,1);
    set(c); render();
  });


  document.addEventListener("click", e=>{
    const b = e.target.closest(".btn-order"); if(!b) return;
    const card = b.closest(".product-card"); if(card) addFromCard(card);
  });

 
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
