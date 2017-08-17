/* global $ */

$(function() {
  $("form[name='userRegisterForm']").validate({
    rules: {
      username: {
        required: true,
        remote: {
        type: 'post',
        url: 'users/isUsernameAvailable',
        data: {
            'username': function () { return $('#username').val(); }
        },
        dataType: 'json'
        }
      },
      email: {
        required: true,
        email: true,
        remote: {
        type: 'post',
        url: 'users/isEmailUsed',
        data: {
            'username': function () { return $('#email').val(); }
        },
        dataType: 'json'
        }
      },
      password: {
        required: true,
        minlength: 5
      },
      confirmPassword: {
        equalTo: "#password"
      }
    },
    messages: {
      username: {
        required: "Please Enter a Username",
        remote: "Username is already in Use"
      },
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long"
      },
      confirmPassword: {
        equalTo: "Password Does Not Match"
      },
      email: {
        email: "Please enter a valid email address",
        required: "Please Enter a Email Address",
        remote: "We already have an account registered for that email"
      }
    },
    submitHandler: function(form) {
      form.submit();
    }
  });
});
