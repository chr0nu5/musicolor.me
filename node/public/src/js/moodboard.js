var moodboard = function(url) {
    var ALPHA, AudioAnalyser, COLORS, MP3_PATH, NUM_BANDS, NUM_PARTICLES, Particle, SCALE, SIZE, SMOOTHING, SPEED, SPIN;
    NUM_PARTICLES = 1;
    NUM_BANDS = 64;
    SMOOTHING = 0.5;
    MP3_PATH = url;
    SCALE = {
        MIN: 5,
        MAX: 80
    };
    SPEED = {
        MIN: 0.2,
        MAX: 1
    };
    ALPHA = {
        MIN: 0.8,
        MAX: 0.9
    };
    SPIN = {
        MIN: 0.001,
        MAX: 0.005
    };
    SIZE = {
        MIN: 0.5,
        MAX: 1.25
    };
    COLORS = [
        '#69D2E7',
        '#1B676B',
        '#BEF202',
        '#EBE54D',
        '#00CDAC',
        '#1693A5',
        '#F9D423',
        '#FF4E50',
        '#E7204E',
        '#0CCABA',
        '#FF006F'
    ];


    // var element = document.getElementsByTagName("canvas");
    // for (index = element.length - 1; index >= 0; index--) {
    //     element[index].parentNode.removeChild(element[index]);
    // }
    element = document.getElementsByTagName("audio");
    for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
    }


    AudioAnalyser = function() {
        AudioAnalyser.AudioContext = self.AudioContext || self.webkitAudioContext;
        AudioAnalyser.enabled = AudioAnalyser.AudioContext != null;

        function AudioAnalyser(audio, numBands, smoothing) {
            var src;
            this.audio = audio != null ? audio : new Audio();
            this.numBands = numBands != null ? numBands : 256;
            this.smoothing = smoothing != null ? smoothing : 0.3;
            if (typeof this.audio === 'string') {
                src = this.audio;
                this.audio = new Audio();
                this.audio.crossOrigin = 'anonymous';
                this.audio.controls = true;
                this.audio.src = src;
                this.audio.id = "audio_player";
                this.audio.volume = 0;
                this.audio.loop = true;
            }
            this.context = new AudioAnalyser.AudioContext();
            this.jsNode = this.context.createScriptProcessor(2048, 1, 1);
            this.analyser = this.context.createAnalyser();
            this.analyser.smoothingTimeConstant = this.smoothing;
            this.analyser.fftSize = this.numBands * 2;
            this.bands = new Uint8Array(this.analyser.frequencyBinCount);
            this.audio.addEventListener('canplay', function(_this) {
                return function() {
                    _this.source = _this.context.createMediaElementSource(_this.audio);
                    _this.source.connect(_this.analyser);
                    _this.analyser.connect(_this.jsNode);
                    _this.jsNode.connect(_this.context.destination);
                    _this.source.connect(_this.context.destination);
                    return _this.jsNode.onaudioprocess = function() {
                        _this.analyser.getByteFrequencyData(_this.bands);
                        if (!_this.audio.paused) {
                            return typeof _this.onUpdate === 'function' ? _this.onUpdate(_this.bands) : void 0;
                        }
                    };
                };
            }(this));
        }
        AudioAnalyser.prototype.start = function() {
            return this.audio.play();
        };
        AudioAnalyser.prototype.stop = function() {
            return this.audio.pause();
        };
        return AudioAnalyser;
    }();
    Particle = function() {
        function Particle(x1, y1) {
            this.x = x1 != null ? x1 : 0;
            this.y = y1 != null ? y1 : 0;
            this.reset();
        }
        Particle.prototype.reset = function() {
            this.level = 1 + floor(random(4));
            this.scale = random(SCALE.MIN, SCALE.MAX);
            this.alpha = random(ALPHA.MIN, ALPHA.MAX);
            this.speed = random(SPEED.MIN, SPEED.MAX);
            this.color = random(COLORS);
            this.size = random(SIZE.MIN, SIZE.MAX);
            this.spin = random(SPIN.MAX, SPIN.MAX);
            this.band = floor(random(NUM_BANDS));
            if (random() < 0.5) {
                this.spin = -this.spin;
            }
            this.smoothedScale = 0;
            this.smoothedAlpha = 0;
            this.decayScale = 0;
            this.decayAlpha = 0;
            this.rotation = random(TWO_PI);
            return this.energy = 0;
        };
        return Particle;
    }();
    if ($(window).width() > 640) {
        Sketch.create({
            particles: [],
            setup: function() {
                var analyser, error, i, intro, j, particle, ref, warning, x, y;
                for (i = j = 0, ref = NUM_PARTICLES - 1; j <= ref; i = j += 1) {
                    x = random(this.width);
                    y = random(this.height * 2);
                    particle = new Particle(x, y);
                    particle.energy = random(particle.band / 256);
                    this.particles.push(particle);
                }
                if (AudioAnalyser.enabled) {
                    try {
                        analyser = new AudioAnalyser(MP3_PATH, NUM_BANDS, SMOOTHING);
                        analyser.onUpdate = function(_this) {
                            return function(bands) {
                                var k, len, ref1, results;
                                ref1 = _this.particles;
                                results = [];
                                for (k = 0, len = ref1.length; k < len; k++) {
                                    particle = ref1[k];
                                    results.push(particle.energy = bands[particle.band] / 256);
                                }
                                m2 = results[0] * 20;
                                object.update();
                                return results;
                            };
                        }(this);
                        analyser.start();
                        document.body.appendChild(analyser.audio);
                        if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
                            return warning.style.display = 'block';
                        }
                    } catch (_error) {
                        error = _error;
                    }
                } else {
                    return warning.style.display = 'block';
                }
            }
        });
    }
}
