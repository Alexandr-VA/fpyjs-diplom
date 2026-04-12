/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element);
    this.content = this.element.find('.content');
    this.sendAllButton = this.element.find('.send-all.button');
    this.registerEvents();
  }

  registerEvents() {
    this.element.find('.header .x.icon, .close.button').on('click', () => this.close());
    this.sendAllButton.on('click', () => this.sendAllImages());
    
    this.content.on('click', (e) => {
      const target = $(e.target);
      if (target.hasClass('input') || target.closest('.input').length) {
        target.closest('.input').removeClass('error');
      }
      if (target.is('button') || target.closest('button')) {
        const container = target.closest('.image-preview-container');
        if (container) {
          this.sendImage($(container));
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

  async sendAllImages() {
    this.sendAllButton.addClass('disabled');
    const containers = [...this.content.find('.image-preview-container')];
    
    for (const container of containers) {
      await new Promise((resolve) => {
        this.sendImage($(container), resolve);
      });
    }
    
    this.sendAllButton.removeClass('disabled');
  }

  sendImage(imageContainer, callback = null) {
    const inputDiv = imageContainer.find('.input');
    const input = inputDiv.find('input');
    const button = inputDiv.find('button');
    const path = input.val().trim();
    
    if (!path) {
      inputDiv.addClass('error');
      alert('Укажите путь к файлу на Яндекс.Диске');
      if (callback) callback();
      return;
    }
    
    input.prop('disabled', true);
    button.addClass('disabled');
    inputDiv.removeClass('error');
    
    const imgSrc = imageContainer.find('img').attr('src');
    Yandex.uploadFile(path, imgSrc, (err, response) => {
      input.prop('disabled', false);
      button.removeClass('disabled');
      
      if (err) {
        alert(err.message); // информативное сообщение (например, "уже существует")
        inputDiv.addClass('error');
      } else {
        imageContainer.remove();
        if (this.content.find('.image-preview-container').length === 0) {
          this.close();
        }
      }
      
      if (callback) callback();
    });
  }
}
