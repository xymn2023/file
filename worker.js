/**
 * 永久直链托管 v5 - 最终稳定版
 */

export default {
  async fetch(request, env) {
    var u = new URL(request.url);
    var p = u.pathname;
    if (request.method === 'OPTIONS') return new Response(null, { headers: cr() });
    if (p === '/status') return st(env, u);
    if (p === '/upload' && request.method === 'POST') return up(request, env, u);
    if (p.startsWith('/f/') && p.length > 3) return fl(p.slice(3), request, env);
    if (p === '/shorten' && request.method === 'GET') return sh(env, u);
    if (p.startsWith('/s/') && p.length > 3) return sr(p.slice(3), env, u);
    if (p === '/' || p === '/index.html') return pg(u.origin);
    return new Response('404', { status: 404 });
  }
};

function pg(origin) {
  // 用单引号构建HTML，JS内部全部用双引号
  var s = '';
  s += '<!doctype html><html lang="zh-CN"><head>';
  s += '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
  s += '<link rel="icon" href="https://cloudflare.panell.top/file/1752564523144_head.png.png">';
  s += '<title>直链托管</title>';
  s += '<style>';

  s += '*{margin:0;padding:0;box-sizing:border-box}';
  s += 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0a0f1e url(https://cloudflare.panell.top/file/1752564522249_dayimg.jpg) center/cover no-repeat fixed;color:#e2e8f0;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}';

  s += '.w{width:100%;max-width:500px;padding:36px;border-radius:20px;background:rgba(10,15,30,.75);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.06)}';
  s += '.hd{text-align:center;margin-bottom:30px}';
  s += '.lg{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#3b82f6,#06b6d4);font-size:26px;margin-bottom:14px;box-shadow:0 8px 24px rgba(59,130,246,.25)}';
  s += 'h1{font-size:23px;font-weight:700;color:#f1f5f9;margin-bottom:6px}';
  s += '.sb{color:#64748b;font-size:14px;line-height:1.6}';

  s += '.bx{border:2px dashed #1e293b;border-radius:18px;padding:46px 26px;text-align:center;cursor:pointer;transition:all .22s ease;background:#080d1a}';
  s += '.bx:hover{border-color:#3b82f6;background:#0c1326}';
  s += '.bx.on{border-color:#3b82f6;background:rgba(59,130,246,.08);transform:scale(1.008)}';
  s += '.ic{font-size:42px;margin-bottom:14px}';
  s += '.tx{color:#94a3b8;font-size:14.5px;line-height:1.8}';
  s += '.tx b{color:#e2e8f0;font-weight:600}';
  s += '.ht{color:#475569;font-size:12.5px;margin-top:12px}';
  s += '#fi{display:none}';

  s += '#pg{display:none;margin-top:26px;text-align:center}';
  s += '#pg span{font-size:18px;color:#3b82f6;font-weight:bold}';

  s += '#rs{display:none;margin-top:28px}';
  s += '#rs label{display:block;color:#94a3b8;font-size:13px;margin-bottom:9px}';
  s += '.rw{display:flex;gap:8px}';
  s += '.ri{flex:1;background:#080d1a;border:1px solid #1e293b;border-radius:10px;padding:14px 16px;color:#e2e8f0;font-size:14px;outline:none;font-family:inherit;line-height:1.4}';
  s += '.ri:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}';

  s += '.bt{padding:11px 20px;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .18s ease}';
  s += '.bt:active{transform:scale(.97)}';
  s += '.bp{background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;box-shadow:0 3px 10px rgba(59,130,246,.28)}';
  s += '.bp:hover{background:linear-gradient(135deg,#2563eb,#1d4ed8);box-shadow:0 5px 16px rgba(59,130,246,.38)}';
  s += '.bo{background:transparent;color:#94a3b8;border:1px solid #334155}';
  s += '.bo:hover{background:#1e293b;color:#e2e8f0;border-color:#475569}';
  s += '.bs{background:linear-gradient(135deg,#10b981,#059669);color:#fff;box-shadow:0 3px 10px rgba(16,185,129,.22)}';
  s += '.bs:hover{background:linear-gradient(135deg,#059669,#047857)}';
  s += '.bl{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}';

  s += '#okmsg{display:none;color:#10b981;font-weight:bold;margin-top:14px;font-size:14px;padding:10px 14px;background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.15);border-radius:9px}';

  s += '#srw{display:none;margin-top:16px}';
  s += '#srw label{color:#10b981!important}';

  s += '.ft{text-align:center;margin-top:30px;font-size:12px;color:#1e293b;line-height:1.8}';

  s += '</style></head><body>';

  // ---- BODY ----
  s += '<div class="w">';

  s += '<div class="hd">';
  s += '<img src="https://cloudflare.panell.top/file/1769138559457_photo_2024-04-05_13-54-41.jpg" alt="logo" style="width:52px;height:52px;border-radius:16px;box-shadow:0 8px 24px rgba(59,130,246,.25);margin-bottom:14px;display:inline-block;object-fit:cover">';
  s += '<h1>直链托管</h1>';
  s += '<p class="sb">永久免费 · 全球CDN加速</p>';
  s += '</div>';

  s += '<div class="bx" id="bx">';
  s += '<div class="ic">☁️</div>';
  s += '<div class="tx"><b>点击选择文件</b> 或拖拽到此处<br>支持图片、视频、文档、m3u、json等任意格式</div>';
  s += '<div class="ht">最大 25MB · 支持Ctrl+V粘贴</div>';
  s += '<input type="file" id="fi">';
  s += '</div>';

  s += '<div id="pg"><span id="pct">0%</span> 上传中...</div>';

  s += '<div id="rs">';
  s += '<label>🔗 文件直链</label>';
  s += '<div class="rw">';
  s += '<input type="text" class="ri" id="urlInp" readonly spellcheck="false">';
  s += '<button class="bt bp" id="cpBtn">复制</button>';
  s += '</div>';
  s += '<div id="okmsg"></div>';
  s += '<div class="bl">';
  s += '<button class="bt bp" id="opBtn">打开链接</button>';
  s += '<button class="bt bo" id="dlBtn">下载</button>';
  s += '<button class="bt bo" id="shBtn">生成短链</button>';
  s += '<button class="bt bs" id="agBtn">继续上传</button>';
  s += '</div>';

  s += '<div id="srw">';
  s += '<label>🔗 短链接</label>';
  s += '<div class="rw">';
  s += '<input type="text" class="ri" id="siInp" readonly spellcheck="false">';
  s += '<button class="bt bp" id="csBtn">复制短链</button>';
  s += '</div>';
  s += '</div>'; // srw

  s += '</div>'; // rs

  s += '<div class="ft">基于 Cloudflare Workers + R2 · 永久免费</div>';
  s += '</div>'; // w

  // ---- SCRIPT ----
  s += '<script>';
  s += '(function(){';
  s += 'var O="' + origin + '";';
  s += 'var ck="";';
  s += 'var bx=document.getElementById("bx");';
  s += 'var fi=document.getElementById("fi");';
  s += 'var pg=document.getElementById("pg");';
  s += 'var pct=document.getElementById("pct");';
  s += 'var rs=document.getElementById("rs");';
  s += 'var urlInp=document.getElementById("urlInp");';
  s += 'var okmsg=document.getElementById("okmsg");';
  s += 'var srw=document.getElementById("srw");';
  s += 'var siInp=document.getElementById("siInp");';

  s += 'bx.onclick=function(){fi.click();};';
  s += 'fi.onchange=function(e){if(e.target.files&&e.target.files[0])goUp(e.target.files[0]);};';

  s += 'bx.ondragenter=function(e){e.preventDefault();bx.className="bx on";};';
  s += 'bx.ondragover=function(e){e.preventDefault();bx.className="bx on";};';
  s += 'bx.ondragleave=function(e){e.preventDefault();bx.className="bx";};';
  s += 'bx.ondrop=function(e){e.preventDefault();bx.className="bx";if(e.dataTransfer.files&&e.dataTransfer.files[0])goUp(e.dataTransfer.files[0]);};';

  s += 'document.onpaste=function(e){';
  s += 'var its=e.clipboardData&&e.clipboardData.items;';
  s += 'if(!its)return;';
  s += 'for(var i=0;i<its.length;i++){if(its[i].kind==="file"){goUp(its[i].getAsFile());break;}}';
  s += '};';

  s += 'function goUp(f){';
  s += 'bx.style.display="none";';
  s += 'pg.style.display="block";';
  s += 'rs.style.display="none";';
  s += 'srw.style.display="none";';
  s += 'okmsg.style.display="none";';
  s += 'pct.textContent="0%";';
  s += 'var fd=new FormData();';
  s += 'fd.append("file",f);';
  s += 'var xhr=new XMLHttpRequest();';
  s += 'xhr.upload.onprogress=function(ev){if(ev.lengthComputable)pct.textContent=Math.round(ev.loaded/ev.total*100)+"%";};';
  s += 'xhr.onload=function(){try{var r=JSON.parse(xhr.responseText);if(r.error){alert(r.error);rst();return;}ck=r.key;urlInp.value=O+"/f/"+r.key;okmsg.textContent=f.name+" ("+fmtS(r.size)+")";okmsg.style.display="block";pg.style.display="none";rs.style.display="block";}catch(x){alert("响应错误");rst();}};';
  s += 'xhr.onerror=function(){alert("网络错误");rst();};';
  s += 'xhr.open("POST",O+"/upload");';
  s += 'xhr.send(fd);}';

  s += 'function rst(){bx.style.display="";pg.style.display="none";rs.style.display="none";}';
  s += 'function fmtS(b){if(b<1024)return b+"B";if(b<1048576)return(b/1024).toFixed(1)+"KB";return(b/1048576).toFixed(1)+"MB";}';

  s += 'document.getElementById("cpBtn").onclick=function(){cT(urlInp.value);alert("已复制!");};';
  s += 'document.getElementById("opBtn").onclick=function(){window.open(urlInp.value,"_blank");};';
  s += 'document.getElementById("dlBtn").onclick=function(){window.open(O+"/f/"+ck+"?download=1","_blank");};';
  s += 'document.getElementById("agBtn").onclick=rst;';
  s += 'document.getElementById("shBtn").onclick=function(){fetch(O+"/shorten?key="+ck).then(function(x){return x.json();}).then(function(d){if(d.error)throw d.error;siInp.value=d.shortUrl;srw.style.display="block";}).catch(function(e){alert(""+e);});};';
  s += 'document.getElementById("csBtn").onclick=function(){cT(siInp.value);alert("已复制!");};';

  s += 'function cT(t){try{navigator.clipboard.writeText(t);}catch(ex){var ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();}}';

  s += 'console.log("[FH] OK");';
  s += '})();';
  s += '<\/script></body></html>';

  return new Response(s, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', ...cr() }
  });
}

function st(env, u) {
  return Response.json({
    status: env.FILE_BUCKET ? 'ok' : 'error',
    r2: !!env.FILE_BUCKET,
    origin: u.origin
  }, { headers: cr() });
}

async function up(req, env, u) {
  try {
    var ct = req.headers.get('content-type') || '';
    if (!ct.includes('multipart/form-data')) return j({ error: '需要multipart' }, 400);
    var form = await req.formData();
    var file = form.get('file');
    if (!file) return j({ error: '无文件' }, 400);
    var key = gK(file.name);
    var buf = await file.arrayBuffer();
    if (!env.FILE_BUCKET) return j({ error: '未绑定R2' }, 500);
    await env.FILE_BUCKET.put(key, buf, {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
      customMetadata: { originalName: file.name }
    });
    return j({ success: true, key: key, name: file.name, size: buf.byteLength, url: u.origin + '/f/' + key });
  } catch (err) {
    console.error('UP:', err);
    return j({ error: '' + err.message }, 500);
  }
}

async function fl(key, req, env) {
  try {
    if (!env.FILE_BUCKET) return j({ error: '无存储' }, 500);
    var obj = await env.FILE_BUCKET.get(key);
    if (!obj) return new Response('404', { status: 404 });
    var dl = new URL(req.url).searchParams.get('download') !== null;
    var fn = (obj.customMetadata && obj.customMetadata.originalName) || key;
    var mt = (obj.httpMetadata && obj.httpMetadata.contentType) || 'application/octet-stream';
    var h = { 'content-type': mt, 'cache-control': 'public,max-age=31536000', 'access-control-allow-origin': '*' };
    h['content-disposition'] = (dl ? 'attachment' : 'inline') + '; filename="' + encodeURIComponent(fn) + '"';
    return new Response(obj.body, { status: 200, headers: h });
  } catch (err) {
    return j({ error: '' + err.message }, 500);
  }
}

async function sh(env, u) {
  try {
    var k = u.searchParams.get('key');
    if (!k) return j({ error: '缺key' }, 400);
    var code = rC(6);
    var lu = u.origin + '/f/' + k;
    var su = u.origin + '/s/' + code;
    if (env.FILE_BUCKET) {
      var mo = await env.FILE_BUCKET.get('__sm__');
      var md = {};
      if (mo && mo.body) { try { md = JSON.parse(await mo.text()); } catch(e) { md = {}; } }
      md[code] = { k: k, u: lu };
      await env.FILE_BUCKET.put('__sm__', JSON.stringify(md), { httpMetadata: { contentType: 'application/json' } });
    }
    return j({ shortUrl: su, shortCode: code, longUrl: lu });
  } catch (err) {
    return j({ error: '' + err.message }, 500);
  }
}

async function sr(code, env, u) {
  if (!env.FILE_BUCKET) return new Response('无存储', { status: 500 });
  try {
    var mo = await env.FILE_BUCKET.get('__sm__');
    if (!mo || !mo.body) return new Response('不存在', { status: 404 });
    var md; try { md = JSON.parse(await mo.text()); } catch(e) { return new Response('损坏', { status: 404 }); }
    var item = md[code];
    if (!item) return new Response('过期', { status: 404 });
    return Response.redirect(item.u || (u.origin + '/f/' + item.k), 302);
  } catch (err) {
    return j({ error: '' + err.message }, 500 );
  }
}

function gK(name) {
  var t = Date.now().toString(36);
  var r = crypto.randomUUID().replace(/-/g,'').slice(0,8);
  var e = name.indexOf('.') !== -1 ? '.' + name.split('.').pop() : '';
  return (t + '_' + r + e).toLowerCase();
}
function rC(len) {
  var c = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = ''; var arr = crypto.getRandomValues(new Uint8Array(len));
  for (var i = 0; i < len; i++) code += c[arr[i] % c.length];
  return code;
}
function j(d, st) { return Response.json(d, { status: st, headers: cr() }); }
function cr() {
  return { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': '*' };
}
