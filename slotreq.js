/* Homepage "request a demo" block (#201). Same contract as demo.html's form (#133):
   slots.json {"api": ""} keeps the block hidden; otherwise POST <api>/request {email, profil?}.
   demo.html carries its own copy of this logic on purpose (it is self-contained); keep the two
   request bodies in step. Language comes from <html lang>. */
(function () {
  var sec = document.getElementById("slotReq");
  if (!sec) return;
  var en = document.documentElement.lang === "en";
  var T = en ? {
    sending: "Sending…", ok: "Request received.", fail: "Requests are not available right now. Please try again later.",
    net: "Could not connect. Please try again later."
  } : {
    sending: "Gönderiliyor…", ok: "Talebiniz alındı.", fail: "Şu anda talep alınamıyor. Lütfen sonra tekrar deneyin.",
    net: "Bağlantı kurulamadı. Lütfen sonra tekrar deneyin."
  };
  var base = sec.getAttribute("data-base") || "";
  fetch(base + "slots.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; })
    .then(function (cfg) {
      var api = String((cfg && cfg.api) || "").replace(/\/$/, "");
      if (!api) return;
      sec.hidden = false;
      // The hero note's mailto stays as the no-JS / no-backend fallback; with the block live it points here.
      var link = document.querySelector("a.trial-link");
      if (link) link.setAttribute("href", "#slotReq");
      var form = document.getElementById("slotForm"), msg = document.getElementById("slotMsg"),
          btn = document.getElementById("slotBtn");
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        btn.disabled = true;
        msg.className = "msg";
        msg.textContent = T.sending;
        var body = { email: document.getElementById("slotEmail").value };
        var sector = document.getElementById("slotSector").value;
        if (sector) body.profil = sector;
        fetch(api + "/request", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
        }).then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (b) {
            msg.className = res.ok ? "msg" : "msg err";
            msg.textContent = b.message || (res.ok ? T.ok : T.fail);
            if (res.ok) form.reset();
          });
        }).catch(function () {
          msg.className = "msg err"; msg.textContent = T.net;
        }).then(function () { btn.disabled = false; });
      });
    });
})();
