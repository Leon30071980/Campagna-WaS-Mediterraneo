// Campagna W@S Mediterraneo v1.7 — galleria indipendente da Nhost.
let stopGallery = null;
export function disposeAdmiraltyGallery(){
  if(stopGallery){stopGallery();stopGallery=null;}
}
export function initAdmiraltyGallery(root){
  disposeAdmiraltyGallery();
  const shell=root.querySelector('.admiralty-carousel');
  if(!shell)return;
  const track=shell.querySelector('.admiralty-filmtrack');
  const strip=shell.querySelector('.admiralty-filmstrip');
  const toggle=shell.querySelector('.admiralty-rotate-toggle');
  if(!track||!strip||!toggle)return;
  let paused=false,hover=false,active=true,animation=null;
  const abort=new AbortController();
  const signal=abort.signal;
  const on=(node,event,handler)=>node.addEventListener(event,handler,{signal});
  const slots=()=>Math.max(1,parseInt(getComputedStyle(strip).getPropertyValue('--gallery-slots'),10)||7);
  function updateFocus(){
    const n=slots();
    [...track.children].forEach((a,i)=>{
      const show=i<n;
      a.tabIndex=show?0:-1;
      if(show)a.removeAttribute('aria-hidden');else a.setAttribute('aria-hidden','true');
    });
    toggle.disabled=track.children.length<=n;
  }
  function photoError(img){
    if(!active)return;
    if(img.dataset.fallback&&!img.dataset.retried){
      img.dataset.retried='1';img.src=img.dataset.fallback;return;
    }
    img.closest('.admiralty-photo')?.remove();
    updateFocus();
  }
  for(const img of track.querySelectorAll('img')){
    on(img,'error',()=>photoError(img));
    if(img.complete&&!img.naturalWidth)photoError(img);
  }
  on(shell,'mouseenter',()=>hover=true);
  on(shell,'mouseleave',()=>hover=false);
  on(toggle,'click',()=>{
    paused=!paused;
    toggle.textContent=paused?'▶':'Ⅱ';
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.setAttribute('aria-label',paused?'Riprendi la galleria':'Metti in pausa la galleria');
  });
  on(window,'resize',updateFocus);
  function advance(){
    if(!active||paused||hover||document.hidden||shell.matches(':focus-within')||animation||track.children.length<=slots())return;
    const first=track.firstElementChild;
    const second=first?.nextElementSibling;
    if(!first||!second)return;
    const step=second.getBoundingClientRect().left-first.getBoundingClientRect().left;
    if(step<=0)return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||typeof track.animate!=='function'){
      track.append(first);updateFocus();return;
    }
    const a=track.animate([{transform:'translateX(0)'},{transform:'translateX(-'+step+'px)'}],{duration:550,easing:'ease-in-out'});
    animation=a;
    a.finished.then(()=>{
      if(active&&first.parentNode===track)track.append(first);
      if(active)updateFocus();
    },()=>{}).finally(()=>{if(animation===a)animation=null;});
  }
  updateFocus();
  const timer=setInterval(advance,5000);
  stopGallery=()=>{active=false;clearInterval(timer);animation?.cancel();abort.abort();};
}
