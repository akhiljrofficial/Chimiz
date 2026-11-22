/* ============================================================
   CHIMIZH — 3D brass kalasham (Three.js r128)
   A lathe-turned vessel with engraved bands and warm reflections.
   Exposes window.Vessel3D = { scroll: 0..1 } for main.js to drive.
   ============================================================ */
(function () {
  const canvas = document.getElementById("vessel-canvas");
  if (!canvas || !window.THREE) return fallback();

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    return fallback();
  }

  function fallback() {
    document.documentElement.classList.add("no-webgl");
    window.Vessel3D = { scroll: 0 };
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.5, 11);

  /* ---- warm studio environment, painted on a canvas ---- */
  function makeEnv() {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 512;
    const g = c.getContext("2d");
    const sky = g.createLinearGradient(0, 0, 0, 512);
    sky.addColorStop(0, "#3a2614");
    sky.addColorStop(0.42, "#f4dfb4");
    sky.addColorStop(0.55, "#8a5f2e");
    sky.addColorStop(1, "#140c06");
    g.fillStyle = sky; g.fillRect(0, 0, 1024, 512);
    // soft-box windows for highlights
    const box = (x, y, w, h, a) => {
      const rg = g.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h) / 1.3);
      rg.addColorStop(0, `rgba(255,246,220,${a})`);
      rg.addColorStop(1, "rgba(255,246,220,0)");
      g.fillStyle = rg; g.fillRect(x - w, y - h, w * 3, h * 3);
    };
    box(120, 120, 160, 220, 1);
    box(620, 150, 120, 160, 0.85);
    box(860, 200, 60, 200, 0.6);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    const pm = new THREE.PMREMGenerator(renderer);
    const env = pm.fromEquirectangular(tex).texture;
    tex.dispose(); pm.dispose();
    return env;
  }
  scene.environment = makeEnv();

  /* ---- engraving bump map: decorative bands ---- */
  function makeBump() {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 1024;
    const g = c.getContext("2d");
    g.fillStyle = "#808080"; g.fillRect(0, 0, 1024, 1024);
    g.strokeStyle = "#2a2a2a"; g.fillStyle = "#2a2a2a";
    const ring = (y, w) => { g.lineWidth = w; g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); };
    // v runs bottom→top of the profile. canvas y = (1 - v) * 1024
    const band = (v0, v1, kind) => {
      const y0 = (1 - v1) * 1024, y1 = (1 - v0) * 1024, h = y1 - y0;
      ring(y0, 3); ring(y1, 3);
      ring(y0 + 6, 1.5); ring(y1 - 6, 1.5);
      const n = 32;
      for (let i = 0; i < n; i++) {
        const x = (i / n) * 1024, w = 1024 / n;
        g.lineWidth = 2;
        if (kind === "petal") {
          g.beginPath();
          g.moveTo(x, y1 - 8);
          g.quadraticCurveTo(x + w / 2, y0 - h * 0.2, x + w, y1 - 8);
          g.stroke();
          g.beginPath(); g.moveTo(x + w / 2, y1 - 10); g.lineTo(x + w / 2, y0 + h * 0.35); g.stroke();
        } else if (kind === "zig") {
          g.beginPath(); g.moveTo(x, y0 + 10); g.lineTo(x + w / 2, y1 - 10); g.lineTo(x + w, y0 + 10); g.stroke();
        } else {
          g.beginPath(); g.arc(x + w / 2, (y0 + y1) / 2, h * 0.22, 0, Math.PI * 2); g.stroke();
          g.beginPath(); g.arc(x + w / 2, (y0 + y1) / 2, 2.5, 0, Math.PI * 2); g.fill();
        }
      }
    };
    band(0.14, 0.24, "petal");
    band(0.43, 0.49, "zig");
    band(0.62, 0.67, "dots");
    band(0.86, 0.9, "zig");
    ring((1 - 0.3) * 1024, 2);
    ring((1 - 0.56) * 1024, 2);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping;
    return t;
  }

  /* ---- the vessel profile (radius, height) ---- */
  const P = [
    [0.0, 0.0], [0.62, 0.0], [0.7, 0.06], [0.66, 0.16], [0.5, 0.26], [0.47, 0.34],
    [0.62, 0.46], [0.98, 0.72], [1.24, 1.05], [1.32, 1.35], [1.26, 1.65], [1.02, 1.95],
    [0.66, 2.2], [0.44, 2.36], [0.4, 2.46], [0.46, 2.52], [0.4, 2.6], [0.37, 2.82],
    [0.46, 3.05], [0.66, 3.25], [0.8, 3.36], [0.82, 3.42], [0.74, 3.43], [0.6, 3.34],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const curve = new THREE.SplineCurve(P);
  const pts = curve.getPoints(220);
  const geo = new THREE.LatheGeometry(pts, 160);
  geo.translate(0, -1.72, 0);

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#d1a04a"),
    metalness: 1,
    roughness: 0.3,
    bumpMap: makeBump(),
    bumpScale: 0.018,
    side: THREE.DoubleSide,
    envMapIntensity: 1.25,
  });
  const vessel = new THREE.Mesh(geo, mat);

  // a coconut-and-leaf style finial knob on top (kalasham)
  const knob = new THREE.Mesh(
    new THREE.LatheGeometry(
      new THREE.SplineCurve([
        [0, 0], [0.5, 0.02], [0.56, 0.12], [0.42, 0.3], [0.5, 0.5], [0.36, 0.78], [0.12, 1.05], [0, 1.15],
      ].map(([x, y]) => new THREE.Vector2(x, y))).getPoints(80),
      96
    ),
    mat
  );
  knob.position.y = 3.34 - 1.72;

  const group = new THREE.Group();
  group.add(vessel, knob);
  group.rotation.z = 0.04;
  scene.add(group);

  /* ---- lights (env does most of the work) ---- */
  const key = new THREE.DirectionalLight(0xffe2b0, 1.4);
  key.position.set(-4, 6, 6);
  const rim = new THREE.DirectionalLight(0xff9a4a, 1.6);
  rim.position.set(5, 2, -4);
  scene.add(key, rim, new THREE.AmbientLight(0x5a3a1a, 0.4));

  /* ---- sizing ---- */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the vessel ~70% of height on desktop, smaller on narrow screens
    camera.fov = w / h < 0.8 ? 38 : 30;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---- interaction ---- */
  const api = (window.Vessel3D = { scroll: 0 });
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(canvas);

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clock = new THREE.Clock();
  let spin = 0;

  // entrance: rise up from below
  let intro = 0;

  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    intro = Math.min(1, intro + dt * 0.6);
    const e = 1 - Math.pow(1 - intro, 3);

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    const s = api.scroll;
    spin += dt * (reduce ? 0 : 0.35 + s * 2.2);
    group.rotation.y = spin + mouse.x * 0.5;
    group.rotation.x = mouse.y * 0.18 + s * 0.35;
    group.position.y = (1 - e) * -4 + Math.sin(t * 0.9) * 0.08 - s * 0.3;
    const sc = 1 + s * 0.18;
    group.scale.setScalar(sc * (0.6 + 0.4 * e));
    camera.position.x = mouse.x * -0.4;
    camera.lookAt(0, 0.2, 0);
    renderer.render(scene, camera);
  }
  tick();
})();
