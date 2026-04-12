/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor(element) {
    this.element = element;
    this.previewImg = element.querySelector('.six.wide.column img');
    this.imagesRow = element.querySelector('.images-list .image-row') ||
                     element.querySelector('.images-list .row:first-of-type');
    this.selectAllBtn = element.querySelector('.select-all');
    this.sendBtn = element.querySelector('.send');
    this.showUploadedBtn = element.querySelector('.show-uploaded-files');
    this.registerEvents();
  }

  registerEvents() {
    this.imagesRow.addEventListener('dblclick', (e) => {
      const img = e.target.closest('img');
      if (img && this.imagesRow.contains(img)) {
        this.previewImg.src = img.src;
      }
    });

    this.imagesRow.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (img && this.imagesRow.contains(img)) {
        img.classList.toggle('selected');
        this.checkButtonText();
      }
    });

    this.selectAllBtn.addEventListener('click', () => {
      const images = this.imagesRow.querySelectorAll('img');
      const hasSelected = Array.from(images).some(img => img.classList.contains('selected'));
      images.forEach(img => {
        if (hasSelected) {
          img.classList.remove('selected');
        } else {
          img.classList.add('selected');
        }
      });
      this.checkButtonText();
    });

    this.showUploadedBtn.addEventListener('click', () => {
      const modal = App.getModal('filePreviewer');
      const content = modal.element.find('.content');
      content.html('<i class="asterisk loading icon massive"></i>');
      modal.open();
      Yandex.getUploadedFiles((err, data) => {
        if (err) {
          alert(err.message); // информативное сообщение об ошибке
          modal.close();
          return;
        }
        if (!data.items || !Array.isArray(data.items)) {
          alert('Ошибка: сервер вернул некорректные данные.');
          modal.close();
          return;
        }
        modal.showImages(data.items);
      });
    });

    this.sendBtn.addEventListener('click', () => {
      const selectedImages = Array.from(this.imagesRow.querySelectorAll('img.selected')).map(img => img.src);
      if (selectedImages.length === 0) return;
      const modal = App.getModal('fileUploader');
      modal.showImages(selectedImages);
      modal.open();
    });
  }

  clear() {
    this.imagesRow.innerHTML = '';
    this.checkButtonText();
  }

  drawImages(images) {
    if (images.length === 0) {
      this.selectAllBtn.classList.add('disabled');
    } else {
      this.selectAllBtn.classList.remove('disabled');
    }
    for (const src of images) {
      const wrapper = document.createElement('div');
      wrapper.className = 'four wide column ui medium image-wrapper';
      const img = document.createElement('img');
      img.src = src;
      wrapper.appendChild(img);
      this.imagesRow.appendChild(wrapper);
    }
    this.checkButtonText();
  }

  checkButtonText() {
    const images = this.imagesRow.querySelectorAll('img');
    const selected = Array.from(images).some(img => img.classList.contains('selected'));

    if (selected) {
      this.sendBtn.classList.remove('disabled');
    } else {
      this.sendBtn.classList.add('disabled');
    }

    if (images.length === 0) {
      this.selectAllBtn.classList.add('disabled');
    } else {
      this.selectAllBtn.classList.remove('disabled');
    }

    const allSelected = images.length > 0 && Array.from(images).every(img => img.classList.contains('selected'));
    if (allSelected) {
      this.selectAllBtn.textContent = 'Снять выделение';
    } else {
      this.selectAllBtn.textContent = 'Выбрать всё';
    }
  }
}
