$.widget("christmas.SantaMan", {
  options: {
    mainType: "Santa",
    type: "Run",
    timing: 70,
    animate: false,
    secondaryType: null,
    superNinjaFrenzy: false,
    height: 23, // In percentage
    secondaryTypeChance: 1
  },
  
  _santaImages: [],
  _santaTypes: [
    { type: "Idle",   frames: 16 },
    { type: "Jump",   frames: 16 },
    { type: "Run",    frames: 11 },
    { type: "Slide",  frames: 11 },
    { type: "Walk",   frames: 13 },
    { type: "Dead",   frames: 17 }
   ],
  
  _ninjaImages: [],
  _ninjaTypes: [
    { type: "Attack",       frames: 9 },
    { type: "Climb",        frames: 9 },
    { type: "Dead",         frames: 9 },
    { type: "Glide",        frames: 9 },
    { type: "Jump_Attack",  frames: 9 },
    { type: "Jump_Throw",   frames: 9 },
    { type: "Run",          frames: 9 },
    { type: "Slide",        frames: 9 },
    { type: "Throw",        frames: 9 }
   ],
  
  _firstType: null,
  
  _create: function() {
    var self = this;
    
    self._loadImages();
    
    var mainType = self.options.mainType;
    self._firstType = self.options.type;
    var imgSrc;
    if (mainType == "Santa") {
      imgSrc = self._santaImages[0];
      self.options.secondaryType = self.options.secondaryType || "Jump";
    }
    else {
      imgSrc = self._ninjaImages[0];
      self.options.secondaryType = self.options.secondaryType || "Glide";
    }
    
    self.element.html("<img src='" + imgSrc +"'>").show();
    
    setTimeout(function() {
      self._setImage();
    }, self.options.timing);
    
    if (self.options.animate) {
      self._animateDiv();
    }
  },
  
  randomType: function() {
    var self = this;
    
    var random = self._getRandomInt(0, 4);
    var randomType = self._santaTypes[random].type;
    self.changeType(randomType);
  },
  
  _getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  changeType: function(type) {
    var self = this;
    
    self._setOption("type", type);
    self._loadImages();
  },
  
  _setOption: function(key, value) {
      this.options[ key ] = value;
  },
  
  _findType: function(value, array){
    var self = this;
    
    return $.grep(array, function(item) {
      return item.type == value;
    });
  },
  
  _loadImages: function() {
    var self = this;
    
    var mainType = self.options.mainType;
    
    if (mainType == "Santa") {
      self._loadSantaImages();
    }
    else {
      self._loadNinjaImages();
    }
  },
  
  _loadSantaImages: function() {
    var self = this;
    
    var type = self.options.type;
    var santa = self._findType(type, self._santaTypes)[0];
    var type = santa.type;
    var frames = santa.frames;
    
    self._santaImages = [];
    for(i = 1; i <= frames; i++) {
      self._santaImages.push(self.options.mainType + "\\" + type + " (" + i + ").png");
    }
  },
  
  _loadNinjaImages: function() {
    var self = this;
    
    var type = self.options.type;
    var ninja = self._findType(type, self._ninjaTypes)[0];
    var type = ninja.type;
    var frames = ninja.frames;
    
    self._ninjaImages = [];
    for(i = 1; i <= frames; i++) {
      self._ninjaImages.push(self.options.mainType + "\\" + type + "__00" + i + ".png");
    }
  },
  
  _setImage: function() {
    var self = this;
    
    var mainType = self.options.mainType;
    
    if (mainType == "Santa") {
      self._setSantaImage();
    }
    else {
      self._setNinjaImage();
    }
  },
  
  _setSantaImage: function() {
    var self = this;
    
    self._santaImages.push(self._santaImages.shift());
    
    var nextImg = new Image();
    nextImg.src = this._santaImages[0];
    nextImg.onload = function() {
      self.element.find("img").attr("src", this.src);
    };
    
    setTimeout(function() {
      self._setImage();
    }, self.options.timing);
  },
  
  _setNinjaImage: function() {
    var self = this;
    
    self._ninjaImages.push(self._ninjaImages.shift());
    
    var nextImg = new Image();
    nextImg.src = this._ninjaImages[0];
    nextImg.onload = function() {
      self.element.find("img").attr("src", this.src);
    };
    
    setTimeout(function() {
      self._setImage();
    }, self.options.timing);
  },
  
  _makeNewPositionGround: function() {
    var self = this;
    
    var newHeight = Math.floor(self._getRandomInt(10, 80) * -1);
    var newWidth = Math.floor(self._getRandomInt(600, $(window).width() - 350));

    return [newHeight, newWidth];
  },
  
  _makeNewPositionAir: function() {
    var self = this;
    
    if (self.options.superNinjaFrenzy) {
      return [-300, 120];
    }
    
    var newHeight = Math.floor(self._getRandomInt(200, $(window).height() - 300) * -1);
    var newWidth = Math.floor(self._getRandomInt(600, $(window).width() - 350));

    return [newHeight, newWidth];
  },

  _animateDiv: function(disableSecondayType, callback) {
    var self = this;
    
    var activateSecondaryType = 0;
    
    if (self._getRandomInt(0, self.options.secondaryTypeChance) == self.options.secondaryTypeChance) {
      activateSecondaryType = 1;
    }
    
    if (disableSecondayType == true) {
      activateSecondaryType = 0;
    }
    
    var animationCoordsAndSpeed = self._getAnimationCoordsAndSpeed(activateSecondaryType);
        
    var speed = animationCoordsAndSpeed.speed;
    var superNinjaFrenzySpeed = speed / 3;
    
    if (activateSecondaryType == 1) {
      self._activateSecondaryType((self.options.superNinjaFrenzy ? superNinjaFrenzySpeed : speed));
    }
    
    $(self.element).animate({ top: animationCoordsAndSpeed.height, left: animationCoordsAndSpeed.width }, (self.options.superNinjaFrenzy ? superNinjaFrenzySpeed : speed), function() {
      if (callback != null && typeof(callback) == "function") {
        callback();
        return;
      }
      
      if (activateSecondaryType == 0) {
        setTimeout(function() {
          
          if (self._getRandomInt(0, 1) == 1) {
            self._ninjaSlide();
          }
          else {
            self._animateDiv();
          }
          
        }, self._getRandomInt(1000, 2000)); // After landing keep them running for 1 to 2 seconds before next movment change
      }
    });
  },
  
  _ninjaSlide: function() {
    var self = this;
        
    self._changeHeight(self._getSlideHeight());
    self.changeType("Slide");
    
    setTimeout(function() {
      self._changeHeight(self.options.height);
      self.changeType(self._firstType);
      
      setTimeout(function() {
        self._animateDiv();
      }, self._getRandomInt(500, 1500));
      
    }, self._getRandomInt(500, 1500));
  },
  
  _getAnimationCoordsAndSpeed: function(activateSecondaryType) {
    var self = this;
    
    var newq;
    if (activateSecondaryType == 1 && self.options.mainType != "Santa") {
      newq = self._makeNewPositionAir();
    }
    else {
      newq = self._makeNewPositionGround();
    }
    var oldq = $(self.element).offset();
    var speed = self._calcSpeed([oldq.top, oldq.left], newq);
    
    return { height: newq[0], width: newq[1], speed: speed };
  },
  
  _activateSecondaryType: function(speed) {
    var self = this;
    
    self.changeType(self.options.secondaryType); // Fly
    setTimeout(function() {
      
      if (self.options.superNinjaFrenzy) {
        var alternate = self._getRandomInt(0, 1);
        //alternate = 0;
        if (alternate == 0) {
          self.changeType("Jump_Attack");
        }
        else if (alternate == 1) {
          self.changeType("Jump_Throw");
        }
        else if (alternate == 2) {
          self.changeType("Throw");
        }
      }
      
      setTimeout(function() {
        
        self.changeType(self.options.secondaryType);
        self._animateDiv(true, function() {
          
          if (self._getRandomInt(0, 1) == 1) {
            self._changeHeight(self._getSlideHeight());
            self.changeType("Slide");
          }
          else {
            self.changeType(self._firstType);
          }
          
          setTimeout(function(){
            self._changeHeight(self.options.height);
            self.changeType(self._firstType);
            
            setTimeout(function(){
              self._animateDiv();
            }, self._getRandomInt(500, 1500));
            
          }, self._getRandomInt(500, 1500));
          
        });
        
      }, self._getRandomInt(500, 1500));
    
    }, speed);
  },
  
  _changeHeight: function(height) {
    var self = this;
    
    self.element.find("img").css({ 'height': height + '%' });
  },
  
  _getSlideHeight: function() {
    var self = this;
    
    var height = self.options.height;
    var slideHeight = Math.floor(height * 0.76);
    
    return slideHeight;
  },
  
  _calcSpeed: function(prev, next) {
    var self = this;
    
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    
    var speedModifier = 0.1;

    var speed = Math.ceil(greatest / speedModifier);

    //if (self.options.superNinjaFrenzy) {
    //  return speed / 7;
    //}
    
    if (speed < 800) {
      return 800 / 2;
    }
    
    return speed / 2;
  }    
});































