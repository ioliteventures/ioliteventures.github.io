/*
this file needs to be included anywhere we have the exit modal pop up OR the newsletter subscribe section
- don't forget to also include the loader and success/error notification divs
- it also needs to appear BELOW the jconfig.js file
*/

//-----------
// Variables
//-----------

var sSubscribeSuccess = "Subscribed!";

//-----------
// Start
//-----------

//initialize exit-modal only showing up every 30 days
$(function() {
    if ($("#exitModal").length) {
        $("html").mouseleave(function() {
            checkCookie();
        });

        if (window.matchMedia("only screen and (max-width: 991px)").matches) {
            var dtPercentDown = new DialogTrigger(
                function() {
                    var dtPercentUp = new DialogTrigger(checkCookie, { trigger: "scrollUp", percentUp: 5 });
                },
                { trigger: "scrollDown", percentDown: 50 }
            );
        }
    }
});

//-----------
// Functions
//-----------

function DialogTrigger(callback, options) {
    // Becomes this.options
    var defaults = {
        trigger: "timeout",
        target: "",
        timeout: 0,
        percentDown: 50, // Used for 'percent' to define a down scroll threshold of significance (based on page height)
        percentUp: 10, // Used for 'percent' to define a threshold of upward scroll after down threshold is reached
        scrollInterval: 300 // Frequency (in ms) to check for scroll changes (to avoid bogging the UI)
    };

    this.complete = false; // Let's us know if the popup has been triggered

    this.callback = callback;
    this.timer = null;
    this.interval = null;

    this.options = jQuery.extend(defaults, options);

    this.init = function() {
        if (this.options.trigger == "exitIntent" || this.options.trigger == "exit_intent") {
            var parentThis = this;

            jQuery(document).on("mouseleave", function(e) {
                //console.log(e.clientX + ',' + e.clientY); // IE returns negative values on all sides

                if (!parentThis.complete && e.clientY < 0) {
                    // Check if the cursor went above the top of the browser window
                    parentThis.callback();
                    parentThis.complete = true;
                    jQuery(document).off("mouseleave");
                }
            });
        } else if (this.options.trigger == "target") {
            if (this.options.target !== "") {
                // Make sure the target exists
                if (jQuery(this.options.target).length == 0) {
                    this.complete = true;
                } else {
                    var targetScroll = jQuery(this.options.target).offset().top;

                    var parentThis = this;

                    // Only check the scroll position every few seconds, to avoid bogging the UI
                    this.interval = setInterval(function() {
                        if (jQuery(window).scrollTop() >= targetScroll) {
                            clearInterval(parentThis.interval);
                            parentThis.interval = null;

                            if (!parentThis.complete) {
                                parentThis.callback();
                                parentThis.complete = true;
                            }
                        }
                    }, this.options.scrollInterval);
                }
            }
        } else if (this.options.trigger == "scrollDown") {
            // Let the user scroll down by some significant amount
            var scrollStart = jQuery(window).scrollTop();
            var pageHeight = jQuery(document).height();

            var parentThis = this;

            if (pageHeight > 0) {
                // Only check the scroll position every few seconds, to avoid bogging the UI
                this.interval = setInterval(function() {
                    var scrollAmount = jQuery(window).scrollTop() - scrollStart;
                    if (scrollAmount < 0) {
                        scrollAmount = 0;
                        scrollStart = jQuery(window).scrollTop();
                    }
                    var downScrollPercent = parseFloat(scrollAmount) / parseFloat(pageHeight);

                    if (downScrollPercent > parseFloat(parentThis.options.percentDown) / 100) {
                        clearInterval(parentThis.interval);
                        parentThis.interval = null;

                        if (!parentThis.complete) {
                            parentThis.callback();
                            parentThis.complete = true;
                        }
                    }
                }, this.options.scrollInterval);
            }
        } else if (this.options.trigger == "scrollUp") {
            // Let the user scroll down by some significant amount
            var scrollStart = jQuery(window).scrollTop();
            var pageHeight = jQuery(document).height();

            var parentThis = this;

            if (pageHeight > 0) {
                // Only check the scroll position every few seconds, to avoid bogging the UI
                this.interval = setInterval(function() {
                    var scrollAmount = scrollStart - jQuery(window).scrollTop();
                    if (scrollAmount < 0) {
                        scrollAmount = 0;
                        scrollStart = jQuery(window).scrollTop();
                    }
                    var upScrollPercent = parseFloat(scrollAmount) / parseFloat(pageHeight);

                    if (upScrollPercent > parseFloat(parentThis.options.percentUp) / 100) {
                        clearInterval(parentThis.interval);
                        parentThis.interval = null;

                        if (!parentThis.complete) {
                            parentThis.callback();
                            parentThis.complete = true;
                        }
                    }
                }, this.options.scrollInterval);
            }
        } else if (this.options.trigger == "timeout") {
            this.timer = setTimeout(this.callback, this.options.timeout);
        }
    };

    this.cancel = function() {
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.complete = true;
    };

    this.init();
}

function setCookie(cname, cvalue, exhours) {
    var d = new Date();
    // add cookie expiry date to be exhours from the current time
    d.setTime(d.getTime() + exhours * 60 * 60 * 1000);
    var expires = "expires=" + d.toGMTString();
    // Pass the name, cookie value and expiry time into the cookie
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var popUp = getCookie("poppedUp");
    // if the cookie isn't empty, then don't show the modal, otherwise show the modal
    if (popUp != "") {
    } else {
        // show modal
        $("#exitModal").modal("show");
        // change the value of the cookie to "1" so that we know the visitor has sent the cookie
        setCookie("poppedUp", 1, 48); //720 hours = 30 days
    }
}

function submitSubscribeForm(e) {
    e.preventDefault();

    var oFormData = new FormData(document.getElementById("iSubscribeForm"));

    sSubscribeSuccess = "Subscribed!";

    subscribeHelper(oFormData, e);

    return false;
}

function subscribeHelper(oFormData, e) {
    if (!validateEmail(oFormData.get("email"))) {
        $(".form-error").text("Please enter a valid email address");
        $(".form-error").fadeIn(500);
        setTimeout(function() {
            $(".form-error").fadeOut(1000);
        }, 3000);
        return false;
    }

    $.ajax({
        type: "post",
        url: "https://brandfeatured.com/api/subscribe.php",
        cache: false, //required for FormData
        contentType: false, //same
        processData: false, //same
        data: oFormData,
        beforeSend: function() {
            $(".cLoader").show();
        },
        success: function(data) {
            var oData = JSON.parse(data);
            if (oData.success === 1) {
                $("#exitModal").modal("hide");
                $(".cSubscribeEmail").val("");
                $(".form-success").text(sSubscribeSuccess);
                $(".form-success").fadeIn(500);
                setTimeout(function() {
                    $(".form-success").fadeOut(1200);
                }, 3000);
                // fbq("track", "CompleteRegistration"); //fire facebook event
            } else {
                $(".form-error").text(jefconfig_DEFAULT_ERROR);
                $(".form-error").fadeIn(500);
                sendErrorSlack(data, "subscribeHelper()", arguments.callee.name);
            }
            $(".cLoader").hide();
        },
        error: function(e) {
            $(".form-error").text(JSON.parse(e.responseText).error.msg);
            $(".form-error").fadeIn(500);
            $(".cLoader").hide();
        }
    });
}

//Subscribe 10% Off onclick function
function subscribeExitDiscount(e) {
    e.preventDefault();

    var oFormData = new FormData(document.getElementById("iExitDiscountForm"));
    oFormData.append("type", "discount-exit-modal");

    sSubscribeSuccess = "Subscribed! Check your email for your discount code.";

    subscribeHelper(oFormData, e);

    return false;
}

//subscribing to download sample report onclick function
function submitSamplesForm(e) {
    e.preventDefault();

    var oFormData = new FormData(document.getElementById("iSamplesForm"));
    oFormData.append("type", "samples-form");

    sSubscribeSuccess = "Success! Check your inbox (Promotions tab).";

    subscribeHelper(oFormData, e);

    return false;
}
