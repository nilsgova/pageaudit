/* Meting: Umami, zelf gehost, zonder cookies. Vul de twee waarden in voor livegang. */
(function () {
  var SCRIPT_URL = "[UMAMI_SCRIPT_URL]";
  var WEBSITE_ID = "[UMAMI_WEBSITE_ID]";
  if (SCRIPT_URL.charAt(0) === "[" || WEBSITE_ID.charAt(0) === "[") return;

  var s = document.createElement("script");
  s.defer = true;
  s.src = SCRIPT_URL;
  s.setAttribute("data-website-id", WEBSITE_ID);
  s.onload = function () {
    /* generate_lead: eenmaal per bezoek, op bedankt.html */
    if (document.body.getAttribute("data-lead") !== "1" || !window.umami) return;
    try {
      if (sessionStorage.getItem("lead_sent")) return;
      sessionStorage.setItem("lead_sent", "1");
    } catch (e) {}
    window.umami.track("generate_lead");
  };
  document.head.appendChild(s);
})();
