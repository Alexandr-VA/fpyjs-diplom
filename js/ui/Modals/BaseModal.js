/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor(element) {
    this.element = element;
    this.domElement = element[0];
  }

  open() {
    this.element.modal('show');
  }

  close() {
    this.element.modal('hide');
  }
}
