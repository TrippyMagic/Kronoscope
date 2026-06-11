# AGENTS.md

## Ambito

Queste istruzioni valgono per l'intero repository Kronoscope.

## Principi di lavoro

- Mantieni le decisioni architetturali esistenti: React, Vite, routing corrente, ownership tramite context e modello Timeline canvas piu overlay accessibile.
- Preserva route pubbliche, storage keys, shape degli hook di context, URL dei data file e contratto `TimelineEvent`, salvo bug esplicitamente corretti.
- Applica SOLID dove ci sono confini OOP o servizi con responsabilita distinte.
- Preferisci moduli piccoli, helper puri e separazione delle responsabilita rispetto ad astrazioni ampie.
- Suggerisci design pattern solo quando riducono davvero coupling, duplicazione o complessita.
- Usa primitive esistenti in `src/ui`, context esistenti e token CSS correnti prima di introdurre nuove superfici.
- Non aggiungere nuove directory senza una richiesta esplicita.
- Mantieni i commenti rari e utili: solo per comportamento non ovvio.

## Invarianti runtime

- `/personalize` resta compatibile come redirect per bookmark esistenti.
- La Timeline 2D usa canvas con overlay accessibile; non ripristinare vecchi marker DOM.
- La modalita 3D resta opzionale, lazy e protetta dai controlli WebGL.
- L'accesso a `localStorage` deve passare da helper sicuri quando possibile.
- I JSON pubblici vanno normalizzati prima di entrare nei tipi dominio.
- Stati di loading, empty ed error devono restare coerenti tra le schermate.

## Documentazione

- `/docs` descrive solo il sistema corrente: contratti, invarianti, architettura e limiti noti.
- `/specs` contiene solo lavoro futuro: work package, piani di migrazione, refactor e miglioramenti.
- Il README root deve restare breve e puntare alla documentazione mantenuta.
- Evita di duplicare conteggi test, baseline storiche o note di fase.

## Verifiche

Usa questi controlli prima di consegnare modifiche strutturali:

```bash
npm.cmd run lint
npm.cmd test -- --run
npm.cmd run test:e2e
npm.cmd run build
```
