/* 
    Held down key events must run on the 60fps animationFrame, 
    whereas full down up events fire as they happen
    
    keydown(down) -> keypress(down) -> keyup(up)
    mousedown(down) -> mouseup(up) -> click(up)
 */

"use strict";

engine.input = class input {
  
  /* keyboard events:
     - pressed
     - single
     - shift, ctrl, and alt secondaries
   */
  static keyboardEvent(e) 
  {
    const environment = this.environments[this.environment];
    const title = environment.keyboard[e.keyCode];
    if(title !== undefined) 
    {
      /* check if states match to add action to queue */
      const action = environment.actions[title];
      let chainable = true;
      /* if this is a shift,control, or alt key ignore those booleans */
        if([16,17,18].indexOf(e.keyCode) === -1 && (action.shift || action.ctrl || action.alt))
        {
          
          if(chainable && action.shift) chainable = (e.shiftKey);
          if(chainable && action.ctrl) chainable = (e.ctrlKey);
          if(chainable && action.alt) chainable = (e.altKey);
        }
      
        if(chainable)
        {
          /* this is a hold action */
          if(action.pressed && e.pressed)
          {
            environment.event_chain[e.keyCode] = action.action;
          }
          /* single instance action */
          else if(!action.pressed && !e.pressed)
          {
            environment.event_chain_once[e.keyCode] = action.action;
          }
          /* remove the event from the event chain */
          else if(action.pressed && !e.pressed)
          {
            environment.event_chain.splice(1,e.keyCode);
          }
        }
    }
  }
  
  /* mouse events:
     - pressed
     - single
     - double
     - drag
     - drop
   */
  static mouseEvent(e) 
  {
    
  }
  
  static mouseEventScroll(e) 
  {
    
  }
  
  /* update fires all *hold* events per fps */
  static update() 
  {
    const environment = this.environments[this.environment];
    
    environment.event_chain.concat(environment.event_chain_once).forEach(function(action){
      action();
    });
    environment.event_chain_once = [];
  }
  
  static add(title,environment,action,key,pressed,ctrl,alt,shift)
  {
    let keyPlaced = false,
        type = '',
        keyCode = 0;

    if(typeof key === 'number') 
    {
      keyCode = key;
      if(this.mouse.keys[key] !== undefined) 
      {
        keyPlaced = true;
        type = 'mouse';
        if(this.environments[environment] === undefined) this.clear(environment);
        this.environments[environment].mouse[key] = title;
      }
      else if(this.keyboard.keys[key] !== undefined) 
      {
        keyPlaced = true;
        type = 'keyboard';
        if(this.environments[environment] === undefined) this.clear(environment);
        this.environments[environment].keyboard[key] = title;
      } 
    }
    else 
    {
      if(this.mouse.keys.indexOf(key) !== -1) 
      {
        keyCode = this.mouse.keys.indexOf(key);
        keyPlaced = true;
        type = 'mouse';
        if(this.environments[environment] === undefined) this.clear(environment);
        this.environments[environment].mouse[this.mouse.keys.indexOf(key)] = title;
      }
      else if(this.keyboard.keys.indexOf(key) !== -1) 
      {
        keyCode = this.keyboard.keys.indexOf(key);
        keyPlaced = true;
        type = 'keyboard';
        if(this.environments[environment] === undefined) this.clear(environment);
        this.environments[environment].keyboard[this.keyboard.keys.indexOf(key)] = title;
      } 
    }
    
    if(keyPlaced) 
    {
      if(this.environments[environment].actions[title] !== undefined)
      {
        const action = this.environments[environment].actions[title];

        this.environments[environment][action.type].splice(1,action.key);
      }
      
      this.environments[environment].actions[title] = {
        action:action,
        type:type,
        key:keyCode,
        pressed:!!pressed,
        ctrl:!!ctrl,
        alt:!!alt,
        shift:!!shift
      };
    }
    else
    {
      console.error('Sorry there is no key by the name,',key);
    }
    return this;
  }
  
  static remove(title)
  {
    const action = this.environments[environment].actions[title];
    if(action !== undefined)
    {
      this.environments[environment][action.type].splice(1,action.key);
      this.environments[environment].actions[title] = undefined;
      delete this.environments[environment].actions[title];
    }
    return this;
  }
  
  static listen() 
  {
    this.inBindMode = true;
    this.keyboard.toggleListening(false);
  }
  
  static bind() 
  {
    this.inBindMode = false;
    this.keyboard.toggleListening(true);
  }
  
  static clear(environment) 
  {
    this.environments[environment] = {
      event_chain_once:[],
      event_chain:[],
      actions:{},
      keyboard:[],
      mouse:[]
    };
    return this;
  }
  
  static setEnvironment(env)
  {
    if(this.environments[env] === undefined) this.clear(env);
    this.environment = env;
    return this;
  }
}

/* Environments can store different key bindings, 
   so that in one situation eg, walking you have one set of commands
   while in another situation eg, driving you have another using the same keys
*/
engine.input.inBindMode = false;
engine.input.environments = {
  default: {
      event_chain_once: [],
      event_chain: [],
      actions: {},
      keyboard: [],
      mouse: []
  }
};
engine.input.environment = 'default';

//window.addEventListener('mousedown',engine.input.mouseEvent);
//window.addEventListener('mouseup',engine.input.mouseEvent);