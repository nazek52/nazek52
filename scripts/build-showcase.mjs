import fs from 'node:fs/promises';

// Small, dependency-free vector illustrations. Diagrams are conceptual, not measured results.
const projects = [
  {slug:'tuneproof',number:'01',title:'TuneProof',category:'LLM FINE-TUNING & EVALUATION',lines:['A LoRA experiment you can reproduce on a CPU.','Held-out evaluation. Leakage-aware splits. A control run.'],mobile:['CPU-runnable LoRA experiments.','Held-out evaluation, careful splits','and a zero-learning-rate control.'],stack:'Python / PyTorch / LoRA',kind:'lora'},
  {slug:'soup-kernel-lab',number:'02',title:'Soup Kernel Lab',category:'ML SYSTEMS & NUMERICAL CORRECTNESS',lines:['RMSNorm and cross-entropy kernels in Triton.','Value and gradient checks. GPU speed not yet measured.'],mobile:['Triton RMSNorm and cross-entropy.','Value and gradient checks.','GPU speed not yet measured.'],stack:'Python / PyTorch / Triton',kind:'kernel'},
  {slug:'drift-sentinel',number:'03',title:'Drift Sentinel',category:'MODEL EVALUATION & MONITORING',lines:['Follow model quality as the data changes.','Time-aware evaluation and delayed-label diagnostics.'],mobile:['Model monitoring on synthetic data.','Time-aware evaluation and','delayed-label drift diagnostics.'],stack:'Python / scikit-learn / MLOps',kind:'drift'},
];
const palettes={dark:{bg:'#111622',line:'#34364d',ink:'#eeeaf8',muted:'#a9abc2',accent:'#c1a1ee',mint:'#80daca',well:'#1b2334'},light:{bg:'#faf8ff',line:'#d8cfe6',ink:'#29243d',muted:'#655f7b',accent:'#7550a4',mint:'#217f72',well:'#eeebf6'}};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function visual(kind,c){
  if(kind==='lora'){
    let s='';
    for(let row=0;row<4;row++)for(let col=0;col<4;col++)s+=`<rect x="${12+col*15}" y="${17+row*15}" width="10" height="10" rx="2" fill="${c.accent}" opacity="${.25+(row+col)%4*.18}"/>`;
    s+=`<path d="M82 46h28m-7-7 7 7-7 7" fill="none" stroke="${c.mint}" stroke-width="2"/><rect x="126" y="13" width="48" height="67" rx="8" fill="${c.well}" stroke="${c.mint}"/>`;
    for(let i=0;i<3;i++)s+=`<path d="m137 ${28+i*16} 3 3 5-6m7 3h12" stroke="${c.mint}" stroke-width="2" fill="none"/>`;
    return s;
  }
  if(kind==='kernel'){
    let s='';
    for(let row=0;row<3;row++)for(let col=0;col<6;col++)s+=`<rect x="${11+col*27}" y="${14+row*23}" width="20" height="16" rx="3" fill="${row===1?c.mint:c.accent}" opacity="${row===1?.8:.3}"/>`;
    return s+`<path d="M12 93h154m-6-5 6 5-6 5" stroke="${c.mint}" stroke-width="2" fill="none"/>`;
  }
  return `<path d="M10 13v76h168M10 37h168M10 63h168" fill="none" stroke="${c.line}"/><path d="M13 73c22 0 20-18 39-17s23 10 41-2 33-24 80-24" fill="none" stroke="${c.accent}" stroke-width="3"/><path d="M13 73c22 0 20-18 39-17s23 10 41-2 33 15 80-36" fill="none" stroke="${c.mint}" stroke-width="3"/><path d="M112 12v79" stroke="${c.muted}" stroke-dasharray="3 5"/><circle cx="173" cy="18" r="4" fill="${c.mint}"/>`;
}
function card(p,theme,mobile){
 const c=palettes[theme],w=mobile?360:840,h=mobile?292:190;
 const t=(x,y,size,fill,s,extra='')=>`<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" ${extra}>${esc(s)}</text>`;
 let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${p.title}</title><desc id="desc">${esc(p.lines.join(' '))} The illustration is a conceptual diagram, not benchmark data.</desc><rect x="1" y="1" width="${w-2}" height="${h-2}" rx="16" fill="${c.bg}" stroke="${c.line}"/><path d="M24 23h30" stroke="${c.mint}" stroke-width="3"/>`;
 s+=t(mobile?63:68,27,mobile?9:10,c.accent,p.category,'letter-spacing="1.2" font-weight="700"');
 s+=t(24,mobile?66:67,mobile?28:32,c.ink,p.title,'font-weight="700"');
 const lines=mobile?p.mobile:p.lines;
 lines.forEach((line,i)=>s+=t(24,(mobile?94:100)+i*(mobile?20:23),mobile?13:15,c.muted,line));
 s+=t(24,mobile?275:165,mobile?11:12,c.mint,p.stack,'letter-spacing=".5"');
 s+=`<g transform="translate(${mobile?92:615} ${mobile?151:44}) scale(${mobile?.85:1})">${visual(p.kind,c)}</g>`;
 s+=t(w-24,mobile?275:165,11,c.muted,p.number,'text-anchor="end"');
 return s+'</svg>\n';
}
await fs.mkdir('assets/projects',{recursive:true});
for(const p of projects)for(const theme of Object.keys(palettes))for(const mobile of [false,true])await fs.writeFile(`assets/projects/${p.slug}-${theme}${mobile?'-mobile':''}.svg`,card(p,theme,mobile));
await fs.mkdir('assets/links',{recursive:true});
for(const [slug,label,w] of [['email','Email',108],['linkedin','LinkedIn',128],['achievements','Achievements',160]]){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="34" viewBox="0 0 ${w} 34" role="img" aria-label="${label}"><rect x=".5" y=".5" width="${w-1}" height="33" rx="17" fill="#201c32" stroke="#74608e"/><circle cx="18" cy="17" r="3" fill="#91dfcc"/><text x="30" y="21" font-family="Arial,Helvetica,sans-serif" font-size="12" fill="#e8def5">${label}</text><path d="M${w-20} 20l6-6m-6 0h6v6" fill="none" stroke="#bea5e0" stroke-width="1.2"/></svg>\n`;
 await fs.writeFile(`assets/links/${slug}.svg`,svg);
}
console.log('Built 12 responsive project cards and 3 navigation links.');
