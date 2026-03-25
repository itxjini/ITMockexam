function getAllowedStudents() {
  const stored = localStorage.getItem('exam_allowed_students');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) {}
  }
  return ['Zain', 'Laraib', 'Hassan'];
}

let studentName       = '';
let currentQ          = 0;
let userAnswers       = new Array(30).fill(null);
let mcqScore          = 0;
let timerInterval     = null;
let timeLeft          = 45 * 60;
let wordFileUploaded  = false;
let excelFileUploaded = false;
let wordFileName      = '';
let excelFileName     = '';
let wordFileData      = null;
let excelFileData     = null;
let examSubmitted     = false;

(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, dots = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function createDots(n) {
    dots = [];
    for (let i = 0; i < n; i++) {
      dots.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.5+.4,
        vx: (Math.random()-.5)*.25, vy: (Math.random()-.5)*.25, a: Math.random()*.6+.1 });
    }
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x<0) d.x=W; if (d.x>W) d.x=0;
      if (d.y<0) d.y=H; if (d.y>H) d.y=0;
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(59,139,255,${d.a})`; ctx.fill();
    });
    for (let i=0;i<dots.length;i++) for (let j=i+1;j<dots.length;j++) {
      const dx=dots[i].x-dots[j].x, dy=dots[i].y-dots[j].y, dist=Math.sqrt(dx*dx+dy*dy);
      if (dist<100) {
        ctx.beginPath(); ctx.moveTo(dots[i].x,dots[i].y); ctx.lineTo(dots[j].x,dots[j].y);
        ctx.strokeStyle=`rgba(59,139,255,${.12*(1-dist/100)})`; ctx.lineWidth=.6; ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  resize(); createDots(60); draw();
  window.addEventListener('resize', ()=>{ resize(); createDots(60); });
})();

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    if (s.classList.contains('active')) {
      s.classList.add('screen-exit');
      setTimeout(() => s.classList.remove('active','screen-exit'), 340);
    }
  });
  setTimeout(() => {
    const t = document.getElementById(id);
    t.classList.add('active','screen-enter');
    setTimeout(() => t.classList.remove('screen-enter'), 500);
  }, 280);
}

function startExam() {
  const inp  = document.getElementById('student-name');
  const errEl = document.getElementById('name-error');
  const raw  = inp.value.trim();

  if (!raw) {
    showNameError(inp, errEl, '⚠  Please enter your name first.');
    return;
  }

  const allowed = getAllowedStudents();

  const match = allowed.find(n => n.toLowerCase() === raw.toLowerCase());
  if (!match) {
    showNameError(inp, errEl, '🚫  Your name is not on the registered student list. Contact your teacher.');
    return;
  }

  const submissions = getSubmissions();
  const alreadyDone = submissions.some(s => s.studentName.toLowerCase() === raw.toLowerCase());
  if (alreadyDone) {
    showNameError(inp, errEl, '🔒  You have already submitted this exam. Retakes are not allowed.');
    return;
  }

  studentName = match;

  shuffleQuestions();

  document.getElementById('eh-student').textContent = studentName;

  buildTaskList('word-tasks',  WORD_TASKS,  false);
  buildTaskList('excel-tasks', EXCEL_TASKS, true);

  setupDragDrop('word-upload-zone',  'word-file',  'word');
  setupDragDrop('excel-upload-zone', 'excel-file', 'excel');

  startTimer();
  renderQuestion();
  updateProgress();
  buildDots();

  showScreen('screen-mcq');
}

function showNameError(inp, errEl, msg) {
  inp.style.borderColor = '#ef4444';
  inp.style.boxShadow   = '0 0 0 4px rgba(239,68,68,.2)';
  errEl.style.display   = 'block';
  errEl.textContent     = msg;
  setTimeout(() => {
    inp.style.borderColor = '';
    inp.style.boxShadow   = '';
    errEl.style.display   = 'none';
  }, 4000);
}

function shuffleQuestions() {
  const hw    = QUESTIONS.slice(0,20);
  const word  = QUESTIONS.slice(20,25);
  const excel = QUESTIONS.slice(25,30);
  shuffle(hw); shuffle(word); shuffle(excel);
  QUESTIONS.splice(0,30,...hw,...word,...excel);
}
function shuffle(arr) {
  for (let i=arr.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

function startTimer() {
  const display = document.getElementById('timer-display');
  timerInterval = setInterval(()=>{
    timeLeft--;
    const m=String(Math.floor(timeLeft/60)).padStart(2,'0');
    const s=String(timeLeft%60).padStart(2,'0');
    display.textContent=`${m}:${s}`;
    if (timeLeft<=300) { display.classList.remove('warn'); display.classList.add('danger'); }
    else if (timeLeft<=600) display.classList.add('warn');
    if (timeLeft<=0) { clearInterval(timerInterval); showPractical(); }
  }, 1000);
}

function renderQuestion() {
  const q=QUESTIONS[currentQ];
  const card=document.getElementById('mcq-card');
  card.style.animation='none'; card.offsetHeight; card.style.animation='cardIn .35s ease';

  const tag=document.getElementById('mcq-section-tag');
  tag.textContent=q.section;
  const c=sectionColor(q.section);
  tag.style.background=c.bg; tag.style.color=c.text; tag.style.border=`1px solid ${c.border}`;

  document.getElementById('mcq-num').textContent=`Question ${currentQ+1} of ${QUESTIONS.length}`;
  document.getElementById('mcq-question').textContent=q.q;

  const optsEl=document.getElementById('mcq-options');
  optsEl.innerHTML='';
  ['A','B','C','D'].forEach((letter,i)=>{
    const div=document.createElement('div');
    div.className='mcq-option'+(userAnswers[currentQ]===i?' selected':'');
    div.innerHTML=`<div class="opt-letter">${letter}</div><div class="opt-text">${q.opts[i]}</div>`;
    div.addEventListener('click',()=>selectOption(i));
    optsEl.appendChild(div);
  });

  document.getElementById('btn-prev').style.display=currentQ===0?'none':'inline-flex';
  const btnNext=document.getElementById('btn-next');
  if (currentQ===QUESTIONS.length-1) { btnNext.textContent='Finish MCQs ✓'; btnNext.classList.add('finish'); }
  else { btnNext.textContent='Next →'; btnNext.classList.remove('finish'); }

  updateProgress(); updateDots();
}

function sectionColor(s) {
  if (s==='Hardware') return {bg:'rgba(167,139,250,.12)',text:'#a78bfa',border:'rgba(167,139,250,.25)'};
  if (s==='MS Word')  return {bg:'rgba(59,139,255,.12)', text:'#3b8bff',border:'rgba(59,139,255,.25)'};
  return                     {bg:'rgba(249,115,22,.12)', text:'#f97316',border:'rgba(249,115,22,.25)'};
}

function selectOption(idx) {
  userAnswers[currentQ]=idx;
  document.querySelectorAll('.mcq-option').forEach((o,i)=>o.classList.toggle('selected',i===idx));
  updateDots(); updateProgress();
  if (currentQ<QUESTIONS.length-1) setTimeout(()=>{ currentQ++; renderQuestion(); }, 420);
}

function nextQ() { if (currentQ===QUESTIONS.length-1) { showPractical(); return; } currentQ++; renderQuestion(); }
function prevQ() { if (currentQ>0) { currentQ--; renderQuestion(); } }

function updateProgress() {
  const answered=userAnswers.filter(a=>a!==null).length;
  const pct=(answered/QUESTIONS.length)*100;
  document.getElementById('mcq-bar').style.width=pct+'%';
  document.getElementById('ring-text').textContent=`${answered}/30`;
  const circ=2*Math.PI*24;
  document.getElementById('ring-circle').style.strokeDashoffset=circ-(answered/QUESTIONS.length)*circ;
}

function buildDots() {
  const container=document.getElementById('mcq-dots'); container.innerHTML='';
  for (let i=0;i<QUESTIONS.length;i++) {
    const d=document.createElement('div');
    d.className='mcq-dot'+(i===currentQ?' current':'');
    d.title=`Question ${i+1}`;
    d.addEventListener('click',()=>{ currentQ=i; renderQuestion(); });
    container.appendChild(d);
  }
}
function updateDots() {
  document.querySelectorAll('.mcq-dot').forEach((d,i)=>{
    d.className='mcq-dot';
    if (i===currentQ) d.classList.add('current');
    else if (userAnswers[i]!==null) d.classList.add('answered');
  });
}

function showPractical() {
  clearInterval(timerInterval);
  mcqScore=0;
  userAnswers.forEach((ans,i)=>{ if(ans===QUESTIONS[i].ans) mcqScore++; });
  document.getElementById('prac-student').textContent=studentName;
  document.getElementById('mcq-score-display').textContent=mcqScore;
  showScreen('screen-practical');
}

function buildTaskList(containerId, tasks, isExcel) {
  const container=document.getElementById(containerId); container.innerHTML='';
  tasks.forEach((t,idx)=>{
    const div=document.createElement('div');
    div.className='task-item'+(isExcel?' excel-ctx-task':'');
    div.style.animationDelay=(idx*0.04)+'s';
    div.innerHTML=`<div class="task-num">${t.num}</div><div class="task-body"><div class="task-desc">${t.desc}</div><span class="task-marks">${t.marks} Mark${t.marks>1?'s':''}</span></div>`;
    container.appendChild(div);
  });
}

function switchTab(tab) {
  document.querySelectorAll('.ptab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.querySelectorAll('.prac-tab-content').forEach(c=>c.classList.toggle('active',c.id===`tab-${tab}`));
}

function handleFileUpload(type, input) {
  const file=input.files[0]; if (!file) return;
  const reader=new FileReader();
  reader.onload=function(e) {
    const b64=e.target.result; // data URL
    if (type==='word') { wordFileUploaded=true; wordFileName=file.name; wordFileData=b64; }
    else               { excelFileUploaded=true; excelFileName=file.name; excelFileData=b64; }

    const statusEl=document.getElementById(`${type}-file-status`);
    const zone=document.getElementById(`${type}-upload-zone`);
    statusEl.innerHTML=`✅ &nbsp;<strong>${file.name}</strong> uploaded successfully! (${formatSize(file.size)})`;
    zone.style.borderColor='var(--green)'; zone.style.background='rgba(34,197,94,.04)';
    const inner=zone.querySelector('.uz-inner');
    inner.querySelector('.uz-icon').textContent='✅';
    inner.querySelector('.uz-title').textContent='File Uploaded!';
    inner.querySelector('.uz-sub').textContent=file.name;
  };
  reader.readAsDataURL(file);
}

function formatSize(b) {
  if (b<1024) return b+' B';
  if (b<1048576) return (b/1024).toFixed(1)+' KB';
  return (b/1048576).toFixed(2)+' MB';
}

function setupDragDrop(zoneId, inputId, type) {
  const zone=document.getElementById(zoneId);
  zone.addEventListener('dragover',e=>{ e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave',()=>zone.classList.remove('drag-over'));
  zone.addEventListener('drop',e=>{
    e.preventDefault(); zone.classList.remove('drag-over');
    const file=e.dataTransfer.files[0];
    if (file) {
      const inp=document.getElementById(inputId);
      const dt=new DataTransfer(); dt.items.add(file); inp.files=dt.files;
      handleFileUpload(type, inp);
    }
  });
}

function submitExam() {
  if (examSubmitted) return;

  if (!wordFileUploaded || !excelFileUploaded) {
    const missing=[];
    if (!wordFileUploaded)  missing.push('Word (.docx)');
    if (!excelFileUploaded) missing.push('Excel (.xlsx)');
    const ok=confirm(`⚠ You haven't uploaded your ${missing.join(' and ')} file${missing.length>1?'s':''}.\n\nDo you still want to submit?`);
    if (!ok) return;
  }

  examSubmitted=true;

  mcqScore=0;
  userAnswers.forEach((ans,i)=>{ if(ans!==null && ans===QUESTIONS[i].ans) mcqScore++; });

  const letters=['A','B','C','D'];
  const answersDetail=QUESTIONS.map((q,i)=>({
    num: i+1,
    section: q.section,
    question: q.q,
    options: q.opts,
    correctIndex: q.ans,
    givenIndex: userAnswers[i],
    correct: userAnswers[i]===q.ans
  }));

  const submission={
    id: Date.now(),
    submittedAt: new Date().toISOString(),
    studentName,
    mcqScore,
    mcqTotal: 30,
    wordFileUploaded,
    wordFileName,
    wordFileData,
    excelFileUploaded,
    excelFileName,
    excelFileData,
    answersDetail,
    graded: false,
    wordGrade: null,
    excelGrade: null,
    totalGrade: null,
    teacherNote: ''
  };

  const existing=getSubmissions();
  existing.push(submission);
  localStorage.setItem('exam_submissions', JSON.stringify(existing));

  document.getElementById('sc-student-name').textContent=studentName;
  document.getElementById('sc-mcq').textContent=`${mcqScore} / 30`;
  document.getElementById('sc-word').textContent=wordFileUploaded?`✅ ${wordFileName}`:'⚠ Not uploaded';
  document.getElementById('sc-excel').textContent=excelFileUploaded?`✅ ${excelFileName}`:'⚠ Not uploaded';

  showScreen('screen-submitted');
}

function getSubmissions() {
  try { return JSON.parse(localStorage.getItem('exam_submissions')) || []; } catch(e) { return []; }
}

document.getElementById('student-name').addEventListener('keydown',e=>{ if(e.key==='Enter') startExam(); });
