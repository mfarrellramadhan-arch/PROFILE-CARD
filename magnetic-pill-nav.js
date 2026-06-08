class MagneticPillNav {
  /**
   * @param {string} containerSelector  — CSS selector untuk <ul class="navbar__menu">
   * @param {string} pillSelector       — CSS selector untuk .navbar__pill (di dalam container)
   * @param {string} linkSelector       — CSS selector untuk setiap nav link
   */
  constructor(containerSelector, pillSelector, linkSelector) {
    // FIX: pakai querySelector, bukan getElementById
    this.linksContainer = document.querySelector(containerSelector);

    if (!this.linksContainer) {
      console.warn(`MagneticPillNav: container "${containerSelector}" tidak ditemukan.`);
      return;
    }

    this.pill  = this.linksContainer.querySelector(pillSelector);
    this.links = this.linksContainer.querySelectorAll(linkSelector);

    if (!this.pill) {
      console.warn(`MagneticPillNav: pill "${pillSelector}" tidak ditemukan di dalam container.`);
      return;
    }

    this.init();
  }

  movePill(el, showImmediately = false) {
    // Hitung posisi relatif terhadap container (.navbar__menu)
    const parentRect = this.linksContainer.getBoundingClientRect();
    const elRect     = el.getBoundingClientRect();

    // FIX: tidak ada transform di pill, jadi left langsung = selisih kiri
    this.pill.style.left   = (elRect.left - parentRect.left) + 'px';
    this.pill.style.width  = elRect.width  + 'px';
    this.pill.style.height = elRect.height + 'px';
    this.pill.style.top    = (elRect.top  - parentRect.top)  + 'px';

    // Pertama kali: munculkan pill tanpa animasi agar tidak "terbang dari pojok"
    if (showImmediately) {
      this.pill.style.transition = 'none';
      this.pill.style.opacity = '1';
      // Restore transition di frame berikutnya
      requestAnimationFrame(() => {
        this.pill.style.transition = '';
      });
    } else {
      this.pill.style.opacity = '1';
    }
  }

  init() {
    // Set posisi awal pill ke active link (tanpa animasi)
    const activeLink = this.linksContainer.querySelector('.active');
    if (activeLink) {
      // Tunggu layout selesai baru hitung posisi
      setTimeout(() => this.movePill(activeLink, true), 60);
    }

    this.links.forEach(link => {
      // Hover: pill ikut bergerak
      link.addEventListener('mouseenter', () => this.movePill(link));

      // Click: update active class + pindah pill
      link.addEventListener('click', () => {
        this.links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        this.movePill(link);
      });
    });

    // Mouse keluar dari menu → pill kembali ke active link
    this.linksContainer.addEventListener('mouseleave', () => {
      const currentActive = this.linksContainer.querySelector('.active');
      if (currentActive) this.movePill(currentActive);
    });

    // Update saat window resize (posisi bisa bergeser)
    window.addEventListener('resize', () => {
      const currentActive = this.linksContainer.querySelector('.active');
      if (currentActive) this.movePill(currentActive, true);
    }, { passive: true });

    // Update active berdasarkan scroll section
    const sections = ['home', 'about', 'project', 'contact'];
    window.addEventListener('scroll', () => {
      let current = sections[0];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) current = id;
      });

      let changed = false;
      this.links.forEach(link => {
        const wasActive = link.classList.contains('active');
        const shouldBeActive = link.getAttribute('href') === '#' + current;
        link.classList.toggle('active', shouldBeActive);
        if (!wasActive && shouldBeActive) changed = true;
      });

      if (changed) {
        const newActive = this.linksContainer.querySelector('.active');
        if (newActive) this.movePill(newActive);
      }
    }, { passive: true });

    // Scroll effect pada header
    // window.addEventListener('scroll', () => {
    //   const header = document.querySelector('.header');
    //   if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    // }, { passive: true });
  }
}