// app.js — data fetching, charts, UI, SW registration
import { t, setLang, getLang, i18nInit } from './i18n.js';
import { buildCompareUI } from './compare.js';

const COINGECKO_PRICE = 'https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd,eur&include_market_cap=true&include_24hr_vol=true';
const COINGECKO_CHART = (days=1, vs='usd') => `https://api.coingecko.com/api/v3/coins/ripple/market_chart?vs_currency=${vs}&days=${days}&interval=hourly`;

// Ripple Data API (public)
const RIPPLE_FEES = 'https://data.ripple.com/v2/network/fees';
const RIPPLE_LEDGERS = (limit=200) => `https://data.ripple.com/v2/ledgers?order=desc&limit=${limit}`;

const state = {
  fiat: localStorage.getItem('fiat') || 'usd',
  theme: localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  status: '…', // Live | Cached | Offline | …
  chart: null,
  chartRange: 1,
  lastSource: ''
};

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const fmt = (n, currency) => new Intl.NumberFormat(undefined, currency ? { style: 'currency', currency: currency.toUpperCase() } : {}).format(n);

function setTheme(theme) { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); }
function setStatus(s) { state.status = s; const el = $('#dataStatus'); if (el) el.textContent = `${t('status')}: ${s}`; }

function cacheGet(key, maxAgeMs=60000) {
  try { const raw = sessionStorage.getItem(key); if (!raw) return null; const obj = JSON.parse(raw); if (Date.now() - obj.time > maxAgeMs) return null; return obj.value; } catch { return null; }
}
function cacheSet(key, value) { try { sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), value })); } catch {} }

async function backoffFetch(url, opts={}, tries=3) {
  let lastErr;
  for (let i=0;i<tries;i++) {
    try {
      const res = await fetch(url, { ...opts, cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) { lastErr = e; await new Promise(r => setTimeout(r, 500 * Math.pow(2,i))); }
  }
  throw lastErr;
}

async function loadPrice() {
  const key = `price_${state.fiat}`;
  let data = cacheGet(key);
  if (data) { setStatus('Cached'); return data; }
  try {
    data = await backoffFetch(COINGECKO_PRICE);
    cacheSet(key, data); setStatus('Live'); return data;
  } catch (e) {
    console.warn('Price fetch failed, using mock', e); setStatus('Offline');
    const mock = await (await fetch('./js/mock-data.json')).json(); return mock.price;
  }
}

async function loadChart(days=1) {
  const vs = state.fiat; const key = `chart_${vs}_${days}`;
  let data = cacheGet(key);
  if (data) { setStatus('Cached'); state.lastSource = COINGECKO_CHART(days, vs); return data; }
  try {
    data = await backoffFetch(COINGECKO_CHART(days, vs));
    cacheSet(key, data); setStatus('Live'); state.lastSource = COINGECKO_CHART(days, vs); return data;
  } catch (e) {
    console.warn('Chart fetch failed, using mock', e); setStatus('Offline');
    const mock = await (await fetch('./js/mock-data.json')).json(); state.lastSource = 'mock-data.json'; return mock.chart;
  }
}

function updatePriceBoxes(data) {
  const vs = state.fiat; const coin = data.ripple || {};
  const price = coin?.[vs] ?? 0; const mc = coin?.[${vs}_market_cap]; const vol = coin?.[${vs}_24h_vol];
  $('#priceBox').textContent = fmt(price, vs);
  $('#mc').textContent = mc != null ? fmt(mc, vs) : '—';
  $('#vol').textContent = vol != null ? fmt(vol, vs) : '—';
}

function renderChart(data) {
  const labels = (data.prices || []).map(p => new Date(p[0]));
  const prices = (data.prices || []).map(p => p[1]);
  const table = $('#chartDataTable');
  table.innerHTML = '<thead><tr><th>Time</th><th>Price</th></tr></thead>' +
    '<tbody>' + labels.map((d,i)=>`<tr><td>${d.toLocaleString()}</td><td>${prices[i].toFixed(6)}</td></tr>`).join('') + '</tbody>';
  const ctx = $('#priceChart');
  if (state.chart) state.chart.destroy();
  state.chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: `XRP/${state.fiat.toUpperCase()}`, data: prices, borderWidth: 1, pointRadius: 0 }] },
    options: { responsive: true, animation: false, scales: { x: { display: false } } }
  });
}

function bindUI() {
  const themeToggle = $('#themeToggle'); themeToggle.checked = state.theme === 'dark'; setTheme(state.theme);
  themeToggle.addEventListener('change', () => setTheme(themeToggle.checked ? 'dark' : 'light'));
  const langSelect = $('#langSelect'); langSelect.value = getLang(); langSelect.addEventListener('change', e => setLang(e.target.value));
  const fiat = $('#fiatSelect'); fiat.value = state.fiat; fiat.addEventListener('change', async (e) => {
    state.fiat = e.target.value; localStorage.setItem('fiat', state.fiat);
    const price = await loadPrice(); updatePriceBoxes(price);
    const chart = await loadChart(state.chartRange); renderChart(chart);
  });
  $$('.chart-range').forEach(btn => btn.addEventListener('click', async (e) => {
    $$('.chart-range').forEach(b => b.setAttribute('aria-pressed','false'));
    e.currentTarget.setAttribute('aria-pressed','true');
    const days = Number(e.currentTarget.dataset.range);
    state.chartRange = days;
    const chart = await loadChart(days); renderChart(chart);
  }));
  $('#copySource').addEventListener('click', async () => {
    const text = `${state.lastSource} — ${new Date().toISOString()}`;
    await navigator.clipboard.writeText(text);
    alert(t('copied'));
  });
  $('#backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function renderTimeline() {
  const items = [
    { date: '2012', text: t('tl_2012') },
    { date: '2017', text: t('tl_2017') },
    { date: '2020+', text: t('tl_2020') }
  ];
  $('#timeline').innerHTML = items.map(i => `<li><strong>${i.date}</strong> — ${i.text}</li>`).join('');
  $('#lastUpdated').textContent = `${t('last_updated')} ${new Date().toLocaleDateString()}`;
}

function renderVerifySteps() {
  const steps = [ t('verify_1'), t('verify_2'), t('verify_3'), t('verify_4') ];
  $('#verifySteps').innerHTML = steps.map(s => `<li>${s}</li>`).join('');
}

// On-chain live via Ripple Data API
async function loadOnchain() {
  try {
    const [fees, ledgers] = await Promise.all([
      backoffFetch(RIPPLE_FEES),
      backoffFetch(RIPPLE_LEDGERS(200))
    ]);
    // Fee: median in drops -> XRP
    const medianDrops = fees?.current?.median || fees?.current?.median_fee || null;
    const avgFeeXRP = medianDrops != null ? (medianDrops / 1_000_000) : null;

    // Transactions in last ~15 minutes (approx, based on 200 latest ledgers)
    const now = Date.now();
    const fifteenMin = 15 * 60 * 1000;
    let txCount = 0;
    let tpsPeak = 0;
    (ledgers?.ledgers || []).forEach(l => {
      const t = new Date(l.close_time).getTime();
      if (now - t <= fifteenMin) {
        const c = l.transactions || l.txn_count || l.tx_count || 0;
        txCount += c;
        const interval = l.close_time_resolution || 4; // seconds, heuristic default ~4s
        const tps = interval ? (c / interval) : 0;
        if (tps > tpsPeak) tpsPeak = tps;
      }
    });

    return {
      dailyTxApprox: txCount,
      avgFee: avgFeeXRP,
      tpsPeak: Number(tpsPeak.toFixed(2))
    };
  } catch (e) {
    console.warn('On-chain fetch failed, using mock', e);
    const mock = await (await fetch('./js/mock-data.json')).json();
    return { dailyTxApprox: mock.onchain.dailyTx, avgFee: mock.onchain.avgFee, tpsPeak: mock.onchain.tpsPeak };
  }
}

function renderOnchain(data) {
  $('#txCount').textContent = (data.dailyTxApprox ?? 0).toLocaleString();
  $('#avgFee').textContent = data.avgFee != null ? data.avgFee.toFixed(6) + ' XRP' : '—';
  $('#tpsPeak').textContent = data.tpsPeak != null ? data.tpsPeak.toString() : '—';
}

async function init() {
  await i18nInit();
  bindUI(); renderTimeline(); renderVerifySteps();
  $('#year').textContent = new Date().getFullYear().toString();
  const price = await loadPrice(); updatePriceBoxes(price);
  const chart = await loadChart(state.chartRange); renderChart(chart);
  const onchain = await loadOnchain(); renderOnchain(onchain);
  if ('serviceWorker' in navigator) { try { await navigator.serviceWorker.register('sw.js'); } catch (e) { console.warn('SW failed', e); } }
  setStatus(state.status);
}
init();
