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
