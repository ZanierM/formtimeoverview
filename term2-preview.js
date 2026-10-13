/* Local-only Term 2 comparison preview. This file is not part of the published site. */
(() => {
  const params=new URLSearchParams(location.search);
  if(params.get('term2Preview')!=='1') return;

  const weeks={
    '2026-11-02':{
      question:'What should you keep — or change — from your first half term?',
      followUp:'Which one change could you test this week?',
      challenge:{title:'A fresh start',scenario:'You want this half term to feel more manageable than the last.',question:'Which one habit would you change first?',followUp:'How will you know whether it helps?'}
    },
    '2026-11-09':{
      pulse:{theme:'Looking ahead',question:'What is one thing you want to improve this week?',followUp:'What is one action you could take today?'},
      question:'Should schools teach practical life skills at the expense of academic content?',
      followUp:'Which subject or topic would you reduce to make room?',
      challenge:{title:'Two deadlines',scenario:'Two assignments are due on the same day, and you have a commitment after school.',question:'How would you decide what to do first?',followUp:'What would you communicate early?'}
    },
    '2026-11-16':{
      pulse:{theme:'Learning',question:'What feedback have you acted on recently?',followUp:'What difference did it make?'},
      question:'Are exams the fairest way to show what someone knows?',
      followUp:'What would a fair alternative need to measure?',
      challenge:{title:'Useful feedback',scenario:'A teacher’s feedback surprises you because you thought your work met the brief.',question:'What question could you ask to make the feedback useful?',followUp:'How would you use the answer next time?'}
    },
    '2026-11-23':{
      question:'Should people be expected to check a claim before sharing it?',
      followUp:'How much checking is reasonable in an ordinary group chat?',
      challenge:{title:'Two sources',scenario:'Two websites give different answers to the same question.',question:'How would you decide which one to trust?',followUp:'What would you do if neither is reliable?'}
    },
    '2026-11-30':{
      pulse:{theme:'Workload',question:'What is taking more time than it should?',followUp:'What could you change or ask for help with this week?'},
      question:'Should everyone have a right to disconnect from messages?',
      followUp:'Would the same rule work for students and adults?',
      challenge:{title:'Independent study',scenario:'You have a free study period but no urgent task to finish.',question:'What would make that time genuinely useful?',followUp:'What would you do in the first five minutes?'}
    },
    '2026-12-07':{
      pulse:{theme:'Learning',question:'Which study method has actually worked for you?',followUp:'How do you know it helped you remember something?'},
      question:'Is competition between students helpful or harmful?',
      followUp:'When does it motivate, and when does it put people off?',
      challenge:{title:'Starting revision',scenario:'A test is three weeks away and you only have short gaps to prepare.',question:'Which small action would help most this week?',followUp:'How would you know it was working?'}
    },
    '2026-12-14':{
      pulse:{theme:'Looking back',question:'What have you learned about how you work this term?',followUp:'What will you keep doing in January?'},
      question:'Is giving more valuable than receiving?',
      followUp:'Does your answer change if the gift is time rather than money?',
      challenge:{title:'A contribution worth noticing',scenario:'Someone in your form has helped others this term without drawing attention to it.',question:'How could you recognise their contribution meaningfully?',followUp:'What is one thing you would like to contribute next term?'}
    }
  };
  const requestedWeek=params.get('week');
  const weekKey=Object.hasOwn(weeks,requestedWeek)?requestedWeek:'2026-12-14';
  const allowedDays=['monday','tuesday','wednesday','thursday'];
  const requestedDay=params.get('day');
  const previewDay=allowedDays.includes(requestedDay)?requestedDay:'wednesday';
  const looks={warm:'Warm Glow',lights:'Twinkling Lights',evergreen:'Evergreen'};
  const look=Object.hasOwn(looks,params.get('look'))?params.get('look'):'lights';
  const previewMonday=new Date(Number(weekKey.slice(0,4)),Number(weekKey.slice(5,7))-1,Number(weekKey.slice(8,10)));
  const dayOffset={monday:0,tuesday:1,wednesday:2,thursday:3,friday:4};
  const previewDateForDay=day=>{
    const date=new Date(previewMonday);
    date.setDate(date.getDate()+(dayOffset[day]??0));
    return date;
  };
  const prettyDate=date=>date.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  const shortDate=date=>`${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${String(date.getFullYear()).slice(-2)}`;

  document.documentElement.dataset.term2Preview=look;
  document.title=`${looks[look]} · Term 2 Form Time preview`;
  const stylesheet=document.createElement('link');
  stylesheet.rel='stylesheet';
  stylesheet.href='term2-preview.css';
  document.head.appendChild(stylesheet);

  const header=document.querySelector('header');
  const lights=document.createElement('div');
  lights.className='season-lights';
  lights.setAttribute('aria-hidden','true');
  lights.innerHTML='<span class="lamp"><i class="socket"></i><i class="bulb"></i></span>'.repeat(look==='evergreen'?15:11);
  header.appendChild(lights);
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
  const identity=document.createElement('div');
  identity.className='preview-identity';
  identity.textContent=`TERM 2 PREVIEW · ${looks[look]}`;
  header.appendChild(identity);
  document.querySelector('.period-card')?.setAttribute('data-preview-note','Preview only · live countdown hidden');

  const schedule=weeks[weekKey];
  const originalRenderAll=renderAll;
  const originalRenderSidebar=renderSidebar;
  const originalRenderDay=renderDay;
  const plannedGames=[
    {date:'2026-11-09',word:'FOCUS',clue:'To give something your full attention.',reveal:'FOCUS — choose one task and give it your full attention.'},
    {date:'2026-11-25',word:'CHECK',clue:'To make sure a claim is accurate.',reveal:'CHECK — a useful habit before passing information on.'},
    {date:'2026-12-10',word:'RECAP',clue:'A short review of what you have learned.',reveal:'RECAP — revisit key ideas before they fade.'},
    {date:'2026-12-16',word:'SHARE',clue:'To give others access to something useful.',reveal:'SHARE — your time and ideas can matter too.'}
  ];
  plannedGames.forEach(game=>{
    if(!FIVE_LETTER_GAMES.some(existing=>existing.date===game.date)) FIVE_LETTER_GAMES.push(game);
  });

  weekdayDate=previewDateForDay;
  contentDateForDay=previewDateForDay;
  scheduledDateForDay=day=>isoDate(previewDateForDay(day));
  nextWeekCommencing=()=>{
    const date=new Date(previewMonday);
    date.setDate(date.getDate()+7);
    return date;
  };
  assemblyForDay=()=>null;
  updateHeader=function(){
    const shown=previewDateForDay(currentDay());
    const friday=previewDateForDay('friday');
    document.getElementById('date-display').textContent=prettyDate(shown);
    document.getElementById('week-display').textContent=`Week: ${shortDate(previewMonday)} – ${shortDate(friday)}`;
  };
  function applyPlan(){
    S.wisdomDay='wednesday';
    S.assemblies=[]; // Unknown, not assumed to be absent on the real timetable.
    S.keyDates=weekKey<'2026-11-16'
      ?['16 Nov — Year 12 Parents’ Evening (online)','Academic Review 1 — date to confirm']
      :['Academic Review 1 — date to confirm'];
    const plannedQuestion={wc:weekKey,question:schedule.question,followUp:schedule.followUp};
    S.bigQuestions=[...(S.bigQuestions||[]).filter(item=>item.wc!==weekKey),plannedQuestion];
    if(schedule.pulse){
      const pulse={wc:weekKey,...schedule.pulse};
      S.weeklyPulses=[...(S.weeklyPulses||[]).filter(item=>item.wc!==weekKey),pulse];
    }
    const rotation=[...(S.challengeRotation||DEFAULTS.challengeRotation)];
    rotation[rotationIndexForWeek(previewMonday,rotation.length)]=schedule.challenge;
    S.challengeRotation=rotation;
  }
  renderSidebar=function(){
    originalRenderSidebar();
    document.getElementById('asm-next').innerHTML='<div class="asm-box"><span class="asm-lbl">Term 2 assemblies</span><div class="asm-txt">Timetable to be confirmed</div></div>';
  };
  renderDay=function(day){
    if((weekKey==='2026-11-02'&&(day==='monday'||day==='tuesday'))||(weekKey==='2026-11-23'&&day==='monday')){
      document.getElementById('day-panel').innerHTML=`<div class="no-form-time"><h1 class="day-name">${cap(day)}</h1><strong>Development day — no form time</strong></div>`;
      return;
    }
    originalRenderDay(day);
  };
  renderAll=function(){ applyPlan(); originalRenderAll(); };
  document.getElementById('day-select').value=previewDay;
  document.getElementById('day-select').addEventListener('change',updateHeader);
  renderAll();
})();
