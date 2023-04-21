//-----------
// Variables
//-----------

var jefconfig_SLACK_URL = "https://hooks.slack.com/services/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";

var jefconfig_DEFAULT_ERROR =
    "Oops! An error occurred while loading. Please try again or email us at contact@brandfeatured.com if this continues.";

//------
// Start
//------

$(function() {
    //code to make sticky header work
    sticky_header();

    // Show or hide the sticky footer button
    $(window).on("scroll", function(event) {
        if ($(this).scrollTop() > 600) {
            $(".back-to-top").fadeIn(200);
        } else {
            $(".back-to-top").fadeOut(200);
        }
    });

    //Animate the scroll to top
    $(".back-to-top").on("click", function(event) {
        event.preventDefault();

        $("html, body").animate(
            {
                scrollTop: 0
            },
            300
        );
    });

    // Hamburger-menu
    $(".hamburger-menu, .cInnerMenuLink").on("click", function() {
        $(".hamburger-menu .line-top").toggleClass("current");
        $(".hamburger-menu .line-center").toggleClass("current");
        $(".hamburger-menu .line-bottom").toggleClass("current");
        $(".ofcavas-menu").slideToggle();
    });

    //updates footer year
    updateYear();
});

//-----------
// Functions
//-----------

function updateYear() {
    var today = new Date();
    var year = today.getFullYear();
    $(".update-year").text(year);
}

// sticky header
function sticky_header() {
    var wind = $(window);
    var sticky = $("header");
    wind.on("scroll", function() {
        var scroll = wind.scrollTop();
        if (scroll < 100) {
            sticky.removeClass("sticky");
        } else {
            sticky.addClass("sticky");
        }
    });
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//sendErrorSlack(e,'theFunctionName',arguments.callee.name);
function sendErrorSlack(moError, msOverallFunction, msFunctionName) {
    $.ajax({
        type: "POST",
        url: jefconfig_SLACK_URL,
        data: JSON.stringify({
            text:
                "----------------\n" +
                window.location.href +
                "\n *function* " +
                msOverallFunction +
                " *||* " +
                msFunctionName +
                "\n" +
                JSON.stringify(moError, null, 2)
        }),
        dataType: "text",
        success: function(response) {
            console.log(response);
        },
        error: function(e) {
            console.log(e);
        }
    });
}

// var utm = getAllUrlParams();
// now you can get the order_id param by: utm.order_id
function getAllUrlParams(e) {
    var t = e ? e.split("?")[1] : window.location.search.slice(1),
        r = {};
    if (t) {
        t = t.split("#")[0];
        for (var s = (t = decodeURIComponent(t)).split("&"), a = 0; a < s.length; a++) {
            var i = [s[a].substr(0,s[a].indexOf('=')), s[a].substr(s[a].indexOf('=')+1)],
                o = i[0],
                l = void 0 === i[1] || i[1];
                
            if (((o = (o = o.replace(/[^\w\s]/gi, "")).toLowerCase()), "string" == typeof l, o.match(/\[(\d+)?\]$/))) {
                var p = o.replace(/\[(\d+)?\]/, "");
                if ((r[p] || (r[p] = []), o.match(/\[\d+\]$/))) {
                    var c = /\[(\d+)\]/.exec(o)[1];
                    r[p][c] = l;
                } else r[p].push(l);
            } else r[o] ? (r[o] && "string" == typeof r[o] ? ((r[o] = [r[o]]), r[o].push(l)) : r[o].push(l)) : (r[o] = l);
        }
    }
    return r;
}
