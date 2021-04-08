function isIe() {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        return true
    } else {
        return false;
    }
}

if (isIe()) {
    $('body').css({
        "background": "url(/src/img/browser-support.png) center center no-repeat #000000"
    });
    $('.overlay, .main, #container').remove();
} else {
    function Ticker(elem) {
        elem.lettering();
        this.done = false;
        this.cycleCount = 5;
        this.cycleCurrent = 0;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+{}|[]\\;\':"<>?,./`~'.split('');
        this.charsCount = this.chars.length;
        this.letters = elem.find('span');
        this.letterCount = this.letters.length;
        this.letterCurrent = 0;

        this.letters.each(function() {
            var $this = $(this);
            $this.attr('data-orig', $this.text());
            $this.text('-');
        });
    }

    Ticker.prototype.getChar = function() {
        return this.chars[Math.floor(Math.random() * this.charsCount)];
    };

    Ticker.prototype.reset = function() {
        this.done = false;
        this.cycleCurrent = 0;
        this.letterCurrent = 0;
        this.letters.each(function() {
            var $this = $(this);
            $this.text($this.attr('data-orig'));
            $this.removeClass('done');
        });
        this.loop();
    };

    Ticker.prototype.loop = function() {
        var self = this;

        this.letters.each(function(index, elem) {
            var $elem = $(elem);
            if (index >= self.letterCurrent) {
                if ($elem.text() !== ' ') {
                    $elem.text(self.getChar());
                    $elem.css('opacity', Math.random());
                }
            }
        });

        if (this.cycleCurrent < this.cycleCount) {
            this.cycleCurrent++;
        } else if (this.letterCurrent < this.letterCount) {
            var currLetter = this.letters.eq(this.letterCurrent);
            this.cycleCurrent = 0;
            currLetter.text(currLetter.attr('data-orig')).css('opacity', 1).addClass('done');
            this.letterCurrent++;
        } else {
            this.done = true;
        }

        if (!this.done) {
            requestAnimationFrame(function() {
                self.loop();
            });
        } else {
            setTimeout(function() {
                self.reset();
            }, 15000);
        }
    };

    $title = $('.title');
    $fmood = $('.firstmood');
    $smood = $('.secondmood');
    $tmood = $('.thirthmood');

    $fmood.each(function() {
        var $this = $(this),
            ticker = new Ticker($this).reset();
        $this.data('ticker', ticker);
    });
    setTimeout(function() {
        $smood.each(function() {
            var $this = $(this),
                ticker = new Ticker($this).reset();
            $this.data('ticker', ticker);
        });
    }, 2300);
    setTimeout(function() {
        $tmood.each(function() {
            var $this = $(this),
                ticker = new Ticker($this).reset();
            $this.data('ticker', ticker);
        });
    }, 4500);
    setTimeout(function() {
        $title.each(function() {
            var $this = $(this),
                ticker = new Ticker($this).reset();
            $this.data('ticker', ticker);
            $('h1').addClass('show');
        });
    }, 7500);

    window.setTimeout(function() {
        $('.moods').addClass('hide');
        color = rgbToHex(255, 255, 255);
        object.update();
        $('.songSearch').addClass('hide');
        setTimeout(function() {
            $('.music').addClass('show');
            setTimeout(function() {
                $('input').focus();
            }, 2000);
        }, 2000);
        setTimeout(function() {
            $('.songSearch').addClass('show').removeClass('hide').delay(5000);
        }, 3200);
    }, 7000);

    setTimeout(function() {
        color = rgbToHex(44, 251, 232);
        object.update();
    }, 400);

    setTimeout(function() {
        color = rgbToHex(56, 248, 67);
        object.update();
    }, 2500);

    setTimeout(function() {
        color = rgbToHex(42, 241, 252);
        object.update();
    }, 4500);

    // $(".songSearch").focus(function() {
    //     $('.musiclist').addClass('show');
    // });
    // $(".songSearch").focusout(function() {
    //     $('.musiclist').removeClass('show').addClass('hide');
    // });
    // $(".musiclist li").on('click', function() {
    //     $('.music').removeClass('show').addClass('hide');
    //     setTimeout(function() {
    //         $('.moodfinal').addClass('show');
    //         moodScroll(40).delay(300);
    //     }, 500);
    // });

    // Mood Scroller

    var scrollW = document.getElementById("wrap-scroll");
    var scrollUl = document.getElementById("ul-scroll");
    var itemsScrolled,
        itemsMax,
        cloned = false;

    var listOpts = {
        itemCount: null,
        itemHeight: null,
        items: [],
    };

    function scrollWrap() {

        itemsScrolled = Math.ceil((this.scrollTop + listOpts.itemHeight / 3) / listOpts.itemHeight);

        //Isso é um tratamento para o primeiro item aparecer com active
        if (this.scrollTop < 1) {
            itemsScrolled = 0;
        }
        // Isso aqui tira a classe active
        listOpts.items.forEach(function(ele) {
                ele.classList.remove("active");
            })
            // Isso aqui adiciona a active
        if (itemsScrolled < listOpts.items.length) {
            listOpts.items[itemsScrolled].classList.add("active");
        }
    }

    function initItems(scrollSmooth) {

        listOpts.items = [].slice.call(scrollUl.querySelectorAll("li"));
        listOpts.itemHeight = 60;
        listOpts.itemCount = listOpts.items.length;

        if (!itemsMax) {
            itemsMax = listOpts.itemCount;
        }

        if (scrollSmooth) {
            var seamLessScrollPoint = ((itemsMax - 3) * listOpts.itemHeight);
            scrollW.scrollTop = seamLessScrollPoint;
        }

    }

    document.addEventListener("DOMContentLoaded", function(event) {
        initItems();
        scrollW.onscroll = scrollWrap;
    });

    var moodtop = 60;

    function moodScroll(index) {
        $('#ul-scroll li span').removeAttr('id');
        $('#ul-scroll li').eq(index).find('span').attr('id', 'selectedmood');

        $('#wrap-scroll').animate({
            scrollTop: $("#selectedmood").position().top - 60,
        }, index * 50);

        if (index == 1) {
            $('#wrap-scroll').animate({
                scrollTop: 37,
            }, index * 700);
        } else if (index == 0) {
            $('#wrap-scroll').animate({
                scrollTop: 0,
            }, index * 1500);
            $('#ul-scroll li:first-child').addClass("active");
        }
    }

    var scrollW = document.getElementById("wrap-scroll");
    var scrollUl = document.getElementById("ul-scroll");
    var itemsScrolled,
        itemsMax,
        cloned = false;

    var listOpts = {
        itemCount: null,
        itemHeight: null,
        items: [],
    };

    function scrollWrap() {

        itemsScrolled = Math.ceil((this.scrollTop + listOpts.itemHeight / 3) / listOpts.itemHeight);

        //Isso é um tratamento para o primeiro item aparecer com active
        if (this.scrollTop < 1) {
            itemsScrolled = 0;
        }
        // Isso aqui tira a classe active
        listOpts.items.forEach(function(ele) {
                ele.classList.remove("active");
            })
            // Isso aqui adiciona a active
        if (itemsScrolled < listOpts.items.length) {
            listOpts.items[itemsScrolled].classList.add("active");
        }
    }

    function initItems(scrollSmooth) {

        listOpts.items = [].slice.call(scrollUl.querySelectorAll("li"));
        listOpts.itemHeight = 60;
        listOpts.itemCount = listOpts.items.length;

        if (!itemsMax) {
            itemsMax = listOpts.itemCount;
        }

        if (scrollSmooth) {
            var seamLessScrollPoint = ((itemsMax - 3) * listOpts.itemHeight);
            scrollW.scrollTop = seamLessScrollPoint;
        }

    }

    document.addEventListener("DOMContentLoaded", function(event) {
        initItems();
        scrollW.onscroll = scrollWrap;
    });

    var moodtop = 60;

    function moodScroll(index) {
        $('#ul-scroll li span').removeAttr('id');
        $('#ul-scroll li').eq(index).find('span').attr('id', 'selectedmood');

        $('#wrap-scroll').animate({
            scrollTop: $("#selectedmood").position().top - 60,
        }, index * 200);

        setTimeout(function() {
            $('.moodfinal .share').removeClass('hide').addClass('show');
        }, index);
        setTimeout(function() {
            $('.moodfinal .start').removeClass('hide').addClass('show');
        }, index + 300);

        if (index == 1) {
            $('#wrap-scroll').animate({
                scrollTop: 37,
            }, index * 700);
        } else if (index == 0) {
            $('#wrap-scroll').animate({
                scrollTop: 0,
            }, index * 700);
            $('#ul-scroll li:first-child').addClass("active");
        }
    }

    var typingTimer;

    $('.songSearch').on('keydown', function() {
        clearTimeout(typingTimer);
    });

    $('.songSearch').keyup(function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, 1000);
    });

    function doneTyping() {
        var _this = $('.songSearch');
        var size = _this.val().length;
        $('.musiclist').html('');
        if (size >= 3 && _this.val() !== 'Processing...') {
            $.ajax({
                url: 'https://api.spotify.com/v1/search?query=' + encodeURIComponent(_this.val()) + '&offset=0&limit=50&type=track',
                success: function(data) {
                    var items = data.tracks.items;
                    if (items.length > 0) {
                        items.forEach(function(item) {
                            var template = '<li><img src="' + item.album.images[0].url + '" alt="' + item.name + '"><span class="song">' + item.name + '</span><span>' + item.artists[0].name + '</span></li>';
                            $('.musiclist').append(template);
                        });
                        $('.musiclist').addClass('show');
                    } else {
                        $.ajax({
                            url: 'https://jsonp.afeld.me/?url=https://itunes.apple.com/search?term=' + encodeURIComponent(_this.val()) + '&entity=musicTrack',
                            complete: function(data) {
                                var json = JSON.parse(data.responseText.replace('\\n', ''));
                                if (json.resultCount > 0) {
                                    json.results.forEach(function(item) {
                                        var template = '<li><img src="' + item.artworkUrl100 + '" alt="' + item.trackName + '"><span class="song">' + item.trackName + '</span><span>' + item.artistName + '</span></li>';
                                        $('.musiclist').append(template);
                                    });
                                    $('.musiclist').addClass('show');
                                } else {
                                    var template = '<li style="text-align:center"><span class="song">Sorry</span><span>Music Not Found</span></li>';
                                    $('.musiclist').append(template);
                                }
                                $('.musiclist').addClass('show');
                            }
                        })
                    }
                }
            })
        }
    }

    $('.musiclist').on('click', 'li', function() {
        var song = $(this).find('span').eq(0).text();
        var artist = $(this).find('span').eq(1).text();
        var image = $(this).find('img').attr('src');
        if (artist !== 'Music Not Found') {
            $('.musiclist').removeClass('show').addClass('hide');
            $('.songSearch').val('Processing...');
            $.ajax({
                url: '/get_song',
                type: 'POST',
                data: {
                    song: song,
                    artist: artist
                },
                success: function(data) {
                    var preview_url = data.preview_url;
                    var moodColor = data.mood.color;
                    var energy = data.mood.energy;
                    var valence = data.mood.valence;
                    a1 = (energy * 5) + 1;
                    //n21 = (valence*150)-50
                    color = rgbToHex(moodColor[0], moodColor[1], moodColor[2]);
                    object.update();
                    rotateTimeout = setTimeout(rotate, 60);
                    $('.music').removeClass('show').addClass('hide');

                    setTimeout(function() {
                        $('.moodfinal').addClass('show');
                        $('.listen').attr('href',data.playlist_url);
                        $('.featured').addClass('hide').removeClass('show');
                        $('.player').removeClass('hide').addClass('show');
                        $('.player .song').html(song);
                        $('.player .artist').html(artist);
                        $('.player img').attr('src',image);
                    }, 1000);
                    moodboard(preview_url);
                    moodScroll(data.mood.colorIndex - 2);
                },
                error: function(error) {
                    console.log(error);
                }
            })
        }
    });

    $('.start').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.songSearch').val('');
        $('audio').remove();
        rotate();
        color = '0xffffff';
        object.update();
        moodScroll(0);
        $('.musiclist').removeClass('show').addClass('hide');
        $('.moodfinal').removeClass('show').addClass('hide');
        setTimeout(function() {
            $('.music').removeClass('hide').addClass('show');
        }, 700);
        $('.moodfinal .start').addClass('hide');
        $('.moodfinal .share').addClass('hide');
        //$('.featured').removeClass('hide').addClass('show');
        $('.player').removeClass('show').addClass('hide');
    });

    function volume() {
        var sound = document.getElementById("audio_player");
        if (sound) {
            if (sound.currentTime < 5) {
                sound.volume = sound.currentTime / 5;
            }
            if (sound.currentTime > 25) {
                sound.volume = abs(((sound.currentTime - 25) / 5) - 1);
            }
        }
        setTimeout(volume, 100);
    }
    volume();

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    initApp();

    var rotateTimeout;

    function rotate() {
        object.scene.rotation.y += 0.02;
        if (object.scene.rotation.y < 3.14) {
            rotateTimeout = setTimeout(rotate, 60);
        } else {
            object.scene.rotation.y = 0;
        }
    }

    rotate();

    function resize() {
        if ($(window).width() > 640) {
            $(".wrap").height($(window).height());
        }
    }
    resize();
    window.onload = window.onresize = function() {

    };

    $("#trigger-overlay").click(function() {
        $(".overlay-scale").toggleClass("open");
    });
    $(".overlay-close").click(function() {
        $(".overlay-scale").toggleClass("open");
    });

    if ($(window).width() < 640) {
        $(".songSearch").attr("placeholder", "Type a song");
        $(".songSearch").addClass("mobile");
        $('footer').remove();
    }

}
