/* ============================================================================
   Seja Arena — team hub ("Equipe" button in the deck's top bar).
   One panel with every Seja Arena site: client-facing pages + internal docs.
   The list only opens with the TEAM access code, checked server-side by
   /api/access (env RAW_AI_ACCESS_CODE) — the client deck password is NOT
   enough, so a client who has the deck password never sees the internal docs.
   Once the code is accepted on a device, it is remembered there and the
   internal pages' own gates are pre-unlocked for the session.
   ============================================================================ */
(function () {
  'use strict';

  var TEAM_KEY = 'raw_team_ok';
  // Session keys each gated page checks, so the team doesn't re-type passwords.
  var PAGE_KEYS = ['seja_unlocked', 'seja_int_unlocked', 'seja_superapps_unlocked'];

  var GROUPS = [
    { title: 'Cliente', links: [
      { href: '/seja-arena.html', t: 'Apresentação', s: 'o deck em uso com o cliente (vídeo + plano)' },
      { href: '/seja-arena/app-simulacao.html', t: 'Protótipo do app', s: 'simulação interativa do super-app' },
      { href: 'https://seja-arena-valores.zystudio-contabo.duckdns.org/investimento.html', ext: true,
        t: 'Investimento / valores', s: 'os números e o plano de investimento' }
    ] },
    { title: 'Interno — só a equipe', links: [
      { href: '/seja-arena-interno.html', t: 'Dossiê interno — plano & dinheiro', s: 'cenário, jogada, fluxo de caixa' },
      { href: '/seja-arena-superapps.html', t: 'Scan global de super apps', s: 'o que são e o tamanho do trabalho' }
    ] },
    { title: 'Arquivo', links: [
      { href: '/seja-arena-v1.html', t: 'Deck antigo (v1)', s: 'a apresentação anterior, bilíngue' }
    ] }
  ];

  function store(get, k, v) {
    try { return get ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function unlockPages() {
    PAGE_KEYS.forEach(function (k) { try { sessionStorage.setItem(k, '1'); } catch (e) {} });
  }
  function isTeam() { return store(true, TEAM_KEY) === '1'; }

  function injectStyles() {
    var css = document.createElement('style');
    css.textContent = [
      '.teambtn{display:inline-flex;align-items:center;gap:6px;margin-left:auto;margin-right:12px;background:transparent;border:1px solid var(--line);border-radius:999px;color:var(--muted);font:inherit;font-size:12.5px;font-weight:700;padding:7px 13px;cursor:pointer;white-space:nowrap;transition:.15s}',
      '.teambtn:hover{color:var(--ink);border-color:var(--gold)}',
      '.teambtn svg{width:13px;height:13px}',
      '.bar .in .navcta{margin-left:0}',
      '.teamback{position:fixed;inset:0;z-index:90;background:rgba(4,8,12,.6);backdrop-filter:blur(3px);opacity:0;pointer-events:none;transition:opacity .18s}',
      '.teamback.open{opacity:1;pointer-events:auto}',
      '.teamdraw{position:fixed;top:0;right:0;z-index:91;height:100%;width:min(380px,90vw);background:var(--bg);border-left:1px solid var(--line);box-shadow:-24px 0 60px -30px #000;transform:translateX(102%);transition:transform .22s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;padding:20px 18px;overflow-y:auto}',
      '.teamdraw.open{transform:none}',
      '.teamdraw .dh{display:flex;align-items:center;gap:10px;margin-bottom:6px}',
      '.teamdraw .dh .dot{width:26px;height:26px;border-radius:8px;background:var(--gold);display:grid;place-items:center;color:#1a1200;font-weight:900;font-size:13px}',
      '.teamdraw .dh b{color:var(--ink);font-size:15px}',
      '.teamdraw .x{margin-left:auto;background:transparent;border:0;color:var(--muted);font-size:24px;line-height:1;cursor:pointer}',
      '.teamdraw .cap{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:800;margin:18px 4px 8px}',
      '.teamlink{display:block;text-decoration:none;border:1px solid var(--line);border-radius:12px;background:var(--card);padding:12px 14px;margin-bottom:9px;transition:border-color .15s,transform .15s}',
      '.teamlink:hover{border-color:var(--gold);transform:translateY(-1px)}',
      '.teamlink .t{display:flex;gap:8px;color:var(--ink);font-weight:700;font-size:14px}',
      '.teamlink .t i{margin-left:auto;font-style:normal;color:var(--muted)}',
      '.teamlink .s{display:block;color:var(--muted);font-size:12px;margin-top:3px}',
      '.teamform{display:flex;flex-direction:column;gap:10px;margin-top:14px}',
      '.teamform p{color:var(--muted);font-size:13px;margin:0}',
      '.teamform input{padding:12px 14px;border-radius:11px;border:1px solid var(--line);background:var(--bg2);color:var(--ink);font:inherit;font-size:15px;text-align:center}',
      '.teamform input:focus{outline:2px solid var(--gold);outline-offset:1px}',
      '.teamform button{padding:12px;border:0;border-radius:11px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#1a1200;font:inherit;font-weight:800;cursor:pointer}',
      '.teamform button:disabled{opacity:.6}',
      '.teamform .err{color:#ff7a7a;font-size:12.5px}',
      '.teamdraw .foot{margin-top:auto;padding-top:16px;color:var(--muted);font-size:11.5px;line-height:1.5}',
      '@media(max-width:720px){.teambtn{margin-left:0}}',
      '@media print{.teambtn,.teamback,.teamdraw{display:none!important}}'
    ].join('');
    document.head.appendChild(css);
  }

  function linksHtml() {
    return GROUPS.map(function (g) {
      return '<div class="cap">' + g.title + '</div>' + g.links.map(function (l) {
        var cur = !l.ext && location.pathname === l.href;
        return '<a class="teamlink" href="' + l.href + '"' + (l.ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
          '<span class="t">' + l.t + '<i>' + (l.ext ? '↗' : cur ? '•' : '→') + '</i></span>' +
          '<span class="s">' + l.s + '</span></a>';
      }).join('');
    }).join('');
  }

  function formHtml() {
    return '<form class="teamform"><p>Área da equipe. Digite o código de acesso da equipe Raw AI.</p>' +
      '<input type="password" autocomplete="off" placeholder="Código da equipe" aria-label="Código da equipe">' +
      '<button type="submit">Entrar →</button><span class="err" hidden>Código incorreto</span></form>';
  }

  function build() {
    var bar = document.querySelector('.bar .in');
    if (!bar) return;
    injectStyles();
    if (isTeam()) unlockPages();

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'teambtn';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Equipe';
    bar.insertBefore(btn, bar.querySelector('.navcta'));

    var back = document.createElement('div'); back.className = 'teamback';
    var draw = document.createElement('div'); draw.className = 'teamdraw';
    draw.setAttribute('role', 'dialog'); draw.setAttribute('aria-label', 'Seja Arena — sites da equipe');
    draw.innerHTML = '<div class="dh"><span class="dot">S</span><b>Seja Arena — todos os sites</b>' +
      '<button class="x" type="button" aria-label="Fechar">&times;</button></div><div class="body"></div>' +
      '<div class="foot">Uso interno · Raw Business Solution. O código fica salvo neste aparelho.</div>';
    document.body.appendChild(back);
    document.body.appendChild(draw);
    var body = draw.querySelector('.body');

    function render() {
      if (isTeam()) { body.innerHTML = linksHtml(); return; }
      body.innerHTML = formHtml();
      var f = body.querySelector('form'), inp = f.querySelector('input'), err = f.querySelector('.err'), sub = f.querySelector('button');
      f.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!inp.value.trim()) return;
        sub.disabled = true; err.hidden = true;
        try {
          var r = await fetch('/api/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: inp.value }) });
          var d = await r.json();
          if (d && d.ok) { store(false, TEAM_KEY, '1'); unlockPages(); render(); return; }
          err.textContent = 'Código incorreto';
        } catch (_) {
          err.textContent = 'Sem conexão — tente de novo';
        }
        err.hidden = false; inp.value = ''; inp.focus(); sub.disabled = false;
      });
      setTimeout(function () { inp.focus(); }, 50);
    }

    function open() { render(); back.classList.add('open'); draw.classList.add('open'); }
    function close() { back.classList.remove('open'); draw.classList.remove('open'); }
    btn.addEventListener('click', open);
    back.addEventListener('click', close);
    draw.querySelector('.x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    if (location.hash === '#equipe') open();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
