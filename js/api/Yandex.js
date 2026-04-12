class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  static getToken() {
    let token = localStorage.getItem('yandex_token');
    if (!token || token === 'null') {
      token = prompt('Введите токен Яндекс.Диска');
      if (token && token !== 'null') {
        localStorage.setItem('yandex_token', token);
      } else {
        return null;
      }
    }
    return token;
  }

  static uploadFile(path, url, callback) {
    const token = this.getToken();
    if (!token) {
      callback(new Error('Токен не получен. Авторизуйтесь.'));
      return;
    }
    createRequest({
      method: 'POST',
      url: `${this.HOST}/resources/upload`,
      data: { path, url },
      headers: { 'Authorization': `OAuth ${token}` },
      callback: (err, response) => {
        if (err) {
          // Уточняем сообщение об ошибке
          const apiErr = err.response?.error;
          if (err.status === 409 && apiErr === 'DiskResourceAlreadyExistsError') {
            callback(new Error(`Не удалось загрузить файл: файл по пути "${path}" уже существует.`));
          } else if (err.status === 400) {
            callback(new Error(`Неверный запрос: возможно, недопустимые символы в пути "${path}".`));
          } else {
            callback(new Error(`Ошибка загрузки: ${err.message}`));
          }
        } else {
          callback(null, response);
        }
      }
    });
  }

  static removeFile(path, callback) {
    const token = this.getToken();
    if (!token) {
      callback(new Error('Токен не получен. Авторизуйтесь.'));
      return;
    }
    createRequest({
      method: 'DELETE',
      url: `${this.HOST}/resources`,
      data: { path },
      headers: { 'Authorization': `OAuth ${token}` },
      callback: (err, response) => {
        if (err) {
          if (err.status === 404) {
            callback(new Error(`Файл не найден: ${path}`));
          } else {
            callback(new Error(`Ошибка удаления: ${err.message}`));
          }
        } else {
          callback(null, response);
        }
      }
    });
  }

  static getUploadedFiles(callback) {
    const token = this.getToken();
    if (!token) {
      callback(new Error('Токен не получен. Авторизуйтесь.'));
      return;
    }
    createRequest({
      method: 'GET',
      url: `${this.HOST}/resources/files`,
      headers: { 'Authorization': `OAuth ${token}` },
      callback: (err, response) => {
        if (err) {
          callback(new Error(`Не удалось получить список файлов: ${err.message}`));
        } else if (!response || !response.items) {
          callback(new Error('Неожиданный ответ от сервера: отсутствуют данные.'));
        } else {
          callback(null, response);
        }
      }
    });
  }

  static downloadFileByUrl(url) {
    const a = document.createElement('a');
    a.href = url;
    const fileName = url.split('/').pop()?.split('?')[0] || 'download';
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
