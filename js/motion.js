((world) => {
  'use strict';

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => media.matches || document.body.classList.contains('motion-off');
  const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

  function setupMotion() {
    const canvas = document.getElementById('atmosphere');
    const ctx = canvas.getContext('2d');
    const gsap = window.gsap;
    const scroll = window.ScrollTrigger;
    if (gsap && scroll) gsap.registerPlugin(scroll);
    if (!ctx) return { refresh() {}, burst() {} };

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let active = true;
    let particles = [];
    let burst = [];
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      refresh();
    }) : null;
    observer?.observe(canvas);

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.setTransform(scale,0,0,scale,0,0);
      const count = width < 700 ? 39 : 76;
      particles = Array.from({length:count}, (_,i) => ({
        x:Math.random()*width, y:Math.random()*height, depth:Math.random(), phase:i*.73,
        petal:i % 10 === 0, velocity:4+Math.random()*14
      }));
      draw(0);
    }
    function draw(time) {
      const delta = last && time ? Math.min(.05,(time-last)/1000) : 0;
      last = time;
      ctx.clearRect(0,0,width,height);
      const bright = document.body.dataset.scene === 'sunrise';
      for (const item of particles) {
        item.y += item.velocity * delta * (item.petal ? 1.6 : -.48);
        item.x += Math.sin(time / 1450 + item.phase) * delta * (item.petal ? 12 : 3);
        if (item.y < -7) item.y = height + 7;
        if (item.y > height + 7) item.y = -7;
        const alpha = .12 + item.depth*.39 + Math.sin(time/1750 + item.phase)*.09;
        ctx.fillStyle = bright ? 'rgba(255,208,185,' + alpha + ')' : 'rgba(250,164,200,' + alpha + ')';
        ctx.beginPath();
        if (item.petal) ctx.ellipse(item.x,item.y,2.2+item.depth*2,1.3,time/1550+item.phase,0,Math.PI*2);
        else ctx.arc(item.x,item.y,.6+item.depth*1.45,0,Math.PI*2);
        ctx.fill();
      }
      for (const spark of burst) {
        spark.age += delta;
        spark.x += spark.dx*delta;
        spark.y += spark.dy*delta;
        ctx.fillStyle = 'rgba(255,205,223,' + Math.max(0,1-spark.age*1.8) + ')';
        ctx.beginPath();
        ctx.arc(spark.x,spark.y,spark.size,0,Math.PI*2);
        ctx.fill();
      }
      burst = burst.filter(spark => spark.age < .57);
    }
    function tick(time) {
      draw(time);
      frame = requestAnimationFrame(tick);
    }
    function refresh() {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduced() && !document.hidden && active) frame = requestAnimationFrame(tick);
      else draw(0);
    }
    window.addEventListener('resize', resize, {passive:true});
    media.addEventListener('change', refresh);
    document.addEventListener('visibilitychange', refresh);
    resize();
    refresh();

    return {
      refresh,
      burst() {
        if (reduced()) return;
        for (let i=0;i<78;i++) {
          const angle = Math.random()*Math.PI*2;
          const speed = 40+Math.random()*300;
          burst.push({x:width/2,y:height/2,dx:Math.cos(angle)*speed,dy:Math.sin(angle)*speed,size:1+Math.random()*2,age:0});
        }
      }
    };
  }

  async function openInvitation(node) {
    if (reduced()) return;
    node.classList.add('opening');
    const art = node.querySelector('.intro-art');
    if (window.gsap) {
      await window.gsap.to(art,{scale:1.065,duration:.48,ease:'power2.inOut'});
      window.gsap.set(art,{clearProps:'transform'});
    } else {
      await delay(370);
    }
    node.classList.remove('opening');
  }
  function enterScene(node, scrollReveal = true) {
    if (reduced()) return;
    const gsap = window.gsap;
    if (gsap) {
      gsap.fromTo(node,{opacity:.59,y:10},{opacity:1,y:0,duration:.55,ease:'power2.out',clearProps:'transform,opacity'});
      if (scrollReveal && window.ScrollTrigger) {
        node.querySelectorAll('[data-reveal]').forEach(item => {
          gsap.fromTo(item,{opacity:.58,y:6},{
            opacity:1,y:0,duration:.4,clearProps:'transform,opacity',
            scrollTrigger:{trigger:item,start:'top 95%',once:true}
          });
        });
      }
    } else {
      node.animate?.([{opacity:.65,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:380,easing:'ease-out'});
    }
  }
  function clearSceneMotion() {
    if (!window.ScrollTrigger) return;
    window.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
  function flyHeart(origin) {
    if (!origin || reduced()) return;
    const target = document.querySelector('.header-journal');
    const heart = document.getElementById('collection-flight');
    const from = origin.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const at = (x,y,s) => 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
    heart.getAnimations().forEach(animation => animation.cancel());
    heart.animate([
      {transform:at(from.x+from.width/2,from.y, .6),opacity:0},
      {transform:at(from.x+from.width/2,from.y-34,1.22),opacity:1,offset:.24},
      {transform:at(to.x,to.y,.6),opacity:0}
    ],{duration:870,easing:'cubic-bezier(.24,.64,.35,1)'});
  }

  world.motion = { reduced, setupMotion, openInvitation, enterScene, clearSceneMotion, flyHeart };
})(window.JulieWorld);
