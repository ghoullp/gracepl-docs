/* GracePL Docs — app.js */
(function () {
  "use strict";

  /* ──────────────────────────────────────────────
     1. SIDEBAR ACTIVE LINK ON SCROLL
  ────────────────────────────────────────────── */
  const sections = document.querySelectorAll(".doc-section[id]");
  const navLinks = document.querySelectorAll(".nav-group a[href^='#']");

  function setActive(id) {
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );

  sections.forEach((s) => io.observe(s));

  /* ──────────────────────────────────────────────
     2. SMOOTH SCROLL for sidebar links
  ────────────────────────────────────────────── */
  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 72; // header height + a bit
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        closeSidebar();
      }
    });
  });

  /* ──────────────────────────────────────────────
     3. SEARCH / FILTER
  ────────────────────────────────────────────── */
  const searchInput = document.getElementById("doc-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      navLinks.forEach((a) => {
        const txt = a.textContent.toLowerCase();
        const grp = a.closest(".nav-group");
        a.style.display = txt.includes(q) || !q ? "" : "none";
        // show/hide entire group
        if (grp) {
          const visible = [...grp.querySelectorAll("a")].some(
            (l) => l.style.display !== "none"
          );
          grp.style.display = visible ? "" : "none";
        }
      });
    });
  }

  /* ──────────────────────────────────────────────
     4. COPY-TO-CLIPBOARD for code blocks
  ────────────────────────────────────────────── */
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const block = btn.closest(".code-block").querySelector("pre code");
      if (!block) return;
      navigator.clipboard.writeText(block.innerText).then(() => {
        btn.textContent = "✓ Đã chép";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "Sao chép";
          btn.classList.remove("copied");
        }, 2000);
      });
    });
  });

  /* ──────────────────────────────────────────────
     5. TABS
  ────────────────────────────────────────────── */
  document.querySelectorAll(".tabs").forEach((tabs) => {
    const btns = tabs.querySelectorAll(".tab-btn");
    const panes = tabs.querySelectorAll(".tab-pane");

    btns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        panes.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        panes[i].classList.add("active");
      });
    });

    // activate first tab
    if (btns.length) {
      btns[0].classList.add("active");
      panes[0].classList.add("active");
    }
  });

  /* ──────────────────────────────────────────────
     6. HAMBURGER MENU (mobile)
  ────────────────────────────────────────────── */
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:89;display:none";
  document.body.appendChild(overlay);

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.style.display = "block";
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.style.display = "none";
  }

  if (hamburger) hamburger.addEventListener("click", openSidebar);
  overlay.addEventListener("click", closeSidebar);

  /* ──────────────────────────────────────────────
     7. HIGHLIGHT.JS INIT
  ────────────────────────────────────────────── */
  if (typeof hljs !== "undefined") {
    // Register GracePL as PHP variant
    hljs.configure({ ignoreUnescapedHTML: true });
    document.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });
  }

  /* ──────────────────────────────────────────────
     8. KEYBOARD SHORTCUT: / to focus search
  ────────────────────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      searchInput && searchInput.focus();
    }
    if (e.key === "Escape") {
      searchInput && searchInput.blur();
      closeSidebar();
    }
  });
})();
