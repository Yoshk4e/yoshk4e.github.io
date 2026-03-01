const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});
(function tick() {
  cursor.style.left = mx + "px";
  cursor.style.top = my + "px";
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(tick);
})();

const clockEl = document.getElementById("sysTime");
function updateClock() {
  if (!clockEl) return;
  const d = new Date();
  clockEl.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
updateClock();
setInterval(updateClock, 1000);

const nav = document.querySelector("nav");
window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  },
  { passive: true },
);

const revObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.08 },
);
document.querySelectorAll(".reveal").forEach((el) => revObs.observe(el));

const skillObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll(".sk-row").forEach((row, i) => {
        const fill = row.querySelector(".sk-fill");
        const pctEl = row.querySelector(".sk-p");
        const target = parseInt(fill?.dataset.w || 0);
        setTimeout(() => {
          if (fill) fill.style.width = target + "%";
          if (pctEl) {
            let current = 0;
            const step = () => {
              current = Math.min(current + 2, target);
              pctEl.textContent = current;
              if (current < target) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        }, i * 80);
      });
      skillObs.unobserve(e.target);
    });
  },
  { threshold: 0.2 },
);
document.querySelectorAll("#skills .panel").forEach((p) => skillObs.observe(p));

const phrases = [
  "> just learning_",
  "> writing rust_",
  "> reading binaries_",
  "> figuring it out_",
];
let pi = 0,
  ci = 0,
  del = false,
  wait = 0;
const tEl = document.getElementById("typeLine");
function type() {
  if (!tEl) return;
  if (wait-- > 0) {
    setTimeout(type, 55);
    return;
  }
  const t = phrases[pi];
  if (!del) {
    tEl.textContent = t.slice(0, ++ci);
    if (ci === t.length) {
      del = true;
      wait = 38;
    }
    setTimeout(type, 58);
  } else {
    tEl.textContent = t.slice(0, --ci);
    if (ci === 0) {
      del = false;
      pi = (pi + 1) % phrases.length;
      wait = 10;
    }
    setTimeout(type, 32);
  }
}
setTimeout(type, 1600);

document.querySelectorAll(".glass-card").forEach((card) => {
  const glow = card.querySelector(".card-glow");
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    if (glow) {
      glow.style.left = x + "px";
      glow.style.top = y + "px";
    }
    const cx = r.width / 2,
      cy = r.height / 2;
    const rx = ((y - cy) / cy) * 4,
      ry = ((x - cx) / cx) * -4;
    card.style.transform = `translateY(-8px) scale(1.015) perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll("section[id]").forEach((s) =>
  new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        document.querySelectorAll(".nav-links a").forEach((l) => {
          const active = l.getAttribute("href") === "#" + e.target.id;
          l.style.color = active ? "var(--text)" : "";
        });
      });
    },
    { rootMargin: "-50% 0px -50% 0px" },
  ).observe(s),
);

const form = document.getElementById("contactForm");
const btn = document.getElementById("submitBtn");
if (form)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    btn.textContent = "sending...";
    btn.disabled = true;
    const formData = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        btn.textContent = "sent ✓";
        btn.style.color = "var(--bg)";
        btn.style.background = "#4ade80";
        btn.style.borderColor = "#4ade80";
        form.reset();
        setTimeout(() => {
          btn.textContent = "send";
          btn.style.color = btn.style.background = btn.style.borderColor = "";
          btn.disabled = false;
        }, 3000);
      } else {
        btn.textContent = "error ✗";
        setTimeout(() => {
          btn.textContent = "send";
          btn.disabled = false;
        }, 2000);
      }
    } catch (error) {
      btn.textContent = "error ✗";
      setTimeout(() => {
        btn.textContent = "send";
        btn.disabled = false;
      }, 2000);
    }
  });
