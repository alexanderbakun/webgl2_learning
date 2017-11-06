/* MAIN RUN METHOD */

function main(timestamp)
{
  if(engine.isRunning) 
  {
    engine.draw();
    timer = requestAnimationFrame(main);
  }
  else
  {
    cancelAnimationFrame(timer);
  }
}

timer = requestAnimationFrame(main);

function resize() 
{
  viewer.style.width = window.innerWidth+'px';
  viewer.style.height = window.innerHeight+'px';
  viewer.width = window.innerWidth;
  viewer.height = window.innerHeight;
}

window.addEventListener('resize',resize);

engine.input.add('test','default',function(){console.log('pressed enter');},'enter',true)
engine.input.add('reload','default',function(){console.log('pressed r');},'r')
engine.input.add('copy','default',function(){console.log('pressed c + ctrl');},'c',false,true);
engine.input.add('paste','default',function(){console.log('pressed v + ctrl');},'v',true,true);