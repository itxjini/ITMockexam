// ══════════════════════════════════════════════════════
//  IT MOCK EXAM — JiniMaestro  |  app.js  (v2 Teacher)
// ══════════════════════════════════════════════════════

// ── ALLOWED STUDENTS ──────────────────────────────
function getAllowedStudents() {
  const stored = localStorage.getItem("jm_allowed_students");
  if (stored) return JSON.parse(stored);
  const defaults = ["zain", "laraib", "hassan"];
  localStorage.setItem("jm_allowed_students", JSON.stringify(defaults));
  return defaults;
}
function saveAllowedStudents(arr) {
  localStorage.setItem("jm_allowed_students", JSON.stringify(arr.map(s => s.toLowerCase().trim())));
}

// ── COMPLETED STUDENTS ────────────────────────────
function getCompletedStudents() {
  const stored = localStorage.getItem("jm_completed_students");
  return stored ? JSON.parse(stored) : [];
}
function markStudentCompleted(name) {
  const list = getCompletedStudents();
  const key = name.toLowerCase().trim();
  if (!list.includes(key)) { list.push(key); localStorage.setItem("jm_completed_students", JSON.stringify(list)); }
}
function hasStudentCompleted(name) {
  return getCompletedStudents().includes(name.toLowerCase().trim());
}

// ── TEACHER CREDENTIALS ───────────────────────────
const TEACHER_EMAIL = "Jini@jinimaestro.com";
const TEACHER_PASS  = "Robin..987";

// ── STATE ──────────────────────────────────────────
let studentName       = "";
let currentQ          = 0;
let userAnswers       = new Array(30).fill(null);
let mcqScore          = 0;
let timerInterval     = null;
let timeLeft          = 45 * 60;
let wordFileUploaded  = false;
let excelFileUploaded = false;
let wordFileName      = "";
let excelFileName     = "";
let wordFileData      = null;
let excelFileData     = null;
let examSubmitted     = false;

// ── PARTICLES ──────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById("particles");
  const ctx    = canvas.getContext("2d");
  let W, H, dots = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function createDots(n) {
    dots = [];
    for (let i = 0; i < n; i++) {
      dots.push({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.5+.4,
        vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25, a:Math.random()*.6+.1 });
    }
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    dots.forEach(d => {
      d.x+=d.vx; d.y+=d.vy;
      if(d.x<0)d.x=W; if(d.x>W)d.x=0; if(d.y<0)d.y=H; if(d.y>H)d.y=0;
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(59,139,255,${d.a})`; ctx.fill();
    });
    for(let i=0;i<dots.length;i++) for(let j=i+1;j<dots.length;j++){
      const dx=dots[i].x-dots[j].x, dy=dots[i].y-dots[j].y, dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<100){ ctx.beginPath(); ctx.moveTo(dots[i].x,dots[i].y); ctx.lineTo(dots[j].x,dots[j].y);
        ctx.strokeStyle=`rgba(59,139,255,${.12*(1-dist/100)})`; ctx.lineWidth=.6; ctx.stroke(); }
    }
    requestAnimationFrame(draw);
  }
  resize(); createDots(60); draw();
  window.addEventListener("resize",()=>{ resize(); createDots(60); });
})();

// ── SCREEN TRANSITIONS ────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    if (s.classList.contains("active")) {
      s.classList.add("screen-exit");
      setTimeout(()=>{ s.classList.remove("active","screen-exit"); },340);
    }
  });
  setTimeout(()=>{
    const t = document.getElementById(id);
    t.classList.add("active","screen-enter");
    setTimeout(()=>t.classList.remove("screen-enter"),500);
  },280);
}

// ── START EXAM ────────────────────────────────────
function startExam() {
  const inp = document.getElementById("student-name");
  const raw = inp.value.trim();
  const key = raw.toLowerCase().trim();
  if (!raw) { shakeInput(inp,"⚠  Please enter your name first","e.g. Zain"); return; }
  if (!getAllowedStudents().includes(key)) { shakeInput(inp,"⛔  Your name is not on the exam list","Contact your teacher"); return; }
  if (hasStudentCompleted(key)) { shakeInput(inp,"✋  You have already taken this exam","Contact your teacher"); return; }
  studentName = raw;
  shuffleQuestions();
  document.getElementById("eh-student").textContent = studentName;
  buildTaskList("word-tasks", WORD_TASKS, false);
  buildTaskList("excel-tasks", EXCEL_TASKS, true);
  setupDragDrop("word-upload-zone","word-file","word");
  setupDragDrop("excel-upload-zone","excel-file","excel");
  startTimer(); renderQuestion(); updateProgress(); buildDots();
  showScreen("screen-mcq");
}

function shakeInput(inp, msg, ph) {
  inp.style.borderColor="#ef4444"; inp.style.boxShadow="0 0 0 4px rgba(239,68,68,.2)";
  inp.placeholder=msg; inp.value="";
  setTimeout(()=>{ inp.style.borderColor=""; inp.style.boxShadow=""; inp.placeholder=ph||"e.g. Zain"; },2800);
}

// ── SHUFFLE ───────────────────────────────────────
function shuffleQuestions() {
  const hw=QUESTIONS.slice(0,20),word=QUESTIONS.slice(20,25),excel=QUESTIONS.slice(25,30);
  shuffle(hw); shuffle(word); shuffle(excel);
  QUESTIONS.splice(0,30,...hw,...word,...excel);
}
function shuffle(arr) { for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} }

// ── TIMER ─────────────────────────────────────────
function startTimer() {
  const d=document.getElementById("timer-display");
  timerInterval=setInterval(()=>{
    timeLeft--;
    d.textContent=`${String(Math.floor(timeLeft/60)).padStart(2,"0")}:${String(timeLeft%60).padStart(2,"0")}`;
    if(timeLeft<=300){d.classList.remove("warn");d.classList.add("danger");}
    else if(timeLeft<=600){d.classList.add("warn");}
    if(timeLeft<=0){clearInterval(timerInterval);showPractical();}
  },1000);
}

// ── RENDER QUESTION ───────────────────────────────
function renderQuestion() {
  const q=QUESTIONS[currentQ];
  const card=document.getElementById("mcq-card");
  card.style.animation="none"; card.offsetHeight; card.style.animation="cardIn .35s ease";
  const tag=document.getElementById("mcq-section-tag");
  const sc=sectionColor(q.section);
  tag.textContent=q.section; tag.style.background=sc.bg; tag.style.color=sc.text; tag.style.border=`1px solid ${sc.border}`;
  document.getElementById("mcq-num").textContent=`Question ${currentQ+1} of ${QUESTIONS.length}`;
  document.getElementById("mcq-question").textContent=q.q;
  const optsEl=document.getElementById("mcq-options"); optsEl.innerHTML="";
  const L=["A","B","C","D"];
  q.opts.forEach((opt,i)=>{
    const div=document.createElement("div");
    div.className="mcq-option"+(userAnswers[currentQ]===i?" selected":"");
    div.innerHTML=`<div class="opt-letter">${L[i]}</div><div class="opt-text">${opt}</div>`;
    div.addEventListener("click",()=>selectOption(i));
    optsEl.appendChild(div);
  });
  const btnPrev=document.getElementById("btn-prev"),btnNext=document.getElementById("btn-next");
  btnPrev.style.display=currentQ===0?"none":"inline-flex";
  if(currentQ===QUESTIONS.length-1){btnNext.textContent="Finish MCQs ✓";btnNext.classList.add("finish");}
  else{btnNext.textContent="Next →";btnNext.classList.remove("finish");}
  updateProgress(); updateDots();
}
function sectionColor(s){
  if(s==="Hardware") return{bg:"rgba(167,139,250,.12)",text:"#a78bfa",border:"rgba(167,139,250,.25)"};
  if(s==="MS Word")  return{bg:"rgba(59,139,255,.12)",text:"#3b8bff",border:"rgba(59,139,255,.25)"};
  return{bg:"rgba(249,115,22,.12)",text:"#f97316",border:"rgba(249,115,22,.25)"};
}

// ── SELECT OPTION ─────────────────────────────────
function selectOption(idx) {
  userAnswers[currentQ]=idx;
  document.querySelectorAll(".mcq-option").forEach((o,i)=>o.classList.toggle("selected",i===idx));
  updateDots(); updateProgress();
  if(currentQ<QUESTIONS.length-1) setTimeout(()=>{currentQ++;renderQuestion();},420);
}

// ── NAV ───────────────────────────────────────────
function nextQ(){ if(currentQ===QUESTIONS.length-1){showPractical();return;} currentQ++; renderQuestion(); }
function prevQ(){ if(currentQ>0){currentQ--;renderQuestion();} }

// ── PROGRESS ──────────────────────────────────────
function updateProgress(){
  const ans=userAnswers.filter(a=>a!==null).length, pct=(ans/QUESTIONS.length)*100;
  document.getElementById("mcq-bar").style.width=pct+"%";
  document.getElementById("ring-text").textContent=`${ans}/30`;
  const circ=2*Math.PI*24;
  document.getElementById("ring-circle").style.strokeDashoffset=circ-(ans/QUESTIONS.length)*circ;
}
function buildDots(){
  const c=document.getElementById("mcq-dots"); c.innerHTML="";
  for(let i=0;i<QUESTIONS.length;i++){
    const d=document.createElement("div"); d.className="mcq-dot"+(i===currentQ?" current":"");
    d.title=`Q${i+1}`; d.addEventListener("click",()=>{currentQ=i;renderQuestion();}); c.appendChild(d);
  }
}
function updateDots(){
  document.querySelectorAll(".mcq-dot").forEach((d,i)=>{
    d.className="mcq-dot";
    if(i===currentQ) d.classList.add("current");
    else if(userAnswers[i]!==null) d.classList.add("answered");
  });
}

// ── PRACTICAL ─────────────────────────────────────
function showPractical(){
  clearInterval(timerInterval);
  mcqScore=0; userAnswers.forEach((ans,i)=>{ if(ans===QUESTIONS[i].ans) mcqScore++; });
  document.getElementById("prac-student").textContent=studentName;
  document.getElementById("mcq-score-display").textContent=mcqScore;
  showScreen("screen-practical");
}
function buildTaskList(cId,tasks,isExcel){
  const c=document.getElementById(cId); c.innerHTML="";
  tasks.forEach((t,idx)=>{
    const div=document.createElement("div");
    div.className="task-item"+(isExcel?" excel-ctx-task":"");
    div.style.animationDelay=(idx*0.04)+"s";
    div.innerHTML=`<div class="task-num">${t.num}</div>
      <div class="task-body"><div class="task-desc">${t.desc}</div>
      <span class="task-marks">${t.marks} Mark${t.marks>1?"s":""}</span></div>`;
    c.appendChild(div);
  });
}
function switchTab(tab){
  document.querySelectorAll(".ptab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  document.querySelectorAll(".prac-tab-content").forEach(c=>c.classList.toggle("active",c.id===`tab-${tab}`));
}

// ── FILE UPLOAD ───────────────────────────────────
function handleFileUpload(type,input){
  const file=input.files[0]; if(!file) return;
  const statusEl=document.getElementById(`${type}-file-status`);
  const zone=document.getElementById(`${type}-upload-zone`);
  const reader=new FileReader();
  reader.onload=function(e){
    const b64=e.target.result.split(",")[1];
    if(type==="word"){wordFileUploaded=true;wordFileName=file.name;wordFileData={name:file.name,data:b64,size:file.size};}
    else{excelFileUploaded=true;excelFileName=file.name;excelFileData={name:file.name,data:b64,size:file.size};}
    statusEl.innerHTML=`✅ &nbsp;<strong>${file.name}</strong> uploaded! (${formatSize(file.size)})`;
    zone.style.borderColor="var(--green)"; zone.style.background="rgba(34,197,94,.04)";
    const inner=zone.querySelector(".uz-inner");
    inner.querySelector(".uz-icon").textContent="✅";
    inner.querySelector(".uz-title").textContent="File Uploaded!";
    inner.querySelector(".uz-sub").textContent=file.name;
  };
  reader.readAsDataURL(file);
}
function formatSize(b){ return b<1024?b+" B":b<1048576?(b/1024).toFixed(1)+" KB":(b/1048576).toFixed(2)+" MB"; }
function setupDragDrop(zoneId,inputId,type){
  const zone=document.getElementById(zoneId);
  zone.addEventListener("dragover",e=>{e.preventDefault();zone.classList.add("drag-over");});
  zone.addEventListener("dragleave",()=>zone.classList.remove("drag-over"));
  zone.addEventListener("drop",e=>{
    e.preventDefault();zone.classList.remove("drag-over");
    const file=e.dataTransfer.files[0];
    if(file){const inp=document.getElementById(inputId);const dt=new DataTransfer();dt.items.add(file);inp.files=dt.files;handleFileUpload(type,inp);}
  });
}

// ── SUBMIT EXAM ───────────────────────────────────
function submitExam(){
  if(examSubmitted) return;
  if(!wordFileUploaded||!excelFileUploaded){
    const missing=[];
    if(!wordFileUploaded)missing.push("Word (.docx)");
    if(!excelFileUploaded)missing.push("Excel (.xlsx)");
    if(!confirm(`⚠ You haven't uploaded: ${missing.join(", ")}.\n\nSubmit anyway?`)) return;
  }
  examSubmitted=true;
  markStudentCompleted(studentName);
  saveResultToTeacher();
  showResult();
}

// ── SAVE TO TEACHER PANEL ─────────────────────────
function saveResultToTeacher(){
  const now=new Date();
  const record={
    id:Date.now(), studentName,
    submittedAt:now.toISOString(),
    dateStr:now.toLocaleDateString("en-GB"),
    timeStr:now.toLocaleTimeString("en-GB"),
    mcqScore,
    mcqDetails:QUESTIONS.map((q,i)=>({
      num:i+1,section:q.section,question:q.q,options:q.opts,
      correctIdx:q.ans,studentIdx:userAnswers[i],correct:userAnswers[i]===q.ans
    })),
    wordFile:wordFileData, excelFile:excelFileData,
    status:"pending", wordGrade:null, excelGrade:null, totalGrade:null, teacherNotes:""
  };
  const existing=JSON.parse(localStorage.getItem("jm_submissions")||"[]");
  existing.push(record);
  localStorage.setItem("jm_submissions",JSON.stringify(existing));
}

// ── SHOW RESULT (student — no download button) ────
function showResult(){
  mcqScore=0; userAnswers.forEach((ans,i)=>{ if(ans!==null&&ans===QUESTIONS[i].ans) mcqScore++; });
  document.getElementById("rc-name").textContent=studentName;
  document.getElementById("r-mcq").textContent=mcqScore;
  document.getElementById("r-word").textContent=wordFileUploaded?"File Submitted ✓":"Not Submitted";
  document.getElementById("r-excel").textContent=excelFileUploaded?"File Submitted ✓":"Not Submitted";
  document.getElementById("rc-total-display").textContent=`${mcqScore} / 30`;
  setTimeout(()=>{
    document.getElementById("rb-mcq").style.width=(mcqScore/30*100)+"%";
    document.getElementById("rb-word").style.width=wordFileUploaded?"100%":"0%";
    document.getElementById("rb-excel").style.width=excelFileUploaded?"100%":"0%";
  },300);
  const grid=document.getElementById("rc-answers-grid"); grid.innerHTML="";
  const L=["A","B","C","D"];
  QUESTIONS.forEach((q,i)=>{
    const ua=userAnswers[i],correct=ua===q.ans;
    const div=document.createElement("div");
    div.className=`rca-item ${ua!==null?(correct?"correct":"wrong"):"wrong"}`;
    div.innerHTML=`<div class="rca-qnum">Q${i+1}</div><div class="rca-ans">${ua!==null?L[ua]:"—"}</div><div class="rca-correct">${correct?"✓":L[q.ans]}</div>`;
    grid.appendChild(div);
  });
  showScreen("screen-result");
  if(mcqScore>=20) fireConfetti();
}

function fireConfetti(){
  const colors=["#3b8bff","#00d4ff","#22c55e","#f97316","#a78bfa","#f59e0b","#ef4444"];
  for(let i=0;i<90;i++) setTimeout(()=>{
    const el=document.createElement("div"); el.className="confetti-piece";
    el.style.cssText=`left:${Math.random()*100}vw;background:${colors[~~(Math.random()*colors.length)]};
      animation-duration:${Math.random()*2.5+1.5}s;animation-delay:${Math.random()*.5}s;
      width:${Math.random()*8+6}px;height:${Math.random()*10+8}px;
      border-radius:${Math.random()>.5?"50%":"2px"};transform:rotate(${Math.random()*360}deg)`;
    document.getElementById("confetti-area").appendChild(el);
    setTimeout(()=>el.remove(),4500);
  },i*35);
}

// ══════════════════════════════════════════════════
//  TEACHER PANEL FUNCTIONS
// ══════════════════════════════════════════════════

function teacherLogin(){
  const email=document.getElementById("t-email").value.trim();
  const pass=document.getElementById("t-pass").value.trim();
  const errEl=document.getElementById("t-login-err");
  if(email===TEACHER_EMAIL && pass===TEACHER_PASS){
    errEl.textContent="";
    document.getElementById("teacher-login-panel").style.display="none";
    document.getElementById("teacher-dashboard").style.display="block";
    loadTeacherDashboard();
  } else {
    errEl.textContent="❌ Incorrect email or password.";
    document.getElementById("t-pass").value="";
  }
}

function teacherLogout(){
  document.getElementById("teacher-login-panel").style.display="flex";
  document.getElementById("teacher-dashboard").style.display="none";
  document.getElementById("t-email").value="";
  document.getElementById("t-pass").value="";
}

function loadTeacherDashboard(){ renderStudentManager(); renderSubmissions(); }

// ── STUDENT MANAGER ───────────────────────────────
function renderStudentManager(){
  const allowed=getAllowedStudents(), completed=getCompletedStudents();
  const container=document.getElementById("student-list");
  container.innerHTML="";
  if(!allowed.length){ container.innerHTML=`<div class="no-students-msg">No students added yet.</div>`; return; }
  allowed.forEach(name=>{
    const done=completed.includes(name);
    const row=document.createElement("div"); row.className="student-row";
    row.innerHTML=`<div class="sr-info">
        <span class="sr-name">${name.charAt(0).toUpperCase()+name.slice(1)}</span>
        <span class="sr-badge ${done?"sr-done":"sr-pending"}">${done?"✓ Completed":"⏳ Not yet taken"}</span>
      </div>
      <div class="sr-btns">
        ${done?`<button class="btn-reset-s" onclick="resetStudent('${name}')">🔄 Reset</button>`:""}
        <button class="btn-remove-s" onclick="removeStudent('${name}')">✕ Remove</button>
      </div>`;
    container.appendChild(row);
  });
}

function addStudent(){
  const inp=document.getElementById("new-student-name");
  const name=inp.value.trim().toLowerCase();
  if(!name){ inp.style.borderColor="#ef4444"; setTimeout(()=>inp.style.borderColor="",1500); return; }
  const allowed=getAllowedStudents();
  if(allowed.includes(name)){ showToast("Student already in list!","warn"); inp.value=""; return; }
  allowed.push(name); saveAllowedStudents(allowed); inp.value="";
  renderStudentManager(); showToast(`✅ "${name}" added`,"success");
}

function removeStudent(name){
  if(!confirm(`Remove "${name}" from the exam list?`)) return;
  saveAllowedStudents(getAllowedStudents().filter(s=>s!==name));
  renderStudentManager(); showToast(`"${name}" removed`,"info");
}

function resetStudent(name){
  if(!confirm(`Reset "${name}"? They will be able to retake the exam.`)) return;
  localStorage.setItem("jm_completed_students",JSON.stringify(getCompletedStudents().filter(s=>s!==name)));
  renderStudentManager(); showToast(`"${name}" can now retake exam`,"success");
}

// ── RENDER SUBMISSIONS ────────────────────────────
function renderSubmissions(){
  const subs=JSON.parse(localStorage.getItem("jm_submissions")||"[]");
  const container=document.getElementById("submissions-list");
  const empty=document.getElementById("no-submissions");
  if(!subs.length){ container.innerHTML=""; empty.style.display="block"; return; }
  empty.style.display="none"; container.innerHTML="";
  [...subs].reverse().forEach((sub,ri)=>{
    const origIdx=subs.length-1-ri;
    const card=document.createElement("div");
    card.className="sub-card"+(sub.status==="graded"?" sub-graded":"");
    card.id=`sub-card-${origIdx}`;
    card.innerHTML=buildSubmissionCard(sub,origIdx);
    container.appendChild(card);
  });
}

function buildSubmissionCard(sub,idx){
  const L=["A","B","C","D"];
  const mcqPct=Math.round((sub.mcqScore/30)*100);
  let mcqRows="";
  sub.mcqDetails.forEach(q=>{
    const ga=q.studentIdx!=null?L[q.studentIdx]:"—";
    mcqRows+=`<tr class="${q.correct?"tr-correct":"tr-wrong"}">
      <td>${q.num}</td><td>${q.section}</td><td style="max-width:280px">${q.question}</td>
      <td><strong>${ga}</strong></td><td>${L[q.correctIdx]}</td>
      <td class="${q.correct?"ans-correct":"ans-wrong"}">${q.correct?"✓ Correct":"✗ Wrong"}</td>
    </tr>`;
  });
  const wFile=sub.wordFile, eFile=sub.excelFile;
  return `
  <div class="sub-header">
    <div class="sub-student-info">
      <div class="sub-avatar">${sub.studentName.charAt(0).toUpperCase()}</div>
      <div>
        <div class="sub-name">${sub.studentName}</div>
        <div class="sub-time">📅 ${sub.dateStr} at ${sub.timeStr}</div>
      </div>
    </div>
    <div class="sub-meta-right">
      <div class="sub-mcq-pill">MCQ: ${sub.mcqScore}/30 <span class="sub-pct">(${mcqPct}%)</span></div>
      ${sub.status==="graded"
        ?`<div class="sub-graded-badge">✅ Graded · Total: ${sub.totalGrade}/100</div>`
        :`<div class="sub-pending-badge">⏳ Pending Grade</div>`}
    </div>
  </div>

  <div class="sub-files-row">
    ${wFile?`<button class="btn-dl-file word-dl" onclick="downloadSubmittedFile(${idx},'word')">📝 Download Word — <em>${wFile.name}</em></button>`
           :`<span class="no-file-tag">📝 No Word file submitted</span>`}
    ${eFile?`<button class="btn-dl-file excel-dl" onclick="downloadSubmittedFile(${idx},'excel')">📊 Download Excel — <em>${eFile.name}</em></button>`
           :`<span class="no-file-tag">📊 No Excel file submitted</span>`}
  </div>

  <details class="mcq-details-drop">
    <summary>📋 View Full MCQ Answers (${sub.mcqScore}/30 correct)</summary>
    <div class="mcq-table-wrap">
      <table class="mcq-review-table">
        <thead><tr><th>#</th><th>Section</th><th>Question</th><th>Student</th><th>Correct</th><th>Status</th></tr></thead>
        <tbody>${mcqRows}</tbody>
      </table>
    </div>
  </details>

  <div class="grading-section">
    <div class="grading-title">🎓 Grade This Submission</div>
    <div class="grading-grid">
      <div class="grade-group">
        <label>Section A — MCQs (Auto-Graded)</label>
        <div class="grade-input-row">
          <input class="grade-inp" value="${sub.mcqScore}" readonly style="opacity:.6;cursor:not-allowed">
          <span class="grade-of">/ 30</span>
        </div>
      </div>
      <div class="grade-group">
        <label>Section B — Word Practical</label>
        <div class="grade-input-row">
          <input type="number" class="grade-inp" id="word-grade-${idx}" value="${sub.wordGrade??""}" min="0" max="35" placeholder="0–35">
          <span class="grade-of">/ 35</span>
        </div>
      </div>
      <div class="grade-group">
        <label>Section C — Excel Practical</label>
        <div class="grade-input-row">
          <input type="number" class="grade-inp" id="excel-grade-${idx}" value="${sub.excelGrade??""}" min="0" max="35" placeholder="0–35">
          <span class="grade-of">/ 35</span>
        </div>
      </div>
    </div>
    <textarea class="grade-notes" id="notes-${idx}" placeholder="Teacher notes / feedback...">${sub.teacherNotes||""}</textarea>
    <div class="grade-action-row">
      <button class="btn-save-grade" onclick="saveGrade(${idx})">💾 Save Grade</button>
      <button class="btn-print-result" onclick="printGrade(${idx})">🖨 Print / Download Result</button>
      ${sub.status==="graded"?`<span class="saved-label">✅ Saved · Grand Total: <strong>${sub.totalGrade}/100</strong></span>`:""}
    </div>
  </div>`;
}

function downloadSubmittedFile(idx,type){
  const subs=JSON.parse(localStorage.getItem("jm_submissions")||"[]");
  const sub=subs[idx]; if(!sub) return;
  const fd=type==="word"?sub.wordFile:sub.excelFile;
  if(!fd){alert("No file found.");return;}
  const byteStr=atob(fd.data), ab=new ArrayBuffer(byteStr.length), ia=new Uint8Array(ab);
  for(let i=0;i<byteStr.length;i++) ia[i]=byteStr.charCodeAt(i);
  const mime=type==="word"
    ?"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    :"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const blob=new Blob([ab],{type:mime}), url=URL.createObjectURL(blob), a=document.createElement("a");
  a.href=url; a.download=fd.name; a.click(); URL.revokeObjectURL(url);
}

function saveGrade(idx){
  const subs=JSON.parse(localStorage.getItem("jm_submissions")||"[]");
  const sub=subs[idx]; if(!sub) return;
  const wG=parseInt(document.getElementById(`word-grade-${idx}`).value);
  const eG=parseInt(document.getElementById(`excel-grade-${idx}`).value);
  if(isNaN(wG)||wG<0||wG>35||isNaN(eG)||eG<0||eG>35){
    showToast("⚠ Word: 0–35, Excel: 0–35","warn"); return;
  }
  sub.wordGrade=wG; sub.excelGrade=eG;
  sub.totalGrade=sub.mcqScore+wG+eG;
  sub.teacherNotes=document.getElementById(`notes-${idx}`).value;
  sub.status="graded"; subs[idx]=sub;
  localStorage.setItem("jm_submissions",JSON.stringify(subs));
  showToast(`✅ Graded: ${sub.studentName} — ${sub.totalGrade}/100`,"success");
  renderSubmissions();
}

function printGrade(idx){
  const subs=JSON.parse(localStorage.getItem("jm_submissions")||"[]");
  const sub=subs[idx]; if(!sub){alert("No data.");return;}
  const wG=parseInt(document.getElementById(`word-grade-${idx}`)?.value??sub.wordGrade)|| sub.wordGrade||0;
  const eG=parseInt(document.getElementById(`excel-grade-${idx}`)?.value??sub.excelGrade)||sub.excelGrade||0;
  const total=sub.mcqScore+wG+eG;
  const L=["A","B","C","D"];
  let mcqRows="";
  sub.mcqDetails.forEach(q=>{
    const ga=q.studentIdx!=null?L[q.studentIdx]:"—";
    mcqRows+=`<tr class="${q.correct?"row-correct":"row-wrong"}">
      <td>${q.num}</td><td>${q.section}</td><td>${q.question}</td>
      <td><strong>${ga}</strong></td><td>${L[q.correctIdx]}</td>
      <td class="${q.correct?"status-correct":"status-wrong"}">${q.correct?"✓ Correct":"✗ Wrong"}</td>
    </tr>`;
  });
  const html=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>Result — ${sub.studentName}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;color:#1a1a2e}
.page{max-width:900px;margin:32px auto;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.12);overflow:hidden}
.header{background:linear-gradient(135deg,#1a3e6f,#0d1f3c);color:#fff;padding:36px 40px;text-align:center}
.logo{display:inline-block;background:linear-gradient(135deg,#3b8bff,#a78bfa);border-radius:12px;padding:8px 18px;font-size:20px;font-weight:800;margin-bottom:16px}
h1{font-size:28px;font-weight:800;margin-bottom:6px}.header p{opacity:.7;font-size:13px}
.mg{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #e2e8f0}
.mi{padding:20px 24px;border-right:1px solid #e2e8f0}.mi:last-child{border-right:none}
.ml{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:4px}
.mv{font-size:18px;font-weight:700;color:#1a3e6f}
.sec{padding:28px 40px;border-bottom:1px solid #e2e8f0}
.st{font-size:16px;font-weight:700;color:#1a3e6f;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #e2e8f0}
table{width:100%;border-collapse:collapse;font-size:13px}
th{background:#f1f5f9;padding:10px 12px;text-align:left;font-weight:600;color:#475569;border-bottom:2px solid #e2e8f0}
td{padding:10px 12px;border-bottom:1px solid #f1f5f9;vertical-align:top;line-height:1.5}
.row-correct td{background:#f0fdf4}.row-wrong td{background:#fef2f2}
.status-correct{color:#16a34a;font-weight:700}.status-wrong{color:#dc2626;font-weight:700}
.sb{background:linear-gradient(135deg,#eff6ff,#f5f3ff);border:2px solid #bfdbfe;border-radius:14px;padding:24px;text-align:center}
.sbig{font-size:52px;font-weight:800;color:#1a3e6f;line-height:1}
.notes-box{background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:16px;font-size:14px;line-height:1.6;color:#78350f;margin-top:12px}
.footer{background:#f8fafc;padding:20px 40px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0}
@media print{body{background:white}.page{box-shadow:none;margin:0;border-radius:0}}
</style></head><body>
<div class="page">
  <div class="header"><div class="logo">JM</div><h1>IT Mock Examination Result</h1><p>JiniMaestro · Information Technology</p></div>
  <div class="mg">
    <div class="mi"><div class="ml">Student</div><div class="mv">${sub.studentName}</div></div>
    <div class="mi"><div class="ml">Date & Time</div><div class="mv" style="font-size:14px">${sub.dateStr} at ${sub.timeStr}</div></div>
    <div class="mi"><div class="ml">Grand Total</div><div class="mv" style="color:#22c55e">${total} / 100</div></div>
  </div>
  <div class="sec"><div class="st">Score Summary</div>
    <div class="sb"><div class="sbig">${total}<span style="font-size:24px;color:#94a3b8"> / 100</span></div></div>
    <table style="margin-top:16px">
      <thead><tr><th>Section</th><th>Max Marks</th><th>Obtained</th></tr></thead>
      <tbody>
        <tr><td>Section A — MCQs (Auto-Graded)</td><td>30</td><td style="color:#16a34a;font-weight:700">${sub.mcqScore}</td></tr>
        <tr><td>Section B — MS Word Practical</td><td>35</td><td>${wG}</td></tr>
        <tr><td>Section C — MS Excel Practical</td><td>35</td><td>${eG}</td></tr>
        <tr style="background:#f1f5f9;font-weight:700"><td>GRAND TOTAL</td><td>100</td><td style="color:#16a34a">${total}</td></tr>
      </tbody>
    </table>
    ${sub.teacherNotes?`<div class="notes-box">📝 <strong>Teacher Notes:</strong> ${sub.teacherNotes}</div>`:""}
  </div>
  <div class="sec"><div class="st">MCQ Answers Review</div>
    <table>
      <thead><tr><th>#</th><th>Section</th><th>Question</th><th>Given</th><th>Correct</th><th>Status</th></tr></thead>
      <tbody>${mcqRows}</tbody>
    </table>
  </div>
  <div class="footer">Generated by JiniMaestro IT Exam Portal · ${sub.dateStr} · Student: ${sub.studentName}</div>
</div>
<script>window.onload=()=>setTimeout(()=>window.print(),400);<\/script>
</body></html>`;
  const blob=new Blob([html],{type:"text/html"}),url=URL.createObjectURL(blob);
  window.open(url,"_blank");
  setTimeout(()=>URL.revokeObjectURL(url),15000);
}

// ── TOAST ─────────────────────────────────────────
function showToast(msg,type="info"){
  const t=document.createElement("div");
  t.className=`jm-toast toast-${type}`; t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add("toast-show"),10);
  setTimeout(()=>{t.classList.remove("toast-show");setTimeout(()=>t.remove(),400);},3000);
}

// ── ENTER KEY ─────────────────────────────────────
document.getElementById("student-name").addEventListener("keydown",e=>{ if(e.key==="Enter") startExam(); });

// ── CLEAR ALL DATA ────────────────────────────────
function clearAllData(){
  if(!confirm("⚠ Delete ALL submission data? This cannot be undone.")) return;
  localStorage.removeItem("jm_submissions");
  localStorage.removeItem("jm_completed_students");
  showToast("All exam data cleared","warn");
  renderSubmissions(); renderStudentManager();
}
