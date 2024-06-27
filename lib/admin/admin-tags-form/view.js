import t from 't-component'
import FormView from '../../form-view/form-view'
import tags from '../../tags-images'
import template from './template.jade'

export default class TagForm extends FormView {
  constructor (tag) {
    var action = '/api/tag/'
    var title
    if (tag) {
      action += tag.id
      title = 'admin-tags-form.title.edit'
    } else {
      action += 'create'
      title = 'admin-tags-form.title.create'
    }

    var options = {
      form: { title: title, action: action },
      tag: tag || { clauses: [] },
      tags: tags,
    }

    super(template, options)
    this.options = options
  }

  switchOn () {
    document.getElementById('icon-search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      this.options.tags = tags.filter(tag => tag.translation.toLowerCase().includes(query));
      this.updateTagImages();
    });
    this.on('success', this.bound('onsuccess'))
    this.bind('click', 'input[name="image"]', this.bound('onimageclick'))
  }

  updateTagImages() {
    const tagImagesContainer = this.find('.tag-images')[0];
    tagImagesContainer.innerHTML = '';
    this.options.tags.forEach(tag => {
      const id = 'fa fa-' + tag.image;
      const tagImageElement = document.createElement('div');
      tagImageElement.className = 'tag-image';

      const inputElement = document.createElement('input');
      inputElement.type = 'radio';
      inputElement.name = 'image';
      inputElement.value = tag.image;
      inputElement.id = id;
      inputElement.checked = this.options.tag.image === tag.image;

      const labelElement = document.createElement('label');
      labelElement.htmlFor = id;

      const iconElement = document.createElement('i');
      iconElement.className = id;
      iconElement.setAttribute('aria-hidden', 'true');

      labelElement.appendChild(iconElement);
      tagImageElement.appendChild(inputElement);
      tagImageElement.appendChild(labelElement);

      tagImagesContainer.appendChild(tagImageElement);
    });
  }

  /**
   * Handle `success` event
   *
   * @api private
   */

  onsuccess (res) {
    this.onsave()
  }

  onsave () {
    this.messages([t('admin-tags-form.message.onsuccess')])
    window.scrollTo(0, 0);
  }

  onimageclick (ev) {
    this.find('input[name="image"]').removeClass('error')
  }
}
