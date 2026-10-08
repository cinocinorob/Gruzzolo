# Pubblicare Gruzzolo su F-Droid

Identificativo dell'app: `io.github.cinocinorob.gruzzolo` (già impostato, non va più cambiato).
Tutti i passi si fanno dal browser.

## 1. Repository pubblico

1. Su GitHub, con l'account `cinocinorob`: New repository, nome `gruzzolo`, visibilità Public,
   senza README, senza .gitignore e senza licenza (sono già in questa cartella).
2. Nel repository vuoto scegli "uploading an existing file" e trascina tutto il contenuto di questa cartella
   (il contenuto, non la cartella stessa). Conferma con "Commit changes".
3. Controlla che tra i file caricati ci siano la cartella `.github` e il file `.gitignore`.
   Su Mac sono nascosti: nel Finder premi Cmd+Maiusc+punto prima di trascinare.
   Senza `.github` la compilazione automatica non parte.

## 2. Prima compilazione e prova sul telefono

1. Apri la scheda Actions del repository: la compilazione parte da sola dopo il caricamento.
2. Se è verde, scarica l'APK di prova dal telefono con questo link diretto e installalo:
   https://github.com/cinocinorob/Gruzzolo/releases/download/test/gruzzolo-test.apk
   Ogni build di prova ha una firma diversa: per installarne una nuova va prima disinstallata la precedente
   (esporta prima la copia di sicurezza).
3. Prova almeno: creare un obiettivo, registrare un versamento, importare un estratto N26 in PDF,
   esportare la copia di sicurezza e ripristinarla, tema scuro, tasto indietro.
4. Se è rossa, il messaggio d'errore è nel log del passo "Build the debug APK".

## 3. Versione 1.0.0

Fatto: la release `1.0.0` punta al commit `556ce6ce8e0587a1b0d0e67f159ba48001970fd1`.
Per le versioni successive: Releases, "Draft a new release", tag uguale al numero di versione (es. `1.0.1`).

## 4. Richiesta a F-Droid

1. Crea un account su gitlab.com e fai il fork di https://gitlab.com/fdroid/fdroiddata
2. Nel fork, cartella `metadata`: New file con nome `io.github.cinocinorob.gruzzolo.yml`, su un ramo nuovo.
   Incolla il contenuto del file che trovi qui in `metadata-fdroid/` (l'hash della versione è già inserito).
   Messaggio del commit: `New App: io.github.cinocinorob.gruzzolo`; nome del ramo: `io.github.cinocinorob.gruzzolo`.
3. Apri una merge request verso `fdroid/fdroiddata` usando il modello "App inclusion" e spunta le voci richieste.
4. Punto da dichiarare nella richiesta: l'app include PDF.js (Apache-2.0) come file JavaScript già costruito,
   preso dal pacchetto npm `pdfjs-dist` 3.11.174, build `legacy` non minificata.
5. Dopo l'approvazione l'app compare nel catalogo al ciclo di compilazione successivo.

## Aggiornamenti successivi

1. Modifica `web/src/`, poi `node web/build.mjs`.
2. In `app/build.gradle` aumenta `versionCode` di 1 e aggiorna `versionName`.
3. Aggiungi `fastlane/metadata/android/<lingua>/changelogs/<versionCode>.txt`.
4. Carica i file modificati e crea una nuova release con tag uguale al numero di versione.
   F-Droid rileva i nuovi tag da solo (`UpdateCheckMode: Tags`).
