/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
function extractPathElement(path, position) {
  const parts = path.split('/').filter(part => part !== '');
  return parts.length > position ? parts[position -1] : null;
}

const main = async params => {
  const site = params.site;
  const path = params.data.path;
  const lang = extractPathElement(path, 5);
  const locale = lang === 'en' ? 'us/en' : `${lang}/${lang}`;

  await fetch(`https://admin.hlx.page/preview/fornacif/${site}/main/${locale}/pages/articles`, {
    method: 'POST',
    headers: {
      'X-Auth-Token': params.aemAdminApiKey
    }
  });

  await fetch(`https://admin.hlx.page/live/fornacif/${site}/main/${locale}/pages/articles`, {
    method: 'POST',
    headers: {
      'X-Auth-Token': params.aemAdminApiKey
    }
  });
};

exports.main = main

})();

module.exports = __webpack_exports__;
/******/ })()
;