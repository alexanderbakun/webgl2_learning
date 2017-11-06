"use strict";

class engine {
  
  static start() {
    this.isRunning = true;
  }
  
  static stop() {
    this.isRunning = false;
  }
  
  static draw() {
    /* do some fancy stuff here */
    this.playground();
    this.renderer.render();
  }
}

engine.isRunning = true;

/* require libs you want in the background context */

global.engine = engine;
global.engine.renderer = require('./engine/renderer/renderer').resolution(2);
global.engine.playground = require('./playground/playground')