(()=>{
  'use strict';
  const KEY='kessan_sound_mode_v31';
  let mode='blue'; try{mode=localStorage.getItem(KEY)||'blue'}catch(e){}
  let ctx=null;
  const getCtx=()=>{const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;if(!ctx)ctx=new A();if(ctx.state==='suspended')ctx.resume().catch(()=>{});return ctx};
  function tap(){if(mode==='off')return;try{
    const a=getCtx();if(!a)return;
    const t=a.currentTime+.001;
    // Mechanical blue-switch inspired: snappy high click + muted low impact, not a sampled brand recording.
    const length=mode==='blue'?.037:.055;
    const sr=a.sampleRate,n=Math.max(1,Math.round(sr*length));
    const b=a.createBuffer(1,n,sr),d=b.getChannelData(0);
    for(let i=0;i<n;i++){
      const x=i/sr;
      const envelope=Math.exp(-x*(mode==='blue'?115:70));
      const tick=Math.sin(2*Math.PI*(mode==='blue'?2600:1500)*x)*.28;
      const attack=i<sr*.002?1.35:1;
      d[i]=(Math.random()*2-1+tick)*envelope*attack*.24;
    }
    const src=a.createBufferSource();src.buffer=b;
    const filt=a.createBiquadFilter();filt.type='highpass';filt.frequency.value=mode==='blue'?700:400;
    const gain=a.createGain();gain.gain.setValueAtTime(.001,t);gain.gain.linearRampToValueAtTime(mode==='blue'?.35:.21,t+.001);gain.gain.exponentialRampToValueAtTime(.001,t+length);
    src.connect(filt);filt.connect(gain);gain.connect(a.destination);src.start(t);src.stop(t+length+.004);
    if(mode==='blue'){
      const osc=a.createOscillator(),g=a.createGain();osc.type='triangle';osc.frequency.setValueAtTime(630,t);osc.frequency.exponentialRampToValueAtTime(270,t+.022);g.gain.setValueAtTime(.055,t);g.gain.exponentialRampToValueAtTime(.001,t+.03);osc.connect(g);g.connect(a.destination);osc.start(t);osc.stop(t+.032);
    }
  }catch(e){}}
  const select=document.getElementById('soundMode');if(select){select.value=mode;select.addEventListener('change',()=>{mode=select.value;try{localStorage.setItem(KEY,mode)}catch(e){};tap()})}
  document.addEventListener('pointerdown',ev=>{if(ev.target.closest('button,.case,.tab,.node,.task,label.btn,select'))tap()},{passive:true});
  const test=document.getElementById('soundTest');if(test)test.addEventListener('click',()=>{if(mode==='off'){mode='blue';if(select)select.value=mode;try{localStorage.setItem(KEY,mode)}catch(e){}}tap()});
})();
