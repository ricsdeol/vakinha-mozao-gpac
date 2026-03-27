import "$styles/index.css";

// Import all JavaScript & CSS files from src/_components
import components from "$components/**/*.{js,jsx,js.rb,css}";

console.info("Bridgetown is loaded!");

// Copy PIX key to clipboard and show feedback on all copy buttons
window.copyPix = function () {
  const key = document.querySelector("[data-pix-key]")?.dataset.pixKey;
  if (!key) return;

  navigator.clipboard.writeText(key).then(() => {
    const btns = [
      document.getElementById("copy-btn"),
      document.getElementById("copy-btn-desktop"),
      document.getElementById("copy-btn-section"),
    ].filter(Boolean);

    btns.forEach((btn) => {
      btn.innerHTML = "✓ Copiado!";
      btn.disabled = true;
    });

    setTimeout(() => {
      btns.forEach((btn) => {
        btn.innerHTML =
          '<i data-lucide="copy" class="w-3 h-3 inline-block mr-1"></i>Copiar';
        btn.disabled = false;
        lucide.createIcons();
      });
    }, 2000);
  });
};

// Hide floating PIX bars when the inline PIX section is visible
document.addEventListener("DOMContentLoaded", () => {
  const pixSection = document.getElementById("pix-section");
  const mobileBar = document.getElementById("pix-bar-mobile");
  const desktopBar = document.getElementById("pix-bar-desktop");

  if (!pixSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const isVisible = entries[0].isIntersecting;

      if (mobileBar) {
        mobileBar.style.transform = isVisible
          ? "translateY(100%)"
          : "translateY(0)";
      }
      if (desktopBar) {
        desktopBar.style.opacity = isVisible ? "0" : "1";
        desktopBar.style.pointerEvents = isVisible ? "none" : "auto";
      }
    },
    { threshold: 0.15 }
  );

  observer.observe(pixSection);
});
