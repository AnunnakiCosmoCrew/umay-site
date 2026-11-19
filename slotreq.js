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
  // The backend (Umay demo/slots) answers in Turkish only. On the English page each known
  // answer is shown in English, with the session times carried over; an unknown one falls
  // back to the generic line. Keep these in step with slot_core.py's Decision messages.
  var EN_ANSWERS = [
    [/Oturum (\d{1,2}:\d{2}) – (\d{1,2}:\d{2}) arasında açık/, function (m) {
      return "Your demo link will be in your inbox within seconds. The session is open " + m[1] + " – " + m[2] + " (Türkiye time)."; }],
    [/10 dakika içinde/, function () { return "Your link will reach your inbox within 10 minutes."; }],
    [/yaklaşık (\d{1,2}:\d{2}) saatinde başlayacak/, function (m) {
      return "Another session is running. Yours starts at about " + m[1] + " (Türkiye time); the link will be e-mailed then."; }],
    [/bugün zaten bir demo bağlantısı/, function () { return "A demo link was already sent to this address today. Please try again tomorrow."; }],
    [/kontenjanı doldu/, function () { return "Today's demo places are taken. Please try again tomorrow."; }],
    [/Çok sık denediniz/, function () { return "Too many tries. Please wait a little and try again."; }],
    [/sırada çok istek/, function () { return "Many requests are waiting right now. Please try again a little later."; }],
    [/Geçerli bir e-posta/, function () { return "Please enter a valid e-mail address."; }],
    [/Bilinmeyen demo türü/, function () { return "Unknown demo type."; }]
  ];
  function answer(message, ok) {
    if (!message) return ok ? T.ok : T.fail;
    if (!en) return message;
    for (var i = 0; i < EN_ANSWERS.length; i++) {
      var m = EN_ANSWERS[i][0].exec(message);
      if (m) return EN_ANSWERS[i][1](m);
    }
    return ok ? T.ok : T.fail;
  }
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
            msg.textContent = answer(b.message, res.ok);
            if (res.ok) form.reset();
          });
        }).catch(function () {
          msg.className = "msg err"; msg.textContent = T.net;
        }).then(function () { btn.disabled = false; });
      });
    });
})();
