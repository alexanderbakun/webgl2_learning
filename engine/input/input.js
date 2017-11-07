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
     
     mouse events:
     - pressed
     - single
     - shift, ctrl, and alt secondaries
     - double
   */
  static standardEvent(e)
  {
    const environment = this.environments[this.environment];
    let title = environment.inputs[e.keyCode];
    if(title !== undefined) 
    {
      function chainAction()
      {
        /* check if states match to add action to queue */
        const action = environment.actions[title];
        let chainable = true;
        /* if this is a shift,control, or alt key ignore those booleans */
          if([16,17,18].indexOf(e.keyCode) === -1)
          {
            if(chainable && (action.shift || e.shiftKey)) chainable = (e.shiftKey && action.shift);
            if(chainable && (action.ctrl || e.ctrlKey)) chainable = (e.ctrlKey && action.ctrl);
            if(chainable && (action.alt || e.altKey)) chainable = (e.altKey && action.alt);
          }

          if(chainable)
          {
            if(action.dblclick && e.keyCode < 4)
            {
              if(e.dblclick)
              {
                environment.event_chain_once[e.keyCode] = action.action;
              }
            }
            else
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
                environment.event_chain[e.keyCode] = undefined;
                delete environment.event_chain[e.keyCode];
              }
            }
          }
      }
      
      if(typeof title === 'object')
      {
        const items = title;
        items.forEach(function(v){
          title = v;
          chainAction();
        })
      }
      else
      {
        chainAction();
      }
    }
  }
  
  /* mouse events:
     - drag
     - drop
     - scroll
   */
  
  static mouseEventUpdate(e)
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
  
  static add(title,environment,action,key,pressed,ctrl,alt,shift,dblclick)
  {
    let keys = this.keyboard.keys;
    keys[0] = this.mouse.keys[0];
    keys[1] = this.mouse.keys[1];
    keys[2] = this.mouse.keys[2];
    
    const keyCode = (typeof key === 'number' ? (keys[key] !== undefined ? key : -1) : (keys.indexOf(key) !== -1 ? keys.indexOf(key) : -1));
    
    if(keyCode !== -1)
    {
      if(this.environments[environment] === undefined) this.clear(environment);
      switch(typeof this.environments[environment].inputs[keyCode])
      {
        case 'undefined':
          this.environments[environment].inputs[keyCode] = title;
        break;
        case 'string':
          this.environments[environment].inputs[keyCode] = [this.environments[environment].inputs[keyCode],title];
        break;
        case 'object':
          this.environments[environment].inputs[keyCode].push(title);
        break;
      }
      
      if(this.environments[environment].actions[title] !== undefined)
      {
        const action = this.environments[environment].actions[title];

        this.environments[environment][action.type][action.key] = undefined;
        delete this.environments[environment][action.type][action.key];
      }
      
      this.environments[environment].actions[title] = {
        action:action,
        key:keyCode,
        pressed:!!pressed,
        ctrl:!!ctrl,
        alt:!!alt,
        shift:!!shift,
        dblclick:!!dblclick
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
  
  static listenBind() 
  {
    this.inBindMode = true;
    this.pause();
  }
  
  static bind()
  {
    this.inBindMode = false;
    this.resume();
  }
  
  static pause()
  {
    this.keyboard.toggleListening(false);
    this.mouse.toggleListening(false);
  }
  
  static resume()
  {
    this.keyboard.toggleListening(true);
    this.mouse.toggleListening(true);
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
      inputs: []
  }
};
engine.input.environment = 'default';

//window.addEventListener('mousedown',engine.input.mouseEvent);
//window.addEventListener('mouseup',engine.input.mouseEvent);