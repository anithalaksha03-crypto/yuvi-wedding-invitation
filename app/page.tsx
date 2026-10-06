'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export type InviteData = {
  bride: string; groom: string; date: string; time: string; venue: string;
  family: string; reception: string; message: string; groomPhoto: string; bridePhoto: string;
  couplePhoto: string; card: string; gallery: string[]; music: string; musicName: string;
  theme: 'royal'|'emerald'|'blush';
};

const initial: InviteData = {
  bride:'Anitha', groom:'Yuvaraj', date:'16 September 2026', time:'11:00 AM',
  venue:'MGR Mandapam, Pothanur', family:'Together with their families',
  reception:'Reception • 16 September • 6:00 PM',
  message:'Two hearts, one beautiful journey. We would be delighted to celebrate this special day with you.',
  groomPhoto:'', bridePhoto:'', couplePhoto:'', card:'', gallery:[], music:'', musicName:'', theme:'emerald'
};

function fileData(file: File, cb:(v:string)=>void){ const r=new FileReader(); r.onload=()=>cb(String(r.result)); r.readAsDataURL(file); }

export default function Home(){
  const [d,setD]=useState<InviteData>(initial);
  const [open,setOpen]=useState(false);
  const [musicOn,setMusicOn]=useState(false);
  const audioRef=useRef<HTMLAudioElement>(null);
  const update=(k:keyof InviteData,v:any)=>setD(x=>({...x,[k]:v}));
  const setImage=(k:keyof InviteData,f?:File)=>{if(f) fileData(f,v=>update(k,v));};
  const addGallery=(files:FileList|null)=>{if(!files)return; Promise.all(Array.from(files).map(f=>new Promise<string>(r=>fileData(f,r)))).then(xs=>setD(x=>({...x,gallery:[...x.gallery,...xs].slice(0,12)})));};
  useEffect(()=>{ if(audioRef.current){audioRef.current.volume=.7; if(musicOn) audioRef.current.play().catch(()=>{}); else audioRef.current.pause();}},[musicOn,d.music]);
  const themeClass=useMemo(()=>`theme-${d.theme}`,[d.theme]);
  const reset=()=>{setD(initial);setOpen(false);setMusicOn(false)};
  return <main className="builder">
    <header className="topbar"><div><b>YUVI STUDIO</b><span>Wedding E-Invitation Creator</span></div><span className="badge">REFERENCE STYLE • MOBILE FIRST</span></header>
    <div className="builderGrid">
      <section className="editor panel">
        <h1>Create your invitation</h1><p className="hint">Fill the details once. The right side becomes your shareable wedding invitation.</p>
        <div className="sectionTitle">Couple</div>
        <div className="fields">
          <Field label="Groom name" value={d.groom} onChange={v=>update('groom',v)} />
          <Field label="Bride name" value={d.bride} onChange={v=>update('bride',v)} />
          <Upload label="Groom photo" onFile={f=>setImage('groomPhoto',f)} />
          <Upload label="Bride photo" onFile={f=>setImage('bridePhoto',f)} />
          <Upload label="Couple photo (optional)" onFile={f=>setImage('couplePhoto',f)} />
          <Upload label="Invitation card (optional)" onFile={f=>setImage('card',f)} />
        </div>
        <div className="sectionTitle">Wedding details</div>
        <div className="fields"><Field label="Wedding date" value={d.date} onChange={v=>update('date',v)} /><Field label="Wedding time" value={d.time} onChange={v=>update('time',v)} /><Field wide label="Venue" value={d.venue} onChange={v=>update('venue',v)} /><Field wide label="Reception" value={d.reception} onChange={v=>update('reception',v)} /><Field wide label="Family line" value={d.family} onChange={v=>update('family',v)} /><Field wide label="Invitation message" value={d.message} onChange={v=>update('message',v)} /></div>
        <div className="sectionTitle">Style & media</div>
        <div className="themeRow">{(['emerald','royal','blush'] as const).map(t=><button key={t} className={`themeBtn ${d.theme===t?'selected':''}`} onClick={()=>update('theme',t)}>{t}</button>)}</div>
        <Upload label="Background music (MP3/WAV)" accept="audio/*" onFile={f=>{if(f)fileData(f,v=>update('music',v)); if(f)update('musicName',f.name)}} />
        <Upload label="Our memories — up to 12 photos" accept="image/*" multiple onFiles={addGallery} />
        <div className="thumbs">{d.gallery.map((g,i)=><img key={i} src={g} alt="memory" />)}</div>
        <div className="actions"><button className="gold" onClick={()=>setOpen(true)}>Open Invitation</button><button className="ghost" onClick={reset}>Reset</button></div>
        <p className="note">The invitation page is live-ready. MP4 rendering can be added after you approve this design.</p>
      </section>
      <section className="preview panel"><div className="previewHead"><div><h2>Live preview</h2><p>9:16 • emerald/gold reference look</p></div><button className="ghost" onClick={()=>setOpen(true)}>Preview full screen</button></div><Invitation data={d} themeClass={themeClass} compact /></section>
    </div>
    {d.music && <audio ref={audioRef} src={d.music} loop preload="auto" />}
    {open && <div className="modal"><div className="modalTop"><button className="close" onClick={()=>setOpen(false)}>×</button><button className="music" onClick={()=>setMusicOn(v=>!v)}>{musicOn?'🔊 Music On':'🔇 Music Off'}</button></div><Invitation data={d} themeClass={themeClass} full /></div>}
  </main>
}

function Field({label,value,onChange,wide=false}:{label:string,value:string,onChange:(v:string)=>void,wide?:boolean}){return <label className={`field ${wide?'wide':''}`}><span>{label}</span><input value={value} onChange={e=>onChange(e.target.value)} /></label>}
function Upload({label,onFile,onFiles,accept='image/*',multiple=false}:{label:string,onFile?:(f:File)=>void,onFiles?:(f:FileList|null)=>void,accept?:string,multiple?:boolean}){return <label className="upload"><span>{label}</span><input type="file" accept={accept} multiple={multiple} onChange={e=>{if(multiple)onFiles?.(e.target.files); else if(e.target.files?.[0])onFile?.(e.target.files[0])}} /></label>}

function Invitation({data:d,themeClass,compact=false,full=false}:{data:InviteData,themeClass:string,compact?:boolean,full?:boolean}){
  const memories=d.gallery.length?d.gallery:([d.couplePhoto,d.bridePhoto,d.groomPhoto].filter(Boolean) as string[]);
  return <div className={`inviteShell ${themeClass} ${compact?'compact':''} ${full?'full':''}`}>
    <section className="hero inviteSection"><div className="floral f1">✦</div><div className="floral f2">❋</div><div className="heroInner"><div className="eyebrow">{d.family}</div><div className="arch"><div className="archGlow"></div>{d.couplePhoto?<img src={d.couplePhoto} alt="couple"/>:<div className="placeholder">YUVI<br/>STUDIO</div>}</div><h2>{d.groom}<i>&</i>{d.bride}</h2><p>{d.message}</p><button className="openBtn">SAVE THE DATE</button><small>{d.date} • {d.time}</small></div></section>
    <section className="welcome inviteSection"><span className="goldLine"></span><div className="eyebrow">A BEAUTIFUL BEGINNING</div><h3>With love, laughter & blessings</h3><p>We invite you to be part of our celebration and bless the couple as they begin a new chapter together.</p><div className="namesMini"><div>{d.groomPhoto?<img src={d.groomPhoto} alt="groom"/>:<span>G</span>}<b>{d.groom}</b></div><strong>&</strong><div>{d.bridePhoto?<img src={d.bridePhoto} alt="bride"/>:<span>B</span>}<b>{d.bride}</b></div></div></section>
    <section className="event inviteSection"><div className="eyebrow">THE WEDDING</div><h3>{d.date}</h3><div className="eventCard"><span>⟡</span><b>{d.time}</b><small>{d.venue}</small><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.venue)}`} target="_blank" rel="noreferrer">VIEW LOCATION ↗</a></div><div className="reception">{d.reception}</div></section>
    {d.card && <section className="cardScene inviteSection"><div className="eyebrow">THE INVITATION</div><div className="cardFrame"><img src={d.card} alt="invitation card"/></div></section>}
    <section className="gallery inviteSection"><div className="eyebrow">OUR MEMORIES</div><h3>Moments we will always treasure</h3><div className="galleryGrid">{memories.map((g,i)=><img key={i} src={g} alt={`memory ${i+1}`}/>)}</div></section>
    <section className="travel inviteSection"><div className="eyebrow">PLAN YOUR VISIT</div><h3>Make a little journey for us</h3><div className="travelCards"><div><span>✈</span><b>Nearest Airport</b><small>Coimbatore International Airport</small></div><div><span>🚆</span><b>Recommended Trains</b><small>Check trains to the nearest station</small></div><div><span>📍</span><b>Explore</b><small>Local temples, food & places around the venue</small></div></div></section>
    <section className="final inviteSection"><div className="eyebrow">WITH ALL OUR HEART</div><h3>We can't wait to celebrate with you</h3><div className="rings">◌ ◌</div><p>{d.groom} & {d.bride}</p><small>{d.date}</small><footer>Designed by <b>YUVI STUDIO</b></footer></section>
  </div>
}
