/* DivArt. Ванильный JS: плиты и «посадка» подушки, видео-петли, лента, меню, якоря, язык, форма в WhatsApp. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var ASSET_V = ((doc.currentScript && doc.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); };
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };
  var LANG = "ru";
  var MOBILE = W.matchMedia("(max-width:760px)").matches;
  var TOUCH = W.matchMedia("(pointer:coarse)").matches;
  var VW = W.innerWidth, VH = W.innerHeight;

  /* ---------- WhatsApp: один номер, текст по ключу кнопки и языку ---------- */
  var PHONE = "77025616883";
  var WA = {
    ru: {
      "default": "Здравствуйте! Пишу с сайта DivArt. Хочу рассчитать мебель. Что нужно: ",
      hero: "Здравствуйте! Пишу с сайта DivArt. Хочу рассчитать мебель для квартиры. Что нужно и размеры: ",
      menu: "Здравствуйте! Пишу с сайта DivArt. Хочу рассчитать мебель. Что нужно: ",
      sticky: "Здравствуйте! Пишу с сайта DivArt. Хочу рассчитать мебель. Что нужно: ",
      kontakty: "Здравствуйте! Пишу с сайта DivArt. Хочу рассчитать мебель. Что нужно и размеры: ",
      podklyuch: "Здравствуйте! Интересует мебель под ключ для всей квартиры. Комнаты и примерные размеры: ",
      krovati: "Здравствуйте! Интересует кровать на заказ. Размер спального места и пожелания: ",
      divany: "Здравствуйте! Интересует диван на заказ. Размер стены и форма (прямой, угловой): ",
      kresla: "Здравствуйте! Интересуют кресла или пуфы на заказ. Что нужно: ",
      kukhni: "Здравствуйте! Интересует кухня на заказ. Размеры кухни: ",
      shkafy: "Здравствуйте! Интересует шкаф или гардеробная на заказ. Размеры ниши: ",
      shourum: "Здравствуйте! Хочу приехать в шоурум на Серкебаева 4/1. Удобное время: "
    },
    en: {
      "default": "Hello! I am writing from the DivArt website. I would like a quote for furniture. What I need: ",
      hero: "Hello! I am writing from the DivArt website. I would like a quote for furniture for my apartment. Items and sizes: ",
      menu: "Hello! I am writing from the DivArt website. I would like a quote for furniture. What I need: ",
      sticky: "Hello! I am writing from the DivArt website. I would like a quote for furniture. What I need: ",
      kontakty: "Hello! I am writing from the DivArt website. I would like a quote for furniture. Items and sizes: ",
      podklyuch: "Hello! I am interested in turnkey furniture for the whole apartment. Rooms and approximate sizes: ",
      krovati: "Hello! I am interested in a custom bed. Mattress size and wishes: ",
      divany: "Hello! I am interested in a custom sofa. Wall length and shape (straight, corner): ",
      kresla: "Hello! I am interested in custom armchairs or ottomans. What I need: ",
      kukhni: "Hello! I am interested in a custom kitchen. Kitchen dimensions: ",
      shkafy: "Hello! I am interested in a custom wardrobe or walk-in closet. Niche dimensions: ",
      shourum: "Hello! I would like to visit the showroom at Serkebayeva 4/1. Convenient time: "
    }
  };
  var FORM_LABELS = {
    ru: { head: "Заявка с сайта DivArt", name: "Имя", phone: "Телефон", msg: "Что нужно" },
    en: { head: "Request from the DivArt website", name: "Name", phone: "Phone", msg: "What is needed" }
  };
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var key = a.getAttribute("data-wa") || "default";
    var dict = WA[LANG] || WA.ru;
    var text = dict[key] || WA.ru[key] || WA.ru["default"];
    a.setAttribute("href", "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text));
  }, true);

  /* ---------- Конверсии Google Ads: gtag подключается на этапе деплоя, здесь только вызовы ---------- */
  function fireConv(key) {
    if (typeof W.gtag_report_conversion !== "function" || !W.AW_CONV) return;
    var sendTo = W.AW_CONV[key];
    if (sendTo) W.gtag_report_conversion(undefined, sendTo);
  }
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"], a[href*="wa.me"]') : null;
    if (!a) return;
    fireConv(a.getAttribute("href").indexOf("tel:") === 0 ? "phone" : "contact");
  }, true);

  /* ---------- Меню ---------- */
  var burger = doc.querySelector(".burger"), menu = doc.getElementById("menu");
  var behind = [doc.getElementById("main"), doc.querySelector(".foot"), doc.getElementById("sticky")];
  function setMenu(open, returnFocus) {
    if (!menu || !burger) return;
    var was = doc.body.classList.contains("menu-open");
    if (open === was) return;
    doc.body.classList.toggle("menu-open", open);
    behind.forEach(function (el) { if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("open"); });
      setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }, 60);
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 340);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && doc.body.classList.contains("menu-open")) setMenu(false, true); });

  /* ---------- Якоря ---------- */
  var HDR = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--hdr")) || 72; };
  function targetTop(el) {
    var r = el.getBoundingClientRect().top + W.pageYOffset;
    if (el.classList.contains("pw")) return (MOBILE || flowPlate(el)) ? r - HDR() : r;
    if (el.classList.contains("sec")) return r - HDR();
    return r - HDR() - 14;
  }
  function goTo(id, instant) {
    var el = doc.getElementById(id);
    if (!el) return false;
    setMenu(false);
    var top = Math.max(0, targetTop(el));
    if (instant || REDUCED) { root.style.scrollBehavior = "auto"; W.scrollTo(0, top); root.style.scrollBehavior = ""; }
    else W.scrollTo({ top: top, behavior: "smooth" });
    return true;
  }
  doc.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (goTo(id)) {
      e.preventDefault();
      try { history.pushState(null, "", "#" + id); } catch (err) {}
      var t = doc.getElementById(id);
      if (t) { if (!t.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) t.setAttribute("tabindex", "-1"); try { t.focus({ preventScroll: true }); } catch (err2) {} }
    }
  });

  /* ---------- Подушка: кромка прогибается под весом, кадр расправляется с отскоком ---------- */
  /* pressOf(t): t - ход раскрытия 0..1; 1 - сжата, через ноль с перелётом и затуханием */
  function pressOf(t) {
    if (t <= 0) return 1;
    if (t >= 1) return 0;
    return Math.exp(-3.2 * t) * Math.cos(4.2 * t);
  }
  function cushD(w, h, r, D) {
    var cx = (w / 2).toFixed(1); r = Math.min(r, w / 2, h / 2);
    var w1 = (w - r).toFixed(1), h1 = (h - r).toFixed(1), d2 = (2 * D).toFixed(1);
    return "M" + r + ",0 Q" + cx + "," + d2 + " " + w1 + ",0 A" + r + "," + r + " 0 0 1 " + w + "," + r +
      " L" + w + "," + h1 + " A" + r + "," + r + " 0 0 1 " + w1 + "," + h + " L" + r + "," + h +
      " A" + r + "," + r + " 0 0 1 0," + h1 + " L0," + r + " A" + r + "," + r + " 0 0 1 " + r + ",0 Z";
  }
  var RC = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--rc")) || 28; };
  function cushInit(el) {
    el._skin = el.querySelector(".cush-skin");
    el._pipe = el.querySelector(".cush-pipe path");
    el._w = 0; el._h = 0; el._p = null; el._o = null; el._rc = RC();
    return el;
  }
  function cushSize(el) {
    var w = el._skin.offsetWidth, h = el._skin.offsetHeight;
    if (w !== el._w || h !== el._h) { el._w = w; el._h = h; el._p = null; }
  }
  function cushSet(el, p, o, rc) {
    if (!el._skin) cushInit(el);
    if (REDUCED) { p = 0; o = 1; }
    var r = rc === undefined ? el._rc : rc;
    if (el._p === p && el._o === o && el._r === r) return;
    if (el._o !== o) { el._o = o; el.style.setProperty("--o", o.toFixed(4)); }
    if (el._p === p && el._r === r) return;
    if (el._p !== p) el.style.setProperty("--p", p.toFixed(4));
    el._p = p; el._r = r;
    var w = el._w, h = el._h;
    if (!w || !h) return;
    var D = Math.max(0, p) * 0.13 * h;
    if (D > 0.3) {
      var d = cushD(w, h, r, D);
      el._skin.style.clipPath = "path('" + d + "')";
      if (el._pipe) el._pipe.setAttribute("d", d);
    } else {
      el._skin.style.clipPath = "";
      if (el._pipe) el._pipe.setAttribute("d", cushD(w, h, r, 0));
    }
  }
  var win = doc.querySelector(".win");
  var cushes = [].slice.call(doc.querySelectorAll(".cush")).map(cushInit);
  function cushResize() {
    cushes.forEach(function (c) {
      c._rc = RC(); cushSize(c);
      if (c._p === null) return;
      var p = c._p, o = c._o, r = c._r; c._p = null;
      cushSet(c, p, o, c === win ? r : undefined);
    });
  }

  /* ---------- Плиты: enter / stay / exit; подушка по --open ---------- */
  var pws = [].slice.call(doc.querySelectorAll(".pw"));
  var sticky = doc.getElementById("sticky"), kont = doc.getElementById("kontakty");
  var hdr = doc.getElementById("hdr");
  var INTRO = (location.hash.length > 1 || W.pageYOffset > 80 || REDUCED) ? 1 : 0;
  var introStart = 0, ticking = false;
  var st = pws.map(function () { return { open: -1, out: {} }; });
  var lastTs = 0;
  function put(el, s, k, v) { if (s.out[k] !== v) { s.out[k] = v; el.style.setProperty(k, v); } }
  function flowPlate(pw) {
    var plate = pw.firstElementChild;
    return !plate || getComputedStyle(plate).position !== "sticky";
  }
  function update(ts) {
    ticking = false;
    var now = typeof ts === "number" ? ts : performance.now();
    var dt = lastTs ? Math.min(64, now - lastTs) : 16.7; lastTs = now;
    var k = 1 - Math.pow(1 - 0.16, dt / 16.7);
    var H = VH;
    var pageY = W.pageYOffset;
    var kontTop = kont ? kont.getBoundingClientRect().top : null;
    var rects = [], nxtTops = [], i;
    for (i = 0; i < pws.length; i++) {
      rects.push(pws[i].getBoundingClientRect());
      var nx = pws[i].nextElementSibling;
      nxtTops.push(nx ? nx.getBoundingClientRect().top : null);
    }
    var moving = false;
    for (i = 0; i < pws.length; i++) {
      var pw = pws[i], r = rects[i], s = st[i];
      var near = r.bottom > -H * 0.5 && r.top < H * 1.5;
      if (!near && s.out["--enter"] !== undefined && !s.reset) { s.reset = true; } else if (near) s.reset = false;
      if (!near && s.reset) continue;
      var flow = flowPlate(pw);
      var enter = clamp(1 - r.top / H);
      var stay = r.height > H ? clamp(-r.top / (r.height - H)) : 0;
      var exit = (nxtTops[i] !== null && !flow) ? clamp(1 - nxtTops[i] / H) : 0;
      var isHero = pw.classList.contains("pw-hero");
      var open;
      if (isHero) open = REDUCED ? 1 : INTRO;
      else open = REDUCED ? 1 : (flow ? clamp((enter - 0.18) / 0.5) : clamp((enter - 0.28) / 0.6));
      if (s.open < 0 || REDUCED || isHero) s.open = open;
      else {
        s.open += (open - s.open) * k;
        if (Math.abs(open - s.open) > 0.002) moving = true; else s.open = open;
      }
      put(pw, s, "--enter", enter.toFixed(4));
      put(pw, s, "--stay", (isHero ? easeOut(stay) : stay).toFixed(4));
      put(pw, s, "--exit", exit.toFixed(4));
      put(pw, s, "--open", s.open.toFixed(4));
      var plate = pw.firstElementChild;
      if (isHero && plate) {
        var grow = flow ? 0 : easeOut(stay);
        if (REDUCED) grow = 1;
        put(plate, s, "--grow", grow.toFixed(4));
        if (win) {
          cushSize(win);
          cushSet(win, pressOf(INTRO) * (1 - grow), smooth(INTRO), win._rc * (1 - grow));
        }
      } else {
        if (!s.cush) s.cush = [].slice.call(pw.querySelectorAll(".cush"));
        for (var c = 0; c < s.cush.length; c++) { cushSize(s.cush[c]); cushSet(s.cush[c], pressOf(s.open), smooth(s.open)); }
      }
      if (plate) plate.classList.toggle("gone", exit >= 1 && !flow);
      if (!s.txts) s.txts = pw.querySelectorAll(".txt, .hero-txt");
      var on = isHero ? INTRO > 0.3 : (flow ? enter > 0.25 : enter > 0.6);
      if (s.on !== on) { s.on = on; for (var t = 0; t < s.txts.length; t++) s.txts[t].classList.toggle("on", on); }
    }
    if (sticky) {
      var show = pageY > H * 0.55;
      if (kontTop !== null && kontTop < H * 0.5) show = false;
      sticky.classList.toggle("show", show);
    }
    if (hdr) hdr.classList.toggle("scrolled", pageY > 12);
    if (moving) onScroll();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", function () {
    /* на телефоне смена только высоты - это адресная строка: раскладку не пересчитываем */
    if (W.innerWidth !== VW) { VW = W.innerWidth; VH = W.innerHeight; MOBILE = W.matchMedia("(max-width:760px)").matches; fitAll(); laneState(); cushResize(); secCushRefresh(); }
    else if (!TOUCH) { VH = W.innerHeight; }
    onScroll();
  });
  function runIntro(ts) {
    if (!introStart) introStart = ts;
    INTRO = clamp((ts - introStart) / 1500);
    update(ts);
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }

  /* ---------- Кадры каталожных секций: посадка при появлении ---------- */
  var secCush = [].slice.call(doc.querySelectorAll(".sec .cush"));
  secCush.forEach(function (c) { cushSize(c); cushSet(c, REDUCED ? 0 : 1, REDUCED ? 1 : 0); });
  function secCushRefresh() { secCush.forEach(function (c) { if (c._done) { cushSize(c); c._p = null; cushSet(c, 0, 1); } }); }
  function openCush(c) {
    if (c._done) return;
    c._done = true;
    var t0 = 0;
    function step(ts) {
      if (!t0) t0 = ts;
      var o = clamp((ts - t0) / 1400);
      cushSize(c);
      cushSet(c, pressOf(o), smooth(o));
      if (o < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Подгонка дисплейных заголовков: кегль вниз шагом 5%, пока не влезает ---------- */
  var fits = [].slice.call(doc.querySelectorAll(".fit"));
  function fitOne(el) {
    el.style.fontSize = "";
    var base = parseFloat(getComputedStyle(el).fontSize), size = base, guard = 0;
    while (el.scrollWidth > el.clientWidth + 1 && guard < 12) { size *= 0.95; el.style.fontSize = size.toFixed(1) + "px"; guard++; }
  }
  function fitAll() { fits.forEach(fitOne); }

  /* ---------- Видео-петли: src подставляется по видимости, снимается вне экрана ---------- */
  var loops = [].slice.call(doc.querySelectorAll("video.loop"));
  function playLoop(v) {
    var ph = v.closest(".cush");
    if (!v.getAttribute("src")) {
      v.addEventListener("playing", function () { if (ph) ph.classList.add("is-live"); });
      v.setAttribute("src", v.getAttribute("data-src") + (ASSET_V ? "?v=" + ASSET_V : ""));
    }
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  function stopLoop(v) {
    var ph = v.closest(".cush");
    if (ph) ph.classList.remove("is-live");
    v.pause(); v.removeAttribute("src"); v.load();
  }
  if ("IntersectionObserver" in W && !REDUCED && loops.length) {
    var conn = navigator.connection;
    var saveData = conn && (conn.saveData || /2g/.test(conn.effectiveType || ""));
    if (!saveData) {
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (x) { if (x.isIntersecting) playLoop(x.target); else if (x.target.getAttribute("src")) stopLoop(x.target); });
      }, { threshold: 0.45 });
      loops.forEach(function (v) { vio.observe(v); });
    }
  }

  /* ---------- Лента деталей: стрелки шагом в одну карточку ---------- */
  var lane = doc.getElementById("lane"), lPrev = doc.querySelector(".lane-btn.prev"), lNext = doc.querySelector(".lane-btn.next");
  function laneStep() {
    var card = lane && lane.firstElementChild; if (!card) return 320;
    var gap = parseFloat(getComputedStyle(lane).columnGap || getComputedStyle(lane).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }
  function laneState() {
    if (!lane || !lPrev || !lNext) return;
    var max = lane.scrollWidth - lane.clientWidth;
    var none = max <= 1;
    lPrev.hidden = none; lNext.hidden = none;
    lPrev.disabled = lane.scrollLeft <= 8;
    lNext.disabled = lane.scrollLeft >= max - 8;
  }
  if (lane) {
    lPrev.addEventListener("click", function () { lane.scrollBy({ left: -laneStep(), behavior: REDUCED ? "auto" : "smooth" }); });
    lNext.addEventListener("click", function () { lane.scrollBy({ left: laneStep(), behavior: REDUCED ? "auto" : "smooth" }); });
    lane.addEventListener("scroll", function () { requestAnimationFrame(laneState); }, { passive: true });
    laneState();
  }

  /* ---------- Бегущая лента героя: вторая копия для бесшовного цикла ---------- */
  var bandT = doc.getElementById("bandT");
  if (bandT) bandT.innerHTML += bandT.innerHTML;

  /* ---------- Язык: RU в разметке, EN здесь, KZ подгружается отдельным файлом ---------- */
  var I18N = { ru: {} };
  I18N.en = {
    "meta.title": "Custom furniture in Astana, turnkey - DivArt: sofas, beds, kitchens, wardrobes",
    "meta.desc": "Custom upholstered and cabinet furniture in Astana: sofas, beds, armchairs, ottomans, kitchens, wardrobes and walk-in closets made to your sizes. Own workshop for 6 years, showroom at Serkebayeva 4/1, 1000+ clients, 1-year warranty. Order furniture for the whole apartment and get a bed as a gift.",
    "nav.pk": "Turnkey", "nav.kr": "Beds", "nav.dv": "Sofas", "nav.all": "All furniture", "nav.op": "Details", "nav.sh": "Showroom", "nav.how": "How to order", "nav.kont": "Contacts",
    "tel.aria": "Call +7 702 561 68 83", "ig.aria": "DivArt on Instagram", "menu.aria": "Menu",
    "menu.note": "Astana, Serkebayeva 4/1, 4th floor · daily 09:00-19:00",
    "hero.cap": "Bed with base lighting, a project in Astana",
    "hero.kicker": "Astana · custom furniture · since 2020",
    "hero.t1": "Custom furniture in Astana", "hero.t2": "turnkey for the whole apartment",
    "hero.lead": "Sofas, beds, armchairs, kitchens and wardrobes made to your sizes. Own workshop<span class=\"m-hide\"> and showroom at Serkebayeva 4/1</span>, 1000+&nbsp;clients in 6&nbsp;years, 1-year warranty.",
    "hero.cta1": "Get a quote", "hero.cta2": "See the furniture", "hero.ig": "Finished work on Instagram →",
    "band.1": "Sofas", "band.2": "Beds", "band.3": "Armchairs", "band.4": "Ottomans", "band.5": "Kitchens", "band.6": "Wardrobes", "band.7": "Walk-in closets", "band.8": "Turnkey furniture",
    "pk.alt": "Turnkey living room: TV wall, shelves and a sofa in a client's apartment in Astana", "pk.cap": "Turnkey apartment: living room, Astana",
    "pk.kicker": "Turnkey furniture", "pk.h": "All the furniture for your apartment from one maker",
    "pk.lead": "We have made sofas and beds ourselves for 6 years; kitchens and wardrobes are built to the same project. One measurement, one contract, one team.",
    "pk.l1": "One style and matching fabrics in every room", "pk.l2": "One deadline and one party responsible for the whole order", "pk.l3": "Measurement, quote and fabric samples in the showroom",
    "pk.gift": "Gift: a master-bedroom bed when you order furniture for the whole apartment", "pk.btn": "Quote a turnkey order",
    "kr.kicker": "Beds", "kr.h": "Beds made to your size, up to 220x220",
    "kr.lead": "Soft headboard of any shape, lift-up mechanism with a storage box, base lighting with touch control, chenille or velour.",
    "kr.l1": "Lift-up mechanism and a storage box the full length of the bed", "kr.l2": "Perimeter lighting, switched on with a touch", "kr.l3": "Socket cut-outs, a shelf on the rail, a bench instead of the footboard",
    "kr.btn": "Get a bed price", "kr.alt": "Burgundy velour bed with a soft headboard against a wallpapered wall, project in Astana", "kr.cap": "Velour bed with a lift-up mechanism",
    "pl.k": "Project photo", "dv.plt": "DivArt sofa in velour",
    "dv.kicker": "Sofas", "dv.h": "Straight and corner sofas for your living room",
    "dv.lead": "Straight, corner, modular: sized to the wall, filling chosen for the seat, fabric from the samples in the showroom.",
    "dv.l1": "Frame and filling made in our own workshop", "dv.l2": "Choose the fabric by touch in the showroom: chenille, velour, linen weave", "dv.l3": "1-year warranty on the frame and mechanisms",
    "dv.btn": "Get a sofa price",
    "all.kicker": "All furniture", "all.h": "What we make for an apartment",
    "all.lead": "Upholstered furniture is our main line, 6 years of production. Cabinet furniture is a new line, built to the same project and the same fabrics.",
    "c.kr.alt": "White bed with a dark piping and base lighting, made by DivArt", "c.kr.t": "Beds", "c.kr.d": "Headboards of any shape, lift-up mechanism, lighting, sizes up to 220x220.", "c.more": "Learn more",
    "c.dv.plt": "Corner sofa", "c.dv.t": "Sofas", "c.dv.d": "Straight, corner and modular, sized to your wall.", "c.calc": "Get a quote",
    "c.ks.plt": "Armchair and ottoman", "c.ks.t": "Armchairs and ottomans", "c.ks.d": "In the fabric of your sofa or bed, so the room comes together as one set.",
    "c.ku.plt": "Custom kitchen", "c.ku.t": "Kitchens", "c.ku.d": "Sized to your kitchen, in one project with the upholstered furniture.",
    "c.sh.plt": "Walk-in closet", "c.sh.t": "Wardrobes and walk-in closets", "c.sh.d": "Built-in wardrobes, walk-in closets, hallway units.",
    "op.kicker": "Details", "op.h": "What can be built into your furniture",
    "op.lead": "Features we have already made for clients in Astana. All filmed on our projects, not taken from a catalogue.",
    "lane.prev": "Previous", "lane.next": "Next",
    "op.1.alt": "Bed lift-up mechanism with gas lifts, open base", "op.1.t": "Lift-up mechanism", "op.1.d": "Gas lifts raise the base with one hand.",
    "op.2.alt": "Bed with warm lighting around the base", "op.2.t": "Touch-controlled lighting", "op.2.d": "Perimeter light switches on with a touch.",
    "op.3.alt": "Metal shelf on the bed rail and socket cut-outs in the headboard", "op.3.t": "Shelf and sockets", "op.3.d": "Phone and book within reach, charging without cables on the floor.",
    "op.4.alt": "Storage box the full length of the bed base", "op.4.t": "Storage box", "op.4.d": "The full length of the bed: duvets, pillows, seasonal things.",
    "op.5.alt": "White bed with piping and a built-in bench", "op.5.t": "Bench instead of a footboard", "op.5.d": "A place to sit at the foot of the bed, contrasting piping.",
    "op.6.alt": "Turnkey bedroom: bed with lighting, mirror and lamp", "op.6.t": "Turnkey bedroom", "op.6.d": "Bed, lighting and textiles in one project.",
    "op.7.alt": "Assembling a bed base at the client's home", "op.7.t": "Assembly on site", "op.7.d": "We deliver and assemble ourselves, no third-party fitters.",
    "op.ig": "More work on Instagram",
    "dov.kicker": "Why DivArt", "dov.h": "Paid and delivered. Our own workshop, not a middleman",
    "dov.lead": "You pay the maker, not a reseller: workshop, showroom and contract in one place. Our clients include bloggers and actors of Kazakh cinema.",
    "dov.n1": "1000+", "dov.t1": "upholstered furniture clients in 6 years", "dov.n2": "Own workshop", "dov.t2": "frame, filling and upholstery made in Astana",
    "dov.n3": "Showroom", "dov.t3": "Serkebayeva 4/1: fabrics and finished furniture", "dov.n4": "1 year", "dov.t4": "warranty on all furniture",
    "dov.alt": "Soft bed headboard in light chenille, close-up", "dov.cap": "Chenille on the headboard, made by DivArt",
    "sh.plt": "DivArt showroom, Serkebayeva 4/1", "sh.kicker": "Showroom", "sh.h": "Sit on the sofa before you order",
    "sh.lead": "Serkebayeva 4/1, 4th floor. Fabric samples, finished furniture, measurement and quote on the spot. Daily 09:00-19:00.",
    "sh.btn1": "Book a showroom visit", "sh.btn2": "Route in 2GIS",
    "how.kicker": "How to order", "how.h": "Four steps to furniture in your apartment",
    "how.t1": "Request and measurement", "how.d1": "Write on WhatsApp or leave your number. We measure the apartment or calculate from your sizes.",
    "how.t2": "Design and quote", "how.d2": "We pick shapes, fabrics and filling in the showroom. The price is calculated per project.",
    "how.t3": "Production", "how.d3": "Frame, filling and upholstery in our own workshop in Astana.",
    "how.t4": "Delivery and assembly", "how.d4": "We deliver, assemble and take the packaging away. 1-year warranty.",
    "how.alt": "Grey chenille bed with a metal shelf on the rail and socket cut-outs", "how.cap": "Shelf on the rail and sockets in the headboard",
    "faq.kicker": "Questions", "faq.h": "What people ask before ordering",
    "faq.q1": "How much does a sofa or a bed cost?", "faq.a1": "The price depends on sizes, fabric, filling and mechanisms. Send the sizes and a photo of the room on WhatsApp: we will calculate it and invite you to the showroom to see the fabrics.",
    "faq.q2": "What is the turnkey gift?", "faq.a2": "If you order all the furniture for your apartment, we make the master-bedroom bed as a gift.",
    "faq.q3": "What is the warranty?", "faq.a3": "1 year on all furniture. It is our own workshop: if anything happens, you call us instead of looking for a new contractor.",
    "faq.q4": "Do you work outside Astana?", "faq.a4": "Yes, we make furniture for Astana and Karaganda.",
    "kont.kicker": "Contacts", "kont.h": "Tell us what your apartment needs", "kont.lead": "We reply right away: we will quote, invite you to the showroom or come to measure.",
    "kont.2gis": "2GIS", "kont.i1": "Astana, Serkebayeva 4/1, 4th floor - showroom and office", "kont.i2": "Daily 09:00-19:00. We work in Astana and Karaganda",
    "form.h": "Request a quote", "form.name": "Name", "form.name.ph": "How should we address you", "form.phone": "Phone", "form.err": "Enter a phone number of at least 10 digits.",
    "form.msg": "What is needed", "form.msg.ph": "Corner sofa 280 cm and a bed 180x200, new build", "form.btn": "Send via WhatsApp", "form.note": "The request opens in WhatsApp with a ready text. Samat replies.",
    "thanks.h": "Thank you!", "thanks.p": "The request has gone to WhatsApp. We will reply during working hours, 09:00-19:00.",
    "foot.tag": "Custom furniture in Astana. Sole proprietor Divano art", "sticky.call": "Call"
  };
  var RU = I18N.ru;
  var iEls = [].slice.call(doc.querySelectorAll("[data-i]"));
  var phEls = [].slice.call(doc.querySelectorAll("[data-i-ph]"));
  var ariaEls = [].slice.call(doc.querySelectorAll("[data-i-aria]"));
  var altEls = [].slice.call(doc.querySelectorAll("[data-i-alt]"));
  var metaDesc = doc.querySelector('meta[name="description"]');
  iEls.forEach(function (el) { var k = el.getAttribute("data-i"); if (RU[k] == null) RU[k] = el.innerHTML; });
  phEls.forEach(function (el) { RU[el.getAttribute("data-i-ph")] = el.getAttribute("placeholder"); });
  ariaEls.forEach(function (el) { RU[el.getAttribute("data-i-aria")] = el.getAttribute("aria-label"); });
  altEls.forEach(function (el) { RU[el.getAttribute("data-i-alt")] = el.getAttribute("alt"); });
  RU["meta.title"] = doc.title;
  RU["meta.desc"] = metaDesc ? metaDesc.getAttribute("content") : "";
  function t(key) { var d = I18N[LANG] || RU; return d[key] != null ? d[key] : RU[key]; }
  function applyLang(lang) {
    if (!I18N[lang]) lang = "ru";
    LANG = lang;
    iEls.forEach(function (el) { var v = t(el.getAttribute("data-i")); if (v != null) el.innerHTML = v; });
    phEls.forEach(function (el) { var v = t(el.getAttribute("data-i-ph")); if (v != null) el.setAttribute("placeholder", v); });
    ariaEls.forEach(function (el) { var v = t(el.getAttribute("data-i-aria")); if (v != null) el.setAttribute("aria-label", v); });
    altEls.forEach(function (el) { var v = t(el.getAttribute("data-i-alt")); if (v != null) el.setAttribute("alt", v); });
    doc.title = t("meta.title");
    if (metaDesc) metaDesc.setAttribute("content", t("meta.desc"));
    root.setAttribute("lang", lang);
    [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("divart-lang", lang); } catch (e) {}
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitAll); else fitAll();
  }
  function loadLang(lang, done) {
    if (I18N[lang] || lang !== "kk") return done();
    var s = doc.createElement("script");
    s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
    s.onload = function () {
      if (W.SITE_KK) {
        I18N.kk = W.SITE_KK;
        if (W.SITE_KK_WA) WA.kk = W.SITE_KK_WA;
        if (W.SITE_KK_FORM) FORM_LABELS.kk = W.SITE_KK_FORM;
      }
      done();
    };
    s.onerror = function () { done(); };
    doc.head.appendChild(s);
  }
  function setLang(lang) { loadLang(lang, function () { applyLang(lang); }); }
  [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  (function initLang() {
    /* ?lang= в адресе главнее сохранённого выбора: реклама ведёт на ?lang=ru */
    var forced = (location.search.match(/[?&]lang=(ru|kk|en)/) || [])[1];
    var saved = null; try { saved = localStorage.getItem("divart-lang"); } catch (e) {}
    var lang = forced || saved || "ru";
    if (lang !== "ru") setLang(lang);
  })();

  /* ---------- Проявление секций ---------- */
  var rv = [].slice.call(doc.querySelectorAll(".rv"));
  function reveal(el) { el.classList.add("in"); [].forEach.call(el.querySelectorAll(".cush"), openCush); }
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (!x.isIntersecting) return; reveal(x.target); io.unobserve(x.target); });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) reveal(el); }); }, 1500);
  } else { rv.forEach(function (el) { el.classList.add("in"); }); secCush.forEach(function (c) { cushSet(c, 0, 1); }); }

  /* ---------- Форма -> WhatsApp ---------- */
  var form = doc.getElementById("form"), thanks = doc.getElementById("thanks"), ferr = doc.getElementById("ferr");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.website && f.website.value) { form.hidden = true; if (thanks) thanks.hidden = false; return; }
      var name = f.name.value.trim(), phone = f.phone.value.trim();
      var badPhone = phone.replace(/\D/g, "").length < 10;
      f.phone.classList.toggle("bad", badPhone);
      f.phone.setAttribute("aria-invalid", badPhone ? "true" : "false");
      if (badPhone) { if (ferr) ferr.hidden = false; f.phone.focus(); return; }
      if (ferr) ferr.hidden = true;
      var L = FORM_LABELS[LANG] || FORM_LABELS.ru;
      var lines = [L.head];
      if (name) lines.push(L.name + ": " + name);
      lines.push(L.phone + ": " + phone);
      var msg = f.msg.value.trim();
      if (msg) lines.push(L.msg + ": " + msg);
      var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(lines.join("\n"));
      fireConv("form");
      W.open(url, "_blank", "noopener");
      if (thanks) { thanks.hidden = false; try { thanks.focus({ preventScroll: true }); } catch (err) {} }
      form.reset();
    });
  }

  var year = doc.getElementById("year"); if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Старт ---------- */
  function start() {
    cushResize(); fitAll(); laneState();
    if (location.hash.length > 1) {
      var id = location.hash.slice(1);
      goTo(id, true);
      setTimeout(function () { goTo(id, true); update(); }, 60);
      setTimeout(function () { goTo(id, true); update(); }, 500);
    }
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fitAll(); cushResize(); update(); });
  if (doc.readyState === "complete") start(); else W.addEventListener("load", start);
  cushResize(); update();
})();
