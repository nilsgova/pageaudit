/* Meting: Umami Cloud, zonder cookies. */
(function () {
  var SCRIPT_URL = "https://cloud.umami.is/script.js";
  var WEBSITE_ID = "695bc98e-1039-4f1c-8175-e76763e2428f";

  /* Pakket onthouden bij het verzenden van het formulier. Het event zelf gaat pas
     weg op bedankt.html, dat de webhook pas na een geslaagde inzending bereikt. */
  var form = document.querySelector("form.audit");
  if (form) {
    form.addEventListener("submit", function () {
      var pakket = form.elements.pakket;
      try { sessionStorage.setItem("pakket", pakket ? pakket.value : ""); } catch (e) {}
    });
  }

  if (SCRIPT_URL.charAt(0) === "[" || WEBSITE_ID.charAt(0) === "[") return;

  var s = document.createElement("script");
  s.async = true;
  s.src = SCRIPT_URL;
  s.setAttribute("data-website-id", WEBSITE_ID);
  s.onload = function () {
    if (document.body.getAttribute("data-lead") !== "1" || !window.umami) return;
    /* generate_lead en aanvraag_verstuurd: alleen als het formulier hier net is verstuurd.
       De vlag met het pakket wordt meteen gewist, zodat een reload niets dubbel telt. */
    var pakket = null;
    try {
      pakket = sessionStorage.getItem("pakket");
      sessionStorage.removeItem("pakket");
    } catch (e) {}
    if (pakket === null) return;
    window.umami.track("generate_lead");
    window.umami.track("aanvraag_verstuurd", pakket ? { pakket: pakket } : {});
  };
  document.head.appendChild(s);
})();
