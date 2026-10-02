/* Classroom layout enhancements; curriculum and syncing remain in index.html. */
(() => {
  const optionsButton=document.getElementById('options-button');
  const optionsMenu=document.getElementById('options-menu');
  function closeOptions(){
    optionsMenu.hidden=true;
    optionsButton.setAttribute('aria-expanded','false');
  }
  optionsButton.addEventListener('click',()=>{
    optionsMenu.hidden=!optionsMenu.hidden;
    optionsButton.setAttribute('aria-expanded',String(!optionsMenu.hidden));
  });
  document.addEventListener('click',event=>{
    if(!event.target.closest('.header-options')) closeOptions();
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!optionsMenu.hidden){ closeOptions(); optionsButton.focus(); }
  });
  document.getElementById('refresh-news').addEventListener('click',()=>{
    closeOptions();
    fetchNews();
  });
  document.getElementById('display-edit').addEventListener('click',closeOptions);

  // Mayfield's published timetable: form time ends at 08:50 and Year 12
  // Period 1 starts at 08:55 Monday–Thursday. Friday has no form time.
  const londonClock=new Intl.DateTimeFormat('en-GB',{
    timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit',
    hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'
  });
  const londonOffset=new Intl.DateTimeFormat('en-GB',{
    timeZone:'Europe/London',timeZoneName:'shortOffset'
  });
  function updatePeriodCountdown(){
    const now=new Date();
    const p=Object.fromEntries(londonClock.formatToParts(now).map(part=>[part.type,Number(part.value)]));
    const title=document.getElementById('period-title');
    const value=document.getElementById('period-countdown');
    const note=document.getElementById('period-note');
    for(let offset=0;offset<8;offset++){
      const date=new Date(Date.UTC(p.year,p.month-1,p.day+offset));
      const weekday=date.getUTCDay();
      if(weekday===0||weekday===5||weekday===6) continue;
      const hour=8;
      const minute=55;
      const rough=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),12));
      const zone=londonOffset.formatToParts(rough).find(part=>part.type==='timeZoneName')?.value||'GMT';
      const match=zone.match(/GMT([+-])(\d{1,2})?/);
      const zoneMinutes=match?(match[1]==='-'?-1:1)*Number(match[2]||0)*60:0;
      const target=Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),hour,minute)-zoneMinutes*60000;
      if(target<=now.getTime()) continue;
      const seconds=Math.ceil((target-now.getTime())/1000);
      const days=Math.floor(seconds/86400);
      const hours=Math.floor(seconds%86400/3600);
      const mins=Math.floor(seconds%3600/60);
      const secs=seconds%60;
      title.textContent=offset===0?'Period 1 begins in':'Next Period 1 in';
      value.textContent=days?days+'d '+String(hours).padStart(2,'0')+'h':
        hours?hours+'h '+String(mins).padStart(2,'0')+'m':
        String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0');
      const label=offset===0?'Today':new Intl.DateTimeFormat('en-GB',{weekday:'long',timeZone:'UTC'}).format(date);
      note.textContent=label+' · '+String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0')+' · school time';
      break;
    }
  }
  updatePeriodCountdown();
  setInterval(updatePeriodCountdown,1000);

  // Keep both supporting cards visible and in the configured order.
  const side=document.getElementById('sidebar');
  const rotator=document.getElementById('side-rotator');
  const originalRenderSidebar=renderSidebar;
  renderSidebar=function(){
    originalRenderSidebar();
    side.querySelectorAll('.s-panel').forEach(panel=>rotator.appendChild(panel));
    rotator.hidden=![...rotator.querySelectorAll('.s-panel')].some(panel=>!panel.classList.contains('hidden'));
  };
  const originalRenderDay=renderDay;
  renderDay=function(day){
    originalRenderDay(day);
    const panel=document.getElementById('day-panel');
    const liveRegion=panel.querySelector(':scope > [aria-live="polite"]');
    const routine=liveRegion?.querySelector(':scope > .micro-routine') ||
      panel.querySelector(':scope > .micro-routine');
    const header=panel.querySelector(':scope > .day-header');
    const prompt=routine?.querySelector(':scope > .prompt-card');
    const steps=routine?.querySelector(':scope > .routine-steps');
    if(!header||!prompt||!steps) return;
    const head=document.createElement('div');
    head.className='activity-question-head';
    head.appendChild(header);
    const toolbar=panel.querySelector(':scope > .question-toolbar');
    if(toolbar) head.appendChild(toolbar);
    const game=panel.querySelector(':scope > .word-launch-wrap');
    if(game) head.appendChild(game);
    const questionCard=document.createElement('section');
    questionCard.className='activity-question-card';
    questionCard.append(head,prompt);
    const stepsCard=document.createElement('div');
    stepsCard.className='activity-steps-card';
    stepsCard.appendChild(steps);
    if(liveRegion) liveRegion.replaceChildren(questionCard,stepsCard);
    else routine.replaceWith(questionCard,stepsCard);
  };
  renderAll();
})();
