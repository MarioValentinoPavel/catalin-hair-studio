/* CatalinHairStudio — el fondo se aclara del nivel 1 al 10 y simulador de matiz */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- Booksy en todos los botones de reserva ---------- */
const BOOKSY = 'https://booksy.com/es-es/1073_catalinhairstudio_peluqueria_50340_blanes?do=invite&_branch_match_id=1627596490913923446&utm_medium=merchant_customer_invite&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXT07J0UvKz88urtRLzs/V94nINPP1tzTwiEqyrytKTUstKsrMS49PKsovL04tsnXOKMrPTQUAC5ZZYTwAAAA=';
$$('.booksy').forEach(a => a.href = BOOKSY);

/* ---------- escala de niveles ---------- */
const LV = [
  [1, '#141110', 'Negro'], [2, '#241915', 'Castaño muy oscuro'], [3, '#3a281d', 'Castaño oscuro'], [4, '#553824', 'Castaño medio'],
  [5, '#74502f', 'Castaño claro'], [6, '#95693f', 'Rubio oscuro'], [7, '#b98b58', 'Rubio medio'], [8, '#d5ae78', 'Rubio claro'],
  [9, '#e9d1a2', 'Rubio muy claro'], [10, '#f8f0de', 'Platino']
];
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function colorAt(v) { // v de 1 a 10
  const i = Math.min(8, Math.floor(v - 1)), t = v - 1 - i;
  const a = hex(LV[i][1]), b = hex(LV[i + 1][1]);
  return a.map((x, k) => Math.round(x + (b[k] - x) * t));
}
function setLevel(v) {
  const c = colorAt(v);
  document.body.style.background = `rgb(${c.join(',')})`;
  const lum = (c[0] * .299 + c[1] * .587 + c[2] * .114);
  document.body.style.color = lum > 140 ? '#2a2018' : '#f6ecd6';
  const n = Math.round(v);
  $('#levelN').textContent = n; $('#levelName').textContent = LV[n - 1][2];
  $('#levelBar').style.left = ((v - 1) / 9 * 136) + 'px';
}
setLevel(1);
ScrollTrigger.create({ trigger: 'main', start: 'top top', end: 'bottom bottom', onUpdate: s => setLevel(1 + s.progress * 9) });

/* ---------- entrada: contador de nivel 1 → 10 ---------- */
(function counter() {
  const box = $('#count'), num = $('#countNum'), st = { v: 1 };
  document.documentElement.style.overflow = 'hidden';
  gsap.timeline({ onComplete: () => { box.remove(); document.documentElement.style.overflow = ''; } })
    .to(st, { v: 10, duration: 1.6, ease: 'power2.in', onUpdate: () => { const c = colorAt(st.v); box.style.background = `rgb(${c.join(',')})`; box.style.color = st.v > 6.5 ? '#2a2018' : '#f6ecd6'; num.textContent = Math.floor(st.v); } })
    .to(box, { clipPath: 'circle(0% at 50% 50%)', duration: .9, ease: 'expo.inOut' }, '+=.25')
    .from('.lv[data-lv="1"] > *', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1 }, '-=.4');
})();

/* ---------- simulador de matiz ---------- */
(function toner() {
  const r = $('#toner'), tone = $('#tone'), name = $('#tonerName');
  const N = ['Dorado', 'Miel', 'Beige perla', 'Perla', 'Ceniza'];
  const apply = () => {
    const v = r.value / 100;
    const warm = [245, 190, 70], cool = [150, 140, 220];
    const c = warm.map((w, i) => Math.round(w + (cool[i] - w) * v));
    tone.style.background = `rgb(${c.join(',')})`;
    tone.style.opacity = (.22 + Math.abs(v - .5) * .5).toFixed(2);
    name.textContent = N[Math.min(4, Math.floor(v * 5))];
  };
  r.addEventListener('input', apply); apply();
})();

/* ---------- apariciones ---------- */
$$('.lv:not([data-lv="1"]) > *, .duo img, .cards article, .quotes blockquote').forEach(n => gsap.from(n, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: n, start: 'top 88%' } }));
