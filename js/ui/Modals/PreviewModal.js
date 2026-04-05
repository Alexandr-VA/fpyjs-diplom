/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor(element) {
    super(element);
    this.content = this.element.find('.content');
    this.registerEvents();
  }

  registerEvents() {
    this.element.find('.header .x.icon').on('click', () => this.close());
    this.content.on('click', (e) => {
      const target = $(e.target);
      if (target.closest('.delete').length) {
        const deleteBtn = target.closest('.delete');
        const path = deleteBtn.data('path');
        const container = deleteBtn.closest('.image-preview-container');
        const icon = deleteBtn.find('i');
        icon.addClass('spinner loading');
        deleteBtn.addClass('disabled');
        Yandex.removeFile(path, (err) => {
          if (!err) {
            container.remove();
          } else {
            alert('Ошибка удаления');
            icon.removeClass('spinner loading');
            deleteBtn.removeClass('disabled');
          }
        });
      }
      if (target.closest('.download').length) {
        const downloadBtn = target.closest('.download');
        const fileUrl = downloadBtn.data('file');
        Yandex.downloadFileByUrl(fileUrl);
      }
    });
  }

  showImages(data) {
    const items = [...data].reverse();
    const html = items.map(item => this.getImageInfo(item)).join('');
    this.content.html(html);
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(' г.', ' г.');
  }

  getImageInfo(item) {
    const sizeKB = (item.size / 1024).toFixed(2);
    const created = this.formatDate(item.created);
    return `
      <div class="image-preview-container">
        <img src="${item.file}" />
        <table class="ui celled table">
          <thead>
            <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
          </thead>
          <tbody>
            <tr><td>${item.name}</td><td>${created}</td><td>${sizeKB} Кб</td></tr>
          </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path="${item.path}">
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file="${item.file}">
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>
    `;
  }
}
