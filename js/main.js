$(document).ready(function () {
    // random color for heading
    $('a.nav-link').each(function (i, obj) {
        if ($(obj).hasClass("active")) {
            $(obj).css("background-color", "hsla(" + Math.floor(Math.random() * (360)) + ", 75%, 58%, 1)");
        } else {
            $(obj).css("color", "hsla(" + Math.floor(Math.random() * (360)) + ", 75%, 58%, 1)");
        }
    });
    // random color for btn-success
    $('.btn-success').each(function (i, obj) {
        $(obj).css("background-color", "hsla(" + Math.floor(Math.random() * (360)) + ", 75%, 58%, 1)");
        $(obj).css("border", "none");
    });
    // random color for titles
    $('.random-color').each(function (i, obj) {
        var chars = $(obj).text().split('');
        $(obj).html('');
        for (var i = 0; i < chars.length; i++) {
            var span = $('<span>' + chars[i] + '</span>').css("color", "hsla(" + Math.floor(Math.random() * (360)) + ", 75%, 58%, 1)");
            $(obj).append(span);
        }
    });
});