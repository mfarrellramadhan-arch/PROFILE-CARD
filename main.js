// ─── CONFIG ───────────────────────────────────────────────────────────────────

const SCROLL_DELAY = 360;
const CLOSE_TIMEOUT = 5000;
const SCRAMBLE_DURATION = 2000;
const SCRAMBLE_SPEED = 25;
const MOBILE_BREAKPOINT = 768;

// ─── NAVBAR — Hamburger Toggle ────────────────────────────────────────────────

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const hamburgerIcon = hamburger.querySelector("i");
const menuLinks = menu.querySelectorAll("a");

const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

function openMenu() {
  menu.classList.add("active");
  hamburgerIcon.classList.replace("fa-bars", "fa-xmark");
  hamburger.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  menu.classList.remove("active");
  hamburgerIcon.classList.replace("fa-xmark", "fa-bars");
  hamburger.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  menu.classList.contains("active") ? closeMenu() : openMenu();
}

hamburger.addEventListener("click", toggleMenu);

menuLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    if (isMobile() && href && href.startsWith("#")) {
      e.preventDefault();

      closeMenu();

      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, SCROLL_DELAY);
    } else {
      closeMenu();
    }
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#hamburger") && !e.target.closest("#menu")) {
    closeMenu();
  }
});

// ─── FORM ─────────────────────────────────────────────────────────────────────

const btnForm = document.getElementById("form-btn");
const form = document.getElementById("form");
const alertBox = document.getElementById('alert')
const errorBox = document.getElementById('error')
const linkURL =
  "https://script.google.com/macros/s/AKfycbzZ5MhZe_OIQEpKlbQApchzrjZ6E3l7Iajk5a6Bgh5x79kgUQ_oSqRk4nN_v5NHzsg9ng/exec";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  btnForm.innerHTML = "Mengirim...";
  btnForm.disabled = true;

  try {
    await fetch(linkURL, { method: "POST", body: new FormData(form) });
      alertBox.classList.add('show');
    form.reset();

    setTimeout(() => {
      alertBox.classList.replace('show', 'notShow');
    }, CLOSE_TIMEOUT)

  } catch (error) {
    errorBox.classList.add('show');
    console.error("Error!", error.message);
    form.reset();

    setTimeout(() => {
      errorBox.classList.replace('show', 'notShow');
    });

  } finally {
    btnForm.innerHTML = "Send Message";
    btnForm.disabled = false;
  }
});

// ─── TEXT SCRAMBLE ────────────────────────────────────────────────────────────

function textScramble(element, text, duration = SCRAMBLE_DURATION, speed = SCRAMBLE_SPEED) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  const steps = duration / speed;
  let stepProgress = 0;

  const interval = setInterval(() => {
    const progress = stepProgress / steps;
    let scrambled = "";

    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") {
        scrambled += " ";
      } else if (progress * text.length > i) {
        scrambled += text[i];
      } else {
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    element.textContent = scrambled;
    stepProgress++;

    if (stepProgress > steps) {
      clearInterval(interval);
      element.textContent = text;
    }
  }, speed);
}

const scrambleEl = document.getElementById("text-scramble");
textScramble(scrambleEl, scrambleEl.textContent);

// CLOSE BUTTON

document.body.addEventListener('click', (e) => {
  const dismissBtn = e.target.closest('[data-dismiss-target]')

  if(!dismissBtn) return;

  const targetSelector = dismissBtn.getAttribute('data-dismiss-target')

  const targetElement = dismissBtn.closest(targetSelector)
  
  if(targetElement) {
    targetElement.style.display = 'none'
  }
});


// BACK TO TOP BUTTON
const backToTop = document.getElementById('backToTop')

window.addEventListener('scroll', () => {
  if(window.scrollY > 300) {
    backToTop.classList.add('show');
  } else {backToTop.classList.remove('show')}
})

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});



// LIGHT MODE / DARK MODE
