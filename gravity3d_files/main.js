window.onload = function() {
  ii.init(Title);
  ii.system.width = screen.width;
  ii.system.height = screen.height;
  ii.system.init();
};



Title = ii.Class.extend({
  title: 'gravity',
  font: new ii.Font('10pt arial', '#fff', 'center'),
  universe: null,


  init: function() {
    this.universe = new Universe(512); // Crea instancia Universe del tipo universe, con argumento número entero de objetos, originalmente 256.
  },


  run: function() {
    this.update();
    this.draw();
  },


  update: function() {
    this.universe.update();
  },


  draw: function() {
    cx = ii.system.context;

    ii.system.clear('#000');

    cx.save();
    cx.translate(ii.system.canvas.width / 2, 128)
    this.font.draw(Math.round(1000 / ii.system.tick) + ' frames per second');
    cx.restore();

    this.universe.draw(cx);
  }
});
