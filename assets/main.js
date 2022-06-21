$(document).ready(function() {
  // navigation
  var scrollTop = 0;
  $(window).scroll(function(){
    scrollTop = $(window).scrollTop();

    // nav bar resize
    if ($('.navigation').hasClass('home-banner')) {
      if (scrollTop >= 80) {
        $('.navigation').addClass('scrolled-nav');
      } else if (scrollTop < 80) {
        $('.navigation').removeClass('scrolled-nav');
      }
    } else {
      if (scrollTop >= 50) {
        $('.navigation').addClass('scrolled-nav');
      } else if (scrollTop < 50) {
        $('.navigation').removeClass('scrolled-nav');
      }
    }
  });

  // if landing in the middle of the page, change nav to scrolled
  if ($(window).scrollTop() > 50) {
    $('.navigation').addClass('scrolled-nav');
  }
  $('#js-navigation-menu').removeClass('show');

  $('#js-mobile-menu').on('click', function() {
    document.getElementById('mobile-overlay').style.height = "100%";
    $('#js-navigation-menu').addClass('show');
    $(this).attr('aria-expanded', true);
  });

  $('#js-mobile-menu-close').on('click', function() {
    document.getElementById('mobile-overlay').style.height = "0%";
    $('#js-navigation-menu').removeAttr('style');
    $('#js-navigation-menu').removeClass('show');
    $('#js-mobile-menu').attr('aria-expanded', false);
  });

  $('#products-menu, #about-menu').on('click', function() {
    if ($(this).hasClass('open')) {
      $(this).removeClass('open');
    } else {
      $(this).siblings().removeClass('open');
      $(this).addClass('open');
    }
  });

  // tabbable navigation
  var topLevelLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link > a'), 0);
  topLevelLinks.forEach(function(link) {
    link.addEventListener('focus', function() {
      this.parentElement.classList.add('focus');
    });
    if (link.nextElementSibling) {
      var subMenu = link.nextElementSibling
      var subMenuLinks = subMenu.querySelectorAll('a')
      var lastLinkIndex = subMenuLinks.length - 1
      var lastLink = subMenuLinks[lastLinkIndex]
      lastLink.addEventListener('blur', function() {
        link.parentElement.classList.remove('focus');
      });
    }
  });

  // product page change image on size change
  $('form').on('click', "input", function(e) {
    var imgUrl = $(this).data().imgUrl;
    var imgAlt = $(this).data().imgAlt;
    $('#ProductPhoto img').attr('src', imgUrl);
    $('#ProductPhoto img').attr('alt', imgAlt);
  });

  // home page change image on variant change
  $('.home-grid-item form, .cart-recommended-accessories form').on('click', "input", function(e) {
    var imgUrl = $(this).data().imgUrl;
    var imgId = $(this).data().imgId;
    $('#' + imgId + ' img').attr('src', imgUrl);
  });

  // accordion functions
  var bannerHeight = 70;

  $('.scroll-link').on('click', function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  function scrollToAnchor(anchorId) {
    var aTag = $("a[name='"+ anchorId +"']");
    $('html, body').animate({
      scrollTop: aTag.offset().top - bannerHeight
    }, 1000);
  }

  //scroll to tabs on page load  if there is a hash
  var hash = window.location.hash
  if (hash.length > 0 && hash !== '#site-content') {
    var split = hash.split('#')
    window.setTimeout(function() {
      scrollToAnchor(split[1]);
      $(hash + ' h3').click();
    }, 500);
  }

  //scroll to tabs when you click on this class
  $('.scroll-to-tab').on('click', function(e) {
    e.preventDefault();
    var hash = e.currentTarget.hash
    var split = hash.split('#');
    scrollToAnchor(split[1]);
    $(hash + ' h3').click();
  });

  $('.accordion .accordion-header').on('click', function(evt) {
    evt.preventDefault();
    var _this = $(this).parent('.accordion');
    _this.find('.accordion-inner').slideToggle();
    _this.find('.rightarrow').toggle();
    _this.find('.downarrow').toggle();
  });

  // bazaar voice reviews opening on click
  window.bvCallback = function (BV) {
    BV.reviews.on('show', function () {
      scrollToAnchor('reviews');
      if (!$('#reviews .accordion-inner').is(':visible')) {
        $('#reviews .accordion-header').click();
      }
    });
    // BV.questions.on('show', function () {});
  }

  //some old modal bullshit
  // videos
  $('.play-video').on('click', function(evt) {
    evt.preventDefault();
    var videoId = $(this).data().videoid;
    openModal('video');
    vimeoPlayer(videoId);
  });

  // closing modal
  $('.modal-fade-screen, .modal-close').on('click', function() {
    closeModal();
    if (player) {
      stopVideo();
    }
  });

  $('.modal-inner').on('click', function(e) {
    e.stopPropagation();
  });

  // shipping modal open
  $('.shipping-options').on('click', function() {
    openModal('shipping-gb');
  });

  // Cart page
  // if cart page get cart items
  if (window.location.pathname.indexOf('cart') >= 0) {
    $.ajax({
      type: 'GET',
      url: '/cart.js',
      cache: false,
      dataType: 'json',
      success: function(cart) {
        currentCart = cart;
        analyzeCart(cart.items);
        if (window.location.hostname === 'shop.de.alivecor.com') {
          searchCartCarryPod(cart);
        } else {
          const kardiaUpsellOpen = searchCartKardiaCare(cart);
          // adding for carry pod pop up in cart
          if (!kardiaUpsellOpen){
            searchCartCarryPod(cart);
          }
        }
      }
    });
  }
  
  function searchCartKardiaCare(cart) {
    var km_in_cart = false,
        km6l_in_cart = false,
        kmc_in_cart = false,
        kardiacare_in_cart = false;
    for (i = 0; i < cart.items.length; i ++) {
      if (cart.items[i].handle === 'kardiamobile') {
        km_in_cart = true;
      }
      if (cart.items[i].handle === 'kardiamobile-card') {
        kmc_in_cart = true;
      }
      if (cart.items[i].handle === 'kardiamobile6l') {
        km6l_in_cart = true;
      }
      if (cart.items[i].handle.indexOf('kardiacare') >= 0) {
        kardiacare_in_cart = true;
      }
    }

    console.log(km6l_in_cart)
    // check for IE
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE '); // <=ie10
    var trident = ua.indexOf('Trident/'); // ie11
    var isIE = msie > 0 || trident > 0;
    if (kardiacare_in_cart && isIE) {
    // kardiacare in cart and using ie
      $('.cart-header').after("<div class=\"unsupported-browser\">IMPORTANT: The browser you are currently using may not be supported. We recommend you use Chrome, Firefox, Safari, Opera or Edge to continue your transaction.</div>");
    } else {
      if ((km6l_in_cart || km_in_cart) && !kardiacare_in_cart && !isIE) {
        setTimeout(function() {
          showKardiaCareOffer();
        }, 1500);
        return true;
      }
      if (kardiacare_in_cart && !km_in_cart && !km6l_in_cart && !kmc_in_cart) {
//        setTimeout(function() {
//           showKardiaMobileOffer();
//         }, 1500);
      }
    }
  }
  function searchCartCarryPod(cart) {
    var km_in_cart = false,
        km_cp_in_cart = false,
        km6l_in_cart = false,
        km6l_cp_in_cart = false;
    for (i = 0; i < cart.items.length; i ++) {
      if (cart.items[i].handle === 'kardiamobile') {
        km_in_cart = true;
      }
      if (cart.items[i].handle === 'kardiamobile-carrypod') {
        km_cp_in_cart = true;
      }
      if (cart.items[i].handle === 'kardiamobile6l') {
        km6l_in_cart = true;
      }
      if (cart.items[i].handle === 'kardiamobile6l-carrypod') {
        km6l_cp_in_cart = true;
      }
    }
    if (km6l_in_cart && !km6l_cp_in_cart) {
      setTimeout(function() {
        showCarryPod6lOffer();
      }, 1500);
    }
  }

  function showKardiaCareOffer() {
    var kardiacare_id, kardiacare_1month_id, kardiacare_1year_id, kardiacare_2year_id, currentShop;
    switch(window.location.hostname) {
      case '127.0.0.1':
        kardiacare_1month_id = 32283254751297;
        kardiacare_1year_id = 32194082472001;
        kardiacare_2year_id = 32283255341121;
        break;
      case 'store.kardia.com':
        kardiacare_1month_id = 32283254751297;
        kardiacare_1year_id = 32194082472001;
        kardiacare_2year_id = 32283255341121;
        break;
      case 'shop.kardiamobile.ca':
        // same as us
        kardiacare_1month_id = 32283254751297;
        kardiacare_1year_id = 32194082472001;
        kardiacare_2year_id = 32283255341121;
        break;
      case 'dev-alivecor-us.myshopify.com':
        kardiacare_1month_id = 32991987204199;
        kardiacare_1year_id = 32992175226983;
        kardiacare_2year_id = 32992089899111;
        break;
      case 'store.alivecor.co.uk':
        kardiacare_id = 36449673445448;
        currentShop = 'UK';
        break;
      default:
        break;
    }

    var activeUpsell = 'monthly'; // options: monthly, yearly, choice

    if (currentShop === 'UK') {
      $('.pop-up.kardiacare-upsell.original').addClass('open');
    } else {
      var unit = "Months",
          frequency;
      switch(activeUpsell) {
        case 'yearly':
          $('.pop-up.kardiacare-upsell.yearly').addClass('open');
          frequency = "12";
          kardiacare_id = kardiacare_1year_id;
          break;
        case 'monthly':
          $('.pop-up.kardiacare-upsell.monthly').addClass('open');
          frequency = "1";
          kardiacare_id = kardiacare_1month_id;
          break;
        case 'choice':
          $('.pop-up.kardiacare-upsell.choice').addClass('open');
          break;
        case 'omron':
          $('.pop-up.kardiacare-upsell.omron').addClass('open');
          frequency = "1";
          kardiacare_id = kardiacare_1month_id;
          break;
        default:
          break;
      }
    }

    $('#kardiacare-upsell-add-yearly').on('click', function() {
      kardiaCareCartAdd(kardiacare_id, frequency, unit);
    });
    $('#kardiacare-upsell-add-monthly').on('click', function() {
      kardiaCareCartAdd(kardiacare_id, frequency, unit);
    });
    $('#kardiacare-upsell-add-omron').on('click', function() {
      kardiaCareOmronCartAdd(kardiacare_id, frequency, unit);
    });
    $('#kardiacare-upsell-add').on('click', function() {
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          'quantity': 1,
          'id': kardiacare_id
        },
        dataType: 'json',
        success: function() {
          location.reload();
        }
      });
    });
    $('#kardiacare-upsell-add-monthly-699').on('click', function() {
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          'quantity': 1,
          'id': kardiacare_id,
          "properties": {
            "shipping_interval_frequency": frequency,
            "shipping_interval_unit_type": unit,
            "kc_price_test_699": true
          }
        },
        dataType: 'json',
        success: function() {
          window.location.href = '/cart';
        }
      });
    });
    $('#kardiacare-upsell-add-monthly-499').on('click', function() {
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          'quantity': 1,
          'id': kardiacare_id,
          "properties": {
            "shipping_interval_frequency": frequency,
            "shipping_interval_unit_type": unit,
            "kc_price_test_499": true
          }
        },
        dataType: 'json',
        success: function() {
          window.location.href = '/cart';
        }
      });
    });
    $('#kardiacare-upsell-no, #kardiacare-upsell-no-monthly, #kardiacare-upsell-no-yearly, #kardiacare-upsell-close').on('click', function() {
      $('.pop-up.kardiacare-upsell').removeClass('open');
    });
  }
  function showKardiaMobileOffer() {
    switch(window.location.hostname) {
      case 'store.kardia.com':
        var kardiamobile_id = 20036084615;
        break;
      case 'shop.kardiamobile.ca':
        // same as us
        var kardiamobile_id = 20036084615;
        break;
      case 'dev-alivecor-us.myshopify.com':
        var kardiamobile_id = 57806915659;
        break;
      case 'store.alivecor.co.uk':
        var kardiamobile_id = 17995438657;
        break;
      default:
        break;
    }
    $('.pop-up.kardiamobile-upsell').addClass('open');
    $('#kardiamobile-upsell-add').on('click', function() {
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          'quantity': 1,
          'id': kardiamobile_id
        },
        dataType: 'json',
        success: function() {
          location.reload();
        }
      });
    });
    $('#kardiamobile-upsell-no, #kardiamobile-upsell-close').on('click', function() {
      $('.pop-up.kardiamobile-upsell').removeClass('open');
    });
  }

  function showCarryPodOffer() {
    switch(window.location.hostname) {
      case 'store.kardia.com':
        var cp_id = 52407081427;
        break;
      case 'store.alivecor.co.uk':
        var cp_id = 4977985486887;
        break;
      case 'shop.de.alivecor.com':
        var cp_id = 14735901556785;
        break;
      case 'dev-alivecor-us.myshopify.com':
        var cp_id = 29056384073831;
        break;
      default:
        break;
    }
    $('.pop-up.km-carrypod').addClass('open');
    $('#km-carrypod-add').on('click', function() {
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          'quantity': 1,
          'id': cp_id
        },
        dataType: 'json',
        success: function() {
          location.reload();
        }
      });
    });
    $('#km-carrypod-no, #km-carrypod-close').on('click', function() {
      $('.pop-up.km-carrypod').removeClass('open');
    });
  }
  function showCarryPod6lOffer() {
    switch(window.location.hostname) {
      case '127.0.0.1':
        var cp6l_id = 29243799208001;
        break;
      case 'store.kardia.com':
        var cp6l_id = 29243799208001;
        break;
      case 'store.alivecor.co.uk':
        var cp6l_id = 29621855289416;
        break;
      case 'shop.de.alivecor.com':
        var cp6l_id = 16029382869041;
        break;
      case 'dev-alivecor-us.myshopify.com':
        var cp6l_id = 20769767522407;
        break;
      default:
        break;
    }
    $('.pop-up.km6l-carrypod').addClass('open');
    $('#km6l-carrypod-add').on('click', function() {
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          'quantity': 1,
          'id': cp6l_id
        },
        dataType: 'json',
        success: function() {
          location.reload();
        }
      });
    });
    $('#km6l-carrypod-no, #km6l-carrypod-close').on('click', function() {
      $('.pop-up.km6l-carrypod').removeClass('open');
    });
  }

  // //Cookies stuff
  // var acceptsCookies,
  //     closeCookieMsgBtn,
  //     cookiesMsg,
  //     disableKey,
  //     setCookie;

  // // get cookie named accepts_cookies
  // acceptsCookies = Cookies.get('accepts_cookies');

  // closeCookieMsgBtn = $('#cookies-ok');

  // cookiesMsg = $('#cookies-message');

  // closeCookieMsgBtn.on('click', function(e) {
  //   return cookiesMsg.remove();
  // });

  // // cookie will expire after a year
  // setCookie = function(value) {
  //   Cookies.set('accepts_cookies', value, {
  //     expires: 365,
  //     domain: 'kardia.com'
  //   });
  // };
  // setCookieCa = function(value) {
  //   Cookies.set('accepts_cookies', value, {
  //     expires: 365,
  //     domain: 'kardiamobile.ca'
  //   });
  // };

  // // accepts_cookies cookie exists
  // if (acceptsCookies !== undefined) {
  //   // remove banner
  //   cookiesMsg.remove();
  // } else {
  //   cookiesMsg.removeClass('hideBanner');
  //   if (window.location.hostname === 'shop.kardiamobile.ca') {
  //     setCookieCa(true);
  //   } else {
  //     setCookie(true);
  //   }
  // }
  //Newsletter signup
  var isEmail = function(email) {
    var regex;
    regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  };

  $("#mc-embedded-subscribe").on('click', function(e) {
    var email;
    $("footer .not-valid").hide();
    email = $("#mce-EMAIL").val();
    if (isEmail(email)) {
      var url = $("#mc-embedded-subscribe-form").prop('action');
      $.ajax({
        type: "GET",
        url: url,
        data: $("#mc-embedded-subscribe-form").serialize(),
        dataType: "json",
        crossDomain: true,
        success: function(data) {
          if (data.result == 'success') {
            $("footer .thankyou").fadeIn();
            var newsletterSubmitURL = window.location.protocol + '//' + window.location.host + window.location.pathname + '#newsletter-submit';
            window.location.href = newsletterSubmitURL;
          }
        }
      })
      .done(function(data) {
        if (data.result === 'error') {
          $("footer .error").html(data.msg).fadeIn();
        }
      });
    } else {
      $("footer .bad-email").fadeIn();
      return false;
    }
    e.preventDefault();
  });

  // listener for links to app
  $('.app-direct-link').on('click', function(evt) {
    evt.preventDefault();
    var link = $(this);

    // ios or android
    var agent = getUserAgent();
    if (agent !== '') {
      if (agent.indexOf('iphone') !== -1) {
        // ios device
        window.open(link.data().iosUrl, '_blank');
      } else {
        // not ios, assuming android
        window.open(link.data().androidUrl, '_blank');
      }
    } else {
      // could not get user agent
      window.open(link.attr('href'), '_blank');
    }
  });

  function getUserAgent() {
    var navigator = window.navigator;
    if (!navigator) {
      return '';
    }
    if (!navigator.userAgent) {
      return '';
    }
    return navigator.userAgent.toLowerCase();
  }

  $('.kardiacare-single__thumbnail').on('click', function(evt){
    evt.preventDefault();
    var newImage = $(this).attr('href');
    var newAlt = $(this).find('img').attr('alt');
    $('#ProductPhotoImg').attr('src', newImage);
    if (newAlt) {
      $('#ProductPhotoImg').attr('alt', newAlt);
    }
    $('.kardiacare-table table').hide();
    $('#ProductPhotoImg').show();
  });
  $('.kardiacare-table__thumbnail').on('click', function(evt) {
    evt.preventDefault();
    $('.kardiacare-table table').show();
    $('#ProductPhotoImg').hide();
  });
  // kardiacare selector
  $('.plan-selector label').on('click', function() {
    console.log('hello')
    var selectedPlan = $(this).parent().index();
    $('.plan-selector').attr('data-selected', selectedPlan);
    var price = $(this).children('.radio').data().price;
    $('#KardiaCareProductPrice').html(price);
  });

  $('.kardiacare-products .form-radio label').on('click', function() {
    var planData = $(this).find('.radio').data();
    var price = planData.price;
    if (planData.frequency === 1) {
      $('.h3.subtitle.kardiacare').html('Get your <b>second month free</b> when you join today.');
    } else if (planData.frequency === 12) {
      $('.h3.subtitle.kardiacare').html('Join today for an <b>extra month free</b>.<span>(13 months total)</span>');
    } else {
      $('.h3.subtitle.kardiacare').html('Join today for an <b>extra month free</b>.<span>(25 months total)</span>');
    }
    // if bundle page, update bundle price, else update main price
    if (planData.priceNumber) {
      var planPrice = planData.priceNumber;
      var devicePrice = $('input[name=kardiaCareBundleDevice]:checked').data().price;
      var originalPrice = (planPrice + devicePrice).toFixed(2);
      // var salePrice = (originalPrice * .8).toFixed(2);
      var salePrice = (originalPrice - 5).toFixed(2);
      $('#bundle-price').html(salePrice);
      $('#bundle-price-original').html(originalPrice);
      var planName = $(this)[0].innerText;
      $('#bundle-selected-plan').html(planName);
    } else {
      $('#KardiaCareProductPrice').html(price);
    }
  });

  $('.device-products .form-radio label').on('click', function() {
    var deviceData = $(this).find('.radio').data();
    var imgUrl = deviceData.imgUrl;
    $('#selected-device-img').attr('src', imgUrl);
    
    // update bundle price on change
    var planPrice = $('input[name=kardiaCareMembershipLength]:checked').data().priceNumber;
    var devicePrice = deviceData.price;
    var originalPrice = (planPrice + devicePrice).toFixed(2);
    // var salePrice = (originalPrice * .8).toFixed(2);
    var salePrice = (originalPrice - 5).toFixed(2);
    $('#bundle-price').html(salePrice);
    $('#bundle-price-original').html(originalPrice);
  });

  $('.kardiacare-products-bundle .form-radio label').on('click', function() {
    var planData = $(this).find('.radio').data();
    var planPrice = planData.priceNumber;
    var devicePrice = Number.parseInt(planData.devicePrice);
    var saleAmount = Number.parseInt(planData.saleAmount);
    var showSale = planData.showSale;
    var totalPrice = (planPrice + devicePrice).toFixed(2);
    var productPriceDisplay = $('#' + planData.priceDisplayId);
    if (saleAmount) {
      productPriceDisplay.html((totalPrice - saleAmount).toFixed(2));
      if (showSale) {
        $('.bundle-price-display #ProductPrice').addClass('green');
        if ($('.totalBundlePrice').length === 0) {
          $('<span class="line-through old-price totalBundlePrice">$' + totalPrice +'</span>').insertAfter('.bundle-price-display #ProductPrice');
        } else {
          $('.totalBundlePrice').html('$' + totalPrice);
        }
      }
    } else {
      $('.bundle-price-display #ProductPrice').removeClass('green');
      productPriceDisplay.html(totalPrice);
      if ($('.totalBundlePrice').length > 0) {
        $('.totalBundlePrice').remove();
      }
    }
    
    var planName = $(this)[0].innerText;
    $('#bundle-selected-plan').html(planName);

    if (planPrice === 0) {
      $('.price-disclaimer').addClass('hidden');
    } else {
      var priceDisclaimer = planData.priceDisclaimer;
      $('.price-disclaimer').removeClass('hidden');
      $('#kc-auto-charge-price').html(priceDisclaimer);
    }
  });
  $('.kardiacare-products-uk .form-radio label').on('click', function() {
    var planData = $(this).find('.radio').data();
    var price = planData.price;
    $('#KardiaCareProductPrice').html(price);
  });

});
var currentCart;

// video functions
var player;

function vimeoPlayer(id) {
  // player was already initialized
  if (player) {
    player.loadVideo(id).then(function() {
      playVideo();
      player.setColor('#2D9F86');
    });    
  } else {
    // first time playing a video
    var iframe = document.querySelector('#video-player iframe');
    iframe.src = 'https://player.vimeo.com/video/' + id;
    iframe.setAttribute('style', 'display: block');
    player = new Vimeo.Player(iframe);
    player.ready().then(function() {
      playVideo();
      player.setColor('#2D9F86');
    });
    
  }
  player.on('ended', function() {
    // close player when video ends
    player.unload();
    setTimeout(function() {
      closeModal();
    }, 500);
  });
}

function playVideo() {
  var isNotMobile = window.matchMedia("only screen and (min-width: 760px)");
  if (isNotMobile.matches) {
    player.play();
  }
}

function stopVideo() {
  player.pause();
  player.unload();
  player.off('ended');
}

//global modal functions
function openModal(type) {
  $('body').addClass("modal-open");
  $('.modal-fade-screen').addClass('open');

  if (type === 'video') {
    $('.modal-inner.video').show();
    $('.modal-inner.shipping-gb').hide();
  }
  if (type === 'shipping-gb') {
    $('.modal-inner.shipping-gb').show();
    $('.modal-inner.video').hide();
  }
}

function closeModal() {
  $('body').removeClass("modal-open");
  $('.modal-fade-screen').removeClass('open');
  $('.modal-inner').hide();
}

// KardiaCare recurring
function addToCartKardiaCareRecurring(event, form) {
  var event = event || window.event;
  event.preventDefault();
  var kardiacare_id = $('input[name=kardiaCareMembershipLength]:checked', '#kardiaCareProductAddToCartForm').val();
  var frequency = $('input[name=kardiaCareMembershipLength]:checked').data().frequency.toString();
  var unit = "Months";
  kardiaCareCartAdd(kardiacare_id, frequency, unit);
}

function addToCartKardiaCareBundle(event, form) {
  var event = event || window.event;
  event.preventDefault();
  var kardiacare_id = $('input[name=kardiaCareMembershipLength]:checked', '#kardiaCareBundleAddToCartForm').val();
  var frequency = $('input[name=kardiaCareMembershipLength]:checked').data().frequency.toString();
  var unit = "Months";
  var device_id = $('input[name=kardiaCareBundleDevice]:checked', '#kardiaCareBundleAddToCartForm').val();
  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: { items: [
      {
        'quantity': 1,
        'id': kardiacare_id,
        "properties": {
          "shipping_interval_frequency": frequency,
          "shipping_interval_unit_type": unit
        }
      },
      {
        'quantity': 1,
        'id': device_id,
        "properties": {
          "bundle_added": true
        }
      }
    ]},
    dataType: 'json',
    success: function() {
      window.location.href = '/cart';
    }
  });
}

function addToCartKardiaCareDeviceBundle(event, form, device) {
  var event = event || window.event;
  event.preventDefault();
  var kardiacare_id = $('input[name=kardiaCareMembershipLength]:checked', '#kardiaCareBundleAddToCartForm').val();
  var frequency = $('input[name=kardiaCareMembershipLength]:checked').data().frequency.toString();
  var unit = "Months";
  if (device === 'kardiamobile') {
    device_id = "20036084615";
  } else if (device === 'kardiamobile6l') {
    device_id = "28007532101697";
  } else if (device === 'kardiamobile-card') {
    device_id = "39719661371457";
  } else if (device === 'kardiamobile-card-member') {
    device_id = "39724290605121";
  }
  
  var items = [];
  if (device == 'kardiamobile6l') {
    items.push({
      'quantity': 1,
      'id': device_id,
      "properties": {
        "kc_6l_bundle": true
      }
    });
  } else if (device == 'kardiamobile-card') {
    items.push({
      'quantity': 1,
      'id': device_id,
      "properties": {
        "kcard_bundle": true
      }
    });
  } else {
    items.push({
      'quantity': 1,
      'id': device_id
    });
  }
//   if (kardiacare_id !== 'no_mem' && device == 'kardiamobile') {
  if (kardiacare_id != 'no_mem') {
    items.push({
      'quantity': 1,
      'id': kardiacare_id,
      "properties": {
        "shipping_interval_frequency": frequency,
        "shipping_interval_unit_type": unit
      }
    })
  }
//   if (kardiacare_id !== 'no_mem' && device == 'kardiamobile6l') {
//     items.push({
//       'quantity': 1,
//       'id': kardiacare_id,
//       "properties": {
//         "shipping_interval_frequency": frequency,
//         "shipping_interval_unit_type": unit,
//         "kc_6l_bundle": true
//       }
//     })
//   }
//   if (device == 'kardiamobile-card') {
//     items.push({
//       'quantity': 1,
//       'id': kardiacare_id,
//       "properties": {
//         "shipping_interval_frequency": frequency,
//         "shipping_interval_unit_type": unit,
//         "kcard_bundle": true
//       }
//     })
//   }

  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: { items: items },
    dataType: 'json',
    success: function() {
      window.location.href = '/cart';
    }
  });
}

function kardiaCareCartAdd(kardiacare_id, frequency, unit) {
  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: {
      'quantity': 1,
      'id': kardiacare_id,
      "properties": {
        "shipping_interval_frequency": frequency,
        "shipping_interval_unit_type": unit
      }
    },
    dataType: 'json',
    success: function() {
      window.location.href = '/cart';
    }
  });
}

function addToCartKardiaCare6lBundleEmailPromo(event, form) {
  var event = event || window.event;
  event.preventDefault();
  var kardiacare_id = $('input[name=kardiaCareMembershipLength]:checked', '#kardiaCareBundleAddToCartForm').val();
  var frequency = $('input[name=kardiaCareMembershipLength]:checked').data().frequency.toString();
  var unit = "Months";
  var device_id = "28007532101697";
  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: { items: [
      {
        'quantity': 1,
        'id': kardiacare_id,
        "properties": {
          "shipping_interval_frequency": frequency,
          "shipping_interval_unit_type": unit,
          "kc_6l_bundle": true,
          "email_promo_6l_kc_year": true
        }
      },
      {
        'quantity': 1,
        'id': device_id,
        "properties": {
          "kc_6l_bundle": true
        }
      }
    ]},
    dataType: 'json',
    success: function() {
      window.location.href = '/cart';
    }
  });
}
function analyzeCart(cartItems) {
  var updates = {};
  var hasKmCard = cartItems.some(function(item) {return item.handle === 'kardiamobile-card'; });
  var hasKmCardCode = cartItems.some(function(item) {return item.handle === 'kardiamobile-card-code'; });
  var hasKm6l = cartItems.some(function(item) {return item.handle === 'kardiamobile6l'; });
  var hasKardiaCareMonthly = cartItems.some(function(item) {return item.handle === 'kardiacare-monthly'; });
  var hasKardiaCareAnnual = cartItems.some(function(item) {return item.handle === 'kardiacare'; });
  var kmMonthly = cartItems.find(function(item) { return item.handle === 'kardiacare-monthly'; });
  var kmAnnual = cartItems.find(function(item) { return item.handle === 'kardiacare'; });
  if (hasKmCard) {
    // hide kcAnnual remove
    $('#' + kmAnnual.id + ' .cart__remove').hide();
  }
  if (hasKm6l) {
    if (hasKardiaCareAnnual && hasKardiaCareMonthly) {
      if (hasKmCard) {
        $('#' + kmMonthly.id + ' .cart__remove').hide();
      } else {
        $('#' + kmAnnual.id + ' .cart__remove').hide();
      }
    } else if (hasKardiaCareAnnual) {
      $('#' + kmAnnual.id + ' .cart__remove').hide();
    } else if (hasKardiaCareMonthly) {
      $('#' + kmMonthly.id + ' .cart__remove').hide();
    }
  }
  if (hasKmCard && !hasKardiaCareAnnual) {
    var kmCard = cartItems.find(function(item) { return item.handle === 'kardiamobile-card'; });
    updates[kmCard.variant_id] = 0;
  }
  // if (hasKm6l && (!hasKardiaCareMonthly && !hasKardiaCareAnnual)) {
  //   var km6l = cartItems.find(function(item) { return item.handle === 'kardiamobile6l'; });
  //   updates[km6l.variant_id] = 0;
  // }
  if (Object.keys(updates).length > 0) {
    $.ajax({
      type: 'POST',
      url: '/cart/update.js',
      data: {
        updates
      },
      dataType: 'json',
      success: function() {
        window.location.href = '/cart';
      }
    });
  }
}
function kc6lBundleRemove(event) {
  var cartItems = currentCart.items;
  event.preventDefault();
  // remove monthly if annual and monthly in cart
  // no card and only 1 kc, remove annual
  var updates = {};
  var hasKmCard = cartItems.some(function(item) {return item.handle === 'kardiamobile-card'; });
  var hasKardiaCareMonthly = cartItems.some(function(item) {return item.handle === 'kardiacare-monthly'; });
  var hasKardiaCareAnnual = cartItems.some(function(item) {return item.handle === 'kardiacare'; });
  var km6l = cartItems.find(function(item) { return item.handle === 'kardiamobile6l'; });
  updates[km6l.variant_id] = 0;
  if (hasKardiaCareAnnual && hasKardiaCareMonthly) {
      // remove monthly
      var kcMonthly = cartItems.find(function(item) { return item.handle === 'kardiacare-monthly'; });
      updates[kcMonthly.variant_id] = 0;
  } else if (hasKardiaCareAnnual) {
    if (!hasKmCard) {
      // remove annual
      var kcAnnual = cartItems.find(function(item) { return item.handle === 'kardiacare'; });
      updates[kcAnnual.variant_id] = 0;
    }
  } else if (hasKardiaCareMonthly){
    // remove monthly
    var kcMonthly = cartItems.find(function(item) { return item.handle === 'kardiacare-monthly'; });
    updates[kcMonthly.variant_id] = 0;
  }

  $.ajax({
    type: 'POST',
    url: '/cart/update.js',
    data: {
      updates
    },
    dataType: 'json',
    success: function() {
      window.location.href = '/cart';
    }
  });
}
function kcCardBundleRemove(event) {
  var cartItems = currentCart.items;
  event.preventDefault();
  // remove kcard and kc annual if 6l is not in the cart
  var updates = {};
  var hasKm6l = cartItems.some(function(item) {return item.handle === 'kardiamobile6l'; });
  var hasKardiaCareMonthly = cartItems.some(function(item) {return item.handle === 'kardiacare-monthly'; });
  var kmCard = cartItems.find(function(item) { return item.handle === 'kardiamobile-card'; });
  updates[kmCard.variant_id] = 0;
  if ((hasKm6l && hasKardiaCareMonthly) || (!hasKm6l)) {
    var kcAnnual = cartItems.find(function(item) { return item.handle === 'kardiacare'; });
    updates[kcAnnual.variant_id] = 0;
  }

  $.ajax({
    type: 'POST',
    url: '/cart/update.js',
    data: {
      updates
    },
    dataType: 'json',
    success: function() {
      window.location.href = '/cart';
    }
  });
}
function quantityChange(event, variantId) {
  event.preventDefault();
  var newQuantity = event.target.value;
  var updates = {};
  updates[variantId] = newQuantity;
  $.ajax({
    type: 'POST',
    url: '/cart/update.js',
    data: {
      updates
    },
    dataType: 'json',
    success: function() {
      window.location.href = '/cart';
    }
  });
}

function toggleHeader(event) {
  let htmlClasses = document.querySelector('html').classList;
  htmlClasses.toggle('menu-active')
  htmlClasses.add('menu-already-activated')

  document.querySelector('body').classList.toggle('overflow-hidden')
}