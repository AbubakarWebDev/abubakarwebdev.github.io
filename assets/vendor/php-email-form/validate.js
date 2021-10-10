!(function ($) {
  "use strict";

  $('form.php-email-form').submit(function (e) {
    e.preventDefault();

    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function () { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (!i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validate').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('textarea').each(function () { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validate').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    if (ferror) return false;

    if ($(this).find('.g-recaptcha').data('sitekey')) {
      var response = grecaptcha.getResponse();
      if (response.length == 0) {
        $('#g-recaptcha-error').html('Please Verify You Are Not A Robot');
        $('#g-recaptcha-error').show();
        return false;
      }
      else {
        $('#g-recaptcha-error').hide();

        var this_form = $(this);
        this_form.find('.sent-message').slideUp();
        this_form.find('.error-message').slideUp();
        this_form.find('.loading').slideDown();

        let template_params = {
          name: this_form.find('#name').val(),
          email: this_form.find('#email').val(),
          subject: this_form.find('#subject').val(),
          message: this_form.find('#message').val(),
          'g-recaptcha-response': response
        };

        emailjs_submit_form(template_params, this_form);
      }
    }
    else {
      emailjs_submit_form(template_params);
    }

    return true;
  });

  function emailjs_submit_form(template_params, this_form) {
    var data = {
      service_id: 'service_oca5cvu',
      template_id: 'template_jpou7ld',
      user_id: 'user_ydjzuhaebKzmHOxbgDj2N',
      template_params: template_params
    };

    $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json'
    }).done(function (msg) {
      if (msg == 'OK') {
        this_form.find('.loading').slideUp();
        this_form.find('.sent-message').slideDown();
        this_form.find("input:not(input[type=submit]), textarea").val('');
      } else {
        this_form.find('.loading').slideUp();
        if (!msg) {
          msg = 'Form submission failed and no error message returned from: ' + action + '<br>';
        }
        this_form.find('.error-message').slideDown().html(msg);
      }
    }).fail(function (data) {
      console.log(data);
      var error_msg = "Form submission failed!<br>";
      if (data.statusText || data.status) {
        error_msg += 'Status:';
        if (data.statusText) {
          error_msg += ' ' + data.statusText;
        }
        if (data.status) {
          error_msg += ' ' + data.status;
        }
        error_msg += '<br>';
      }
      if (data.responseText) {
        error_msg += data.responseText;
      }
      this_form.find('.loading').slideUp();
      this_form.find('.error-message').slideDown().html(error_msg);
    });
  }

})(jQuery);
