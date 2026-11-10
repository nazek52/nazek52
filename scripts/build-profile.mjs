import fs from 'node:fs/promises';

const args=process.argv.slice(2);
const fixed=args.find(x=>x.startsWith('--as-of='))?.split('=')[1];
const asOf=fixed || new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Qyzylorda',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
if(!/^\d{4}-\d{2}-\d{2}$/.test(asOf))throw new Error('Expected an ISO date.');
const DAY=86400000;
const today=new Date(asOf+'T00:00:00Z');
const weekStart=new Date(+today-today.getUTCDay()*DAY);
const start=new Date(+weekStart-182*DAY), end=new Date(+weekStart-DAY);
const iso=d=>d.toISOString().slice(0,10);
const attrs=s=>Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
const found=new Map();
for(let year=start.getUTCFullYear();year<=end.getUTCFullYear();year++){
  const url=`https://github.com/users/nazek52/contributions?from=${year}-01-01&to=${year}-12-31`;
  const res=await fetch(url,{headers:{'User-Agent':'nazek52-profile-art','Accept':'text/html'},signal:AbortSignal.timeout(30000)});
  if(!res.ok)throw new Error(`Calendar request failed: ${res.status}`);
  const html=await res.text();
  const tips=new Map([...html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)].map(m=>[attrs(m[1]).for,m[2].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()]));
  for(const m of html.matchAll(/<td\b([^>]*data-date="[^"]+"[^>]*)>/g)){
    const a=attrs(m[1]),date=a['data-date'];
    if(date<iso(start)||date>iso(end))continue;
    const tip=tips.get(a.id)||'';
    const countMatch=tip.match(/([\d,]+)\s+contributions?/i);
    const count=/No contributions/i.test(tip)?0:countMatch?Number(countMatch[1].replaceAll(',','')):NaN;
    const level=Number(a['data-level']);
    if(!Number.isInteger(count)||count<0||!Number.isInteger(level)||level<0||level>4)throw new Error(`Unrecognized calendar data for ${date}: ${tip}`);
    found.set(date,{date,count,level});
  }
}
const days=Array.from({length:182},(_,i)=>{
  const date=iso(new Date(+start+i*DAY)),d=found.get(date);
  if(!d)throw new Error('Missing contribution day: '+date);
  return d;
});
const total=days.reduce((s,d)=>s+d.count,0),active=days.filter(d=>d.count>0).length;
const weeks=Array.from({length:26},(_,w)=>days.slice(w*7,w*7+7).reduce((s,d)=>s+d.count,0));
const snapshot={username:'nazek52',asOf,start:iso(start),end:iso(end),scope:'Publicly visible GitHub profile calendar; 26 complete Sunday–Saturday weeks; current partial week excluded.',total,activeDays:active,days};
await fs.mkdir('assets/activity',{recursive:true});
await fs.writeFile('assets/activity/data.json',JSON.stringify(snapshot,null,2)+'\n');
const xml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const colors={dark:{bg:'#10151f',border:'#2d3547',text:'#edf0f8',muted:'#9ca9c2',cells:['#20283a','#4e456f','#7661a2','#a68ad4','#d5c2f4'],mint:'#7ce3ce'},light:{bg:'#faf8ff',border:'#ded7eb',text:'#272b43',muted:'#656b85',cells:['#e9e4f1','#d6c5ed','#b99ad8','#8e6bb7','#614083'],mint:'#228c7a'}};
function calendar(theme,mobile,motion){
 const c=colors[theme],W=mobile?360:840,H=mobile?274:344;
 const gx=mobile?51:100,gy=mobile?108:105,step=mobile?10.8:25,sz=mobile?8:18;
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc"><title id="title">GitHub activity: ${total} contributions over 26 complete weeks</title><desc id="desc">${active} active days, ${iso(start)} to ${iso(end)}. Snapshot ${asOf}. Counts from the publicly visible GitHub profile calendar.</desc><rect x="1" y="1" width="${W-2}" height="${H-2}" rx="18" fill="${c.bg}" stroke="${c.border}"/>`;
 const text=(x,y,size,fill,value,extra='')=>`<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" fill="${fill}" ${extra}>${xml(value)}</text>`;
 out+=text(mobile?20:28,mobile?29:36,mobile?19:23,c.text,'GitHub activity','font-weight="700"');
 out+=text(mobile?20:28,mobile?50:62,mobile?11:14,c.muted,`${iso(start)} → ${iso(end)}`);
 out+=text(mobile?20:W-28,mobile?73:36,mobile?13:16,c.text,`${total} contributions · ${active} active days`,mobile?'':'text-anchor="end"');
 if(!mobile)out+=text(W-28,62,13,c.muted,`Snapshot ${asOf}`,'text-anchor="end"');
 const months=new Set();
 for(let w=0;w<26;w++){
   const date=new Date(days[w*7].date+'T00:00:00Z'),key=date.getUTCMonth();
   if(!months.has(key)){months.add(key);out+=text(gx+w*step,gy-12,mobile?10:12,c.muted,date.toLocaleString('en-US',{month:'short',timeZone:'UTC'}));}
   for(let r=0;r<7;r++){
     const d=days[w*7+r],x=gx+w*step,y=gy+r*step;
     out+=`<rect x="${x}" y="${y}" width="${sz}" height="${sz}" rx="${mobile?2:4}" fill="${c.cells[d.level]}"><title>${d.date}: ${d.count} contributions</title></rect>`;
   }
 }
 for(const [row,label] of [[1,'Mon'],[3,'Wed'],[5,'Fri']])out+=text(gx-(mobile?9:14),gy+row*step+sz*.75,mobile?9:12,c.muted,label,'text-anchor="end"');
 const points=[];
 for(let w=0;w<26;w++)for(let i=0;i<7;i++){const r=w%2?6-i:i;points.push([gx+w*step+sz/2,gy+r*step+sz/2]);}
 const path=points.map((p,i)=>(i?'L':'M')+p.join(',')).join(' ');
 if(motion){
   for(let i=3;i>=0;i--)out+=`<circle r="${mobile?2:4}" fill="${c.mint}" opacity="${.9-i*.2}"><animateMotion path="${path}" dur="28s" begin="-${i*.12}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;${.9-i*.2};${.9-i*.2};0" keyTimes="0;.02;.97;1" dur="28s" repeatCount="indefinite"/></circle>`;
 }
 const sy=mobile?226:308,sh=mobile?26:33,sw=25*step,max=Math.max(1,...weeks);
 const line=weeks.map((v,w)=>`${w?'L':'M'}${gx+w*step+sz/2},${sy-v/max*sh}`).join(' ');
 out+=`<path d="${line}" stroke="${c.mint}" stroke-width="${mobile?1.5:2}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
 out+=text(mobile?20:28,mobile?248:330,mobile?10:12,c.muted,mobile?`Weekly totals · snapshot ${asOf}`:'Weekly contribution totals · source: publicly visible GitHub calendar');
 out+='</svg>\n';return out;
}
for(const theme of ['dark','light'])for(const mobile of [false,true])for(const motion of [false,true]){
 const name=`calendar-${theme}${mobile?'-mobile':''}${motion?'':'-static'}.svg`;
 await fs.writeFile('assets/activity/'+name,calendar(theme,mobile,motion));
}
function stack(theme,mobile){
 const c=colors[theme],W=mobile?360:840,H=mobile?370:232;
 const groups=[{label:'AI / ML',accent:'#b7a0e3',items:['Python · PyTorch · LoRA','Triton · scikit-learn','Evaluation · data quality']},{label:'SYSTEMS',accent:theme==='dark'?'#7ce3ce':'#228c7a',items:['FastAPI · PostgreSQL','Docker · GitHub Actions','Monitoring · reliability']},{label:'INTERFACES',accent:theme==='dark'?'#efb0cf':'#a1537a',items:['TypeScript · React','OpenTelemetry','pytest · Playwright']}];
 let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title"><title id="title">AI and ML: Python, PyTorch, LoRA, Triton, scikit-learn. Systems: FastAPI, PostgreSQL, Docker, GitHub Actions. Interfaces: TypeScript, React, OpenTelemetry. Testing: pytest, Playwright.</title>`;
 groups.forEach((g,i)=>{const x=mobile?1:1+i*282,y=mobile?1+i*124:1,w=mobile?358:274,h=mobile?116:230;
 s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${c.bg}" stroke="${c.border}"/><rect x="${x+20}" y="${y+22}" width="22" height="3" rx="1.5" fill="${g.accent}"/><text x="${x+52}" y="${y+28}" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="700" letter-spacing="1.4" fill="${g.accent}">${g.label}</text>`;
 g.items.forEach((t,j)=>s+=`<text x="${x+20}" y="${y+(mobile?54:80)+j*(mobile?23:42)}" font-family="Arial,Helvetica,sans-serif" font-size="${mobile?14:16}" fill="${c.text}">${xml(t)}</text>`);
 });return s+'</svg>\n';
}
for(const theme of ['dark','light'])for(const mobile of [false,true])await fs.writeFile(`assets/stack-${theme}${mobile?'-mobile':''}.svg`,stack(theme,mobile));
function focus(staticMode){return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="54" viewBox="0 0 720 54" role="img" aria-label="LLM fine-tuning, model evaluation, ML systems"><style>text{font:18px monospace;fill:#9d80d2}@media(prefers-color-scheme:dark){text{fill:#bba7e6}}</style>${staticMode?'<text x="360" y="34" text-anchor="middle">LLM fine-tuning · Evaluation · ML systems</text>':['LLM fine-tuning','Model evaluation','ML systems'].map((t,i)=>`<text x="360" y="34" text-anchor="middle" opacity="${i?0:1}">${t} _<animate attributeName="opacity" dur="12s" values="${i===0?'1;1;0;0;0;0;1':i===1?'0;0;1;1;0;0;0':'0;0;0;0;1;1;0'}" keyTimes="0;.28;.34;.61;.67;.95;1" repeatCount="indefinite"/></text>`).join('')}</svg>\n`;}
await fs.writeFile('assets/focus.svg',focus(false));
await fs.writeFile('assets/focus-static.svg',focus(true));
console.log(JSON.stringify({asOf,start:iso(start),end:iso(end),days:days.length,total,activeDays:active,generatedSvg:14}));
