(function () {
  function setupMobileMenu() {
    const isMobile = window.matchMedia('(max-width:1120px)').matches;
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    // nút "Thực đơn"
    const trigger = nav.querySelector('ul > li > a[href*="menu.html"]');
    if (!trigger) return;
    const li = trigger.parentElement;

    // mở/đóng dropdown khi NHẤN, không chuyển trang
    function onClick(e){
      if (!isMobile) return;
      e.preventDefault();
      li.classList.toggle('open');
    }
    trigger.removeEventListener('click', onClick);
    trigger.addEventListener('click', onClick);

    // click ra ngoài thì đóng
    document.addEventListener('click', (e)=>{
      if (!isMobile) return;
      if (!li.contains(e.target)) li.classList.remove('open');
    });
  }
  window.addEventListener('load', setupMobileMenu);
  window.addEventListener('resize', setupMobileMenu);
})();

