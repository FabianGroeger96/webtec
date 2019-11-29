// initialize variables
let random_colors = false;
let random_timeout = 200;

let canvas;
let canvas_width;
let canvas_height;

let brush;

let circleArray = [];

// JQuery
$(document).ready(function () {
    // --- Random Colors ---
    // random color for menu
    randomMenuColors();

    // random color for btn-success
    randomChangeBGColor(".btn-success");

    // random color for titles
    randomChangeLetterColors(".random-color");

    // create interval for random changing colors
    setInterval(function () {
        randomChangeLetterColors(".random-color-interval");
    }, random_timeout);

    // --- AJAX ---
    // get cite.txt file via ajax
    $.getJSON("assets/quotes.txt", function (response) {
        var cards = [];
        $.each(response, function (key, val) {
            cards.push("<div class='card random-bg-color random-bg-color-interval'>" +
                "<img class='card-img-top' src='" + val.image + "' alt='Card image cap'>" +
                "<div class='card-body text-center'>" +
                "<p id='cite_1' class='card-text'>" + val.quote + "</p>" +
                "</div>" +
                "</div>"
            )
        });

        $("#card_container").append(cards);

    }).then(function () {
        // random bg color for cites
        randomChangeBGColor(".random-bg-color");
        setInterval(function () {
            randomChangeBGColor(".random-bg-color-interval");
        }, random_timeout);
    });

    // --- Sticky Navbar ---
    // function which toggles between sticky class (is-sticky)
    let stickyToggle = function (sticky, stickyWrapper, scrollElement) {
        let stickyHeight = sticky.outerHeight();
        let stickyTop = stickyWrapper.offset().top;
        if (scrollElement.scrollTop() >= stickyTop) {
            stickyWrapper.height(stickyHeight);
            sticky.addClass("is-sticky");
        } else {
            sticky.removeClass("is-sticky");
            stickyWrapper.height('auto');
        }
    };

    // Find all data-toggle="sticky-onscroll" elements
    $('[data-toggle="sticky-onscroll"]').each(function () {
        let sticky = $(this);
        let stickyWrapper = $('<div>').addClass('sticky-wrapper'); // insert hidden element to maintain actual top offset on page
        sticky.before(stickyWrapper);
        sticky.addClass('sticky');

        // Scroll & resize events
        $(window).on('scroll.sticky-onscroll resize.sticky-onscroll', function () {
            stickyToggle(sticky, stickyWrapper, $(this));
        });

        // On page load
        stickyToggle(sticky, stickyWrapper, $(window));
    });

    // Event when other object will be activated
    $(window).on('activate.bs.scrollspy', function (e, obj) {
        randomMenuColors();
    });

    // --- Canvas ---
    resizeCanvas("canvas");
    $(window).on('resize', function () {
        resizeCanvas("canvas");
    });

    brush = canvas.getContext('2d');

    // Create circles based on how long you hold the mouse down
    let timer = 0;
    let x, y;
    let canvas_id = $("#canvas");

    let isTouchDevice = ('ontouchstart' in document.documentElement);

    canvas_id.on('touchstart', function () {
        if (isTouchDevice) {
            timer = new Date();

            let pos = getMousePos(canvas, e);
            x = pos.x;
            y = pos.y;
        }
    });
    canvas_id.on('touchend', function () {
        if (isTouchDevice) {
            let timePassed = (new Date() - timer) / 10;
            if (timePassed > 100) {
                timePassed = 100
            }
            let radius = timePassed;
            timer = 0;

            let dx = (Math.random() - 0.5) * 10;
            let dy = (Math.random() - 0.5) * 10;
            circleArray.push(new Circle(x, y, dx, dy, radius));
        }
    });

    // mouse action
    canvas_id.on("mousedown", function (e) {
        timer = new Date();

        let pos = getMousePos(canvas, e);
        x = pos.x;
        y = pos.y;
    });
    canvas_id.on("mouseup", function (e) {
        let timePassed = (new Date() - timer) / 10;
        if (timePassed > 100) {
            timePassed = 100
        }
        let radius = timePassed;
        timer = 0;

        let dx = (Math.random() - 0.5) * 10;
        let dy = (Math.random() - 0.5) * 10;
        circleArray.push(new Circle(x, y, dx, dy, radius));
    });

    animate();
});

// --- Functions ---
// Random Colors UI
function randomColorsCircles() {
    random_colors = !random_colors;
    if (random_colors) {
        $("#taste-the-rainbow").html("Stop the rainbow")
    } else {
        $("#taste-the-rainbow").html("Taste the fucking rainbow")
    }
}

function randomChangeBGColor(objRef) {
    $(objRef).each(function (i, obj) {
        $(obj).css("background-color", "hsla(" + Math.floor(Math.random() * (360)) + ", 75%, 58%, 1)");
    });
}

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

function randomMenuColors() {
    $('a.nav-link').each(function (i, obj) {
        if ($(obj).hasClass("active")) {
            $(obj).css("color", "");
            $(obj).css("background-color", "hsla(" + Math.floor(Math.random() * (360)) + ", 75%, 58%, 1)");
        } else {
            $(obj).css("color", "hsla(" + Math.floor(Math.random() * (360)) + ", 75%, 58%, 1)");
            $(obj).css("background-color", "");
        }
    });
}

// Cookie
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

    return day + '. ' + monthNames[monthIndex] + ' ' + year + ' at ' + hours + ':' + minutes + ':' + seconds;
}

// Canvas
function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function resizeCanvas(canvas_selector) {
    canvas = document.querySelector(canvas_selector);

    // make the canvas the same width as div
    canvas_width = $("#canvas-div").width();
    canvas_height = 600;
    canvas.width = canvas_width;
    canvas.height = canvas_height;
}

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = tasteTheRainbow();
    this.last_color_update = Date.now();

    this.draw = function () {
        brush.beginPath();
        brush.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        brush.fillStyle = this.color;
        brush.fill();
    };

    //reverse the x or y coordinates when the circle touches the side
    this.update = function () {
        if (this.x + this.radius > canvas_width || this.x - this.radius < 0) {
            this.dx = -this.dx
        }

        if (this.y + this.radius > canvas_height || this.y - this.radius < 0) {
            this.dy = -this.dy
        }

        this.x += this.dx;
        this.y += this.dy;

        let time_delta = Math.abs(Date.now() - this.last_color_update);
        if (random_colors) {
            if (time_delta > random_timeout) {
                this.color = tasteTheRainbow();
                this.last_color_update = Date.now();
            }
        }

        this.draw()
    }
}

function tasteTheRainbow() {
    let hexColors = 'ABCDEF0123456789';
    let skittlesMaker = '#';
    for (let i = 0; i < 6; i++) {
        skittlesMaker += hexColors[Math.floor(Math.random() * 16)]
    }
    return skittlesMaker
}

function animate() {
    requestAnimationFrame(animate);
    brush.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update()
    }
}
