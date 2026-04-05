/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {
  static ACCESS_TOKEN = '958eb5d439726565e9333aa30e50e0f937ee432e927f0dbd541c541887d919a7c56f95c04217915c32008';
  static lastCallback;

  static get(id = '', callback) {
    VK.lastCallback = callback;
    const script = document.createElement('script');
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&extended=1&photo_sizes=1&access_token=${VK.ACCESS_TOKEN}&v=5.131&callback=VK.processData`;
    document.body.appendChild(script);
  }

  static processData(result) {
    const scripts = document.querySelectorAll('script');
    for (let script of scripts) {
      if (script.src && script.src.includes('api.vk.com/method/photos.get')) {
        script.remove();
        break;
      }
    }
    if (result.error) {
      alert(`Ошибка VK: ${result.error.error_msg}`);
      VK.lastCallback([]);
      VK.lastCallback = () => {};
      return;
    }
    const items = result.response.items;
    const images = items.map(item => {
      const sizes = item.sizes;
      let maxSize = sizes[0];
      for (let size of sizes) {
        if (size.width * size.height > maxSize.width * maxSize.height) {
          maxSize = size;
        }
      }
      return maxSize.url;
    });
    VK.lastCallback(images);
    VK.lastCallback = () => {};
  }
}
