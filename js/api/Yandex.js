/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  static getToken() {
    let token = localStorage.getItem('yandex_token');
    if (!token) {
      token = prompt('Введите токен Яндекс.Диска');
      if (token) localStorage.setItem('yandex_token', token);
    }
    return token;
  }

  static uploadFile(path, url, callback) {
    const token = this.getToken();
    if (!token) {
      callback('Токен не получен');
      return;
    }
    createRequest({
      method: 'POST',
      url: `${this.HOST}/resources/upload`,
      data: { path: path, url: url },
      headers: { 'Authorization': `OAuth ${token}` },
      callback: (err, response) => {
        if (err) callback(err);
        else callback(null, response);
      }
    });
  }

  static removeFile(path, callback) {
    const token = this.getToken();
    if (!token) {
      callback('Токен не получен');
      return;
    }
    createRequest({
      method: 'DELETE',
      url: `${this.HOST}/resources`,
      data: { path: path },
      headers: { 'Authorization': `OAuth ${token}` },
      callback: (err, response) => callback(err, response)
    });
  }

  static getUploadedFiles(callback) {
    const token = this.getToken();
    if (!token) {
      callback('Токен не получен');
      return;
    }
    createRequest({
      method: 'GET',
      url: `${this.HOST}/resources/files`,
      headers: { 'Authorization': `OAuth ${token}` },
      callback: (err, response) => callback(err, response)
    });
  }

  static downloadFileByUrl(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
