class renderer {
  
  static resolution(n) {
    if(this.resolutions[n] !== undefined) {
      this.width = this.resolutions[n].w;
      this.height = this.resolutions[n].h;
      gl.fSetSize(this.width,this.height);
    }
    return this;
  }
  
  static render() {
    this.viewport.drawImage(this.renderport,0,0,this.view.width,this.view.height);
  }
}

renderer.view = WindowElements.viewer;
renderer.viewport = renderer.view.getContext('2d');
renderer.renderport = document.createElement('canvas');
renderer.width = 1920;
renderer.height = 1080;
renderer.pixelRatio = WindowElements.window.devicePixelRatio;
renderer.resolutions = [{w:3840,h:2160},{w:2560,h:1440},{w:1920,h:1080},{w:1600,h:900},{w:1280,h:720},{w:800,h:600}];


global.gl = renderer.renderport.getContext('webgl2');

/* sets the size of the canvas */
gl.fSetSize = function(w,h)
{
  this.canvas.width = w * renderer.pixelRatio;
  this.canvas.height = h * renderer.pixelRatio;
  
  this.viewport(0,0,w,h);
  return this;
}

module.exports = renderer;