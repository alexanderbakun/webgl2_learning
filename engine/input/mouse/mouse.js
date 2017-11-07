engine.input.mouse = class mouse {
  
  static toggleListening(toggle) 
  {
    if(toggle !== undefined) 
    {
      this.listening = toggle;
    }
    else 
    {
      this.listening = !this.listening;
    }
    return this;
  }
  
  static default()
  {
    return ['left','middle','right'];
  }
  
  static setKey(title,key)
  {
    this.keys[key] = title;
    return this;
  }
  
  static clear()
  {
    this.keys = [];
    return this;
  }
  
  static mouseEventDown(e) 
  {
    if(this.listening && !this.pressed[e.button]) 
    {
      this.pressed[e.button] = true;
      e.dblclick = false;
      e.pressed = true;
      e.keyCode = e.button;
      this.onmouseevent(e);
    }
  }
  
  static mouseEventUp(e) 
  {
    if(this.listening) 
    {
      this.pressed[e.button] = undefined;
      delete this.pressed[e.button];
      e.dblclick = false;
      e.pressed = false;
      e.keyCode = e.button;
      this.onmouseevent(e);
    }
  }
  
  static mouseEventMove(e)
  {
    if(this.pressed.length)
    {
      e.dblclick = false;
      e.keyCode = e.button;
      this.onmouseupdate(e);
    }
  }
  
  static mouseEventDblClick(e) 
  {
    if(this.listening)
    {
      e.pressed = false;
      e.dblclick = true;
      e.keyCode = e.button;
      this.onmouseevent(e);
    }
  }
  
  static mouseEventScroll(e)
  {
    if(this.listening)
    {
      e.dblclick = false;
      e.pressed = false;
      this.onmouseescroll(e);
    }
  }
}

engine.input.mouse.listening = true;
engine.input.mouse.keys = engine.input.mouse.default();
engine.input.mouse.pressed = [];
engine.input.mouse.onmouseevent = engine.input.standardEvent.bind(engine.input);
engine.input.mouse.onmouseeventscroll = engine.input.mouseEventScroll.bind(engine.input);
engine.input.mouse.onmouseupdate = engine.input.mouseEventUpdate.bind(engine.input);

window.addEventListener('mousedown',engine.input.mouse.mouseEventDown.bind(engine.input.mouse));
window.addEventListener('mouseup',engine.input.mouse.mouseEventUp.bind(engine.input.mouse));
window.addEventListener('mousemove',engine.input.mouse.mouseEventMove.bind(engine.input.mouse));
window.addEventListener('dblclick',engine.input.mouse.mouseEventDblClick.bind(engine.input.mouse));
window.addEventListener('scroll',engine.input.mouse.mouseEventScroll.bind(engine.input.mouse));