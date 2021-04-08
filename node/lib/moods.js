var Mood = function(mood, energy, valence, color) {
    this.mood = mood;
    this.energy = energy;
    this.valence = valence;
    this.color = color;
};

var Moods = function() {
    var _this = this;
    this.moods = [
        new Mood("none", 2, 2, [0, 0, 0]),
        new Mood("neutral", 0, 0, [255, 255, 255]),
        new Mood("energetic", 0.98, 0.5, [253, 161, 51]),
        new Mood("poignant", 0.95, 0.35, [252, 77, 34]),
        new Mood("intense", 0.925, 0.45, [253, 131, 44]),
        new Mood("angry", 0.88, 0.26, [252, 46, 31]),
        new Mood("aggressive", 0.85, 0.365, [252, 72, 34]),
        new Mood("groovy", 0.845, 0.46, [253, 135, 45]),
        new Mood("harsh", 0.175, 0.38, [252, 48, 65]),
        new Mood("disturbing", 0.825, 0.325, [252, 49, 31]),
        new Mood("rebellious", 0.73, 0.33, [252, 46, 35]),
        new Mood("rowdy", 0.645, 0.44, [252, 62, 32]),
        new Mood("manic", 0.63, 0.3, [252, 52, 131]),
        new Mood("passionate", 0.55, 0.355, [252, 61, 194]),
        new Mood("enthusiastic", 0.925, 0.73, [253, 250, 74]),
        new Mood("warm", 0.89, 0.525, [253, 182, 56]),
        new Mood("funky", 0.875, 0.66, [254, 242, 72]),
        new Mood("fun", 0.876, 0.775, [229, 251, 73]),
        new Mood("spiritual", 0.82, 0.55, [254, 200, 61]),
        new Mood("lively", 0.84, 0.8, [209, 250, 71]),
        new Mood("bouncy", 0.825, 0.9, [176, 249, 70]),
        new Mood("gleeful", 0.76, 0.575, [253, 233, 70]),
        new Mood("humorous", 0.78, 0.74, [218, 250, 72]),
        new Mood("whimsical", 0.8, 0.85, [170, 250, 70]),
        new Mood("cheerful", 0.71, 0.66, [222, 251, 72]),
        new Mood("light", 0.64, 0.62, [226, 250, 72]),
        new Mood("epic", 0.66, 0.8, [106, 249, 68]),
        new Mood("elegant", 0.67, 0.875, [78, 249, 67]),
        new Mood("playful", 0.62, 0.85, [41, 249, 67]),
        new Mood("happy", 0.98, 0.63, [40, 240, 66]),
        new Mood("peaceful", 0.6, 0.74, [56, 248, 67]),
        new Mood("hypnotic", 0.55, 0.625, [68, 249, 67]),
        new Mood("shooting", 0.56, 0.855, [41, 248, 66]),
        new Mood("joyous", 0.555, 0.94, [41, 248, 66]),
        new Mood("insdustrial", 0.51, 0.77, [41, 248, 66]),
        new Mood("sophisticated", 0.46, 0.91, [41, 248, 73]),
        new Mood("spacey", 0.425, 0.61, [42, 249, 159]),
        new Mood("ambient", 0.425, 0.725, [41, 249, 103]),
        new Mood("futuristic", 0.41, 0.87, [41, 248, 85]),
        new Mood("cool", 0.352, 0.551, [42, 241, 252]),
        new Mood("carefree", 0.275, 0.56, [40, 232, 251]),
        new Mood("meditation", 0.26, 0.68, [43, 250, 226]),
        new Mood("gentle", 0.3, 0.775, [42, 250, 180]),
        new Mood("trippy", 0.26, 0.85, [42, 249, 170]),
        new Mood("dreamy", 0.2, 0.55, [35, 202, 250]),
        new Mood("reflective", 0.2, 0.725, [44, 251, 234]),
        new Mood("smooth", 0.2, 0.84, [43, 250, 198]),
        new Mood("cold", 0.1, 0.52, [28, 165, 249]),
        new Mood("laid-back", 0.05, 0.67, [42, 242, 252]),
        new Mood("quiet", 0.1, 0.8, [44, 251, 232]),
        new Mood("calming", 0.15, 0.825, [43, 250, 215]),
        new Mood("romantic", 0.47, 0.35, [230, 66, 249]),
        new Mood("sexy", 0.46, 0.45, [147, 56, 247]),
        new Mood("intimate", 0.42, 0.25, [206, 62, 249]),
        new Mood("sentimental", 0.42, 0.39, [116, 54, 247]),
        new Mood("sweet", 0.4, 0.25, [183, 60, 248]),
        new Mood("theather", 0.375, 0.15, [190, 60, 248]),
        new Mood("complex", 0.35, 0.02, [201, 62, 247]),
        new Mood("mellow", 0.36, 0.31, [119, 54, 247]),
        new Mood("sad", 0.31, 0.05, [176, 58, 245]),
        new Mood("mistical", 0.31, 0.16, [142, 56, 247]),
        new Mood("pastoral", 0.335, 0.42, [31, 52, 247]),
        new Mood("gloomy", 0.26, 0.03, [160, 58, 247]),
        new Mood("melancholia", 0.25, 0.15, [126, 55, 247]),
        new Mood("haunting", 0.22, 0.15, [98, 53, 247]),
        new Mood("ominous", 0.2, 0.32, [30, 51, 247]),
        new Mood("eerie", 0.145, 0.14, [71, 51, 247]),
        new Mood("dramatic", 0.16, 0.42, [24, 90, 247]),
        new Mood("dark", 0.04, 0.04, [71, 51, 247]),
        new Mood("angst-ridden", 0.06, 0.24, [30, 51, 247]),
        new Mood("strange", 0.025, 0.345, [29, 72, 247])
    ];
    this.Deg2Rad = function(deg) {
        if (isNaN(deg)) {
            return false;
        }else{
            return deg;
        }
    }
    this.PythagorasEquirectangular = function(e1, v1, e2, v2) {
        if (isNaN(e1) || isNaN(v1) || isNaN(e2) || isNaN(v2)) {
            return false;
        }else{
            e1 = _this.Deg2Rad(e1);
            e2 = _this.Deg2Rad(e2);
            v1 = _this.Deg2Rad(v1);
            v2 = _this.Deg2Rad(v2);
            var x = (v2 - v1) * Math.cos((e1 + e2) / 2);
            var y = (e2 - e1);
            var d = Math.sqrt(x * x + y * y);
            return d;
        }
    }
    this.NearestFeeling = function(feeling) {
        if (typeof feeling === 'object') {
            var mindif = 99999;
            var closest;
            for (index = 0; index < _this.moods.length; ++index) {
                var dif = _this.PythagorasEquirectangular(feeling.energy, feeling.valence, _this.moods[index].energy, _this.moods[index].valence);
                if (dif < mindif) {
                    closest = index;
                    mindif = dif;
                }
            }
            var feeling = _this.moods[closest];
            feeling.colorIndex = closest;
            return feeling;
        }else{
            return false;
        }

    }
}
module.exports = Moods;
