/* Evergreen runs only during the final weeks of Term 2, using the school's local date. */
(() => {
  if(new URLSearchParams(location.search).get('term2Preview')==='1') return;

  const root=document.documentElement;
  const ukDate=()=>{
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{
      timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'
    }).formatToParts(new Date()).filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  };
  const isEvergreenDate=date=>date>='2026-12-01'&&date<='2026-12-18';
  const lampMarkup='<span class="lamp"><i class="socket"></i><i class="bulb"></i></span>';

  function updateSeason(){
    const active=isEvergreenDate(ukDate());
    if(!active){
      if(root.hasAttribute('data-seasonal-live')){
        root.removeAttribute('data-seasonal-live');
        root.removeAttribute('data-term2-preview');
        document.querySelector('.season-lights')?.remove();
        document.querySelector('.season-snow')?.remove();
      }
      return;
    }
    if(root.hasAttribute('data-seasonal-live')) return;
    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href='term2-preview.css';
    document.head.appendChild(style);
    root.setAttribute('data-term2-preview','evergreen');
    root.setAttribute('data-seasonal-live','');

    const lights=document.createElement('div');
    lights.className='season-lights';
    lights.setAttribute('aria-hidden','true');
    lights.innerHTML=lampMarkup.repeat(15);
    document.querySelector('header')?.appendChild(lights);

    const snow=document.createElement('div');
    snow.className='season-snow';
    snow.setAttribute('aria-hidden','true');
    snow.innerHTML=Array.from({length:24},(_,index)=>{
      const x=(index*47+13)%100;
      const size=2+(index%3);
      const duration=17+(index*7)%13;
      const delay=-((index*11)%27);
      const drift=(index%2?1:-1)*(14+(index*9)%44);
      return `<span style="--x:${x}%;--size:${size}px;--duration:${duration}s;--delay:${delay}s;--drift:${drift}px"></span>`;
    }).join('');
    document.body.appendChild(snow);
  }

  updateSeason();
  setInterval(updateSeason,60000);
})();
