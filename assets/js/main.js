(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* theme */
  var meta = $('meta[name="theme-color"]');
  function applyMeta() { if (meta) meta.setAttribute('content', root.getAttribute('data-theme') === 'dark' ? '#0f172a' : '#f8fafc'); }
  applyMeta();
  $('#theme').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ws-theme', next); } catch (e) {}
    applyMeta();
  });

  /* mobile menu */
  var menu = $('#menu'), burger = $('#burger');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.innerHTML = '<svg class="icon"><use href="#i-' + (open ? 'close' : 'menu') + '"/></svg>';
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* scroll: progress, nav state, back-to-top */
  var bar = $('#progress'), nav = $('#nav'), topBtn = $('#top');
  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 20);
    topBtn.classList.toggle('show', h.scrollTop > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* scroll spy */
  var links = $$('.menu a[href^="#"]');
  if (hasIO) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* reveal on scroll */
  var items = $$('.reveal');
  if (hasIO) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* typed roles */
  var typed = $('#typed');
  var words = ['scalable React applications', 'robust Node.js APIs', 'reusable component systems', 'AI-assisted workflows', 'products people enjoy using'];
  if (typed && !reduce) {
    var wi = 0, ci = words[0].length, del = true;
    (function loop() {
      var w = words[wi], delay = del ? 38 : 70;
      if (del) { ci--; } else { ci++; }
      typed.textContent = w.slice(0, ci);
      if (!del && ci === w.length) { del = true; delay = 1800; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; delay = 350; }
      setTimeout(loop, delay);
    })();
  }

  /* marquee */
  var tech = ['React.js', 'TypeScript', 'Node.js', 'Next.js', 'Express.js', 'Angular', 'Redux', 'PostgreSQL', 'MySQL', 'AWS', 'Jenkins', 'REST APIs', 'GitHub Copilot', 'Claude', 'ChatGPT', 'OpenAI Codex', 'Agentic AI'];
  var track = $('#track');
  track.innerHTML = tech.concat(tech).map(function (t) { return '<span>' + t + '</span>'; }).join('');

  /* count-up */
  $$('[data-count]').forEach(function (el) {
    var end = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
    if (reduce || !hasIO) return;
    el.textContent = '0' + suf;
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; o.disconnect();
      var t0 = performance.now(), dur = 1300;
      (function tick(t) {
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: .6 });
    o.observe(el);
  });

  /* tabs (skills + experience) */
  $$('[data-tabs]').forEach(function (box) {
    var tabs = $$('[role="tab"]', box), panels = $$('[role="tabpanel"]', box);
    function show(tab, focus) {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); t.tabIndex = t === tab ? 0 : -1; });
      panels.forEach(function (p) {
        var on = p.id === tab.getAttribute('data-p');
        p.classList.toggle('on', on);
        if (on) $$('.tile', p).forEach(function (t, i) { t.style.animationDelay = (i * 45) + 'ms'; });
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
      t.addEventListener('click', function () { show(t); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length;
        if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); show(tabs[(i + 1) % n], true); }
        if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); show(tabs[(i - 1 + n) % n], true); }
      });
    });
    $$('.panel.on .tile', box).forEach(function (t, i) { t.style.animationDelay = (i * 45) + 'ms'; });
  });

  /* project filter */
  $$('.filter').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      $$('.filter').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('.proj').forEach(function (p, i) {
        var show = f === 'all' || p.getAttribute('data-c') === f;
        p.classList.toggle('hide', !show);
        if (show) {
          p.classList.add('in'); p.classList.remove('pop'); void p.offsetWidth;
          p.style.animationDelay = (i * 40) + 'ms'; p.classList.add('pop');
        }
      });
    });
  });

  /* card spotlight + project tilt + hero glow (pointer devices only) */
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) {
    $$('.card').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    if (!reduce) {
      $$('.proj').forEach(function (c) {
        c.addEventListener('mousemove', function (e) {
          var r = c.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          c.style.transform = 'translateY(-6px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 7) + 'deg)';
        });
        c.addEventListener('mouseleave', function () { c.style.transform = ''; });
      });
    }
    var hero = $('#home'), glow = $('#glow');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      glow.style.opacity = 1;
      glow.style.left = (e.clientX - r.left) + 'px';
      glow.style.top = (e.clientY - r.top) + 'px';
    });
    hero.addEventListener('mouseleave', function () { glow.style.opacity = 0; });
  }

  /* toast, copy email, contact form */
  var toast = $('#toast'), tt;
  function say(m) { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 2200); }
  var MAIL = 'wishvanath.sah.career@gmail.com';
  $('#copy').addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(MAIL).then(function () { say('Email copied to clipboard'); }, function () { say(MAIL); });
    } else { say(MAIL); }
  });
  $('#form').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('#fn').value.trim(), m = $('#fe').value.trim(), msg = $('#fm').value.trim();
    if (!n || !m || !msg) { say('Please fill in all fields'); return; }
    var body = msg + '\n\n— ' + n + ' (' + m + ')';
    window.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Portfolio enquiry from ' + n) + '&body=' + encodeURIComponent(body);
    say('Opening your email app…');
  });

  $('#year').textContent = new Date().getFullYear();
})();
