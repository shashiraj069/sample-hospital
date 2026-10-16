import { Splide } from '@splidejs/splide';

export function initializeReference() {
  const d = document;
  const root = d.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (sel, ctx = d) => Array.from(ctx.querySelectorAll(sel));
  const cleanups = [];
  const listen = (target, event, handler, options) => {
    target.addEventListener(event, handler, options);
    cleanups.push(() => target.removeEventListener(event, handler, options));
  };
  const observer = (...args) => {
    const io = new IntersectionObserver(...args);
    cleanups.push(() => io.disconnect());
    return io;
  };
  const isSelect2 = () => false;
  const shownFor = (s) => s;
  const syncSelect = () => {};
  /* ---------- Header: shrink on scroll ---------- */
  const header = d.querySelector('[data-header]');
  if (header) {
    let ticking = false;
    const update = () => { header.classList.toggle('is-scrolled', window.scrollY > 24); ticking = false; };
    listen(window, 'scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = d.querySelector('[data-menu-toggle]');
  const menu = d.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.setAttribute('role', 'button');
    menuBtn.setAttribute('aria-expanded', 'false');
    const setMenu = (open) => {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      d.body.classList.toggle('menu-open', open);
      if (open) { const first = menu.querySelector('a'); if (first) first.focus(); }
    };
    menuBtn.addEventListener('click', (e) => { e.preventDefault(); setMenu(menu.hidden); });
    listen(d, 'keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  }

  /* ---------- Treatments sub menu (hover works without JS; this adds click and Esc) ---------- */
  $$('[data-sub]').forEach((item) => {
    const btn = item.querySelector('[data-sub-toggle]');
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
    listen(d, 'click', (e) => {
      if (!item.contains(e.target)) { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  });

  /* ---------- Branch choice: one cookie, every call button follows ---------- */
  const dataEl = d.getElementById('branch-data');
  const branches = dataEl ? JSON.parse(dataEl.textContent) : {};
  const selectTouched = new WeakSet();
  $$('[data-branch-select]').forEach((s) => s.addEventListener('change', () => selectTouched.add(s)));
  const secure = location.protocol === 'https:' ? '; secure' : '';
  const hasCookie = (name) => d.cookie.split('; ').some((c) => c.startsWith(name + '='));
  const near = d.querySelector('[data-near]'); // the "nearest to you" notice, below

  function setBranch(key) {
    const b = branches[key];
    if (!b) return;
    d.cookie = `sd_branch=${encodeURIComponent(key)}; path=/; max-age=${365 * 86400}; samesite=lax${secure}`;
    root.dataset.branch = key;

    $$('[data-branch-tel]').forEach((a) => { a.href = b.tel; });
    $$('[data-branch-phone]').forEach((el) => { el.textContent = b.phone; });
    $$('[data-branch-city]').forEach((el) => { el.textContent = b.city; });
    // Only the number changes: each link keeps its own first message
    $$('[data-branch-wa]').forEach((a) => { a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + b.wa); });
    $$('[data-branch-wa-phone]').forEach((el) => { el.textContent = b.wa_phone; });
    $$('button[data-branch-pick][aria-pressed]').forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.branchPick === key)));
    // A branch the list has greyed out (closed to bookings) is not picked for the visitor
    $$('[data-branch-select]').forEach((s) => {
      const opt = [...s.options].find((o) => o.value === key);
      if (!selectTouched.has(s) && opt && !opt.disabled) { s.value = key; syncSelect(s); }
    });

    $$('[data-branch-tab]').forEach((t) => {
      const on = t.dataset.branchTab === key;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    $$('[data-branch-panel]').forEach((p) => { p.hidden = p.dataset.branchPanel !== key; });
    $$('[data-branch-card]').forEach((c) => c.classList.toggle('is-mine', c.dataset.branchCard === key));
    $$('[data-branch-dot]').forEach((g) => g.classList.toggle('is-mine', g.dataset.branchDot === key));
    // Another branch picked: the notice no longer says what the page shows
    if (near && near.dataset.key && near.dataset.key !== key) near.hidden = true;
    d.dispatchEvent(new CustomEvent('branch:change', { detail: key }));
  }

  listen(d, 'click', (e) => {
    const pick = e.target.closest('[data-branch-pick]');
    if (!pick || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setBranch(pick.dataset.branchPick);
  });

  // Tabs keyboard support: arrows, Home and End move and select.
  $$('[data-tablist]').forEach((list) => {
    list.addEventListener('keydown', (e) => {
      const tabs = $$('[role="tab"]', list);
      const i = tabs.indexOf(d.activeElement);
      if (i < 0) return;
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setBranch(tabs[i].dataset.branchPick); return; }
      if (next) { e.preventDefault(); next.focus(); setBranch(next.dataset.branchPick); }
    });
  });

  /* ---------- Nearest branch, on a first visit ----------
     branch-data.php prints the notice only while the visitor has no branch of
     their own. The browser asks the visitor first, and the position never
     leaves their device: only the nearest branch is kept, in the usual cookie.
     More than nearest_branch_km (data/settings.php) from every branch, or no
     answer: the default branch stays, and other pages in this visit do not ask. */
  const distanceKm = (lat1, lng1, lat2, lng2) => { // in a straight line (haversine)
    const r = Math.PI / 180;
    const h = Math.sin((lat2 - lat1) * r / 2) ** 2
      + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin((lng2 - lng1) * r / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(h));
  };

  if (false && near && 'geolocation' in navigator && window.isSecureContext && !hasCookie('sd_branch') && !hasCookie('sd_near')) {
    const asked = () => { d.cookie = `sd_near=1; path=/; samesite=lax${secure}`; };
    const close = () => { near.hidden = true; };
    near.querySelector('[data-near-close]').addEventListener('click', close);
    near.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    navigator.geolocation.getCurrentPosition((pos) => {
      asked();
      if (hasCookie('sd_branch')) return; // picked one while the browser was asking
      const { latitude, longitude } = pos.coords;
      let key = null;
      let best = Number(near.dataset.maxKm);
      Object.keys(branches).forEach((k) => {
        const km = distanceKm(latitude, longitude, branches[k].lat, branches[k].lng);
        if (km <= best) { best = km; key = k; }
      });
      if (!key) return;

      setBranch(key);
      near.dataset.key = key;
      $$('[data-near-city]', near).forEach((el) => { el.textContent = branches[key].city; });
      $$('[data-branch-pick]', near).forEach((btn) => { btn.hidden = btn.dataset.branchPick === key; });
      near.hidden = false;
      const status = d.querySelector('[data-near-status]');
      if (status) status.textContent = near.querySelector('.near-msg').textContent;
    }, asked, { timeout: 15000, maximumAge: 10 * 60000 });
  }

  /* ---------- WhatsApp chat box (partials/whatsapp-float.php) ----------
     Without JavaScript the green button is a plain link to WhatsApp. Here it
     opens a small chat box above it instead. A topic, or a message typed in the
     box, opens WhatsApp with that message already written, to the visitor's
     branch (the branch buttons in the box change it for the whole site).
     The "1" on the button shows until the visitor first opens the box. */
  const chat = d.querySelector('[data-chat]');
  if (chat) {
    const panel = chat.querySelector('[data-chat-panel]');
    const toggle = chat.querySelector('[data-chat-toggle]');
    const body = chat.querySelector('[data-chat-body]');
    const log = chat.querySelector('[data-chat-log]');
    const form = chat.querySelector('[data-chat-form]');
    const input = form.querySelector('textarea');
    const badge = chat.querySelector('[data-chat-badge]');
    const greet = chat.querySelector('[data-chat-greet]');
    const topics = $$('[data-chat-msg]', chat);
    const words = JSON.parse(chat.dataset.chatWords);
    const seen = {
      get: () => { try { return localStorage.getItem('sd_chat') === '1'; } catch (e) { return false; } },
      set: () => { try { localStorage.setItem('sd_chat', '1'); } catch (e) { /* private window: the badge comes back next visit */ } },
    };

    const branch = () => branches[root.dataset.branch] || Object.values(branches)[0];
    const waUrl = (text) => 'https://wa.me/' + branch().wa + '?text=' + encodeURIComponent(text);
    const topicText = (a) => a.dataset.chatMsg.replace('%s', branch().city);
    const refresh = () => topics.forEach((a) => { a.href = waUrl(topicText(a)); });
    listen(d, 'branch:change', refresh);

    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-expanded', 'false');
    const isOpen = () => chat.classList.contains('is-open');
    let hideTimer = 0;
    const setOpen = (open, focusButton = false) => {
      if (open === isOpen()) return;
      clearTimeout(hideTimer);
      chat.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        const h = new Date().getHours(); // the visitor's own clock
        greet.textContent = words.greet[h < 12 ? 0 : h < 17 ? 1 : 2] + '!';
        refresh();
        panel.hidden = false;
        void panel.offsetWidth; // start the transition from the closed look
        panel.classList.add('is-shown');
        panel.focus({ preventScroll: true });
        badge.hidden = true;
        seen.set();
      } else {
        panel.classList.remove('is-shown');
        hideTimer = setTimeout(() => { panel.hidden = true; }, reduceMotion ? 0 : 300);
        if (focusButton) toggle.focus();
      }
    };

    toggle.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return; // a new tab: the plain WhatsApp link
      e.preventDefault();
      setOpen(!isOpen());
    });
    toggle.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); setOpen(!isOpen()); } });
    chat.querySelector('[data-chat-close]').addEventListener('click', () => setOpen(false, true));
    listen(d, 'keydown', (e) => { if (e.key === 'Escape' && isOpen()) setOpen(false, chat.contains(d.activeElement)); });
    listen(d, 'pointerdown', (e) => { if (isOpen() && !chat.contains(e.target)) setOpen(false); });

    // The message in the box, as sent, with a link in case the browser stopped WhatsApp opening
    const tick = '<svg class="icon" focusable="false"><use href="#i-check"></use></svg>';
    const sent = (text, url) => {
      const out = d.createElement('div');
      out.className = 'wa-out';
      const bubble = d.createElement('p');
      bubble.className = 'wa-bubble wa-bubble--out';
      bubble.textContent = text;
      bubble.insertAdjacentHTML('beforeend', '<span class="wa-tick" aria-hidden="true">' + tick + tick + '</span>');
      const again = d.createElement('a');
      again.className = 'wa-again';
      again.href = url;
      again.target = '_blank';
      again.rel = 'noopener';
      again.textContent = words.again;
      out.append(bubble, again);
      log.append(out);
      while (log.children.length > 3) log.firstElementChild.remove();
      body.scrollTo({ top: body.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    // A topic is a real link: only bring it up to date (the branch may have changed) and show it as sent
    topics.forEach((a) => a.addEventListener('click', () => {
      const text = topicText(a);
      a.href = waUrl(text);
      sent(text, a.href);
    }));

    // Book appointment goes to the booking page; close the box, as on the booking page itself it only scrolls to the form
    $$('[data-chat-book]', chat).forEach((a) => a.addEventListener('click', () => setOpen(false)));

    // The typing box grows with the message, up to five lines. Enter sends, Shift+Enter starts a new line.
    const fit = () => {
      form.classList.toggle('is-empty', !input.value.trim());
      if (panel.hidden) return; // nothing to measure
      input.style.height = '';
      const full = input.scrollHeight + input.offsetHeight - input.clientHeight; // with the borders
      input.style.height = Math.min(Math.max(full, input.offsetHeight), 120) + 'px';
      input.style.overflowY = full > 120 ? 'auto' : 'hidden';
    };
    const send = () => {
      const text = input.value.trim();
      if (!text) { input.focus(); return; }
      const url = waUrl(text);
      window.open(url, '_blank', 'noopener');
      sent(text, url);
      input.value = '';
      fit();
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); send(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); }
    });
    input.addEventListener('input', fit);
    fit();

    if (!seen.get()) setTimeout(() => { if (!isOpen()) badge.hidden = false; }, 2500);
  }

  /* ---------- Hero: photo slides (Splide, public/assets/js/vendor) ----------
     Splide fades the text slides and runs the arrows. The slides pause while
     the pointer or keyboard focus is on the text or the arrows.
     The photos sit outside the slider, behind the whole stage, and follow it.
     Visitors who ask for reduced motion get the slides paused, with no fades. */
  const heroEl = d.querySelector('[data-hero-slider]');
  if (heroEl) {
    const bgWrap = d.querySelector('[data-hero-bgs]');
    const bgs = bgWrap ? Array.from(bgWrap.children) : [];

    const showBg = (i) => bgs.forEach((bg, n) => {
      bg.classList.toggle('is-active', n === i);
      bg.setAttribute('aria-hidden', String(n !== i));
    });

    const hero = new Splide(heroEl, {
      type: 'fade',
      rewind: true,
      speed: 900,
      easing: 'cubic-bezier(.2, .7, .2, 1)',
      autoplay: true,
      interval: 7000,
      pauseOnHover: true,
      pauseOnFocus: true,
      pagination: false,
    });

    hero.on('move', showBg);
    hero.mount();
    cleanups.push(() => hero.destroy());

    // The first photo is already showing (at its starting zoom); this starts its slow zoom.
    showBg(hero.index);
    if (bgWrap) bgWrap.classList.add('is-ready');
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal], .map, .stat');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = observer((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Numbers count up once ---------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    // PHP prints the final figure, so without JS (or before this runs) it is correct.
    const fmt = (el, n) => {
      const dec = parseInt(el.dataset.decimals, 10) || 0;
      return n.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.dataset.suffix || '');
    };
    const run = (el) => {
      const target = parseFloat(el.dataset.count) || 0;
      const dec = parseInt(el.dataset.decimals, 10) || 0;
      const start = performance.now();
      const dur = 1400;
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const v = target * (1 - Math.pow(1 - t, 3));
        el.textContent = fmt(el, t < 1 ? Math.floor(v * 10 ** dec) / 10 ** dec : target);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = observer((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { run(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => { el.textContent = fmt(el, 0); cio.observe(el); });
  }

  /* ---------- Concerns: keep the answer in view on small screens ---------- */
  $$('input[name="concern"]').forEach((input) => {
    input.addEventListener('change', () => {
      const panel = d.getElementById('cxp-' + input.value);
      if (!panel || window.innerWidth >= 980) return;
      const r = panel.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.75 || r.top < 0) {
        panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Treatments list: accordion on small screens ---------- */
  $$('[data-tx] .tx-row').forEach((row) => {
    const btn = row.querySelector('.tx-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = !row.classList.contains('is-open');
      row.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Treatments list: the sticky lens follows the row in use ---------- */
  const stage = d.querySelector('[data-tx-stage]');
  if (stage) {
    $$('[data-tx-index]').forEach((row) => {
      const show = () => { stage.dataset.active = row.dataset.txIndex; };
      row.addEventListener('mouseenter', show);
      row.addEventListener('focusin', show);
    });
  }

  /* ---------- Doctors rail: buttons, keys, mouse drag ---------- */
  const rail = d.querySelector('[data-rail]');
  if (rail) {
    const prev = d.querySelector('[data-rail-prev]');
    const next = d.querySelector('[data-rail-next]');
    const card = () => rail.querySelector('.doc');
    const stepSize = () => { const c = card(); return c ? c.getBoundingClientRect().width + 24 : 300; };
    const go = (dir) => rail.scrollBy({ left: dir * stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' });
    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth - 4;
      if (prev) prev.disabled = rail.scrollLeft <= 4;
      if (next) next.disabled = rail.scrollLeft >= max;
    };
    prev && prev.addEventListener('click', () => go(-1));
    next && next.addEventListener('click', () => go(1));
    rail.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    listen(window, 'resize', sync);
    sync();

    rail.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    // Keep a focused card fully in view when tabbing through links.
    rail.addEventListener('focusin', (e) => {
      const c = e.target.closest('.doc');
      if (c) c.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });
    });

    // Mouse drag (touch already scrolls natively).
    let down = false; let startX = 0; let startLeft = 0; let moved = false;
    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
    });
    listen(window, 'pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) { moved = true; rail.classList.add('is-dragging'); }
      if (moved) rail.scrollLeft = startLeft - dx;
    });
    listen(window, 'pointerup', () => {
      if (!down) return;
      down = false;
      if (moved) {
        // Let snapping settle to the nearest card after the drag.
        requestAnimationFrame(() => rail.classList.remove('is-dragging'));
        const block = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
        rail.addEventListener('click', block, { capture: true, once: true });
        setTimeout(() => rail.removeEventListener('click', block, { capture: true }), 50);
      }
    });
    rail.addEventListener('dragstart', (e) => e.preventDefault());
  }

  /* ---------- Reviews: long ones fold to a few lines with Show more ---------- */
  const reviews = $$('[data-review]');
  if (reviews.length) {
    // CSS folds every review; only those cut short get the fade and the button.
    const measure = () => reviews.forEach((card) => {
      if (card.classList.contains('is-open')) return;
      const text = card.querySelector('[data-review-text]');
      card.classList.toggle('is-long', text.scrollHeight > text.clientHeight + 2);
    });
    reviews.forEach((card) => {
      const text = card.querySelector('[data-review-text]');
      const btn = card.querySelector('[data-review-more]');
      btn.addEventListener('click', () => {
        const open = !card.classList.contains('is-open');
        // max-height cannot animate to "none", so run it through the real height.
        text.style.maxHeight = text.scrollHeight + 'px';
        if (!open) {
          void text.offsetHeight; // apply the height before folding back
          text.style.maxHeight = '';
        }
        card.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        if (open) setTimeout(() => { if (card.classList.contains('is-open')) text.style.maxHeight = ''; }, reduceMotion ? 0 : 480);
        else if (card.getBoundingClientRect().top < 0) card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
    measure();
    if (d.fonts) d.fonts.ready.then(measure);
    let resizeTick = false;
    listen(window, 'resize', () => { if (!resizeTick) { resizeTick = true; requestAnimationFrame(() => { measure(); resizeTick = false; }); } });
  }

  /* ---------- Treatment pages: "On this page" marks the section being read ---------- */
  const toc = d.querySelector('[data-toc]');
  if (toc) {
    const links = $$('a[href^="#"]', toc);
    const targets = links.map((a) => d.getElementById(a.hash.slice(1))).filter(Boolean);
    let current = null;
    let spyTick = false;
    const spy = () => {
      spyTick = false;
      const line = window.innerHeight * 0.3;
      let active = targets[0];
      targets.forEach((t) => { if (t.getBoundingClientRect().top <= line) active = t; });
      if (!active || active === current) return;
      current = active;
      links.forEach((a) => {
        const on = a.hash === '#' + active.id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    listen(window, 'scroll', () => { if (!spyTick) { spyTick = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  /* ---------- Treatment pages: drag to compare clear sight with the changed view ----------
     Without JavaScript the picture stays split down the middle. */
  $$('[data-sim]').forEach((fig) => {
    const frame = fig.querySelector('.sim-frame');
    const range = fig.querySelector('[data-sim-range]');
    if (!frame || !range) return;
    const set = (v) => {
      frame.style.setProperty('--split', v + '%');
      frame.classList.toggle('hide-clear', v < 26);
      frame.classList.toggle('hide-fx', v > 74);
    };
    let touched = false;
    range.addEventListener('input', () => set(Number(range.value)));
    ['pointerdown', 'keydown'].forEach((ev) => range.addEventListener(ev, () => { touched = true; }));

    // One slow sweep the first time it comes into view, so people see that it moves.
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const sio = observer((entries) => {
      if (!entries[0].isIntersecting) return;
      sio.disconnect();
      let start = null;
      const sweep = (now) => {
        if (touched) return;
        if (start === null) start = now;
        const t = Math.min(1, (now - start) / 1800);
        const v = 50 - 24 * Math.sin(t * Math.PI);
        range.value = String(Math.round(v));
        set(v);
        if (t < 1) requestAnimationFrame(sweep);
      };
      setTimeout(() => requestAnimationFrame(sweep), 600);
    }, { threshold: 0.6 });
    sio.observe(frame);
  });

  /* ---------- Doctors list: show only the doctors at one branch ----------
     Without JavaScript the buttons stay hidden and every doctor shows. */
  const drFilter = d.querySelector('[data-dl-filter]');
  const drList = d.querySelector('[data-dl-list]');
  if (drFilter && drList) {
    const cards = $$('[data-at]', drList);
    const empty = d.querySelector('[data-dl-empty]');
    const status = d.querySelector('[data-dl-status]');
    const apply = (announce) => {
      const input = drFilter.querySelector('input:checked');
      const key = input ? input.value : '';
      let shown = 0;
      cards.forEach((card) => {
        const show = !key || card.dataset.at.split(' ').includes(key);
        card.hidden = !show;
        if (show) shown += 1;
        $$('[data-where]', card).forEach((li) => li.classList.toggle('is-match', li.dataset.where === key));
      });
      if (empty) empty.hidden = shown > 0;
      if (status && announce) {
        status.textContent = key
          ? (shown === 1 ? status.dataset.one : status.dataset.many).replace('%d', shown).replace('%s', input.dataset.city)
          : status.dataset.all;
      }
    };
    drFilter.addEventListener('change', () => apply(true));
    apply(false); // the browser may bring back a choice made before going back
  }

  /* ---------- Career: Apply beside a job picks it in the form ----------
     Without JavaScript the link reloads the page with ?role=..., which does the same. */
  const roleSelect = d.querySelector('[data-role-select]');
  if (roleSelect) {
    listen(d, 'click', (e) => {
      const pick = e.target.closest('[data-role-pick]');
      if (!pick || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      roleSelect.value = pick.dataset.rolePick;
      syncSelect(roleSelect);
      const box = shownFor(roleSelect);
      d.getElementById('apply').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      box.focus({ preventScroll: true });
      box.classList.remove('is-picked');
      void box.offsetWidth; // restart the highlight on a second pick
      box.classList.add('is-picked');
    });
  }

  /* ---------- Career: check the CV as soon as it is chosen, before it uploads ---------- */
  $$('[data-cv]').forEach((input) => {
    const msg = d.getElementById('ap-err-cv');
    const field = input.closest('.field');
    input.addEventListener('change', () => {
      const file = input.files[0];
      let err = '';
      if (file) {
        const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
        if (!input.dataset.cvTypes.split(' ').includes(ext)) err = input.dataset.cvBadType;
        else if (file.size > Number(input.dataset.cvMax)) err = input.dataset.cvTooBig;
      }
      if (err) input.value = ''; // so the wrong file is not sent
      msg.textContent = err;
      field.classList.toggle('has-error', Boolean(err));
      if (err) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    });
  });

  /* ---------- Forms: move focus to the message after a send ---------- */
  const notice = d.querySelector('[data-focus-on-load]');
  if (notice) {
    notice.scrollIntoView({ block: 'center' });
    notice.focus({ preventScroll: true });
  }

  const savedBranch = document.cookie.split('; ').find(x => x.startsWith('sd_branch='));
  const queryBranch = new URLSearchParams(location.search).get('branch');
  setBranch(queryBranch || (savedBranch ? decodeURIComponent(savedBranch.split('=')[1]) : 'patna'));
  $$('form[data-prototype-form]').forEach(form => {
    form.removeAttribute('novalidate');
    form.querySelectorAll('input[type=date]').forEach(input => { input.min = new Date().toISOString().slice(0,10); });
    listen(form, 'submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      let notice = form.querySelector('.prototype-notice');
      if (!notice) { notice = d.createElement('div'); notice.className = 'prototype-notice'; notice.setAttribute('role','status'); form.prepend(notice); }
      notice.textContent = 'Prototype only — your request has not been sent. Please call the branch to confirm an appointment.';
      notice.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
  return () => cleanups.forEach(cleanup => cleanup());
}
