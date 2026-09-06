// Nav scroll shadow
const nav=document.getElementById('nav');
if(nav){
  window.addEventListener('scroll',()=>nav.classList.toggle('shadow',scrollY>40));
}

// Mobile navigation
const navToggle=document.querySelector('.nav-toggle');
const navLinks=document.getElementById('nav-links');
const productToggle=document.querySelector('.nav-menu-trigger');
const productMenu=document.getElementById('products-menu');

const closeProducts=()=>{
  if(!productToggle||!productMenu)return;
  productMenu.classList.remove('open');
  productToggle.setAttribute('aria-expanded','false');
};

if(productToggle&&productMenu){
  productToggle.addEventListener('click',event=>{
    event.stopPropagation();
    const isOpen=productToggle.getAttribute('aria-expanded')==='true';
    productMenu.classList.toggle('open',!isOpen);
    productToggle.setAttribute('aria-expanded',String(!isOpen));
  });

  document.addEventListener('click',event=>{
    if(!event.target.closest('.nav-menu'))closeProducts();
  });
}

if(navToggle&&navLinks){
  const closeNav=()=>{
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded','false');
    navToggle.setAttribute('aria-label','Open navigation');
    closeProducts();
  };

  navToggle.addEventListener('click',()=>{
    const isOpen=navToggle.getAttribute('aria-expanded')==='true';
    navLinks.classList.toggle('open',!isOpen);
    navToggle.setAttribute('aria-expanded',String(!isOpen));
    navToggle.setAttribute('aria-label',isOpen?'Open navigation':'Close navigation');
  });

  navLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeNav));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      const navWasOpen=navToggle.getAttribute('aria-expanded')==='true';
      const productsWereOpen=productToggle&&productToggle.getAttribute('aria-expanded')==='true';
      closeNav();
      if(navWasOpen)navToggle.focus();
      else if(productsWereOpen)productToggle.focus();
    }
  });
  window.addEventListener('resize',()=>{
    if(window.innerWidth>900)closeNav();
  });
}

// Scroll reveal
const els=document.querySelectorAll('.sr,.sr-l,.sr-r');
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
els.forEach(e=>obs.observe(e));

// Counter animation
const counters=document.querySelectorAll('[data-count]');
const cobs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target,target=+el.dataset.count;
    let n=0;const suffix=el.textContent.slice(-1);
    const t=setInterval(()=>{
      n+=target/55;
      if(n>=target){n=target;clearInterval(t)}
      el.textContent=Math.floor(n)+(suffix==='%'?'%':suffix==='+'?'+':'');
    },20);
    cobs.unobserve(el);
  });
},{threshold:.6});
counters.forEach(e=>cobs.observe(e));
