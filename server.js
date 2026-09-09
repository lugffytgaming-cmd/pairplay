const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, 'web')));
app.use((req,res)=>res.sendFile(path.join(__dirname,'web','index.html')));

const rooms = new Map();
const queue = { male: [], female: [] };
const sessions = new Map();
const users = new Map(); // userId -> { ws, profile }
const requests = new Map(); // targetId -> Set(senderId)

function id(len=6){ return crypto.randomBytes(Math.ceil(len*.8)).toString('base64url').slice(0,len).toUpperCase(); }
function send(ws,p){ if(ws && ws.readyState===1) ws.send(JSON.stringify(p)); }
function broadcast(room,p){ for(const ws of room.members) send(ws,p); }
function cleanQueue(){ for(const g of ['male','female']) queue[g]=queue[g].filter(ws=>ws.readyState===1&&!ws._matched); }
function makeRoom(type){ let code; do{code=id(6)}while(rooms.has(code)); const room={type,code,members:[],users:new Map(),createdAt:Date.now()};rooms.set(code,room);return room; }
function sanitizeProfile(u){ const p=u.profile||{}; return {id:p.id,name:p.name,gender:p.gender,avatar:p.avatar||'',age:p.age||null,bio:p.bio||'',interests:Array.isArray(p.interests)?p.interests.slice(0,8):[],online:true}; }
function publicProfiles(excludeId){ return [...users.values()].filter(x=>x.profile?.id!==excludeId && x.ws.readyState===1 && !x.ws.room).map(x=>sanitizeProfile(x.profile)); }
function score(a,b){
  if(!a||!b||a.gender===b.gender) return 0;
  const ai=new Set((a.interests||[]).map(x=>String(x).toLowerCase())); const bi=new Set((b.interests||[]).map(x=>String(x).toLowerCase()));
  const overlap=[...ai].filter(x=>bi.has(x)).length;
  const ageScore=(a.age&&b.age)?Math.max(0,1-Math.abs(a.age-b.age)/12):0.5;
  return Math.round(Math.min(99,55+overlap*7+ageScore*15));
}
function sendDiscover(ws){ if(!ws.user) return; const me=ws.user; const list=publicProfiles(me.id).filter(p=>p.gender!==me.gender).map(p=>({...p,compatibility:score(me,p)})).sort((a,b)=>b.compatibility-a.compatibility).slice(0,30); send(ws,{type:'discover_list',profiles:list}); }
function broadcastDiscover(){ for(const x of users.values()) sendDiscover(x.ws); }
function leaveRoom(ws){ const room=ws.room;if(!room)return;room.members=room.members.filter(x=>x!==ws);room.users.delete(ws);if(room.members.length)send(room.members[0],{type:'partner_left'});else rooms.delete(room.code);ws.room=null;ws._matched=false; }
function joinRoom(ws,room,user){ if(room.members.length>=2){send(ws,{type:'error',message:'This room is full.'});return false;} room.members.push(ws);room.users.set(ws,user);ws.room=room;send(ws,{type:'room_joined',roomCode:room.code,roomType:room.type,memberCount:room.members.length,user}); if(room.members.length===2){const users2=room.members.map(x=>room.users.get(x));for(const peer of room.members){peer._matched=true;send(peer,{type:'matched',users:users2,compatibility:score(users2[0],users2[1])});}}return true; }
function tryMatch(){cleanQueue();while(queue.male.length&&queue.female.length){let best=null;for(const m of queue.male){for(const f of queue.female){if(!m.user||!f.user)continue;const sc=score(m.user,f.user);if(!best||sc>best.sc)best={m,f,sc};}}if(!best)break;queue.male=queue.male.filter(x=>x!==best.m);queue.female=queue.female.filter(x=>x!==best.f);const room=makeRoom('online');best.m._matched=true;best.f._matched=true;joinRoom(best.m,room,best.m.user);joinRoom(best.f,room,best.f.user);}}
function notifyRequests(ws){ const incoming=[...(requests.get(ws.user.id)||[])].map(id=>users.get(id)?.profile).filter(Boolean).map(p=>sanitizeProfile(p)); send(ws,{type:'incoming_requests',requests:incoming}); }

wss.on('connection',ws=>{
  ws.on('message',raw=>{
    let msg; try{msg=JSON.parse(raw.toString())}catch{return;}
    if(msg.type==='identify'){
      const gender=['male','female'].includes(msg.gender)?msg.gender:null;if(!gender){send(ws,{type:'error',message:'Choose Male or Female to continue.'});return;}
      const profile={id:msg.userId||id(8),name:String(msg.name||'Guest').slice(0,40),gender,avatar:msg.avatar||'',age:Number(msg.age)||null,bio:String(msg.bio||'').slice(0,160),interests:Array.isArray(msg.interests)?msg.interests.slice(0,8):[]};
      ws.user=profile;sessions.set(profile.id,ws);users.set(profile.id,{ws,profile});send(ws,{type:'identified',user:profile});sendDiscover(ws);notifyRequests(ws);broadcastDiscover();return;
    }
    if(!ws.user){send(ws,{type:'error',message:'Identify first.'});return;}
    if(msg.type==='discover'){sendDiscover(ws);return;}
    if(msg.type==='connect_request'){
      const target=String(msg.targetId||'');const targetEntry=users.get(target);if(!targetEntry||target===ws.user.id||targetEntry.profile.gender===ws.user.gender){send(ws,{type:'error',message:'This profile is not available for your connection.'});return;}
      if(ws.room||targetEntry.ws.room){send(ws,{type:'error',message:'One of you is already in a couple room.'});return;}
      const set=requests.get(target)||new Set();set.add(ws.user.id);requests.set(target,set);send(targetEntry.ws,{type:'incoming_request',from:sanitizeProfile(ws.user)});send(ws,{type:'request_sent',targetId:target});return;
    }
    if(msg.type==='connect_response'){
      const from=String(msg.fromId||'');const set=requests.get(ws.user.id)||new Set();if(!set.has(from)){send(ws,{type:'error',message:'Connection request not found.'});return;}set.delete(from);
      const fromEntry=users.get(from);if(!fromEntry||fromEntry.profile.gender===ws.user.gender||ws.room||fromEntry.ws.room){send(ws,{type:'error',message:'The connection is no longer available.'});return;}
      if(msg.accept){const room=makeRoom('match');joinRoom(ws,room,ws.user);joinRoom(fromEntry.ws,room,fromEntry.profile);}else send(fromEntry.ws,{type:'request_declined',targetId:ws.user.id});return;
    }
    if(msg.type==='create_custom'){leaveRoom(ws);const room=makeRoom('custom');joinRoom(ws,room,ws.user);send(ws,{type:'custom_created',roomCode:room.code,invitePath:`/?room=${room.code}`});return;}
    if(msg.type==='join_custom'){const code=String(msg.roomCode||'').toUpperCase();const room=rooms.get(code);if(!room||room.type!=='custom'){send(ws,{type:'error',message:'Room not found.'});return;}if(room.members.some(x=>x.user&&x.user.id===ws.user.id))return;if(room.members.length>=2){send(ws,{type:'error',message:'This private room already has two people.'});return;}joinRoom(ws,room,ws.user);return;}
    if(msg.type==='find_online'){leaveRoom(ws);cleanQueue();ws._matched=false;if(!queue[ws.user.gender].includes(ws))queue[ws.user.gender].push(ws);send(ws,{type:'searching'});tryMatch();return;}
    if(msg.type==='cancel_search'){for(const g of ['male','female'])queue[g]=queue[g].filter(x=>x!==ws);ws._matched=false;send(ws,{type:'search_cancelled'});return;}
    if(msg.type==='chat'){if(!ws.room||ws.room.members.length!==2){send(ws,{type:'error',message:'You are not in a private room.'});return;}const text=String(msg.text||'').trim();if(!text||text.length>1200)return;broadcast(ws.room,{type:'chat',from:ws.user.id,name:ws.user.name,text,at:Date.now()});return;}
    if(msg.type==='leave'){leaveRoom(ws);broadcastDiscover();return;}
  });
  ws.on('close',()=>{if(ws.user){sessions.delete(ws.user.id);users.delete(ws.user.id);requests.delete(ws.user.id);for(const set of requests.values())set.delete(ws.user.id);}for(const g of ['male','female'])queue[g]=queue[g].filter(x=>x!==ws);leaveRoom(ws);broadcastDiscover();});
});
server.listen(PORT,()=>console.log(`PairPlay server running on http://localhost:${PORT}`));
