(function () {
    const nav = document.getElementById('mainNav');
    const menu = document.getElementById('stickyMenu');
    const topBar = document.querySelector('.top-bar');
    const topBarH = 40;                             // .top-bar cao 40px
    const navHeight = nav.offsetHeight || 110;        // dự phòng 110px
    const triggerY = nav.offsetTop + navHeight;      // qua đáy nav thì bật

    function onScroll() {
        if (window.scrollY > triggerY) {
            menu.classList.add('sticky');
            nav.classList.add('nav-hidden');
            topBar.classList.add('hidden');
            document.body.classList.add('has-sticky-menu');
        } else {
            menu.classList.remove('sticky');
            nav.classList.remove('nav-hidden');
            topBar.classList.remove('hidden');
            document.body.classList.remove('has-sticky-menu');
        }

    }

    // Trạng thái đúng ngay khi tải
    onScroll();
    window.addEventListener('scroll', onScroll);

})();
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".product-section");

    function showSection(id) {
        // Ẩn/hiện section
        sections.forEach(sec => {
            sec.style.display = (sec.id === id) ? "block" : "none";
        });
        // Đổi màu chữ (active)
        tabs.forEach(t => {
            t.classList.toggle("active-menu", t.dataset.target === id);
        });
    }

    // Click tab
    tabs.forEach(t => {
        t.addEventListener("click", (e) => {
            e.preventDefault();
            const id = t.dataset.target;
            if (id) showSection(id);
        });
    });

    // Mặc định chọn "Món ngon phải thử"
    function loadFromHash() {
        const hash = window.location.hash.slice(1); // Bỏ dấu #
        if (hash && document.getElementById(hash)) {
            showSection(hash);
        } else {
            showSection("monngon");
        }
    }

    // Load section khi trang vừa mở
    loadFromHash();

    // Load section khi hash thay đổi
    window.addEventListener('hashchange', loadFromHash);
});


