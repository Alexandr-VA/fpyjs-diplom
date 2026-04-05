/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element);
    this.content = this.element.find('.content');
    this.registerEvents();
  }

  registerEvents() {
    this.element.find('.header .x.icon, .close.button').on('click', () => this.close());
    this.element.find('.send-all.button').on('click', () => this.sendAllImages());
    
    this.content.on('click', (e) => {
      const target = $(e.target);
      if (target.hasClass('input') || target.closest('.input').length) {
        target.closest('.input').removeClass('error');
      }
      if (target.is('button') || target.closest('button')) {
        const container = target.closest('.image-preview-container');
        if (container) {
          this.sendImage(container);
        }
      }
    });
  }

  showImages(images) {
    const reversed = [...images].reverse();
    const html = reversed.map(url => this.getImageHTML(url)).join('');
    this.content.html(html);
  }

  getImageHTML(item) {
    return `
      <div class="image-preview-container">
        <img src="${item}" />
        <div class="ui action input">
          <input type="text" placeholder="Путь к файлу">
          <button class="ui button"><i class="upload icon"></i></button>
        </div>
      </div>
    `;
  }

  sendAllImages() {
    const containers = this.content.find('.image-preview-container');
    containers.each((i, container) => {
      this.sendImage($(container));
    });
  }

  sendImage(imageContainer) {
    const inputDiv = imageContainer.find('.input');
    const input = inputDiv.find('input');
    const path = input.val().trim();
    if (!path) {
      inputDiv.addClass('error');
      return;
    }
    inputDiv.addClass('disabled');
    const imgSrc = imageContainer.find('img').attr('src');
    Yandex.uploadFile(path, imgSrc, (err, response) => {
      if (err) {
        alert('Ошибка загрузки: ' + err);
        inputDiv.removeClass('disabled');
      } else {
        imageContainer.remove();
        if (this.content.find('.image-preview-container').length === 0) {
          this.close();
        }
      }
    });
  }
}
