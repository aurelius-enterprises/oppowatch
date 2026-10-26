// First-party page counter for GoatCounter (https://www.goatcounter.com/help/pixel): no cookies, no storage,
// nothing loaded from another host. Sends the page view, then one event per click on a link to another host
// (the buy buttons). The endpoint comes from the tag: <script src="count.js" data-goatcounter="https://CODE.goatcounter.com/count" defer>
(function () {
  "use strict";
  var me = document.currentScript, url = me && me.getAttribute("data-goatcounter");
  if (!url || !/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/.test(url)) return;
  // local previews, headless browsers and framed copies are not visitors
  if (location.protocol !== "https:" || navigator.webdriver || window.top !== window.self) return;

  function send(params) {
    var q = Object.keys(params).map(function (k) { return k + "=" + encodeURIComponent(params[k]); });
    var u = url + "?" + q.join("&") + "&rnd=" + Math.random().toString(36).slice(2);
    if (!navigator.sendBeacon || !navigator.sendBeacon(u)) new Image().src = u;
  }

  // a referrer on this host is reduced to its path, so a query string never leaves the site
  var ref = "";
  try {
    var r = new URL(document.referrer);
    ref = r.host === location.host ? r.pathname : r.origin + r.pathname;
  } catch (e) { /* no referrer */ }
  // only campaign tags from the query (utm_*, ref), never anything else in it
  var campaign = location.search.slice(1).split("&").filter(function (kv) { return /^(utm_\w+|ref)=/.test(kv); });
  send({p: location.pathname, t: document.title, r: ref, q: campaign.length ? "?" + campaign.join("&") : "",
        s: screen.width});

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a[href]");
    if (!a || a.host === location.host) return;
    var card = a.closest(".card"), h = card && card.querySelector("h3");
    var name = ((h ? h.textContent + " / " : "") + a.textContent).replace(/\s+/g, " ").trim();
    send({p: "click: " + name + " -> " + a.hostname, t: document.title, e: "true"});
  });
})();
