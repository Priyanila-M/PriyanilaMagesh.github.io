// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Generate a gentle flow-cytometry-style scatter plot in the hero SVG
(function () {
  const dotsGroup = document.querySelector(".hero__dots");
  if (!dotsGroup) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // two loosely separated populations, like a CD4/CD8 scatter
  const populations = [
    { cx: 220, cy: 380, spreadX: 110, spreadY: 100, count: 70, color: "var(--teal)", opacity: 0.55 },
    { cx: 400, cy: 200, spreadX: 90, spreadY: 90, count: 55, color: "var(--coral)", opacity: 0.45 },
  ];

  const dots = [];

  populations.forEach((pop) => {
    for (let i = 0; i < pop.count; i++) {
      // box-muller-ish gaussian-feeling scatter via averaged randoms
      const rx = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      const ry = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      const x = pop.cx + rx * pop.spreadX;
      const y = pop.cy + ry * pop.spreadY;
      const r = 2 + Math.random() * 2.4;

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x.toFixed(1));
      circle.setAttribute("cy", y.toFixed(1));
      circle.setAttribute("r", r.toFixed(1));
      circle.setAttribute("fill", pop.color);
      circle.setAttribute("opacity", pop.opacity.toFixed(2));
      dotsGroup.appendChild(circle);

      if (!prefersReducedMotion) {
        dots.push({ el: circle, baseY: y, phase: Math.random() * Math.PI * 2, speed: 0.4 + Math.random() * 0.5 });
      }
    }
  });

  if (prefersReducedMotion || dots.length === 0) return;

  // gentle ambient drift, no dependencies
  let start = null;
  function animate(ts) {
    if (start === null) start = ts;
    const t = (ts - start) / 1000;
    dots.forEach((d) => {
      const dy = Math.sin(t * d.speed + d.phase) * 4;
      d.el.setAttribute("cy", (d.baseY + dy).toFixed(1));
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
