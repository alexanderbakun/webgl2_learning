/* GLOBALS */

var gui = window.require('nw.gui'),
    win = gui.Window.get(),
    viewer = document.querySelector('.viewer'),
    timer;
      
global.WindowElements = {
  window: window,
  document: document,
  viewer: viewer
}

global.gui = gui;
global.win = win;