if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
//       this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cartNotification = document.querySelector('cart-notification');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      const submitButton = this.querySelector('[type="submit"]');
      if (submitButton.classList.contains('loading')) return;

      this.handleErrorMessage();
      this.cartNotification.setActiveElement(document.activeElement);

      submitButton.setAttribute('aria-disabled', true);
      submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';

      const device_id = document.getElementById('kardiamobileCard').value;
      const kardiacare_id = document.getElementById('kardiaCareAnnual').value;
      const frequency = "12";
      const unit = "Month";
      let formData = {
        'items': [{
          'quantity': 1,
          'id': device_id,
          "properties": {
            "kcard_bundle": true
          }
        },
        {
          'quantity': 1,
          'id': kardiacare_id,
          "properties": {
            "shipping_interval_frequency": frequency,
            "shipping_interval_unit_type": unit
          }
        }],
        'sections': this.cartNotification.getSectionsToRender().map((section) => section.id),
        'sections_url': window.location.pathname
      };
      
      formData = JSON.stringify(formData);
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            this.handleErrorMessage(response.description);
            return;
          }
		  // cartNotification is not rendering
          // cartItemKey not defined
          this.cartNotification.renderContents(response);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          submitButton.classList.remove('loading');
          submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}
