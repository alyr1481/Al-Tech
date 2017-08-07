/*global $ */
// (function() {
    $('form > input').change(function() {

        var empty = false;
        $('form input').each(function() {
            if ($(this).val() == '') {
                empty = true;
            }
        });

        if (empty) {
            $('#registerButton').addClass("disabled");
        } else {
            $('#registerButton').removeClass('disabled');
        }
    });
// });