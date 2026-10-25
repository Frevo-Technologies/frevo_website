(() => {
  const root = document.documentElement;
  const sessionKey = "frevo-signature-seen-v3";
  const forcePreview =
    new URLSearchParams(window.location.search).get("signature") === "preview";
  window.__frevoSignatureSessionKey = sessionKey;
  window.__frevoSignaturePreview = forcePreview;

  try {
    if (!forcePreview && sessionStorage.getItem(sessionKey)) return;
  } catch {
    // The opening can still run when session storage is unavailable.
  }

  root.classList.add("signature-pending");
  window.__frevoSignatureFallback = window.setTimeout(() => {
    root.classList.remove("signature-pending");
  }, 3200);
})();
