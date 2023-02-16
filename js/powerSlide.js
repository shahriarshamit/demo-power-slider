
(function ($) {
    $.fn.powerSlide = function (options) {
        var opt = {
            'width': 908,
            'height': 340,
            'position': 'bottom',
            'bullets': false,
            'thumbs': true,
            'row': 10,
            'auto': true,
            'autoSpeed': 4000,
            'fadeSpeed': 1000
        };
        this.each(function () {
            if (options) {
                $.extend(opt, options);
            }
            $(this).children().wrapAll('<div class="powerSlide" />');

            var container = $(this).find('.powerSlide');
            container.find('img').wrapAll('<div class="wrapper" />');
            if (opt.position === 'top') {
                container.prepend('<div class="nav" />');
            } else {
                container.append('<div class="nav" />');
            }

            var wrapper = container.find('.wrapper');
            wrapper.append('<a href="#" class="prev">Prev</a><a href="#" class="next">Next</a>');

            var nav = container.find('.nav');
            wrapper.find('img').each(function (i) {
                i += 1;
                if (opt.bullets === true) {
                    nav.append('<a href="#">' + i + '</a>');
                }
                if (opt.thumbs === true) {
                    nav.addClass('thumbs').append('<img class="thumb" src="' + $(this).attr('src') + '" alt=""/>');
                }
                var title = $(this).attr('title');
                $(this).wrapAll('<div class="image" />');
                if (title !== undefined) {
                    $(this).attr('title', '');
                    $(this).after('<p>' + title + '</p>');
                }
            });
            
            var Slider = function () {
                this.imgs = wrapper.find('div.image');
                this.imgCount = (this.imgs.length) - 1;
                this.navPrev = wrapper.find('a.prev');
                this.navNext = wrapper.find('a.next');
                this.bullets = container.find('.nav a');
                this.thumbs = container.find('.nav img.thumb');
                this.captions = this.imgs.find('p');
                this.getCurrentIndex = function () {
                    return this.imgs.filter('.current').index();
                };
                this.go = function (index) {
                    this.imgs.removeClass('current').fadeOut(opt.fadeSpeed).eq(index).fadeIn(opt.fadeSpeed).addClass('current');
                    this.bullets.removeClass('current').eq(index).addClass('current');
                    this.thumbs.removeClass('current').eq(index).addClass('current');
                };
                this.next = function () {
                    var index = this.getCurrentIndex();
                    if (index < this.imgCount) {
                        this.go(index + 1);
                    } else {
                        this.go(0);
                    }
                };
                this.prev = function () {
                    var index = this.getCurrentIndex();
                    if (index > 0) {
                        this.go(index - 1);
                    } else {
                        this.go(this.imgCount);
                    }
                };
                this.init = function () {
                    wrapper.width(opt.width).height(opt.height);
                    this.imgs.hide().first().addClass('current').show();
                    this.bullets.first().addClass('current');
                    this.thumbs.first().addClass('current');
                    var padding = wrapper.css('padding-left').replace('px', '');
                    var captionsPadding = this.captions.css('padding-left').replace('px', '');
                    nav.width(opt.width);
                    if (opt.thumbs === true) {
                        var thumbBorder = this.thumbs.css('border-left-width').replace('px', '');
                        var thumbMargin = this.thumbs.css('margin-right').replace('px', '');
                        var thumbMaxWidth = opt.width / opt.row;
                        this.thumbs.width((thumbMaxWidth - (thumbMargin * 2)) - (thumbBorder * 2));
                    }
                    this.captions.width(opt.width - (captionsPadding * 2) + 'px').css('margin-bottom', padding + 'px');
                    this.navNext.css('margin-right', padding + 'px');
                };
            };
            var slider = new Slider();
            slider.init();
            wrapper.hover(function () {
                slider.captions.stop(true, true).fadeToggle();
                slider.navNext.stop(true, true).fadeToggle();
                slider.navPrev.stop(true, true).fadeToggle();
            });
            slider.navNext.click(function (e) {
                e.preventDefault();
                slider.next();
            });
            slider.navPrev.click(function (e) {
                e.preventDefault();
                slider.prev();
            });
            slider.bullets.click(function (e) {
                e.preventDefault();
                slider.captions.hide();
                slider.go($(this).index());
            });
            slider.thumbs.click(function () {
                slider.captions.hide();
                slider.go($(this).index());
            });
            if (opt.auto === true) {
                var timer = function () {
                    slider.next();
                    slider.captions.hide();
                };
                var interval = setInterval(timer, opt.autoSpeed);
                wrapper.hover(function () {
                    clearInterval(interval);
                }, function () {
                    interval = setInterval(timer, opt.autoSpeed);
                });
                slider.thumbs.click(function () {
                    clearInterval(interval);
                    interval = setInterval(timer, opt.autoSpeed);
                });
                slider.bullets.click(function () {
                    clearInterval(interval);
                    interval = setInterval(timer, opt.autoSpeed);
                });
            }
        });
    };
})(jQuery);
