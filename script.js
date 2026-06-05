//  NAVBAR — Hamburger Toggle

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const hamburgerIcon = hamburger.querySelector("i");

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

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
    closeMenu();
  }
});

// FORM
const btnForm = document.getElementById("form-btn");
const linkURL = "https://script.google.com/macros/s/AKfycbzZ5MhZe_OIQEpKlbQApchzrjZ6E3l7Iajk5a6Bgh5x79kgUQ_oSqRk4nN_v5NHzsg9ng/exec";
const alertForm = "Pesan anda berhasil terkirim !";
const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  btnForm.innerHTML = "Mengirim...";
  btnForm.disabled = true;

  fetch(linkURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      alert("Pesan anda telah terkirim !");
      form.reset();
      btnForm.innerHTML = "Send Message";
      btnForm.disabled = false;
      console.log("Sukses!", response);
    })

    .catch((error) => {
      console.error("Error!", error.message);
    });
});

// TEXT SCRAMBLE
const element = document.getElementById("text-scramble");
const originalText = element.textContent;

function textScramble () {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

  const duration = 2000;
  const speed = 25;

  const steps = duration / speed;
  let stepProgress = 0;

  const interval = setInterval(() => {
    const progress = stepProgress / steps;
    let scrambled = "";

    for (let i = 0; i < originalText.length; i++) {
      if (originalText[i] === " ") {
        scrambled += " ";

        continue;
      }

      if (progress * originalText.length > i) {
        scrambled += originalText[i];
      } else {
        const randomIndex = Math.floor(Math.random() * chars.length);

        const randomChar = chars[randomIndex];

        scrambled += randomChar;
      }
    }

    element.textContent = scrambled;

    stepProgress++;

    if (stepProgress > steps) {
      clearInterval(interval);
      element.textContent = originalText;
    }
  }, speed);
};

textScramble()
