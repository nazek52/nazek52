import fs from 'node:fs/promises';
import sharp from 'sharp';

const W = 960, H = 320, FRAMES = 80, DELAY = 100;
const source = process.argv[2];
if (!source) throw new Error('Pass the generated source PNG path.');
await fs.mkdir('assets/source', { recursive: true });
await fs.mkdir('preview', { recursive: true });
await fs.copyFile(source, 'assets/source/ai-atelier.png');
const base = await sharp(source).resize(W, H, { fit: 'fill' }).ensureAlpha().raw().toBuffer();
const frames = [];
const stars = [[.30,.14], [.38,.27], [.44,.13], [.52,.20], [.59,.09], [.65,.32], [.72,.18], [.78,.24], [.82,.06], [.91,.29]];
const nodes = [[.245,.598], [.264,.578], [.293,.621], [.318,.616], [.340,.594]];
function blend(buf,x,y,colour,alpha) {
  x=Math.round(x); y=Math.round(y);
  if(x<0||x>=W||y<0||y>=H)return;
  const o=(y*W+x)*4;
  for(let c=0;c<3;c++)buf[o+c]=Math.round(buf[o+c]*(1-alpha)+colour[c]*alpha);
}
function pixelGlow(buf,x,y,colour,power,size=2){
  for(let dy=-size*2;dy<=size*2;dy++)for(let dx=-size*2;dx<=size*2;dx++){
    const d=Math.max(Math.abs(dx),Math.abs(dy));
    const a=d<=size?power:power*.20*(1-d/(size*2+1));
    blend(buf,x+dx,y+dy,colour,a);
  }
}
for(let f=0;f<FRAMES;f++){
  const out=Buffer.from(base), phase=f/FRAMES;
  stars.forEach(([x,y],i)=>{
    const a=Math.pow((Math.sin(phase*Math.PI*2+i*1.91)+1)/2,4)*.76;
    pixelGlow(out,x*W,y*H,[220,204,255],a,1);
  });
  const t=phase*(nodes.length-1),k=Math.floor(t),r=t-k;
  const [x0,y0]=nodes[k],[x1,y1]=nodes[Math.min(k+1,nodes.length-1)];
  const envelope=Math.sin(Math.PI*phase)**2;
  pixelGlow(out,(x0+(x1-x0)*r)*W,(y0+(y1-y0)*r)*H,[128,255,236],.85*envelope,2);
  if(phase>.12&&phase<.25){
    const p=(phase-.12)/.13;
    for(let s=0;s<16;s++)blend(out,W*(.61+.12*p)-s,H*(.10+.12*p)-s*.26,[216,212,255],Math.sin(Math.PI*p)*.8*(1-s/16));
  }
  frames.push(out);
}
await sharp(base,{raw:{width:W,height:H,channels:4}}).webp({quality:90}).toFile('assets/ai-atelier-static.webp');
await sharp(Buffer.concat(frames),{raw:{width:W,height:H*FRAMES,channels:4,pageHeight:H}})
  .webp({quality:82,effort:4,loop:0,delay:DELAY}).toFile('assets/ai-atelier.webp');
for(const frame of [0,20,40])await sharp(frames[frame],{raw:{width:W,height:H,channels:4}}).png().toFile(`preview/banner-${frame}.png`);
const metadata=await sharp('assets/ai-atelier.webp',{animated:true}).metadata();
if(metadata.pages<2||metadata.loop!==0)throw new Error('Expected a looping animated banner.');
if(frames[0].equals(frames[20]))throw new Error('Animation frames must differ.');
console.log(JSON.stringify({width:metadata.width,frameHeight:metadata.pageHeight,frames:metadata.pages,loop:metadata.loop,bytes:(await fs.stat('assets/ai-atelier.webp')).size}));
