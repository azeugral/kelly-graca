(function () {
  'use strict';
  var d = document, WA = '41766876027', LI = { pt: 0, fr: 1, de: 2 }, lang = 'pt';
  var TIT = {}; OBRAS.forEach(function (o) { TIT[o[0]] = o[2]; });

  /* idioma */
  var PT = {};
  d.querySelectorAll('[data-t]').forEach(function (el) { PT[el.dataset.t] = el.innerHTML; });
  d.querySelectorAll('[data-tp]').forEach(function (el) { PT[el.dataset.tp] = el.placeholder; });
  function t(k) { var v = (I18N[lang] || {})[k]; return v != null ? v : (PT[k] != null ? PT[k] : I18N.pt[k]); }
  function aplica(l) {
    lang = I18N[l] ? l : 'pt';
    d.documentElement.lang = { pt: 'pt-PT', fr: 'fr', de: 'de' }[lang];
    d.querySelectorAll('[data-t]').forEach(function (el) { el.innerHTML = t(el.dataset.t); });
    d.querySelectorAll('[data-tp]').forEach(function (el) { el.placeholder = t(el.dataset.tp); });
    d.querySelectorAll('.linguas button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang); });
    try { localStorage.setItem('kg-lang', lang); } catch (e) {}
    if (at >= 0) qNome.textContent = TIT[HERO[at][0]][LI[lang]];
    montar();
  }
  d.querySelectorAll('.linguas button').forEach(function (b) {
    b.addEventListener('click', function () {
      aplica(b.dataset.lang);
      var u = new URL(location.href); u.searchParams.set('lang', lang); history.replaceState(null, '', u);
    });
  });

  /* topo */
  var topo = d.getElementById('topo');
  function rolou() { topo.classList.toggle('cheio', window.scrollY > 30); }
  window.addEventListener('scroll', rolou, { passive: true }); rolou();
  var burger = d.getElementById('burger'), gaveta = d.getElementById('gaveta');
  function gav(ab) { gaveta.hidden = !ab; burger.setAttribute('aria-expanded', ab); d.body.classList.toggle('trava', ab); }
  burger.addEventListener('click', function () { gav(gaveta.hidden); });
  gaveta.addEventListener('click', function (e) { if (e.target.closest('a')) gav(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !gaveta.hidden) gav(false); });

  /* HERO: cada retrato começa no olhar e afasta até a peça inteira, ciclo de 5 s */
  var tela = d.getElementById('qTela'), qNome = d.getElementById('qNome'), at = -1, camadas = [];
  HERO.forEach(function (h, i) {
    var im = d.createElement('img');
    im.src = 'img/hero/' + h[0] + '.webp'; im.alt = ''; im.width = 1400; im.height = 1750;
    im.className = 'q-p'; im.style.transformOrigin = (h[1] * 100) + '% ' + (h[2] * 100) + '%';
    if (i > 0) im.decoding = 'async';
    tela.appendChild(im); camadas.push(im);
  });
  tela.setAttribute('role', 'img'); tela.setAttribute('aria-label', 'Tatuagens de Kelly Graça');
  function proximo() {
    if (at >= 0) { var v = camadas[at]; v.classList.remove('on'); v.classList.add('sai'); setTimeout(function () { v.classList.remove('sai'); }, 700); }
    at = (at + 1) % camadas.length;
    var n = camadas[at]; void n.offsetWidth; n.classList.add('on');
    qNome.style.opacity = 0;
    setTimeout(function () { qNome.textContent = TIT[HERO[at][0]][LI[lang]]; qNome.style.opacity = 1; }, 260);
  }
  var timer;
  function liga() { clearInterval(timer); timer = setInterval(proximo, 5000); }
  setTimeout(function () { proximo(); liga(); }, 250);
  d.addEventListener('visibilitychange', function () { if (d.hidden) clearInterval(timer); else liga(); });

  /* portfólio */
  var grade = d.getElementById('grade'), mais = d.getElementById('mais'), filtro = 'todos', lim = 24, lista = [];
  function montar() {
    lista = OBRAS.filter(function (o) { return filtro === 'todos' || o[1] === filtro; });
    grade.innerHTML = '';
    lista.slice(0, lim).forEach(function (o, i) {
      var f = d.createElement('figure'); f.className = 'peca';
      f.innerHTML = '<img src="img/p/' + o[0] + '.webp" alt="' + o[2][LI[lang]] + '" width="720" height="900" draggable="false">';
      f.addEventListener('click', function () { abrirLista(lista.map(function (x) { return ['img/g/' + x[0] + '.webp', x[2][LI[lang]], x[1]]; }), i); });
      grade.appendChild(f);
    });
    mais.hidden = lista.length <= lim;
  }
  d.querySelectorAll('.filtros button').forEach(function (b) {
    b.addEventListener('click', function () {
      d.querySelectorAll('.filtros button').forEach(function (x) { x.classList.toggle('on', x === b); });
      filtro = b.dataset.f; lim = 24; montar();
      grade.animate && grade.animate([{ opacity: .2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.16,.84,.32,1)' });
    });
  });
  mais.addEventListener('click', function () { lim += 24; montar(); });

  /* lightbox */
  var lb = d.getElementById('lb'), lbImg = d.getElementById('lbImg'), lbCap = d.getElementById('lbCap'), LL = [], li = 0;
  function mostrar() { lbImg.src = LL[li][0]; lbImg.alt = LL[li][1]; lbCap.textContent = LL[li][1]; d.getElementById('lbP').hidden = d.getElementById('lbS').hidden = LL.length < 2; }
  function abrirLista(l, i) { LL = l; li = i; mostrar(); lb.hidden = false; d.body.style.overflow = 'hidden'; }
  function fechar() { lb.hidden = true; d.body.style.overflow = ''; }
  d.getElementById('lbX').addEventListener('click', fechar);
  d.getElementById('lbP').addEventListener('click', function () { li = (li - 1 + LL.length) % LL.length; mostrar(); });
  d.getElementById('lbS').addEventListener('click', function () { li = (li + 1) % LL.length; mostrar(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) fechar(); });
  d.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'ArrowLeft') d.getElementById('lbP').click();
    if (e.key === 'ArrowRight') d.getElementById('lbS').click();
  });
  var ESTILO = { retrato: 'Retrato', mito: 'Mitologia / estátua', animal: 'Animal', fina: 'Fine line / ornamental' };
  d.getElementById('lbQuero').addEventListener('click', function () {
    var it = LL[li]; fechar(); pedir(ESTILO[it[2]], t('msg.quero') + it[1]);
  });

  /* formulário → WhatsApp */
  var form = d.getElementById('form'), erro = d.getElementById('erro');
  function marcar(nome, valor) { var r = form.querySelector('input[name="' + nome + '"][value="' + valor + '"]'); if (r) r.checked = true; }
  function pedir(estilo, ideia) {
    if (estilo) marcar('estilo', estilo);
    if (ideia) form.ideia.value = ideia;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  d.querySelectorAll('[data-estilo]').forEach(function (a) { a.addEventListener('click', function () { marcar('estilo', a.dataset.estilo); }); });
  d.querySelectorAll('[data-cidade]').forEach(function (a) { a.addEventListener('click', function () { marcar('cidade', a.dataset.cidade); }); });
  form.nome.addEventListener('input', function () { if (form.nome.value.trim()) erro.hidden = true; });
  function rotulo(nome) { var r = form.querySelector('input[name="' + nome + '"]:checked'); return r ? r.nextElementSibling.textContent : ''; }
  function opcao(sel) { return sel.options[sel.selectedIndex].textContent; }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = form.nome.value.trim();
    if (!nome) { erro.hidden = false; form.nome.focus(); return; }
    var l = [t('msg.ola').replace('{n}', nome), ''];
    l.push('*' + t('msg.estilo') + ':* ' + rotulo('estilo'));
    l.push('*' + t('msg.cidade') + ':* ' + rotulo('cidade'));
    if (form.local.value.trim()) l.push('*' + t('msg.local') + ':* ' + form.local.value.trim());
    l.push('*' + t('msg.tam') + ':* ' + opcao(form.tamanho));
    l.push('*' + t('msg.quando') + ':* ' + opcao(form.quando));
    if (form.ideia.value.trim()) l.push('*' + t('msg.ideia') + ':* ' + form.ideia.value.trim());
    l.push('', t('msg.site'));
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(l.join('\n')), '_blank', 'noopener');
  });

  /* idioma inicial: ?lang= > guardado > navegador */
  var q = new URLSearchParams(location.search).get('lang'), g = null;
  try { g = localStorage.getItem('kg-lang'); } catch (e) {}
  var nav = (navigator.language || 'pt').slice(0, 2);
  aplica(q || g || (I18N[nav] && nav !== 'pt' ? nav : 'pt'));

  /* entrada ao rolar */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  d.querySelectorAll('.rev').forEach(function (el) { io ? io.observe(el) : el.classList.add('vis'); });
})();
