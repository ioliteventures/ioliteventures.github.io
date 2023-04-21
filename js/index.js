//-------
// Start
//-------

$(function(){
    testi_carouselInit();
});

//-----------
// Functions
//-----------

//testimonial carousel owl-carousel
function testi_carouselInit() {
    $(".owl-carousel.testi_carousel").owlCarousel({
        autoplay: false,
        // autoplayTimeout: 5000,
        dots: false,
        loop: true,
        margin: 58,
        stagePadding: 75,
        // autoplayHoverPause: true,
        nav: false,
        responsive: {
            0: {
                items: 1,
                dots: true,
                stagePadding: 25,
                margin: 38
            },
            768: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });
}
