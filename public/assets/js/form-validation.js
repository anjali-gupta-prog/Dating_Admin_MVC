$(function() {
  'use strict';

  // @ts-ignore
  $.validator.setDefaults({
    submitHandler: function() {
      alert("submitted!");
    }
  });
  $(function() {
    // validate signup form on keyup and submit
    $("#signupForm1").validate({
     rules: {
        title: {
          required: true,
          minlength: 3
        },
        hashtag: {
          required: true,
          minlength: 3
        },
        details: {
          required: true,
          minlength: 5,
        },
      },
      messages: {
        title: {
          required: "Please enter a Title",
          minlength: "Title must consist of at least 3 characters"
        },
        hashtag: {
          required: "Please provide a hashtag",
          minlength: "Your Hashtag must be at least 3 characters long"
        },
        details: {
          required: "Please provide a description",
          minlength: "Your password must be at least 5 characters long", 
        },
        
      },
      errorPlacement: function(label, element) {
        label.addClass('mt-2 text-danger');
        label.insertAfter(element);
      },
      highlight: function(element, errorClass) {
        $(element).parent().addClass('has-danger')
        $(element).addClass('form-control-danger')
      }
    });
  });
});