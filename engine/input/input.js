/* 
    Held down key events must run on the 60fps animationFrame, 
    whereas full down up events fire as they happen
    
    keydown(down) -> keypress(down) -> keyup(up)
    mousedown(down) -> mouseup(up) -> click(up)
 */

"use strict";

engine.input = class input {
  
  static keyboardEvent(e) {
    const environmenrt = this.environments[this.environment];
    const title = environmenrt.keyboard[e.keyCode];
    if(title !== undefined) {
      /* check if states match to add action to queue */
      const action = environmenrt.actions[title];
      
    }
  }
  
  static mouseEvent(e) {
    
  }
  
  static mouseEventScroll(e) {
    
  }
  
  /* update fires all *hold* events per fps */
  static update() {
    
  }
  
  static add(title,environment,action,key,pressed,ctrl,alt,shift) {
    let keyPlaced = false;

    if(typeof key === 'number') {
      if(this.mouse.keys[key] !== undefined) {
        keyPlaced = true;
        this.environments[environment].mouse[key] = title;
      }
      else if(this.keyboard.keys[key] !== undefined) {
        keyPlaced = true;
        this.environments[environment].keyboard[key] = title;
      } 
    }
    else {
      if(this.mouse.keys.indexOf(key) !== -1) {
        keyPlaced = true;
        this.environments[environment].mouse[this.mouse.keys.indexOf(key)] = title;
      }
      else if(this.keyboard.keys.indexOf(key) !== -1) {
        keyPlaced = true;
        this.environments[environment].keyboard[this.mouse.keys.indexOf(key)] = title;
      } 
    }
    
    if(keyPlaced) {
      this.environments[environment].actions[title] = {
        action:action,
        pressed:!!pressed,
        ctrl:!!ctrl,
        alt:!!alt,
        shift:!!shift
      };
    }
    return this;
  }
  
  static listen() {
    this.inBindMode = true;
    this.keyboard.toggleListening(false);
  }
  
  static bind() {
    this.inBindMode = false;
    this.keyboard.toggleListening(true);
  }
  
  static clear(environment) {
    this.environments[environment] = {
      actions:[],
      keyboard:[],
      mouse:[]
    };
    return this;
  }
}

/* Environments can store different key bindings, 
   so that in one situation eg, walking you have one set of commands
   while in another situation eg, driving you have another using the same keys
*/
engine.input.inBindMode = false;
engine.input.environments = {default:{
      event_chain:{},
      actions:{},
      keyboard:[],
      mouse:[]
}};
engine.input.environment = 'default';

//window.addEventListener('mousedown',engine.input.mouseEvent);
//window.addEventListener('mouseup',engine.input.mouseEvent);