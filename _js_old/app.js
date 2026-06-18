// ============================================================
// IT学習ポータル - App Logic v2
// Note: innerHTML uses only COURSES static data (no user input injection)
// ============================================================

const Cookie = {
  set(k,v,d=365){const e=new Date(Date.now()+d*864e5).toUTCString();document.cookie=`${k}=${encodeURIComponent(JSON.stringify(v))};expires=${e};path=/;SameSite=Lax`},
  get(k){const m=document.cookie.match(new RegExp('(?:^|; )'+k+'=([^;]*)'));if(!m)return null;try{return JSON.parse(decodeURIComponent(m[1]))}catch{return null}},
};

const UD = {
  _d:null,
  load(){this._d={fav:Cookie.get('itp_fav')||[],bk:Cookie.get('itp_bk')||[],prog:Cookie.get('itp_prog')||{}};Cookie.set('itp_lv',new Date().toISOString().slice(0,10));return this._d},
  save(){Cookie.set('itp_fav',this._d.fav);Cookie.set('itp_bk',this._d.bk);Cookie.set('itp_prog',this._d.prog)},
  get d(){return this._d||this.load()},
  togFav(id){const a=this.d.fav,i=a.indexOf(id);i<0?a.push(id):a.splice(i,1);this.save();return i<0},
  isFav(id){return this.d.fav.includes(id)},
  togBk(id){const a=this.d.bk,i=a.indexOf(id);i<0?a.push(id):a.splice(i,1);this.save();return i<0},
  isBk(id){return this.d.bk.includes(id)},
  setProg(id,s){this.d.prog[id]=s;this.save()},
  getProg(id){return this.d.prog[id]||'none'},
};

const F={q:'',cat:'all',lv:'all',tp:'all'};
let view='home';

function showView(v){
  view=v;
  document.querySelectorAll('.view').forEach(el=>el.classList.add('hidden'));
  const el=document.getElementById('view-'+v);if(el)el.classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const nav=document.querySelector(`.nav-item[data-view="${v}"]`);if(nav)nav.classList.add('active');
  if(v==='dashboard') renderDash();
  else if(v==='favorites') renderList('fav-grid',c=>UD.isFav(c.id));
  else if(v==='bookmarks') renderList('bookmark-grid',c=>UD.isBk(c.id));
  else applyFilters();
  // サイドバー閉じる (モバイル)
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ---- カード HTML ----
function cardHTML(c){
  const cat=CATEGORIES[c.category]||{label:c.category,icon:'fa-circle',color:'#64748b'};
  const lv=LEVELS[c.level]||{label:c.level,color:'#64748b'};
  const tp=TYPES[c.type]||{label:c.type,icon:'fa-circle',color:'#64748b'};
  const prog=UD.getProg(c.id);
  const fav=UD.isFav(c.id);
  const bk=UD.isBk(c.id);
  const tags=(c.tags||[]).slice(0,4).map(t=>`<span class="tag" data-tag="${t}">${t}</span>`).join('');
  const progDot=prog==='completed'?`<span class="prog-dot done" title="完了"><i class="fa-solid fa-circle-check"></i></span>`:prog==='in-progress'?`<span class="prog-dot wip" title="学習中"><i class="fa-solid fa-circle-half-stroke"></i></span>`:`<span class="prog-dot none" title="未着手"><i class="fa-regular fa-circle"></i></span>`;

  // トップビジュアル
  let topVisual='';
  if(c.type==='youtube'&&c.youtubeId){
    const thumbUrl=`https://img.youtube.com/vi/${c.youtubeId}/hqdefault.jpg`;
    topVisual=`
    <div class="card-thumb">
      <img src="${thumbUrl}" alt="${c.title}" loading="lazy" onerror="this.parentElement.classList.add('thumb-err');this.style.display='none'">
      <div class="thumb-overlay">
        <span class="thumb-duration">${c.duration||''}</span>
      </div>
      <div class="thumb-play"><i class="fa-brands fa-youtube"></i></div>
      <div class="thumb-yt-badge"><i class="fa-brands fa-youtube"></i> YouTube</div>
    </div>`;
  } else {
    const grad=`linear-gradient(135deg,${cat.color}22,${cat.color}44)`;
    topVisual=`
    <div class="card-banner" style="background:${grad}">
      <div class="banner-icon" style="background:${cat.color}"><i class="fa-solid ${cat.icon}"></i></div>
      <div class="banner-text">
        <div class="banner-cat">${cat.label}</div>
        <div class="banner-type"><i class="${tp.icon}"></i> ${tp.label}</div>
      </div>
    </div>`;
  }

  const metaHTML=c.author?`<span><i class="fa-solid fa-pen-nib"></i>${c.author}</span>`:`<span><i class="fa-solid fa-tv"></i>${c.channel||''}</span>`;

  return `
<div class="card${prog==='completed'?' opacity-75':''}" data-id="${c.id}">
  ${topVisual}
  <div class="card-body">
    <div class="card-top">
      <span class="pill pill-level" style="background:${lv.color}18;color:${lv.color};border:1px solid ${lv.color}38">${lv.label}</span>
      <span class="pill pill-type"><i class="${tp.icon}"></i>${tp.label}</span>
      ${progDot}
    </div>
    <div class="card-cat" style="color:${cat.color}">${cat.label}</div>
    <h3 class="card-title">${c.title}</h3>
    <p class="card-desc">${c.description.slice(0,88)}…</p>
    <div class="card-meta">${metaHTML}${c.duration?`<span><i class="fa-solid fa-clock"></i>${c.duration}</span>`:''}</div>
    <div class="card-tags">${tags}</div>
  </div>
  <div class="card-foot">
    <button class="act btn-fav${fav?' fav-on':''}" data-id="${c.id}" title="お気に入り"><i class="fa-${fav?'solid':'regular'} fa-heart"></i></button>
    <button class="act btn-bk${bk?' book-on':''}" data-id="${c.id}" title="保存"><i class="fa-${bk?'solid':'regular'} fa-bookmark"></i></button>
    <div class="pmenu">
      <button class="act btn-prog" data-id="${c.id}" title="進捗"><i class="fa-solid fa-chart-simple"></i></button>
      <div class="pdrop" data-id="${c.id}">
        <button class="popt${prog==='none'?' on':''}" data-id="${c.id}" data-s="none"><i class="fa-regular fa-circle"></i>未着手</button>
        <button class="popt${prog==='in-progress'?' on':''}" data-id="${c.id}" data-s="in-progress"><i class="fa-solid fa-circle-half-stroke"></i>学習中</button>
        <button class="popt${prog==='completed'?' on':''}" data-id="${c.id}" data-s="completed"><i class="fa-solid fa-circle-check"></i>完了</button>
      </div>
    </div>
    <a href="${c.url}" target="_blank" rel="noopener noreferrer" class="open-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i>開く</a>
  </div>
</div>`;
}

function renderToGrid(gid,courses){
  const g=document.getElementById(gid);if(!g)return;
  if(!courses.length){g.innerHTML=`<div class="empty"><div class="empty-ico"><i class="fa-solid fa-magnifying-glass"></i></div><p>該当するコンテンツが見つかりません</p></div>`;return}
  g.innerHTML=courses.map(cardHTML).join('');
  attachEvents(g);
}

function attachEvents(con){
  con.querySelectorAll('.btn-fav').forEach(b=>{
    b.addEventListener('click',e=>{
      e.stopPropagation();
      const id=b.dataset.id,added=UD.togFav(id);
      b.querySelector('i').className=`fa-${added?'solid':'regular'} fa-heart`;
      b.classList.toggle('fav-on',added);
      toast(added?'❤️ お気に入りに追加しました':'お気に入りから削除しました');
      if(view==='favorites')showView('favorites');
    });
  });
  con.querySelectorAll('.btn-bk').forEach(b=>{
    b.addEventListener('click',e=>{
      e.stopPropagation();
      const id=b.dataset.id,added=UD.togBk(id);
      b.querySelector('i').className=`fa-${added?'solid':'regular'} fa-bookmark`;
      b.classList.toggle('book-on',added);
      toast(added?'🔖 保存しました':'保存を解除しました');
      if(view==='bookmarks')showView('bookmarks');
    });
  });
  con.querySelectorAll('.btn-prog').forEach(b=>{
    b.addEventListener('click',e=>{
      e.stopPropagation();
      const id=b.dataset.id,dd=con.querySelector(`.pdrop[data-id="${id}"]`);
      document.querySelectorAll('.pdrop.show').forEach(d=>{if(d!==dd)d.classList.remove('show')});
      dd.classList.toggle('show');
    });
  });
  con.querySelectorAll('.popt').forEach(b=>{
    b.addEventListener('click',e=>{
      e.stopPropagation();
      const id=b.dataset.id,s=b.dataset.s;
      UD.setProg(id,s);
      con.querySelector(`.pdrop[data-id="${id}"]`).classList.remove('show');
      const card=con.querySelector(`.card[data-id="${id}"]`);
      if(card){const t=document.createElement('div');t.innerHTML=cardHTML(COURSES.find(c=>c.id===id));card.replaceWith(t.firstElementChild);attachEvents(con)}
      const lbl={none:'未着手','in-progress':'学習中',completed:'完了'};
      toast(`進捗を「${lbl[s]}」に更新しました`);
      if(view==='dashboard')renderDash();
    });
  });
  con.querySelectorAll('.tag').forEach(t=>{
    t.addEventListener('click',e=>{
      e.stopPropagation();
      const kw=t.dataset.tag;
      const inp=document.getElementById('search-input');if(inp)inp.value=kw;
      F.q=kw.toLowerCase();showView('courses');
    });
  });
}

function applyFilters(){
  const q=F.q.toLowerCase();
  const res=COURSES.filter(c=>{
    if(F.cat!=='all'&&c.category!==F.cat)return false;
    if(F.lv!=='all'&&c.level!==F.lv)return false;
    if(F.tp!=='all'&&c.type!==F.tp)return false;
    if(q){const h=[c.title,c.description,...(c.tags||[]),c.channel||'',c.author||''].join(' ').toLowerCase();if(!q.split(/\s+/).every(w=>h.includes(w)))return false}
    return true;
  });
  const el=document.getElementById('result-count');if(el)el.textContent=`${res.length} 件`;
  renderToGrid('card-grid',res);
}

function renderList(gid,fn){renderToGrid(gid,COURSES.filter(fn))}

// ---- ダッシュボード ----
function renderDash(){
  const d=UD.d,total=COURSES.length;
  const done=Object.values(d.prog).filter(v=>v==='completed').length;
  const wip=Object.values(d.prog).filter(v=>v==='in-progress').length;
  const pct=total>0?Math.round((done/total)*100):0;
  const s=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  s('stat-total',total);s('stat-done',done);s('stat-wip',wip);s('stat-fav',d.fav.length);s('stat-bk',d.bk.length);s('stat-pct',pct+'%');
  const ring=document.getElementById('progress-ring-circle');
  if(ring){const c=2*Math.PI*54;ring.style.strokeDasharray=c;ring.style.strokeDashoffset=c*(1-pct/100)}
  const cpList=document.getElementById('cat-prog-list');
  if(cpList){
    cpList.innerHTML=Object.entries(CATEGORIES).map(([key,cat])=>{
      const tc=COURSES.filter(c=>c.category===key).length;
      const dc=COURSES.filter(c=>c.category===key&&UD.getProg(c.id)==='completed').length;
      const pc=tc>0?Math.round((dc/tc)*100):0;
      return `<div class="cpitem">
        <div class="cpico" style="background:${cat.color}18;color:${cat.color}"><i class="fa-solid ${cat.icon}"></i></div>
        <div class="cpinfo">
          <div class="cpname">${cat.label}</div>
          <div class="cpbar"><div class="cpfill" style="width:${pc}%;background:${cat.color}"></div></div>
          <div class="cpnums">${dc} / ${tc}</div>
        </div>
        <div class="cppct" style="color:${cat.color}">${pc}%</div>
      </div>`;
    }).join('');
  }
  const rg=document.getElementById('recent-grid');
  if(rg){
    const wp=COURSES.filter(c=>UD.getProg(c.id)!=='none').slice(0,6);
    if(!wp.length){rg.innerHTML=`<div class="empty"><div class="empty-ico"><i class="fa-solid fa-graduation-cap"></i></div><p>まだ学習を始めていません。コース一覧から始めましょう！</p></div>`}
    else renderToGrid('recent-grid',wp);
  }
}

// ---- カテゴリーフィルター構築 ----
function buildCatChips(){
  const con=document.getElementById('cat-chips');if(!con)return;
  con.innerHTML=`<button class="chip on" data-cat="all">すべて</button>`+
    Object.entries(CATEGORIES).map(([k,cat])=>
      `<button class="chip" data-cat="${k}" style="--cc:${cat.color}"><i class="fa-solid ${cat.icon}"></i>${cat.label}</button>`
    ).join('');
  con.querySelectorAll('.chip').forEach(b=>{
    b.addEventListener('click',()=>{
      con.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));
      b.classList.add('on');F.cat=b.dataset.cat;applyFilters();
    });
  });
}

// ---- トースト ----
function toast(msg){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}
  t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400);
}

// ---- init ----
document.addEventListener('DOMContentLoaded',()=>{
  UD.load();buildCatChips();applyFilters();

  document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));

  // 検索
  const si=document.getElementById('search-input');
  if(si)si.addEventListener('input',()=>{F.q=si.value;if(view!=='courses'&&view!=='home')showView('courses');applyFilters()});

  // レベルフィルター
  document.querySelectorAll('[data-lf]').forEach(b=>{
    b.addEventListener('click',()=>{document.querySelectorAll('[data-lf]').forEach(x=>x.classList.remove('on'));b.classList.add('on');F.lv=b.dataset.lf;applyFilters()});
  });
  // タイプフィルター
  document.querySelectorAll('[data-tf]').forEach(b=>{
    b.addEventListener('click',()=>{document.querySelectorAll('[data-tf]').forEach(x=>x.classList.remove('on'));b.classList.add('on');F.tp=b.dataset.tf;applyFilters()});
  });

  // モバイルメニュー
  const menuBtn=document.getElementById('menu-btn');
  const sidebar=document.getElementById('sidebar');
  const overlay=document.getElementById('overlay');
  if(menuBtn){
    menuBtn.addEventListener('click',()=>{sidebar.classList.toggle('open');overlay.classList.toggle('show')});
  }
  if(overlay){overlay.addEventListener('click',()=>{sidebar.classList.remove('open');overlay.classList.remove('show')})}

  // モバイル検索トグル
  const stBtn=document.getElementById('search-toggle-btn');
  const mobileSearch=document.getElementById('mobile-search');
  if(stBtn&&mobileSearch){
    stBtn.addEventListener('click',()=>{
      mobileSearch.classList.toggle('open');
      stBtn.classList.toggle('active');
      if(mobileSearch.classList.contains('open')){
        const inp=mobileSearch.querySelector('input');if(inp)setTimeout(()=>inp.focus(),80);
      }
    });
  }
  // モバイル検索 input
  const msi=document.getElementById('mobile-search-input');
  if(msi)msi.addEventListener('input',()=>{
    F.q=msi.value;
    const di=document.getElementById('search-input');if(di)di.value=msi.value;
    if(view!=='courses'&&view!=='home')showView('courses');applyFilters();
  });

  // ショートカット
  document.querySelectorAll('[data-sv]').forEach(b=>{
    b.addEventListener('click',()=>{
      const cat=b.dataset.sc;
      if(cat){
        F.cat=cat;
        document.querySelectorAll('#cat-chips .chip').forEach(c=>c.classList.toggle('on',c.dataset.cat===cat));
      }
      showView(b.dataset.sv);
    });
  });

  // ドロップダウン外クリック
  document.addEventListener('click',()=>document.querySelectorAll('.pdrop.show').forEach(d=>d.classList.remove('show')));
});
