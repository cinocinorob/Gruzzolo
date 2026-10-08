# Gruzzolo

Risparmia giocando: un impegno fisso, medaglie, missioni e le tue spese lette dall'estratto conto.
App Android completamente offline (nessun permesso di rete), in italiano.

*Gamified savings and spending tracker for Android. Fully offline, no network permission. Italian interface.*

## Com'è fatta

- `web/src/` contiene l'app vera e propria: una pagina HTML, CSS e JavaScript senza dipendenze.
- `web/build.mjs` la assembla in `app/src/main/assets/index.html`.
- `app/` è un progetto Android minimo: una sola `Activity` con una `WebView` che mostra la pagina dagli asset.
  Non usa librerie: solo classi del framework Android.
- I dati restano nella memoria privata dell'app (`localStorage` della WebView).

## Compilare

Servono JDK 17, Gradle 8.13 e l'SDK Android (piattaforma 36).

```
node web/build.mjs          # solo se hai modificato web/src
gradle assembleDebug        # APK in app/build/outputs/apk/debug/
```

Su GitHub la compilazione parte da sola a ogni push (`.github/workflows/build.yml`) e l'APK di prova
si scarica dalla pagina dell'esecuzione, sezione Artifacts.

## Pubblicare

I passi per F-Droid sono in `PUBBLICARE.md`.

## Identificativo dell'app

`io.github.cinocinorob.gruzzolo`. Non va più cambiato dopo la prima pubblicazione: per Android un ID diverso è un'altra app.

## Componenti di terze parti inclusi

| Componente | Versione | Licenza | Dove |
|---|---|---|---|
| PDF.js (Mozilla), build `legacy` dal pacchetto npm `pdfjs-dist` | 3.11.174 | Apache-2.0 | `app/src/main/assets/pdfjs/` |
| Carattere Nunito, dal pacchetto npm `@fontsource-variable/nunito` | 5.x | OFL-1.1 | `app/src/main/assets/fonts/` |

## Licenza

GPL-3.0-or-later. Vedi `LICENSE`.

Gruzzolo non è affiliata a N26 né a Revolut: i nomi indicano solo i formati di estratto conto che l'app sa leggere.
