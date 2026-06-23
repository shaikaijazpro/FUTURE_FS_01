/**
* PHP Email Form Validation - v3.11
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    // Open Gmail compose in a new tab with the form data prefilled.
    try {
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const subject = formData.get('subject') || 'New message from website';
      const message = formData.get('message') || '';
      const phone = formData.get('phone') || '';
      const recipient = 'shaikajaz306@gmail.com';

      let body = `Name: ${name}\nEmail: ${email}`;
      if (phone) body += `\nPhone: ${phone}`;
      body += `\n\nMessage:\n${message}`;

      const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1'
        + `&to=${encodeURIComponent(recipient)}`
        + `&su=${encodeURIComponent(subject)}`
        + `&body=${encodeURIComponent(body)}`;

      window.open(gmailUrl, '_blank');

      thisForm.querySelector('.loading').classList.remove('d-block');
      const sentEl = thisForm.querySelector('.sent-message');
      sentEl.innerHTML = 'Gmail compose opened in a new tab. Please review the message and click Send to deliver it.';
      sentEl.classList.add('d-block');
    } catch (error) {
      displayError(thisForm, error);
    }
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
