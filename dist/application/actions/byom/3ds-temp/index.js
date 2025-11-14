/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
function buildArticleCard(article) {
  return `
    <div>
      <div>
        <p>${article.title}</p>
      </div>
      <div>
        <p>${article.category}</p>
      </div>
      <div>
        <p>${article.description.html}</p>
      </div>
      <div>
        <picture>
          <source type="image/webp" srcset="https://publish-p34570-e1263228.adobeaemcloud.com${article.image._dynamicUrl}" media="(min-width: 600px)">
          <source type="image/webp" srcset="https://publish-p34570-e1263228.adobeaemcloud.com${article.image._dynamicUrl}">
          <source type="image/jpeg" srcset="https://publish-p34570-e1263228.adobeaemcloud.com${article.image._dynamicUrl}" media="(min-width: 600px)">
          <img loading="lazy" alt="Smart Cities and Infrastructure: Building Tomorrow's Urban Environments with Digital Continuity" src="https://publish-p34570-e1263228.adobeaemcloud.com${article.image._dynamicUrl}" width="2048" height="1127">
        </picture>
      </div>
    </div>
  `;
}

async function fetchArticles(host, site, lang) {
  const GRAPHQL_ENDPOINT = `${host}/graphql/execute.json/${site}/articles-all;fullPath=/content/dam/${site}/fragments/`;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT + lang, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    const data = await response.json();
    return data.data.articleList.items || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

function extractPathElement(path, position) {
  const parts = path.split('/').filter(part => part !== '');
  return parts.length > position ? parts[position -1] : null;
}

async function main (params) {
  const path = params['__ow_path'];
  const headers = params['__ow_headers'];

  if (path && !path.endsWith('/pages/articles')) {
    return {
      statusCode: 404
    }
  }

  const site = extractPathElement(headers['x-content-source-location'], 2);
  const lang = extractPathElement(path, 2) || 'en';
  const locale = lang === 'en' ? 'us/en' : `${lang}/${lang}`;

  // Fetch the template HTML
  const templateResponse = await fetch(`https://main--${site}--fornacif.aem.live/${locale}/templates/articles.plain.html`);
  let templateHTML = await templateResponse.text();

  const articles = await fetchArticles(params.aemPublishHost, site, lang);

  let articlesHTML = '<div>No articles found.</div>';

  if (articles.length === 0) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: { articlesHTML}
    }
  }

  articlesHTML = articles.map(article => buildArticleCard(article)).join('');

  const articlesRegex = /(<div class="articles">)([\s\S]*?)(<\/div>)/;
  templateHTML = templateHTML.replace(articlesRegex, `$1${articlesHTML}$3`);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: `<main>${templateHTML}</main>`
  }
}

exports.main = main

})();

module.exports = __webpack_exports__;
/******/ })()
;