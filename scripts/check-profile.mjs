import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=process.cwd();
const readme=await fs.readFile('README.md','utf8');
const references=[...readme.matchAll(/(?:src|srcset)="([^"]+)"/g)].map(m=>m[1]);
assert(references.length>0,'README must include its artwork.');
for(const ref of references){
  assert(!/^(?:https?:|data:|\/\/)/.test(ref),`Artwork should be repository-local: ${ref}`);
  const target=path.resolve(root,ref);
  assert(target.startsWith(root+path.sep),`Artwork path leaves the repository: ${ref}`);
  assert((await fs.stat(target)).isFile(),`Missing artwork: ${ref}`);
}
for(const image of readme.matchAll(/<img\b[^>]*>/g))assert(/\balt="[^"]+"/.test(image[0]),'Every image needs alternative text.');
const anchors=new Set([...readme.matchAll(/^#{1,6} (.+)$/gm)].map(m=>m[1].toLowerCase().replace(/[^\w -]/g,'').replaceAll(' ','-')));
for(const anchor of readme.matchAll(/href="#([^"]+)"/g))assert(anchors.has(anchor[1]),`Missing section: ${anchor[1]}`);

const calendar=JSON.parse(await fs.readFile('assets/activity/data.json','utf8'));
assert.equal(calendar.username,'nazek52');
assert.equal(calendar.days.length,182,'Calendar must include 26 complete weeks.');
assert.equal(calendar.days[0].date,calendar.start);
assert.equal(calendar.days.at(-1).date,calendar.end);
assert.equal(new Date(calendar.start+'T00:00:00Z').getUTCDay(),0,'Calendar starts on Sunday.');
assert.equal(new Date(calendar.end+'T00:00:00Z').getUTCDay(),6,'Calendar ends on Saturday.');
for(let i=0;i<calendar.days.length;i++){
  const day=calendar.days[i];
  assert(Number.isInteger(day.count)&&day.count>=0,`Invalid contribution count: ${day.date}`);
  assert(Number.isInteger(day.level)&&day.level>=0&&day.level<=4,`Invalid activity level: ${day.date}`);
  if(i)assert.equal(Date.parse(day.date)-Date.parse(calendar.days[i-1].date),86400000,'Calendar dates must be contiguous.');
}
assert.equal(calendar.total,calendar.days.reduce((sum,day)=>sum+day.count,0));
assert.equal(calendar.activeDays,calendar.days.filter(day=>day.count>0).length);
const evidence=JSON.parse(await fs.readFile('assets/contributions.json','utf8'));
const seen=new Set();
for(const pr of evidence.pullRequests){
  assert.equal(pr.author,'nazek52');
  assert.equal(pr.merged,true);
  assert(pr.mergedAt&&Number.isFinite(Date.parse(pr.mergedAt)),'Merged contributions need a timestamp.');
  assert.equal(pr.url,`https://github.com/${pr.repository}/pull/${pr.number}`);
  assert(!seen.has(pr.url),'Duplicate selected contribution.');
  seen.add(pr.url);
  assert(readme.includes(pr.url),`Selected contribution missing from README: ${pr.url}`);
}
console.log(`Profile checks passed: ${references.length} asset references, ${calendar.days.length} calendar days, ${seen.size} selected merged PRs.`);
