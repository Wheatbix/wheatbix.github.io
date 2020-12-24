$.widget("Sprite.Character", {
  options: {
    mainType: "Santa",
    type: "Walk",
    timing: 60,
    animate: false,
    secondaryType: null,
    height: 10, // In percentage
    secondaryTypeChance: 0,
    types: [
      { type: "Jump", frames: 16 },
      { type: "Slide", frames: 11 },
      { type: "Run", frames: 11 },
      { type: "Walk", frames: 13 },
    ],
  },

  _images: [],

  _firstType: null,

  _create: function () {
    var self = this;

    self._loadImages();

    self._firstType = self.options.type;
    var imgSrc = self._images[0];
    //self.options.secondaryType = self.options.secondaryType || "Jump";

    self.element.html("<img src='" + imgSrc + "'>").show();

    setTimeout(function () {
      self._setNextSpriteImage();
    }, self.options.timing);

    if (self.options.animate) {
      self._animateDiv();
    }

    self._changeHeight(self.options.height);
  },

  randomType: function () {
    var self = this;

    var random = self._getRandomInt(0, self.options.types.length - 2);
    var randomType = self.options.types[random].type;

    console.log(self.options.type, randomType);

    if (randomType == self.options.type) {
      self.randomType();
      return;
    }

    self.changeType(randomType);
  },

  _getRandomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  changeType: function (type) {
    var self = this;

    if (type == null || type == undefined) {
      debugger;
    }

    self._setOption("type", type);
    self._loadImages();
  },

  _setOption: function (key, value) {
    this.options[key] = value;
  },

  _findType: function (value, array) {
    var self = this;

    return $.grep(array, function (item) {
      return item.type == value;
    });
  },

  _loadImages: function () {
    var self = this;

    var typeObj = self._findType(self.options.type, self.options.types)[0];
    var frames = typeObj.frames;

    self._images = [];
    for (i = 1; i <= frames; i++) {
      self._images.push("images\\" + self.options.mainType + "\\" + typeObj.type + " (" + i + ").png"); // TODO: made images directory configurable
    }
  },

  _setNextSpriteImage: function () {
    var self = this;

    self._images.push(self._images.shift());

    var nextImg = new Image();
    nextImg.src = this._images[0];
    nextImg.onload = function () {
      self.element.find("img").attr("src", this.src);
    };

    setTimeout(function () {
      self._setNextSpriteImage();
    }, self.options.timing);
  },

  _makeNewPositionGround: function () {
    var self = this;

    var newHeight = Math.floor(self._getRandomInt(10, 80) * -1);
    var newWidth = Math.floor(self._getRandomInt(10, $(window).width() - 350));

    return [newHeight, newWidth];
  },

  _makeNewPositionAir: function () {
    var self = this;

    if (self.options.superNinjaFrenzy) {
      return [-300, 120];
    }

    var newHeight = Math.floor(self._getRandomInt(200, $(window).height() - 300) * -1);
    var newWidth = Math.floor(self._getRandomInt(600, $(window).width() - 350));

    return [newHeight, newWidth];
  },

  _animateDiv: function (disableSecondayType, callback) {
    var self = this;

    var activateSecondaryType = false;

    var rand = self._getRandomInt(0, self.options.secondaryTypeChance);
    if (rand == self.options.secondaryTypeChance) {
      activateSecondaryType = true;
    }

    if (disableSecondayType == true) {
      activateSecondaryType = true;
    }

    var animationCoordsAndSpeed = self._getAnimationCoordsAndSpeed();

    if (activateSecondaryType == true) {
      self._changeToDifferentType(animationCoordsAndSpeed.speed);
      $(self.element).animate({ top: animationCoordsAndSpeed.height, left: animationCoordsAndSpeed.width }, animationCoordsAndSpeed.speed);
    } else {
      $(self.element).animate({ top: animationCoordsAndSpeed.height, left: animationCoordsAndSpeed.width }, animationCoordsAndSpeed.speed, function () {
        if (callback != null && typeof callback == "function") {
          callback();
          return;
        }
        setTimeout(function () {
          self._animateDiv();
        }, animationCoordsAndSpeed.speed);
      });
    }
  },

  _getSlideHeight: function () {
    var self = this;

    var height = self.options.height;
    var slideHeight = Math.floor(height * 0.76);

    return slideHeight;
  },

  _changeToDifferentType: function (speed) {
    var self = this;

    //self.changeType(self.options.secondaryType);
    self.randomType();
    setTimeout(function () {
      self.changeType(self._firstType);
      setTimeout(function () {
        self._animateDiv();
      }, self._getRandomInt(500, 1500));
    }, speed);
  },

  _changeHeight: function (height) {
    var self = this;

    self.element.find("img").css({ height: height + "%" });
  },

  _getAnimationCoordsAndSpeed: function () {
    var self = this;

    var newPosition = self._makeNewPositionGround();
    var oldPosition = $(self.element).offset();
    var speed = self._calcSpeed([oldPosition.top, oldPosition.left], newPosition);

    return { height: newPosition[0], width: newPosition[1], speed: speed };
  },

  _calcSpeed: function (prev, next) {
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);

    var greatest = x > y ? x : y;

    var speedModifier = 0.07;

    var speed = Math.ceil(greatest / speedModifier);

    if (speed < 1500) {
      return 1500 / 2;
    }

    return speed / 2;
  },
});
