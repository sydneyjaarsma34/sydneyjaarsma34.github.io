const audio = document.getElementById("audio");
audio.src="songs/rock.mp3";

const context = new (window.AudioContext || window.webkitAudioContext)();
const source = context.createMediaElementSource(audio);

function createFilter(freq,type){

let f=context.createBiquadFilter();
f.type=type;
f.frequency.value=freq;
f.gain.value=0;

return f;
}

const sub=createFilter(60,"lowshelf");
const bass=createFilter(200,"peaking");
const mid=createFilter(1000,"peaking");
const highmid=createFilter(4000,"peaking");
const treble=createFilter(10000,"highshelf");

source.connect(sub);
sub.connect(bass);
bass.connect(mid);
mid.connect(highmid);
highmid.connect(treble);
treble.connect(context.destination);

audio.onplay=()=>context.resume();

const sliders={
sub:document.getElementById("sub"),
bass:document.getElementById("bass"),
mid:document.getElementById("mid"),
highmid:document.getElementById("highmid"),
treble:document.getElementById("treble")
};

function updateFilters(){

sub.gain.value=sliders.sub.value;
bass.gain.value=sliders.bass.value;
mid.gain.value=sliders.mid.value;
highmid.gain.value=sliders.highmid.value;
treble.gain.value=sliders.treble.value;

updateChart();
updateProfile();
}

Object.values(sliders).forEach(slider=>{
slider.oninput=updateFilters;
});

document.getElementById("songSelect").onchange=e=>{
audio.src=e.target.value;
audio.play();
};

const ctx=document.getElementById("eqChart");

const chart=new Chart(ctx,{
type:'line',
data:{
labels:["60Hz","200Hz","1k","4k","10k"],
datasets:[{
data:[0,0,0,0,0],
borderWidth:3,
tension:0.4
}]
},
options:{
scales:{
y:{min:-20,max:20}
}
}
});

function updateChart(){

chart.data.datasets[0].data=[
Number(sliders.sub.value),
Number(sliders.bass.value),
Number(sliders.mid.value),
Number(sliders.highmid.value),
Number(sliders.treble.value)
];

chart.update();
}

function setPreset(type){

if(type==="flat"){

setValues(0,0,0,0,0);

}

if(type==="rock"){

setValues(6,4,-2,3,5);

}

if(type==="edm"){

setValues(8,6,-4,2,6);

}

if(type==="vocal"){

setValues(-2,-1,5,4,2);

}

updateFilters();
}

function setValues(a,b,c,d,e){

sliders.sub.value=a;
sliders.bass.value=b;
sliders.mid.value=c;
sliders.highmid.value=d;
sliders.treble.value=e;

}

function updateProfile(){

let bassBoost=Number(sliders.bass.value);
let trebleBoost=Number(sliders.treble.value);
let midBoost=Number(sliders.mid.value);

let profile="";

if(bassBoost>5){

profile="🔥 Bass Lover — you prefer powerful low frequencies.";

}

else if(trebleBoost>5){

profile="✨ Bright Listener — you like crisp highs.";

}

else if(midBoost>5){

profile="🎤 Vocal Focused — you prioritize vocals and instruments.";

}

else{

profile="🎧 Balanced Listener — you like a natural sound.";

}

document.getElementById("profile").innerText=profile;
}