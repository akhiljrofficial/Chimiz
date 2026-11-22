/* ============================================================
   CHIMIZH — content, parallax & scroll animations (GSAP)
   ============================================================ */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------
     1. CONTENT
     ---------------------------------------------------------- */
  const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"];
  $("#cabinet-track").innerHTML = SHOWCASE.map((s, i) => `
    <figure class="niche" data-i="${i}">
      <div class="niche-arch">
        <img src="assets/img/cutouts/${s.img}.png" alt="Illustration: ${s.kind.toLowerCase()} in ${s.metal.toLowerCase()}" loading="lazy">
      </div>
      <div class="niche-shelf"></div>
      <figcaption class="plaque"><h3>${s.form}</h3><span>${roman[i]} · ${s.kind} · ${s.metal}</span></figcaption>
      <p class="niche-note">${s.note}</p>
    </figure>`).join("");
  $("#cab-n").textContent = String(SHOWCASE.length).padStart(2, "0");

  const tel = "tel:" + SITE.phone.replace(/\s/g, "");
  $$("[data-wa]").forEach((a) => { a.href = waLink(a.dataset.wa || `Hello ${SITE.name}!`); a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-tel]").forEach((a) => (a.href = tel));
  $("#pc-address").innerHTML = SITE.address.map((l) => `<div>${l}</div>`).join("");
  $("#pc-hours").innerHTML = SITE.hours.map(([d, t]) => `<tr><td>${d}</td><td>${t}</td></tr>`).join("");
  $("#pc-dir").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(SITE.mapQuery);
  $("#map").innerHTML = `<iframe title="Map to ${SITE.name}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&z=15&output=embed"></iframe>`;
  $("#ft-address").innerHTML = SITE.address.join("<br>");
  $("#ft-phone").textContent = SITE.phone;
  $("#ft-email").textContent = SITE.email;
  $("#ft-email").href = "mailto:" + SITE.email;
  $("#ft-ig").href = SITE.instagram;
  $("#year").textContent = new Date().getFullYear();
  $("#letter-date").textContent = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  if (new URLSearchParams(location.search).get("sent")) {
    const f = $(".letter");
    f.innerHTML = `<div class="letter-head"><span class="letter-brand">Chimizh</span><span class="letter-title">Thank you</span></div>
      <p class="sent-note">Your letter has reached us. We'll reply within two working days.</p>`;
  }

  /* ----------------------------------------------------------
     2. TORN PAPER EDGES
     ---------------------------------------------------------- */
  $$(".tear").forEach((el, k) => {
    let seed = 7 + k * 13;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    let d = "M0 50 L0 " + (20 + rnd() * 10);
    for (let x = 0; x <= 1200; x += 8 + rnd() * 18) d += ` L${x.toFixed(1)} ${(14 + rnd() * 22).toFixed(1)}`;
    d += " L1200 50 Z";
    el.innerHTML = `<svg viewBox="0 0 1200 50" preserveAspectRatio="none"><path d="${d}" fill="currentColor"/></svg>`;
  });

  /* ----------------------------------------------------------
     3. TEXT SPLITTING
     ---------------------------------------------------------- */
  function splitWords(el, wrapMask) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span");
            w.className = "w";
            w.textContent = part;
            if (wrapMask) {
              const m = document.createElement("span");
              m.className = "line-mask";
              m.appendChild(w);
              frag.appendChild(m);
            } else frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return $$(".w", el);
  }
  $$(".split").forEach((el) => splitWords(el, true));
  $$(".reveal-words, .split-words").forEach((el) => splitWords(el, false));

  /* ----------------------------------------------------------
     4. NAV, MENU, SMOOTH ANCHORS
     ---------------------------------------------------------- */
  const nav = $("#nav"), menu = $("#menu"), toggle = $("#nav-toggle");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const t = id === "#top" ? document.body : $(id);
      if (!t) return;
      e.preventDefault();
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      const y = id === "#top" ? 0 : t.getBoundingClientRect().top + scrollY;
      scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    })
  );
  let lastY = 0;
  const bar = $("#progress-bar");
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 60);
    nav.classList.toggle("is-hidden", y > lastY && y > 400 && !menu.classList.contains("open"));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  }, { passive: true });

  /* ----------------------------------------------------------
     5. CUSTOM CURSOR
     ---------------------------------------------------------- */
  if (finePointer && !reduce) {
    const cur = $(".cursor"), dot = $(".cursor-dot"), ring = $(".cursor-ring");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("pointerover", (e) => cur.classList.toggle("is-hover", !!e.target.closest("a, button, .niche, .ticket")));
  } else {
    $(".cursor").remove();
  }

  /* ----------------------------------------------------------
     6. HERO MOUSE-DEPTH PARALLAX + DUST
     ---------------------------------------------------------- */
  const layers = $$(".hero [data-depth]");
  const m = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener("pointermove", (e) => {
    m.tx = e.clientX / innerWidth - 0.5;
    m.ty = e.clientY / innerHeight - 0.5;
  });
  // gentle drift on touch devices
  if (!finePointer && !reduce && window.DeviceOrientationEvent) {
    addEventListener("deviceorientation", (e) => {
      if (e.gamma == null) return;
      m.tx = Math.max(-0.5, Math.min(0.5, e.gamma / 60));
      m.ty = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 60));
    });
  }
  if (!reduce) {
    (function loop() {
      m.x += (m.tx - m.x) * 0.06;
      m.y += (m.ty - m.y) * 0.06;
      layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth);
        l.style.transform = `translate3d(${m.x * d * 40}px, ${m.y * d * 30}px, 0)`;
      });
      requestAnimationFrame(loop);
    })();
  }

  const dust = $("#dust");
  if (dust && !reduce) {
    const g = dust.getContext("2d");
    let W, H, motes;
    const size = () => {
      W = dust.width = dust.clientWidth * Math.min(devicePixelRatio, 2);
      H = dust.height = dust.clientHeight * Math.min(devicePixelRatio, 2);
      motes = Array.from({ length: Math.round((W * H) / 26000) }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4, s: Math.random() * 0.3 + 0.08,
        a: Math.random() * Math.PI * 2, o: Math.random() * 0.5 + 0.2,
      }));
    };
    size();
    addEventListener("resize", size);
    let heroOn = true;
    new IntersectionObserver(([en]) => (heroOn = en.isIntersecting)).observe(dust);
    (function draw() {
      requestAnimationFrame(draw);
      if (!heroOn) return;
      g.clearRect(0, 0, W, H);
      motes.forEach((p) => {
        p.a += 0.01;
        p.y -= p.s;
        p.x += Math.sin(p.a) * 0.3 + m.x * 0.6;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        g.beginPath();
        g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        g.fillStyle = `rgba(190, 140, 60, ${p.o * (0.6 + 0.4 * Math.sin(p.a * 2))})`;
        g.fill();
      });
    })();
  }

  /* ----------------------------------------------------------
     7. PRELOADER — name in the centre → curtain lifts → HERO INTRO
     ---------------------------------------------------------- */
  const loader = $("#loader");
  const html = document.documentElement;

  // remember where the reader was, so a refresh returns them there
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
  };
  addEventListener("pagehide", () => {
    if (!html.classList.contains("is-loading")) store.set("chimizh-y", String(Math.round(scrollY)));
  });
  const savedY = parseInt(store.get("chimizh-y") || "0", 10) || 0;
  const returning = store.get("chimizh-seen") === "1";
  store.set("chimizh-seen", "1");

  // block every way of scrolling while the loader is up
  const block = (e) => { if (html.classList.contains("is-loading")) e.preventDefault(); };
  const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
  addEventListener("wheel", block, { passive: false });
  addEventListener("touchmove", block, { passive: false });
  addEventListener("keydown", (e) => { if (keys.includes(e.key)) block(e); });

  function unlock() {
    html.classList.remove("is-loading");
    loader.remove();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    if (savedY > 0) scrollTo({ top: savedY, behavior: "instant" });
  }

  function heroIntro() {
    if (!hasGSAP || reduce || savedY > innerHeight * 0.5) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".hero-title span", { yPercent: 110, rotateX: -80, opacity: 0, duration: 1.6, stagger: 0.07 }, 0)
      .from(".f-near-l", { x: -300, rotate: -25, opacity: 0, duration: 1.8 }, 0.3)
      .from(".f-near-r", { x: 300, rotate: 25, opacity: 0, duration: 1.8 }, 0.4)
      .from(".f-far-l, .f-far-r", { y: 120, opacity: 0, duration: 2, stagger: 0.15 }, 0.5)
      .from(".hero-top > *, .hero-bottom > *, .scroll-cue", { y: 30, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.8)
      .from(".hero .corner", { scale: 0, opacity: 0, duration: 1, stagger: 0.08 }, 0.6);
  }

  if (reduce || !hasGSAP) {
    html.classList.remove("is-loading");
    loader.remove();
    if (savedY > 0) scrollTo(0, savedY);
  } else {
    const num = $("#loader-num"), bar = $("#loader-bar");
    const counter = { v: 0 };
    let loaded = document.readyState === "complete";
    addEventListener("load", () => (loaded = true));
    const fast = returning ? 0.5 : 1;

    const enter = gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".loader .corner", { scale: 0, opacity: 0, duration: 1 * fast, stagger: 0.08 }, 0)
      .from(".loader-rule", { scaleX: 0, opacity: 0, duration: 1.2 * fast, stagger: 0.15 }, 0.1)
      .from("#loader-name span", { yPercent: 110, duration: 1.1 * fast, stagger: 0.06 }, 0.2)
      .from(".loader-script", { opacity: 0, y: 14, duration: 1 * fast }, 0.6 * fast)
      .from(".loader-vessels img", { opacity: 0, y: 20, duration: 1 * fast, stagger: 0.1 }, 0.4 * fast)
      .from(".loader-progress", { opacity: 0, duration: 0.8 * fast }, 0.7 * fast);

    gsap.to(counter, {
      v: 100,
      duration: returning ? 1 : 2.4,
      delay: returning ? 0.2 : 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        num.textContent = Math.round(counter.v) + "%";
        bar.style.transform = `scaleX(${counter.v / 100})`;
      },
      onComplete: function finish() {
        if (!loaded) return setTimeout(finish, 100);
        enter.progress(1);
        gsap.timeline({ onComplete: unlock })
          .to(".loader-center", { y: -30, opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.2")
          .to(".loader .corner, .loader-frame", { opacity: 0, duration: 0.4 }, "<")
          .to(loader, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.1")
          .add(heroIntro, "-=0.7");
      },
    });
  }

  if (!hasGSAP || reduce) return;

  /* ----------------------------------------------------------
     8. SCROLL ANIMATIONS
     ---------------------------------------------------------- */

  // HERO — pinned; things fly past the camera while the vessel turns
  gsap.timeline({
    scrollTrigger: {
      trigger: ".hero", start: "top top", end: "+=90%", scrub: 1, pin: true,
      onUpdate: (st) => { if (window.Vessel3D) Vessel3D.scroll = st.progress; },
    },
  })
    .to(".hero-title span", { yPercent: (i) => (i % 2 ? -1 : 1) * (60 + i * 12), opacity: 0, rotateX: 60, stagger: 0.02 }, 0)
    .to(".f-near-l", { scale: 2.2, x: -260, y: 200, rotate: -18, opacity: 0 }, 0)
    .to(".f-near-r", { scale: 2.2, x: 260, y: 200, rotate: 18, opacity: 0 }, 0)
    .to(".f-far-l", { y: -160, x: -60, scale: 1.4 }, 0)
    .to(".f-far-r", { y: -180, x: 60, scale: 1.4 }, 0)
    .to(".hero-bottom, .hero-top, .scroll-cue", { opacity: 0, y: -40 }, 0)
    .to(".hero-rays", { scale: 1.5, opacity: 0.4 }, 0)
    .to(".hero-vessel", { yPercent: -8 }, 0);

  // TICKERS
  $$(".ticker-track").forEach((t) => {
    const dir = +t.dataset.dir;
    gsap.fromTo(t, { xPercent: dir > 0 ? -30 : 0 }, {
      xPercent: dir > 0 ? 0 : -30, ease: "none",
      scrollTrigger: { trigger: ".tickers", start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // HEADINGS — words rise out of a mask
  $$(".split").forEach((h) => {
    gsap.from($$(".w", h), {
      yPercent: 110, rotate: 4, duration: 1.2, ease: "expo.out", stagger: 0.06,
      scrollTrigger: { trigger: h, start: "top 85%" },
    });
  });

  // STORY — words ink in as you read
  $$(".reveal-words").forEach((p) => {
    gsap.to($$(".w", p), {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 45%", scrub: true },
    });
  });
  // generic depth parallax
  $$("[data-speed]").forEach((el) => {
    const s = parseFloat(el.dataset.speed);
    gsap.fromTo(el, { y: (s - 1) * 260 }, {
      y: (1 - s) * 260, ease: "none",
      scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true },
    });
  });
  gsap.fromTo(".oval-frame", { rotateY: -25, rotateX: 8 }, {
    rotateY: 20, rotateX: -6, ease: "none",
    scrollTrigger: { trigger: ".story", start: "top bottom", end: "bottom top", scrub: true },
  });

  // CABINET — pinned horizontal coverflow
  const track = $("#cabinet-track");
  const niches = $$(".niche", track);
  const counter = $("#cab-i");
  function coverflow() {
    const cx = innerWidth / 2;
    let best = 0, bestD = Infinity;
    niches.forEach((n, i) => {
      const r = n.getBoundingClientRect();
      const d = (r.left + r.width / 2 - cx) / innerWidth; // -1..1-ish
      const ad = Math.min(Math.abs(d), 1);
      if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
      gsap.set(n, {
        rotateY: gsap.utils.clamp(-45, 45, d * -55),
        z: -ad * 260,
        opacity: 1 - ad * 0.55,
        transformPerspective: 1400,
      });
    });
    counter.textContent = String(best + 1).padStart(2, "0");
  }
  const dist = () => track.scrollWidth - innerWidth;
  gsap.to(track, {
    x: () => -dist(), ease: "none",
    scrollTrigger: {
      trigger: ".cabinet", start: "top top", end: () => "+=" + dist(),
      scrub: 1, pin: true, invalidateOnRefresh: true,
      onUpdate: coverflow, onRefresh: coverflow,
    },
  });
  coverflow();

  // MATERIALS — giant words slide; brass fill sweeps across
  $$(".mat-row").forEach((row) => {
    const dir = +row.dataset.dir;
    const word = $(".mat-word", row);
    gsap.fromTo(word, { x: () => dir * innerWidth * 0.12 }, {
      x: () => -dir * innerWidth * 0.12, ease: "none",
      scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
    });
    gsap.to($(".fill", row), {
      clipPath: "inset(0 0% 0 0)", ease: "none",
      scrollTrigger: { trigger: row, start: "top 85%", end: "center 45%", scrub: true },
    });
    gsap.fromTo($("img", row), { y: 70, rotate: dir * -8 }, {
      y: -50, rotate: dir * 6, ease: "none",
      scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.from($("p", row), {
      opacity: 0, x: dir * -40, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 70%" },
    });
  });

  // SERVICES — tickets flip in, tilt on hover
  gsap.from(".ticket", {
    rotateY: -95, y: 80, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.14,
    transformOrigin: "left center",
    scrollTrigger: { trigger: ".tickets", start: "top 80%" },
  });
  if (finePointer) {
    $$(".ticket").forEach((t) => {
      t.addEventListener("pointermove", (e) => {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(t, { rotateY: px * 18, rotateX: -py * 14, y: -8, duration: 0.5, ease: "power2.out", transformPerspective: 900 });
      });
      t.addEventListener("pointerleave", () => gsap.to(t, { rotateY: 0, rotateX: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }));
    });
  }

  // QUOTE — wax seal stamps down, words ink in
  gsap.timeline({ scrollTrigger: { trigger: ".quote", start: "top 65%" } })
    .from("#seal", { scale: 3.2, rotate: -70, opacity: 0, duration: 0.7, ease: "power4.in" })
    .to(".quote", { x: 6, duration: 0.05, repeat: 5, yoyo: true, ease: "none" })
    .set(".quote", { x: 0 });
  gsap.to(".quote blockquote .w", {
    opacity: 1, stagger: 0.1, ease: "none",
    scrollTrigger: { trigger: ".quote blockquote", start: "top 80%", end: "bottom 50%", scrub: true },
  });

  // SELL — letter slides in like it's being handed over
  gsap.fromTo(".letter", { y: 160, rotate: 8, opacity: 0.3 }, {
    y: 0, rotate: 1.2, opacity: 1, ease: "power2.out",
    scrollTrigger: { trigger: ".sell", start: "top 85%", end: "center 60%", scrub: 1 },
  });
  gsap.from(".stamp-mark", {
    scale: 2.6, opacity: 0, rotate: -50, duration: 0.6, ease: "back.out(2)",
    scrollTrigger: { trigger: ".letter-foot", start: "top 85%" },
  });

  // VISIT — postcard tilts up out of the page
  gsap.fromTo("#postcard", { rotateX: 38, y: 140, rotateZ: -4, opacity: 0.4 }, {
    rotateX: 0, y: 0, rotateZ: 0, opacity: 1, ease: "power2.out",
    scrollTrigger: { trigger: ".visit", start: "top 85%", end: "center 65%", scrub: 1 },
  });

  // FOOTER — big outlined word rises
  gsap.from(".footer-big", {
    yPercent: 40, opacity: 0, letterSpacing: "0.3em", ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "top 30%", scrub: true },
  });

  // recalc once fonts settle
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
