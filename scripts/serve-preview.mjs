import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

const root=process.cwd();
const mime={'.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.json':'application/json','.md':'text/plain;charset=utf-8'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:4179');
  if(url.pathname==='/'){
   const content=await fs.readFile(path.join(root,'README.md'),'utf8');
   res.setHeader('Content-Type','text/html;charset=utf-8');
   res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nazerke · AI Engineer · profile preview</title><style>:root{color-scheme:light dark;--bg:#fff;--fg:#1f2328;--line:#d1d9e0;--link:#8250df}@media(prefers-color-scheme:dark){:root{--bg:#0d1117;--fg:#e6edf3;--line:#30363d;--link:#bba7e6}}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.65 Arial,Helvetica,sans-serif}main{max-width:920px;margin:28px auto;padding:30px 28px;border:1px solid var(--line);border-radius:8px}img{max-width:100%;vertical-align:middle}h1{font-size:30px;margin:22px 0 10px}h2{font-size:23px;border-bottom:1px solid var(--line);padding-bottom:8px;margin-top:32px}a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}p{margin:0 0 18px}sub{font-size:12px;vertical-align:baseline;opacity:.8}summary{cursor:pointer}details{margin:18px 0}hr{border:0;border-top:1px solid var(--line);margin:28px 0}@media(max-width:600px){main{border:0;margin:0;padding:18px 16px}body{font-size:14px}h1{font-size:26px}h2{font-size:21px}}</style></head><body><main>${marked(content)}</main></body></html>`);
   return;
  }
  if(!url.pathname.startsWith('/assets/')){res.writeHead(404);res.end();return;}
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  res.end(await fs.readFile(file));
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(4179,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4179'));
