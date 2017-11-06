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