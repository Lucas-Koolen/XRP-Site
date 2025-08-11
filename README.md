# XRP Info — Statische site (GitHub Pages)

Deze map is 1:1 te uploaden naar een **public** GitHub-repo. Zet Pages aan op de `main` branch (root).

## Wat werkt live
- **Koers + grafiek**: CoinGecko (client-side fetch, met 60s cache + backoff).
- **On-chain**: Ripple Data API — median fee (drops → XRP) en transacties + geschatte TPS op basis van de laatste ~200 ledgers (~15 min venster).

## Geen extra assets nodig
- Favicon is inline als data-URL.
- Manifest zonder icons (optioneel later toevoegen).

## Service Worker
- Relatieve paden zodat het zowel op `https://<username>.github.io/` als `https://<username>.github.io/<repo>/` werkt.
- Werk cache-bust door `CACHE`-naam in `sw.js` te verhogen.

## Lokaal testen
Sommige browsers blokkeren ES Modules/SW bij `file://`. Start een simpel servertje:
```bash
python -m http.server 8000
# open http://localhost:8000
```

Gegenereerd: 2025-08-11T10:31:03.618101Z
