function extractPathElement(path, position) {
  const parts = path.split('/').filter(part => part !== '');
  return parts.length > position ? parts[position -1] : null;
}

const main = async params => {
  const site = params.site;
  const path = params.data.path;

  if (!path || !path.includes(`/${site}/`)) {
    return; 
  }

  let lang = 'en';
  
  if (path.startsWith(`/content/${site}/`)) {
    lang = extractPathElement(path, 4);
  } else {
    lang = extractPathElement(path, 5);
  }
  
  const locale = lang === 'en' ? 'us/en' : `${lang}/${lang}`;

  let pageName = '';
  if (path.includes('/articles')) {
    pageName = 'articles';
  } else if (path.includes('/products')) {
    pageName = 'products';
  } else {
    return;
  }

  await fetch(`https://admin.hlx.page/preview/fornacif/${site}/main/${locale}/pages/${pageName}`, {
    method: 'POST',
    headers: {
      'X-Auth-Token': params.aemAdminApiKey
    }
  });

  await fetch(`https://admin.hlx.page/live/fornacif/${site}/main/${locale}/pages/${pageName}`, {
    method: 'POST',
    headers: {
      'X-Auth-Token': params.aemAdminApiKey
    }
  });
};

exports.main = main
