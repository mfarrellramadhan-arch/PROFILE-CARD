class MagneticPillNav {
  /**
   * @param {string} containerSelector  — CSS selector untuk <ul class="navbar__menu">
   * @param {string} pillSelector       — CSS selector untuk .navbar__pill (di dalam container)
   * @param {string} linkSelector       — CSS selector untuk setiap nav link
   */
  constructor(containerSelector, pillSelector, linkSelector) {

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

    this._scrollEndTimer = null;
    this._scrollEndCheck = null;

    this.init();
  }

  movePill(el, showImmediately = false) {
    const parentRect = this.linksContainer.getBoundingClientRect();
    const elRect     = el.getBoundingClientRect();

    this.pill.style.left   = (elRect.left - parentRect.left) + 'px';
    this.pill.style.width  = elRect.width  + 'px';
    this.pill.style.height = elRect.height + 'px';
    this.pill.style.top    = (elRect.top  - parentRect.top)  + 'px';

    if (showImmediately) {
      this.pill.style.transition = 'none';
      this.pill.style.opacity = '1';
 
      requestAnimationFrame(() => {
        this.pill.style.transition = '';
      });
    } else {
      this.pill.style.opacity = '1';
    }
  }


  _holdLockUntilScrollSettles() {
    if (this._scrollEndCheck) {
      window.removeEventListener('scroll', this._scrollEndCheck);
    }

    const releaseLock = () => {
      this.isScrollingProgrammatically = false;
      window.removeEventListener('scroll', this._scrollEndCheck);
      this._scrollEndCheck = null;
    };

    const armRelease = () => {
      clearTimeout(this._scrollEndTimer);
      this._scrollEndTimer = setTimeout(releaseLock, 120);
    };

    this._scrollEndCheck = armRelease;
    window.addEventListener('scroll', this._scrollEndCheck, { passive: true });

    armRelease();
  }

  init() {
    this.isScrollingProgrammatically = false;

    const activeLink = this.linksContainer.querySelector('.active');
    if (activeLink) {

      setTimeout(() => this.movePill(activeLink, true), 60);
    }

    this.links.forEach(link => {

      link.addEventListener('mouseenter', () => {
        if (!this.isScrollingProgrammatically) this.movePill(link)});

      link.addEventListener('click', () => {
        this.isScrollingProgrammatically = true;
        this.links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const isMobile = window.innerHeight < 768;

        setTimeout (() => {
          this.movePill(link);
          this._holdLockUntilScrollSettles();
        }, isMobile ? 360 : 0);
        
      });
    });

    this.linksContainer.addEventListener('mouseleave', () => {
      const currentActive = this.linksContainer.querySelector('.active');
      if (currentActive) this.movePill(currentActive);
    });

    window.addEventListener('resize', () => {
      const currentActive = this.linksContainer.querySelector('.active');
      if (currentActive) this.movePill(currentActive, true);
    }, { passive: true });

    const sections = ['home', 'about', 'project', 'contact'];
    window.addEventListener('scroll', () => {
      if (this.isScrollingProgrammatically) return;

      let current = sections[0];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {current = id;};
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

  }
}