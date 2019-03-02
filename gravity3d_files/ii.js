const KEY = {
  left: 37, // Originalmente: left: 37,
  right: 39, // Originalmente: right: 39,
  z: 90, // Originalmente: 90,
};

// ii - minimalistic video game library
// Inspired by Impact Game Library
// http://impactjs.org/
ii = {
  version: 0.1,
  init: function(game, id) { (ii.system = new ii.System(id)).use(game); }
};



// Native Function extension
Function.prototype.bind = function(bind) {
  var self = this;
  return function() { return self.apply(bind); };
};



// Class object based on John Resig's code, without superclass inheritance.
// http://ejohn.org/blog/simple-javascript-inheritance/
(ii.Class = function(){}).extend = function(property) {
  var prototype = new this();
  for (var name in property) { prototype[name] = property[name]; }
  function Class() { this.init.apply(this, arguments); }
  Class.prototype = prototype;
  return Class;
};



// System class.
// Contains system information, run() loop, use(game) switcher.
ii.System = ii.Class.extend({
  width: 800, // Originalmente: width: 800, 
  height: 480, // Originalmente: height: 480,
  fps: 60,
  mouse: { },
  key: { },


  init: function(id) {
    this.canvas = id ? document.getElementById(id) : document.getElementsByTagName('canvas')[0];
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');
    this.time = new Date().getTime();
    this.canvas.addEventListener('mousemove', function(event) {
      ii.system.mouse.x = event.layerX;
      ii.system.mouse.y = event.layerY;
    }, false);
    this.canvas.addEventListener('mousedown', function(event) {
      ii.system.mouse.down = true;
    }, false);
    this.canvas.addEventListener('mouseup', function(event) {
      ii.system.mouse.down = false;
    }, false);
  },


  run: function() {
    var time = new Date().getTime();
    this.tick = time - this.time;
    this.game.run();
    this.time = time;
    setTimeout(this.run.bind(this), 1000 / this.fps);
  },


  // setInterval gives a more precise fps, but kills mousemove performance.
  use: function(game) {
    this.game = new (game)();
    setTimeout(this.run.bind(this), 1000 / this.fps);
  },


  clear: function(color) {
    this.context.fillStyle = color || '#000';
    this.context.fillRect(0, 0, this.width, this.height);
  }
});



// Font class.
// Interface for loading and drawing text.
ii.Font = ii.Class.extend({
  init: function(font, color, align) {
    this.font = font || '12pt arial';
    this.color = color || '#fff';
    this.align = align || 'left';
  },


  draw: function(text, x, y) {
    ii.system.context.font = this.font;
    ii.system.context.fillStyle = this.color;
    ii.system.context.textAlign = this.align;
    ii.system.context.fillText(text, x || 0, y || 0);
  }
});
