// Builds the single-page app from web/src into:
//   app/src/main/assets/index.html  (Android, fully offline)
//   dist/gruzzolo.html              (hosted web page fragment)
// No dependencies: run with `node web/build.mjs` from the repository root.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
const src = f => readFileSync(new URL('./src/' + f, import.meta.url), 'utf8');
const css = src('style.css'), i18n = src('i18n.js'), core = src('core.js'), ui = src('ui.js');
const body = `
<div class="app">
  <header class="titlebar"><h1 class="t-xl" id="ttl">Gruzzolo</h1><div class="btns" id="tbtn"></div></header>
  <main id="view"></main>
</div>
<nav class="tabs" aria-label="Sections"><div id="tabs"></div></nav>
<dialog id="sheet" class="sheetdlg"></dialog>
<dialog id="cele" class="popup"></dialog>
<div id="toast" role="status" hidden></div>

<script>
/*CORE-START*/${i18n}${core}/*CORE-END*/
${ui}</script>
`;
const web = `<title>Gruzzolo</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap">
<style>
${css}</style>
${body}`;
const android = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Gruzzolo</title>
<style>
:root{color-scheme:light}
body{margin:0}
img{max-width:100%}
[hidden]{display:none!important}
@font-face{font-family:"Nunito";font-style:normal;font-weight:200 1000;font-display:swap;src:url(fonts/nunito-latin-wght-normal.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Nunito";font-style:normal;font-weight:200 1000;font-display:swap;src:url(fonts/nunito-latin-ext-wght-normal.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
${css}</style></head><body>
${body}</body></html>
`;
const out = p => new URL('../' + p, import.meta.url);
mkdirSync(out('dist/'), {recursive: true});
writeFileSync(out('dist/gruzzolo.html'), web);
writeFileSync(out('app/src/main/assets/index.html'), android);
console.log('built: dist/gruzzolo.html', web.length, 'bytes; app/src/main/assets/index.html', android.length, 'bytes');
