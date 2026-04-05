/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor(element) {
    this.element = element;
    this.registerEvents();
  }

  registerEvents() {
    const input = this.element.querySelector('input');
    const replaceBtn = this.element.querySelector('.replace');
    const addBtn = this.element.querySelector('.add');

    replaceBtn.addEventListener('click', () => {
      const id = input.value.trim();
      if (!id) return;
      VK.get(id, (images) => {
        App.imageViewer.clear();
        App.imageViewer.drawImages(images);
      });
    });

    addBtn.addEventListener('click', () => {
      const id = input.value.trim();
      if (!id) return;
      VK.get(id, (images) => {
        App.imageViewer.drawImages(images);
      });
    });
  }
}
