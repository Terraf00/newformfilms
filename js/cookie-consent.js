(function () {
  var STORAGE_KEY = "newform_cookie_consent";
  var COOKIE_NAME = "newform_cookie_consent";
  var COOKIE_DAYS = 180;

  function readConsent() {
    var fromCookie = document.cookie
      .split("; ")
      .find(function (entry) {
        return entry.indexOf(COOKIE_NAME + "=") === 0;
      });

    if (fromCookie) {
      try {
        return JSON.parse(decodeURIComponent(fromCookie.split("=").slice(1).join("=")));
      } catch (error) {
        return null;
      }
    }

    try {
      var fromStorage = window.localStorage.getItem(STORAGE_KEY);
      return fromStorage ? JSON.parse(fromStorage) : null;
    } catch (error) {
      return null;
    }
  }

  function saveConsent(preferences) {
    var payload = {
      necessary: true,
      analytics: !!preferences.analytics,
      updatedAt: new Date().toISOString(),
    };
    var serialized = JSON.stringify(payload);
    var expires = new Date();

    expires.setDate(expires.getDate() + COOKIE_DAYS);

    document.cookie =
      COOKIE_NAME +
      "=" +
      encodeURIComponent(serialized) +
      "; expires=" +
      expires.toUTCString() +
      "; path=/; SameSite=Lax";

    try {
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {}

    window.newformCookieConsent = payload;
    window.dispatchEvent(
      new CustomEvent("newform:cookie-consent-updated", {
        detail: payload,
      })
    );
  }

  function createStyles() {
    if (document.getElementById("newform-cookie-consent-styles")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "newform-cookie-consent-styles";
    style.textContent =
      ".cookie-consent{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;display:none}" +
      ".cookie-consent.is-visible{display:block}" +
      ".cookie-consent__panel{max-width:56rem;margin:0 auto;padding:.95rem 1rem;border:1px solid rgba(255,255,255,.1);border-radius:1.15rem;background:rgba(19,19,21,.92);box-shadow:0 18px 38px rgba(0,0,0,.26);backdrop-filter:blur(14px)}" +
      ".cookie-consent__content{display:flex;gap:1rem;align-items:flex-end;justify-content:space-between}" +
      ".cookie-consent__copy{max-width:34rem}" +
      ".cookie-consent__eyebrow{margin-bottom:.35rem;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.5)}" +
      ".cookie-consent__title{margin:0 0 .3rem;font-size:1rem;line-height:1.3;color:#fff}" +
      ".cookie-consent__text{margin:0;color:rgba(255,255,255,.68);font-size:.9rem;line-height:1.5}" +
      ".cookie-consent__text a{color:#fff;text-decoration:underline}" +
      ".cookie-consent__actions{display:flex;flex-wrap:wrap;gap:.55rem;align-items:center;justify-content:flex-end}" +
      ".cookie-consent__button{appearance:none;border:0;border-radius:999px;padding:.72rem 1rem;font:inherit;font-size:.88rem;line-height:1;cursor:pointer;transition:transform .2s ease,background-color .2s ease,color .2s ease,border-color .2s ease}" +
      ".cookie-consent__button:hover{transform:translateY(-1px)}" +
      ".cookie-consent__button--primary{background:#fff;color:#111}" +
      ".cookie-consent__button--secondary{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.2)}" +
      ".cookie-consent__button--ghost{background:rgba(255,255,255,.08);color:#fff}" +
      ".cookie-consent__preferences{display:none;margin-top:.8rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.08)}" +
      ".cookie-consent__preferences.is-visible{display:block}" +
      ".cookie-consent__option{display:flex;gap:1rem;align-items:flex-start;justify-content:space-between;padding:.8rem 0}" +
      ".cookie-consent__option + .cookie-consent__option{border-top:1px solid rgba(255,255,255,.08)}" +
      ".cookie-consent__option-title{margin:0 0 .2rem;color:#fff;font-size:.95rem}" +
      ".cookie-consent__option-text{margin:0;color:rgba(255,255,255,.66);font-size:.88rem;line-height:1.5;max-width:34rem}" +
      ".cookie-consent__switch{position:relative;width:3.2rem;height:1.85rem;flex:0 0 auto}" +
      ".cookie-consent__switch input{position:absolute;opacity:0;pointer-events:none}" +
      ".cookie-consent__slider{position:absolute;inset:0;border-radius:999px;background:rgba(255,255,255,.18);transition:background-color .2s ease}" +
      ".cookie-consent__slider:before{content:'';position:absolute;top:.22rem;left:.22rem;width:1.4rem;height:1.4rem;border-radius:50%;background:#fff;transition:transform .2s ease}" +
      ".cookie-consent__switch input:checked + .cookie-consent__slider{background:#6d7cff}" +
      ".cookie-consent__switch input:checked + .cookie-consent__slider:before{transform:translateX(1.35rem)}" +
      ".cookie-consent__switch input:disabled + .cookie-consent__slider{background:rgba(255,255,255,.28)}" +
      "@media screen and (max-width: 991px){.cookie-consent__content{flex-direction:column;align-items:flex-start}.cookie-consent__actions{justify-content:flex-start}}" +
      "@media screen and (max-width: 767px){.cookie-consent{left:.75rem;right:.75rem;bottom:.75rem}.cookie-consent__panel{padding:.9rem;border-radius:1rem}.cookie-consent__actions,.cookie-consent__button{width:100%}.cookie-consent__button{text-align:center}.cookie-consent__option{flex-direction:column}.cookie-consent__switch{margin-top:.25rem}}";

    document.head.appendChild(style);
  }

  function createMarkup() {
    if (document.getElementById("cookie-consent")) {
      return;
    }

    var wrapper = document.createElement("div");
    wrapper.className = "cookie-consent";
    wrapper.id = "cookie-consent";
    wrapper.setAttribute("role", "dialog");
    wrapper.setAttribute("aria-live", "polite");
    wrapper.setAttribute("aria-label", "Preferencias de cookies");
    wrapper.innerHTML =
      '<div class="cookie-consent__panel">' +
      '<div class="cookie-consent__content">' +
      '<div class="cookie-consent__copy">' +
      '<div class="cookie-consent__eyebrow">Cookies</div>' +
      '<h2 class="cookie-consent__title">Tu privacidad, bajo control</h2>' +
      '<p class="cookie-consent__text">Usamos cookies necesarias para que la web funcione y, si lo autorizas, cookies analíticas para entender cómo se usa. Puedes aceptar, rechazar o configurar tus preferencias. Más información en nuestra <a href="/politica-cookies.html">Política de cookies</a>.</p>' +
      "</div>" +
      '<div class="cookie-consent__actions">' +
      '<button class="cookie-consent__button cookie-consent__button--ghost" type="button" data-cookie-action="configure">Configurar</button>' +
      '<button class="cookie-consent__button cookie-consent__button--secondary" type="button" data-cookie-action="reject">Rechazar</button>' +
      '<button class="cookie-consent__button cookie-consent__button--primary" type="button" data-cookie-action="accept">Aceptar</button>' +
      "</div>" +
      "</div>" +
      '<div class="cookie-consent__preferences" id="cookie-consent-preferences">' +
      '<div class="cookie-consent__option">' +
      '<div><h3 class="cookie-consent__option-title">Cookies necesarias</h3><p class="cookie-consent__option-text">Son imprescindibles para el funcionamiento básico del sitio y no se pueden desactivar.</p></div>' +
      '<label class="cookie-consent__switch"><input checked disabled type="checkbox"/><span class="cookie-consent__slider" aria-hidden="true"></span></label>' +
      "</div>" +
      '<div class="cookie-consent__option">' +
      '<div><h3 class="cookie-consent__option-title">Cookies analíticas</h3><p class="cookie-consent__option-text">Nos ayudan a medir el uso de la web y mejorar contenidos y navegación. Solo se activan si las aceptas.</p></div>' +
      '<label class="cookie-consent__switch"><input id="cookie-consent-analytics" type="checkbox"/><span class="cookie-consent__slider" aria-hidden="true"></span></label>' +
      "</div>" +
      '<div class="cookie-consent__actions">' +
      '<button class="cookie-consent__button cookie-consent__button--secondary" type="button" data-cookie-action="save">Guardar configuración</button>' +
      "</div>" +
      "</div>" +
      "</div>";

    document.body.appendChild(wrapper);
  }

  function updateLinksForCurrentPath() {
    var banner = document.getElementById("cookie-consent");
    if (!banner) {
      return;
    }

    var link = banner.querySelector('a[href="/politica-cookies.html"]');
    if (!link) {
      return;
    }

    var isBlogPost = window.location.pathname.indexOf("/blog-posts/") !== -1;
    link.setAttribute("href", isBlogPost ? "../politica-cookies.html" : "politica-cookies.html");
  }

  function openPreferences() {
    var banner = document.getElementById("cookie-consent");
    var preferences = document.getElementById("cookie-consent-preferences");
    if (!banner || !preferences) {
      return;
    }

    banner.classList.add("is-visible");
    preferences.classList.add("is-visible");
  }

  function closeBanner() {
    var banner = document.getElementById("cookie-consent");
    if (banner) {
      banner.classList.remove("is-visible");
    }
  }

  function showBanner(initialConsent) {
    var banner = document.getElementById("cookie-consent");
    var analyticsCheckbox = document.getElementById("cookie-consent-analytics");
    var preferences = document.getElementById("cookie-consent-preferences");

    if (!banner || !analyticsCheckbox || !preferences) {
      return;
    }

    analyticsCheckbox.checked = !!(initialConsent && initialConsent.analytics);

    if (initialConsent) {
      return;
    }

    banner.classList.add("is-visible");
  }

  function bindEvents() {
    var banner = document.getElementById("cookie-consent");
    var analyticsCheckbox = document.getElementById("cookie-consent-analytics");
    var preferences = document.getElementById("cookie-consent-preferences");

    if (!banner || !analyticsCheckbox || !preferences) {
      return;
    }

    banner.addEventListener("click", function (event) {
      var action = event.target.getAttribute("data-cookie-action");

      if (!action) {
        return;
      }

      if (action === "configure") {
        openPreferences();
        return;
      }

      if (action === "accept") {
        saveConsent({ analytics: true });
        closeBanner();
        return;
      }

      if (action === "reject") {
        analyticsCheckbox.checked = false;
        saveConsent({ analytics: false });
        closeBanner();
        return;
      }

      if (action === "save") {
        saveConsent({ analytics: analyticsCheckbox.checked });
        closeBanner();
      }
    });

  }

  function init() {
    createStyles();
    createMarkup();
    updateLinksForCurrentPath();
    var consent = readConsent();
    window.newformCookieConsent = consent;
    showBanner(consent);
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
