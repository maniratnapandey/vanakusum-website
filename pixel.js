/* ================================================================
   META PIXEL (Facebook / Instagram ads tracking)
   ----------------------------------------------------------------
   Paste your Pixel ID below (Meta Events Manager → Data sources →
   your pixel → the number under its name). Leave it "" to switch
   tracking off everywhere.
   ================================================================ */
const META_PIXEL_ID = "";

(function () {
  // vkTrack(event, params, eventId): safe to call even when the pixel is off.
  window.vkTrack = function () {};
  if (!META_PIXEL_ID) return;

  /* Meta's standard base code */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');

  window.vkTrack = function (event, params, eventId) {
    try {
      if (eventId) fbq('track', event, params || {}, { eventID: eventId });
      else fbq('track', event, params || {});
    } catch (e) { /* never let tracking break the shop */ }
  };
})();
