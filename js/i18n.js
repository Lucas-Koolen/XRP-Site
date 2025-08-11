// i18n.js — minimal bilingual strings
let current = localStorage.getItem('lang') || 'nl';
const dict = {
  nl: {
    status: 'Status',
    hero_title: 'XRP, helder uitgelegd — zonder hype',
    hero_sub: 'Feitelijke info over XRP & het XRP Ledger (XRPL): technologie, tokenomics, live koersgrafieken met nette fallback, en veelgestelde vragen.',
    disclaimer: 'Disclaimer: dit is geen financieel advies. Doe altijd je eigen onderzoek.',
    nav_overview: 'Overzicht', nav_tech: 'Technologie', nav_tokenomics: 'Tokenomics', nav_market: 'Koers', nav_onchain: 'On-chain', nav_faq: 'FAQ', nav_sources: 'Bronnen',
    overview_title: 'Overzicht XRP', overview_text: 'XRP is een digitale asset die werkt op het XRP Ledger (XRPL). Het netwerk is ontworpen voor snelle, goedkope waardetransfers. Belangrijk: XRP (de asset) staat los van Ripple (het bedrijf). Deze site biedt neutrale, samengebalanseerde info.',
    history_title: 'Geschiedenis & tijdlijn',
    last_updated: 'Laatst bijgewerkt:',
    tech_title: 'Technologie (XRPL)',
    how_verify_title: 'How to verify: zelf XRPL-transacties bekijken',
    verify_1: 'Open een betrouwbare XRPL block explorer in een nieuw tabblad.',
    verify_2: 'Plak een transactie-hash of adres in de zoekbalk.',
    verify_3: 'Controleer tijdstempel, bedrag, fee en status op de detailpagina.',
    verify_4: 'Vergelijk desgewenst meerdere explorers voor consistentie.',
    ripple_xrp_title: 'Ripple vs. XRP',
    ripple_xrp_text: 'Ripple is een bedrijf dat betalingsoplossingen ontwikkelt; XRP is de onafhankelijke digitale asset die op het XRPL werkt. Ze zijn gerelateerd in geschiedenis, maar niet hetzelfde.',
    tokenomics_title: 'Tokenomics',
    market_title: 'Koers & marktdaten',
    price_current: 'Huidige prijs', market_cap: 'Marktkapitalisatie', volume_24h: 'Volume (24h)', chart_title: 'Grafiek 24h / 7d / 30d',
    copy_source: 'Kopieer bronvermelding', copied: 'Gekopieerd naar klembord',
    onchain_title: 'On-chain statistieken', onchain_tx: 'Transacties (laatste ~15 min)', onchain_fee: 'Gem. fee (median)', onchain_tps: 'Geschatte TPS piek (recent)', onchain_note: 'On-chain cijfers komen live via Ripple Data API. Als een endpoint faalt, tonen we een nette fallback met uitleg.',
    compare_title: 'Vergelijk XRP met andere assets', compare_pick: 'Kies asset', compare_run: 'Vergelijk',
    risks_title: 'Risico’s', sources_title: 'Bronnen & verdere lectuur',
    license_text: 'Code MIT; tekst CC BY-SA 4.0. Geen financieel advies.',
    metric: 'Metric', metric_speed: 'Snelheid', metric_fee: 'Kosten', metric_finality: 'Finaliteit', metric_energy: 'Energieverbruik', metric_adoption: 'Adoptie',
    tl_2012: 'Start van de XRPL-ontwikkeling en vroege geschiedenis van de asset.',
    tl_2017: 'Brede bekendheid; infrastructuur en liquiditeit nemen toe.',
    tl_2020: 'Doorontwikkeling van tooling en use-cases; technologische verfijningen.'
  },
  en: {
    status: 'Status',
    hero_title: 'XRP, explained clearly — no hype',
    hero_sub: 'Factual info about XRP & the XRP Ledger (XRPL): technology, tokenomics, live charts with graceful fallback, and FAQs.',
    disclaimer: 'Disclaimer: this is not financial advice. Always do your own research.',
    nav_overview: 'Overview', nav_tech: 'Technology', nav_tokenomics: 'Tokenomics', nav_market: 'Market', nav_onchain: 'On-chain', nav_faq: 'FAQ', nav_sources: 'Sources',
    overview_title: 'XRP Overview', overview_text: 'XRP is a digital asset that runs on the XRP Ledger (XRPL). The network is designed for fast, low-cost value transfer. Important: XRP (the asset) is separate from Ripple (the company). This site provides neutral, balanced info.',
    history_title: 'History & timeline',
    last_updated: 'Last updated:',
    tech_title: 'Technology (XRPL)',
    how_verify_title: 'How to verify: inspect XRPL transactions yourself',
    verify_1: 'Open a reputable XRPL block explorer in a new tab.',
    verify_2: 'Paste a transaction hash or address into the search bar.',
    verify_3: 'Check timestamp, amount, fee and status on the detail page.',
    verify_4: 'Optionally compare multiple explorers for consistency.',
    ripple_xrp_title: 'Ripple vs. XRP',
    ripple_xrp_text: 'Ripple is a company building payment solutions; XRP is the independent digital asset that runs on the XRPL. Related historically, but not the same.',
    tokenomics_title: 'Tokenomics',
    market_title: 'Price & market data',
    price_current: 'Current price', market_cap: 'Market cap', volume_24h: 'Volume (24h)', chart_title: 'Chart 24h / 7d / 30d',
    copy_source: 'Copy source', copied: 'Copied to clipboard',
    onchain_title: 'On-chain statistics', onchain_tx: 'Transactions (~last 15 min)', onchain_fee: 'Avg. fee (median)', onchain_tps: 'Estimated TPS peak (recent)', onchain_note: 'On-chain figures come live from Ripple Data API. If an endpoint fails, we show a clear fallback.',
    compare_title: 'Compare XRP with other assets', compare_pick: 'Pick asset', compare_run: 'Compare',
    risks_title: 'Risks', sources_title: 'Sources & further reading',
    license_text: 'Code MIT; text CC BY-SA 4.0. No financial advice.',
    metric: 'Metric', metric_speed: 'Speed', metric_fee: 'Fees', metric_finality: 'Finality', metric_energy: 'Energy use', metric_adoption: 'Adoption',
    tl_2012: 'Start of XRPL development and early asset history.',
    tl_2017: 'Broader awareness; infrastructure and liquidity increased.',
    tl_2020: 'Further tooling/use-case development; technological refinements.'
  }
};
export function t(key){ return (dict[current] && key in dict[current]) ? dict[current][key] : key; }
export function setLang(lang){ current = lang; localStorage.setItem('lang', lang); document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); }); }
export function getLang(){ return current; }
export async function i18nInit(){ setLang(current); }
