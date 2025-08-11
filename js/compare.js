// compare.js — simple client-side compare tool
import { t } from './i18n.js';
const METRICS = ['speed', 'fee', 'finality', 'energy', 'adoption'];
const DATA = {
  XRP: { speed: 'snel', fee: 'zeer laag', finality: 'snel', energy: 'laag', adoption: 'hoog (betalingsrail niche)' },
  BTC: { speed: 'traag', fee: 'wisselend/hoog', finality: 'trager', energy: 'hoog', adoption: 'zeer hoog' },
  ETH: { speed: 'gemiddeld', fee: 'wisselend', finality: 'snel (PoS)', energy: 'lager (PoS)', adoption: 'zeer hoog' },
  ADA: { speed: 'gemiddeld', fee: 'laag', finality: 'gemiddeld', energy: 'laag', adoption: 'gemiddeld' }
};
function optionHtml(v) { return `<option value="${v}">${v}</option>`; }
export function buildCompareUI() {
  const selA = document.getElementById('assetA');
  const selB = document.getElementById('assetB');
  const res = document.getElementById('compareResult');
  selA.innerHTML = Object.keys(DATA).map(optionHtml).join('');
  selB.innerHTML = Object.keys(DATA).map(optionHtml).join('');
  document.getElementById('runCompare').addEventListener('click', () => {
    const a = selA.value, b = selB.value;
    const rows = METRICS.map(m => `<tr><th>${t('metric_'+m)}</th><td>${DATA[a][m]}</td><td>${DATA[b][m]}</td></tr>`).join('');
    res.innerHTML = `<table class="data-table"><thead><tr><th>${t('metric')}</th><th>${a}</th><th>${b}</th></tr></thead><tbody>${rows}</tbody></table>`;
  });
}
buildCompareUI();
