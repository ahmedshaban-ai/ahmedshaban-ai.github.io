const intro = document.getElementById("intro");
window.addEventListener("load", () => {
  setTimeout(() => intro.classList.add("hide"), 1250);
});

const words = [
  "multimodal AI systems",
  "computer vision pipelines",
  "vision-language models",
  "retrieval-augmented generation",
  "efficient LLM deployment",
  "intelligent robotic systems"
];
const typed = document.getElementById("typedText");
let wi = 0, ci = 0, deleting = false;

function typingLoop(){
  const word = words[wi];
  typed.textContent = word.slice(0, ci);
  if(!deleting){
    ci++;
    if(ci > word.length){
      deleting = true;
      return setTimeout(typingLoop, 1200);
    }
  }else{
    ci--;
    if(ci < 0){
      deleting = false;
      wi = (wi + 1) % words.length;
      ci = 0;
    }
  }
  setTimeout(typingLoop, deleting ? 34 : 68);
}
typingLoop();

const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

const counted = new Set();
const countObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting || counted.has(entry.target)) return;
    counted.add(entry.target);
    const end = Number(entry.target.dataset.count);
    const start = performance.now();
    function tick(now){
      const p = Math.min((now-start)/1400,1);
      const eased = 1-Math.pow(1-p,3);
      entry.target.textContent = Math.floor(end*eased).toLocaleString();
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
},{threshold:.5});
document.querySelectorAll("[data-count]").forEach(el=>countObserver.observe(el));

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click",()=>navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

const toTop = document.getElementById("toTop");
window.addEventListener("scroll",()=>toTop.classList.toggle("show",window.scrollY>650));
toTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
document.getElementById("year").textContent = new Date().getFullYear();

const glow = document.getElementById("mouseGlow");
window.addEventListener("pointermove", e=>{
  glow.style.left = e.clientX+"px";
  glow.style.top = e.clientY+"px";
});

document.querySelectorAll("[data-tilt]").forEach(card=>{
  card.addEventListener("mousemove",e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(1100px) rotateX(${y*-7}deg) rotateY(${x*9}deg) translateY(-3px)`;
  });
  card.addEventListener("mouseleave",()=>card.style.transform="");
});

document.querySelectorAll(".magnetic").forEach(el=>{
  el.addEventListener("mousemove",e=>{
    const r=el.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;
    const y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.08}px,${y*.08}px)`;
  });
  el.addEventListener("mouseleave",()=>el.style.transform="");
});

const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
let stars=[], raf;

function resize(){
  canvas.width=innerWidth*devicePixelRatio;
  canvas.height=innerHeight*devicePixelRatio;
  canvas.style.width=innerWidth+"px";
  canvas.style.height=innerHeight+"px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  stars=Array.from({length:Math.min(110,Math.floor(innerWidth/12))},()=>({
    x:Math.random()*innerWidth,
    y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*.18,
    vy:(Math.random()-.5)*.18,
    r:Math.random()*1.5+.35
  }));
}
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(let i=0;i<stars.length;i++){
    const p=stars[i];
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>innerWidth)p.vx*=-1;
    if(p.y<0||p.y>innerHeight)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle="rgba(118,154,255,.65)";ctx.fill();
    for(let j=i+1;j<stars.length;j++){
      const q=stars[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);
      if(d<110){
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
        ctx.strokeStyle=`rgba(92,128,230,${.095*(1-d/110)})`;ctx.stroke();
      }
    }
  }
  raf=requestAnimationFrame(draw);
}
resize();draw();
addEventListener("resize",()=>{cancelAnimationFrame(raf);resize();draw();});
