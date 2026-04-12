/**
 * Основная функция для совершения запросов по Yandex API.
 * */

const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  let url = options.url;

  // Все параметры data добавляем в URL (для GET, POST, DELETE, PUT)
  if (options.data) {
    const params = new URLSearchParams(options.data).toString();
    if (params) {
      url += (url.includes('?') ? '&' : '?') + params;
    }
  }

  xhr.open(options.method, url);
  xhr.responseType = 'json';

  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      xhr.setRequestHeader(key, value);
    }
  }

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      options.callback(null, xhr.response);
    } else {
      // Передаём объект ошибки с деталями
      const error = new Error(`Ошибка ${xhr.status}: ${xhr.statusText}`);
      error.status = xhr.status;
      error.response = xhr.response;
      options.callback(error, null);
    }
  };

  xhr.onerror = () => {
    options.callback(new Error('Сетевая ошибка – проверьте соединение'), null);
  };

  xhr.send(null);
};
