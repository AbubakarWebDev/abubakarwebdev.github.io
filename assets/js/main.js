!(function ($) {
  "use strict";

  // Preloader
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  // Hero typed
  if ($('.typed').length) {
    var typed_strings = $(".typed").data('typed-items');
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  // Smooth scroll for the navigation menu and links with .scrollto classes
  $(document).on('click', '.nav-menu a, .scrollto', function (e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top;

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function () {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  $(document).on('click', '.mobile-nav-toggle', function (e) {
    $('body').toggleClass('mobile-nav-active');
    $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
  });

  $(document).click(function (e) {
    var container = $(".mobile-nav-toggle");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($('body').hasClass('mobile-nav-active')) {
        $('body').removeClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop() + 300;

    nav_sections.each(function () {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 200) {
        $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function () {
    $('.progress .progress-bar').each(function () {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }

  // Porfolio isotope and filter
  $(window).on('load', function () {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
    });

    $.ajax({
      type: "get",
      url: "assets/js/portfolioData.json",
      dataType: "json",
      success: function (response, status) {
        if (status == "success") {
          var items = "";
          $.each([response.website, response.webapplication, response.cms, response.php], function (filterIndex, filter) {
            $.each(filter, function (index, item) { 
              if (index <= 5) {
                items += `<div class="col-lg-4 col-md-6 portfolio-item ${item.filter}">
                  <div class="portfolio-wrap">
                    <img src="${item.image}" class="img-thumbnail" alt="AbubakarWebDev">
                    <div class="portfolio-info">
                      <h4>${item.heading}</h4>
                      <p>${item.paragraph}</p>
                      <div class="portfolio-links">
                        <a href="${item.venobox}" data-gall="portfolioGallery" class="venobox" title="${item.title}"><i class="bx bx-plus"></i></a>
                        <a href="${item.link}" title="Portfolio Details"><i class="bx bx-link"></i></a>
                      </div>
                    </div>
                  </div>
                </div>`;
              }
            });
          });

          portfolioIsotope.isotope('insert', $(items)).imagesLoaded().progress(function () {
            portfolioIsotope.isotope('layout');
            $('.venobox').venobox({
              'share': false
            });
          }).done(function () {
            portfolioIsotope.isotope('shuffle');
          });
        }
        else {
          console.log(response);
        }
      }
    });

    $('#portfolio-flters li').on('click', function () {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      }).isotope('shuffle');

      aos_init();
    });

    // Initiate aos_init() function
    aos_init();

    var loadMoreRequest = false;

    $("#loadMoreBtn").on('click', function () {
      if (!loadMoreRequest) {
        $.ajax({
          type: "get",
          url: "assets/js/portfolioData.json",
          dataType: "json",
          success: function (response, status) {
            if (status == "success") {
              var items = "";
              loadMoreRequest = true;

              $.each([response.website, response.webapplication, response.cms, response.php], function (filterIndex, filter) {
                $.each(filter, function (index, item) { 
                  if (index > 5) {
                    items += `<div class="col-lg-4 col-md-6 portfolio-item ${item.filter}">
                      <div class="portfolio-wrap">
                        <img src="${item.image}" class="img-thumbnail" alt="AbubakarWebDev">
                        <div class="portfolio-info">
                          <h4>${item.heading}</h4>
                          <p>${item.paragraph}</p>
                          <div class="portfolio-links">
                            <a href="${item.venobox}" data-gall="portfolioGallery" class="venobox" title="${item.title}"><i class="bx bx-plus"></i></a>
                            <a href="${item.link}" title="Portfolio Details"><i class="bx bx-link"></i></a>
                          </div>
                        </div>
                      </div>
                    </div>`;
                  }
                });
              });

              portfolioIsotope.isotope('insert', $(items)).imagesLoaded().progress(function () {
                portfolioIsotope.isotope('layout');

                $('.venobox').venobox({
                  'share': false
                });
              }).done(function () {
                portfolioIsotope.isotope('shuffle');
              });
            }
            else {
              console.log(response);
            }
          }
        });
      }
      else {
        $(this).attr('disabled', true);
      }
    });
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

})(jQuery);