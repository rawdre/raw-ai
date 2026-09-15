/* ============================================================================
   Seja Arena — shared project nav (hamburger) + EN/PT language toggle.
   Included on every Seja Arena page (client deck, internal dossier, super-app
   scan). One place to list every asset in the project, so the internal /
   unlisted pages are always reachable. Language choice persists across pages
   (localStorage 'seja_lang'). Theme-aware: uses each page's own CSS tokens
   (--acc on the internal pages, --gold on the deck) via a fallback chain.
   ============================================================================ */
(function () {
  'use strict';

  // Every destination in the project, grouped. `ext:true` opens in a new tab.
  var LINKS = [
    { href: 'https://apresentacoes.zystudio-contabo.duckdns.org/seja-arena/', ext: true,
      group: { pt: 'Cliente', en: 'Client-facing' },
      pt: 'Apresentação', en: 'Presentation',
      subPt: 'a apresentação em uso no projeto', subEn: 'the presentation we use in this project',
      badge: { pt: 'principal', en: 'main' } },
    { href: 'https://seja-arena-valores.zystudio-contabo.duckdns.org/investimento.html', ext: true,
      group: { pt: 'Cliente', en: 'Client-facing' },
      pt: 'Investimento / valores', en: 'Investment / pricing',
      subPt: 'os números e o plano de investimento', subEn: 'the numbers and the investment plan' },
    { href: '/seja-arena-interno.html',
      group: { pt: 'Interno', en: 'Internal' },
      pt: 'Dossiê interno — plano & dinheiro', en: 'Internal dossier — plan & money',
      subPt: 'cenário, jogada, fluxo de caixa (uso interno)', subEn: 'market, play, cash flow (internal)' },
    { href: '/seja-arena-superapps.html',
      group: { pt: 'Interno', en: 'Internal' },
      pt: 'Scan global de super apps', en: 'Global super-app scan',
      subPt: 'o que são e o tamanho do trabalho', subEn: 'what they are and the size of the work' },
    { href: '/seja-arena.html',
      group: { pt: 'Arquivo', en: 'Archive' },
      pt: 'Deck antigo (raw-ai)', en: 'Old deck (raw-ai)',
      subPt: 'a apresentação anterior — mantida', subEn: 'the earlier presentation — kept' }
  ];

  var LANG_KEY = 'seja_lang';

  function curLang() {
    try { var s = localStorage.getItem(LANG_KEY); if (s === 'en' || s === 'pt') return s; } catch (e) {}
    var d = document.documentElement.getAttribute('data-deflang');
    return (d === 'en') ? 'en' : 'pt';
  }

  // ---- Unified language toggle (works with the deck's existing [data-lang] blocks) ----
  window.setLang = function (l) {
    l = (l === 'en') ? 'en' : 'pt';
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.hidden = el.getAttribute('data-lang') !== l;
    });
    var be = document.getElementById('btn-en'), bp = document.getElementById('btn-pt');
    if (be) be.setAttribute('aria-pressed', String(l === 'en'));
    if (bp) bp.setAttribute('aria-pressed', String(l === 'pt'));
    document.documentElement.lang = l;
    document.querySelectorAll('[data-i18n-pt]').forEach(function (el) {
      var v = el.getAttribute('data-i18n-' + l); if (v != null) el.textContent = v;
    });
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
  };

  function injectStyles() {
    if (document.getElementById('sejanav-css')) return;
    var css = document.createElement('style');
    css.id = 'sejanav-css';
    css.textContent = [
      ':root{--nav-acc:var(--acc,var(--gold,#2fbf86))}',
      '.sejaham{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;flex-shrink:0;border:1px solid var(--line);border-radius:9px;background:var(--card);color:var(--ink);cursor:pointer;padding:0;margin-right:10px}',
      '.sejaham:hover{border-color:var(--nav-acc)}',
      '.sejaham svg{width:17px;height:17px;display:block}',
      '.sejalang{display:inline-flex;border:1px solid var(--line);border-radius:999px;overflow:hidden;background:var(--card);margin-left:auto}',
      '.sejalang button{appearance:none;border:0;background:transparent;color:var(--muted);font:inherit;font-weight:700;font-size:12.5px;padding:6px 13px;cursor:pointer;transition:.15s;font-family:inherit}',
      '.sejalang button[aria-pressed="true"]{background:var(--nav-acc);color:#0a0a0a}',
      '.sejaback{position:fixed;inset:0;z-index:60;background:rgba(4,8,12,.55);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity .18s}',
      '.sejaback.open{opacity:1;pointer-events:auto}',
      '.sejadrawer{position:fixed;top:0;right:0;z-index:61;height:100%;width:min(340px,86vw);background:var(--bg,var(--card));border-left:1px solid var(--line);box-shadow:-24px 0 60px -30px #000;transform:translateX(102%);transition:transform .22s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;padding:18px 16px;overflow-y:auto;font-family:inherit}',
      '.sejadrawer.open{transform:translateX(0)}',
      '.sejadrawer .dh{display:flex;align-items:center;gap:9px;margin:2px 2px 4px}',
      '.sejadrawer .dh .dot{width:24px;height:24px;border-radius:7px;background:var(--nav-acc);display:grid;place-items:center;color:#0a0a0a;font-weight:900;font-family:var(--mono,monospace);font-size:13px}',
      '.sejadrawer .dh b{font-size:14px;color:var(--ink);letter-spacing:-.01em}',
      '.sejadrawer .dh .x{margin-left:auto;background:transparent;border:0;color:var(--muted);font-size:22px;line-height:1;cursor:pointer;padding:2px 6px}',
      '.sejadrawer .cap{font-family:var(--mono,monospace);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:14px 4px 8px}',
      '.sejalink{display:block;text-decoration:none;border:1px solid var(--line);border-radius:12px;background:var(--card);padding:12px 13px;margin-bottom:9px;transition:border-color .15s,transform .15s}',
      '.sejalink:hover{border-color:var(--nav-acc);transform:translateY(-1px)}',
      '.sejalink.cur{border-color:var(--nav-acc);background:color-mix(in srgb,var(--nav-acc) 10%,var(--card))}',
      '.sejalink .t{display:flex;align-items:center;gap:7px;color:var(--ink);font-weight:700;font-size:13.5px}',
      '.sejalink .t .badge{font-family:var(--mono,monospace);font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--nav-acc);border:1px solid color-mix(in srgb,var(--nav-acc) 40%,transparent);border-radius:999px;padding:1px 7px}',
      '.sejalink .t .ext{margin-left:auto;color:var(--muted);font-size:13px}',
      '.sejalink .s{color:var(--muted);font-size:11.5px;margin-top:3px;line-height:1.4}',
      '.sejadrawer .foot{margin-top:auto;padding-top:14px;color:var(--muted);font-size:11px;line-height:1.5}',
      '@media print{.sejaham,.sejalang,.sejaback,.sejadrawer{display:none!important}}'
    ].join('');
    document.head.appendChild(css);
  }

  function build() {
    var bar = document.querySelector('.bar .in');
    if (!bar) return;
    injectStyles();

    // Hamburger trigger — first thing in the bar.
    var ham = document.createElement('button');
    ham.className = 'sejaham';
    ham.type = 'button';
    ham.setAttribute('aria-label', 'Menu do projeto / Project menu');
    ham.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    bar.insertBefore(ham, bar.firstChild);

    // Back button (← previous page) — only when there's history to go back to.
    if (history.length > 1) {
      var back = document.createElement('button');
      back.className = 'sejaham sejaback-btn';
      back.type = 'button';
      back.setAttribute('aria-label', 'Voltar / Back');
      back.setAttribute('title', 'Voltar / Back');
      back.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
      back.addEventListener('click', function () { history.back(); });
      bar.insertBefore(back, bar.firstChild);
    }

    // Language toggle — only if the page doesn't already have one.
    if (!document.getElementById('btn-en')) {
      var tg = document.createElement('div');
      tg.className = 'sejalang';
      tg.setAttribute('role', 'group');
      tg.setAttribute('aria-label', 'Language / Idioma');
      tg.innerHTML = '<button id="btn-en" type="button" aria-pressed="false" onclick="setLang(\'en\')">EN</button>' +
                     '<button id="btn-pt" type="button" aria-pressed="true" onclick="setLang(\'pt\')">PT</button>';
      var conf = bar.querySelector('.conf');
      if (conf) bar.insertBefore(tg, conf); else bar.appendChild(tg);
    }

    // Drawer + backdrop.
    var back = document.createElement('div'); back.className = 'sejaback';
    var draw = document.createElement('div'); draw.className = 'sejadrawer'; draw.setAttribute('role', 'dialog'); draw.setAttribute('aria-label', 'Seja Arena — navegação');
    var here = location.pathname.replace(/\/index\.html$/, '/');
    var lastGroup = null;
    var rows = LINKS.map(function (lk) {
      var cap = '';
      if (lk.group && lk.group.pt !== lastGroup) {
        lastGroup = lk.group.pt;
        cap = '<div class="cap" data-i18n-pt="' + lk.group.pt + '" data-i18n-en="' + lk.group.en + '">' + lk.group.pt + '</div>';
      }
      var isCur = !lk.ext && (here === lk.href || here === lk.href.replace(/\.html$/, ''));
      return cap + '<a class="sejalink' + (isCur ? ' cur' : '') + '" href="' + lk.href + '"' + (lk.ext ? ' target="_blank" rel="noopener"' : '') + '>' +
        '<span class="t"><span data-i18n-pt="' + lk.pt + '" data-i18n-en="' + lk.en + '">' + lk.pt + '</span>' +
        (lk.badge ? '<span class="badge" data-i18n-pt="' + lk.badge.pt + '" data-i18n-en="' + lk.badge.en + '">' + lk.badge.pt + '</span>' : '') +
        (lk.ext ? '<span class="ext">↗</span>' : (isCur ? '<span class="ext">•</span>' : '')) + '</span>' +
        '<span class="s" data-i18n-pt="' + lk.subPt + '" data-i18n-en="' + lk.subEn + '">' + lk.subPt + '</span></a>';
    }).join('');
    draw.innerHTML =
      '<div class="dh"><span class="dot">S</span><b>Seja Arena</b>' +
        '<button class="x" type="button" aria-label="Fechar / Close">&times;</button></div>' +
      rows +
      '<div class="foot" data-i18n-pt="Uso interno · Raw Business Solution. As páginas internas pedem senha." ' +
        'data-i18n-en="Internal use · Raw Business Solution. Internal pages are password-gated.">' +
        'Uso interno · Raw Business Solution. As páginas internas pedem senha.</div>';
    document.body.appendChild(back);
    document.body.appendChild(draw);

    function open() { back.classList.add('open'); draw.classList.add('open'); }
    function close() { back.classList.remove('open'); draw.classList.remove('open'); }
    ham.addEventListener('click', open);
    back.addEventListener('click', close);
    draw.querySelector('.x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    // Apply the persisted language now that buttons + labels exist.
    window.setLang(curLang());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
