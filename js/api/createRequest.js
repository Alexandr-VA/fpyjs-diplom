/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  let url = options.url;
  if (options.data && options.method === 'GET') {
    const params = new URLSearchParams(options.data).toString();
    url += (url.includes('?') ? '&' : '?') + params;
  }
  xhr.open(options.method, url);
  xhr.responseType = 'json';
  if (options.headers) {
    for (let [key, value] of Object.entries(options.headers)) {
      xhr.setRequestHeader(key, value);
    }
  }
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      options.callback(null, xhr.response);
    } else {
      options.callback(xhr.response, null);
    }
  };
  xhr.onerror = () => {
    options.callback(new Error('Network error'), null);
  };
  let body = null;
  if (options.data && options.method !== 'GET') {
    body = new URLSearchParams(options.data).toString();
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  try {
    xhr.send(body);
  } catch (err) {
    options.callback(err, null);
  }
};
