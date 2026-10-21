const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{parseHTML}=require('linkedom');
const root=__dirname,D=JSON.parse(fs.readFileSync(root+'/data/course.json','utf8'));
const tick=()=>new Promise(r=>setTimeout(r,0));
async function boot({hash='#home',blocked=false,corrupt=false}={}){
 const {window}=parseHTML(fs.readFileSync(root+'/index.html','utf8')),document=window.document,stored=new Map();if(corrupt)stored.set('al-hayat-irshad-progress-v1','{bad');
 const localStorage={getItem(k){if(blocked)throw Error('blocked');return stored.get(k)||null},setItem(k,v){if(blocked)throw Error('blocked');stored.set(k,v)}};
 const loads=[];window.scrollTo=()=>{};window.innerWidth=1280;window.HTMLElement.prototype.scrollIntoView=function(){};window.HTMLElement.prototype.focus=function(){};
 Object.defineProperty(window.HTMLElement.prototype,'open',{configurable:true,get(){return this.hasAttribute('open')},set(v){this.toggleAttribute('open',v)}});
 const dialog=document.querySelector('dialog');dialog.showModal=function(){this.open=true};dialog.close=function(){this.open=false};
 let currentHash=hash;window.location={get hash(){return currentHash},set hash(v){currentHash=v;window.dispatchEvent(new window.Event('hashchange'))}};
 const context=vm.createContext({window,document,localStorage,console,setTimeout,clearTimeout,Map,Promise});
 const orig=document.head.appendChild.bind(document.head);document.head.appendChild=function(s){const out=orig(s);if(s.tagName==='SCRIPT'&&s.getAttribute('src')){const path=s.getAttribute('src');loads.push(path);queueMicrotask(()=>{try{vm.runInContext(fs.readFileSync(root+'/'+path,'utf8'),context);s.onload?.()}catch(e){s.onerror?.(e)}})}return out};
 for(const p of ['theme.js','data/catalogue.js','icons.js','app.js'])vm.runInContext(fs.readFileSync(root+'/'+p,'utf8'),context,{filename:p});await tick();
 const click=(sel)=>{const el=typeof sel==='string'?document.querySelector(sel):sel;assert.ok(el,'missing '+sel);el.dispatchEvent(new window.Event('click',{bubbles:true}));return el};
 const go=async h=>{window.location.hash=h;await tick()};
 return {window,document,stored,loads,click,go,localStorage};
}
(async()=>{
 const c=await boot();assert.equal(c.loads.length,0,'home must not load full lesson');assert.equal(c.document.querySelectorAll('.route-card').length,8);
 c.click('[data-word="2"]');assert.match(c.document.querySelector('#hero-explanation').textContent,/فاعل/);assert.match(c.document.querySelector('#hero-explanation').innerHTML,/lang="ar"/);
 c.click('#theme-toggle');assert.equal(c.document.documentElement.dataset.theme,'dark');assert.equal(c.stored.get('irshad-theme'),'dark');c.click('#size-toggle');assert.ok(c.document.body.classList.contains('large'));
 c.click('#about-button');assert.ok(c.document.querySelector('dialog').open);c.click('[data-close-dialog]');assert.ok(!c.document.querySelector('dialog').open);
 await c.go('#lessons');assert.equal(c.document.querySelectorAll('.lesson-card').length,51);const search=c.document.querySelector('#lesson-search');search.value='مفعول';search.dispatchEvent(new c.window.Event('input',{bubbles:true}));assert.ok(c.document.querySelectorAll('.lesson-card').length>0&&c.document.querySelectorAll('.lesson-card').length<51);search.value='';search.dispatchEvent(new c.window.Event('input',{bubbles:true}));
 c.click('[data-filter="tawabi"]');assert.equal(c.document.querySelectorAll('.lesson-card').length,5);
 let words=0,analyses=0,qa=0,mcqs=0,translations=0;
 for(const l of D.lessons){
  await c.go('#'+l.id+'/article');assert.equal(c.document.querySelectorAll('[role=tab]').length,8);assert.equal(c.document.querySelectorAll('.article-section').length,l.article.length);assert.equal(c.document.querySelectorAll('.article-section .arabic-reading[lang=ar]').length,l.article.length);assert.equal(c.document.querySelectorAll('.article-section .urdu-reading').length,l.article.length);[...c.document.querySelectorAll('.article-body>p')].forEach((p,i)=>assert.equal(p.textContent,l.article[i].text));
  await c.go('#'+l.id+'/grammar');assert.equal(c.document.querySelectorAll('.rule-card').length,l.rules.length);
  await c.go('#'+l.id+'/words');assert.equal(c.document.querySelectorAll('.word-card').length,l.vocabulary.length);words+=l.vocabulary.length;assert.ok([...c.document.querySelectorAll('.word-card h3')].every(e=>e.getAttribute('lang')==='ar'));assert.ok([...c.document.querySelectorAll('.word-card .icon-tile')].every(e=>e.querySelector('svg')));
  c.click('[data-known="0"]');assert.equal(c.document.querySelector('[data-known="0"]').getAttribute('aria-pressed'),'true');c.click('[data-recall]');assert.ok(c.document.querySelector('#word-grid').classList.contains('recall'));c.click('[data-reveal-word]');assert.ok(c.document.querySelector('.word-card.revealed'));c.click('[data-recall]');
  await c.go('#'+l.id+'/analysis');assert.equal(c.document.querySelectorAll('.construction').length,l.analyses.length);analyses+=l.analyses.length;assert.equal(c.document.querySelectorAll('.token').length,l.analyses.reduce((n,a)=>n+a.tokens.length,0));
  for(const mode of ['ar-ur','ur-ar']){await c.go('#'+l.id+'/'+mode);const rows=mode==='ar-ur'?l.arUr:l.urAr;assert.equal(c.document.querySelectorAll('.exercise').length,rows.length);translations+=rows.length;const ta=c.document.querySelector('textarea');ta.value='میرا تدریسی جواب';ta.dispatchEvent(new c.window.Event('input',{bubbles:true}));c.click('[data-model="0"]');assert.equal(c.document.querySelector('#model-0').hidden,false);c.click('[data-self]');assert.ok(c.document.querySelector('.self-check .active'));}
  await c.go('#'+l.id+'/qa');assert.equal(c.document.querySelectorAll('.qa-card').length,l.qa.length);qa+=l.qa.length;c.click('[data-expand-qa]');assert.ok([...c.document.querySelectorAll('.qa-card')].every(e=>e.open));
  await c.go('#'+l.id+'/mcqs');assert.equal(c.document.querySelectorAll('.quiz-card').length,l.mcqs.length);mcqs+=l.mcqs.length;
  for(let i=0;i<l.mcqs.length;i++){c.click(`[data-question="${i}"][data-choice="${l.mcqs[i].correct}"]`);assert.ok(c.document.querySelector('#quiz-'+i+' .correct'));assert.equal(c.document.querySelectorAll('#quiz-'+i+' button:disabled').length,4);assert.ok(c.document.querySelector('#quiz-'+i+' .quiz-feedback'));}
  c.click('[data-reset-quiz]');assert.equal(c.document.querySelectorAll('.quiz-feedback').length,0);
  assert.ok(!c.document.querySelector('#lesson-content').textContent.includes('undefined'));
 }
 const l=D.lessons[0];await c.go('#'+l.id+'/article');c.click('[data-finish-stage]');await tick();assert.equal(c.window.location.hash,'#'+l.id+'/grammar');
 await c.go('#'+l.id+'/ar-ur');assert.equal(c.document.querySelector('textarea').value,'میرا تدریسی جواب');
 assert.equal(new Set(c.loads).size,51);assert.equal(c.loads.length,51,'lesson cache must prevent repeat requests');
 const saved=JSON.parse(c.stored.get('al-hayat-irshad-progress-v1'));assert.equal(saved.stages[l.id+':article'],true);assert.equal(saved.words[l.id+':w0'],true);
 for(const mode of ['blocked','corrupt']){const b=await boot({[mode]:true});await b.go('#'+l.id+'/mcqs');b.click('[data-question="0"][data-choice="0"]');assert.ok(b.document.querySelector('.quiz-feedback'));assert.equal(b.document.querySelector('#storage-notice').hidden,mode!=='blocked')}
 // Actual reading color pairs, including both appearances.
 const css=fs.readFileSync(root+'/styles.css','utf8');const blocks=[css.match(/:root\{([^}]+)\}/)[1],css.match(/html\[data-theme=dark\]\{([^}]+)\}/)[1]];
 const rgb=h=>(h.length===4?h.slice(1).split('').map(x=>x+x).join(''):h.slice(1)).match(/../g).map(x=>parseInt(x,16)/255),lum=a=>a.map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 let min=99;for(const b of blocks){const v=Object.fromEntries([...b.matchAll(/--([\w-]+):([^;]+)/g)].map(x=>[x[1],x[2]]));for(const [f,g]of [['ink','surface'],['muted','surface'],['ar-ink','ar-bg'],['ur-ink','ur-bg'],['rule-ink','rule-bg'],['q-ink','q-bg'],['en-ink','en-bg']]){const a=lum(rgb(v[f])),z=lum(rgb(v[g])),r=(Math.max(a,z)+.05)/(Math.min(a,z)+.05);assert.ok(r>=4.5,f+' contrast '+r);min=Math.min(min,r)}}
 function hsl(h,s,l){h/=360;s/=100;l/=100;const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;const f=t=>{if(t<0)t++;if(t>1)t--;return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return[f(h+1/3),f(h),f(h-1/3)]}
 let minAccent=99;const hues=new Set();for(let i=1;i<=51;i++){const h=(i*137.508+168)%360;hues.add(h.toFixed(2));for(const [a,b]of [[hsl(h,65,20),hsl(h,55,95)],[hsl(h,65,83),hsl(h,28,19)]]){const x=lum(a),y=lum(b),r=(Math.max(x,y)+.05)/(Math.min(x,y)+.05);assert.ok(r>=7,'lesson accent '+r);minAccent=Math.min(minAccent,r)}}assert.equal(hues.size,51);
 console.log(JSON.stringify({lessons:51,tabsPerLesson:8,vocabularyCards:words,analyses,shortQA:qa,MCQs:mcqs,translationTasks:translations,allLessonRoutes:'PASS',quizFeedbackAndRetry:'PASS',answerDrafts:'PASS',progress:'PASS',theme:'PASS',blockedStorage:'PASS',sourceOrder:'PASS',onDemandLessonLoading:'PASS',homepageCatalogueBytes:fs.statSync(root+'/data/catalogue.js').size,minimumCheckedReadingContrast:+min.toFixed(2),distinctLessonPalettes:hues.size,minimumLessonAccentContrast:+minAccent.toFixed(2),visualBrowserQA:'Unavailable; DOM checks are not visual layout testing'}));
})().catch(e=>{console.error(e);process.exit(1)});
