/* this will get called every frame */
function render()
{
  gl.fClear();
}


/* sets the color that gl.clear should set */
gl.clearColor(0.0,0.0,0.0,1.0); /* RGB Red: 0.0 GREEN: 0.0 BLUE: 0.0 OPACITY 1.0 */

/* clears the canvas to be written over again */
gl.fClear = function()
{
  this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
  return this;
}

module.exports = render;