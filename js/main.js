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
    randomChangeLetterColors(".random-color");

    // create interval for random changing colors
    setInterval(function () {
        randomChangeLetterColors(".random-color-interval");
    }, 200);

});

function randomChangeLetterColors(objRef) {
    $(objRef).each(function (i, obj) {
        var chars = $(obj).text().split('');
        $(obj).html('');
        for (var i = 0; i < chars.length; i++) {
            var span = $('<span>' + chars[i] + '</span>').css("color", "hsla(" + Math.floor(Math.random() * (360)) + ", 75%, 58%, 1)");
            $(obj).append(span);
        }
    });
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function removeCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    $('#alert-cookie').hide();
}

function getCookie(cname) {
    const name = cname + "=";
    let ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let last_visit = getCookie("last_visit");
    if (last_visit !== "") {
        // show alert
        $("#span-last-visit").text(last_visit);
        $('#alert-cookie').show();

        // set cookie again with current datetime
        const current_date = new Date();
        setCookie("last_visit", formatDate(current_date), 365);
    } else {
        // set cookie with current datetime
        const current_date = new Date();
        setCookie("last_visit", formatDate(current_date), 365);
        // hide alert
        $('#alert-cookie').hide();
    }
}

function formatDate(date) {
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let hours = date.getHours();

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return  day + '. ' + monthNames[monthIndex] + ' ' + year + ' at ' + hours + ':' + minutes + ':' + seconds;
}