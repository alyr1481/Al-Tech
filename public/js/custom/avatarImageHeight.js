// User Avatar Centering, if too small!
var logoHeight = $('#avatarWrapper img').height();
    if (logoHeight < 350) {
        var margintop = (350 - logoHeight) / 2;
        $('#avatarWrapper img').css('margin-top', margintop);
    }
