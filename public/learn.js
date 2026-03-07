// learn.js — Tutorial page interactivity
(function () {
  'use strict';

  // ── Lesson progress tracking ─────────────────
  const STORAGE_KEY = 'gracepl_learn_progress';
  const TOTAL_LESSONS = document.querySelectorAll('.learn-lesson').length;

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  }
  function saveProgress(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  function updateProgressBar(progress) {
    const done = Object.values(progress).filter(Boolean).length;
    const pct = TOTAL_LESSONS ? Math.round((done / TOTAL_LESSONS) * 100) : 0;
    const fill = document.getElementById('learn-progress');
    const text = document.getElementById('progress-text');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = done + ' / ' + TOTAL_LESSONS + ' bài đã xem';
  }

  function applyProgress(progress) {
    document.querySelectorAll('.learn-lesson').forEach(function (section) {
      const id = section.dataset.lesson;
      const btn = section.querySelector('.lesson-complete-btn');
      if (progress[id]) {
        section.classList.add('done');
        if (btn) btn.classList.add('done');
      } else {
        section.classList.remove('done');
        if (btn) btn.classList.remove('done');
      }
    });
    updateProgressBar(progress);
  }

  // Init lesson complete buttons
  document.querySelectorAll('.lesson-complete-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const section = btn.closest('.learn-lesson');
      const id = section && section.dataset.lesson;
      if (!id) return;
      const progress = loadProgress();
      progress[id] = !progress[id];
      saveProgress(progress);
      applyProgress(progress);
    });
  });

  applyProgress(loadProgress());

  // ── Sidebar search ────────────────────────────
  const searchInput = document.getElementById('learn-search');
  const navLinks = document.querySelectorAll('.nav-group a');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const q = this.value.toLowerCase().trim();
      navLinks.forEach(function (a) {
        const match = !q || a.textContent.toLowerCase().includes(q);
        a.style.display = match ? '' : 'none';
      });
      // Show/hide group titles when all children hidden
      document.querySelectorAll('.nav-group').forEach(function (g) {
        const visible = Array.from(g.querySelectorAll('a')).some(function (a) { return a.style.display !== 'none'; });
        g.style.display = visible ? '' : 'none';
      });
    });

    // Keyboard shortcut: / focuses search
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape') searchInput.blur();
    });
  }

  // ── Sidebar active link on scroll ────────────
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (a) { a.classList.remove('active'); });
        const id = entry.target.id;
        const active = document.querySelector('.nav-group a[href="#' + id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px' });

  document.querySelectorAll('.learn-lesson').forEach(function (s) { observer.observe(s); });

  // ── Copy buttons ─────────────────────────────
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const pre = btn.closest('.code-block').querySelector('pre');
      if (!pre) return;
      navigator.clipboard.writeText(pre.innerText).then(function () {
        const orig = btn.textContent;
        btn.textContent = '✅ Đã sao chép';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = orig; btn.classList.remove('copied'); }, 1800);
      });
    });
  });

  // ── Mobile hamburger ─────────────────────────
  const hamburger = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', function () { sidebar.classList.toggle('open'); });
    document.addEventListener('click', function (e) {
      if (!sidebar.contains(e.target) && e.target !== hamburger) sidebar.classList.remove('open');
    });
  }

})();
