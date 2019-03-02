const EPS2 = 1.0; // Originalmente: 1.0
const one_256 = 0.001953125 // Originalmente es el cociente: 1/256 = 0.00390625

// Función rápida para inversa de raíz cuadrada ("Fast inverse square root")
var y = new Float32Array(1);
var i = new Int32Array(y.buffer);
function invSqrt(x) {
  var x_2 = x * 0.5;
  y[0] = x;
  i[0] = 0x5f3759df - (i[0] >> 1); // Originalmente: i[0] = 0x5f3759df - (i[0] >> 1);
  var x2 = y[0];
  return x2 * (1.5 - (x_2 * x2 * x2));
}

Universe = ii.Class.extend({
  b: [], // Body [vector posicion (3 componentes), masa]
  v: [], // Velocity

  init: function(matter) {
    while (matter--) {
      var angle = Math.random() * Math.PI * 2;
      var random = Math.random();
      this.b.push([
        invSqrt(1) * Math.cos(angle) * 256.0, // Componente 1ra // Originalmente: Math.sqrt(1) * Math.cos(angle) * 256.0,
        invSqrt(1) * Math.sin(angle) * 256.0, // Componente 2da // Originalmente: Math.sqrt(1) * Math.sin(angle) * 256.0,
        invSqrt(1) * Math.sin(Math.random() * Math.PI * 2) * 256.0, // Componente 3ra // Originalmente: Math.sqrt(1) * Math.sin(Math.random() * Math.PI * 2) * 256.0,
        1 // Masa de cada objeto (punto)
      ]);
      this.v.push([0, 0, 0]); //Componentes: [velocidad horizontal, velocidad vertical, velocidad frontal]
    }
  },
  
  update: function() {
    var b = this.b;
    var v = this.v;
    for (var i = 0; i < b.length; i++) {
      var bi = b[i];
      var vi = v[i];
      for (var j = i + 1; j < b.length; j++) {
        var bj = b[j];
        var vj = v[j];
        const r = [bj[0] - bi[0], bj[1] - bi[1], bj[2] - bi[2]];
        const d2 = r[0] * r[0] + r[1] * r[1] + r[2] * r[2] + EPS2;
        const invD3 = 1.0 / (1/invSqrt(d2 * d2 * d2));
        const si = bj[3] * invD3;
        const sj = bi[3] * invD3;
        vi[0] += r[0] * si;
        vi[1] += r[1] * si;
        vi[2] += r[2] * si;
        vj[0] -= r[0] * sj;
        vj[1] -= r[1] * sj;
        vj[2] -= r[2] * sj;
      }
      bi[0] += vi[0];
      bi[1] += vi[1];
      bi[2] += vi[2];
    }
  },

  draw: function(cx) {
    var b = this.b;

    cx.save();
    cx.translate(ii.system.canvas.width / 2, ii.system.canvas.height / 2)
    cx.scale(one_256, one_256);

    for (var i = 0; i < b.length; i++) {
      var bi = b[i];
      var r = bi[3]; // Actual formula is cbrt(3 * V / PI) / pow(2, 2 / 3), where V is volume.
      var scale = Math.max(bi[2] + 256.0, 6.0); // Original (bi[2] + 256.0, 64.0), 
	  // bi[2]+256.0 es el radio exterior.
	  // 64.0 es el radio inferior.

      cx.fillStyle = "rgb(255,255,255)";
      cx.save();
      cx.scale(scale, scale);

      if (r < 1.0) {
        cx.fillRect(bi[0], bi[1], r, r);
      } else {
        cx.beginPath();
        cx.arc(bi[0], bi[1], r * 0.5, 0, Math.PI * 2, true);
        cx.closePath();
        cx.fill();
      }
      cx.restore();
    }

    cx.restore();
  }
});
