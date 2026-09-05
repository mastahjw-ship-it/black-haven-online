
const c=document.getElementById('game'),ctx=c.getContext('2d'),mc=document.getElementById('mini'),mctx=mc.getContext('2d');
let DPR=Math.min(devicePixelRatio||1,2);function resize(){c.width=innerWidth*DPR;c.height=innerHeight*DPR;ctx.setTransform(DPR,0,0,DPR,0,0)}resize();addEventListener('resize',resize);

const W=3600,H=2600;
const districts=[
{name:'Förorten',x:0,y:0,w:900,h:1100,color:'#0b1720'},{name:'Central District',x:900,y:0,w:1000,h:1100,color:'#101723'},{name:'Finansdistriktet',x:1900,y:0,w:950,h:950,color:'#11151d'},{name:'North Heights',x:2850,y:0,w:750,h:1100,color:'#11141b'},
{name:'Industriområdet',x:0,y:1100,w:950,h:1500,color:'#11151a'},{name:'Nattklubbsdistriktet',x:950,y:1100,w:950,h:1500,color:'#15111c'},{name:'Hamnen',x:1900,y:950,w:950,h:1650,color:'#081722'},{name:'Old Quarter',x:2850,y:1100,w:750,h:1500,color:'#121218'}];
const roads=[{x:0,y:860,w:3600,h:160},{x:0,y:1520,w:3600,h:150},{x:0,y:2140,w:3600,h:130},{x:820,y:0,w:140,h:2600},{x:1800,y:0,w:150,h:2600},{x:2750,y:0,w:130,h:2600}];
const places=[
{id:'home',name:'Ditt hem',x:130,y:190,w:260,h:190,ico:'⌂',solid:true,interior:'home'},
{id:'shop',name:'24/7 Närbutik',x:470,y:180,w:220,h:170,ico:'▣',solid:true,interior:'shop'},
{id:'bank',name:'Black Haven Bank',x:1080,y:170,w:300,h:220,ico:'$',solid:true,interior:'bank'},
{id:'plaza',name:'Central Plaza',x:1280,y:590,w:310,h:230,ico:'◎',solid:false},
{id:'finance',name:'Finanshuset',x:2040,y:170,w:300,h:250,ico:'▥',solid:true,interior:'finance'},
{id:'tower',name:'North Tower',x:3040,y:190,w:250,h:270,ico:'▲',solid:true},
{id:'garage',name:'Garage 17',x:150,y:1240,w:300,h:220,ico:'⚙',solid:true,interior:'garage'},
{id:'warehouse',name:'Gamla Lagret',x:520,y:1260,w:300,h:240,ico:'▤',solid:true},
{id:'club',name:'Neon Club',x:1110,y:1220,w:300,h:240,ico:'◆',solid:true,interior:'club'},
{id:'casino',name:'Black Haven Casino',x:1470,y:1300,w:280,h:260,ico:'♠',solid:true,interior:'casino'},
{id:'dock',name:'Östra Kajen',x:2050,y:1160,w:300,h:280,ico:'⚓',solid:false},
{id:'shipyard',name:'Varvet',x:2440,y:1210,w:260,h:260,ico:'⚒',solid:true},
{id:'motel',name:'Harbor Motel',x:2100,y:1780,w:260,h:200,ico:'▦',solid:true,interior:'motel'},
{id:'blackmarket',name:'Night Market',x:1240,y:1840,w:320,h:190,ico:'◈',solid:true,interior:'market'},
{id:'lounge',name:'Velvet Lounge',x:3020,y:1220,w:250,h:220,ico:'✦',solid:true,interior:'lounge'},
{id:'estate',name:'Haven Estate',x:3000,y:1770,w:260,h:240,ico:'⌂',solid:true,interior:'estate'},
{id:'arena',name:'The Pit',x:370,y:1870,w:320,h:250,ico:'✹',solid:true,interior:'arena'},
{id:'station',name:'Black Haven Station',x:1000,y:2230,w:330,h:210,ico:'▣',solid:true,interior:'station'},
{id:'marina',name:'Marina',x:2340,y:2190,w:340,h:210,ico:'⚓',solid:false}
];
const npcs=[
{id:'mara',name:'Mara',x:2100,y:1110,color:'#d6ad59',path:[2100,1110,2280,1140]},
{id:'viktor',name:'Viktor',x:1160,y:1150,color:'#ad7dff',path:[1160,1150,1280,1110]},
{id:'leo',name:'Leo',x:1410,y:820,color:'#58a7ff',path:[1410,820,1500,790]},
{id:'nina',name:'Nina',x:1600,y:1790,color:'#4ed0de',path:[1600,1790,1710,1850]},
{id:'raven',name:'Raven',x:610,y:1180,color:'#ff6576',path:[610,1180,700,1240]},
{id:'isaac',name:'Isaac',x:3110,y:1160,color:'#e2c27a',path:[3110,1160,3190,1240]},
{id:'sable',name:'Sable',x:520,y:1810,color:'#ef8e58',path:[520,1810,610,1880]},
{id:'vera',name:'Vera',x:1060,y:2170,color:'#75d4a1',path:[1060,2170,1170,2240]}
];
const enemies=[
{id:'r1',name:'Rival',x:760,y:1560,hp:70,max:70,active:true,respawn:0},{id:'r2',name:'Rival',x:1740,y:1100,hp:80,max:80,active:true,respawn:0},{id:'r3',name:'Rival',x:2340,y:1570,hp:95,max:95,active:true,respawn:0},
{id:'r4',name:'Rival',x:1040,y:1970,hp:85,max:85,active:true,respawn:0},{id:'r5',name:'Rival',x:3100,y:1540,hp:110,max:110,active:true,respawn:0},{id:'r6',name:'Rival',x:450,y:2210,hp:120,max:120,active:true,respawn:0}
];
const cars=Array.from({length:20},(_,i)=>({x:150+(i*197)%3350,y:[900,1560,2200][i%3],speed:1.0+(i%5)*.17,dir:i%2?1:-1,color:['#8b96a3','#6e3840','#335773','#745e34','#4b6b55'][i%5]}));
const police=[{x:1550,y:900,dir:1},{x:2460,y:1560,dir:-1},{x:870,y:2200,dir:1},{x:3180,y:900,dir:-1}];
const eventSpots=[
{id:'marketRush',x:1410,y:1780,name:'Nattmarknadens rush',reward:1200,rep:4,active:false},
{id:'dockDrop',x:2220,y:1080,name:'Kaj-event',reward:1800,rep:5,active:false},
{id:'pitNight',x:520,y:1800,name:'The Pit Night',reward:1500,rep:6,active:false}
];

const fresh={x:900,y:900,cash:2000,bank:0,respect:0,hp:100,maxHp:100,energy:100,heat:0,quest:'meet_mara',inventory:[{name:'Billig mobil',qty:1,desc:'Din första telefon.'}],vehicle:null,driving:false,businesses:[],properties:[],gang:null,jobsDone:0,wins:0,losses:0,day:1,time:22.6,flags:{metMara:false,metViktor:false,metLeo:false,metNina:false,metRaven:false,metIsaac:false,metSable:false,metVera:false,club:false,policeIntro:false},lastIncomeDay:0,questProgress:{rivals:0,arena:0},skills:{combat:1,street:1,business:1},interior:null,radio:true,diamonds:25,sim:{number:'070-BH-100',active:true,plan:'Street SIM'},
contacts:[
{name:'Rico88',status:'Online',balance:0},
{name:'Nova',status:'Online',balance:0},
{name:'Mara',status:'Kontakt',balance:0},
{name:'Viktor',status:'Kontakt',balance:0}
],
messages:[
{from:'System',text:'Välkommen till Black Haven Mobile.',time:'22:47'}
],
calls:[],donations:[],casinoTokens:10,premiumOwned:[],xp:0,level:1,dailyClaimDay:0,
achievements:{firstSms:false,firstCall:false,donor:false,highRoller:false,entrepreneur:false},
jobStreak:0,phoneTheme:'Midnight',notifications:[],
onlinePlayers:[
{name:'Rico88',level:12,respect:46,status:'Online',gang:'Northside'},
{name:'Nova',level:18,respect:83,status:'Online',gang:'Velvet'},
{name:'Ghostline',level:9,respect:31,status:'Online',gang:'Solo'},
{name:'Kira',level:21,respect:102,status:'Online',gang:'Night Crown'},
{name:'MasonBH',level:15,respect:60,status:'Borta',gang:'Dockers'}
],
friends:['Rico88','Nova'],
friendRequests:['Ghostline'],
globalChat:[
{from:'Rico88',text:'Någon vid Plaza?',time:'22:40'},
{from:'Nova',text:'Night Market är öppen.',time:'22:42'}
],
market:[
{id:'m1',seller:'Nova',item:'Neon-pass',price:900,qty:1},
{id:'m2',seller:'Rico88',item:'Skrot',price:300,qty:3},
{id:'m3',seller:'Kira',item:'Första hjälpen',price:450,qty:2}
],
leaderboard:[
{name:'Kira',respect:102,level:21},
{name:'Nova',respect:83,level:18},
{name:'MasonBH',respect:60,level:15},
{name:'Rico88',respect:46,level:12},
{name:'Du',respect:0,level:1}
],
party:null,partyInvites:[],
account:{username:'PlayerOne',tag:'#BH500'},
bio:'Ny i Black Haven.',status:'Tillgänglig',dmThreads:{},
ads:[{from:'Nova',title:'Köper Neon-pass',price:1000,type:'wanted'},{from:'Rico88',title:'Säljer 5x Skrot',price:1400,type:'sale'}],
skillPoints:0,skillTree:{combat2:false,street2:false,business2:false,social1:false},
dailyMissions:[{name:'Skicka 1 DM',done:false,claimed:false,reward:300},{name:'Klara 2 jobb',done:false,claimed:false,reward:600},{name:'Delta i 1 event',done:false,claimed:false,reward:500}],
sessionStats:{sms:0,jobs:0,events:0},
factions:{Mara:0,Viktor:0,Raven:0,Nina:0,Isaac:0},
homes:[{name:'Ditt rum',value:0,owned:true}],
garage:[{name:'BH Compact',value:3500,owned:false,speed:1}],
materials:{Skrot:0,Elektronik:0,Tyg:0},
crafted:[],
endgame:{empire:false,kingpin:false,social:false},
questBoard:[
{name:'Plaza-runda',reward:850,rep:2,xp:10,energy:10},
{name:'Natttransport',reward:1600,rep:4,xp:16,energy:18},
{name:'Business Escort',reward:2700,rep:5,xp:22,energy:25}
]};
let state=Object.assign({},fresh,JSON.parse(localStorage.getItem('bh-v2010000')||'{}'));
state.achievements=Object.assign({firstSms:false,firstCall:false,donor:false,highRoller:false,entrepreneur:false},state.achievements||{});
state.notifications=state.notifications||[];
state.onlinePlayers=state.onlinePlayers||[];
state.friends=state.friends||[];
state.friendRequests=state.friendRequests||[];
state.globalChat=state.globalChat||[];
state.market=state.market||[];
state.leaderboard=state.leaderboard||[];
state.partyInvites=state.partyInvites||[];
state.account=state.account||{username:'PlayerOne',tag:'#BH500'};state.bio=state.bio||'Ny i Black Haven.';state.status=state.status||'Tillgänglig';
state.dmThreads=state.dmThreads||{};state.ads=state.ads||[];state.skillPoints=state.skillPoints||0;
state.skillTree=Object.assign({combat2:false,street2:false,business2:false,social1:false},state.skillTree||{});
state.dailyMissions=state.dailyMissions||[];
state.factions=Object.assign({Mara:0,Viktor:0,Raven:0,Nina:0,Isaac:0},state.factions||{});
state.homes=state.homes||[{name:'Ditt rum',value:0,owned:true}];
state.garage=state.garage||[{name:'BH Compact',value:3500,owned:false,speed:1}];
state.homeLots=state.homeLots||[
  {id:'starter',name:'Starter Lot',x:280,y:520,owned:true,style:'Nordic',modules:['core'],comfort:12,value:4000,garden:0},
  {id:'canal',name:'Canal Lot',x:1650,y:520,owned:false,style:'Modern',modules:[],comfort:0,value:0,garden:0},
  {id:'heights',name:'Skyline Lot',x:3090,y:540,owned:false,style:'Luxury',modules:[],comfort:0,value:0,garden:0}
];
state.selectedLotId=state.selectedLotId||'starter';
state.crimeSeason=state.crimeSeason||{day:1,length:30,score:0,rank:128,crimesDone:0,successfulCrimes:0,failedCrimes:0};
state.streetCred=state.streetCred||0;
state.arrestedUntil=state.arrestedUntil||0;
state.hospitalUntil=state.hospitalUntil||0;
state.contraband=state.contraband||{Glow:0,Volt:0,Velvet:0};
state.clubVisits=state.clubVisits||0;
state.crimeCooldowns=state.crimeCooldowns||{};
state.seasonRivals=state.seasonRivals||[
 {name:'Kira',score:1460},{name:'Nova',score:1120},{name:'MasonBH',score:870},
 {name:'Rico88',score:650},{name:'Ghostline',score:420}
];
state.districtRep=state.districtRep||{
 'Förorten':10,'Central District':8,'Finansdistriktet':0,'North Heights':0,
 'Industriområdet':12,'Nattklubbsdistriktet':5,'Hamnen':15,'Old Quarter':4
};
state.territories=state.territories||{
 'Förorten':'Neutral','Central District':'Neutral','Finansdistriktet':'Ivory Syndicate','North Heights':'Ivory Syndicate',
 'Industriområdet':'Dockers','Nattklubbsdistriktet':'Velvet','Hamnen':'Dockers','Old Quarter':'Night Crown'
};
state.crew=state.crew||[
 {name:'Mara',role:'Fixer',loyalty:62,skill:3,status:'Aktiv'},
 {name:'Rico88',role:'Driver',loyalty:48,skill:2,status:'Aktiv'}
];
state.relationships=state.relationships||{
 Mara:{trust:55,fear:8,status:'Respektfull'},
 Viktor:{trust:22,fear:18,status:'Avvaktande'},
 Nova:{trust:44,fear:4,status:'Vänlig'},
 Kira:{trust:8,fear:28,status:'Rival'}
};
state.safehouses=state.safehouses||[
 {id:'starter_safe',name:'Backroom Flat',district:'Förorten',cost:0,owned:true,storage:12,security:1}
];
state.career=state.career||null;
state.careerXp=state.careerXp||0;
state.needs=state.needs||{sleep:72,stress:28,hunger:76,social:52,comfort:45};
state.lifestyle=state.lifestyle||{clothes:'Street',watch:'Ingen',carStatus:0};
state.weeklyContracts=state.weeklyContracts||[
 {id:'week1',name:'Bygg respekt i tre distrikt',progress:0,target:3,reward:4000,claimed:false}
];
state.storyChapter=state.storyChapter||1;
state.morality=state.morality||{fear:10,loyalty:35,professional:28,chaos:8};
state.prestige=state.prestige||0;
state.worldEvent=state.worldEvent||{name:'Nattmarknad',district:'Hamnen',bonus:'Marknadspriser -10%',expires:0};
state.newsFeed=state.newsFeed||[
 {title:'Black Haven vaknar',text:'Nya aktörer rör sig i stadens maktvakuum.',day:1}
];
state.dynamicPrices=state.dynamicPrices||{Glow:1,Volt:1,Velvet:1};
state.empireHoldings=state.empireHoldings||[];
state.phoneApps=state.phoneApps||['Bank','Meddelanden','Karta','Street Hub','Marknad','Bo & Bygg','Gäng','Nyheter'];
state.dailyContracts=state.dailyContracts||[
 {id:'d1',name:'Klara 2 Street-jobb',progress:0,target:2,reward:650,claimed:false},
 {id:'d2',name:'Besök en klubb',progress:0,target:1,reward:400,claimed:false},
 {id:'d3',name:'Öka distriktsrykte',progress:0,target:1,reward:500,claimed:false}
];
state.identity=state.identity||{background:'Okänd',personality:'Karismatisk',publicImage:'Skuggfigur',title:'Nykomling'};
state.legacy=state.legacy||{familyName:'Haven',heir:null,legacyScore:0,generation:1};
state.mentor=state.mentor||null;
state.crewConflicts=state.crewConflicts||[];
state.cityDevelopment=state.cityDevelopment||{};
state.cityBudget=state.cityBudget||{security:25,nightlife:25,property:25,trade:25};
state.publicPower=state.publicPower||0;
state.rumors=state.rumors||[
 {text:'En ny spelare bygger snabbt inflytande i Hamnen.',truth:true,heat:1},
 {text:'Någon köper upp fastigheter under marknadspris.',truth:false,heat:0}
];
state.secrets=state.secrets||[
 {id:'s1',title:'Symbolen vid Old Quarter',found:false},
 {id:'s2',title:'Den låsta tunnelbanestationen',found:false},
 {id:'s3',title:'The Ivory Ledger',found:false}
];
state.mystery=state.mystery||{chapter:1,clues:0,ending:null};
state.hiddenDistricts=state.hiddenDistricts||['Undercity'];
state.unlockedDistricts=state.unlockedDistricts||[];
state.transit=state.transit||{subwayUnlocked:true,airportUnlocked:false,harborRoutes:1};
state.propertyProjects=state.propertyProjects||[];
state.tenants=state.tenants||[];
state.interiorItems=state.interiorItems||[];
state.garageCollection=state.garageCollection||[];
state.wardrobe=state.wardrobe||['Street'];
state.luxuryCollection=state.luxuryCollection||[];
state.auctionItems=state.auctionItems||[
 {id:'a1',name:'Midnight Painting',bid:6000,ends:3},
 {id:'a2',name:'Black Haven Vinyl #001',bid:2800,ends:2}
];
state.creditScore=state.creditScore||520;
state.loans=state.loans||[];
state.stocks=state.stocks||[
 {symbol:'BHC',name:'Black Haven Construction',price:42.5,owned:0},
 {symbol:'NVC',name:'Neon Ventures',price:31.2,owned:0},
 {symbol:'HBR',name:'Harbor Logistics',price:56.8,owned:0}
];
state.token=state.token||{name:'H-Coin',price:12.4,owned:0};
state.businessStaff=state.businessStaff||[];
state.brands=state.brands||[];
state.franchises=state.franchises||[];
state.holding=state.holding||{name:'Haven Group',value:0};
state.legalReputation=state.legalReputation||10;
state.dualIdentity=state.dualIdentity||false;
state.courtCases=state.courtCases||[];
state.policeRelations=state.policeRelations||0;
state.reformed=state.reformed||false;
state.newGamePlus=state.newGamePlus||0;
state.calendar=state.calendar||{season:'Neon Winter',month:1,day:1,event:'Black Haven Night'};
state.worldWeather=state.worldWeather||'Regn';
state.npcSchedules=state.npcSchedules||{};
state.parties=state.parties||0;
state.dating=state.dating||{};
state.friendshipArcs=state.friendshipArcs||{};
state.wellbeing=state.wellbeing||{stressCare:0,recovery:0};
state.radioStation=state.radioStation||{name:'BH Radio',style:'Nightwave',fans:0};
state.podcastEpisodes=state.podcastEpisodes||[];
state.photoMode=state.photoMode||false;
state.encyclopedia=state.encyclopedia||[];
state.hiddenAchievements=state.hiddenAchievements||[
 {id:'ha1',name:'Ghost of Haven',unlocked:false},
 {id:'ha2',name:'Property Baron',unlocked:false},
 {id:'ha3',name:'Night King',unlocked:false}
];
state.playerTitles=state.playerTitles||['Nykomling'];
state.showcase=state.showcase||{title:'Nykomling',car:null,business:null,trophy:null};
state.clanHQ=state.clanHQ||null;
state.coopMissions=state.coopMissions||[
 {id:'c1',name:'Blackout Run',players:'2-4',reward:6000},
 {id:'c2',name:'Harbor Pressure',players:'2-4',reward:8500}
];
state.playerContracts=state.playerContracts||[];
state.seasonTheme=state.seasonTheme||'Neon Winter';
state.creatorMode=state.creatorMode||{customNpcs:[],customEvents:[],customBusinesses:[]};
state.storyModules=state.storyModules||[
 {id:'m1',name:'The First Night',unlocked:true},
 {id:'m2',name:'Ivory Shadows',unlocked:false},
 {id:'m3',name:'City of Glass',unlocked:false}
];
state.threeWorlds=state.threeWorlds||{
 crime:{level:1,xp:0,score:0},
 life:{level:1,xp:0,score:0},
 empire:{level:1,xp:0,score:0},
 synergy:0,
 balance:50,
 lastMajorAction:null
};
state.worldEffects=state.worldEffects||{
 crimeToLife:0,
 crimeToEmpire:0,
 lifeToCrime:0,
 lifeToEmpire:0,
 empireToCrime:0,
 empireToLife:0
};
state.crossBonuses=state.crossBonuses||{
 calmOperator:false,
 respectedOwner:false,
 luxuryNetwork:false,
 cleanFront:false,
 streetInvestor:false,
 balancedLegend:false
};
state.worldHistory=state.worldHistory||[];




state.materials=Object.assign({Skrot:0,Elektronik:0,Tyg:0},state.materials||{});
state.crafted=state.crafted||[];state.endgame=Object.assign({empire:false,kingpin:false,social:false},state.endgame||{});
state.questBoard=state.questBoard||[];
state.sessionStats=Object.assign({sms:0,jobs:0,events:0},state.sessionStats||{});


state.xp=state.xp||0;state.level=state.level||1;state.dailyClaimDay=state.dailyClaimDay||0;state.jobStreak=state.jobStreak||0;state.phoneTheme=state.phoneTheme||'Midnight';
state.flags=Object.assign({},fresh.flags,state.flags||{});state.inventory=state.inventory||[];state.businesses=state.businesses||[];state.properties=state.properties||[];state.questProgress=Object.assign({},fresh.questProgress,state.questProgress||{});state.skills=Object.assign({},fresh.skills,state.skills||{});
let keys={},nearPlace=null,nearNpc=null,nearEnemy=null,nearEvent=null,cam={x:0,y:0},last=performance.now(),combatCooldown=0,heading=0,carVelocity=0,footAnim=0;

function beep(freq=440,dur=.06,vol=.025){if(!state.radio)return;try{let ac=window._ac||(window._ac=new (AudioContext||webkitAudioContext)());let o=ac.createOscillator(),g=ac.createGain();o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(ac.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+dur);o.stop(ac.currentTime+dur)}catch(e){}}
function money(n){return Math.round(n).toLocaleString('sv-SE')+' kr'}function save(){localStorage.setItem('bh-v2010000',JSON.stringify(state))}
function toastMsg(t){toast.textContent=t;toast.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>toast.classList.remove('show'),1900)}
function networth(){return state.cash+state.bank+state.businesses.reduce((s,b)=>s+b.value,0)+state.properties.reduce((s,p)=>s+p.value,0)+(state.vehicle?state.vehicle.value:0)}
function renderStats(){cash.textContent=money(state.cash);bank.textContent=money(state.bank);diamonds.textContent=state.diamonds;respect.textContent=state.respect;hp.textContent=Math.round(state.hp)+'/'+state.maxHp;energy.textContent=Math.round(state.energy)+'/100';heat.textContent=Math.round(state.heat);vehicle.textContent=state.driving&&state.vehicle?state.vehicle.name:'Till fots';networth.textContent=money(networth());repBar.style.width=Math.min(100,state.respect)+'%';hpBar.style.width=Math.max(0,state.hp/state.maxHp*100)+'%';energyBar.style.width=state.energy+'%';heatBar.style.width=Math.min(100,state.heat)+'%';questText.textContent=questLabel();interiorTag.classList.toggle('show',!!state.interior);interiorTag.textContent=state.interior?('INTERIÖR · '+state.interior.toUpperCase()):''}
function questLabel(){return {meet_mara:'Ta dig till Östra Kajen och prata med Mara.',meet_viktor:'Prata med Viktor utanför Neon Club.',meet_leo:'Träffa Leo vid Central Plaza.',rivals:'Besegra 3 rivaler. '+Math.min(state.questProgress.rivals,3)+'/3',nina:'Träffa Nina nära Night Market.',business:'Köp din första verksamhet.',raven:'Prata med Raven vid Gamla Lagret.',sable:'Träffa Sable vid The Pit.',arena:'Vinn 2 fighter i The Pit. '+Math.min(state.questProgress.arena,2)+'/2',isaac:'Träffa Isaac vid Velvet Lounge.',vera:'Träffa Vera vid Black Haven Station.',estate:'Köp en exklusiv fastighet.',free:'Black Haven ligger öppet. Bygg ditt imperium.'}[state.quest]||'Utforska staden.'}
function currentDistrict(){if(state.interior)return 'Interiör';return districts.find(d=>state.x>=d.x&&state.x<d.x+d.w&&state.y>=d.y&&state.y<d.y+d.h)?.name||'Black Haven'}
function circleRectCollide(x,y,r,p){return x+r>p.x&&x-r<p.x+p.w&&y+r>p.y&&y-r<p.y+p.h}
function blocked(nx,ny){if(state.interior)return false;return places.some(p=>p.solid&&circleRectCollide(nx,ny,state.driving?15:12,p))}


const lampPosts=[
 {x:1020,y:840},{x:1180,y:840},{x:1500,y:840},{x:1700,y:840},
 {x:2030,y:1510},{x:2250,y:1510},{x:2480,y:1510},
 {x:300,y:2130},{x:650,y:2130},{x:1200,y:2130},{x:1550,y:2130},
 {x:2890,y:880},{x:3200,y:880}
];
const puddles=[
 {x:1120,y:935,w:78,h:22},{x:1560,y:1580,w:96,h:24},{x:2230,y:2210,w:70,h:20},
 {x:720,y:2215,w:84,h:23},{x:3090,y:940,w:66,h:18}
];
function rr(x,y,w,h,r){
 ctx.beginPath();
 ctx.roundRect(x,y,w,h,r);
}
function drawNeonSign(x,y,w,h,text,color){
 ctx.save();
 ctx.fillStyle='rgba(3,8,15,.92)';
 rr(x,y,w,h,5);ctx.fill();
 ctx.shadowColor=color;ctx.shadowBlur=18;
 ctx.strokeStyle=color;ctx.lineWidth=1.7;ctx.stroke();
 ctx.fillStyle=color;ctx.font='800 12px system-ui';
 ctx.fillText(text,x+8,y+h-8);
 ctx.restore();
}
function drawLamp(x,y){
 ctx.save();
 ctx.strokeStyle='rgba(110,130,150,.85)';
 ctx.lineWidth=4;
 ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-48);ctx.stroke();
 ctx.fillStyle='#1b2532';rr(x-8,y-53,16,8,3);ctx.fill();
 ctx.shadowColor='rgba(255,213,135,.8)';ctx.shadowBlur=22;
 ctx.fillStyle='rgba(255,224,160,.95)';
 ctx.beginPath();ctx.arc(x,y-50,5,0,Math.PI*2);ctx.fill();
 ctx.restore();
}
function drawLampGlowScreen(x,y){
 let sx=x-cam.x, sy=y-50-cam.y;
 if(sx<-100||sy<-100||sx>innerWidth+100||sy>innerHeight+100)return;
 let rg=ctx.createRadialGradient(sx,sy,0,sx,sy,75);
 rg.addColorStop(0,'rgba(255,220,150,.14)');
 rg.addColorStop(.45,'rgba(255,210,125,.07)');
 rg.addColorStop(1,'rgba(255,210,125,0)');
 ctx.fillStyle=rg;ctx.beginPath();ctx.arc(sx,sy,75,0,Math.PI*2);ctx.fill();
}
function drawRoad(r){
 let roadGrad=ctx.createLinearGradient(r.x,r.y,r.x,r.y+r.h);
 roadGrad.addColorStop(0,'#1b222c');
 roadGrad.addColorStop(.5,'#10161e');
 roadGrad.addColorStop(1,'#171e27');
 ctx.fillStyle=roadGrad;ctx.fillRect(r.x,r.y,r.w,r.h);
 ctx.strokeStyle='rgba(255,255,255,.045)';ctx.lineWidth=2;ctx.strokeRect(r.x,r.y,r.w,r.h);

 // sidewalks
 ctx.fillStyle='rgba(108,124,142,.13)';
 if(r.w>r.h){
   ctx.fillRect(r.x,r.y, r.w,12); ctx.fillRect(r.x,r.y+r.h-12,r.w,12);
 }else{
   ctx.fillRect(r.x,r.y,12,r.h); ctx.fillRect(r.x+r.w-12,r.y,12,r.h);
 }

 // lane markers
 if(r.w>r.h){
   for(let x=r.x+20;x<r.x+r.w;x+=72){
     ctx.strokeStyle='rgba(245,208,114,.56)';ctx.lineWidth=3;
     ctx.beginPath();ctx.moveTo(x,r.y+r.h/2);ctx.lineTo(x+34,r.y+r.h/2);ctx.stroke();
   }
 }else{
   for(let y=r.y+20;y<r.y+r.h;y+=72){
     ctx.strokeStyle='rgba(245,208,114,.56)';ctx.lineWidth=3;
     ctx.beginPath();ctx.moveTo(r.x+r.w/2,y);ctx.lineTo(r.x+r.w/2,y+34);ctx.stroke();
   }
 }
}
function drawPuddle(p){
 ctx.save();
 let g=ctx.createLinearGradient(p.x,p.y,p.x+p.w,p.y+p.h);
 g.addColorStop(0,'rgba(80,140,200,.10)');
 g.addColorStop(.5,'rgba(190,220,255,.18)');
 g.addColorStop(1,'rgba(25,60,95,.10)');
 ctx.fillStyle=g;rr(p.x,p.y,p.w,p.h,12);ctx.fill();
 ctx.strokeStyle='rgba(160,210,255,.10)';ctx.lineWidth=1;ctx.stroke();
 ctx.restore();
}
function drawWater(){
 let wg=ctx.createLinearGradient(1900,950,3500,2500);
 wg.addColorStop(0,'#071d2d');wg.addColorStop(1,'#04111b');
 ctx.fillStyle=wg;ctx.fillRect(1900,950,1700,1650);
 let t=performance.now()/800;
 for(let i=0;i<34;i++){
   let wx=1920+((i*91)+(t*40))%1640;
   let wy=980+(i*57)%1550;
   ctx.strokeStyle='rgba(100,190,255,.10)';
   ctx.lineWidth=2;
   ctx.beginPath();
   ctx.moveTo(wx,wy);
   ctx.quadraticCurveTo(wx+18,wy-5-Math.sin(t+i)*2,wx+42,wy);
   ctx.stroke();
 }
}
function drawBuilding(p){
 let neonMap={
   club:'#b77cff',casino:'#f6ca73',blackmarket:'#ff6075',shop:'#4fe7e8',
   bank:'#74b8ff',finance:'#88a9ff',garage:'#f2a762',motel:'#ff8d7c'
 };
 let neon=neonMap[p.id]||((p.type==='shop')?'#55e7ef':'#d6ad59');
 let body=ctx.createLinearGradient(p.x,p.y,p.x+p.w,p.y+p.h);
 body.addColorStop(0,'#263a50');body.addColorStop(.52,'#162434');body.addColorStop(1,'#0b1119');
 ctx.fillStyle=body;ctx.fillRect(p.x,p.y,p.w,p.h);

 // extrusion illusion
 ctx.fillStyle='rgba(0,0,0,.24)';
 ctx.beginPath();
 ctx.moveTo(p.x+p.w,p.y+10);ctx.lineTo(p.x+p.w+11,p.y+2);ctx.lineTo(p.x+p.w+11,p.y+p.h-10);ctx.lineTo(p.x+p.w,p.y+p.h);ctx.closePath();ctx.fill();

 ctx.strokeStyle='rgba(82,124,170,.60)';ctx.lineWidth=2.5;ctx.strokeRect(p.x,p.y,p.w,p.h);
 ctx.fillStyle='rgba(6,12,18,.96)';ctx.fillRect(p.x-3,p.y-9,p.w+6,11);

 // subtle trim
 ctx.shadowColor=neon;ctx.shadowBlur=18;ctx.strokeStyle=neon;ctx.lineWidth=1.5;
 ctx.strokeRect(p.x+5,p.y+5,p.w-10,p.h-10);ctx.shadowBlur=0;

 // windows with randomized occupancy
 for(let yy=p.y+24;yy<p.y+p.h-66;yy+=34){
   for(let xx=p.x+18;xx<p.x+p.w-20;xx+=34){
     let lit=((Math.floor(xx/7)+Math.floor(yy/9)+p.x)%4!==0);
     let wc=ctx.createLinearGradient(xx,yy,xx,yy+15);
     wc.addColorStop(0,lit?'rgba(255,228,166,.95)':'rgba(32,54,82,.86)');
     wc.addColorStop(1,lit?'rgba(190,137,72,.68)':'rgba(16,26,42,.9)');
     ctx.fillStyle=wc;rr(xx,yy,16,14,2);ctx.fill();
     if(lit){
       ctx.fillStyle='rgba(255,214,130,.035)';
       ctx.fillRect(xx-2,yy+14,20,12);
     }
   }
 }

 // base + entrance
 ctx.fillStyle='rgba(4,9,15,.92)';ctx.fillRect(p.x,p.y+p.h-52,p.w,52);
 ctx.fillStyle='rgba(18,26,38,.98)';rr(p.x+p.w-48,p.y+p.h-44,30,38,3);ctx.fill();
 ctx.strokeStyle='rgba(180,210,240,.18)';ctx.stroke();
 ctx.fillStyle='rgba(230,240,255,.28)';ctx.fillRect(p.x+p.w-27,p.y+p.h-25,3,3);

 drawNeonSign(p.x+10,p.y+p.h-43,Math.min(180,p.w-66),29,p.name,neon);

 ctx.shadowColor=neon;ctx.shadowBlur=12;ctx.fillStyle='#f5f5f2';ctx.font='24px serif';
 ctx.fillText(p.ico,p.x+p.w-41,p.y+34);ctx.shadowBlur=0;
}
function drawNpc(n){
 ctx.save();
 ctx.fillStyle='rgba(0,0,0,.32)';
 ctx.beginPath();ctx.ellipse(n.x,n.y+20,15,7,0,0,Math.PI*2);ctx.fill();

 ctx.shadowColor=n.color;ctx.shadowBlur=12;ctx.strokeStyle=n.color;ctx.lineWidth=1.8;
 ctx.beginPath();ctx.arc(n.x,n.y+8,21,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;

 // legs
 ctx.fillStyle='#0c1119';ctx.fillRect(n.x-8,n.y+23,6,12);ctx.fillRect(n.x+2,n.y+23,6,12);
 // coat
 let cg=ctx.createLinearGradient(n.x-11,n.y-2,n.x+11,n.y+26);
 cg.addColorStop(0,n.color);cg.addColorStop(1,'#111824');
 ctx.fillStyle=cg;rr(n.x-10,n.y-1,20,27,6);ctx.fill();
 // head + hair
 ctx.fillStyle='#efd1bd';ctx.beginPath();ctx.arc(n.x,n.y-8,7,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='rgba(18,16,19,.95)';ctx.beginPath();ctx.arc(n.x,n.y-10,7,Math.PI,Math.PI*2);ctx.fill();

 ctx.fillStyle='#fff';ctx.font='700 10px system-ui';ctx.fillText(n.name,n.x-17,n.y-26);
 ctx.restore();
}
function drawEnemy(e){
 if(!e.active)return;
 ctx.save();
 ctx.fillStyle='rgba(0,0,0,.33)';ctx.beginPath();ctx.ellipse(e.x,e.y+20,15,7,0,0,Math.PI*2);ctx.fill();
 ctx.shadowColor='rgba(255,90,110,.6)';ctx.shadowBlur=11;ctx.strokeStyle='#ff6576';ctx.lineWidth=2;
 ctx.beginPath();ctx.arc(e.x,e.y+8,22,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
 ctx.fillStyle='#121017';ctx.fillRect(e.x-8,e.y+23,6,12);ctx.fillRect(e.x+2,e.y+23,6,12);
 let eg=ctx.createLinearGradient(e.x-10,e.y,e.x+10,e.y+28);
 eg.addColorStop(0,'#c14559');eg.addColorStop(1,'#501b27');
 ctx.fillStyle=eg;rr(e.x-10,e.y,20,28,5);ctx.fill();
 ctx.fillStyle='#ead0c6';ctx.beginPath();ctx.arc(e.x,e.y-8,7,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#171116';ctx.beginPath();ctx.arc(e.x,e.y-10,7,Math.PI,Math.PI*2);ctx.fill();
 ctx.fillStyle='#fff';ctx.font='700 9px system-ui';ctx.fillText(e.name,e.x-16,e.y-25);
 ctx.fillStyle='#281019';rr(e.x-19,e.y+38,38,5,3);ctx.fill();
 ctx.fillStyle='#ff5d6b';ctx.fillRect(e.x-19,e.y+38,38*(e.hp/e.max),5);
 ctx.restore();
}
function drawEvent(ev){
 if(!ev.active)return;
 let pulse=30+Math.sin(performance.now()/260)*5;
 ctx.save();
 ctx.shadowColor='rgba(78,208,222,.58)';ctx.shadowBlur=18;ctx.strokeStyle='#4ed0de';ctx.lineWidth=2.5;
 ctx.beginPath();ctx.arc(ev.x,ev.y,pulse,0,Math.PI*2);ctx.stroke();
 ctx.beginPath();ctx.arc(ev.x,ev.y,pulse+9,0,Math.PI*2);ctx.stroke();
 ctx.shadowBlur=0;ctx.fillStyle='#c7fbff';ctx.font='700 10px system-ui';ctx.fillText(ev.name,ev.x-42,ev.y-41);
 ctx.restore();
}
function drawAmbientForeground(){
 let kind=weather.dataset.kind;
 if(kind==='rain'){
   let t=performance.now();
   ctx.strokeStyle='rgba(170,210,255,.20)';ctx.lineWidth=1;
   for(let i=0;i<78;i++){
     let x=(i*37+t/8)%innerWidth;
     let y=(i*53+t/3.1)%innerHeight;
     ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8,y+21);ctx.stroke();
   }
   // road sheen
   let sheen=ctx.createLinearGradient(0,innerHeight*.45,0,innerHeight);
   sheen.addColorStop(0,'rgba(80,140,200,0)');
   sheen.addColorStop(1,'rgba(80,140,200,.045)');
   ctx.fillStyle=sheen;ctx.fillRect(0,innerHeight*.45,innerWidth,innerHeight*.55);
 }else if(kind==='fog'){
   let t=performance.now()/35;
   for(let i=0;i<9;i++){
     let gx=(i*220+t)%(innerWidth+300)-150;
     let gy=80+i*60;
     let rg=ctx.createRadialGradient(gx,gy,10,gx,gy,150);
     rg.addColorStop(0,'rgba(225,235,255,.095)');rg.addColorStop(1,'rgba(225,235,255,0)');
     ctx.fillStyle=rg;ctx.beginPath();ctx.arc(gx,gy,150,0,Math.PI*2);ctx.fill();
   }
 }
}
function drawInterior(){
 ctx.fillStyle='#070c13';ctx.fillRect(0,0,innerWidth,innerHeight);
 let theme=state.interior||'interior';
 let accent={
   club:'#b77cff',casino:'#e2ba65',bank:'#70a9ff',shop:'#4ed0de',
   garage:'#f2a762',motel:'#ff8d7c',home:'#78a7d8',finance:'#88a9ff'
 }[theme]||'#d6ad59';

 let room=ctx.createLinearGradient(0,120,0,innerHeight-90);
 room.addColorStop(0,'#182536');room.addColorStop(1,'#0c131d');
 ctx.fillStyle=room;rr(70,120,innerWidth-140,innerHeight-225,14);ctx.fill();
 ctx.strokeStyle='rgba(90,120,160,.46)';ctx.lineWidth=2.5;ctx.stroke();

 // wall panels
 for(let i=0;i<8;i++){
   let x=95+i*((innerWidth-190)/8);
   ctx.fillStyle=i%2?'rgba(255,255,255,.022)':'rgba(0,0,0,.08)';
   ctx.fillRect(x,155,70,120);
 }
 // themed counter
 ctx.fillStyle='rgba(7,12,20,.90)';rr(110,innerHeight-215,250,52,8);ctx.fill();
 ctx.shadowColor=accent;ctx.shadowBlur=14;ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.stroke();ctx.shadowBlur=0;

 // ceiling lights
 for(let i=0;i<6;i++){
   let x=120+i*((innerWidth-250)/5);
   ctx.shadowColor=accent;ctx.shadowBlur=16;
   ctx.fillStyle=accent;rr(x,145,80,6,3);ctx.fill();ctx.shadowBlur=0;
 }

 // floor grid
 ctx.strokeStyle='rgba(255,255,255,.025)';
 for(let x=90;x<innerWidth-90;x+=44){ctx.beginPath();ctx.moveTo(x,300);ctx.lineTo(x,innerHeight-120);ctx.stroke()}
 for(let y=300;y<innerHeight-120;y+=44){ctx.beginPath();ctx.moveTo(90,y);ctx.lineTo(innerWidth-90,y);ctx.stroke()}

 ctx.shadowColor=accent;ctx.shadowBlur=13;ctx.fillStyle=accent;ctx.font='800 24px Georgia';
 ctx.fillText(theme.toUpperCase(),100,100);ctx.shadowBlur=0;

 ctx.fillStyle='#c8d2df';ctx.font='14px system-ui';
 ctx.fillText('Tryck INTERAGERA för att lämna lokalen.',100,innerHeight-83);

 drawPlayerSprite(innerWidth/2,innerHeight/2,0,false);
}
function drawLighting(){
 let night=(state.time>19||state.time<6);
 if(night){
   let g=ctx.createRadialGradient(innerWidth/2,innerHeight/2,120,innerWidth/2,innerHeight/2,Math.max(innerWidth,innerHeight)*.88);
   g.addColorStop(0,'rgba(0,0,0,0)');
   g.addColorStop(1,'rgba(1,3,8,.68)');
   ctx.fillStyle=g;ctx.fillRect(0,0,innerWidth,innerHeight);
 }
 drawSkyAtmosphere();
 lampPosts.forEach(l=>drawLampGlowScreen(l.x,l.y));
 drawWetReflection();
 drawMovingReflections();
 drawAmbientForeground();
 drawSpeedLines();
 drawHeatPulse();
 drawPoliceScan();
 drawScreenBloom();
 drawDistrictAtmosphere();
 drawDistrictLabels();
}
function drawTrafficCar(car,isPolice=false){
 ctx.save();ctx.translate(car.x,car.y);
 let dir=car.dir||1;
 if(dir<0)ctx.scale(-1,1);
 // headlight beams
 ctx.fillStyle=isPolice?'rgba(120,180,255,.05)':'rgba(255,226,165,.045)';
 ctx.beginPath();ctx.moveTo(17,-6);ctx.lineTo(65,-15);ctx.lineTo(65,15);ctx.lineTo(17,6);ctx.closePath();ctx.fill();

 let g=ctx.createLinearGradient(-18,-10,18,10);
 g.addColorStop(0,isPolice?'#2a5d92':car.color);g.addColorStop(1,isPolice?'#102338':'#141b25');
 ctx.fillStyle=g;rr(-19,-9,38,18,5);ctx.fill();
 ctx.strokeStyle='rgba(255,255,255,.10)';ctx.lineWidth=1;ctx.stroke();
 ctx.fillStyle='rgba(10,16,25,.94)';rr(-10,-7,21,10,3);ctx.fill();
 ctx.fillStyle=isPolice?'#83c1ff':'#ffe0a0';ctx.fillRect(15,-6,4,3);ctx.fillRect(15,3,4,3);
 ctx.fillStyle='#ff5f69';ctx.fillRect(-19,-6,3,3);ctx.fillRect(-19,3,3,3);
 if(isPolice){
   ctx.shadowColor='#63a7ff';ctx.shadowBlur=9;ctx.fillStyle='#63a7ff';ctx.fillRect(-5,-12,5,4);
   ctx.shadowColor='#ff5f69';ctx.fillStyle='#ff5f69';ctx.fillRect(0,-12,5,4);ctx.shadowBlur=0;
 }
 ctx.fillStyle='#080b0f';ctx.fillRect(-12,7,8,4);ctx.fillRect(5,7,8,4);
 ctx.restore();
}
function drawPlayerSprite(x,y,angle=0,world=true){
 ctx.save();ctx.translate(x,y);
 // shadow
 ctx.fillStyle='rgba(0,0,0,.43)';ctx.beginPath();ctx.ellipse(0,17,18,8,0,0,Math.PI*2);ctx.fill();
 // selection ring
 ctx.shadowColor='rgba(88,167,255,.48)';ctx.shadowBlur=13;ctx.strokeStyle='#58a7ff';ctx.lineWidth=2;
 ctx.beginPath();ctx.arc(0,8,22,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
 // legs
 ctx.fillStyle='#0d121a';ctx.fillRect(-10,31,7,11+Math.sin(footAnim)*2);ctx.fillRect(3,31,7,11-Math.sin(footAnim)*2);
 // body
 let pg=ctx.createLinearGradient(-12,-1,12,33);pg.addColorStop(0,'#64b2ff');pg.addColorStop(1,'#22334d');
 ctx.fillStyle=pg;rr(-11,0,22,32,6);ctx.fill();
 // arm direction cue
 ctx.save();ctx.rotate(angle);ctx.fillStyle='#4a82b9';rr(7,6,13,6,3);ctx.fill();ctx.restore();
 // head
 ctx.fillStyle='#ecd3c1';ctx.beginPath();ctx.arc(0,-8,9,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#17151a';ctx.beginPath();ctx.arc(0,-11,9,Math.PI,Math.PI*2);ctx.fill();
 if(world){ctx.fillStyle='#d7e8f8';ctx.font='800 10px system-ui';ctx.fillText('DU',-8,-27)}
 ctx.restore();
}
function drawPlayer(){
 if(state.driving&&state.vehicle){
   ctx.save();ctx.translate(state.x,state.y);ctx.rotate(heading);
   // headlights
   ctx.fillStyle='rgba(255,225,160,.07)';
   ctx.beginPath();ctx.moveTo(24,-10);ctx.lineTo(100,-28);ctx.lineTo(100,28);ctx.lineTo(24,10);ctx.closePath();ctx.fill();
   let g=ctx.createLinearGradient(-28,-14,28,14);g.addColorStop(0,state.vehicle.color||'#7d93aa');g.addColorStop(1,'#172131');
   ctx.fillStyle=g;rr(-28,-14,56,28,7);ctx.fill();
   ctx.strokeStyle='rgba(255,255,255,.13)';ctx.lineWidth=1.4;ctx.stroke();
   ctx.fillStyle='rgba(11,17,27,.93)';rr(-15,-10,30,12,4);ctx.fill();
   ctx.fillStyle='#f4d481';ctx.fillRect(20,-10,6,4);ctx.fillRect(20,6,6,4);
   ctx.fillStyle='#ff646c';ctx.fillRect(-28,-9,4,4);ctx.fillRect(-28,5,4,4);
   ctx.fillStyle='#080b10';ctx.fillRect(-18,10,9,4);ctx.fillRect(9,10,9,4);
   ctx.restore();
 }else{
   footAnim+=.08;
   drawPlayerSprite(state.x,state.y,heading,true);
 }
}
function drawWorld(){
 if(state.interior){ctx.clearRect(0,0,innerWidth,innerHeight);drawInterior();return}
 cam.x=Math.max(0,Math.min(W-innerWidth,state.x-innerWidth/2));
 cam.y=Math.max(0,Math.min(H-innerHeight,state.y-innerHeight/2));
 ctx.clearRect(0,0,innerWidth,innerHeight);ctx.save();ctx.translate(-cam.x,-cam.y);

 districts.forEach((d,i)=>{
   let colors=[
     ['#112235','#08131d'],['#14293d','#0c1723'],['#172030','#10151d'],['#171c27','#0e1219'],
     ['#171c20','#101419'],['#1b1623','#100e16'],['#0b2234','#071722'],['#1a1720','#110f16']
   ][i%8];
   let dg=ctx.createLinearGradient(d.x,d.y,d.x,d.y+d.h);dg.addColorStop(0,colors[0]);dg.addColorStop(1,colors[1]);
   ctx.fillStyle=dg;ctx.fillRect(d.x,d.y,d.w,d.h);
 });

 // ambient ground texture
 ctx.fillStyle='rgba(255,255,255,.012)';
 for(let x=0;x<W;x+=180)for(let y=0;y<H;y+=180)ctx.fillRect(x+((y/180)%2)*20,y,2,2);

 extraBlocks.forEach(drawCityBlock);
 roads.forEach(drawRoad);drawWater();
 puddles.forEach(drawPuddle);

 // crosswalks
 [[1210,830],[2100,1490],[3020,2130],[800,1480]].forEach(([x,y])=>{
   for(let i=0;i<7;i++){ctx.fillStyle='rgba(238,243,250,.17)';ctx.fillRect(x+i*19,y,10,36)}
 });

 landmarkSites.forEach(drawLandmark);
 drawPlayerHomes();
 places.forEach(drawBuilding);
 neonBillboards.forEach(drawBillboard);
 holoSigns.forEach(drawHoloSign);
 lampPosts.forEach(l=>drawLamp(l.x,l.y));
 alleyLights.forEach(drawAlleyLight);
 streetProps.forEach(drawStreetProp);
 steamVents.forEach(drawSteam);
 drawDroneLights();
 ambientCrowd.forEach(drawAmbientPerson);
 npcs.forEach(drawNpc);enemies.forEach(drawEnemy);eventSpots.forEach(drawEvent);
 megacityEvents.forEach(drawMegaEvent);
 taxis.forEach(drawTaxi);bikes.forEach(drawBike);
 cars.forEach(car=>drawTrafficCar(car,false));police.forEach(p=>drawTrafficCar(p,true));

 if(nearPlace){
   ctx.shadowColor='#d6ad59';ctx.shadowBlur=12;ctx.strokeStyle='#d6ad59';ctx.lineWidth=2.5;ctx.setLineDash([8,7]);
   ctx.strokeRect(nearPlace.x-8,nearPlace.y-8,nearPlace.w+16,nearPlace.h+16);ctx.setLineDash([]);ctx.shadowBlur=0
 }
 if(nearNpc){ctx.strokeStyle=nearNpc.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(nearNpc.x,nearNpc.y+8,27,0,Math.PI*2);ctx.stroke()}
 if(nearEnemy){ctx.strokeStyle='#ff5d6b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(nearEnemy.x,nearEnemy.y+8,30,0,Math.PI*2);ctx.stroke()}
 if(nearEvent){ctx.strokeStyle='#4ed0de';ctx.lineWidth=3;ctx.beginPath();ctx.arc(nearEvent.x,nearEvent.y,40,0,Math.PI*2);ctx.stroke()}

 drawCityPulse();
 drawBirds();
 drawPlayer();
 ctx.restore();drawLighting();
}
function drawMini(){
 mctx.clearRect(0,0,118,118);
 let bg=mctx.createRadialGradient(59,59,5,59,59,60);bg.addColorStop(0,'#10233c');bg.addColorStop(1,'#06101a');
 mctx.fillStyle=bg;mctx.fillRect(0,0,118,118);
 if(state.interior){
   mctx.fillStyle='#22334a';mctx.fillRect(25,25,68,68);
   mctx.fillStyle='#58a7ff';mctx.beginPath();mctx.arc(59,59,4,0,Math.PI*2);mctx.fill();return
 }
 let sx=118/W,sy=118/H;
 districts.forEach((d,i)=>{mctx.fillStyle=['#18324a','#1c3854','#243349','#263047','#202a32','#332643','#14364a','#2a2233'][i%8];mctx.fillRect(d.x*sx,d.y*sy,d.w*sx,d.h*sy)});
 mctx.strokeStyle='rgba(245,220,160,.18)';roads.forEach(r=>mctx.strokeRect(r.x*sx,r.y*sy,r.w*sx,r.h*sy));
 mctx.fillStyle='rgba(160,190,220,.42)';landmarkSites.forEach(l=>mctx.fillRect((l.x+l.w/2)*sx-1,(l.y+l.h/2)*sy-1,3,3));
 mctx.fillStyle='#d6ad59';places.forEach(p=>mctx.fillRect((p.x+p.w/2)*sx-1,(p.y+p.h/2)*sy-1,3,3));
 mctx.fillStyle='#4ed0de';eventSpots.filter(e=>e.active).forEach(e=>mctx.fillRect(e.x*sx-1,e.y*sy-1,3,3));
 mctx.shadowColor='#58a7ff';mctx.shadowBlur=8;mctx.fillStyle='#58a7ff';mctx.beginPath();mctx.arc(state.x*sx,state.y*sy,3.3,0,Math.PI*2);mctx.fill();mctx.shadowBlur=0;
}


const skylineStars=Array.from({length:90},(_,i)=>({
 x:(i*191)%3600,
 y:40+(i*83)%620,
 r:0.5+((i*7)%3)*0.35,
 a:.12+((i*17)%8)/20
}));
const steamVents=[
 {x:1090,y:875},{x:1450,y:870},{x:2140,y:1540},{x:2970,y:2170},{x:640,y:2160}
];
const neonBillboards=[
 {x:1320,y:515,w:150,h:52,t:'BLACK HAVEN',c:'#55e7ef'},
 {x:2590,y:1180,w:145,h:48,t:'NIGHT//LIFE',c:'#b77cff'},
 {x:760,y:1740,w:132,h:46,t:'24/7',c:'#ff6576'}
];

function drawSkyAtmosphere(){
 let night=(state.time>19||state.time<6);
 if(!night)return;
 ctx.save();
 skylineStars.forEach(s=>{
   let sx=s.x-cam.x*.08, sy=s.y-cam.y*.03;
   if(sx<0||sx>innerWidth||sy<0||sy>innerHeight*.62)return;
   let tw=.55+.45*Math.sin(performance.now()/900+s.x*.02);
   ctx.globalAlpha=s.a*tw;
   ctx.fillStyle='#d7e9ff';
   ctx.beginPath();ctx.arc(sx,sy,s.r,0,Math.PI*2);ctx.fill();
 });
 ctx.globalAlpha=1;
 ctx.restore();
}
function drawBillboard(b){
 ctx.save();
 ctx.shadowColor=b.c;ctx.shadowBlur=24;
 ctx.fillStyle='rgba(6,10,17,.95)';
 rr(b.x,b.y,b.w,b.h,5);ctx.fill();
 ctx.strokeStyle=b.c;ctx.lineWidth=2;ctx.stroke();
 ctx.fillStyle=b.c;ctx.font='900 15px system-ui';
 ctx.fillText(b.t,b.x+10,b.y+30);
 ctx.shadowBlur=0;
 ctx.restore();
}
function drawSteam(v){
 let t=performance.now()/700;
 ctx.save();
 for(let i=0;i<5;i++){
   let y=v.y-12-i*11-((t*14+i*7)%16);
   let x=v.x+Math.sin(t+i)*7;
   let r=8+i*2;
   let g=ctx.createRadialGradient(x,y,1,x,y,r);
   g.addColorStop(0,'rgba(220,230,240,.10)');
   g.addColorStop(1,'rgba(220,230,240,0)');
   ctx.fillStyle=g;
   ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
}
function drawWetReflection(){
 if(weather.dataset.kind!=='rain')return;
 ctx.save();
 let g=ctx.createLinearGradient(0,innerHeight*.55,0,innerHeight);
 g.addColorStop(0,'rgba(60,120,180,0)');
 g.addColorStop(1,'rgba(60,120,180,.06)');
 ctx.fillStyle=g;
 ctx.fillRect(0,innerHeight*.55,innerWidth,innerHeight*.45);
 // reflected vertical light streaks
 for(let i=0;i<12;i++){
   let x=(i*157+120-cam.x*.14)%innerWidth;
   let rg=ctx.createLinearGradient(x,innerHeight*.55,x,innerHeight);
   rg.addColorStop(0,'rgba(85,231,239,0)');
   rg.addColorStop(.55,i%3===0?'rgba(85,231,239,.035)':'rgba(230,189,104,.028)');
   rg.addColorStop(1,'rgba(255,255,255,0)');
   ctx.fillStyle=rg;
   ctx.fillRect(x,innerHeight*.5,7,innerHeight*.5);
 }
 ctx.restore();
}
function drawSpeedLines(){
 if(!state.driving || Math.abs(carVelocity)<5.5)return;
 ctx.save();
 let strength=Math.min(.18,(Math.abs(carVelocity)-5.4)*.035);
 ctx.strokeStyle=`rgba(190,220,255,${strength})`;
 ctx.lineWidth=1;
 for(let i=0;i<26;i++){
   let x=(i*61+performance.now()/5)%innerWidth;
   let y=(i*97)%innerHeight;
   let dx=Math.cos(heading)*-24;
   let dy=Math.sin(heading)*-24;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.stroke();
 }
 ctx.restore();
}
function drawHeatPulse(){
 if(state.heat<55)return;
 let a=(state.heat-55)/45*.06*(.65+.35*Math.sin(performance.now()/180));
 ctx.save();
 let g=ctx.createRadialGradient(innerWidth/2,innerHeight/2,innerWidth*.18,innerWidth/2,innerHeight/2,Math.max(innerWidth,innerHeight)*.72);
 g.addColorStop(0,'rgba(255,70,90,0)');
 g.addColorStop(1,`rgba(255,70,90,${a})`);
 ctx.fillStyle=g;ctx.fillRect(0,0,innerWidth,innerHeight);
 ctx.restore();
}


const droneLights=[
 {x:600,y:420,s:1},{x:1480,y:510,s:1.2},{x:2670,y:390,s:.9},{x:3300,y:560,s:1.1}
];
const holoSigns=[
 {x:1180,y:610,w:120,h:38,t:'OPEN',c:'#6af5ff'},
 {x:2440,y:1320,w:145,h:42,t:'VIP ACCESS',c:'#cf83ff'},
 {x:520,y:1840,w:125,h:38,t:'MARKET',c:'#ff6b7c'}
];

const extraBlocks=[
 {x:120,y:180,w:240,h:170,n:'Old Quarter',c:'#1a2634'},
 {x:430,y:160,w:280,h:180,n:'Brick Row',c:'#202a33'},
 {x:780,y:180,w:240,h:160,n:'Canal Yard',c:'#162a35'},
 {x:1180,y:160,w:300,h:170,n:'Central Heights',c:'#20263a'},
 {x:1580,y:180,w:260,h:160,n:'West Exchange',c:'#242332'},
 {x:2050,y:180,w:300,h:170,n:'Glass Mile',c:'#18273a'},
 {x:2460,y:160,w:260,h:180,n:'Embassy Row',c:'#252231'},
 {x:2860,y:180,w:320,h:170,n:'North Terminal',c:'#1a2835'},
 {x:150,y:1020,w:280,h:200,n:'South Market',c:'#24201c'},
 {x:520,y:1030,w:260,h:180,n:'Warehouse 12',c:'#202326'},
 {x:920,y:1010,w:300,h:190,n:'Little Haven',c:'#1d2530'},
 {x:1320,y:1020,w:260,h:180,n:'Arcade Strip',c:'#211f32'},
 {x:1640,y:1010,w:260,h:190,n:'Midtown East',c:'#1d2431'},
 {x:2250,y:1020,w:280,h:185,n:'Harbor Offices',c:'#142838'},
 {x:2670,y:1015,w:300,h:190,n:'Dockside',c:'#14222d'},
 {x:180,y:1700,w:260,h:190,n:'Riverside',c:'#172837'},
 {x:560,y:1680,w:280,h:210,n:'Foundry',c:'#27231f'},
 {x:980,y:1710,w:280,h:180,n:'East Flats',c:'#212934'},
 {x:1400,y:1690,w:320,h:200,n:'Metro Park',c:'#16261e'},
 {x:1840,y:1710,w:250,h:180,n:'Night Row',c:'#251f31'},
 {x:2190,y:1680,w:300,h:210,n:'Old Docks',c:'#122534'},
 {x:2620,y:1700,w:300,h:190,n:'Pier District',c:'#10283a'},
 {x:3070,y:1690,w:300,h:200,n:'Shipyards',c:'#13232b'}
];

const streetProps=[
 {x:330,y:870,t:'kiosk'},{x:610,y:870,t:'bench'},{x:880,y:870,t:'tree'},
 {x:1370,y:870,t:'kiosk'},{x:1760,y:870,t:'tree'},{x:2350,y:870,t:'bench'},
 {x:2860,y:870,t:'kiosk'},{x:3320,y:870,t:'tree'},
 {x:330,y:1530,t:'tree'},{x:720,y:1530,t:'bench'},{x:1130,y:1530,t:'kiosk'},
 {x:1560,y:1530,t:'tree'},{x:2010,y:1530,t:'bench'},{x:2470,y:1530,t:'kiosk'},
 {x:2940,y:1530,t:'tree'},{x:3350,y:1530,t:'bench'},
 {x:420,y:2190,t:'kiosk'},{x:910,y:2190,t:'tree'},{x:1360,y:2190,t:'bench'},
 {x:1790,y:2190,t:'tree'},{x:2410,y:2190,t:'kiosk'},{x:3100,y:2190,t:'bench'}
];

const landmarkSites=[
 {x:350,y:430,w:120,h:90,n:'Clock Tower',ico:'🕰',c:'#f0c86f'},
 {x:910,y:410,w:150,h:100,n:'Canal Station',ico:'🚇',c:'#73b8ff'},
 {x:1680,y:420,w:145,h:95,n:'Museum',ico:'🏛',c:'#d4b07a'},
 {x:2300,y:390,w:150,h:110,n:'Skybridge',ico:'🌉',c:'#6af5ff'},
 {x:3000,y:420,w:150,h:100,n:'Grand Hotel',ico:'🏨',c:'#cf83ff'},
 {x:470,y:1230,w:150,h:110,n:'Market Hall',ico:'🛒',c:'#ff8f72'},
 {x:1230,y:1260,w:150,h:100,n:'Arcade',ico:'🕹',c:'#cf83ff'},
 {x:1850,y:1220,w:160,h:120,n:'Theatre',ico:'🎭',c:'#ff6576'},
 {x:2800,y:1240,w:160,h:110,n:'Port Authority',ico:'⚓',c:'#73b8ff'},
 {x:750,y:1930,w:170,h:120,n:'Foundry Works',ico:'🏭',c:'#f2a762'},
 {x:1500,y:1920,w:170,h:120,n:'Metro Park',ico:'🌳',c:'#6fd08c'},
 {x:2350,y:1910,w:170,h:120,n:'Ferry Terminal',ico:'⛴',c:'#6af5ff'},
 {x:3150,y:1900,w:170,h:120,n:'Shipyard Crane',ico:'🏗',c:'#f0c86f'}
];

const alleyLights=[
 {x:520,y:640},{x:760,y:645},{x:1120,y:650},{x:1490,y:640},{x:1850,y:650},
 {x:2220,y:640},{x:2610,y:650},{x:3040,y:645},
 {x:470,y:1360},{x:860,y:1360},{x:1260,y:1360},{x:1690,y:1360},
 {x:2150,y:1360},{x:2590,y:1360},{x:3070,y:1360}
];

function drawCityBlock(b){
 ctx.save();
 let g=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h);
 g.addColorStop(0,b.c);
 g.addColorStop(1,'#0c1219');
 ctx.fillStyle=g;
 rr(b.x,b.y,b.w,b.h,8);ctx.fill();
 ctx.strokeStyle='rgba(90,120,150,.22)';ctx.lineWidth=1.5;ctx.stroke();

 // facades
 for(let yy=b.y+18;yy<b.y+b.h-30;yy+=28){
   for(let xx=b.x+16;xx<b.x+b.w-18;xx+=30){
     let lit=((xx+yy)%5!==0);
     ctx.fillStyle=lit?'rgba(255,220,150,.16)':'rgba(40,55,75,.18)';
     rr(xx,yy,12,10,2);ctx.fill();
   }
 }
 ctx.fillStyle='rgba(0,0,0,.28)';
 ctx.fillRect(b.x,b.y+b.h-26,b.w,26);
 ctx.fillStyle='rgba(220,235,250,.28)';
 ctx.font='700 9px system-ui';
 ctx.fillText(b.n.toUpperCase(),b.x+8,b.y+b.h-9);
 ctx.restore();
}

function drawStreetProp(p){
 ctx.save();
 if(p.t==='tree'){
   ctx.fillStyle='#21331f';ctx.beginPath();ctx.arc(p.x,p.y-18,14,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#4a3524';ctx.fillRect(p.x-3,p.y-12,6,18);
 }else if(p.t==='bench'){
   ctx.fillStyle='#5a4936';rr(p.x-16,p.y-5,32,8,3);ctx.fill();
   ctx.fillStyle='#30261d';ctx.fillRect(p.x-14,p.y+3,4,7);ctx.fillRect(p.x+10,p.y+3,4,7);
 }else{
   ctx.fillStyle='#1b2430';rr(p.x-12,p.y-20,24,28,4);ctx.fill();
   ctx.shadowColor='#6af5ff';ctx.shadowBlur=8;ctx.fillStyle='#6af5ff';ctx.fillRect(p.x-8,p.y-16,16,8);ctx.shadowBlur=0;
 }
 ctx.restore();
}

function drawLandmark(l){
 ctx.save();
 ctx.shadowColor=l.c;ctx.shadowBlur=14;
 ctx.strokeStyle=l.c;ctx.lineWidth=1.5;
 rr(l.x,l.y,l.w,l.h,8);ctx.stroke();
 ctx.shadowBlur=0;
 let g=ctx.createLinearGradient(l.x,l.y,l.x,l.y+l.h);
 g.addColorStop(0,'#243549');g.addColorStop(1,'#0d151f');
 ctx.fillStyle=g;ctx.fill();
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(l.x,l.y+l.h-32,l.w,32);
 ctx.fillStyle='#eef4fb';ctx.font='700 11px system-ui';ctx.fillText(l.n,l.x+10,l.y+l.h-11);
 ctx.fillStyle='#fff';ctx.font='26px serif';ctx.fillText(l.ico,l.x+l.w-38,l.y+34);
 ctx.restore();
}

function drawAlleyLight(a){
 ctx.save();
 ctx.strokeStyle='rgba(105,125,145,.7)';ctx.lineWidth=3;
 ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x,a.y-28);ctx.stroke();
 ctx.shadowColor='rgba(106,245,255,.45)';ctx.shadowBlur=10;
 ctx.fillStyle='#6af5ff';ctx.fillRect(a.x-3,a.y-31,6,4);ctx.shadowBlur=0;
 ctx.restore();
}

function drawDroneLights(){
 let t=performance.now()/1200;
 ctx.save();
 droneLights.forEach((d,i)=>{
   let x=d.x+Math.sin(t+i*1.7)*55;
   let y=d.y+Math.cos(t*.7+i)*22;
   ctx.fillStyle='rgba(10,18,28,.95)';
   rr(x-8,y-4,16,8,3);ctx.fill();
   ctx.fillStyle=i%2?'#6af5ff':'#f0c86f';
   ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=12;
   ctx.fillRect(x-2,y-2,4,4);ctx.shadowBlur=0;
 });
 ctx.restore();
}
function drawHoloSign(h){
 ctx.save();
 let pulse=.75+.25*Math.sin(performance.now()/350+h.x*.01);
 ctx.globalAlpha=.75+pulse*.2;
 ctx.shadowColor=h.c;ctx.shadowBlur=26;
 ctx.strokeStyle=h.c;ctx.lineWidth=1.5;
 rr(h.x,h.y,h.w,h.h,6);ctx.stroke();
 ctx.fillStyle='rgba(7,12,20,.72)';ctx.fill();
 ctx.fillStyle=h.c;ctx.font='900 12px system-ui';
 ctx.fillText(h.t,h.x+10,h.y+25);
 ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.restore();
}
function drawMovingReflections(){
 if(weather.dataset.kind!=='rain')return;
 let t=performance.now()/900;
 ctx.save();
 for(let i=0;i<18;i++){
   let x=(i*137 + (t*40))%innerWidth;
   let y=innerHeight*.58+(i*43)%Math.max(1,innerHeight*.35);
   let w=14+((i*11)%28);
   ctx.fillStyle=i%3===0?'rgba(106,245,255,.035)':i%3===1?'rgba(240,200,111,.025)':'rgba(207,131,255,.025)';
   rr(x,y,w,2+(i%3),2);ctx.fill();
 }
 ctx.restore();
}
function drawScreenBloom(){
 ctx.save();
 let g1=ctx.createRadialGradient(innerWidth*.16,innerHeight*.18,0,innerWidth*.16,innerHeight*.18,innerWidth*.28);
 g1.addColorStop(0,'rgba(85,180,255,.035)');g1.addColorStop(1,'rgba(85,180,255,0)');
 ctx.fillStyle=g1;ctx.fillRect(0,0,innerWidth,innerHeight);
 let g2=ctx.createRadialGradient(innerWidth*.82,innerHeight*.22,0,innerWidth*.82,innerHeight*.22,innerWidth*.26);
 g2.addColorStop(0,'rgba(230,160,255,.025)');g2.addColorStop(1,'rgba(230,160,255,0)');
 ctx.fillStyle=g2;ctx.fillRect(0,0,innerWidth,innerHeight);
 ctx.restore();
}
function drawDistrictLabels(){
 ctx.save();
 districts.forEach(d=>{
   let sx=d.x+d.w/2-cam.x, sy=d.y+70-cam.y;
   if(sx<-150||sx>innerWidth+150||sy<-40||sy>innerHeight+40)return;
   ctx.globalAlpha=.13;
   ctx.fillStyle='#dcecff';
   ctx.font='900 34px system-ui';
   ctx.textAlign='center';
   ctx.fillText(d.name?.toUpperCase?.()||'',sx,sy);
 });
 ctx.globalAlpha=1;ctx.textAlign='left';ctx.restore();
}
function drawPoliceScan(){
 if(state.heat<70)return;
 let t=performance.now()/520;
 ctx.save();
 let y=(t*90)%innerHeight;
 let g=ctx.createLinearGradient(0,y-24,0,y+24);
 g.addColorStop(0,'rgba(255,70,95,0)');
 g.addColorStop(.5,'rgba(255,70,95,.035)');
 g.addColorStop(1,'rgba(255,70,95,0)');
 ctx.fillStyle=g;ctx.fillRect(0,y-24,innerWidth,48);
 ctx.restore();
}


const ambientCrowd=Array.from({length:34},(_,i)=>({
 x:140+(i*97)%3300,
 y:760+((i*131)%1500),
 phase:i*.7,
 color:['#7da7c7','#b58977','#6fa68c','#b993c7','#c4a36a'][i%5]
}));

const taxis=[
 {x:200,y:925,dir:1,speed:1.1,color:'#d8ad42'},
 {x:3400,y:1580,dir:-1,speed:1.0,color:'#d8ad42'},
 {x:900,y:2245,dir:1,speed:1.2,color:'#d8ad42'}
];

function drawAmbientPerson(p,i){
 let t=performance.now()/1800+p.phase;
 let x=p.x+Math.sin(t)*16;
 let y=p.y+Math.cos(t*.7)*8;
 ctx.save();
 ctx.fillStyle='rgba(0,0,0,.25)';
 ctx.beginPath();ctx.ellipse(x,y+13,8,4,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=p.color;
 rr(x-5,y,10,16,3);ctx.fill();
 ctx.fillStyle='#e4c8b5';
 ctx.beginPath();ctx.arc(x,y-5,4,0,Math.PI*2);ctx.fill();
 ctx.restore();
}

function drawTaxi(t){
 ctx.save();
 ctx.translate(t.x,t.y);
 if(t.dir<0)ctx.scale(-1,1);
 let g=ctx.createLinearGradient(-19,-9,19,9);
 g.addColorStop(0,'#e1ba4f');
 g.addColorStop(1,'#80631f');
 ctx.fillStyle=g;rr(-19,-9,38,18,5);ctx.fill();
 ctx.fillStyle='#111923';rr(-9,-6,20,9,3);ctx.fill();
 ctx.fillStyle='#f3d886';ctx.fillRect(15,-5,4,3);ctx.fillRect(15,2,4,3);
 ctx.fillStyle='#0a0d11';ctx.fillRect(-11,7,7,4);ctx.fillRect(5,7,7,4);
 ctx.fillStyle='#1a1a1a';rr(-6,-14,12,5,2);ctx.fill();
 ctx.restore();
}

function updateAmbientTraffic(dt){
 taxis.forEach(t=>{
   t.x+=t.speed*t.dir*dt;
   if(t.x<60){t.x=3520}
   if(t.x>3540){t.x=80}
 });
}

function drawCityPulse(){
 let t=performance.now()/1500;
 ctx.save();
 for(let i=0;i<10;i++){
   let x=(i*343+500)%3400;
   let y=460+((i*211)%1600);
   let a=.03+.02*Math.sin(t+i);
   let rg=ctx.createRadialGradient(x,y,0,x,y,80);
   rg.addColorStop(0,`rgba(120,246,255,${a})`);
   rg.addColorStop(1,'rgba(120,246,255,0)');
   ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,y,80,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
}

function updateWorldStatus(){
 let d=districts.find(d=>state.x>=d.x&&state.x<=d.x+d.w&&state.y>=d.y&&state.y<=d.y+d.h);
 let wsD=document.getElementById('wsDistrict');
 if(wsD)wsD.textContent=d?.name||'Black Haven';

 let heat=state.heat||0;
 let police=heat>75?'Extrem':heat>50?'Hög':heat>25?'Mellan':'Låg';
 let p=document.getElementById('wsPolice');if(p)p.textContent=police;

 let hour=Math.floor(state.time);
 let nightlife=(hour>=20||hour<4)?'Pulserande':(hour>=17?'Vaknar':'Lugnt');
 let n=document.getElementById('wsNightlife');if(n)n.textContent=nightlife;

 let mood=heat>70?'Spänd':heat>40?'Orolig':nightlife==='Pulserande'?'Livlig':'Lugn';
 let m=document.getElementById('wsMood');if(m)m.textContent=mood;

 let econ=(state.cash||0)>10000?'Stark':(state.cash||0)>3000?'Stabil':'Tuff';
 let e=document.getElementById('wsEconomy');if(e)e.textContent=econ;
}

function updateSocialBubble(){
 let b=document.getElementById('socialBubble');
 if(!b)return;
 let nearest=npcs.reduce((best,n)=>{
   let d=Math.hypot(state.x-n.x,state.y-n.y);
   return (!best||d<best.d)?{n,d}:best
 },null);
 if(nearest&&nearest.d<80&&!state.interior){
   let lines=[
     'Tuff kväll i stan.',
     'Du ser bekant ut.',
     'Har du hört vad som händer vid hamnen?',
     'Black Haven sover aldrig.',
     'Polisen cirklar mer än vanligt.'
   ];
   b.textContent=lines[Math.abs(Math.floor(nearest.n.x+state.day))%lines.length];
   b.style.display='block';
   b.style.left=(nearest.n.x-cam.x+18)+'px';
   b.style.top=(nearest.n.y-cam.y-58)+'px';
 }else{
   b.style.display='none'
 }
}


const megacityEvents=[
 {name:'Street Performance',x:880,y:900,active:true,c:'#d492ff'},
 {name:'Food Market',x:1460,y:1560,active:true,c:'#f3cf7a'},
 {name:'Night Crowd',x:2420,y:910,active:true,c:'#7af7ff'},
 {name:'Dock Workers',x:2860,y:1980,active:true,c:'#7cc2ff'}
];

const bikes=[
 {x:400,y:870,dir:1,speed:1.8,c:'#b6d7ff'},
 {x:3000,y:1535,dir:-1,speed:1.5,c:'#e7b27d'}
];

const birds=Array.from({length:10},(_,i)=>({
 x:400+i*280,
 y:260+(i%3)*35,
 phase:i*.9
}));

function drawMegaEvent(e){
 if(!e.active)return;
 ctx.save();
 let p=.65+.35*Math.sin(performance.now()/300+e.x*.01);
 ctx.globalAlpha=.65+p*.25;
 ctx.shadowColor=e.c;ctx.shadowBlur=18;
 ctx.strokeStyle=e.c;ctx.lineWidth=1.8;
 ctx.beginPath();ctx.arc(e.x,e.y,24+p*7,0,Math.PI*2);ctx.stroke();
 ctx.fillStyle=e.c;ctx.font='800 9px system-ui';ctx.fillText(e.name,e.x-34,e.y-34);
 ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.restore();
}

function drawBike(b){
 ctx.save();ctx.translate(b.x,b.y);
 if(b.dir<0)ctx.scale(-1,1);
 ctx.strokeStyle=b.c;ctx.lineWidth=2;
 ctx.beginPath();ctx.arc(-7,5,5,0,Math.PI*2);ctx.stroke();
 ctx.beginPath();ctx.arc(7,5,5,0,Math.PI*2);ctx.stroke();
 ctx.beginPath();ctx.moveTo(-7,5);ctx.lineTo(0,-2);ctx.lineTo(7,5);ctx.moveTo(0,-2);ctx.lineTo(-2,5);ctx.lineTo(-7,5);ctx.stroke();
 ctx.fillStyle='#e3c5b3';ctx.beginPath();ctx.arc(0,-8,3.5,0,Math.PI*2);ctx.fill();
 ctx.restore();
}

function updateBikes(dt){
 bikes.forEach(b=>{
   b.x+=b.speed*b.dir*dt;
   if(b.x<70)b.x=3500;
   if(b.x>3530)b.x=80;
 });
}

function drawBirds(){
 let t=performance.now()/1000;
 ctx.save();
 ctx.strokeStyle='rgba(220,235,250,.25)';
 ctx.lineWidth=1.4;
 birds.forEach((b,i)=>{
   let x=b.x+Math.sin(t*.8+b.phase)*45;
   let y=b.y+Math.cos(t*.55+b.phase)*18;
   ctx.beginPath();
   ctx.moveTo(x-6,y);
   ctx.quadraticCurveTo(x-2,y-4,x,y);
   ctx.quadraticCurveTo(x+2,y-4,x+6,y);
   ctx.stroke();
 });
 ctx.restore();
}

function drawDistrictAtmosphere(){
 let d=districts.find(d=>state.x>=d.x&&state.x<=d.x+d.w&&state.y>=d.y&&state.y<=d.y+d.h);
 if(!d)return;
 ctx.save();
 let pulse=.018+.01*Math.sin(performance.now()/500);
 let c='rgba(122,247,255,'+pulse+')';
 if((d.name||'').toLowerCase().includes('night'))c='rgba(212,146,255,'+pulse+')';
 if((d.name||'').toLowerCase().includes('harbor')||(d.name||'').toLowerCase().includes('dock'))c='rgba(124,194,255,'+pulse+')';
 ctx.fillStyle=c;ctx.fillRect(0,0,innerWidth,innerHeight);
 ctx.restore();
}

function updateMegaStatus(){
 let set=(id,v)=>{let el=document.getElementById(id);if(el)el.textContent=v};
 set('megaDay',state.day||1);
 let h=Math.floor(state.time),m=Math.floor((state.time-h)*60);
 set('megaTime',String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'));
 set('megaRep',Math.round(state.respect||0));
 set('megaCash',Math.round(state.cash||0).toLocaleString('sv-SE'));
 set('megaHeat',Math.round(state.heat||0));
}






function worldLevelFromScore(score){
 return Math.max(1,1+Math.floor((score||0)/100));
}
function recalcThreeWorlds(){
 let crimeScore=
   (state.respect||0)*1.2+
   (state.streetCred||0)*1.5+
   (state.crimeSeason?.score||0)*.35+
   controlledTerritories()*25+
   (state.heat||0)*.15;
 let lifeScore=
   (state.needs?.comfort||0)*.7+
   (state.needs?.social||0)*.45+
   (state.needs?.sleep||0)*.25+
   (state.homes?.length||0)*10+
   (state.interiorItems?.length||0)*7+
   (state.wardrobe?.length||0)*5+
   Object.values(state.relationships||{}).reduce((s,r)=>s+(r.trust||0),0)*.05;
 let empireScore=
   (state.businesses?.length||0)*22+
   (state.empireHoldings?.length||0)*28+
   (state.properties?.length||0)*16+
   controlledTerritories()*18+
   (housingNetWorth?.()||0)/3000+
   (state.bank||0)/5000+
   (state.stocks||[]).reduce((s,x)=>s+(x.owned||0)*(x.price||0),0)/1000;

 state.threeWorlds.crime.score=Math.round(crimeScore);
 state.threeWorlds.life.score=Math.round(lifeScore);
 state.threeWorlds.empire.score=Math.round(empireScore);

 state.threeWorlds.crime.level=worldLevelFromScore(crimeScore);
 state.threeWorlds.life.level=worldLevelFromScore(lifeScore);
 state.threeWorlds.empire.level=worldLevelFromScore(empireScore);

 let vals=[crimeScore,lifeScore,empireScore];
 let min=Math.min(...vals),max=Math.max(...vals),avg=(crimeScore+lifeScore+empireScore)/3;
 let balance=max===0?100:Math.max(0,100-((max-min)/Math.max(1,avg))*55);
 state.threeWorlds.balance=Math.round(balance);
 state.threeWorlds.synergy=Math.max(0,Math.min(100,Math.round((balance*.6)+(Math.min(100,avg/5)*.4))));

 state.crossBonuses.calmOperator=state.threeWorlds.crime.level>=3&&state.threeWorlds.life.level>=3;
 state.crossBonuses.respectedOwner=state.threeWorlds.crime.level>=4&&state.threeWorlds.empire.level>=4;
 state.crossBonuses.luxuryNetwork=state.threeWorlds.life.level>=4&&state.threeWorlds.empire.level>=4;
 state.crossBonuses.cleanFront=state.threeWorlds.empire.level>=5&&state.legalReputation>=25;
 state.crossBonuses.streetInvestor=state.threeWorlds.crime.level>=5&&state.threeWorlds.empire.level>=5;
 state.crossBonuses.balancedLegend=state.threeWorlds.crime.level>=6&&state.threeWorlds.life.level>=6&&state.threeWorlds.empire.level>=6&&state.threeWorlds.balance>=75;
}
function updateThreeWorldsHud(){
 recalcThreeWorlds();
 let c=document.getElementById('twCrimeLevel'),l=document.getElementById('twLifeLevel'),e=document.getElementById('twEmpireLevel');
 let cs=document.getElementById('twCrimeScore'),ls=document.getElementById('twLifeScore'),es=document.getElementById('twEmpireScore');
 let sy=document.getElementById('twSynergyLabel'),bar=document.getElementById('twSynergyBar');
 if(c)c.textContent='Lv '+state.threeWorlds.crime.level;
 if(l)l.textContent='Lv '+state.threeWorlds.life.level;
 if(e)e.textContent='Lv '+state.threeWorlds.empire.level;
 if(cs)cs.textContent=state.threeWorlds.crime.score+' score';
 if(ls)ls.textContent=state.threeWorlds.life.score+' score';
 if(es)es.textContent=state.threeWorlds.empire.score+' score';
 if(sy)sy.textContent='Synergy '+state.threeWorlds.synergy+'%';
 if(bar)bar.style.width=state.threeWorlds.synergy+'%';
}
function logWorldAction(world,label,delta){
 state.threeWorlds.lastMajorAction={world,label,delta,time:Date.now()};
 state.worldHistory.unshift({world,label,delta,day:state.day});
 state.worldHistory=state.worldHistory.slice(0,20);
}
function applyCrossWorldEffects(source,amount=1){
 if(source==='crime'){
   state.needs.stress=Math.min(100,(state.needs.stress||0)+2*amount);
   state.identity.publicImage=state.heat>50?'Street Legend':state.identity.publicImage;
   state.worldEffects.crimeToLife+=amount;
   state.worldEffects.crimeToEmpire+=amount;
 }
 if(source==='life'){
   state.heat=Math.max(0,(state.heat||0)-1.5*amount);
   state.worldEffects.lifeToCrime+=amount;
   state.worldEffects.lifeToEmpire+=amount;
 }
 if(source==='empire'){
   state.needs.comfort=Math.min(100,(state.needs.comfort||0)+1*amount);
   state.streetCred+=(state.crossBonuses.respectedOwner?1:0);
   state.worldEffects.empireToCrime+=amount;
   state.worldEffects.empireToLife+=amount;
 }
 recalcThreeWorlds();
}
function threeWorldCrimeBonus(){
 let b=0;
 if(state.crossBonuses.calmOperator)b+=5;
 if(state.crossBonuses.respectedOwner)b+=4;
 if(state.crossBonuses.streetInvestor)b+=3;
 return b;
}
function threeWorldIncomeMultiplier(){
 let m=1;
 if(state.crossBonuses.luxuryNetwork)m+=.08;
 if(state.crossBonuses.respectedOwner)m+=.05;
 if(state.crossBonuses.cleanFront)m+=.07;
 return m;
}
function threeWorldLifeBonus(){
 let b=0;
 if(state.crossBonuses.luxuryNetwork)b+=6;
 if(state.crossBonuses.calmOperator)b+=5;
 return b;
}
function openThreeWorlds(){
 recalcThreeWorlds();
 let bonuses=Object.entries(state.crossBonuses).map(([k,v])=>{
   let names={
    calmOperator:'Calm Operator',
    respectedOwner:'Respected Owner',
    luxuryNetwork:'Luxury Network',
    cleanFront:'Clean Front',
    streetInvestor:'Street Investor',
    balancedLegend:'Balanced Legend'
   };
   let desc={
    calmOperator:'+5% crime chance från stark Life-balans.',
    respectedOwner:'Crime + Empire ger starkare inflytande.',
    luxuryNetwork:'Life + Empire höjer inkomster och status.',
    cleanFront:'Starkt lagligt imperium förbättrar affärseffektivitet.',
    streetInvestor:'Street-status öppnar bättre investeringssynergi.',
    balancedLegend:'Alla tre världar är högt utvecklade och balanserade.'
   };
   return `<div class="synergyCard"><h4>${names[k]}</h4><p>${desc[k]}</p><span class="worldBadge">${v?'UPPLÅST':'LÅST'}</span></div>`
 }).join('');

 let history=(state.worldHistory||[]).slice(0,9).map(h=>`<div class="historyCard"><h4>${h.world.toUpperCase()}</h4><p>Dag ${h.day}<br>${h.label}</p></div>`).join('')||'<div class="historyCard"><h4>Ingen historik ännu</h4><p>Gör handlingar i Crime, Life och Empire för att bygga din Three Worlds-profil.</p></div>';

 openSheet('Three Worlds',
 'Black Haven består av tre sammankopplade spelvärldar. Crime ger snabb makt och risk. Life bygger stabilitet, relationer och komfort. Empire ger långsiktig rikedom och offentlig status.',
 '',
 'THREE WORLDS LAYOUT FIX',
 `<div class="threeGrid">
  <div class="threeCard"><h4>CRIME · Lv ${state.threeWorlds.crime.level}</h4><p>Score ${state.threeWorlds.crime.score}<br>Crime påverkar Heat, stress, street status och tillgång till territorier.</p><button class="btn" onclick="closeSheet();openCrimeHub()">ÖPPNA CRIME</button></div>
  <div class="threeCard"><h4>LIFE · Lv ${state.threeWorlds.life.level}</h4><p>Score ${state.threeWorlds.life.score}<br>Life påverkar återhämtning, relationer, sociala möjligheter och personlig status.</p><button class="btn" onclick="closeSheet();openLifeHub()">ÖPPNA LIFE</button></div>
  <div class="threeCard"><h4>EMPIRE · Lv ${state.threeWorlds.empire.level}</h4><p>Score ${state.threeWorlds.empire.score}<br>Empire påverkar inkomster, prestige, trygghet och långsiktig makt.</p><button class="btn" onclick="closeSheet();openEmpireHub()">ÖPPNA EMPIRE</button></div>
 </div>
 <br><div class="threeCard"><h4>Synergy ${state.threeWorlds.synergy}% · Balance ${state.threeWorlds.balance}%</h4><p>Ju mer balanserat du utvecklar alla tre världar, desto fler korsbonusar låser du upp.</p><div class="uniProgress"><i style="width:${state.threeWorlds.synergy}%"></i></div></div>
 <br><div class="synergyGrid">${bonuses}</div>
 <br><div class="historyGrid">${history}</div>`
 );
}

const backgroundOptions=[
 ['Okänd','Flexibel start utan stark bonus.'],
 ['Gatubarn','Mer Street Cred från districts.'],
 ['Entreprenör','Bättre företags- och fastighetsbonus.'],
 ['Nattlivsprofil','Bonus i klubbar och sociala relationer.'],
 ['Före detta rikemansbarn','Högre public image och kreditvärdighet.'],
 ['Ex-soldat','Mer crew-lojalitet och lägre stressökning.']
];
const personalityOptions=['Karismatisk','Kall','Lojal','Diplomatisk','Hänsynslös','Manipulativ'];
const publicImages=['Skuggfigur','Entreprenör','Mystisk miljardär','Street Legend','City Celebrity'];

function updateUniverseHud(){
 let el=document.getElementById('identityHud'); if(el)el.textContent=state.identity.background;
 el=document.getElementById('legacyHud'); if(el)el.textContent='Gen '+state.legacy.generation;
 el=document.getElementById('mysteryHud'); if(el)el.textContent='Kap '+state.mystery.chapter;
 el=document.getElementById('imageHud'); if(el)el.textContent=state.identity.publicImage;
 el=document.getElementById('themeHud'); if(el)el.textContent=state.seasonTheme;
}

function openUniverseHub(tab='identity'){
 let tabs=`<div class="browserTabs">
 <button class="btn ${tab==='identity'?'blue':'alt'}" onclick="openUniverseHub('identity')">IDENTITET</button>
 <button class="btn ${tab==='legacy'?'blue':'alt'}" onclick="openUniverseHub('legacy')">LEGACY</button>
 <button class="btn ${tab==='mystery'?'blue':'alt'}" onclick="openUniverseHub('mystery')">MYSTERY</button>
 <button class="btn ${tab==='economy'?'blue':'alt'}" onclick="openUniverseHub('economy')">EKONOMI</button>
 <button class="btn ${tab==='luxury'?'blue':'alt'}" onclick="openUniverseHub('luxury')">LIVSSTIL</button>
 <button class="btn ${tab==='media'?'blue':'alt'}" onclick="openUniverseHub('media')">MEDIA</button>
 <button class="btn ${tab==='creator'?'blue':'alt'}" onclick="openUniverseHub('creator')">CREATOR</button>
 </div>`;
 let content='';
 if(tab==='identity'){
  content=`<div class="identityGrid">${backgroundOptions.map(([n,d])=>`<div class="uniCard"><h4>${n}</h4><p>${d}</p><button class="btn ${state.identity.background===n?'alt':''}" onclick="setBackground('${n}')">${state.identity.background===n?'VALD':'VÄLJ'}</button></div>`).join('')}</div>
  <br><div class="uniCard"><h4>Personlighet</h4><p>${personalityOptions.map(p=>`<span class="uniBadge">${p}</span>`).join('')}</p><button class="btn" onclick="cyclePersonality()">BYT PERSONLIGHET</button></div>
  <br><div class="uniCard"><h4>Offentlig profil</h4><p>${publicImages.map(p=>`<span class="uniBadge">${p}</span>`).join('')}</p><button class="btn" onclick="cyclePublicImage()">BYT PUBLIC IMAGE</button></div>`;
 } else if(tab==='legacy'){
  content=`<div class="legacyGrid">
   <div class="uniCard"><h4>${state.legacy.familyName}-dynastin</h4><p>Generation ${state.legacy.generation}<br>Legacy score ${state.legacy.legacyScore}<br>Arvtagare: ${state.legacy.heir||'Ingen'}</p><button class="btn" onclick="setHeir()">VÄLJ ARVTAGARE</button></div>
   <div class="uniCard"><h4>New Game+</h4><p>Starta om delar av progressionen och behåll prestige, titlar och legacy.</p><button class="btn alt" onclick="previewNewGamePlus()">FÖRHANDSVISA</button></div>
   <div class="uniCard"><h4>Mentor</h4><p>${state.mentor||'Ingen mentor vald.'}</p><button class="btn" onclick="chooseMentor()">VÄLJ MENTOR</button></div>
   <div class="uniCard"><h4>Legacy ending</h4><p>Potentiella slut: City Legend, Family Dynasty, Business Empire, Ghost, Reformed.</p></div>
  </div>`;
 } else if(tab==='mystery'){
  content=`<div class="mysteryGrid">
   <div class="uniCard"><h4>Huvudmysteriet</h4><p>Kapitel ${state.mystery.chapter} · Ledtrådar ${state.mystery.clues}</p><button class="btn" onclick="investigateMystery()">UNDERSÖK</button></div>
   ${state.secrets.map(s=>`<div class="uniCard"><h4>${s.found?s.title:'???'}</h4><p>${s.found?'Hemlighet upptäckt.':'Okänd hemlighet i Black Haven.'}</p><button class="btn alt" onclick="searchSecret('${s.id}')">${s.found?'HITTAD':'SÖK'}</button></div>`).join('')}
   <div class="uniCard"><h4>Hidden District</h4><p>Undercity: ${state.unlockedDistricts.includes('Undercity')?'Upplåst':'Låst'}</p><button class="btn" onclick="unlockUndercity()">FÖRSÖK LÅSA UPP</button></div>
  </div>`;
 } else if(tab==='economy'){
  content=`<div class="economyGrid">
   <div class="uniCard"><h4>Bank & kredit</h4><p>Credit Score ${state.creditScore}<br>Aktiva lån ${state.loans.length}</p><button class="btn" onclick="takeLoan()">ANSÖK OM LÅN</button></div>
   ${state.stocks.map((s,i)=>`<div class="uniCard"><h4>${s.symbol} · ${s.name}</h4><p>Kurs ${s.price.toFixed(1)} kr · Du äger ${s.owned}</p><button class="btn" onclick="buyStock(${i})">KÖP 1</button></div>`).join('')}
   <div class="uniCard"><h4>${state.token.name}</h4><p>Pris ${state.token.price.toFixed(1)} kr · Du äger ${state.token.owned}</p><button class="btn" onclick="buyToken()">KÖP 10</button></div>
   <div class="uniCard"><h4>Auction House</h4><p>${state.auctionItems.map(a=>a.name+' · '+money(a.bid)).join('<br>')}</p><button class="btn alt" onclick="bidAuction()">LÄGG BUD</button></div>
  </div>`;
 } else if(tab==='luxury'){
  content=`<div class="luxuryGrid">
   <div class="uniCard"><h4>Wardrobe</h4><p>${state.wardrobe.map(x=>`<span class="uniBadge">${x}</span>`).join('')}</p><button class="btn" onclick="buyWardrobe()">KÖP STIL</button></div>
   <div class="uniCard"><h4>Luxury Collection</h4><p>${state.luxuryCollection.length?state.luxuryCollection.join('<br>'):'Ingen samling ännu.'}</p><button class="btn" onclick="buyLuxury()">KÖP SAMLAROBJEKT</button></div>
   <div class="uniCard"><h4>Garage Collection</h4><p>${state.garageCollection.length?state.garageCollection.join('<br>'):'Inga samlarbilar.'}</p><button class="btn" onclick="buyCollectionCar()">KÖP SHOW CAR</button></div>
   <div class="uniCard"><h4>Interior Designer</h4><p>${state.interiorItems.length?state.interiorItems.join(', '):'Inga extra designobjekt.'}</p><button class="btn" onclick="buyInteriorItem()">KÖP INREDNING</button></div>
  </div>`;
 } else if(tab==='media'){
  content=`<div class="mediaGrid">
   <div class="uniCard"><h4>Black Haven Radio</h4><p>${state.radioStation.name} · ${state.radioStation.style}<br>Fans ${state.radioStation.fans}</p><button class="btn" onclick="growRadio()">SÄND SHOW</button></div>
   <div class="uniCard"><h4>Rumors</h4><p>${state.rumors.slice(0,4).map(r=>'• '+r.text).join('<br>')}</p><button class="btn alt" onclick="seedRumor()">STARTA RYKTE</button></div>
   <div class="uniCard"><h4>Podcast</h4><p>${state.podcastEpisodes.length?state.podcastEpisodes.join('<br>'):'Inga avsnitt ännu.'}</p><button class="btn" onclick="recordPodcast()">SPELA IN</button></div>
   <div class="uniCard"><h4>Photo Mode</h4><p>${state.photoMode?'Aktivt':'Avstängt'}</p><button class="btn" onclick="togglePhotoMode()">VÄXLA</button></div>
  </div>`;
 } else {
  content=`<div class="creatorGrid">
   <div class="uniCard"><h4>Custom NPC</h4><p>${state.creatorMode.customNpcs.length} skapade.</p><button class="btn" onclick="createCustomNpc()">SKAPA NPC</button></div>
   <div class="uniCard"><h4>Custom Event</h4><p>${state.creatorMode.customEvents.length} skapade.</p><button class="btn" onclick="createCustomEvent()">SKAPA EVENT</button></div>
   <div class="uniCard"><h4>Custom Business</h4><p>${state.creatorMode.customBusinesses.length} skapade.</p><button class="btn" onclick="createCustomBusiness()">SKAPA FÖRETAG</button></div>
   <div class="uniCard"><h4>Story Modules</h4><p>${state.storyModules.map(m=>m.name+' · '+(m.unlocked?'Upplåst':'Låst')).join('<br>')}</p></div>
  </div>`;
 }
 openSheet('Black Haven Universe','Identitet, legacy, mysterier, ekonomi, lyx, media och creator mode.','','UNIVERSE',tabs+content);
}
function setBackground(n){state.identity.background=n;state.legacy.legacyScore+=2;toastMsg('Bakgrund: '+n);save();updateUniverseHud();openUniverseHub('identity')}
function cyclePersonality(){let i=personalityOptions.indexOf(state.identity.personality);state.identity.personality=personalityOptions[(i+1)%personalityOptions.length];save();toastMsg(state.identity.personality);openUniverseHub('identity')}
function cyclePublicImage(){let i=publicImages.indexOf(state.identity.publicImage);state.identity.publicImage=publicImages[(i+1)%publicImages.length];save();updateUniverseHud();openUniverseHub('identity')}
function setHeir(){let n=prompt('Namn på framtida arvtagare:');if(!n)return;state.legacy.heir=n.slice(0,20);state.legacy.legacyScore+=5;save();openUniverseHub('legacy')}
function previewNewGamePlus(){toastMsg('New Game+ kräver Prestige 2 och Legacy 250.')}
function chooseMentor(){let opts=['Mara · Fixer','Viktor · Business','Nova · Social','Raven · Underground'];let cur=opts.findIndex(x=>x.startsWith(state.mentor||''));state.mentor=opts[(cur+1)%opts.length].split(' · ')[0];state.legacy.legacyScore+=3;save();toastMsg('Mentor: '+state.mentor);openUniverseHub('legacy')}
function investigateMystery(){if(state.energy<10)return toastMsg('För lite stamina.');state.energy-=10;state.mystery.clues++;if(state.mystery.clues%3===0)state.mystery.chapter++;state.legacy.legacyScore+=2;toastMsg('Ny ledtråd hittad.');save();renderStats();updateUniverseHud();openUniverseHub('mystery')}
function searchSecret(id){let s=state.secrets.find(x=>x.id===id);if(!s||s.found)return;let chance=35+state.skills.street*4;if(Math.random()*100<chance){s.found=true;state.mystery.clues+=2;toastMsg('Hemlighet upptäckt!')}else toastMsg('Inget hittades.');save();openUniverseHub('mystery')}
function unlockUndercity(){if(state.mystery.clues<5)return toastMsg('Du behöver fler ledtrådar.');if(!state.unlockedDistricts.includes('Undercity'))state.unlockedDistricts.push('Undercity');toastMsg('Undercity upplåst.');save();openUniverseHub('mystery')}
function takeLoan(){if(state.creditScore<450)return toastMsg('Kreditvärdighet för låg.');let amount=5000;state.cash+=amount;state.loans.push({amount,balance:5750});state.creditScore=Math.max(300,state.creditScore-8);save();renderStats();toastMsg('Lån '+money(amount));openUniverseHub('economy')}
function buyStock(i){let s=state.stocks[i];if(!s)return;if(state.cash<s.price)return toastMsg('Du har inte råd.');state.cash-=s.price;s.owned++;save();renderStats();openUniverseHub('economy')}
function buyToken(){let cost=state.token.price*10;if(state.cash<cost)return toastMsg('Du har inte råd.');state.cash-=cost;state.token.owned+=10;save();renderStats();openUniverseHub('economy')}
function bidAuction(){let a=state.auctionItems[0];if(!a)return;if(state.cash<a.bid+500)return toastMsg('Du har inte råd.');a.bid+=500;toastMsg('Bud lagt: '+money(a.bid));save();openUniverseHub('economy')}
function buyWardrobe(){let styles=['Luxury','Business','Minimalist','Nightlife','Old Money'];let next=styles.find(x=>!state.wardrobe.includes(x));if(!next)return toastMsg('Alla stilar ägs.');if(state.cash<1800)return toastMsg('Du har inte råd.');state.cash-=1800;state.wardrobe.push(next);state.respect+=1;save();renderStats();openUniverseHub('luxury')}
function buyLuxury(){if(state.cash<5000)return toastMsg('Du har inte råd.');let items=['Noir Watch','Rare Vinyl','Modern Art','Private Club Card'];let next=items.find(x=>!state.luxuryCollection.includes(x))||('Collector Piece '+(state.luxuryCollection.length+1));state.cash-=5000;state.luxuryCollection.push(next);state.respect+=2;save();renderStats();openUniverseHub('luxury')}
function buyCollectionCar(){if(state.cash<12000)return toastMsg('Du har inte råd.');state.cash-=12000;state.garageCollection.push('Haven GT '+(state.garageCollection.length+1));state.respect+=3;save();renderStats();openUniverseHub('luxury')}
function buyInteriorItem(){if(state.cash<1200)return toastMsg('Du har inte råd.');let items=['Designer Lamp','Noir Sofa','Glass Table','Vinyl Wall'];state.cash-=1200;state.interiorItems.push(items[state.interiorItems.length%items.length]);let lot=getSelectedLot();if(lot)lot.comfort=Math.min(100,(lot.comfort||0)+3);save();renderStats();openUniverseHub('luxury')}
function growRadio(){state.radioStation.fans+=50+Math.round(state.respect*.2);state.publicPower+=1;toastMsg('Radioshow sänd.');save();openUniverseHub('media')}
function seedRumor(){let r='En anonym maktspelare syns allt oftare i '+currentDistrict()+'.';state.rumors.unshift({text:r,truth:false,heat:1});state.identity.publicImage='Skuggfigur';save();toastMsg('Ryktet sprids.');openUniverseHub('media')}
function recordPodcast(){let ep='Avsnitt '+(state.podcastEpisodes.length+1)+': '+currentDistrict();state.podcastEpisodes.unshift(ep);state.publicPower+=2;save();toastMsg('Podcast publicerad.');openUniverseHub('media')}
function togglePhotoMode(){state.photoMode=!state.photoMode;document.querySelector('.hud')?.classList.toggle('hidden',state.photoMode);document.querySelector('.bottom')?.classList.toggle('hidden',state.photoMode);save();toastMsg('Photo Mode '+(state.photoMode?'på':'av'));openUniverseHub('media')}
function createCustomNpc(){let n=prompt('Namn på NPC:');if(!n)return;state.creatorMode.customNpcs.push({name:n.slice(0,20),role:'Custom'});save();openUniverseHub('creator')}
function createCustomEvent(){let n=prompt('Namn på event:');if(!n)return;state.creatorMode.customEvents.push({name:n.slice(0,24)});save();openUniverseHub('creator')}
function createCustomBusiness(){let n=prompt('Namn på företag:');if(!n)return;state.creatorMode.customBusinesses.push({name:n.slice(0,24)});save();openUniverseHub('creator')}
function universeTick(){
 // soft dynamic economy and calendar
 state.stocks.forEach((s,i)=>{let drift=Math.sin(Date.now()/70000+i)*.015;s.price=Math.max(5,s.price*(1+drift*.02))});
 state.token.price=Math.max(1,state.token.price*(1+Math.sin(Date.now()/90000)*.0008));
 state.legacy.legacyScore=Math.round((state.respect+controlledTerritories()*20+state.businesses.length*10+state.prestige*50)/2);
 if(state.respect>120&&!state.playerTitles.includes('Street Legend'))state.playerTitles.push('Street Legend');
 if(state.businesses.length>=5&&!state.playerTitles.includes('Property Baron'))state.playerTitles.push('Property Baron');
 state.showcase.title=state.playerTitles[state.playerTitles.length-1];
}

const careerCatalog=[
 {id:'fixer',name:'Fixer',bonus:'Bättre relationer och kontrakt',desc:'Bygger nätverk, kontakter och tillgång till exklusiva uppdrag.'},
 {id:'boss',name:'Street Boss',bonus:'Mer territory-respekt',desc:'Fokuserar på kontroll av stadsdelar och crew-lojalitet.'},
 {id:'smuggler',name:'Runner',bonus:'Bättre marknadspriser',desc:'Specialiserar sig på handel, logistik och rörlighet.'},
 {id:'kingpin',name:'Business Kingpin',bonus:'Högre företagsinkomst',desc:'Bygger lagliga och fiktiva verksamheter till ett imperium.'},
 {id:'operator',name:'Social Operator',bonus:'Klubb- och relationsbonus',desc:'Vinner inflytande via nattliv, status och sociala kontakter.'}
];
const safehouseCatalog=[
 {id:'starter_safe',name:'Backroom Flat',district:'Förorten',cost:0,storage:12,security:1},
 {id:'dock_safe',name:'Dockside Loft',district:'Hamnen',cost:12000,storage:24,security:2},
 {id:'old_safe',name:'Old Quarter Townhouse',district:'Old Quarter',cost:26000,storage:36,security:3},
 {id:'sky_safe',name:'Skyline Penthouse',district:'North Heights',cost:70000,storage:50,security:5}
];
const empireBusinessCatalog=[
 {id:'club_biz',name:'Nattklubb',cost:22000,income:1800,rep:6},
 {id:'garage_biz',name:'Verkstad',cost:15000,income:1100,rep:4},
 {id:'restaurant_biz',name:'Restaurang',cost:18000,income:1400,rep:5},
 {id:'security_biz',name:'Säkerhetsfirma',cost:32000,income:2400,rep:7},
 {id:'hotel_biz',name:'Hotell',cost:52000,income:3900,rep:10},
 {id:'holding_biz',name:'Holdingbolag',cost:90000,income:7200,rep:15}
];

function controlledTerritories(){
 return Object.values(state.territories||{}).filter(x=>x==='Du').length;
}
function updateEmpireHud(){
 let c=document.getElementById('careerHud'),t=document.getElementById('territoryHud'),
 cr=document.getElementById('crewHud'),p=document.getElementById('prestigeHud');
 if(c)c.textContent=state.career?careerCatalog.find(x=>x.id===state.career)?.name||state.career:'Ingen';
 if(t)t.textContent=controlledTerritories();
 if(cr)cr.textContent=state.crew.length;
 if(p)p.textContent=state.prestige;
}
function currentDistrict(){
 let d=districts.find(d=>state.x>=d.x&&state.x<=d.x+d.w&&state.y>=d.y&&state.y<=d.y+d.h);
 return d?d.name:'Central District';
}
function openEmpireHub(tab='territory'){
 let tabs=`<div class="browserTabs">
 <button class="btn ${tab==='territory'?'blue':'alt'}" onclick="openEmpireHub('territory')">TERRITORY</button>
 <button class="btn ${tab==='crew'?'blue':'alt'}" onclick="openEmpireHub('crew')">CREW</button>
 <button class="btn ${tab==='career'?'blue':'alt'}" onclick="openEmpireHub('career')">CAREER</button>
 <button class="btn ${tab==='safe'?'blue':'alt'}" onclick="openEmpireHub('safe')">SAFEHOUSES</button>
 <button class="btn ${tab==='relations'?'blue':'alt'}" onclick="openEmpireHub('relations')">RELATIONER</button>
 <button class="btn ${tab==='biz'?'blue':'alt'}" onclick="openEmpireHub('biz')">FÖRETAG</button>
 </div>`;
 let content='';
 if(tab==='territory'){
   content=`<div class="territoryGrid">${districts.map(d=>{
     let rep=state.districtRep[d.name]||0,owner=state.territories[d.name]||'Neutral';
     return `<div class="territoryCard"><h4>${d.name}</h4><p>Kontroll: <b>${owner}</b><br>Ditt rykte: ${rep}/100</p>
      <div class="repBarX"><i style="width:${Math.min(100,rep)}%"></i></div>
      <button class="btn" onclick="pushTerritory('${d.name}')">BYGG INFLYTANDE</button></div>`
   }).join('')}</div>`;
 } else if(tab==='crew'){
   content=`<div class="crewGrid">${state.crew.map((m,i)=>`<div class="crewCard"><h4>${m.name}</h4><p>${m.role} · Skill ${m.skill}<br>Lojalitet ${m.loyalty}% · ${m.status}</p>
   <button class="btn alt" onclick="trainCrew(${i})">TRÄNA</button><button class="btn" onclick="boostLoyalty(${i})">BYGG LOJALITET</button></div>`).join('')}
   <div class="crewCard"><h4>Rekrytera</h4><p>Hitta nya crew-medlemmar genom ditt nätverk.</p><button class="btn" onclick="recruitCrew()">REKRYTERA 2 500 kr</button></div></div>`;
 } else if(tab==='career'){
   content=`<div class="careerGrid">${careerCatalog.map(c=>`<div class="careerCard"><h4>${c.name}</h4><p>${c.desc}<br><span class="empireBadge">${c.bonus}</span></p>
   <button class="btn ${state.career===c.id?'alt':''}" onclick="selectCareer('${c.id}')">${state.career===c.id?'VALD':'VÄLJ'}</button></div>`).join('')}</div>`;
 } else if(tab==='safe'){
   content=`<div class="safeGrid">${safehouseCatalog.map(s=>{
    let own=state.safehouses.some(x=>x.id===s.id&&x.owned);
    return `<div class="safeCard"><h4>${s.name}</h4><p>${s.district}<br>Lager ${s.storage} · Säkerhet ${s.security}</p>
    ${own?'<span class="empireBadge">ÄGD</span>':`<button class="btn" onclick="buySafehouse('${s.id}')">KÖP ${money(s.cost)}</button>`}</div>`
   }).join('')}</div>`;
 } else if(tab==='relations'){
   content=`<div class="relationGrid">${Object.entries(state.relationships).map(([n,r])=>`<div class="relationCard"><h4>${n}</h4><p>${r.status}<br>Trust ${r.trust} · Fear ${r.fear}</p>
   <button class="btn alt" onclick="improveRelation('${n}')">BYGG TRUST</button></div>`).join('')}</div>`;
 } else {
   content=`<div class="empireBizGrid">${empireBusinessCatalog.map(b=>{
    let own=state.empireHoldings.some(x=>x.id===b.id);
    return `<div class="empireBizCard"><h4>${b.name}</h4><p>Kostnad ${money(b.cost)}<br>Daglig inkomst ${money(b.income)} · Status +${b.rep}</p>
    ${own?'<span class="empireBadge">ÄGS</span>':`<button class="btn" onclick="buyEmpireBusiness('${b.id}')">KÖP</button>`}</div>`
   }).join('')}</div>`;
 }
 openSheet('Empire & Territory','Bygg makt genom stadsdelar, crew, karriär, relationer, safehouses och företag.','','EMPIRE',tabs+content);
}
function pushTerritory(name){
 let rep=state.districtRep[name]||0;
 if(state.energy<12)return toastMsg('För lite stamina.');
 state.energy-=12;
 let gain=6+(state.career==='boss'?3:0);
 state.districtRep[name]=Math.min(100,rep+gain);
 state.streetCred+=1;
 state.respect+=1;
 state.dailyContracts[2].progress=Math.min(state.dailyContracts[2].target,state.dailyContracts[2].progress+1);
 if(state.districtRep[name]>=70){
   state.territories[name]='Du';
   state.newsFeed.unshift({title:'Maktskifte i '+name,text:'En ny aktör har tagit kontroll över området.',day:state.day});
 }
 applyCrossWorldEffects('empire',1);logWorldAction('empire','Inflytande i '+name,1);toastMsg(name+' +'+gain+' inflytande');
 save();renderStats();updateEmpireHud();openEmpireHub('territory');
}
function recruitCrew(){
 if(state.cash<2500)return toastMsg('Du har inte råd.');
 let names=['Ash','Milo','Sable','Vera','Knox','Iris'];
 let roles=['Scout','Driver','Fixer','Enforcer','Broker'];
 let n=names.find(x=>!state.crew.some(c=>c.name===x))||('Crew'+(state.crew.length+1));
 state.cash-=2500;
 state.crew.push({name:n,role:roles[Math.floor(Math.random()*roles.length)],loyalty:35,skill:1,status:'Aktiv'});
 toastMsg(n+' rekryterad.');
 save();renderStats();updateEmpireHud();openEmpireHub('crew');
}
function trainCrew(i){
 let m=state.crew[i];if(!m)return;
 if(state.cash<1200)return toastMsg('Du har inte råd.');
 state.cash-=1200;m.skill=Math.min(10,m.skill+1);m.loyalty=Math.max(0,m.loyalty-2);
 toastMsg(m.name+' tränad.');
 save();renderStats();openEmpireHub('crew');
}
function boostLoyalty(i){
 let m=state.crew[i];if(!m)return;
 if(state.cash<700)return toastMsg('Du har inte råd.');
 state.cash-=700;m.loyalty=Math.min(100,m.loyalty+8);
 toastMsg(m.name+' lojalitet +8');
 save();renderStats();openEmpireHub('crew');
}
function selectCareer(id){
 state.career=id;state.careerXp+=5;toastMsg('Karriär vald: '+careerCatalog.find(x=>x.id===id).name);
 save();updateEmpireHud();openEmpireHub('career');
}
function buySafehouse(id){
 let s=safehouseCatalog.find(x=>x.id===id);if(!s)return;
 if(state.cash<s.cost)return toastMsg('Du har inte råd.');
 state.cash-=s.cost;state.safehouses.push({...s,owned:true});state.respect+=2+s.security;
 toastMsg(s.name+' köpt.');
 save();renderStats();openEmpireHub('safe');
}
function improveRelation(name){
 let r=state.relationships[name];if(!r)return;
 if(state.cash<500)return toastMsg('Du har inte råd.');
 state.cash-=500;r.trust=Math.min(100,r.trust+7);r.status=r.trust>70?'Lojal':r.trust>45?'Vänlig':'Avvaktande';
 toastMsg(name+' trust +7');save();renderStats();openEmpireHub('relations');
}
function buyEmpireBusiness(id){
 let b=empireBusinessCatalog.find(x=>x.id===id);if(!b)return;
 if(state.cash<b.cost)return toastMsg('Du har inte råd.');
 state.cash-=b.cost;state.empireHoldings.push({...b});state.businesses.push({name:b.name,value:b.cost,income:b.income});state.respect+=b.rep;
 state.newsFeed.unshift({title:'Nytt företag öppnar',text:b.name+' har fått en ny ägare i Black Haven.',day:state.day});
 applyCrossWorldEffects('empire',2);logWorldAction('empire','Köpte '+b.name,2);toastMsg(b.name+' köpt.');
 save();renderStats();openEmpireHub('biz');
}
function openLifeHub(){
 let n=state.needs;
 openSheet('Life & Lifestyle','Din karaktär har nu enklare behov, status och livsstil.','','LIFE',
 `<div class="needGrid">
  ${Object.entries(n).map(([k,v])=>`<div class="needBox"><b>${k.toUpperCase()}</b><span>${Math.round(v)}/100</span><div class="repBarX"><i style="width:${v}%"></i></div></div>`).join('')}
 </div>
 <div class="grid">
  <div class="card"><b>Vila</b><span> Återställ sömn och sänk stress.</span><br><br><button class="btn" onclick="lifeAction('rest')">VILA</button></div>
  <div class="card"><b>Ät</b><span> Höj hungerstatus.</span><br><br><button class="btn" onclick="lifeAction('eat')">ÄT 150 kr</button></div>
  <div class="card"><b>Socialisera</b><span> Höj socialt behov och relationer.</span><br><br><button class="btn" onclick="lifeAction('social')">SOCIALISERA 250 kr</button></div>
  <div class="card"><b>Komfort</b><span> Boende och inredning påverkar komfort.</span><br><br><button class="btn alt" onclick="openHousingBuilder()">BO & BYGG</button></div>
 </div>`);
}
function lifeAction(type){
 if(type==='rest'){state.needs.sleep=Math.min(100,state.needs.sleep+28);state.needs.stress=Math.max(0,state.needs.stress-18);state.energy=Math.min(100,state.energy+25)}
 if(type==='eat'){if(state.cash<150)return toastMsg('Du har inte råd.');state.cash-=150;state.needs.hunger=Math.min(100,state.needs.hunger+30)}
 if(type==='social'){if(state.cash<250)return toastMsg('Du har inte råd.');state.cash-=250;state.needs.social=Math.min(100,state.needs.social+25);Object.values(state.relationships).forEach(r=>r.trust=Math.min(100,r.trust+1))}
 applyCrossWorldEffects('life',1);logWorldAction('life','Life action: '+type,1);toastMsg('Livsstil uppdaterad.');save();renderStats();openLifeHub();
}
function openContracts(){
 let daily=state.dailyContracts.map((c,i)=>`<div class="contractCard"><h4>${c.name}</h4><p>${c.progress}/${c.target} · Belöning ${money(c.reward)}</p>
 <button class="btn" onclick="claimDailyContract(${i})">${c.claimed?'HÄMTAD':c.progress>=c.target?'HÄMTA':'PÅGÅR'}</button></div>`).join('');
 let weekly=state.weeklyContracts.map((c,i)=>`<div class="contractCard"><h4>${c.name}</h4><p>${c.progress}/${c.target} · Belöning ${money(c.reward)}</p>
 <button class="btn" onclick="claimWeeklyContract(${i})">${c.claimed?'HÄMTAD':c.progress>=c.target?'HÄMTA':'PÅGÅR'}</button></div>`).join('');
 openSheet('Contracts','Dagliga och veckovisa uppdrag som ger anledning att återvända.','','CONTRACTS',`<div class="contractGrid">${daily}${weekly}</div>`);
}
function claimDailyContract(i){
 let c=state.dailyContracts[i];if(!c||c.claimed||c.progress<c.target)return toastMsg('Inte klar ännu.');
 c.claimed=true;state.cash+=c.reward;toastMsg('Belöning '+money(c.reward));save();renderStats();openContracts();
}
function claimWeeklyContract(i){
 let c=state.weeklyContracts[i];if(!c||c.claimed||c.progress<c.target)return toastMsg('Inte klar ännu.');
 c.claimed=true;state.cash+=c.reward;toastMsg('Veckobelöning '+money(c.reward));save();renderStats();openContracts();
}
function openNews(){
 openSheet('Black Haven News','Staden rapporterar om händelser du själv påverkar.','','NEWS',
 `<div class="newsGrid">${state.newsFeed.slice(0,12).map(n=>`<div class="newsCard"><h4>${n.title}</h4><p>Dag ${n.day}<br>${n.text}</p></div>`).join('')}</div>`);
}
function openMegaPhone(){
 openSheet('Black Haven Mobile','Din telefon är navet för hela staden.','','PHONE',
 `<div class="phoneMegaGrid">
  <button onclick="closeSheet();openBank()">🏦<br>Bank</button>
  <button onclick="closeSheet();openPhone()">💬<br>Meddelanden</button>
  <button onclick="closeSheet();openCrimeHub()">🕶️<br>Street Hub</button>
  <button onclick="closeSheet();openEmpireHub()">👑<br>Empire</button>
  <button onclick="closeSheet();openHousingBuilder()">🏠<br>Bo & Bygg</button>
  <button onclick="closeSheet();openLifeHub()">❤️<br>Life</button>
  <button onclick="closeSheet();openContracts()">📋<br>Contracts</button>
  <button onclick="closeSheet();openNews()">📰<br>News</button>
  <button onclick="closeSheet();openUniverseHub()">🌌<br>Universe</button>
  <button onclick="closeSheet();openThreeWorlds()">🔺<br>Three Worlds</button>
 </div>`);
}
function dynamicEconomyTick(){
 let t=(Math.sin(Date.now()/60000)+1)/2;
 state.dynamicPrices.Glow=.85+t*.3;
 state.dynamicPrices.Volt=.9+(1-t)*.25;
 state.dynamicPrices.Velvet=.8+Math.abs(.5-t)*.5;
}
function worldNeedTick(dt){
 let f=dt/1000;
 state.needs.sleep=Math.max(0,state.needs.sleep-f*.025);
 state.needs.hunger=Math.max(0,state.needs.hunger-f*.03);
 state.needs.social=Math.max(0,state.needs.social-f*.012);
 state.needs.stress=Math.min(100,state.needs.stress+f*.008);
 let lot=getSelectedLot();state.needs.comfort=Math.min(100,35+(lot?.comfort||0)*.65);
}
function maybePrestige(){
 if(state.respect>=500 && state.prestige<1){
   state.prestige=1;
   state.newsFeed.unshift({title:'Nytt namn i eliten',text:'En spelare har nått Prestige 1.',day:state.day});
   toastMsg('PRESTIGE 1 upplåst!');
 }
}

const crimeCatalog=[
 {id:'street',name:'Street Hustle',energy:8,reward:[250,600],respect:1,heat:2,base:88,req:0,risk:'Låg',desc:'Ett snabbt abstrakt gatujobb. Liten utdelning, låg risk.'},
 {id:'warehouse',name:'Warehouse Score',energy:16,reward:[800,1700],respect:3,heat:5,base:74,req:8,risk:'Medel',desc:'Ett fiktivt lagerjobb med högre krav och bättre utdelning.'},
 {id:'night',name:'Midnight Run',energy:22,reward:[1500,3200],respect:5,heat:8,base:63,req:18,risk:'Medel',desc:'Ett nattligt uppdrag där kontakter och street cred spelar större roll.'},
 {id:'vault',name:'Digital Vault',energy:32,reward:[3000,7000],respect:8,heat:14,base:49,req:38,risk:'Hög',desc:'Ett helt fiktivt high-tier score. Hög belöning och hög konsekvensrisk.'},
 {id:'syndicate',name:'Syndicate Job',energy:44,reward:[6500,13000],respect:13,heat:21,base:37,req:70,risk:'Extrem',desc:'Endgame-jobb för etablerade spelare. Kräver stark progression.'}
];

const contrabandCatalog=[
 {id:'Glow',price:450,energy:14,heat:2,desc:'Fiktiv klubbvara. Ger tillfällig stamina i spelet.'},
 {id:'Volt',price:850,energy:24,heat:4,desc:'Fiktiv high-tier booster för längre spelsessioner.'},
 {id:'Velvet',price:1350,energy:36,heat:7,desc:'Sällsynt fiktiv vara med stor stamina-effekt men mer Heat.'}
];

const clubCatalog=[
 {id:'basement',name:'Basement 13',fee:150,cred:1,desc:'Billig klubb med många nya kontakter.'},
 {id:'neon',name:'Neon Club',fee:500,cred:3,desc:'Stadens centrala nattklubb. Bättre nätverk och högre status.'},
 {id:'velvet',name:'Velvet Lounge',fee:1200,cred:6,desc:'Exklusiv klubb för spelare med större bankroll.'}
];

function nowGameMs(){ return Date.now(); }
function isRestricted(){
 let now=nowGameMs();
 if(state.arrestedUntil>now) return {type:'arresterad',left:Math.ceil((state.arrestedUntil-now)/1000)};
 if(state.hospitalUntil>now) return {type:'på sjukhus',left:Math.ceil((state.hospitalUntil-now)/1000)};
 return null;
}
function crimeChance(c){
 let skill=(state.skills.street||1)*2.2;
 let cred=(state.streetCred||0)*.28;
 let heatPenalty=Math.max(0,(state.heat-30)*.22);
 return Math.max(12,Math.min(95,Math.round(c.base+skill+cred-heatPenalty+threeWorldCrimeBonus())));
}
function randomBetween(a,b){return Math.floor(a+Math.random()*(b-a+1))}
function openCrimeHub(tab='crimes'){
 let restriction=isRestricted();
 let restricted=restriction?`<div class="lockNotice">Du är ${restriction.type}. Cirka ${restriction.left}s återstår innan Street Hub öppnas igen.</div><br>`:'';
 let tabs=`<div class="browserTabs">
   <button class="btn ${tab==='crimes'?'blue':'alt'}" onclick="openCrimeHub('crimes')">BROTT</button>
   <button class="btn ${tab==='clubs'?'blue':'alt'}" onclick="openCrimeHub('clubs')">KLUBBAR</button>
   <button class="btn ${tab==='market'?'blue':'alt'}" onclick="openCrimeHub('market')">CONTRABAND</button>
   <button class="btn ${tab==='season'?'blue':'alt'}" onclick="openCrimeHub('season')">SÄSONG</button>
 </div>`;

 let content='';
 if(tab==='crimes'){
   content=`<div class="crimeGrid">`+crimeCatalog.map(c=>{
      let chance=crimeChance(c),locked=state.streetCred<c.req;
      let riskClass=c.risk==='Låg'?'riskLow':c.risk==='Medel'?'riskMid':'riskHigh';
      return `<div class="crimeCard"><h4>${c.name}</h4>
        <p>${c.desc}</p>
        <div class="buildTiny">Stamina ${c.energy} · Belöning ${money(c.reward[0])}–${money(c.reward[1])}<br>
        Chans: <b>${chance}%</b> · Risk: <span class="${riskClass}">${c.risk}</span> · Kräver cred ${c.req}</div><br>
        <button class="btn ${locked?'alt':''}" ${locked||restriction?'disabled':''} onclick="runCrime('${c.id}')">${locked?'LÅST':'KÖR JOBBET'}</button>
      </div>`;
   }).join('')+`</div>`;
 } else if(tab==='clubs'){
   content=`<div class="clubGrid">`+clubCatalog.map(c=>`<div class="clubCard"><h4>${c.name}</h4><p>${c.desc}</p>
      <div class="buildTiny">Entré ${money(c.fee)} · Street cred +${c.cred}</div><br>
      <button class="btn" ${restriction?'disabled':''} onclick="visitCrimeClub('${c.id}')">GÅ IN</button></div>`).join('')+`</div>`;
 } else if(tab==='market'){
   content=`<div class="contrabandGrid">`+contrabandCatalog.map(c=>`<div class="contrabandCard"><h4>${c.id}</h4><p>${c.desc}</p>
      <div class="buildTiny">Pris ${money(c.price)} · Stamina +${c.energy} · Heat +${c.heat}<br>Du äger: ${state.contraband[c.id]||0}</div><br>
      <button class="btn" ${restriction?'disabled':''} onclick="buyContraband('${c.id}')">KÖP</button>
      <button class="btn alt" onclick="useContraband('${c.id}')">ANVÄND</button></div>`).join('')+`</div>`;
 } else {
   let rivals=[...state.seasonRivals,{name:'DU',score:state.crimeSeason.score}].sort((a,b)=>b.score-a.score);
   content=`<div class="card"><span class="seasonRank">#${state.crimeSeason.rank}</span><div class="seasonSub">Season score ${state.crimeSeason.score} · Dag ${state.crimeSeason.day}/${state.crimeSeason.length}</div></div><br>
   <div class="grid">${rivals.map((r,i)=>`<div class="card"><b>#${i+1} ${r.name}</b><span>${r.score} season score</span></div>`).join('')}</div>`;
 }
 openSheet('Street Hub','Crime Season är Black Havens browser-crime-läge. Alla brott och contraband-system är fiktiva och abstrakta spelmekaniker.','','THREE WORLDS LAYOUT FIX',restricted+tabs+content);
}
function runCrime(id){
 let c=crimeCatalog.find(x=>x.id===id); if(!c)return;
 let restriction=isRestricted(); if(restriction)return toastMsg('Du är '+restriction.type+'.');
 if(state.streetCred<c.req)return toastMsg('För låg street cred.');
 if(state.energy<c.energy)return toastMsg('För lite stamina.');
 let cooldown=state.crimeCooldowns[id]||0;
 if(cooldown>Date.now())return toastMsg('Jobbet är på cooldown.');
 state.energy-=c.energy;
 state.crimeSeason.crimesDone++; if(state.dailyContracts&&state.dailyContracts[0])state.dailyContracts[0].progress=Math.min(state.dailyContracts[0].target,state.dailyContracts[0].progress+1); applyCrossWorldEffects('crime',1); logWorldAction('crime',c.name,1);
 let chance=crimeChance(c);
 let success=Math.random()*100<chance;
 if(success){
   let reward=randomBetween(c.reward[0],c.reward[1]);
   let score=Math.round(c.respect*18+reward/120);
   state.cash+=reward;
   state.respect+=c.respect;
   state.streetCred+=Math.max(1,Math.round(c.respect*.75));
   state.heat=Math.min(100,state.heat+c.heat);
   state.crimeSeason.successfulCrimes++;
   state.crimeSeason.score+=score;
   gainXp(Math.max(4,c.respect*3));
   toastMsg('Lyckat · +'+money(reward)+' · +'+score+' season score');
 } else {
   state.crimeSeason.failedCrimes++;
   state.heat=Math.min(100,state.heat+c.heat+5);
   state.crimeSeason.score=Math.max(0,state.crimeSeason.score-10);
   let roll=Math.random();
   if(roll<.34){
      state.arrestedUntil=Date.now()+12000;
      toastMsg('Misslyckat · arresterad i 12 sekunder');
   } else if(roll<.58){
      state.hospitalUntil=Date.now()+9000;
      state.hp=Math.max(15,state.hp-35);
      toastMsg('Misslyckat · sjukhus i 9 sekunder');
   } else {
      state.cash=Math.max(0,state.cash-Math.min(state.cash,Math.round(c.reward[0]*.25)));
      toastMsg('Misslyckat · du tappade resurser');
   }
 }
 state.crimeCooldowns[id]=Date.now()+3500+c.energy*90;
 recalcSeasonRank();
 save();renderStats();updateCrimeSeasonUI();openCrimeHub('crimes');
}
function recalcSeasonRank(){
 let score=state.crimeSeason.score||0;
 state.crimeSeason.rank=Math.max(1,128-Math.floor(score/70));
}
function visitCrimeClub(id){
 let c=clubCatalog.find(x=>x.id===id);if(!c)return;
 if(isRestricted())return toastMsg('Inte tillgängligt just nu.');
 if(state.cash<c.fee)return toastMsg('Du har inte råd med entrén.');
 state.cash-=c.fee;state.streetCred+=c.cred;state.clubVisits++; if(state.dailyContracts&&state.dailyContracts[1])state.dailyContracts[1].progress=Math.min(state.dailyContracts[1].target,state.dailyContracts[1].progress+1); applyCrossWorldEffects('life',1); logWorldAction('life','Besökte '+c.name,1);
 state.energy=Math.min(100,state.energy+6);
 state.crimeSeason.score+=c.cred*4;recalcSeasonRank();
 toastMsg(c.name+' · +'+c.cred+' street cred');
 save();renderStats();openCrimeHub('clubs');
}
function buyContraband(id){
 let c=contrabandCatalog.find(x=>x.id===id);if(!c)return;
 if(isRestricted())return toastMsg('Inte tillgängligt just nu.');
 if(state.cash<c.price)return toastMsg('Du har inte råd.');
 state.cash-=c.price;state.contraband[id]=(state.contraband[id]||0)+1;
 toastMsg(id+' köpt.');
 save();renderStats();openCrimeHub('market');
}
function useContraband(id){
 let c=contrabandCatalog.find(x=>x.id===id);if(!c)return;
 if((state.contraband[id]||0)<=0)return toastMsg('Du har ingen '+id+'.');
 state.contraband[id]--;
 state.energy=Math.min(100,state.energy+c.energy);
 state.heat=Math.min(100,state.heat+c.heat);
 toastMsg(id+' använd · +'+c.energy+' stamina');
 save();renderStats();openCrimeHub('market');
}
function updateCrimeSeasonUI(){
 if(!state.crimeSeason)return;
 let rank=document.getElementById('seasonRank'),score=document.getElementById('seasonScore'),
 cred=document.getElementById('streetCred'),day=document.getElementById('seasonDay'),prog=document.getElementById('seasonProgress');
 if(rank)rank.textContent='#'+state.crimeSeason.rank;
 if(score)score.textContent=state.crimeSeason.score;
 if(cred)cred.textContent=state.streetCred;
 if(day)day.textContent=state.crimeSeason.day;
 if(prog)prog.style.width=Math.min(100,state.crimeSeason.score/20)+'%';
}

const builderCatalog=[
 {id:'core',name:'Grundhus',cost:0,comfort:12,value:4000,kind:'room',desc:'Ett litet starthem med hall och sovdel.'},
 {id:'kitchen',name:'Kök',cost:3500,comfort:9,value:3800,kind:'room',desc:'Ger bättre vardagskänsla och ökar komforten.'},
 {id:'bedroom',name:'Sovrum',cost:4200,comfort:11,value:4500,kind:'room',desc:'Ett riktigt sovrum höjer komfort och status.'},
 {id:'bathroom',name:'Badrum',cost:3200,comfort:8,value:3400,kind:'room',desc:'Nödvändigt för ett mer komplett hem.'},
 {id:'lounge',name:'Vardagsrum',cost:5600,comfort:13,value:5200,kind:'room',desc:'Skapar mer livssim-känsla och social yta.'},
 {id:'office',name:'Kontor',cost:6000,comfort:7,value:6800,kind:'room',desc:'Plats för planering, jobb och kontroll.'},
 {id:'terrace',name:'Terrass',cost:5200,comfort:8,value:5000,kind:'addon',desc:'Modern terrass med kvällsljus.'},
 {id:'garden',name:'Trädgård',cost:2800,comfort:10,value:2600,kind:'garden',desc:'Buskar, träd och en mjukare hemmakänsla.'},
 {id:'pool',name:'Liten pool',cost:9000,comfort:14,value:9500,kind:'garden',desc:'Lyxig detalj som höjer värde och status.'}
];
const lotPurchaseInfo={
 starter:{cost:0,label:'Ingår från start'},
 canal:{cost:18000,label:'Vid kanalen'},
 heights:{cost:52000,label:'Utsikt över skyline'}
};

function getSelectedLot(){
 let lot=state.homeLots.find(l=>l.id===state.selectedLotId);
 return lot||state.homeLots[0];
}
function lotDesignScore(lot){
 let styleBase={Nordic:42,Modern:58,Luxury:78,Neon:66}[lot.style]||40;
 return Math.min(100,styleBase + lot.modules.length*4 + (lot.garden||0)*4);
}
function lotCompletion(lot){
 return Math.min(100,20 + lot.modules.length*11 + (lot.garden||0)*8);
}
function housingNetWorth(){
 return state.homeLots.reduce((s,l)=>s+(l.owned?(l.value||0):0),0);
}
function updateHousingUI(){
 let lot=getSelectedLot();
 if(!lot)return;
 let current=document.getElementById('housingCurrentLot');
 let summary=document.getElementById('homeSummary');
 let meter=document.getElementById('homeMeter');
 let comfortTxt=document.getElementById('homeComfortTxt');
 let comfortBar=document.getElementById('homeComfortBar');
 let styleTxt=document.getElementById('homeStyleTxt');
 let styleBar=document.getElementById('homeStyleBar');
 let valueTxt=document.getElementById('homeValueTxt');
 let valueBar=document.getElementById('homeValueBar');

 if(current)current.textContent=lot.name+(lot.owned?' · Ägd':' · Låst');
 if(summary)summary.textContent=lot.modules.length+' delar · '+(lot.garden||0)+' trädgårdsdelar';
 if(meter)meter.style.width=lotCompletion(lot)+'%';
 if(comfortTxt)comfortTxt.textContent=Math.round(lot.comfort||0);
 if(comfortBar)comfortBar.style.width=Math.min(100,(lot.comfort||0))+'%';
 if(styleTxt)styleTxt.textContent=lot.style||'Nordic';
 if(styleBar)styleBar.style.width=lotDesignScore(lot)+'%';
 if(valueTxt)valueTxt.textContent=money(lot.value||0);
 if(valueBar)valueBar.style.width=Math.min(100,(lot.value||0)/1200)+'%';
}
function openHousingBuilder(){
 let lotCards=state.homeLots.map(l=>{
   let info=lotPurchaseInfo[l.id]||{cost:0,label:''};
   return `<div class="lotCard">
     <b>${l.name}</b>
     <span>${info.label}<br>Stil: ${l.style}<br>Moduler: ${l.modules.length} · Komfort: ${Math.round(l.comfort||0)} · Värde: ${money(l.value||0)}</span><br><br>
     <button class="btn ${state.selectedLotId===l.id?'blue':'alt'}" onclick="selectLot('${l.id}')">${state.selectedLotId===l.id?'VALD':'VÄLJ'}</button>
     ${l.owned?'':`<button class="btn" onclick="buyLot('${l.id}')">KÖP ${money(info.cost)}</button>`}
   </div>`
 }).join('');

 let lot=getSelectedLot();
 let buildCards=builderCatalog.map(item=>{
   let already=lot.modules.includes(item.id) && item.id!=='garden';
   let disabled=!lot.owned || (already && item.kind!=='garden');
   return `<div class="buildCard">
     <h4>${item.name}</h4>
     <p>${item.desc}</p>
     <div class="buildTiny">Kostnad: ${money(item.cost)} · Komfort +${item.comfort} · Värde +${money(item.value)}</div><br>
     ${disabled?`<button class="btn alt" disabled>${already?'REDAN BYGGD':'LÅST'}</button>`:`<button class="btn" onclick="buildModule('${item.id}')">BYGG</button>`}
   </div>`;
 }).join('');

 openSheet(
   'Boende & Bygg',
   'Skapa ett eget hem med tydlig livssim-känsla. Välj tomt, byt stil och bygg ut huset med nya rum och detaljer.',
   `<button class="btn blue" onclick="cycleLotStyle()">BYT STIL</button><button class="btn alt" onclick="renameLot()">BYT NAMN</button>`,
   'BYGGLÄGE',
   `<div class="card"><b>Aktiv tomt:</b> ${lot.name} · ${lot.owned?'Ägd':'Inte köpt'}<br>
    Komfort ${Math.round(lot.comfort||0)} · Design ${lotDesignScore(lot)} · Värde ${money(lot.value||0)}<br>
    Hembudget: ${money(state.cash)} kontant · Totalt bostadsvärde: ${money(housingNetWorth())}
   </div><br>
   <div class="lotGrid">${lotCards}</div><br>
   <div class="card"><b>Byggkatalog</b><span> Bygg ut rum för rum och ge hemmet mer personlighet.</span></div><br>
   <div class="buildGrid">${buildCards}</div>
   <br><div class="styleChips">
      <span class="styleChip">NUVARANDE STIL: ${lot.style}</span>
      <span class="styleChip">HEMPOÄNG: ${Math.round((lot.comfort||0)+(lotDesignScore(lot)*0.6))}</span>
      <span class="styleChip">RUM: ${lot.modules.length}</span>
   </div>`
 );
}
function selectLot(id){
 state.selectedLotId=id;
 save();
 openHousingBuilder();
 updateHousingUI();
}
function buyLot(id){
 let lot=state.homeLots.find(l=>l.id===id);
 let info=lotPurchaseInfo[id];
 if(!lot||!info)return;
 if(lot.owned)return toastMsg('Tomten ägs redan.');
 if(state.cash<info.cost)return toastMsg('Du har inte råd.');
 state.cash-=info.cost;
 lot.owned=true;
 lot.value=Math.max(lot.value||0, info.cost);
 state.properties.push({name:lot.name,value:info.cost});
 state.respect+=2;
 state.selectedLotId=id;
 toastMsg(lot.name+' köpt.');
 save(); renderStats(); openHousingBuilder(); updateHousingUI();
}
function buildModule(id){
 let lot=getSelectedLot();
 let item=builderCatalog.find(x=>x.id===id);
 if(!lot||!item)return;
 if(!lot.owned)return toastMsg('Köp tomten först.');
 if(item.id!=='garden' && lot.modules.includes(item.id))return toastMsg('Den delen finns redan.');
 if(state.cash<item.cost)return toastMsg('Du har inte råd.');
 state.cash-=item.cost;
 if(item.kind==='garden'){lot.garden=(lot.garden||0)+1}else{lot.modules.push(item.id)}
 lot.comfort=Math.min(100,(lot.comfort||0)+item.comfort);
 lot.value=(lot.value||0)+item.value;
 state.respect+=Math.max(1,Math.round(item.value/4000));
 if(item.id==='bedroom' || item.id==='bathroom') state.homes.push({name:lot.name+' · '+item.name,value:item.value,owned:true});
 applyCrossWorldEffects('life',1);applyCrossWorldEffects('empire',1);logWorldAction('life','Byggde '+item.name,1);toastMsg(item.name+' byggt på '+lot.name+'.');
 beep(660,.08,.03);
 save(); renderStats(); openHousingBuilder(); updateHousingUI();
}
function cycleLotStyle(){
 let lot=getSelectedLot();
 if(!lot)return;
 let styles=['Nordic','Modern','Luxury','Neon'];
 let idx=styles.indexOf(lot.style); lot.style=styles[(idx+1)%styles.length];
 toastMsg('Stil: '+lot.style);
 save(); openHousingBuilder(); updateHousingUI();
}
function renameLot(){
 let lot=getSelectedLot();
 if(!lot)return;
 let name=prompt('Namn på tomten/huset:', lot.name);
 if(!name)return;
 lot.name=name.slice(0,24);
 toastMsg('Hem omdöpt.');
 save(); openHousingBuilder(); updateHousingUI();
}
function drawPlayerHomes(){
 state.homeLots.forEach((lot,idx)=>{
   let baseW=112, baseH=74;
   let x=lot.x, y=lot.y;
   // plot
   ctx.save();
   ctx.fillStyle='rgba(62,92,52,.55)';
   rr(x-24,y+44,baseW+60,46,10); ctx.fill();
   ctx.strokeStyle='rgba(200,220,190,.18)'; ctx.lineWidth=1; ctx.stroke();
   // fence
   ctx.strokeStyle='rgba(180,190,200,.18)';
   ctx.strokeRect(x-20,y+48,baseW+52,38);

   if(!lot.owned){
     ctx.fillStyle='rgba(10,16,24,.82)';
     rr(x,y,baseW,baseH,10); ctx.fill();
     ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.stroke();
     ctx.fillStyle='#d9e4f0'; ctx.font='800 10px system-ui';
     ctx.fillText(lot.name, x+10, y+28);
     ctx.fillStyle='#86ef78'; ctx.fillText('KÖPBAR TOMT', x+10, y+45);
     ctx.restore();
     return;
   }

   let moduleCount=Math.max(1, lot.modules.length);
   let bodyColor={Nordic:'#7da7c9',Modern:'#8491a3',Luxury:'#cab39a',Neon:'#836ad5'}[lot.style]||'#7da7c9';
   let roofColor={Nordic:'#4b6175',Modern:'#424d5f',Luxury:'#7d5d4a',Neon:'#4f2f77'}[lot.style]||'#4b6175';

   // main house
   ctx.fillStyle=bodyColor;
   rr(x,y+16,baseW,baseH-10,10); ctx.fill();
   ctx.strokeStyle='rgba(255,255,255,.15)'; ctx.lineWidth=1.5; ctx.stroke();

   ctx.fillStyle=roofColor;
   ctx.beginPath();
   ctx.moveTo(x-6,y+24); ctx.lineTo(x+24,y); ctx.lineTo(x+88,y); ctx.lineTo(x+baseW+6,y+24); ctx.closePath();
   ctx.fill();

   // windows & door
   for(let i=0;i<Math.min(4,moduleCount+1);i++){
      let wx=x+12+i*22; let wy=y+32;
      ctx.fillStyle='rgba(255,227,163,.75)';
      rr(wx,wy,12,12,2); ctx.fill();
   }
   ctx.fillStyle='rgba(45,30,24,.9)';
   rr(x+baseW-28,y+44,16,26,3); ctx.fill();

   // room extensions
   let extX=x+baseW+6;
   lot.modules.forEach((m,i)=>{
      if(m==='core')return;
      let color = m==='kitchen'?'#92bad7':m==='bedroom'?'#b39be0':m==='bathroom'?'#9dd8d7':m==='lounge'?'#d7b28c':m==='office'?'#8b9eb7':m==='terrace'?'#8f7a65':'#88aa77';
      let w=(m==='terrace'||m==='garden')?36:42;
      let h=(m==='terrace'||m==='garden')?26:36;
      let yy=y+24 + ((i%2)*18);
      if(m==='garden'){
        ctx.fillStyle='rgba(54,116,68,.72)';
        rr(extX+i*12,y+52,34,18,8); ctx.fill();
        ctx.fillStyle='#2f7d3f'; ctx.beginPath(); ctx.arc(extX+10+i*12,y+50,7,0,Math.PI*2); ctx.fill();
        return;
      }
      ctx.fillStyle=color;
      rr(extX+i*10,yy,w,h,7); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.stroke();
      if(m==='terrace'){
         ctx.fillStyle='rgba(113,88,60,.8)';
         for(let k=0;k<3;k++) ctx.fillRect(extX+4+i*10+k*10,yy+15,6,8);
      }else{
         ctx.fillStyle='rgba(255,227,163,.62)';
         rr(extX+10+i*10,yy+9,10,10,2); ctx.fill();
      }
   });

   // gardens/pool
   for(let g=0;g<(lot.garden||0);g++){
      let gx=x-10+g*14, gy=y+70-(g%2)*8;
      ctx.fillStyle='rgba(42,118,58,.75)';
      ctx.beginPath(); ctx.arc(gx,gy,7,0,Math.PI*2); ctx.fill();
   }
   if(lot.modules.includes('pool')){
      ctx.fillStyle='rgba(88,191,255,.58)';
      rr(x+baseW-44,y+74,36,12,5); ctx.fill();
      ctx.strokeStyle='rgba(210,245,255,.22)'; ctx.stroke();
   }

   // home marker / label
   if(state.selectedLotId===lot.id){
      ctx.shadowColor='rgba(134,239,120,.25)'; ctx.shadowBlur=10;
      ctx.strokeStyle='#86ef78'; ctx.lineWidth=2; ctx.strokeRect(x-6,y-6,baseW+18,baseH+28);
      ctx.shadowBlur=0;
   }
   ctx.fillStyle='#edf4fb'; ctx.font='800 10px system-ui';
   ctx.fillText(lot.name, x+6, y+88);
   ctx.restore();
  });
}

function rectDist(p){let cx=Math.max(p.x,Math.min(state.x,p.x+p.w)),cy=Math.max(p.y,Math.min(state.y,p.y+p.h));return Math.hypot(state.x-cx,state.y-cy)}
function updateWeather(){let p=Math.floor(state.time)%6;if(p<2){weather.textContent='🌧 Regn · 8°C';weather.dataset.kind='rain'}else if(p===2){weather.textContent='🌫 Dimma · 7°C';weather.dataset.kind='fog'}else{weather.textContent='☁ Mulet · 9°C';weather.dataset.kind='cloud'}}
function updateEvents(){let hour=Math.floor(state.time);eventSpots.forEach(e=>e.active=false);if(hour>=20||hour<2)eventSpots[0].active=true;if(hour>=22||hour<1)eventSpots[1].active=true;if(hour>=23||hour<3)eventSpots[2].active=true;let active=eventSpots.find(e=>e.active);eventText.textContent=active?active.name+' är aktivt nu.':'Inga större events just nu.'}

function updateLifeUI(){
 let energyVal=Math.max(0,Math.min(100,state.energy||0));
 let healthVal=Math.max(0,Math.min(100,(state.hp/state.maxHp)*100));
 let safetyVal=Math.max(0,Math.min(100,100-(state.heat||0)));
 let socialVal=Math.max(0,Math.min(100,55+Math.min(40,(state.respect||0)*.25)));
 let statusVal=Math.max(0,Math.min(100,20+Math.min(80,(state.respect||0)*.4)));let homeComfortBonus=(getSelectedLot()?.comfort||0)*.35;let comfortVal=Math.max(0,Math.min(100,35+(state.cash||0)/220+(state.respect||0)*.05+homeComfortBonus));

 const setNeed=(id,val)=>{
   let bar=document.getElementById(id);
   let txt=document.getElementById(id+'Txt');
   if(bar)bar.style.width=val+'%';
   if(txt)txt.textContent=Math.round(val);
 };
 setNeed('needEnergy',energyVal);
 setNeed('needHealth',healthVal);
 setNeed('needSafety',safetyVal);
 setNeed('needSocial',socialVal);
 setNeed('needStatus',statusVal);setNeed('needComfort',comfortVal);

 let mood='Fokuserad';
 if(healthVal<35)mood='Sliten';
 else if(energyVal<25)mood='Utmattad';
 else if(safetyVal<35)mood='Jagad';
 else if(statusVal>75)mood='Självsäker';
 else if(socialVal>80)mood='Populär';
 let lm=document.getElementById('lifeMood');
 if(lm)lm.textContent=mood;

 let gem=document.getElementById('lifeGem');
 if(gem){
   if(state.interior){
     gem.style.left=(innerWidth/2)+'px';
     gem.style.top=(innerHeight/2-34)+'px';
   }else{
     gem.style.left=(state.x-cam.x)+'px';
     gem.style.top=(state.y-cam.y-30)+'px';
   }
 }
}

function loop(now){let dt=Math.min(50,now-last)/16.67;last=now;state.time+=dt*.0009;if(state.time>=24){state.time-=24;state.day++;payDailyCosts()}updateLifeUI();updateWorldStatus();updateSocialBubble();updateAmbientTraffic(dt);updateBikes(dt);updateMegaStatus();updateHousingUI();updateCrimeSeasonUI();updateEmpireHud();updateUniverseHud();updateThreeWorldsHud();dynamicEconomyTick();worldNeedTick(dt);maybePrestige();universeTick();let dx=0,dy=0;if(keys.w||keys.arrowup)dy--;if(keys.s||keys.arrowdown)dy++;if(keys.a||keys.arrowleft)dx--;if(keys.d||keys.arrowright)dx++;if(state.interior){dx=dy=0}else if(state.driving){let accel=(dy?-dy:0)*.22*dt;carVelocity+=accel;carVelocity*=.985;carVelocity=Math.max(-3.5,Math.min(8.5,carVelocity));if(dx)heading+=dx*.035*dt*(carVelocity>=0?1:-1);let nx=state.x+Math.cos(heading)*carVelocity*dt,ny=state.y+Math.sin(heading)*carVelocity*dt;if(!blocked(nx,ny)){state.x=Math.max(20,Math.min(W-20,nx));state.y=Math.max(20,Math.min(H-20,ny))}else{carVelocity*=-.25;beep(110,.08,.03)}}else if(dx||dy){let l=Math.hypot(dx,dy);dx/=l;dy/=l;heading=Math.atan2(dy,dx);let s=3.6*dt;let nx=state.x+dx*s,ny=state.y+dy*s;if(!blocked(nx,state.y))state.x=Math.max(20,Math.min(W-20,nx));if(!blocked(state.x,ny))state.y=Math.max(20,Math.min(H-20,ny));state.energy=Math.max(0,state.energy-.012*dt)}else state.energy=Math.min(100,state.energy+.006*dt);if(combatCooldown>0)combatCooldown-=dt;if(!state.interior){npcs.forEach((n,i)=>{let [x1,y1,x2,y2]=n.path,t=(Math.sin(now/2800+i)+1)/2;n.x=x1+(x2-x1)*t;n.y=y1+(y2-y1)*t});cars.forEach(car=>{car.x+=car.speed*car.dir*dt;if(car.x<40)car.x=3560;if(car.x>3560)car.x=40;if(Math.hypot(state.x-car.x,state.y-car.y)<30&&!state.driving){state.hp=Math.max(0,state.hp-.05*dt)}});police.forEach(p=>{p.x+=1.45*p.dir*dt;if(p.x<100||p.x>3500)p.dir*=-1;if(state.heat>35&&Math.hypot(state.x-p.x,state.y-p.y)<105){state.heat=Math.min(100,state.heat+.02*dt);if(!state.flags.policeIntro){state.flags.policeIntro=true;showStory('POLISENS RADAR','Hög Heat gör att patruller börjar känna igen dig. Håll dig undan, vila eller använd smartare vägar.')}}});enemies.forEach(e=>{if(!e.active){e.respawn-=dt;if(e.respawn<=0){e.active=true;e.hp=e.max}}else if(Math.hypot(state.x-e.x,state.y-e.y)<42&&!state.driving){state.hp-=.025*dt}})}if(state.hp<=0){state.losses++;state.cash=Math.max(0,state.cash-500);state.hp=state.maxHp;state.energy=60;state.heat=Math.max(0,state.heat-20);state.x=250;state.y=450;state.driving=false;state.interior=null;showStory('NEDSLAGEN','Du vaknar hemma. 500 kr saknas ur fickan, men Heat har sjunkit.')}nearPlace=null;nearNpc=null;nearEnemy=null;nearEvent=null;if(!state.interior){let b=999;places.forEach(p=>{let d=rectDist(p);if(d<90&&d<b){b=d;nearPlace=p}});b=999;npcs.forEach(n=>{let d=Math.hypot(state.x-n.x,state.y-n.y);if(d<72&&d<b){b=d;nearNpc=n}});b=999;enemies.forEach(e=>{if(!e.active)return;let d=Math.hypot(state.x-e.x,state.y-e.y);if(d<75&&d<b){b=d;nearEnemy=e}});b=999;eventSpots.forEach(e=>{if(!e.active)return;let d=Math.hypot(state.x-e.x,state.y-e.y);if(d<80&&d<b){b=d;nearEvent=e}})}interactBtn.textContent=state.interior?'LÄMNA':nearEvent?'EVENT':nearNpc?'PRATA':nearPlace?'INTERAGERA':'...';attackBtn.style.display=nearEnemy?'block':'none';driveBtn.textContent=state.driving?'GÅ UR':'KÖR';district.textContent=currentDistrict();renderStats();updateWeather();updateEvents();drawWorld();drawMini();requestAnimationFrame(loop)}requestAnimationFrame(loop);

addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
const joy=document.getElementById('joy'),stick=document.getElementById('stick');let jid=null;function jm(e){const t=[...e.touches].find(t=>t.identifier===jid);if(!t)return;const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=t.clientX-cx,dy=t.clientY-cy,d=Math.hypot(dx,dy),mx=34;if(d>mx){dx=dx/d*mx;dy=dy/d*mx}stick.style.transform=`translate(${dx}px,${dy}px)`;keys.w=dy<-8;keys.s=dy>8;keys.a=dx<-8;keys.d=dx>8}joy.addEventListener('touchstart',e=>{jid=e.changedTouches[0].identifier;jm(e)},{passive:false});joy.addEventListener('touchmove',e=>{e.preventDefault();jm(e)},{passive:false});joy.addEventListener('touchend',()=>{jid=null;stick.style.transform='translate(0,0)';keys.w=keys.s=keys.a=keys.d=false});
interactBtn.onclick=()=>{beep(660,.05,.02);if(state.interior){state.interior=null;return}if(nearEvent)openLiveEvent(nearEvent);else if(nearNpc)openNpc(nearNpc);else if(nearPlace)openPlace(nearPlace);else toastMsg('Gå närmare en plats eller person.')};
attackBtn.onclick=attackEnemy;driveBtn.onclick=()=>{if(!state.vehicle)return toastMsg('Du äger inget fordon.');if(state.interior)return toastMsg('Lämna lokalen först.');state.driving=!state.driving;if(!state.driving)carVelocity=0;beep(state.driving?520:280,.07,.02);toastMsg(state.driving?'Du kör nu.':'Du går till fots.');save()};

function attackEnemy(){if(!nearEnemy||combatCooldown>0)return;if(state.energy<5)return toastMsg('För lite stamina.');state.energy-=5;combatCooldown=18;let dmg=18+state.skills.combat*3+Math.floor(Math.random()*18);nearEnemy.hp-=dmg;beep(180,.06,.03);toastMsg('Du gjorde '+dmg+' skada.');if(nearEnemy.hp<=0){nearEnemy.active=false;nearEnemy.respawn=1000;state.wins++;state.questProgress.rivals++;state.cash+=300+Math.floor(Math.random()*350);state.respect+=2;state.heat+=6;if(Math.random()<.35){addItem('Skrot',1,'Kan säljas eller användas senare.');state.materials.Skrot++;}if(Math.random()<.18)state.materials.Elektronik++;if(Math.random()<.14)state.materials.Tyg++;if(state.quest==='rivals'&&state.questProgress.rivals>=3)state.quest='nina';save()}}
function addItem(name,qty,desc){let i=state.inventory.find(x=>x.name===name);if(i)i.qty+=qty;else state.inventory.push({name,qty,desc})}
function openLiveEvent(ev){openSheet(ev.name,'Ett tidsbegränsat event är aktivt här.',`<button class="btn" onclick="completeEvent('${ev.id}')">DELTA</button>`,'LIVE EVENT')}
function completeEvent(id){let ev=eventSpots.find(e=>e.id===id);if(!ev||!ev.active)return toastMsg('Eventet är över.');if(state.energy<15)return toastMsg('För lite stamina.');state.energy-=15;state.cash+=ev.reward;state.respect+=ev.rep;state.heat+=4;state.sessionStats.events++;updateDailyMissions();beep(760,.12,.025);closeSheet();toastMsg('Event klart: '+money(ev.reward));save()}
function enterInterior(p){state.interior=p.interior;closeSheet();toastMsg('Du gick in i '+p.name+'.')}
function openNpc(n){if(n.id==='mara'){if(!state.flags.metMara)openSheet('Mara','"Black Haven är en stad där folk visar sina kort för tidigt. Gör inte det."',`<button class="btn" onclick="meetMara()">JAG FÖRSTÅR</button>`,'KONTAKT');else openSheet('Mara','"Du börjar synas."',`<button class="btn" onclick="genericJob(14,900,3,5)">TA JOBB</button>`,'KONTAKT')}if(n.id==='viktor'){if(state.respect<4)return openSheet('Viktor','"Jag känner inte dig. Än."','','FIXARE');if(!state.flags.metViktor)openSheet('Viktor','"Mara brukar inte skicka vem som helst."',`<button class="btn" onclick="meetViktor()">ACCEPTERA</button>`,'FIXARE');else openSheet('Viktor','"Neon Club är din ingång till den andra sidan av staden."',`<button class="btn" onclick="genericJob(18,1300,4,7)">KLUBBJOBB</button>`,'FIXARE')}if(n.id==='leo'){if(state.respect<8)return openSheet('Leo','"Kom tillbaka när ditt namn väger mer."','','FÖRARE');let a=state.vehicle?'':`<button class="btn" onclick="buyCar()">KÖP BH COMPACT – 3 500 KR</button>`;openSheet('Leo','"En bil ändrar hur staden känns. Och hur snabbt du kan försvinna."',a,'FÖRARE')}if(n.id==='nina'){if(state.quest!=='nina'&&!state.flags.metNina)return openSheet('Nina','"Vi har inget att prata om än."','','MÄKLARE');if(!state.flags.metNina)openSheet('Nina','"Om du vill bli större än ett namn på gatan behöver du kassaflöde."',`<button class="btn" onclick="meetNina()">LYSSNA</button>`,'MÄKLARE');else openSheet('Nina','"Företag köper tid."',`<button class="btn" onclick="buyBusiness('Black Haven Tvätt',5000,650)">KÖP TVÄTTERI – 5 000 KR</button><button class="btn alt" onclick="buyBusiness('Midnight Diner',9000,1100)">KÖP DINER – 9 000 KR</button>`,'MÄKLARE')}if(n.id==='raven'){if(state.respect<15)return openSheet('Raven','"Du är inte redo för mitt folk."','','GÄNG');if(!state.flags.metRaven)openSheet('Raven','"Makt utan människor är bara en dyr illusion."',`<button class="btn" onclick="meetRaven()">PRATA VIDARE</button>`,'GÄNG');else openSheet('Raven','"Du kan bygga något eget nu."',state.gang?'':`<button class="btn" onclick="createGang()">SKAPA NIGHT CROWN – 2 000 KR</button>`,'GÄNG')}if(n.id==='sable'){if(state.quest!=='sable'&&!state.flags.metSable)return openSheet('Sable','"Du hör inte hemma i The Pit än."','','ARENA');if(!state.flags.metSable)openSheet('Sable','"The Pit testar vad ditt namn faktiskt är värt."',`<button class="btn" onclick="meetSable()">GÅ MED</button>`,'ARENA');else openSheet('Sable','"Två vinster. Sedan pratar vi igen."',`<button class="btn" onclick="pitFight()">GÅ MATCH</button>`,'ARENA')}if(n.id==='isaac'){if(state.respect<30)return openSheet('Isaac','"Vi gör inte affärer med nybörjare."','','INVESTERARE');if(!state.flags.metIsaac)openSheet('Isaac','"Företag är bra. Fastigheter är bättre."',`<button class="btn" onclick="meetIsaac()">FORTSÄTT</button>`,'INVESTERARE');else openSheet('Isaac','"När du äger adressen börjar folk behandla dig annorlunda."',`<button class="btn" onclick="buyEstate()">KÖP HAVEN ESTATE – 25 000 KR</button>`,'INVESTERARE')}if(n.id==='vera'){if(state.quest!=='vera'&&!state.flags.metVera)return openSheet('Vera','"Du är inte på min lista än."','','STATION');if(!state.flags.metVera)openSheet('Vera','"Stationen förbinder hela Black Haven. Resor kommer bli viktiga när staden växer."',`<button class="btn" onclick="meetVera()">FORTSÄTT</button>`,'STATION');else openSheet('Vera','"Snabbresor är upplåsta."',`<button class="btn" onclick="fastTravel()">SNABBRESA HEM – 300 KR</button>`,'STATION')}}
function meetMara(){state.flags.metMara=true;state.cash+=500;state.respect+=4;state.factions.Mara+=10;state.quest='meet_viktor';addItem('Kuvert',1,'Betalning från Mara.');closeSheet();beep(820,.15,.025);showStory('FÖRSTA DÖRREN','Mara har öppnat den första dörren. I Black Haven leder varje kontakt till en ny värld.');save()}
function meetViktor(){state.flags.metViktor=true;state.flags.club=true;state.respect+=3;state.factions.Viktor+=10;state.quest='meet_leo';addItem('Neon-pass',1,'Ger tillgång till Neon Club.');closeSheet();beep(720,.1,.02);toastMsg('Neon Club upplåst.');save()}
function buyCar(){if(state.cash<3500)return toastMsg('Du behöver 3 500 kr.');state.cash-=3500;state.vehicle={name:'BH Compact',color:'#7d93aa',value:3500};state.driving=true;state.flags.metLeo=true;state.respect+=2;state.quest='rivals';carVelocity=0;closeSheet();beep(520,.14,.03);toastMsg('Fordon upplåst.');save()}
function meetNina(){state.flags.metNina=true;state.quest='business';state.respect+=2;state.factions.Nina+=10;closeSheet();showStory('KASSAFLÖDE','Nina introducerar dig till en annan sorts makt: pengar som fortsätter arbeta även när du inte gör det.');save()}
function buyBusiness(name,cost,income){if(state.businesses.some(b=>b.name===name))return toastMsg('Du äger redan den verksamheten.');if(state.cash<cost)return toastMsg('Du har inte råd.');state.cash-=cost;state.businesses.push({name,value:cost,income});state.respect+=4;state.achievements.entrepreneur=true;gainXp(15);state.skills.business++;if(state.quest==='business')state.quest='raven';closeSheet();beep(900,.12,.025);toastMsg(name+' köpt.');save()}
function meetRaven(){state.flags.metRaven=true;state.respect+=2;state.factions.Raven+=10;state.quest='sable';closeSheet();toastMsg('Raven känner till dig nu.');save()}
function createGang(){if(state.cash<2000)return toastMsg('Du behöver 2 000 kr.');state.cash-=2000;state.gang={name:'Night Crown',territory:0,members:1};state.respect+=5;closeSheet();toastMsg('Night Crown skapades.');save()}
function meetSable(){state.flags.metSable=true;state.quest='arena';closeSheet();showStory('THE PIT','Sable släpper in dig i The Pit. Här tjänas respekt på ett annat sätt.');save()}
function pitFight(){if(state.energy<20)return toastMsg('För lite stamina.');state.energy-=20;let win=Math.random()<(.55+state.skills.combat*.05);if(win){state.questProgress.arena++;state.cash+=1000;state.respect+=4;state.skills.combat++;beep(780,.12,.025);toastMsg('Vinst i The Pit.');if(state.questProgress.arena>=2)state.quest='isaac'}else{state.hp=Math.max(10,state.hp-35);state.losses++;beep(120,.12,.03);toastMsg('Förlust i The Pit.')}closeSheet();save()}
function meetIsaac(){state.flags.metIsaac=true;state.quest='vera';state.respect+=3;state.factions.Isaac+=10;closeSheet();toastMsg('Isaac öppnar nästa dörr.');save()}
function meetVera(){state.flags.metVera=true;state.quest='estate';state.respect+=2;closeSheet();toastMsg('Snabbresor upplåsta.');save()}
function fastTravel(){if(state.cash<300)return toastMsg('Du behöver 300 kr.');state.cash-=300;state.x=260;state.y=440;state.driving=false;carVelocity=0;closeSheet();beep(650,.09,.02);toastMsg('Snabbresa klar.');save()}
function buyEstate(){if(state.properties.some(p=>p.name==='Haven Estate'))return toastMsg('Du äger redan fastigheten.');if(state.cash<25000)return toastMsg('Du behöver 25 000 kr.');state.cash-=25000;state.properties.push({name:'Haven Estate',value:25000});state.respect+=10;state.quest='free';closeSheet();showStory('DU ÄGER EN DEL AV STADEN','Haven Estate är din. Du är inte längre bara en spelare i Black Haven. Du äger en del av spelplanen.');save()}
function genericJob(cost,reward,rep,heatAdd){if(state.energy<cost)return toastMsg('För lite stamina.');state.energy-=cost;state.cash+=reward;state.respect+=rep;state.heat+=heatAdd;state.jobsDone++;closeSheet();beep(700,.08,.02);toastMsg('+'+money(reward));save()}
function openPlace(p){let text='',a='';if(p.id==='home'){text='Ditt hem. Vila, återhämta dig och minska Heat.';a='<button class="btn green" onclick="rest()">VILA</button>'}if(p.id==='shop'){text='Energi och enklare saker.';a='<button class="btn" onclick="buyEnergy()">ENERGIDRYCK – 300 KR</button><button class="btn alt" onclick="buyMedkit()">FÖRSTA HJÄLPEN – 500 KR</button>'}if(p.id==='bank'){text='Sätt in eller ta ut pengar.';a='<button class="btn" onclick="deposit()">SÄTT IN 1 000</button><button class="btn alt" onclick="withdraw()">TA UT 1 000</button>'}if(p.id==='plaza')text='Stadens centrala mötesplats.';if(p.id==='finance')text=state.respect>=40?'Finanshuset är öppet för större affärer.':'Kräver 40 respekt.';if(p.id==='tower')text=state.respect>=60?'North Tower är öppet.':'Kräver 60 respekt.';if(p.id==='garage')text=state.vehicle?'Ditt fordon kan användas här.':'Prata med Leo för att köpa fordon.';if(p.id==='warehouse')text='Gamla Lagret. Raven brukar röra sig här.';if(p.id==='club'){text=state.flags.club?'Neon Club är öppen för dig.':'Du är inte på listan ännu.';if(state.flags.club)a='<button class="btn" onclick="clubEvent()">NATTEVENT – 800 KR</button>'}if(p.id==='casino'){text='Black Haven Casino använder Casino Tokens och fiktiv spelvaluta.';a='<button class="btn" onclick="openCasino()">ÖPPNA CASINO</button>'}if(p.id==='dock')text='Östra Kajen. Mara rör sig i området.';if(p.id==='shipyard')text='Varvet är ett riskområde.';if(p.id==='motel'){text='Billigt motell nära hamnen.';a='<button class="btn green" onclick="motelRest()">SOV – 250 KR</button>'}if(p.id==='blackmarket'){text='Night Market säljer ovanliga saker.';a='<button class="btn" onclick="buyArmor()">SKYDDSVÄST – 2 500 KR</button>'}if(p.id==='lounge')text='Velvet Lounge. Isaac brukar synas här.';if(p.id==='estate')text=state.properties.length?'Haven Estate är din fastighet.':'En exklusiv fastighet för den som har pengar och respekt.';if(p.id==='arena')text='The Pit. Sable kontrollerar vilka som får slåss här.';if(p.id==='station')text='Black Haven Station. Vera hanterar snabbresor.';if(p.id==='marina')text='Marinaområdet. Framtida båtar och exklusiva events.';if(p.interior)a+=`<button class="btn alt" onclick="enterInterior(places.find(x=>x.id==='${p.id}'))">GÅ IN</button>`;openSheet(p.name,text,a,'PLATS')}
function rest(){state.energy=100;state.hp=state.maxHp;state.heat=Math.max(0,state.heat-15);closeSheet();beep(420,.07,.02);toastMsg('Full återhämtning.');save()}function motelRest(){if(state.cash<250)return toastMsg('Du behöver 250 kr.');state.cash-=250;state.energy=100;state.hp=state.maxHp;state.heat=Math.max(0,state.heat-10);closeSheet();toastMsg('Du sov på motellet.');save()}function buyEnergy(){if(state.cash<300)return toastMsg('Du har inte råd.');state.cash-=300;state.energy=Math.min(100,state.energy+30);closeSheet();toastMsg('+30 stamina');save()}function buyMedkit(){if(state.cash<500)return toastMsg('Du har inte råd.');state.cash-=500;addItem('Första hjälpen',1,'Återställer HP via Inventory.');closeSheet();toastMsg('Tillagd i Inventory.');save()}function buyArmor(){if(state.cash<2500)return toastMsg('Du behöver 2 500 kr.');if(state.inventory.some(i=>i.name==='Skyddsväst'))return toastMsg('Du har redan en.');state.cash-=2500;addItem('Skyddsväst',1,'Ökar max HP med 25.');state.maxHp+=25;state.hp+=25;closeSheet();toastMsg('+25 max HP');save()}function deposit(){if(state.cash<1000)return toastMsg('För lite kontanter.');state.cash-=1000;state.bank+=1000;closeSheet();toastMsg('1 000 kr insatt.');save()}function withdraw(){if(state.bank<1000)return toastMsg('För lite på banken.');state.bank-=1000;state.cash+=1000;closeSheet();toastMsg('1 000 kr uttaget.');save()}function clubEvent(){if(state.cash<800)return toastMsg('Du behöver 800 kr.');state.cash-=800;state.respect+=3;state.heat=Math.max(0,state.heat-2);closeSheet();toastMsg('+3 respekt');save()}function casinoEvent(){if(state.cash<300)return toastMsg('Du behöver 300 kr.');state.cash-=300;let win=Math.random()<.42;if(win){let r=500+Math.floor(Math.random()*900);state.cash+=r;toastMsg('Eventvinst: '+money(r))}else toastMsg('Ingen vinst.');closeSheet();save()}
function openCharacter(){openSheet('Karaktär',`Level ${state.level} · ${state.xp}/${state.level*100} XP · Dag ${state.day}. ${state.jobsDone} jobb, ${state.wins} vunna strider, ${state.losses} nederlag.`,'','PROFIL',`<div class="grid"><div class="card"><b>Combat</b><span>Lv ${state.skills.combat}</span></div><div class="card"><b>Street</b><span>Lv ${state.skills.street}</span></div><div class="card"><b>Business</b><span>Lv ${state.skills.business}</span></div><div class="card"><b>Netto</b><span>${money(networth())}</span></div></div>`)}
function openPhone(){
 let unread=state.notifications.length;
 openSheet('Black Haven Mobile','Din telefon är navet för sociala funktioner.','','TELEFON',
 `<div class="phoneShell">
   <div class="phoneTop"><span>${state.sim.number}</span><span>${state.sim.active?'5G':'Ingen tjänst'} · 🔋 92%</span></div>
   <div class="appGrid">
     <div class="appTile" onclick="openMessages()"><strong>💬</strong>SMS</div>
     <div class="appTile" onclick="openContacts()"><strong>👥</strong>Kontakter</div>
     <div class="appTile" onclick="openCallLog()"><strong>📞</strong>Samtal</div>
     <div class="appTile" onclick="openSim()"><strong>📶</strong>SIM</div>
     <div class="appTile" onclick="openDonateHub()"><strong>🎁</strong>Donate</div>
     <div class="appTile" onclick="openPremiumShop()"><strong>💎</strong>Premium</div>
     <div class="appTile" onclick="openCasino()"><strong>♠️</strong>Casino</div>
     <div class="appTile" onclick="openJobs()"><strong>💼</strong>Jobb</div>
     <div class="appTile" onclick="openCrimeHub()"><strong>🕶️</strong>Street Hub</div>
     <div class="appTile" onclick="openNotifications()"><strong>🔔</strong>Notiser ${unread?`(${unread})`:''}</div>
     <div class="appTile" onclick="openSocialHub()"><strong>🌐</strong>Online</div>
     <div class="appTile" onclick="openMarketplace()"><strong>🛒</strong>Marknad</div>
     <div class="appTile" onclick="openLeaderboard()"><strong>🏆</strong>Ranking</div>
   </div>
 </div>`)
}
function openContacts(){
 let cards=state.contacts.map((c,i)=>`<div class="card"><b>${c.name}</b><span>${c.status}</span><br><br>
 <button class="btn blue" onclick="composeSms(${i})">SMS</button>
 <button class="btn green" onclick="callPlayer(${i})">RING</button>
 <button class="btn alt" onclick="openDonate(${i})">DONERA</button></div>`).join('');
 openSheet('Kontakter','Spelare och viktiga NPC-kontakter.','','KONTAKTER',`<div class="grid">${cards}</div>`)
}
function openMessages(){
 let rows=state.messages.slice().reverse().map(m=>`<div class="card"><b>${m.from}</b><span>${m.time}</span><br>${m.text}</div>`).join('');
 openSheet('SMS', 'Skicka och läs meddelanden.', `<button class="btn" onclick="openContacts()">NYTT SMS</button>`, 'SMS', rows||'<div class="card">Inga meddelanden.</div>')
}
function composeSms(i){
 if(!state.sim.active)return toastMsg('SIM-kortet är avstängt.');
 let c=state.contacts[i];
 openSheet('SMS · '+c.name,'Skriv ett eget meddelande.',
 `<input id="smsInput" class="input" maxlength="160" placeholder="Skriv meddelande...">
 <button class="btn" onclick="sendCustomSms(${i})">SKICKA</button>`,'SMS')
}
function sendCustomSms(i){
 let el=document.getElementById('smsInput');let text=(el?.value||'').trim();
 if(!text)return toastMsg('Skriv ett meddelande först.');
 let c=state.contacts[i];
 state.messages.push({from:'Du → '+c.name,text,time:clock.textContent});
 state.achievements.firstSms=true;gainXp(5);
 closeSheet();beep(760,.05,.02);toastMsg('SMS skickat till '+c.name);
 setTimeout(()=>{let replies=['Jag ser det.','Okej, vi hörs.','Ses vid Plaza.','Kör på.','Jag ringer senare.'];let r=replies[Math.floor(Math.random()*replies.length)];state.messages.push({from:c.name,text:r,time:clock.textContent});state.notifications.push(c.name+': '+r);save();},700);
 save()
}
function openCallLog(){
 let rows=state.calls.slice().reverse().map(x=>`<div class="card"><b>${x.name}</b><span>${x.time} · ${x.duration} sek</span></div>`).join('');
 openSheet('Samtal','Senaste samtal.','','SAMTALSLOGG',rows||'<div class="card">Inga samtal ännu.</div>')
}
function openNotifications(){
 let rows=state.notifications.slice().reverse().map(x=>`<div class="card">${x}</div>`).join('');
 state.notifications=[];save();
 openSheet('Notiser','Senaste händelser.','','NOTISER',rows||'<div class="card">Inga nya notiser.</div>')
}
function openSim(){
 openSheet('SIM-kort',`Nummer: ${state.sim.number}<br>Abonnemang: ${state.sim.plan}<br>Status: ${state.sim.active?'Aktiv':'Avstängd'}`,
 `<button class="btn" onclick="toggleSim()">${state.sim.active?'STÄNG AV SIM':'AKTIVERA SIM'}</button>
 <button class="btn alt" onclick="upgradeSim()">UPPGRADERA TILL HAVEN+ – 5 DIAMANTER</button>`,'SIM')
}
function toggleSim(){state.sim.active=!state.sim.active;closeSheet();toastMsg('SIM '+(state.sim.active?'aktiverad':'avstängd'));save()}
function upgradeSim(){if(state.diamonds<5)return toastMsg('Du behöver 5 diamanter.');state.diamonds-=5;state.sim.plan='Haven+';closeSheet();toastMsg('SIM uppgraderad till Haven+');save()}
function openSms(i){
 if(!state.sim.active)return toastMsg('SIM-kortet är avstängt.');
 let c=state.contacts[i];openSheet('SMS · '+c.name,'Skriv ett meddelande till spelaren.',
 `<button class="btn" onclick="sendPresetSms(${i},'Tjena! Var är du?')">"Tjena! Var är du?"</button>
 <button class="btn alt" onclick="sendPresetSms(${i},'Ska vi mötas vid Central Plaza?')">"Mötas vid Plaza?"</button>
 <button class="btn alt" onclick="sendPresetSms(${i},'Vill du köra ett jobb tillsammans?')">"Köra jobb?"</button>`,'SMS')
}
function sendPresetSms(i,text){
 let c=state.contacts[i];state.messages.push({from:'Du → '+c.name,text,time:clock.textContent});
 closeSheet();beep(760,.05,.02);toastMsg('SMS skickat till '+c.name);
 setTimeout(()=>{let replies=['Jag är på väg.','Ses vid Plaza.','Kan om några minuter.','Kör!'];state.messages.push({from:c.name,text:replies[Math.floor(Math.random()*replies.length)],time:clock.textContent});save();},900);
 save()
}
function callPlayer(i){
 if(!state.sim.active)return toastMsg('SIM-kortet är avstängt.');
 let c=state.contacts[i],duration=10+Math.floor(Math.random()*80);
 state.calls.push({name:c.name,duration,time:clock.textContent});state.achievements.firstCall=true;gainXp(5);
 openSheet('Samtal · '+c.name,`Ansluter...<br><br>Samtalet simuleras i den här prototypen.`,
 `<button class="btn red" onclick="endCall('${c.name}',${duration})">LÄGG PÅ</button>`,'SAMTAL')
}
function endCall(name,duration){closeSheet();toastMsg('Samtal med '+name+' avslutat · '+duration+' sek');save()}
function openDonate(i){
 let c=state.contacts[i];openSheet('Donera till '+c.name,'Skicka spelvaluta eller diamanter till en medspelare.',
 `<button class="btn" onclick="donateCash(${i},500)">DONERA 500 KR</button>
 <button class="btn alt" onclick="donateCash(${i},1000)">DONERA 1 000 KR</button>
 <button class="btn blue" onclick="donateDiamond(${i})">DONERA 1 DIAMANT</button>`,'DONATE')
}
function donateCash(i,amount){
 if(state.cash<amount)return toastMsg('Du har inte tillräckligt med kontanter.');
 let c=state.contacts[i];state.cash-=amount;c.balance=(c.balance||0)+amount;state.donations.push({to:c.name,type:'cash',amount,time:clock.textContent});state.achievements.donor=true;gainXp(8);
 closeSheet();toastMsg('Du donerade '+money(amount)+' till '+c.name);save()
}
function donateDiamond(i){
 if(state.diamonds<1)return toastMsg('Du har inga diamanter.');
 let c=state.contacts[i];state.diamonds--;state.donations.push({to:c.name,type:'diamond',amount:1,time:clock.textContent});state.achievements.donor=true;gainXp(10);
 closeSheet();toastMsg('Du donerade 1 diamant till '+c.name);save()
}

function openDonateHub(){
 let cards=state.contacts.map((c,i)=>`<div class="card"><b>${c.name}</b><span>${c.status}</span><br><br>
 <button class="btn" onclick="openDonate(${i})">DONERA</button></div>`).join('');
 openSheet('Donate','Välj vem du vill skicka spelvaluta eller diamanter till.','','DONATE',`<div class="grid">${cards}</div>`)
}
function openPremiumShop(){
 let items=[
 {id:'goldphone',name:'Guldtelefon',cost:8,desc:'Kosmetiskt telefonskal.'},
 {id:'neonname',name:'Neon-namn',cost:10,desc:'Kosmetisk profilmarkering.'},
 {id:'vipframe',name:'VIP-profilram',cost:12,desc:'Kosmetisk profilram.'},
 {id:'raincoat',name:'Midnight Coat',cost:15,desc:'Kosmetiskt klädesplagg.'}
 ];
 let cards=items.map(x=>`<div class="card"><b>${x.name}</b><span>${x.desc}</span><br><br>
 ${state.premiumOwned.includes(x.id)?'<span>ÄGD</span>':`<button class="btn" onclick="buyPremium('${x.id}','${x.name}',${x.cost})">${x.cost} 💎</button>`}</div>`).join('');
 openSheet('Premium Shop','Kosmetiska föremål. Ingen pay-to-win i prototypen.','','PREMIUM',`<div class="grid">${cards}</div>`)
}
function buyPremium(id,name,cost){
 if(state.diamonds<cost)return toastMsg('Du behöver fler diamanter.');
 state.diamonds-=cost;state.premiumOwned.push(id);closeSheet();toastMsg(name+' köpt.');save()
}
function openCasino(){
 openSheet('Black Haven Casino',`Casino Tokens: ${state.casinoTokens}. Allt använder fiktiv spelvaluta.`,
 `<button class="btn" onclick="buyTokens()">KÖP 10 TOKENS – 1 000 KR</button>
 <button class="btn blue" onclick="casinoRoulette()">ROULETTE · 2 TOKENS</button>
 <button class="btn alt" onclick="casinoCards()">HIGH CARD · 1 TOKEN</button>`,'CASINO')
}
function buyTokens(){if(state.cash<1000)return toastMsg('Du behöver 1 000 kr.');state.cash-=1000;state.casinoTokens+=10;closeSheet();toastMsg('+10 Casino Tokens');save()}
function casinoRoulette(){
 if(state.casinoTokens<2)return toastMsg('För få tokens.');
 state.casinoTokens-=2;let win=Math.random()<.33;
 if(win){let prize=4+Math.floor(Math.random()*5);state.casinoTokens+=prize;state.achievements.highRoller=true;gainXp(6);toastMsg('Vinst: '+prize+' tokens!')}else toastMsg('Ingen vinst.');
 save()
}
function casinoCards(){
 if(state.casinoTokens<1)return toastMsg('För få tokens.');
 state.casinoTokens--;let you=1+Math.floor(Math.random()*13),house=1+Math.floor(Math.random()*13);
 if(you>house){state.casinoTokens+=2;toastMsg('Du vann '+you+' mot '+house+'. +2 tokens')}else toastMsg('Huset vann '+house+' mot '+you);
 save()
}
function openInventory(){let cards=state.inventory.map((i,idx)=>`<div class="card"><b>${i.name} ×${i.qty}</b><span>${i.desc}</span>${i.name==='Första hjälpen'?`<br><br><button class="btn green" onclick="useMedkit(${idx})">ANVÄND</button>`:''}</div>`).join('');openSheet('Inventory','Dina föremål.','','RYGGSÄCK',`<div class="grid">${cards||'<div class="card">Tomt</div>'}</div>`)}
function useMedkit(idx){let i=state.inventory[idx];if(!i)return;state.hp=Math.min(state.maxHp,state.hp+50);i.qty--;if(i.qty<=0)state.inventory.splice(idx,1);closeSheet();beep(500,.08,.02);toastMsg('+50 HP');save()}
function openEmpire(){let bs=state.businesses.map(b=>`<div class="card"><b>${b.name}</b><span>Värde ${money(b.value)} · Daglig inkomst ${money(b.income)}</span></div>`).join('');let ps=state.properties.map(p=>`<div class="card"><b>${p.name}</b><span>Värde ${money(p.value)}</span></div>`).join('');openSheet('Imperium','Dina verksamheter och fastigheter.',`<button class="btn blue" onclick="collectIncome()">HÄMTA DAGLIG INKOMST</button><button class="btn alt" onclick="upgradeFirstBusiness()">UPPGRADERA FÖRSTA FÖRETAGET</button>`,'IMPERIUM',`<div class="grid">${bs}${ps}${(!bs&&!ps)?'<div class="card">Du äger inget ännu.</div>':''}</div>`)}
function collectIncome(){if(state.lastIncomeDay===state.day)return toastMsg('Dagens inkomst är redan hämtad.');let income=state.businesses.reduce((s,b)=>s+b.income,0); income=Math.round(income*threeWorldIncomeMultiplier());if(state.skillTree&&state.skillTree.business2)income=Math.round(income*1.10);if(!income)return toastMsg('Du äger inget företag.');state.cash+=income;state.lastIncomeDay=state.day;state.skills.business++;closeSheet();beep(880,.1,.02);toastMsg('Inkomst: '+money(income));save()}
function payDailyCosts(){let cost=state.properties.length*200;if(cost)state.cash=Math.max(0,state.cash-cost)}

function openMainMenu(){
 openSheet(
   'Black Haven V2010',
   'Huvudcentralen för hela spelet.',
   '',
   'HUVUDMENY',
   `<div class="fullMenuGrid">
      <button onclick="closeSheet();openPhone()"><strong>📱</strong>Telefon</button>
      <button onclick="closeSheet();openSim()"><strong>📶</strong>SIM</button>
      <button onclick="closeSheet();openDonateHub()"><strong>🎁</strong>Donate</button>
      <button onclick="closeSheet();openPremiumShop()"><strong>💎</strong>Premium Shop</button>
      <button onclick="closeSheet();openCasino()"><strong>♠️</strong>Casino</button>
      <button onclick="closeSheet();openJobs()"><strong>💼</strong>Jobbcentral</button>
      <button onclick="closeSheet();openCrimeHub()"><strong>🕶️</strong>Street Hub</button>
      <button onclick="closeSheet();openCharacter()"><strong>👤</strong>Profil</button>
      <button onclick="closeSheet();openInventory()"><strong>🎒</strong>Inventory</button>
      <button onclick="closeSheet();openEmpire()"><strong>🏢</strong>Imperium</button>
      <button onclick="closeSheet();openEmpireHub()"><strong>👑</strong>Empire & Territory</button>
      <button onclick="closeSheet();openLifeHub()"><strong>❤️</strong>Life & Lifestyle</button>
      <button onclick="closeSheet();openContracts()"><strong>📋</strong>Contracts</button>
      <button onclick="closeSheet();openNews()"><strong>📰</strong>Black Haven News</button>
      <button onclick="closeSheet();openUniverseHub()"><strong>🌌</strong>Universe</button>
      <button onclick="closeSheet();openThreeWorlds()"><strong>🔺</strong>Three Worlds</button>
      <button onclick="closeSheet();openHousingBuilder()"><strong>🏠</strong>Bo & Bygg</button>
      <button onclick="closeSheet();openGangV200()"><strong>👥</strong>Gäng</button>
      <button onclick="closeSheet();openAchievements()"><strong>🏆</strong>Achievements</button>
      <button onclick="closeSheet();openDaily()"><strong>🎁</strong>Daglig bonus</button>
      <button onclick="closeSheet();openSocialHub()"><strong>🌐</strong>Online</button>
      <button onclick="closeSheet();openMarketplace()"><strong>🛒</strong>Marknad</button>
      <button onclick="closeSheet();openLeaderboard()"><strong>🏆</strong>Leaderboard</button>
      <button onclick="closeSheet();openPlayerProfile()"><strong>🪪</strong>Spelarprofil</button>
      <button onclick="closeSheet();openSkillTree()"><strong>🌳</strong>Skill Tree</button>
      <button onclick="closeSheet();openAds()"><strong>📣</strong>Annonser</button>
      <button onclick="closeSheet();openDailyMissions()"><strong>✅</strong>Dagliga mål</button>
      <button onclick="closeSheet();openQuestBoard()"><strong>📋</strong>Uppdragstavla</button>
      <button onclick="closeSheet();openFactions()"><strong>🤝</strong>Faction Rep</button>
      <button onclick="closeSheet();openGarageV1000()"><strong>🚗</strong>Garage</button>
      <button onclick="closeSheet();openHomes()"><strong>🏠</strong>Bostäder</button>
      <button onclick="closeSheet();openCrafting()"><strong>🛠️</strong>Crafting</button>
      <button onclick="closeSheet();openEndgame()"><strong>👑</strong>Endgame</button>
   </div>`
 )
}




function openQuestBoard(){
 let cards=state.questBoard.map((q,i)=>`<div class="card"><b>${q.name}</b><span>${q.energy} stamina · ${money(q.reward)} · +${q.rep} respekt · +${q.xp} XP</span><br><br><button class="btn" onclick="runBoardQuest(${i})">STARTA</button></div>`).join('');
 openSheet('Uppdragstavla','Fristående uppdrag runt Black Haven.','','UPPDRAG',`<div class="grid">${cards}</div>`)
}
function runBoardQuest(i){
 let q=state.questBoard[i];if(!q)return;if(state.energy<q.energy)return toastMsg('För lite stamina.');
 state.energy-=q.energy;state.cash+=q.reward;state.respect+=q.rep;gainXp(q.xp);state.jobsDone++;state.sessionStats.jobs++;
 let keys=Object.keys(state.factions);let f=keys[Math.floor(Math.random()*keys.length)];state.factions[f]=Math.min(100,state.factions[f]+2);
 updateDailyMissions();closeSheet();toastMsg(q.name+' klart.');save();checkEndgame()
}
function openFactions(){
 let rows=Object.entries(state.factions).map(([n,v])=>`<div class="factionCard"><b>${n}</b><span>${v}/100 reputation</span><div class="factionBar"><i style="width:${v}%"></i></div></div>`).join('');
 openSheet('Faction Reputation','Dina relationer med stadens nätverk.','','FACTIONS',`<div class="factionGrid">${rows}</div>`)
}
function openGarageV1000(){
 let cars=[
 {name:'BH Compact',cost:3500,speed:1},
 {name:'Harbor GT',cost:12000,speed:1.35},
 {name:'Midnight V8',cost:28000,speed:1.65},
 {name:'Crown Executive',cost:50000,speed:1.45}
 ];
 let cards=cars.map((v,i)=>`<div class="vehicleCard"><b>${v.name}</b><span>Speed ${v.speed}x · ${money(v.cost)}</span><br><br>${state.garage.some(g=>g.name===v.name&&g.owned)?'<span>ÄGD</span>':`<button class="btn" onclick="buyVehicleV1000('${v.name}',${v.cost},${v.speed})">KÖP</button>`}</div>`).join('');
 openSheet('Garage','Samla och byt fordon.','','GARAGE',`<div class="vehicleGrid">${cards}</div>`)
}
function buyVehicleV1000(name,cost,speed){
 if(state.cash<cost)return toastMsg('Du har inte råd.');
 state.cash-=cost;let g=state.garage.find(x=>x.name===name);if(g){g.owned=true;g.speed=speed}else state.garage.push({name,value:cost,owned:true,speed});
 state.vehicle={name,color:'#7d93aa',value:cost,speed};state.driving=true;closeSheet();toastMsg(name+' köpt.');save()
}
function openHomes(){
 let options=[
 {name:'Ditt rum',cost:0},
 {name:'Harbor Loft',cost:15000},
 {name:'Central Penthouse',cost:45000},
 {name:'Haven Estate',cost:90000}
 ];
 let cards=options.map(h=>`<div class="card"><b>${h.name}</b><span>Värde ${money(h.cost)}</span><br><br>${state.homes.some(x=>x.name===h.name&&x.owned)?'<span>ÄGD</span>':`<button class="btn" onclick="buyHome('${h.name}',${h.cost})">KÖP</button>`}</div>`).join('');
 openSheet('Bostäder','Bostäder ger status och endgame-progress.',`<button class="btn blue" onclick="openHousingBuilder()">ÖPPNA BYGGLÄGE</button>`,'BOSTÄDER',`<div class="grid">${cards}</div><br><div class="card"><b>Bygg ditt eget hem</b><span> I byggläget kan du köpa tomter, välja stil och bygga ut rum för rum.</span></div>`)
}
function buyHome(name,cost){
 if(state.cash<cost)return toastMsg('Du har inte råd.');
 state.cash-=cost;state.homes.push({name,value:cost,owned:true});state.respect+=Math.max(1,Math.round(cost/10000));closeSheet();toastMsg(name+' köpt.');save();checkEndgame()
}
function openCrafting(){
 let recipes=[
 {name:'Förstärkt väst',need:{Skrot:2,Tyg:2},desc:'+15 max HP'},
 {name:'Signal Booster',need:{Elektronik:2,Skrot:1},desc:'+1 Social skill'},
 {name:'Garage Kit',need:{Skrot:3,Elektronik:1},desc:'Bonus till fordon'}
 ];
 let cards=recipes.map((r,i)=>`<div class="card"><b>${r.name}</b><span>${r.desc}<br>Behov: ${Object.entries(r.need).map(([k,v])=>k+' x'+v).join(', ')}</span><br><br><button class="btn" onclick="craftItem(${i})">CRAFTA</button></div>`).join('');
 openSheet('Crafting',`Material: Skrot ${state.materials.Skrot} · Elektronik ${state.materials.Elektronik} · Tyg ${state.materials.Tyg}`,'','CRAFTING',`<div class="craftGrid">${cards}</div>`)
}
function craftItem(i){
 let recipes=[
 {name:'Förstärkt väst',need:{Skrot:2,Tyg:2}},
 {name:'Signal Booster',need:{Elektronik:2,Skrot:1}},
 {name:'Garage Kit',need:{Skrot:3,Elektronik:1}}
 ];
 let r=recipes[i];for(let [k,v] of Object.entries(r.need)){if((state.materials[k]||0)<v)return toastMsg('Saknar '+k);}
 for(let [k,v] of Object.entries(r.need))state.materials[k]-=v;
 if(r.name==='Förstärkt väst')state.maxHp+=15;
 if(r.name==='Signal Booster')state.skills.street++;
 if(r.name==='Garage Kit'&&state.vehicle)state.vehicle.speed=(state.vehicle.speed||1)+.1;
 state.crafted.push(r.name);closeSheet();toastMsg(r.name+' craftad.');save()
}
function openEndgame(){
 checkEndgame();
 openSheet('Endgame','Tre stora vägar att dominera Black Haven.','','ENDGAME',
 `<div class="grid">
 <div class="milestone"><strong>${state.endgame.empire?'✅':'⬜'} Imperium</strong><br><span>Nettoförmögenhet 150 000 kr + 3 företag.</span></div>
 <div class="milestone"><strong>${state.endgame.kingpin?'✅':'⬜'} Kingpin</strong><br><span>100 respekt + gäng med 5 territorier.</span></div>
 <div class="milestone"><strong>${state.endgame.social?'✅':'⬜'} Social Legend</strong><br><span>10 vänner + level 20.</span></div>
 </div>`)
}
function checkEndgame(){
 state.endgame.empire=networth()>=150000&&state.businesses.length>=3;
 state.endgame.kingpin=state.respect>=100&&state.gang&&state.gang.territory>=5;
 state.endgame.social=state.friends.length>=10&&state.level>=20;
}
function openPlayerProfile(){
 openSheet('Spelarprofil',`${state.account.username} ${state.account.tag}`,
 `<button class="btn alt" onclick="editProfile()">REDIGERA PROFIL</button>`,'PROFIL',
 `<div class="profileHero"><h3>${state.account.username}</h3><div class="sub">${state.account.tag} · Level ${state.level} · Respekt ${state.respect}</div><p>${state.bio}</p><span class="badge">${state.status}</span></div>`)
}
function editProfile(){
 openSheet('Redigera profil','Ändra bio och status.',
 `<input id="bioInput" class="input" maxlength="100" value="${state.bio.replace(/"/g,'&quot;')}">
 <input id="statusInput" class="input" maxlength="30" value="${state.status.replace(/"/g,'&quot;')}">
 <button class="btn" onclick="saveProfile()">SPARA</button>`,'PROFIL')
}
function saveProfile(){
 let b=document.getElementById('bioInput')?.value.trim(),s=document.getElementById('statusInput')?.value.trim();
 if(b)state.bio=b;if(s)state.status=s;closeSheet();toastMsg('Profil sparad.');save()
}
function openDm(name){
 state.dmThreads[name]=state.dmThreads[name]||[];
 let msgs=state.dmThreads[name].map(m=>`<div class="bubble ${m.from==='Du'?'me':''}"><b>${m.from}</b><br>${m.text}</div>`).join('');
 openSheet('DM · '+name,'Direktmeddelanden.',
 `<input id="dmInput" class="input" maxlength="160" placeholder="Skriv meddelande..."><button class="btn" onclick="sendDm('${name}')">SKICKA</button>`,'DM',
 `<div class="thread">${msgs||'<div class="card">Ingen historik ännu.</div>'}</div>`)
}
function sendDm(name){
 let el=document.getElementById('dmInput'),text=(el?.value||'').trim();if(!text)return toastMsg('Skriv något först.');
 state.dmThreads[name]=state.dmThreads[name]||[];state.dmThreads[name].push({from:'Du',text});
 state.sessionStats.sms++;updateDailyMissions();gainXp(state.skillTree.social1?8:5);
 setTimeout(()=>{let rs=['Jag svarar senare.','Ses i stan.','Låter bra.','Kör.'];state.dmThreads[name].push({from:name,text:rs[Math.floor(Math.random()*rs.length)]});save()},600);
 closeSheet();toastMsg('DM skickat.');save()
}
function openSkillTree(){
 let nodes=[
 ['combat2','🥊','Combat II','Mer skada'],
 ['street2','🕶️','Street II','Mindre Heat'],
 ['business2','🏢','Business II','Mer företagsinkomst'],
 ['social1','🌐','Social I','Mer XP från DM']
 ];
 let cards=nodes.map(n=>`<div class="node ${state.skillTree[n[0]]?'':'locked'}"><strong>${n[1]}</strong><b>${n[2]}</b><br><span>${n[3]}</span><br><br>${state.skillTree[n[0]]?'UPPLÅST':`<button class="btn" onclick="unlockSkill('${n[0]}')">1 POÄNG</button>`}</div>`).join('');
 openSheet('Skill Tree',`Skill points: ${state.skillPoints}`,'','SKILLS',`<div class="tree">${cards}</div>`)
}
function unlockSkill(id){
 if(state.skillPoints<1)return toastMsg('Du behöver en skill point.');if(state.skillTree[id])return;
 state.skillPoints--;state.skillTree[id]=true;
 if(id==='combat2')state.skills.combat++;if(id==='street2')state.skills.street++;if(id==='business2')state.skills.business++;
 closeSheet();toastMsg('Skill upplåst.');save()
}
function openAds(){
 let rows=state.ads.map((a,i)=>`<div class="listing"><b>${a.type==='sale'?'SÄLJES':'KÖPES'} · ${a.title}</b><span>${a.from} · ${money(a.price)}</span><br><br><button class="btn alt" onclick="openDm('${a.from}')">KONTAKTA</button></div>`).join('');
 openSheet('Annonser','Spelarnas köp- och säljannonser.',`<button class="btn" onclick="postAd()">LÄGG ANNONS</button>`,'ANNONSER',`<div class="tradeGrid">${rows}</div>`)
}
function postAd(){
 state.ads.push({from:'Du',title:'Säljer Skrot',price:400,type:'sale'});closeSheet();toastMsg('Annons publicerad.');save()
}
function openDailyMissions(){
 updateDailyMissions();
 let rows=state.dailyMissions.map((d,i)=>`<div class="card"><b>${d.done?'✅':'⬜'} ${d.name}</b><span>Belöning ${money(d.reward)}</span>${d.done&&!d.claimed?`<br><br><button class="btn" onclick="claimDailyMission(${i})">HÄMTA</button>`:''}</div>`).join('');
 openSheet('Dagliga mål','Små mål som ger extra belöningar.','','DAGLIGA MÅL',`<div class="grid">${rows}</div>`)
}
function updateDailyMissions(){
 if(state.dailyMissions[0])state.dailyMissions[0].done=state.sessionStats.sms>=1;
 if(state.dailyMissions[1])state.dailyMissions[1].done=state.sessionStats.jobs>=2;
 if(state.dailyMissions[2])state.dailyMissions[2].done=state.sessionStats.events>=1;
}
function claimDailyMission(i){
 let d=state.dailyMissions[i];if(!d||!d.done||d.claimed)return;d.claimed=true;state.cash+=d.reward;gainXp(10);toastMsg('Belöning hämtad: '+money(d.reward));save();openDailyMissions()
}
function upgradeFirstBusiness(){
 let b=state.businesses[0];if(!b)return toastMsg('Du äger inget företag.');
 b.level=b.level||1;let cost=Math.round(b.value*.5*b.level);if(state.cash<cost)return toastMsg('Du behöver '+money(cost)+'.');
 state.cash-=cost;b.level++;b.income=Math.round(b.income*1.25);b.value=Math.round(b.value*1.18);state.skillPoints++;closeSheet();toastMsg(b.name+' uppgraderad.');save()
}
function openSocialHub(){
 let online=state.onlinePlayers.map((p,i)=>`<div class="playerRow">
   <div><b><span class="onlineDot"></span>${p.name}</b><div class="playerMeta">Lv ${p.level} · Respekt ${p.respect} · ${p.gang}</div></div>
   <div class="row"><button class="btn blue" onclick="openDm('${p.name}')">DM</button>
   <button class="btn alt" onclick="sendFriendRequest('${p.name}')">VÄN</button>
   <button class="btn green" onclick="inviteParty('${p.name}')">GRUPP</button></div>
 </div>`).join('');
 openSheet('Black Haven Online','Simulerad onlinelobby i denna prototyp.',
 `<div class="socialTabs"><button onclick="openGlobalChat()">Global chatt</button><button onclick="openFriends()">Vänner</button><button onclick="openParty()">Grupp</button><button onclick="openMarketplace()">Marknad</button></div>`,
 'ONLINE',
 online)
}
function socialSms(name){
 let idx=state.contacts.findIndex(c=>c.name===name);
 if(idx<0){state.contacts.push({name,status:'Online',balance:0});idx=state.contacts.length-1}
 composeSms(idx)
}
function sendFriendRequest(name){
 if(state.friends.includes(name))return toastMsg(name+' är redan vän.');
 if(!state.friendRequests.includes(name))state.friendRequests.push(name);
 toastMsg('Vänförfrågan till '+name+' skickad.');save()
}
function openFriends(){
 let rows=state.friends.map(n=>`<div class="playerRow"><div><b>${n}</b><div class="playerMeta">Vän</div></div><button class="btn blue" onclick="socialSms('${n}')">SMS</button></div>`).join('');
 let req=state.friendRequests.map(n=>`<div class="playerRow"><div><b>${n}</b><div class="playerMeta">Förfrågan</div></div><button class="btn" onclick="acceptFriend('${n}')">ACCEPTERA</button></div>`).join('');
 openSheet('Vänner','Dina vänner och förfrågningar.','','VÄNNER',rows+'<div class="sectionTitle">Förfrågningar</div>'+req)
}
function acceptFriend(name){
 if(!state.friends.includes(name))state.friends.push(name);
 state.friendRequests=state.friendRequests.filter(x=>x!==name);
 closeSheet();toastMsg(name+' är nu vän.');save()
}
function openGlobalChat(){
 let msgs=state.globalChat.slice(-20).map(m=>`<div class="chatMsg ${m.from==='Du'?'me':''}"><b>${m.from}</b> <span>${m.time}</span><br>${m.text}</div>`).join('');
 openSheet('Global chatt','Alla spelare i Black Haven.',
 `<input id="globalChatInput" class="input" maxlength="120" placeholder="Skriv i global chat...">
 <button class="btn" onclick="sendGlobalChat()">SKICKA</button>`,'GLOBAL',`<div class="chatBox">${msgs}</div>`)
}
function sendGlobalChat(){
 let el=document.getElementById('globalChatInput');let text=(el?.value||'').trim();if(!text)return toastMsg('Skriv något först.');
 state.globalChat.push({from:'Du',text,time:clock.textContent});
 setTimeout(()=>{let bots=['Rico88','Nova','Ghostline','Kira'];let replies=['Jag såg det.','Plaza?','Kör.', 'Haha, sant.', 'Är vid hamnen.'];state.globalChat.push({from:bots[Math.floor(Math.random()*bots.length)],text:replies[Math.floor(Math.random()*replies.length)],time:clock.textContent});save();},700);
 closeSheet();toastMsg('Skickat i global chat.');save()
}
function inviteParty(name){
 if(!state.party)state.party={leader:'Du',members:['Du']};
 if(state.party.members.includes(name))return toastMsg(name+' är redan i gruppen.');
 state.party.members.push(name);toastMsg(name+' gick med i gruppen.');save()
}
function openParty(){
 if(!state.party)return openSheet('Grupp','Du är inte i någon grupp.',`<button class="btn" onclick="createParty()">SKAPA GRUPP</button>`,'GRUPP');
 let cards=state.party.members.map(n=>`<div class="card"><b>${n}</b><span>${n===state.party.leader?'Ledare':'Medlem'}</span></div>`).join('');
 openSheet('Grupp','Spela tillsammans med andra.',`<button class="btn blue" onclick="partyJob()">GRUPPUPPDRAG</button>`,'GRUPP',`<div class="grid">${cards}</div>`)
}
function createParty(){state.party={leader:'Du',members:['Du']};closeSheet();toastMsg('Grupp skapad.');save()}
function partyJob(){
 if(!state.party||state.party.members.length<2)return toastMsg('Ni behöver minst 2 spelare.');
 if(state.energy<20)return toastMsg('För lite stamina.');
 state.energy-=20;let reward=1200+state.party.members.length*500;state.cash+=reward;state.respect+=4;gainXp(18);closeSheet();toastMsg('Gruppuppdrag klart: '+money(reward));save()
}
function openMarketplace(){
 let items=state.market.map((x,i)=>`<div class="card"><b>${x.item} ×${x.qty}</b><span>Säljare: ${x.seller} · ${money(x.price)}</span><br><br><button class="btn" onclick="buyMarketItem(${i})">KÖP</button></div>`).join('');
 openSheet('Spelarmarknad','Köp föremål från andra simulerade spelare.',
 `<button class="btn alt" onclick="listOwnItem()">LÄGG UT SKROT</button>`,'MARKNAD',`<div class="marketGrid">${items}</div>`)
}
function buyMarketItem(i){
 let x=state.market[i];if(!x)return;if(state.cash<x.price)return toastMsg('Du har inte råd.');
 state.cash-=x.price;addItem(x.item,1,'Köpt på spelarmarknaden.');x.qty--;if(x.qty<=0)state.market.splice(i,1);
 gainXp(4);closeSheet();toastMsg(x.item+' köpt.');save()
}
function listOwnItem(){
 let item=state.inventory.find(i=>i.name==='Skrot'&&i.qty>0);if(!item)return toastMsg('Du har inget skrot att sälja.');
 item.qty--;if(item.qty<=0)state.inventory=state.inventory.filter(i=>i!==item);
 state.market.push({id:'own'+Date.now(),seller:'Du',item:'Skrot',price:350,qty:1});closeSheet();toastMsg('Skrot utlagt för 350 kr.');save()
}
function openLeaderboard(){
 state.leaderboard=state.leaderboard.filter(x=>x.name!=='Du');
 state.leaderboard.push({name:'Du',respect:state.respect,level:state.level});
 state.leaderboard.sort((a,b)=>b.respect-a.respect);
 let rows=state.leaderboard.map((p,i)=>`<div class="playerRow"><div class="rank">#${i+1}</div><div style="flex:1"><b>${p.name}</b><div class="playerMeta">Lv ${p.level} · Respekt ${p.respect}</div></div></div>`).join('');
 openSheet('Leaderboard','Topplistan i Black Haven.','','RANKING',rows)
}
function gainXp(n){
 state.xp+=n;
 let needed=state.level*100;
 while(state.xp>=needed){state.xp-=needed;state.level++;state.diamonds+=2;state.skillPoints++;state.notifications.push('Level up! Du är nu level '+state.level+' och fick 2 diamanter.');needed=state.level*100}
}
function openDaily(){
 let claimed=state.dailyClaimDay===state.day;
 openSheet('Daglig bonus',claimed?'Dagens bonus är redan hämtad.':'Hämta dagens belöning.',
 claimed?'':`<button class="btn" onclick="claimDaily()">HÄMTA BONUS</button>`,
 'DAILY',
 `<div class="card"><b>Dag ${state.day}</b><span>Belöning: 750 kr + 2 diamanter + 10 XP</span></div>`)
}
function claimDaily(){
 if(state.dailyClaimDay===state.day)return toastMsg('Redan hämtad.');
 state.dailyClaimDay=state.day;state.cash+=750;state.diamonds+=2;gainXp(10);closeSheet();toastMsg('+750 kr · +2 diamanter · +10 XP');save()
}
function openAchievements(){
 const list=[
 ['Första SMS',state.achievements.firstSms],
 ['Första samtalet',state.achievements.firstCall],
 ['Generös',state.achievements.donor],
 ['High Roller',state.achievements.highRoller],
 ['Entreprenör',state.achievements.entrepreneur]
 ];
 let html=list.map(x=>`<div class="card"><b>${x[1]?'✅':'⬜'} ${x[0]}</b><span>${x[1]?'Upplåst':'Inte upplåst'}</span></div>`).join('');
 openSheet('Achievements','Milstolpar i Black Haven.','','ACHIEVEMENTS',`<div class="grid">${html}</div>`)
}
function openJobs(){
 let jobs=[
 {name:'Budkörning',cost:10,reward:650,rep:2,heat:2,xp:8},
 {name:'VIP-transport',cost:16,reward:1200,rep:3,heat:4,xp:12},
 {name:'Nattjobb vid kajen',cost:24,reward:2100,rep:5,heat:8,xp:18},
 {name:'Diskret företagsjobb',cost:30,reward:3200,rep:6,heat:6,xp:22}
 ];
 let cards=jobs.map((j,i)=>`<div class="card"><b>${j.name}</b><span>${j.cost} stamina · ${money(j.reward)} · +${j.rep} respekt · +${j.xp} XP</span><br><br><button class="btn" onclick="runJob(${i})">STARTA</button></div>`).join('');
 window._v200jobs=jobs;
 openSheet('Jobbcentral','Välj ett uppdrag.','','JOBB',`<div class="grid">${cards}</div>`)
}
function runJob(i){
 let j=window._v200jobs[i];if(!j)return;
 if(state.energy<j.cost)return toastMsg('För lite stamina.');
 state.energy-=j.cost;state.cash+=j.reward;state.respect+=j.rep;state.heat+=j.heat;state.jobsDone++;state.jobStreak++;state.sessionStats.jobs++;updateDailyMissions();gainXp(j.xp);
 closeSheet();toastMsg(j.name+' klart · +'+money(j.reward));save()
}
function openGangV200(){
 if(!state.gang){
   openSheet('Gäng','Du har inget gäng ännu.',`<button class="btn" onclick="createGangV200()">SKAPA NIGHT CROWN – 2 000 KR</button>`,'GÄNG');
   return
 }
 openSheet(state.gang.name,`Medlemmar: ${state.gang.members} · Territorium: ${state.gang.territory}`,
 `<button class="btn" onclick="recruitMember()">REKRYTERA – 1 500 KR</button>
 <button class="btn alt" onclick="gangJobV200()">GÄNGUPPDRAG</button>`,'GÄNG',
 `<div class="grid"><div class="card"><b>Medlemmar</b><span>${state.gang.members}</span></div><div class="card"><b>Territorium</b><span>${state.gang.territory}</span></div></div>`)
}
function createGangV200(){
 if(state.cash<2000)return toastMsg('Du behöver 2 000 kr.');
 state.cash-=2000;state.gang={name:'Night Crown',members:1,territory:0};state.respect+=5;gainXp(20);closeSheet();toastMsg('Night Crown skapades.');save()
}
function recruitMember(){
 if(state.cash<1500)return toastMsg('Du behöver 1 500 kr.');
 state.cash-=1500;state.gang.members++;state.respect+=1;gainXp(5);closeSheet();toastMsg('Ny medlem rekryterad.');save()
}
function gangJobV200(){
 if(state.energy<25)return toastMsg('För lite stamina.');
 state.energy-=25;state.cash+=2200;state.respect+=5;state.heat+=10;state.gang.territory++;gainXp(20);closeSheet();toastMsg('+2 200 kr · territorium +1');save()
}
function openMenu(){openSheet('Meny','Black Haven Online V2010000. Fiktiv spelvärld. Three Worlds Layout Fix. Center-HUD, Empire-strip, Three Worlds-panel, minimap, quest, Crime Season och sidopaneler använder nu separata zoner. Sekundär information komprimeras eller göms automatiskt på mindre skärmar.',`<button class="btn alt" onclick="toggleRadio()">LJUD: ${state.radio?'PÅ':'AV'}</button><button class="btn red" onclick="resetGame()">NYTT SPEL</button>`,'SYSTEM')}
function toggleRadio(){state.radio=!state.radio;closeSheet();toastMsg('Ljud '+(state.radio?'på':'av'));save()}
function resetGame(){localStorage.removeItem('bh-v1000');localStorage.removeItem('bh-v1500');localStorage.removeItem('bh-v2000');localStorage.removeItem('bh-v2010000');location.reload()}
function openSheet(t,txt,a='',b='INFO',extra=''){sheetTitle.textContent=t;sheetText.innerHTML=txt;sheetActions.innerHTML=a;badges.innerHTML='<span class="badge">'+b+'</span>';sheetExtra.innerHTML=extra;overlay.classList.add('show')}function closeSheet(){overlay.classList.remove('show')}
function showStory(t,txt){storyTitle.textContent=t;storyText.textContent=txt;storyflash.classList.add('show')}function closeStory(){storyflash.classList.remove('show')}
setInterval(()=>{let h=Math.floor(state.time),mm=Math.floor((state.time-h)*60);clock.textContent=String(h).padStart(2,'0')+':'+String(mm).padStart(2,'0')},500);setInterval(save,4000);



/* Black Haven V3000000 — Living City Update */
(function(){
 const districtsSeed=[
  {id:'oldtown',name:'Old Town',vibe:'Historisk kärna',prosperity:58,safety:62,nightlife:42,rent:68,population:18400},
  {id:'harbor',name:'Harbor',vibe:'Kajer & logistik',prosperity:51,safety:44,nightlife:55,rent:49,population:12300},
  {id:'neon',name:'Neon Quarter',vibe:'Nattliv & media',prosperity:67,safety:48,nightlife:88,rent:77,population:21600},
  {id:'northside',name:'Northside',vibe:'Bostäder & verkstäder',prosperity:46,safety:57,nightlife:31,rent:41,population:27900},
  {id:'crown',name:'Crown Heights',vibe:'Finans & lyx',prosperity:86,safety:81,nightlife:64,rent:94,population:9800},
  {id:'industrial',name:'Iron Belt',vibe:'Industri & lager',prosperity:43,safety:39,nightlife:24,rent:32,population:7500}
 ];
 const npcSeed=[
  {id:'mara_lc',name:'Mara',job:'Fixare',home:'Harbor',mood:67,trust:55,wealth:36,goal:'Bygga ett eget nätverk',memory:[]},
  {id:'nova_lc',name:'Nova',job:'DJ / Creator',home:'Neon Quarter',mood:78,trust:48,wealth:52,goal:'Slå igenom i hela staden',memory:[]},
  {id:'isaac_lc',name:'Isaac Vale',job:'Fastighetsmäklare',home:'Crown Heights',mood:62,trust:31,wealth:84,goal:'Kontrollera premiumfastigheter',memory:[]},
  {id:'vera_lc',name:'Vera',job:'Journalist',home:'Old Town',mood:71,trust:40,wealth:44,goal:'Avslöja stadens största historia',memory:[]},
  {id:'leo_lc',name:'Leo',job:'Mekaniker',home:'Northside',mood:59,trust:61,wealth:29,goal:'Öppna Black Havens bästa garage',memory:[]},
  {id:'sable_lc',name:'Sable',job:'Entreprenör',home:'Iron Belt',mood:64,trust:37,wealth:61,goal:'Förvandla Iron Belt',memory:[]}
 ];
 function initLivingCity(){
  state.livingCity=state.livingCity||{};
  state.livingCity.version=3000000;
  state.livingCity.tick=state.livingCity.tick||0;
  state.livingCity.cityScore=state.livingCity.cityScore||50;
  state.livingCity.publicMood=state.livingCity.publicMood||57;
  state.livingCity.districts=state.livingCity.districts||JSON.parse(JSON.stringify(districtsSeed));
  state.livingCity.npcs=state.livingCity.npcs||JSON.parse(JSON.stringify(npcSeed));
  state.livingCity.headlines=state.livingCity.headlines||['Black Haven går in i en ny era: staden reagerar nu på spelarens val.'];
  state.livingCity.events=state.livingCity.events||[];
  state.livingCity.lastDay=state.livingCity.lastDay||state.day||1;
 }
 function clamp(v,a=0,b=100){return Math.max(a,Math.min(b,v))}
 function avg(arr,key){return arr.length?arr.reduce((s,x)=>s+(+x[key]||0),0)/arr.length:0}
 function remember(npc,text,impact=0){
  npc.memory=npc.memory||[];npc.memory.unshift({day:state.day||1,text,impact});npc.memory=npc.memory.slice(0,8);
  npc.trust=clamp((npc.trust||50)+impact);
 }
 function livingCityDayTick(){
  initLivingCity();
  const lc=state.livingCity;if(lc.lastDay===(state.day||1))return;
  let days=Math.max(1,(state.day||1)-lc.lastDay);lc.lastDay=state.day||1;
  for(let d=0;d<days;d++){
   lc.tick++;
   lc.districts.forEach((x,i)=>{
    const wave=Math.sin((lc.tick+i)*.7)*1.4;
    x.prosperity=clamp(x.prosperity+wave+((state.businesses?.length||0)*.03));
    x.safety=clamp(x.safety+(state.heat>55?-.8:.25)+Math.cos((lc.tick+i)*.5)*.5);
    x.nightlife=clamp(x.nightlife+Math.sin((lc.tick+i)*.33)*.65);
    x.rent=clamp(x.rent+(x.prosperity-50)*.008);
   });
   lc.npcs.forEach((n,i)=>{
    n.mood=clamp(n.mood+Math.sin((lc.tick+i)*.9)*2+(lc.publicMood-50)*.01);
    n.wealth=clamp(n.wealth+(Math.random()-.46)*1.8);
   });
   lc.publicMood=clamp(avg(lc.districts,'prosperity')*.45+avg(lc.districts,'safety')*.35+avg(lc.npcs,'mood')*.20);
   lc.cityScore=clamp((avg(lc.districts,'prosperity')+avg(lc.districts,'safety')+lc.publicMood)/3);
   if(lc.tick%3===0){
    const x=lc.districts[Math.floor(Math.random()*lc.districts.length)];
    const headlines=[`${x.name}: hyrorna rör sig efter nya investeringar.`,`${x.name}: invånarna pratar om förändrad trygghet.`,`${x.name}: nytt lokalt initiativ får uppmärksamhet.`,`${x.name}: nattlivet skiftar och nya aktörer syns.`];
    lc.headlines.unshift(headlines[Math.floor(Math.random()*headlines.length)]);lc.headlines=lc.headlines.slice(0,8);
   }
  }
 }
 window.livingCityDayTick=livingCityDayTick;
 window.openLivingCity=function(tab='overview'){
  initLivingCity();livingCityDayTick();const lc=state.livingCity;
  const tabs=`<div class="browserTabs"><button class="btn ${tab==='overview'?'':'alt'}" onclick="openLivingCity('overview')">ÖVERSIKT</button><button class="btn ${tab==='districts'?'':'alt'}" onclick="openLivingCity('districts')">STADSDELAR</button><button class="btn ${tab==='people'?'':'alt'}" onclick="openLivingCity('people')">MÄNNISKOR</button><button class="btn ${tab==='pulse'?'':'alt'}" onclick="openLivingCity('pulse')">CITY PULSE</button></div>`;
  let content='';
  if(tab==='overview'){
   content=`<div class="lcHeadline"><b>LIVING CITY SCORE ${Math.round(lc.cityScore)}/100</b><br>Black Haven simulerar nu stadsdelar, lokalt välstånd, trygghet, hyror, invånarnas humör och NPC-minnen.</div><div class="lcGrid"><div class="lcCard"><h4>Stadens humör</h4><p>${Math.round(lc.publicMood)}/100 · ${lc.publicMood>=65?'Optimistisk':lc.publicMood>=45?'Avvaktande':'Pressad'}</p><div class="lcMeter"><i style="width:${lc.publicMood}%"></i></div></div><div class="lcCard"><h4>Ekonomisk puls</h4><p>Genomsnittligt välstånd ${Math.round(avg(lc.districts,'prosperity'))}/100. Dina företag hjälper gradvis lokala ekonomier.</p><div class="lcMeter"><i style="width:${avg(lc.districts,'prosperity')}%"></i></div></div><div class="lcCard"><h4>Trygghet</h4><p>Genomsnitt ${Math.round(avg(lc.districts,'safety'))}/100. Hög Heat pressar stadsdelarnas trygghet.</p><div class="lcMeter"><i style="width:${avg(lc.districts,'safety')}%"></i></div></div><div class="lcCard"><h4>Levande NPC:er</h4><p>${lc.npcs.length} profiler med arbete, hem, humör, mål, ekonomi, relation och minne.</p><button class="btn" onclick="openLivingCity('people')">SE MÄNNISKOR</button></div></div>`;
  } else if(tab==='districts'){
   content=`<div class="lcGrid">${lc.districts.map(d=>`<div class="lcCard"><h4>${d.name}</h4><p>${d.vibe}<br>Invånare ${Math.round(d.population).toLocaleString('sv-SE')}</p><div class="lcPills"><span class="lcPill">Välstånd ${Math.round(d.prosperity)}</span><span class="lcPill">Trygghet ${Math.round(d.safety)}</span><span class="lcPill">Nattliv ${Math.round(d.nightlife)}</span><span class="lcPill">Hyra ${Math.round(d.rent)}</span></div><button class="btn alt" onclick="livingCityInvest('${d.id}')">INVESTERA 2 500 KR</button></div>`).join('')}</div>`;
  } else if(tab==='people'){
   content=`<div class="lcCard">${lc.npcs.map(n=>`<div class="lcNpcRow"><div><b>${n.name}</b><div class="lcMeta">${n.job} · ${n.home} · Mål: ${n.goal}</div><div class="lcPills"><span class="lcPill">Humör ${Math.round(n.mood)}</span><span class="lcPill">Tillit ${Math.round(n.trust)}</span><span class="lcPill">Ekonomi ${Math.round(n.wealth)}</span></div>${n.memory?.[0]?`<div class="lcMeta">Minns: “${n.memory[0].text}”</div>`:''}</div><div><div class="lcMood">${n.mood>70?'🙂':n.mood>45?'😐':'😟'}</div><button class="btn alt" onclick="livingCityTalk('${n.id}')">PRATA</button></div></div>`).join('')}</div>`;
  } else {
   content=`<div class="lcHeadline"><b>BLACK HAVEN CITY PULSE</b><br>Det här är stadens senaste dynamiska signaler.</div>${lc.headlines.map((h,i)=>`<div class="lcCard"><h4>${i===0?'JUST NU':'TIDIGARE'}</h4><p>${h}</p></div>`).join('')}<br><button class="btn" onclick="livingCitySimulateDay()">SIMULERA EN STADSDAG</button>`;
  }
  openSheet('Living City','Black Haven är inte längre bara en karta. Staden har egen puls och reagerar på hur du lever, bygger och utvecklar dina tre världar.','','V3000000',tabs+content);
 };
 window.livingCityInvest=function(id){
  initLivingCity();if(state.cash<2500)return toastMsg('Du behöver 2 500 kr.');let d=state.livingCity.districts.find(x=>x.id===id);if(!d)return;
  state.cash-=2500;d.prosperity=clamp(d.prosperity+4);d.safety=clamp(d.safety+1.5);d.rent=clamp(d.rent+1.2);state.respect=(state.respect||0)+2;
  state.livingCity.headlines.unshift(`${d.name}: en ny lokal investering märks i stadsdelen.`);state.livingCity.headlines=state.livingCity.headlines.slice(0,8);
  if(typeof applyCrossWorldEffects==='function')applyCrossWorldEffects('empire',1);if(typeof logWorldAction==='function')logWorldAction('empire','Investerade i '+d.name,1);
  save();renderStats();toastMsg('Investering genomförd i '+d.name);openLivingCity('districts');
 };
 window.livingCityTalk=function(id){
  initLivingCity();let n=state.livingCity.npcs.find(x=>x.id===id);if(!n)return;
  const lines=['Du tog dig tid att lyssna.','Ni pratade om vad som händer i staden.','Du frågade om framtidsplaner.','Ni utbytte lokala rykten.'];let text=lines[Math.floor(Math.random()*lines.length)];remember(n,text,2);n.mood=clamp(n.mood+2);state.needs.social=clamp((state.needs?.social||50)+4);
  if(typeof applyCrossWorldEffects==='function')applyCrossWorldEffects('life',1);if(typeof logWorldAction==='function')logWorldAction('life','Pratade med '+n.name,1);
  save();toastMsg(n.name+' kommer ihåg samtalet.');openLivingCity('people');
 };
 window.livingCitySimulateDay=function(){
  initLivingCity();state.day=(state.day||1)+1;state.time=9.0;livingCityDayTick();save();renderStats();toastMsg('En ny stadsdag började.');openLivingCity('pulse');
 };
 initLivingCity();
 const oldOpenMainMenu=window.openMainMenu;
 window.openMainMenu=function(){
  if(typeof openSheet!=='function')return oldOpenMainMenu&&oldOpenMainMenu();
  openSheet('Black Haven V3000000','Huvudcentralen för Three Worlds och Living City.','','HUVUDMENY',`<div class="fullMenuGrid"><button onclick="closeSheet();openLivingCity()"><strong>🌆</strong>Living City</button><button onclick="closeSheet();openThreeWorlds()"><strong>🔺</strong>Three Worlds</button><button onclick="closeSheet();openLifeHub()"><strong>❤️</strong>Life & Lifestyle</button><button onclick="closeSheet();openEmpireHub()"><strong>👑</strong>Empire & Territory</button><button onclick="closeSheet();openCrimeHub()"><strong>🕶️</strong>Street Hub</button><button onclick="closeSheet();openNews()"><strong>📰</strong>Black Haven News</button><button onclick="closeSheet();openUniverseHub()"><strong>🌌</strong>Universe</button><button onclick="closeSheet();openHousingBuilder()"><strong>🏠</strong>Bo & Bygg</button><button onclick="closeSheet();openPhone()"><strong>📱</strong>Telefon</button><button onclick="closeSheet();openJobs()"><strong>💼</strong>Jobbcentral</button><button onclick="closeSheet();openSocialHub()"><strong>🌐</strong>Online</button><button onclick="closeSheet();openMarketplace()"><strong>🛒</strong>Marknad</button><button onclick="closeSheet();openGarageV1000()"><strong>🚗</strong>Garage</button><button onclick="closeSheet();openHomes()"><strong>🏡</strong>Bostäder</button><button onclick="closeSheet();openCrafting()"><strong>🛠️</strong>Crafting</button><button onclick="closeSheet();openCharacter()"><strong>👤</strong>Profil</button><button onclick="closeSheet();openSkillTree()"><strong>🌳</strong>Skill Tree</button><button onclick="closeSheet();openAchievements()"><strong>🏆</strong>Achievements</button><button onclick="closeSheet();openContracts()"><strong>📋</strong>Contracts</button><button onclick="closeSheet();openEndgame()"><strong>👑</strong>Endgame</button></div>`);
 };
 const chip=document.getElementById('versionChip');if(chip)chip.textContent='V3000000 · LIVING CITY';
 setInterval(()=>{try{livingCityDayTick()}catch(e){}},5000);
})();



/* Black Haven V4000000 — Living NPCs */
(function(){
 function clamp4(v,a=0,b=100){return Math.max(a,Math.min(b,v))}
 function pick4(a){return a[Math.floor(Math.random()*a.length)]}
 function initLivingNPCs(){
  if(!state.livingCity && typeof openLivingCity==='function'){try{openLivingCity('overview');closeSheet()}catch(e){}}
  state.livingCity=state.livingCity||{districts:[],npcs:[],headlines:[],events:[]};
  const lc=state.livingCity;
  lc.version=4000000;
  lc.lifeStories=lc.lifeStories||[];
  lc.npcEconomy=lc.npcEconomy||{businesses:[],moves:0,jobChanges:0,relationships:0};
  lc.npcs=(lc.npcs||[]).map((n,i)=>Object.assign({
   age:22+i*3,
   salary:18000+(i*4700),
   savings:2500+(n.wealth||40)*350,
   relationship:'Singel',
   partner:null,
   ambition:45+(i*7)%45,
   stability:55+(i*9)%35,
   careerLevel:1,
   employer:n.job||'Frilans',
   ownedBusiness:null,
   lifeHistory:[],
   lastLifeDay:state.day||1
  },n));
 }
 function districtByName4(name){return (state.livingCity.districts||[]).find(d=>d.name===name)}
 function logLife4(n,text,type='life'){
  n.lifeHistory=n.lifeHistory||[];
  n.lifeHistory.unshift({day:state.day||1,text,type});n.lifeHistory=n.lifeHistory.slice(0,12);
  state.livingCity.lifeStories.unshift({day:state.day||1,name:n.name,text,type});state.livingCity.lifeStories=state.livingCity.lifeStories.slice(0,30);
  state.livingCity.headlines=state.livingCity.headlines||[];
  state.livingCity.headlines.unshift(`${n.name}: ${text}`);state.livingCity.headlines=state.livingCity.headlines.slice(0,10);
 }
 function socialPool4(n){return state.livingCity.npcs.filter(x=>x.id!==n.id)}
 function npcLifeTick4(force=false){
  initLivingNPCs();
  const lc=state.livingCity, day=state.day||1;
  lc.npcs.forEach((n,i)=>{
   if(!force && (n.lastLifeDay||0)>=day)return;
   const elapsed=Math.max(1,day-(n.lastLifeDay||day-1));n.lastLifeDay=day;
   for(let z=0;z<elapsed;z++){
    const district=districtByName4(n.home);
    const salaryDay=(n.salary||18000)/30;
    const rentDay=((district?.rent||50)*7.5)+120;
    n.savings=Math.max(0,(n.savings||0)+salaryDay-rentDay+(Math.random()-.48)*180);
    n.wealth=clamp4((n.wealth||40)+(n.savings>25000?.25:n.savings<2500?-.35:.05));
    n.mood=clamp4((n.mood||50)+(n.savings<2000?-2:.25)+(Math.random()-.5)*3);

    // Career progression / job changes
    const careerChance=.025+((n.ambition||50)/100)*.035;
    if(Math.random()<careerChance){
      n.careerLevel=(n.careerLevel||1)+1;n.salary=Math.round((n.salary||18000)*(1.08+Math.random()*.08));
      lc.npcEconomy.jobChanges++;logLife4(n,`tog ett karriärsteg inom ${n.job} och höjde sin inkomst.`,'career');
    } else if(Math.random()<.018 && (n.stability||50)<65){
      const jobs=['Eventproducent','Fastighetsrådgivare','Mekaniker','Journalist','Designer','Restaurangchef','Tech-konsult','Logistikchef'];
      n.job=pick4(jobs);n.employer=n.job;n.salary=Math.round(19000+Math.random()*36000);lc.npcEconomy.jobChanges++;
      logLife4(n,`bytte jobb och arbetar nu som ${n.job}.`,'career');
    }

    // Moving house
    if(Math.random()<.025 && lc.districts.length){
      const options=lc.districts.filter(d=>d.name!==n.home && (d.rent*350)<Math.max(12000,n.savings*1.6));
      if(options.length){const old=n.home,newD=pick4(options);n.home=newD.name;n.savings=Math.max(0,n.savings-1800);lc.npcEconomy.moves++;logLife4(n,`flyttade från ${old} till ${newD.name}.`,'move')}
    }

    // Relationships between NPCs
    if(!n.partner && Math.random()<.022 && socialPool4(n).length){
      const other=pick4(socialPool4(n).filter(x=>!x.partner)||socialPool4(n));
      if(other && !other.partner){n.partner=other.id;other.partner=n.id;n.relationship=`Tillsammans med ${other.name}`;other.relationship=`Tillsammans med ${n.name}`;n.mood=clamp4(n.mood+8);other.mood=clamp4(other.mood+8);lc.npcEconomy.relationships++;logLife4(n,`blev tillsammans med ${other.name}.`,'relationship');logLife4(other,`blev tillsammans med ${n.name}.`,'relationship')}
    } else if(n.partner && Math.random()<.008){
      const other=lc.npcs.find(x=>x.id===n.partner);if(other){logLife4(n,`gjorde slut med ${other.name}.`,'relationship');logLife4(other,`gjorde slut med ${n.name}.`,'relationship');other.partner=null;other.relationship='Singel';other.mood=clamp4(other.mood-6)}n.partner=null;n.relationship='Singel';n.mood=clamp4(n.mood-6);
    }

    // NPC-owned businesses
    if(!n.ownedBusiness && n.savings>28000 && (n.ambition||50)>55 && Math.random()<.018){
      const kinds=['Café','Studio','Garage','Boutique','Byggfirma','Mediahus','Logistikfirma','Nattklubb'];
      const kind=pick4(kinds),name=`${n.name.split(' ')[0]} ${kind}`;n.ownedBusiness=name;n.savings-=18000;n.salary+=4500;
      lc.npcEconomy.businesses.push({id:'npcbiz_'+Date.now()+'_'+i,name,owner:n.id,district:n.home,value:18000,income:4500});logLife4(n,`startade företaget ${name} i ${n.home}.`,'business');
      const d=districtByName4(n.home);if(d)d.prosperity=clamp4((d.prosperity||50)+2.5);
    }
   }
  });
 }
 window.npcLifeTick4=npcLifeTick4;
 window.openLivingNPCs=function(tab='people'){
  initLivingNPCs();npcLifeTick4();const lc=state.livingCity;
  const tabs=`<div class="browserTabs"><button class="btn ${tab==='people'?'':'alt'}" onclick="openLivingNPCs('people')">LIV</button><button class="btn ${tab==='stories'?'':'alt'}" onclick="openLivingNPCs('stories')">HISTORIK</button><button class="btn ${tab==='economy'?'':'alt'}" onclick="openLivingNPCs('economy')">NPC-EKONOMI</button><button class="btn ${tab==='relations'?'':'alt'}" onclick="openLivingNPCs('relations')">RELATIONER</button></div>`;
  let content='';
  if(tab==='people'){
   content=`<div class="cityStory"><b>V4000000 — LIVING NPCs</b><br>NPC:erna arbetar, tjänar pengar, betalar levnadskostnader, flyttar, byter jobb, bildar relationer och kan starta egna företag.</div><div class="npcLifeGrid">${lc.npcs.map(n=>`<div class="npcLifeCard"><h4>${n.name}</h4><p>${n.job} · ${n.home}<br>${n.relationship||'Singel'}</p><div class="npcLifeTags"><span class="npcLifeTag">Lön ${Math.round(n.salary||0).toLocaleString('sv-SE')} kr</span><span class="npcLifeTag">Sparande ${Math.round(n.savings||0).toLocaleString('sv-SE')} kr</span><span class="npcLifeTag">Karriär Lv ${n.careerLevel||1}</span><span class="npcLifeTag">Humör ${Math.round(n.mood||0)}</span></div>${n.ownedBusiness?`<p>🏢 Äger <b>${n.ownedBusiness}</b></p>`:''}<div class="npcTimeline">${(n.lifeHistory||[]).slice(0,3).map(h=>`<div><b>Dag ${h.day}</b> · ${h.text}</div>`).join('')||'<div>Ingen större livshändelse ännu.</div>'}</div><br><button class="btn alt" onclick="livingNpcInteract4('${n.id}')">UMGÅS</button></div>`).join('')}</div>`;
  } else if(tab==='stories'){
   content=`<div class="cityStory"><b>STADENS LIVSHISTORIK</b><br>Händelserna skapas av NPC-systemet och sparas i deras individuella historik.</div>${(lc.lifeStories||[]).map(s=>`<div class="npcLifeCard"><h4>Dag ${s.day} · ${s.name}</h4><p>${s.text}</p></div>`).join('')||'<div class="npcLifeCard"><p>Inga större livshändelser ännu. Simulera några dagar.</p></div>'}`;
  } else if(tab==='economy'){
   const businesses=lc.npcEconomy.businesses||[];
   content=`<div class="npcLifeGrid"><div class="npcLifeCard"><h4>NPC-företag</h4><p>${businesses.length} aktiva verksamheter skapade av stadens invånare.</p></div><div class="npcLifeCard"><h4>Rörlighet</h4><p>${lc.npcEconomy.moves||0} flyttar · ${lc.npcEconomy.jobChanges||0} karriärförändringar.</p></div></div><br>${businesses.map(b=>`<div class="npcLifeCard"><h4>${b.name}</h4><p>${lc.npcs.find(n=>n.id===b.owner)?.name||'Okänd'} · ${b.district}<br>Beräknad inkomst ${Math.round(b.income).toLocaleString('sv-SE')} kr/mån</p></div>`).join('')||'<div class="npcLifeCard"><p>Ingen NPC har startat företag ännu.</p></div>'}`;
  } else {
   content=`<div class="npcLifeGrid">${lc.npcs.map(n=>{const p=lc.npcs.find(x=>x.id===n.partner);const cls=p?'npcRelationGood':'npcRelationMid';return `<div class="npcLifeCard"><h4>${n.name}</h4><p class="${cls}">${p?'❤️ '+p.name:'○ Singel'}</p><p>Tillit till dig: ${Math.round(n.trust||0)}/100<br>Humör: ${Math.round(n.mood||0)}/100</p></div>`}).join('')}</div>`;
  }
  openSheet('Living NPCs','Invånarna i Black Haven har nu egna livsbanor.','','V4000000',tabs+content);
 };
 window.livingNpcInteract4=function(id){
  initLivingNPCs();const n=state.livingCity.npcs.find(x=>x.id===id);if(!n)return;
  n.trust=clamp4((n.trust||50)+3);n.mood=clamp4((n.mood||50)+2);n.lifeHistory=n.lifeHistory||[];n.lifeHistory.unshift({day:state.day||1,text:'umgicks med spelaren och stärkte relationen.',type:'player'});n.lifeHistory=n.lifeHistory.slice(0,12);
  if(typeof applyCrossWorldEffects==='function')applyCrossWorldEffects('life',1);if(typeof logWorldAction==='function')logWorldAction('life','Umgicks med '+n.name,1);
  save();toastMsg('Relationen med '+n.name+' stärktes.');openLivingNPCs('people');
 };
 window.simulateLivingWeek4=function(){
  initLivingNPCs();for(let i=0;i<7;i++){state.day=(state.day||1)+1;if(typeof livingCityDayTick==='function')livingCityDayTick();npcLifeTick4(true)}save();if(typeof renderStats==='function')renderStats();toastMsg('En vecka passerade i Black Haven.');openLivingNPCs('stories');
 };
 initLivingNPCs();
 const prevMain4=window.openMainMenu;
 window.openMainMenu=function(){
  if(typeof openSheet!=='function')return prevMain4&&prevMain4();
  openSheet('Black Haven V4000000','Living City har utvecklats till Living NPCs: invånarna bygger egna liv parallellt med dina Three Worlds.','','HUVUDMENY',`<div class="fullMenuGrid"><button onclick="closeSheet();openLivingNPCs()"><strong>🧠</strong>Living NPCs</button><button onclick="closeSheet();openLivingCity()"><strong>🌆</strong>Living City</button><button onclick="closeSheet();openThreeWorlds()"><strong>🔺</strong>Three Worlds</button><button onclick="closeSheet();openLifeHub()"><strong>❤️</strong>Life & Lifestyle</button><button onclick="closeSheet();openEmpireHub()"><strong>👑</strong>Empire & Territory</button><button onclick="closeSheet();openCrimeHub()"><strong>🕶️</strong>Street Hub</button><button onclick="closeSheet();openNews()"><strong>📰</strong>Black Haven News</button><button onclick="closeSheet();openUniverseHub()"><strong>🌌</strong>Universe</button><button onclick="closeSheet();openHousingBuilder()"><strong>🏠</strong>Bo & Bygg</button><button onclick="closeSheet();openPhone()"><strong>📱</strong>Telefon</button><button onclick="closeSheet();openJobs()"><strong>💼</strong>Jobbcentral</button><button onclick="closeSheet();openSocialHub()"><strong>🌐</strong>Online</button><button onclick="closeSheet();openMarketplace()"><strong>🛒</strong>Marknad</button><button onclick="closeSheet();openGarageV1000()"><strong>🚗</strong>Garage</button><button onclick="closeSheet();openHomes()"><strong>🏡</strong>Bostäder</button><button onclick="closeSheet();openCrafting()"><strong>🛠️</strong>Crafting</button><button onclick="closeSheet();openCharacter()"><strong>👤</strong>Profil</button><button onclick="closeSheet();openSkillTree()"><strong>🌳</strong>Skill Tree</button><button onclick="closeSheet();openAchievements()"><strong>🏆</strong>Achievements</button><button onclick="closeSheet();openContracts()"><strong>📋</strong>Contracts</button><button onclick="closeSheet();openEndgame()"><strong>👑</strong>Endgame</button></div><br><button class="btn alt" onclick="simulateLivingWeek4()">⏩ SIMULERA 7 DAGAR</button>`);
 };
 const chip4=document.getElementById('versionChip');if(chip4)chip4.textContent='V4000000 · LIVING NPCs';
 setInterval(()=>{try{npcLifeTick4()}catch(e){}},6000);
})();



/* Black Haven V5000000 — Black Haven Chronicle */
(()=>{
 const clamp5=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
 function initChronicle5(){
  state.chronicle=state.chronicle||{};const c=state.chronicle;
  c.version=5000000;c.entries=c.entries||[];c.records=c.records||{};c.legends=c.legends||[];c.eras=c.eras||[{name:'The First Era',start:1,text:'Den moderna historien om Black Haven börjar.'}];c.seenKeys=c.seenKeys||{};c.lastSnapshotDay=c.lastSnapshotDay||0;c.lastHarvest=c.lastHarvest||0;
  c.records.highestNetWorth=c.records.highestNetWorth||0;c.records.highestHeat=c.records.highestHeat||0;c.records.mostNpcBusinesses=c.records.mostNpcBusinesses||0;c.records.bestCityScore=c.records.bestCityScore||0;c.records.longestDay=c.records.longestDay||1;
  return c;
 }
 function addChronicle5(type,title,text,importance=1,tags=[] , key=''){
  const c=initChronicle5();if(key&&c.seenKeys[key])return false;if(key)c.seenKeys[key]=1;
  c.entries.unshift({id:'chr_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),day:state.day||1,type,title,text,importance,tags,time:Date.now()});
  c.entries=c.entries.slice(0,240);return true;
 }
 window.addChronicle5=addChronicle5;
 function playerWorth5(){try{return typeof networth==='function'?networth():(state.cash||0)+(state.bank||0)}catch(e){return (state.cash||0)+(state.bank||0)}}
 function chronicleRecords5(){
  const c=initChronicle5(),lc=state.livingCity||{};const worth=playerWorth5(),heat=state.heat||0,npcBiz=lc.npcEconomy?.businesses?.length||0,city=Math.round(lc.cityScore||0),day=state.day||1;
  if(worth>c.records.highestNetWorth){c.records.highestNetWorth=worth;if(worth>=25000)addChronicle5('record','Nytt förmögenhetsrekord',`Spelarens förmögenhet nådde ${Math.round(worth).toLocaleString('sv-SE')} kr.`,2,['EKONOMI','REKORD'],`worth_${Math.floor(worth/25000)}`)}
  if(heat>c.records.highestHeat){c.records.highestHeat=heat;if(heat>=50)addChronicle5('record','Heat-rekord',`Heat nådde ${Math.round(heat)}/100 och blev en del av stadens historia.`,2,['CRIME','REKORD'],`heat_${Math.floor(heat/10)}`)}
  if(npcBiz>c.records.mostNpcBusinesses){c.records.mostNpcBusinesses=npcBiz;if(npcBiz)addChronicle5('record','Entreprenörsvåg',`${npcBiz} NPC-ägda företag är nu aktiva i Black Haven.`,2,['NPC','EMPIRE'],`npcbiz_${npcBiz}`)}
  if(city>c.records.bestCityScore){c.records.bestCityScore=city;if(city>=65)addChronicle5('record','Staden blomstrar',`Living City Score satte nytt rekord på ${city}/100.`,2,['LIVING CITY','REKORD'],`city_${Math.floor(city/5)}`)}
  c.records.longestDay=Math.max(c.records.longestDay,day);
 }
 function harvestHistory5(){
  const c=initChronicle5(),lc=state.livingCity||{};
  (lc.lifeStories||[]).slice(0,40).forEach((x,i)=>addChronicle5('npc',x.name||'Invånare',x.text||'En livshändelse inträffade.',x.type==='business'||x.type==='relationship'?2:1,['NPC',(x.type||'LIV').toUpperCase()],`life_${x.day}_${x.name}_${x.text}`));
  (state.worldHistory||[]).slice(0,40).forEach(x=>addChronicle5('world',`${String(x.world||'world').toUpperCase()} förändras`,x.label||'En större handling förändrade världen.',Math.abs(x.delta||1)>=2?2:1,['THREE WORLDS',String(x.world||'').toUpperCase()],`world_${x.day}_${x.world}_${x.label}`));
  (lc.headlines||[]).slice(0,12).forEach(h=>addChronicle5('news','Black Haven News',h,1,['NYHET'],`headline_${h}`));
  chronicleRecords5();
  const day=state.day||1;
  if(day-c.lastSnapshotDay>=7){
   c.lastSnapshotDay=day;const richest=[...(lc.npcs||[])].sort((a,b)=>(b.savings||0)-(a.savings||0))[0];const best=[...(lc.districts||[])].sort((a,b)=>(b.prosperity||0)-(a.prosperity||0))[0];
   addChronicle5('snapshot',`Veckokrönika · dag ${day}`,`Stadspoäng ${Math.round(lc.cityScore||0)}/100. ${richest?richest.name+' är rikaste registrerade NPC med '+Math.round(richest.savings||0).toLocaleString('sv-SE')+' kr i sparande. ':''}${best?best.name+' leder välståndsligan.':''}`,2,['VECKA','STAD'],`week_${Math.floor(day/7)}`);
  }
  detectLegends5();detectEras5();save();
 }
 function detectLegends5(){
  const c=initChronicle5(),lc=state.livingCity||{};
  (lc.npcs||[]).forEach(n=>{
   const score=(n.careerLevel||1)*10+(n.savings||0)/3000+(n.trust||0)/5+(n.ownedBusiness?30:0);
   if(score>=75 && !c.legends.some(x=>x.id===n.id)){c.legends.unshift({id:n.id,name:n.name,day:state.day||1,reason:n.ownedBusiness?`byggde ${n.ownedBusiness} och blev en tongivande entreprenör.`:`skapade sig ett namn genom karriär, ekonomi och relationer.`});addChronicle5('legend',`${n.name} blir en stadslegend`,c.legends[0].reason,3,['LEGEND','NPC'],`legend_${n.id}`)}
  });
  if(playerWorth5()>=250000&&!c.legends.some(x=>x.id==='player_empire')){c.legends.unshift({id:'player_empire',name:'Du',day:state.day||1,reason:'byggde en förmögenhet som förändrade maktbalansen i Black Haven.'});addChronicle5('legend','En ny maktspelare',c.legends[0].reason,3,['LEGEND','EMPIRE'],'legend_player_empire')}
 }
 function detectEras5(){
  const c=initChronicle5(),day=state.day||1,lc=state.livingCity||{};const has=n=>c.eras.some(e=>e.name===n);
  if(day>=30&&!has('The Expansion Era')){c.eras.unshift({name:'The Expansion Era',start:day,text:'En hel månad har passerat. Black Haven har börjat forma en egen historia.'});addChronicle5('era','The Expansion Era börjar','Efter 30 dagar går Black Haven in i en ny historisk epok.',3,['ERA'],'era_expansion')}
  if((lc.npcEconomy?.businesses?.length||0)>=4&&!has('The Entrepreneur Era')){c.eras.unshift({name:'The Entrepreneur Era',start:day,text:'NPC-företag har blivit en egen ekonomisk kraft i staden.'});addChronicle5('era','The Entrepreneur Era börjar','Invånarnas företag har blivit en etablerad del av ekonomin.',3,['ERA','EKONOMI'],'era_business')}
  if((state.threeWorlds?.synergy||0)>=75&&!has('The Three Worlds Era')){c.eras.unshift({name:'The Three Worlds Era',start:day,text:'Crime, Life och Empire har nått ovanligt stark balans.'});addChronicle5('era','The Three Worlds Era börjar','Balansen mellan Crime, Life och Empire har blivit historisk.',3,['ERA','THREE WORLDS'],'era_three')}
 }
 window.openChronicle5=function(tab='timeline'){
  initChronicle5();harvestHistory5();const c=state.chronicle,lc=state.livingCity||{};
  const tabs=`<div class="browserTabs"><button class="btn ${tab==='timeline'?'':'alt'}" onclick="openChronicle5('timeline')">TIDSLINJE</button><button class="btn ${tab==='records'?'':'alt'}" onclick="openChronicle5('records')">REKORD</button><button class="btn ${tab==='legends'?'':'alt'}" onclick="openChronicle5('legends')">LEGENDER</button><button class="btn ${tab==='eras'?'':'alt'}" onclick="openChronicle5('eras')">EROR</button></div>`;
  let content='';
  if(tab==='timeline'){
   const list=c.entries.slice(0,70);content=`<div class="chronicleHero"><b>BLACK HAVEN CHRONICLE</b><br>Stadens historia skrivs automatiskt av händelser i Living City, Living NPCs och Three Worlds. ${c.entries.length} historiska poster är sparade.</div>${list.map(e=>`<div class="chronicleCard ${e.importance>=3?'chronicleMajor':''}"><div class="chronicleDay">DAG ${e.day} · ${e.type.toUpperCase()}</div><h4>${e.title}</h4><p>${e.text}</p><div class="chronicleTags">${(e.tags||[]).map(t=>`<span class="chronicleTag">${t}</span>`).join('')}</div></div>`).join('')||'<div class="chronicleCard"><p>Historien har precis börjat.</p></div>'}`;
  } else if(tab==='records'){
   const richest=[...(lc.npcs||[])].sort((a,b)=>(b.savings||0)-(a.savings||0))[0];const topD=[...(lc.districts||[])].sort((a,b)=>(b.prosperity||0)-(a.prosperity||0))[0];
   content=`<div class="chronicleGrid"><div class="chronicleCard"><h4>Högsta förmögenhet</h4><div class="recordValue">${Math.round(c.records.highestNetWorth||0).toLocaleString('sv-SE')} kr</div></div><div class="chronicleCard"><h4>Högsta Heat</h4><div class="recordValue">${Math.round(c.records.highestHeat||0)}</div></div><div class="chronicleCard"><h4>Flest NPC-företag</h4><div class="recordValue">${c.records.mostNpcBusinesses||0}</div></div><div class="chronicleCard"><h4>Bästa City Score</h4><div class="recordValue">${Math.round(c.records.bestCityScore||0)}/100</div></div><div class="chronicleCard"><h4>Rikaste NPC just nu</h4><p>${richest?`${richest.name} · ${Math.round(richest.savings||0).toLocaleString('sv-SE')} kr`:'Ingen data ännu.'}</p></div><div class="chronicleCard"><h4>Starkaste stadsdel</h4><p>${topD?`${topD.name} · välstånd ${Math.round(topD.prosperity||0)}`:'Ingen data ännu.'}</p></div></div>`;
  } else if(tab==='legends'){
   content=`<div class="chronicleHero"><b>HALL OF LEGENDS</b><br>Personer och spelare som lämnat ett permanent avtryck i Black Haven.</div><div class="chronicleGrid">${c.legends.map(l=>`<div class="chronicleCard chronicleMajor"><div class="legendName">${l.name}</div><p>Legendarisk sedan dag ${l.day}. ${l.reason}</p></div>`).join('')||'<div class="chronicleCard"><p>Ingen har blivit en legend ännu.</p></div>'}</div>`;
  } else {
   content=`<div class="chronicleHero"><b>STADENS EROR</b><br>När Black Haven förändras tillräckligt mycket börjar en ny historisk epok.</div>${c.eras.map(e=>`<div class="eraLine"><b>${e.name}</b> · från dag ${e.start}<br><span>${e.text}</span></div>`).join('')}`;
  }
  openSheet('Black Haven Chronicle','Din spelomgång får nu en permanent, läsbar stadshistoria.','','V5000000',tabs+content);
 };
 window.simulateChronicleMonth5=function(){
  initChronicle5();for(let i=0;i<30;i++){state.day=(state.day||1)+1;if(typeof livingCityDayTick==='function')livingCityDayTick();if(typeof npcLifeTick4==='function')npcLifeTick4(true);harvestHistory5()}save();if(typeof renderStats==='function')renderStats();toastMsg('30 dagar har skrivits in i Black Havens historia.');openChronicle5('timeline');
 };
 initChronicle5();harvestHistory5();
 const prevMain5=window.openMainMenu;
 window.openMainMenu=function(){
  if(typeof openSheet!=='function')return prevMain5&&prevMain5();
  openSheet('Black Haven V5000000','Black Haven Chronicle dokumenterar nu hur Living City, Living NPCs och Three Worlds formar stadens historia.','','HUVUDMENY',`<div class="fullMenuGrid"><button onclick="closeSheet();openChronicle5()"><strong>📜</strong>Chronicle</button><button onclick="closeSheet();openLivingNPCs()"><strong>🧠</strong>Living NPCs</button><button onclick="closeSheet();openLivingCity()"><strong>🌆</strong>Living City</button><button onclick="closeSheet();openThreeWorlds()"><strong>🔺</strong>Three Worlds</button><button onclick="closeSheet();openLifeHub()"><strong>❤️</strong>Life & Lifestyle</button><button onclick="closeSheet();openEmpireHub()"><strong>👑</strong>Empire & Territory</button><button onclick="closeSheet();openCrimeHub()"><strong>🕶️</strong>Street Hub</button><button onclick="closeSheet();openNews()"><strong>📰</strong>News</button><button onclick="closeSheet();openUniverseHub()"><strong>🌌</strong>Universe</button><button onclick="closeSheet();openHousingBuilder()"><strong>🏠</strong>Bo & Bygg</button><button onclick="closeSheet();openPhone()"><strong>📱</strong>Telefon</button><button onclick="closeSheet();openJobs()"><strong>💼</strong>Jobb</button><button onclick="closeSheet();openSocialHub()"><strong>🌐</strong>Online</button><button onclick="closeSheet();openMarketplace()"><strong>🛒</strong>Marknad</button><button onclick="closeSheet();openGarageV1000()"><strong>🚗</strong>Garage</button><button onclick="closeSheet();openHomes()"><strong>🏡</strong>Bostäder</button><button onclick="closeSheet();openCharacter()"><strong>👤</strong>Profil</button><button onclick="closeSheet();openAchievements()"><strong>🏆</strong>Achievements</button><button onclick="closeSheet();openEndgame()"><strong>👑</strong>Endgame</button></div><br><button class="btn alt" onclick="simulateChronicleMonth5()">⏩ SIMULERA 30 DAGAR</button>`);
 };
 const chip5=document.getElementById('versionChip');if(chip5)chip5.textContent='V5000000 · CHRONICLE';
 document.title='Black Haven Online V5000000 — Chronicle';
 setInterval(()=>{try{harvestHistory5()}catch(e){}},7000);
})();



(()=>{
 const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
 const pick=a=>a[Math.floor(Math.random()*a.length)];
 const rnd=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
 const cash=n=>Math.round(n||0).toLocaleString('sv-SE')+' kr';
 function initSociety6(){
  state.society6=state.society6||{};const s=state.society6;
  s.version=6000000;s.lastTickDay=s.lastTickDay||state.day||1;s.electionDay=s.electionDay||((state.day||1)+30);
  s.government=Object.assign({mayor:'Elena Ward',approval:54,corruption:18,taxRate:21,policeBudget:55,transitBudget:44,healthBudget:48,educationBudget:46,housingBudget:42,cityBudget:1800000,lobbyPower:0},s.government||{});
  s.candidates=s.candidates||[
   {id:'ward',name:'Elena Ward',party:'Civic Alliance',support:38,platform:'Trygghet + företag',trait:'Pragmatisk'},
   {id:'vale',name:'Marcus Vale',party:'Haven First',support:31,platform:'Polis + låga skatter',trait:'Ambitiös'},
   {id:'rivera',name:'Sofia Rivera',party:'Forward Haven',support:31,platform:'Bostäder + kollektivtrafik',trait:'Idealistisk'}];
  s.laws=s.laws||[
   {id:'rent',name:'Hyresstabilitet',active:false,effect:'Dämpar hyresökningar men minskar fastighetsvinst.'},
   {id:'night',name:'Night Economy Act',active:true,effect:'Nattliv växer snabbare men polisbehovet ökar.'},
   {id:'business',name:'Startup Relief',active:false,effect:'Billigare att starta företag och fler NPC-företag.'},
   {id:'rehab',name:'Second Chance Act',active:false,effect:'Brottsregister påverkar jobb mindre och rehab blir starkare.'}];
  s.economy=Object.assign({cycle:'Stabil',inflation:2.4,unemployment:6.8,interest:4.1,growth:1.8,consumerConfidence:56},s.economy||{});
  s.property=s.property||{index:100,trend:'Stabil',mortgageRate:4.5,districts:{}};
  s.families=s.families||[];s.legacies=s.legacies||[];s.news=s.news||[];s.social=s.social||[];s.rumors=s.rumors||[];
  s.rivals=s.rivals||[
   {id:'crowne',name:'Crowne Holdings',owner:'Adrian Crowne',cash:145000,market:12,strategy:'Fastigheter',hostility:24,businesses:2},
   {id:'neon',name:'Neon Syndicate',owner:'Kira Voss',cash:98000,market:9,strategy:'Nattliv',hostility:48,businesses:1},
   {id:'harbor',name:'Harbor Union',owner:'Mason Reed',cash:121000,market:10,strategy:'Logistik',hostility:18,businesses:2}];
  s.gangs=s.gangs||[
   {name:'Northside',territory:24,power:46,heat:38},{name:'Velvet',territory:21,power:42,heat:27},{name:'Dockers',territory:28,power:51,heat:45},{name:'Night Crown',territory:27,power:49,heat:32}];
  s.justice=Object.assign({record:[],openCases:[],evidence:0,lawyer:'Ingen',prisonRep:0,appeals:0},s.justice||{});
  s.prison=Object.assign({daysServed:0,rank:'Outsider',contacts:[],job:'Ingen',influence:0},s.prison||{});
  s.bank=Object.assign({creditScore:state.creditScore||520,debt:0,mortgage:0,insurance:{car:false,home:false,business:false},claims:0},s.bank||{});
  s.underground=s.underground||{reputation:0,marketHeat:22,rareItems:[{name:'Black Haven Vinyl #000',price:8500},{name:'Prototype Watch',price:14000},{name:'Ghost Key',price:22000}]};
  s.infrastructure=Object.assign({traffic:42,transit:55,airport:48,harbor:64,development:38,projects:[]},s.infrastructure||{});
  s.world=Object.assign({season:'Höst',weatherRisk:16,event:null,otherCities:[{name:'Greyport',economy:54,trade:0},{name:'Nova Bay',economy:68,trade:0},{name:'Ironvale',economy:47,trade:0}]},s.world||{});
  s.careers=s.careers||{player:{track:'Fri',level:1,education:[],certificates:[],fame:0,followers:120,musicFans:0,mediaReach:0,mentor:null,moral:{respected:20,feared:8,trusted:18,opportunistic:10},publicIdentity:'Privatperson',privateIdentity:'Okänd'}};
  s.media=Object.assign({ownedOutlet:null,radioFans:state.radioStation?.fans||0,podcastFans:0,tvReach:0},s.media||{});
  s.businessWorld=s.businessWorld||{restaurants:[],hotels:[],clubs:[],construction:[],bankruptcies:[],auctions:[]};
  s.migration=Object.assign({population:12840,inflow:18,outflow:14,students:620},s.migration||{});
  s.serverEvents=s.serverEvents||[];s.newGameLegacy=s.newGameLegacy||{generation:1,perks:[],inheritedCash:0,story:''};
  syncDistricts6();seedFamilies6();return s;
 }
 function livingNPCs6(){return state.livingCity?.npcs||[]}
 function districts6(){return state.livingCity?.districts||[]}
 function syncDistricts6(){const s=state.society6;if(!s)return;districts6().forEach(d=>{s.property.districts[d.name]=Object.assign({priceIndex:100,rent:6500,trend:0,desirability:50},s.property.districts[d.name]||{});});}
 function seedFamilies6(){const s=state.society6;if(s.families.length)return;const npcs=livingNPCs6();for(let i=0;i<npcs.length;i+=2){const a=npcs[i],b=npcs[i+1];if(!a)continue;s.families.push({id:'fam_'+a.id,surname:(a.name||'Haven').split(' ').slice(-1)[0],members:[a.id].concat(b?[b.id]:[]),wealth:(a.savings||0)+(b?.savings||0),reputation:rnd(20,55),generation:1,children:[],history:[]})}}
 function pushNews6(title,text,tags=['STAD']){const s=initSociety6();s.news.unshift({day:state.day||1,title,text,tags});s.news=s.news.slice(0,80);if(typeof addChronicle5==='function')try{addChronicle5('news',title,text,2,tags,'s6_'+(state.day||1)+'_'+title)}catch(e){}}
 function pushSocial6(from,text,viral=0){const s=initSociety6();s.social.unshift({day:state.day||1,from,text,likes:rnd(3,80)+viral*120,viral});s.social=s.social.slice(0,100)}
 function season6(day){return ['Vinter','Vår','Sommar','Höst'][Math.floor(((day||1)%120)/30)]}
 function playerWorth6(){try{return typeof networth==='function'?networth():(state.cash||0)+(state.bank||0)}catch(e){return (state.cash||0)+(state.bank||0)}}
 function cityTick6(silent=true){const s=initSociety6(),day=state.day||1;if(s.lastTickDay>=day)return;s.lastTickDay=day;
  const gov=s.government,eco=s.economy,inf=eco.inflation/100;
  eco.growth=Math.max(-4,Math.min(6,eco.growth+(Math.random()-.48)*.35));eco.unemployment=clamp(eco.unemployment+(eco.growth<0?.15:-.08)+(Math.random()-.5)*.12,2,18);eco.inflation=clamp(eco.inflation+(Math.random()-.5)*.18,0,15);eco.consumerConfidence=clamp(eco.consumerConfidence+eco.growth*.15-(eco.inflation>6?.5:0)+(Math.random()-.5)*2,10,95);
  eco.cycle=eco.growth>3?'Boom':eco.growth<-.7?'Recession':eco.growth<.8?'Svag':'Stabil';
  gov.cityBudget+=Math.round((gov.taxRate/20)*16000-(gov.policeBudget+gov.transitBudget+gov.healthBudget+gov.educationBudget+gov.housingBudget)*72);
  gov.approval=clamp(gov.approval+(eco.growth>1?.2:-.12)-(gov.corruption>55?.5:0)+(Math.random()-.5)*.6);
  gov.corruption=clamp(gov.corruption+(gov.lobbyPower>35?.15:-.03)+(Math.random()-.5)*.25);
  s.world.season=season6(day);s.world.weatherRisk=clamp(s.world.weatherRisk+(s.world.season==='Vinter'?1.2:s.world.season==='Höst'?.6:-.5)+(Math.random()-.5)*2,3,70);
  s.infrastructure.traffic=clamp(s.infrastructure.traffic+eco.growth*.25-s.infrastructure.transit*.02+(Math.random()-.5)*1.5);s.infrastructure.transit=clamp(s.infrastructure.transit+(gov.transitBudget-45)*.01);s.infrastructure.development=clamp(s.infrastructure.development+eco.growth*.18+(gov.housingBudget-40)*.015);
  districts6().forEach(d=>{const p=s.property.districts[d.name]||(s.property.districts[d.name]={priceIndex:100,rent:6500,trend:0,desirability:50});const crime=(d.crime||d.danger||30),night=(d.nightlife||35),biz=(d.business||d.prosperity||45);p.desirability=clamp((100-crime)*.38+night*.18+biz*.34+s.infrastructure.transit*.1);let delta=(p.desirability-50)*.006+eco.growth*.045-inf*.04+(Math.random()-.5)*.45;if(s.laws.find(x=>x.id==='rent')?.active)delta*=.55;p.trend=delta;p.priceIndex=clamp(p.priceIndex+delta,45,260);p.rent=Math.max(2500,Math.round(6500*(p.priceIndex/100)*(1+eco.inflation/100)));});
  rivalTick6();gangTick6();familyTick6();mediaTick6();migrationTick6();stockTick6();randomEvent6();electionTick6();
  if(!silent&&typeof toastMsg==='function')toastMsg('Black Haven simulerade en samhällsdag.');save();updateSocietyPulse6();
 }
 function rivalTick6(){const s=state.society6;s.rivals.forEach(r=>{const profit=Math.round(r.businesses*rnd(700,1600)*(s.economy.cycle==='Recession'?.65:s.economy.cycle==='Boom'?1.35:1));r.cash=Math.max(0,r.cash+profit-rnd(300,900));if(r.cash>60000&&Math.random()<.08){r.cash-=rnd(18000,32000);r.businesses++;r.market=clamp(r.market+rnd(1,3),0,40);pushNews6(r.name+' expanderar',r.owner+' köper ännu en verksamhet och ökar sin marknadsandel.',['EMPIRE','RIVAL'])}r.hostility=clamp(r.hostility+(playerWorth6()>r.cash?Math.random()*.6:-.1));});}
 function gangTick6(){const s=state.society6;if(Math.random()<.11){let a=pick(s.gangs),b=pick(s.gangs.filter(x=>x!==a));const swing=rnd(1,4);if(a.power+Math.random()*20>b.power){a.territory=clamp(a.territory+swing);b.territory=clamp(b.territory-swing);pushNews6('Territorium skiftar',a.name+' pressar tillbaka '+b.name+' i ett område av staden.',['GÄNG','CRIME']);districts6().forEach(d=>{d.prosperity=clamp((d.prosperity||50)-Math.random()*1.2);});}a.heat=clamp(a.heat+rnd(2,6));}}
 function familyTick6(){
  const s=state.society6,npcs=livingNPCs6();
  s.families.forEach(f=>{
   f.wealth=Math.max(0,f.wealth+rnd(-400,900));
   if(Math.random()<.012&&f.members.length>=2){
    const child={id:'child_'+Date.now()+'_'+rnd(1,9999),name:pick(['Noah','Mira','Elias','Luna','Theo','Alva'])+' '+f.surname,age:0,stage:'Barn'};
    f.children.push(child);
    f.history.unshift('Dag '+(state.day||1)+': '+child.name+' föddes.');
    pushNews6('En ny generation',f.surname+'-familjen välkomnar '+child.name+'.',['FAMILJ','LIFE']);
   }
   f.children.forEach(c=>{
    if((state.day||1)%30===0){
     c.age=(c.age||0)+1;
     c.stage=c.age<13?'Barn':c.age<20?'Ungdom':c.age<65?'Vuxen':'Pensionär';
    }
   });
   if(Math.random()<.003&&f.members.length){
    const id=pick(f.members),n=npcs.find(x=>x.id===id);
    if(n&&n.age&&n.age>75){
     f.members=f.members.filter(x=>x!==id);
     const inherited=Math.round(f.wealth*.35);
     f.wealth-=inherited;
     f.history.unshift('Dag '+(state.day||1)+': '+n.name+' avled. Familjen ärvde '+cash(inherited)+'.');
     s.legacies.unshift({day:state.day||1,name:n.name,inheritance:inherited,reputation:f.reputation});
     pushNews6('Arv förändrar en familj',n.name+' lämnar efter sig '+cash(inherited)+' och ett rykte som lever vidare.',['ARV','LEGACY']);
    }
   }
  });
 }
 function mediaTick6(){const s=state.society6;if(Math.random()<.18){const npc=pick(livingNPCs6());if(npc){const viral=Math.random()<.1?1:0;pushSocial6(npc.name,pick(['Något är på gång vid hamnen.','City Center förändras snabbt.','Någon borde granska stadshuset.','Black Haven sover aldrig.','Nya klubben är full ikväll.']),viral);if(viral){s.careers.player.followers+=rnd(20,120);pushNews6('Inlägg blir viralt',npc.name+' sätter fart på stadens sociala medier.',['SOCIALT','MEDIA'])}}}}
 function migrationTick6(){const s=state.society6;const m=s.migration;m.inflow=Math.max(0,Math.round(12+s.economy.growth*2+s.infrastructure.development*.08));m.outflow=Math.max(0,Math.round(10+s.economy.unemployment*.8-s.government.approval*.06));m.population=Math.max(1000,m.population+m.inflow-m.outflow);m.students=Math.max(100,m.students+rnd(-3,5));}
 function stockTick6(){const s=state.society6;(state.stocks||[]).forEach(st=>{let factor=1+(s.economy.growth*.003)+(Math.random()-.5)*.025;if(st.symbol==='HBR')factor*=1+(s.infrastructure.harbor-50)*.0007;if(st.symbol==='BHC')factor*=1+(s.infrastructure.development-50)*.0006;st.price=Math.max(2,Math.round(st.price*factor*100)/100)});if(state.token)state.token.price=Math.max(1,Math.round(state.token.price*(1+(Math.random()-.48)*.05)*100)/100)}
 function randomEvent6(){const s=state.society6;if(Math.random()>.035)return;const events=[
  ['Blackout Weekend','Ett större strömavbrott slår mot nattliv och företag.','BLACKOUT'],['Market Crash','Marknaden faller kraftigt efter panik bland investerare.','MARKNAD'],['Festival Week','Festivaler fyller centrala Black Haven och nattlivet exploderar.','FESTIVAL'],['Harbor Strike','Hamnen bromsar in och internationell handel störs.','HAMN'],['Storm Warning','En kraftig storm pressar transporter och försäkringsbolag.','VÄDER'],['Election Scandal','Nya uppgifter skakar borgmästarvalet.','POLITIK']];
  const [name,text,type]=pick(events);s.world.event={name,type,day:state.day||1};s.serverEvents.unshift({day:state.day||1,name,type});if(type==='MARKNAD'){s.economy.growth-=2;s.economy.consumerConfidence-=12}if(type==='FESTIVAL'){districts6().forEach(d=>d.nightlife=clamp((d.nightlife||40)+5));s.economy.growth+=.4}if(type==='BLACKOUT'){s.economy.growth-=.6;s.infrastructure.transit-=4}if(type==='HAMN')s.infrastructure.harbor-=7;if(type==='VÄDER')s.world.weatherRisk+=15;if(type==='POLITIK')s.government.corruption+=8;pushNews6(name,text,['SERVER EVENT',type]);}
 function electionTick6(){const s=state.society6,day=state.day||1;if(day<s.electionDay)return;s.candidates.forEach(c=>c.support=clamp(c.support+rnd(-5,5)+((c.id==='ward'?s.government.approval-50:50-s.government.approval)*.08),5,80));const winner=[...s.candidates].sort((a,b)=>b.support-a.support)[0];s.government.mayor=winner.name;s.government.approval=55;s.electionDay=day+60;pushNews6('VALNATT: '+winner.name+' vinner',winner.party+' tar borgmästarposten med '+Math.round(winner.support)+'% stöd i simuleringen.',['POLITIK','VAL']);}
 function updateSocietyPulse6(){const s=initSociety6();let el=document.getElementById('societyPulse6');if(!el){el=document.createElement('div');el.id='societyPulse6';document.getElementById('wrap')?.appendChild(el)}el.innerHTML=`<span>🏛️ <b>${s.government.mayor.split(' ')[0]}</b></span><span>📈 <b>${s.economy.cycle}</b></span><span>🏠 <b>${Math.round(s.property.index||100)}</b></span><span>👥 <b>${s.migration.population.toLocaleString('sv-SE')}</b></span>`;}
 function tabs6(tab){return `<div class="s6Tabs"><button class="btn ${tab==='overview'?'':'alt'}" onclick="openSociety6('overview')">ÖVERSIKT</button><button class="btn ${tab==='politics'?'':'alt'}" onclick="openSociety6('politics')">POLITIK</button><button class="btn ${tab==='economy'?'':'alt'}" onclick="openSociety6('economy')">EKONOMI</button><button class="btn ${tab==='families'?'':'alt'}" onclick="openSociety6('families')">FAMILJER</button><button class="btn ${tab==='justice'?'':'alt'}" onclick="openSociety6('justice')">RÄTT</button><button class="btn ${tab==='rivals'?'':'alt'}" onclick="openSociety6('rivals')">MAKT</button><button class="btn ${tab==='media'?'':'alt'}" onclick="openSociety6('media')">MEDIA</button><button class="btn ${tab==='world'?'':'alt'}" onclick="openSociety6('world')">VÄRLD</button></div>`}
 window.openSociety6=function(tab='overview'){const s=initSociety6();let html=tabs6(tab);
  if(tab==='overview'){html+=`<div class="s6Hero"><b>SOCIETY & POWER</b><br><span class="s6Mini">Politik, ekonomi, familjer, rättssystem, medier, rivaler och stadsutveckling simuleras tillsammans.</span></div><div class="s6Grid"><div class="s6Card"><h4>Borgmästare</h4><div class="s6Value">${s.government.mayor}</div><p>Approval ${Math.round(s.government.approval)}% · Korruption ${Math.round(s.government.corruption)}%</p></div><div class="s6Card"><h4>Konjunktur</h4><div class="s6Value">${s.economy.cycle}</div><p>Tillväxt ${s.economy.growth.toFixed(1)}% · Inflation ${s.economy.inflation.toFixed(1)}% · Arbetslöshet ${s.economy.unemployment.toFixed(1)}%</p></div><div class="s6Card"><h4>Befolkning</h4><div class="s6Value">${s.migration.population.toLocaleString('sv-SE')}</div><p>Inflytt ${s.migration.inflow}/dag · Utflytt ${s.migration.outflow}/dag</p></div><div class="s6Card"><h4>Aktivt event</h4><div class="s6Value">${s.world.event?.name||'Inget'}</div><p>${s.world.season} · väderrisk ${Math.round(s.world.weatherRisk)}%</p></div></div><br><button class="btn" onclick="simulateSociety6(7)">⏩ SIMULERA 7 DAGAR</button> <button class="btn alt" onclick="simulateSociety6(30)">⏩ 30 DAGAR</button>`}
  else if(tab==='politics'){html+=`<div class="s6Hero"><b>STADSHUSET</b><br>Borgmästare ${s.government.mayor} · nästa val dag ${s.electionDay}</div><div class="s6Grid"><div class="s6Card"><h4>Stadsbudget</h4><div class="s6Value">${cash(s.government.cityBudget)}</div><p>Skatt ${s.government.taxRate}% · Lobbying ${Math.round(s.government.lobbyPower)}</p><br><button class="btn" onclick="lobby6()">LOBBYA 10 000 KR</button></div><div class="s6Card"><h4>Budgetprioriteringar</h4><p>Polis ${Math.round(s.government.policeBudget)} · Transit ${Math.round(s.government.transitBudget)} · Hälsa ${Math.round(s.government.healthBudget)} · Utbildning ${Math.round(s.government.educationBudget)} · Bostäder ${Math.round(s.government.housingBudget)}</p><br><button class="btn alt" onclick="shiftBudget6('transit')">+ TRANSIT</button> <button class="btn alt" onclick="shiftBudget6('police')">+ POLIS</button></div></div><div class="sectionTitle">Kandidater</div>${s.candidates.map(c=>`<div class="s6Law"><b>${c.name}</b> · ${c.party} · stöd ${Math.round(c.support)}%<br><span>${c.platform} · ${c.trait}</span></div>`).join('')}<div class="sectionTitle">Lagar</div>${s.laws.map(l=>`<div class="s6Law"><b>${l.name}</b> · <span class="${l.active?'s6Good':'s6Bad'}">${l.active?'AKTIV':'INAKTIV'}</span><br>${l.effect}<br><br><button class="btn alt" onclick="toggleLaw6('${l.id}')">PÅVERKA LAG</button></div>`).join('')}`}
  else if(tab==='economy'){html+=`<div class="s6Grid"><div class="s6Card"><h4>Makroekonomi</h4><div class="s6Value">${s.economy.cycle}</div><p>Inflation ${s.economy.inflation.toFixed(1)}% · Ränta ${s.economy.interest.toFixed(1)}% · Konsumentförtroende ${Math.round(s.economy.consumerConfidence)}</p></div><div class="s6Card"><h4>Bank & kredit</h4><div class="s6Value">${Math.round(s.bank.creditScore)}</div><p>Skuld ${cash(s.bank.debt)} · Bolån ${cash(s.bank.mortgage)}</p><br><button class="btn" onclick="takeLoan6()">ANSÖK LÅN</button> <button class="btn alt" onclick="buyInsurance6()">FÖRSÄKRING</button></div></div><div class="sectionTitle">Fastighetsmarknad</div><div class="s6Grid">${Object.entries(s.property.districts).map(([n,p])=>`<div class="s6Card"><h4>${n}</h4><div class="s6Value">${Math.round(p.priceIndex)}</div><p>Hyra ${cash(p.rent)}/mån · Attraktivitet ${Math.round(p.desirability)} · trend ${p.trend>=0?'+':''}${p.trend.toFixed(2)}</p></div>`).join('')}</div><div class="sectionTitle">Underground market</div>${s.underground.rareItems.map(x=>`<span class="s6Pill">${x.name} · ${cash(x.price)}</span>`).join('')}`}
  else if(tab==='families'){html+=`<div class="s6Hero"><b>FAMILJER & GENERATIONER</b><br>NPC-familjer kan bygga förmögenhet, få barn och lämna arv.</div>${s.families.map(f=>`<div class="s6Family"><b>${f.surname}-familjen · generation ${f.generation}</b><br>Förmögenhet ${cash(f.wealth)} · rykte ${Math.round(f.reputation)} · barn ${f.children.length}<br><span class="s6Mini">${f.children.map(c=>c.name+' ('+c.stage+')').join(', ')||'Ingen nästa generation ännu.'}</span></div>`).join('')}<div class="sectionTitle">Legacy</div>${s.legacies.slice(0,10).map(l=>`<div class="s6Card"><b>${l.name}</b><p>Dag ${l.day} · arv ${cash(l.inheritance)} · rykte ${l.reputation}</p></div>`).join('')||'<div class="s6Card"><p>Inga arvshändelser ännu.</p></div>'}`}
  else if(tab==='justice'){html+=`<div class="s6Grid"><div class="s6Card"><h4>Brottsregister</h4><div class="s6Value">${s.justice.record.length}</div><p>Öppna fall ${s.justice.openCases.length} · Bevis ${s.justice.evidence} · Advokat ${s.justice.lawyer}</p><br><button class="btn" onclick="hireLawyer6()">ANLITA ADVOKAT</button> <button class="btn alt" onclick="rehab6()">REHABVÄG</button></div><div class="s6Card"><h4>Fängelsevärld</h4><div class="s6Value">${s.prison.rank}</div><p>Inflytande ${Math.round(s.prison.influence)} · kontakter ${s.prison.contacts.length} · jobb ${s.prison.job}</p><br><button class="btn alt" onclick="prisonNetwork6()">BYGG KONTAKT</button></div></div><div class="sectionTitle">Karriär & utbildning</div><div class="s6Card"><b>${s.careers.player.track}</b><p>Nivå ${s.careers.player.level} · utbildningar ${s.careers.player.education.join(', ')||'inga'} · certifikat ${s.careers.player.certificates.join(', ')||'inga'}</p><br><button class="btn" onclick="study6()">GÅ KURS</button> <button class="btn alt" onclick="career6()">BYT KARRIÄR</button></div>`}
  else if(tab==='rivals'){html+=`<div class="s6Hero"><b>RIVALISERANDE IMPERIER & GÄNG</b><br>AI-maktspelare expanderar, konkurrerar och förändrar marknaden.</div>${s.rivals.map(r=>`<div class="s6Rival"><b>${r.name}</b> · ${r.owner}<br>${r.strategy} · ${r.businesses} företag · ${cash(r.cash)} · marknad ${Math.round(r.market)}% · rivalitet ${Math.round(r.hostility)}%</div>`).join('')}<div class="sectionTitle">Territorier</div><div class="s6Grid">${s.gangs.map(g=>`<div class="s6Card"><h4>${g.name}</h4><div class="s6Value">${Math.round(g.territory)}%</div><p>Makt ${Math.round(g.power)} · Heat ${Math.round(g.heat)}</p></div>`).join('')}</div>`}
  else if(tab==='media'){html+=`<div class="s6Grid"><div class="s6Card"><h4>Din offentliga profil</h4><div class="s6Value">${s.careers.player.followers.toLocaleString('sv-SE')}</div><p>följare · Fame ${Math.round(s.careers.player.fame)} · Media reach ${Math.round(s.careers.player.mediaReach)}</p><br><button class="btn" onclick="mediaCareer6()">SKAPA MEDIA</button> <button class="btn alt" onclick="musicCareer6()">SLÄPP LÅT</button></div><div class="s6Card"><h4>Identitet & moral</h4><p>Offentlig: ${s.careers.player.publicIdentity}<br>Privat: ${s.careers.player.privateIdentity}<br>Respekterad ${Math.round(s.careers.player.moral.respected)} · Fruktad ${Math.round(s.careers.player.moral.feared)} · Pålitlig ${Math.round(s.careers.player.moral.trusted)}</p><br><button class="btn alt" onclick="toggleIdentity6()">HEMLIG IDENTITET</button></div></div><div class="sectionTitle">Nyheter</div><div class="s6Feed">${s.news.slice(0,25).map(n=>`<div class="s6FeedItem"><b>Dag ${n.day} · ${n.title}</b><br>${n.text}</div>`).join('')||'Inga nyheter ännu.'}</div><div class="sectionTitle">Socialt flöde</div>${s.social.slice(0,12).map(x=>`<div class="s6FeedItem"><b>${x.from}</b> · ❤️ ${x.likes}<br>${x.text}</div>`).join('')}`}
  else {html+=`<div class="s6Grid"><div class="s6Card"><h4>Infrastruktur</h4><p>Trafik ${Math.round(s.infrastructure.traffic)} · Kollektivtrafik ${Math.round(s.infrastructure.transit)} · Flygplats ${Math.round(s.infrastructure.airport)} · Hamn ${Math.round(s.infrastructure.harbor)} · Utveckling ${Math.round(s.infrastructure.development)}</p><br><button class="btn" onclick="buildProject6()">STARTA STADSPROJEKT</button></div><div class="s6Card"><h4>Värld & handel</h4><div class="s6Value">${s.world.season}</div><p>Aktivt event: ${s.world.event?.name||'Inget'} · Weather risk ${Math.round(s.world.weatherRisk)}%</p></div></div><div class="sectionTitle">Andra städer</div>${s.world.otherCities.map(c=>`<div class="s6Law"><b>${c.name}</b> · ekonomi ${c.economy} · handel ${cash(c.trade)}<br><button class="btn alt" onclick="tradeCity6('${c.name}')">HANDLA</button></div>`).join('')}<div class="sectionTitle">Server events</div>${s.serverEvents.slice(0,12).map(e=>`<span class="s6Pill">Dag ${e.day}: ${e.name}</span>`).join('')||'<span class="s6Mini">Inga större events ännu.</span>'}`}
  openSheet('Society & Power','Black Haven är nu en samhällssimulering där makt, ekonomi och människor utvecklas tillsammans.','','V6000000',html);
 };
 window.simulateSociety6=function(days=7){initSociety6();for(let i=0;i<days;i++){state.day=(state.day||1)+1;if(typeof livingCityDayTick==='function')livingCityDayTick();if(typeof npcLifeTick4==='function')npcLifeTick4(true);cityTick6(true);if(typeof harvestHistory5==='function')try{harvestHistory5()}catch(e){}}save();if(typeof renderStats==='function')renderStats();toastMsg(days+' samhällsdagar simulerade.');openSociety6('overview')};
 window.lobby6=function(){const s=initSociety6();if((state.cash||0)<10000)return toastMsg('Du behöver 10 000 kr.');state.cash-=10000;s.government.lobbyPower=clamp(s.government.lobbyPower+10);s.government.corruption=clamp(s.government.corruption+2);s.careers.player.moral.opportunistic=clamp(s.careers.player.moral.opportunistic+3);pushNews6('Lobbying ökar','Nya intressen försöker påverka stadshusets beslut.',['POLITIK']);save();openSociety6('politics')};
 window.shiftBudget6=function(kind){const s=initSociety6();if(kind==='transit'){s.government.transitBudget=clamp(s.government.transitBudget+5);s.infrastructure.transit=clamp(s.infrastructure.transit+2)}else{s.government.policeBudget=clamp(s.government.policeBudget+5);s.gangs.forEach(g=>g.heat=clamp(g.heat+2))}s.government.cityBudget-=25000;save();openSociety6('politics')};
 window.toggleLaw6=function(id){const s=initSociety6(),l=s.laws.find(x=>x.id===id);if(!l)return;l.active=!l.active;if(id==='business'&&l.active)s.economy.consumerConfidence+=4;if(id==='rehab'&&l.active)s.careers.player.moral.trusted+=3;pushNews6(l.name+(l.active?' antas':' stoppas'),'Stadens lagstiftning ändras efter politiskt tryck.',['LAG','POLITIK']);save();openSociety6('politics')};
 window.takeLoan6=function(){const s=initSociety6();const amt=s.bank.creditScore>650?30000:s.bank.creditScore>550?15000:7000;state.cash=(state.cash||0)+amt;s.bank.debt+=Math.round(amt*(1+s.economy.interest/100));toastMsg('Lån beviljat: '+cash(amt));save();openSociety6('economy')};
 window.buyInsurance6=function(){const s=initSociety6();if((state.cash||0)<2400)return toastMsg('Du behöver 2 400 kr.');state.cash-=2400;s.bank.insurance.car=s.bank.insurance.home=s.bank.insurance.business=true;toastMsg('Bil, hem och företag är försäkrade.');save();openSociety6('economy')};
 window.hireLawyer6=function(){const s=initSociety6();if((state.cash||0)<6000)return toastMsg('Du behöver 6 000 kr.');state.cash-=6000;s.justice.lawyer='Avery Cole';s.justice.evidence=Math.max(0,s.justice.evidence-1);save();toastMsg('Advokat anlitad.');openSociety6('justice')};
 window.rehab6=function(){const s=initSociety6();if((state.cash||0)<1200)return toastMsg('Du behöver 1 200 kr.');state.cash-=1200;state.heat=Math.max(0,(state.heat||0)-12);s.careers.player.moral.trusted=clamp(s.careers.player.moral.trusted+6);s.careers.player.moral.respected=clamp(s.careers.player.moral.respected+4);pushNews6('Second chance','En rehabiliteringsväg börjar förändra spelarens offentliga profil.',['LIFE','REHAB']);save();openSociety6('justice')};
 window.prisonNetwork6=function(){const s=initSociety6();s.prison.influence=clamp(s.prison.influence+rnd(3,8));if(Math.random()<.45)s.prison.contacts.push(pick(['Rook','Mendoza','Silas','Juno']));s.prison.rank=s.prison.influence>60?'Shot Caller':s.prison.influence>30?'Connected':'Outsider';save();openSociety6('justice')};
 window.study6=function(){const s=initSociety6();if((state.cash||0)<3500)return toastMsg('Kursen kostar 3 500 kr.');state.cash-=3500;const c=pick(['Business Certificate','Media Production','Criminal Justice','Programming','Hospitality Management']);if(!s.careers.player.education.includes(c))s.careers.player.education.push(c);s.careers.player.level++;toastMsg('Klar: '+c);save();openSociety6('justice')};
 window.career6=function(){const s=initSociety6();s.careers.player.track=pick(['Polis','Läkare','Journalist','Advokat','Politiker','Entreprenör','Artist','Mekaniker','Programmerare']);s.careers.player.level=1;toastMsg('Ny karriär: '+s.careers.player.track);save();openSociety6('justice')};
 window.mediaCareer6=function(){const s=initSociety6();if((state.cash||0)<8000)return toastMsg('Du behöver 8 000 kr.');state.cash-=8000;s.media.ownedOutlet=s.media.ownedOutlet||'Haven Wire';s.careers.player.mediaReach+=12;s.careers.player.followers+=rnd(100,400);pushNews6('Nytt spelarägt medium',s.media.ownedOutlet+' börjar publicera i Black Haven.',['MEDIA','EMPIRE']);save();openSociety6('media')};
 window.musicCareer6=function(){const s=initSociety6();if((state.cash||0)<2500)return toastMsg('Studio kostar 2 500 kr.');state.cash-=2500;const fans=rnd(80,650);s.careers.player.musicFans+=fans;s.careers.player.fame=clamp(s.careers.player.fame+fans/80);s.careers.player.followers+=Math.round(fans*.35);pushSocial6('Du','Ny singel ute i Black Haven.',fans>450?1:0);save();toastMsg('+'+fans+' musikfans');openSociety6('media')};
 window.toggleIdentity6=function(){const s=initSociety6();state.dualIdentity=!state.dualIdentity;s.careers.player.privateIdentity=state.dualIdentity?'Night Alias':'Okänd';s.careers.player.publicIdentity=state.dualIdentity?'Entreprenör':'Privatperson';save();openSociety6('media')};
 window.buildProject6=function(){const s=initSociety6();if((state.cash||0)<12000)return toastMsg('Du behöver 12 000 kr.');state.cash-=12000;const p=pick(['Ny tunnelbanestation','Harbor Terminal','Innovation District','Waterfront Housing','Airport Express']);s.infrastructure.projects.unshift({day:state.day||1,name:p});s.infrastructure.development=clamp(s.infrastructure.development+6);s.infrastructure.transit=clamp(s.infrastructure.transit+(p.includes('station')||p.includes('Express')?8:2));pushNews6('Nytt stadsprojekt',p+' får klartecken och börjar förändra Black Haven.',['STADSUTVECKLING']);save();openSociety6('world')};
 window.tradeCity6=function(name){const s=initSociety6(),c=s.world.otherCities.find(x=>x.name===name);if(!c)return;if((state.cash||0)<4000)return toastMsg('Du behöver 4 000 kr i handelskapital.');state.cash-=4000;const gain=rnd(3000,7500);state.cash+=gain;c.trade+=gain;s.infrastructure.harbor=clamp(s.infrastructure.harbor+1);toastMsg('Handelsresultat: '+cash(gain-4000));save();openSociety6('world')};
 initSociety6();updateSocietyPulse6();
 const prevMain6=window.openMainMenu;window.openMainMenu=function(){if(typeof openSheet!=='function')return prevMain6&&prevMain6();openSheet('Black Haven V6000000','Society & Power binder ihop politik, ekonomi, familjer, rättssystem, medier, rivaler och stadsutveckling.','','HUVUDMENY',`<div class="fullMenuGrid"><button onclick="closeSheet();openSociety6()"><strong>🏛️</strong>Society & Power</button><button onclick="closeSheet();openChronicle5()"><strong>📜</strong>Chronicle</button><button onclick="closeSheet();openLivingNPCs()"><strong>🧠</strong>Living NPCs</button><button onclick="closeSheet();openLivingCity()"><strong>🌆</strong>Living City</button><button onclick="closeSheet();openThreeWorlds()"><strong>🔺</strong>Three Worlds</button><button onclick="closeSheet();openLifeHub()"><strong>❤️</strong>Life</button><button onclick="closeSheet();openEmpireHub()"><strong>👑</strong>Empire</button><button onclick="closeSheet();openCrimeHub()"><strong>🕶️</strong>Crime</button><button onclick="closeSheet();openNews()"><strong>📰</strong>News</button><button onclick="closeSheet();openUniverseHub()"><strong>🌌</strong>Universe</button><button onclick="closeSheet();openHousingBuilder()"><strong>🏠</strong>Bo & Bygg</button><button onclick="closeSheet();openPhone()"><strong>📱</strong>Telefon</button><button onclick="closeSheet();openJobs()"><strong>💼</strong>Jobb</button><button onclick="closeSheet();openSocialHub()"><strong>🌐</strong>Online</button><button onclick="closeSheet();openMarketplace()"><strong>🛒</strong>Marknad</button><button onclick="closeSheet();openGarageV1000()"><strong>🚗</strong>Garage</button><button onclick="closeSheet();openHomes()"><strong>🏡</strong>Bostäder</button><button onclick="closeSheet();openCharacter()"><strong>👤</strong>Profil</button><button onclick="closeSheet();openEndgame()"><strong>👑</strong>Endgame</button></div><br><button class="btn alt" onclick="simulateSociety6(30)">⏩ SIMULERA 30 SAMHÄLLSDAGAR</button>`)};
 const chip=document.getElementById('versionChip');if(chip)chip.textContent='V6000000 · SOCIETY & POWER';document.title='Black Haven Online V6000000 — Society & Power';
 setInterval(()=>{try{cityTick6(true)}catch(e){}},6000);
})();


/* V7000000 — Visual Overhaul */
(function(){
  function clamp7(v,min=0,max=100){return Math.max(min,Math.min(max,v))}
  function initVisual7(){
    state.visualOverhaul7=state.visualOverhaul7||{theme:'obsidian',compact:false,glow:true,dock:true};
    return state.visualOverhaul7;
  }
  function applyVisualTheme7(){
    const s=initVisual7();
    document.body.classList.remove('v7-theme-neon','v7-theme-royal','v7-compact','v7-glow-off');
    if(s.theme==='neon')document.body.classList.add('v7-theme-neon');
    if(s.theme==='royal')document.body.classList.add('v7-theme-royal');
    if(s.compact)document.body.classList.add('v7-compact');
    const chip=document.getElementById('versionChip');
    if(chip)chip.textContent='V7000000 · VISUAL OVERHAUL';
    const logoSmall=document.querySelector('.logo small');
    if(logoSmall)logoSmall.textContent='ONLINE · V7000000';
    const menuBtn=document.querySelector('.megaMenuBtn');
    if(menuBtn)menuBtn.textContent='☰ BLACK HAVEN HUB';
    document.title='Black Haven Online V7000000 — Visual Overhaul';
  }
  function buildVisualDock7(){
    const s=initVisual7();
    const wrap=document.getElementById('wrap');
    if(!wrap)return;
    let dock=document.getElementById('v7QuickDock');
    if(!dock){
      dock=document.createElement('div');
      dock.id='v7QuickDock';
      dock.innerHTML=[
        '<button onclick="openMainMenu()">☰<span>HUB</span></button>',
        '<button onclick="openVisualHub7()">✨<span>UI</span></button>',
        '<button onclick="openLivingCity()">🌆<span>CITY</span></button>',
        '<button onclick="openSociety6()">🏛️<span>POWER</span></button>'
      ].join('');
      wrap.appendChild(dock);
    }
    dock.style.display=s.dock?'grid':'none';
  }
  function kpi7(label,val){return '<div class="v7Kpi"><span>'+label+'</span><b>'+val+'</b></div>'}
  function themeCard7(id,title,desc,swatches){
    return `<div class="v7ThemeCard"><h5>${title}</h5><p>${desc}</p><div class="v7Swatches">${swatches.map(c=>`<span class="v7Swatch" style="background:${c}"></span>`).join('')}</div><div class="row"><button class="btn ${initVisual7().theme===id?'alt':''}" onclick="setTheme7('${id}')">${initVisual7().theme===id?'AKTIV':'VÄLJ TEMA'}</button></div></div>`;
  }
  window.setTheme7=function(theme){const s=initVisual7();s.theme=theme;applyVisualTheme7();save();openVisualHub7('themes')}
  window.toggleCompact7=function(){const s=initVisual7();s.compact=!s.compact;applyVisualTheme7();save();openVisualHub7('layout')}
  window.toggleDock7=function(){const s=initVisual7();s.dock=!s.dock;buildVisualDock7();save();openVisualHub7('layout')}
  window.openVisualHub7=function(tab='overview'){
    const s=initVisual7();
    const lc=state.livingCity||{};
    const chron=state.chronicle||{};
    const society=state.society6||{};
    const tabs=`<div class="browserTabs"><button class="btn ${tab==='overview'?'':'alt'}" onclick="openVisualHub7('overview')">ÖVERSIKT</button><button class="btn ${tab==='themes'?'':'alt'}" onclick="openVisualHub7('themes')">TEMAN</button><button class="btn ${tab==='layout'?'':'alt'}" onclick="openVisualHub7('layout')">LAYOUT</button><button class="btn ${tab==='dashboard'?'':'alt'}" onclick="openVisualHub7('dashboard')">DASHBOARD</button></div>`;
    let html='';
    if(tab==='overview'){
      html=`<div class="v7Hero"><h3>Black Haven V7000000</h3><p>Visual Overhaul fokuserar på starkare art direction, renare panelstruktur, snabbare navigation och en mer premium spelkänsla på både mobil och större skärmar.</p><div class="v7PillRow"><span class="v7Pill">Tema: ${s.theme.toUpperCase()}</span><span class="v7Pill">Kompakt UI: ${s.compact?'PÅ':'AV'}</span><span class="v7Pill">Quick Dock: ${s.dock?'PÅ':'AV'}</span></div></div><div class="v7Grid"><div class="v7Tile"><strong>🎨</strong><b>Ny art direction</b><span>Mörk premiumbas med neonljus, glasytor, djupare skuggor och tydligare hierarki.</span></div><div class="v7Tile"><strong>🧭</strong><b>Renare layout</b><span>Förbättrad HUD, upphöjd botten-docka, snabbnavigering och mer luft i informationszonerna.</span></div><div class="v7Tile"><strong>📱</strong><b>Mobil först</b><span>Dockan och de viktiga panelerna hålls läsbara på smala skärmar utan att tappa spelkänslan.</span></div></div><div class="v7Section"><h4>SYSTEMSTATUS</h4>${kpi7('Three Worlds Synergy',(state.threeWorlds?.synergy||0)+'%')}${kpi7('Living City Score',Math.round(lc.cityScore||0)+'/100')}${kpi7('Chronicle-poster',(chron.entries?.length||0))}${kpi7('Samhällsmakt',Math.round((society.government?.influence||18))+' inflytande')}</div>`;
    } else if(tab==='themes'){
      html=`<div class="v7Hero"><h3>Teman</h3><p>Byt färgidentitet utan att ändra speldata. Temat påverkar panelglow, accenter och helhetskänsla.</p></div><div class="v7MiniGrid">${themeCard7('obsidian','Obsidian Gold','Mörk, exklusiv och nära Black Havens ursprungliga identitet.',['#0b1522','#17314c','#f0c870','#7ef0ff'])}${themeCard7('neon','Neon Pulse','Mer cyber-neon med kallare glöd och tydligare futuristisk nattkänsla.',['#08131d','#1b2f4a','#7be8ff','#ee8dff'])}${themeCard7('royal','Royal Violet','Lugnare lyx med lila underton och mer dramatisk premiumkänsla.',['#0b1321','#2c2346','#ca8dff','#e7c580'])}</div>`;
    } else if(tab==='layout'){
      html=`<div class="v7Hero"><h3>Layout & navigation</h3><p>Justera täthet och snabbnavigering efter hur du vill spela Black Haven.</p></div><div class="v7MiniGrid"><div class="v7ThemeCard"><h5>Kompakt UI</h5><p>Minskar typstorlekar och paddings lite för att visa mer data samtidigt.</p><button class="btn" onclick="toggleCompact7()">${s.compact?'STÄNG AV KOMPAKT':'AKTIVERA KOMPAKT'}</button></div><div class="v7ThemeCard"><h5>Quick Dock</h5><p>Visar en snabbmeny för de viktigaste delarna: Hub, UI, City och Power.</p><button class="btn" onclick="toggleDock7()">${s.dock?'DÖLJ QUICK DOCK':'VISA QUICK DOCK'}</button></div></div><div class="v7Section"><h4>DESIGNPRINCIPER</h4><div class="v7Kpi"><span>Informationszoner</span><b>Top HUD / Side Panels / Bottom Dock</b></div><div class="v7Kpi"><span>Interaktion</span><b>Starkare knappar och snabbare läsbarhet</b></div><div class="v7Kpi"><span>Responsivt fokus</span><b>Mobil, surfplatta och desktop</b></div></div>`;
    } else {
      const richestNpc=((lc.npcs||[]).slice().sort((a,b)=>(b.savings||0)-(a.savings||0))[0]||{}).name||'—';
      html=`<div class="v7Hero"><h3>Dashboard vision</h3><p>Visual Overhaul förbereder Black Haven för större dashboards, tydligare beslutsskärmar och snyggare presentation av alla djupa system.</p></div><div class="v7Grid"><div class="v7Tile"><strong>💰</strong><b>Ekonomi</b><span>Rikaste NPC: ${richestNpc}. Bättre ekonomiöversikter gör Empire och Society lättare att läsa.</span></div><div class="v7Tile"><strong>📰</strong><b>Live-flöden</b><span>Nyheter, rykten och sociala poster kan få en mer app-lik, modern tidslinje.</span></div><div class="v7Tile"><strong>🧬</strong><b>Generationer</b><span>Familjer, arv och släktträd kan presenteras som riktiga visuella översikter i nästa version.</span></div></div><div class="row"><button class="btn blue" onclick="closeSheet();openChronicle5()">ÖPPNA CHRONICLE</button><button class="btn green" onclick="closeSheet();openSociety6()">ÖPPNA SOCIETY & POWER</button><button class="btn alt" onclick="closeSheet();openLivingNPCs()">ÖPPNA LIVING NPCs</button></div>`;
    }
    openSheet('Visual Overhaul','Grafik och layout har lyfts för att göra Black Haven mer sammanhållet, premium och lättnavigerat.','','V7000000',tabs+html);
  };
  const prevMain7=window.openMainMenu;
  window.openMainMenu=function(){
    if(typeof openSheet!=='function')return prevMain7&&prevMain7();
    const lc=state.livingCity||{};
    const pop=(lc.npcs||[]).length||8;
    const city=Math.round(lc.cityScore||0);
    const synergy=(state.threeWorlds?.synergy||0);
    openSheet('Black Haven Hub','Black Haven är nu en djup stads- och maktsimulering med förbättrad visuell identitet och renare struktur.','','V7000000',`
      <div class="v7Hero">
        <h3>BLACK HAVEN · VISUAL OVERHAUL</h3>
        <p>Crime, Life, Empire, Living City, Living NPCs, Chronicle och Society & Power binds nu ihop av en tydligare, mörkare och mer premium spelupplevelse.</p>
        <div class="v7PillRow"><span class="v7Pill">CITY SCORE ${city}/100</span><span class="v7Pill">NPCs ${pop}</span><span class="v7Pill">SYNERGY ${synergy}%</span></div>
      </div>
      <div class="v7Section"><h4>KÄRNSYSTEM</h4><div class="v7Grid">
        <div class="v7Tile"><strong>🏛️</strong><b>Society & Power</b><span>Politik, budget, lagar, medier, rättssystem och maktkamp.</span><br><br><button class="btn" onclick="closeSheet();openSociety6()">ÖPPNA</button></div>
        <div class="v7Tile"><strong>🧠</strong><b>Living NPCs</b><span>Invånare med jobb, relationer, familjer, pengar och egna livsbanor.</span><br><br><button class="btn" onclick="closeSheet();openLivingNPCs()">ÖPPNA</button></div>
        <div class="v7Tile"><strong>📜</strong><b>Chronicle</b><span>Stadens historia, rekord, eror och legendariska ögonblick.</span><br><br><button class="btn" onclick="closeSheet();openChronicle5()">ÖPPNA</button></div>
      </div></div>
      <div class="v7Section"><h4>SNABBNAVIGERING</h4><div class="fullMenuGrid">
        <button onclick="closeSheet();openVisualHub7()"><strong>✨</strong>Visual Hub</button>
        <button onclick="closeSheet();openLivingCity()"><strong>🌆</strong>Living City</button>
        <button onclick="closeSheet();openThreeWorlds()"><strong>🔺</strong>Three Worlds</button>
        <button onclick="closeSheet();openLifeHub()"><strong>❤️</strong>Life</button>
        <button onclick="closeSheet();openEmpireHub()"><strong>👑</strong>Empire</button>
        <button onclick="closeSheet();openCrimeHub()"><strong>🕶️</strong>Crime</button>
        <button onclick="closeSheet();openNews()"><strong>📰</strong>News</button>
        <button onclick="closeSheet();openUniverseHub()"><strong>🌌</strong>Universe</button>
        <button onclick="closeSheet();openHousingBuilder()"><strong>🏠</strong>Bo & Bygg</button>
        <button onclick="closeSheet();openPhone()"><strong>📱</strong>Telefon</button>
        <button onclick="closeSheet();openJobs()"><strong>💼</strong>Jobb</button>
        <button onclick="closeSheet();openSocialHub()"><strong>🌐</strong>Online</button>
        <button onclick="closeSheet();openMarketplace()"><strong>🛒</strong>Marknad</button>
        <button onclick="closeSheet();openGarageV1000()"><strong>🚗</strong>Garage</button>
        <button onclick="closeSheet();openHomes()"><strong>🏡</strong>Bostäder</button>
        <button onclick="closeSheet();openCharacter()"><strong>👤</strong>Profil</button>
        <button onclick="closeSheet();openEndgame()"><strong>👑</strong>Endgame</button>
      </div>
      <div class="row"><button class="btn alt" onclick="simulateSociety6(30)">⏩ SIMULERA 30 SAMHÄLLSDAGAR</button><button class="btn blue" onclick="openVisualHub7('themes')">🎨 BYT TEMA</button></div>`);
  };
  initVisual7();
  applyVisualTheme7();
  buildVisualDock7();
  const oldSave7=window.save;
  if(typeof oldSave7==='function'){
    window.save=function(){applyVisualTheme7();buildVisualDock7();return oldSave7.apply(this,arguments)};
  }
  window.addEventListener('resize',buildVisualDock7);
})();



/* V8000000 — Map & Environment Overhaul */
(function(){
 const v8OldRoad=window.drawRoad||drawRoad;
 const v8OldBuilding=window.drawBuilding||drawBuilding;
 const v8OldMini=window.drawMini||drawMini;
 const v8OldLighting=window.drawLighting||drawLighting;
 const v8OldWorld=window.drawWorld||drawWorld;
 const districtV8={
  'Förorten':{tag:'Låg husprofil · lokalt liv',accent:'#75d8ff'},
  'Central District':{tag:'Handel · kontor · natttrafik',accent:'#82f2ff'},
  'Finansdistriktet':{tag:'Kapital · torn · privata vakter',accent:'#f3cf78'},
  'North Heights':{tag:'Lyx · utsikt · gated blocks',accent:'#d492ff'},
  'Industriområdet':{tag:'Verkstäder · lager · tung trafik',accent:'#f1a66a'},
  'Nattklubbsdistriktet':{tag:'Klubbar · neon · sena timmar',accent:'#e98cff'},
  'Hamnen':{tag:'Kajer · logistik · svart handel',accent:'#68dfff'},
  'Old Quarter':{tag:'Historik · gränder · hemligheter',accent:'#ff8b9b'}
 };
 function env8(){state.environment8=state.environment8||{detail:true,trafficGlow:true,districtFX:true,mapLabels:true};return state.environment8}
 function dist8(){return districts.find(d=>state.x>=d.x&&state.x<=d.x+d.w&&state.y>=d.y&&state.y<=d.y+d.h)||districts[0]}
 function drawRoadV8(r){
  v8OldRoad(r);
  if(!env8().detail)return;
  ctx.save();
  const horizontal=r.w>r.h;
  ctx.strokeStyle='rgba(140,190,225,.07)';ctx.lineWidth=1;
  if(horizontal){
   for(let x=r.x+16;x<r.x+r.w;x+=38){ctx.beginPath();ctx.moveTo(x,r.y+10);ctx.lineTo(x+14,r.y+10);ctx.stroke();ctx.beginPath();ctx.moveTo(x,r.y+r.h-10);ctx.lineTo(x+14,r.y+r.h-10);ctx.stroke()}
   for(let x=r.x+52;x<r.x+r.w;x+=210){ctx.fillStyle='rgba(255,255,255,.025)';ctx.fillRect(x,r.y+18,62,r.h-36)}
  }else{
   for(let y=r.y+16;y<r.y+r.h;y+=38){ctx.beginPath();ctx.moveTo(r.x+10,y);ctx.lineTo(r.x+10,y+14);ctx.stroke();ctx.beginPath();ctx.moveTo(r.x+r.w-10,y);ctx.lineTo(r.x+r.w-10,y+14);ctx.stroke()}
   for(let y=r.y+52;y<r.y+r.h;y+=210){ctx.fillStyle='rgba(255,255,255,.025)';ctx.fillRect(r.x+18,y,r.w-36,62)}
  }
  ctx.restore();
 }
 function drawBuildingV8(p){
  v8OldBuilding(p);
  if(!env8().detail)return;
  ctx.save();
  const accent=({'club':'#e98cff','casino':'#f3cf78','blackmarket':'#ff738a','bank':'#79bfff','finance':'#9ea8ff','garage':'#f1a66a','shop':'#82f2ff'}[p.id]||'#8fb5d8');
  // rooftop edge and antennas
  ctx.strokeStyle='rgba(210,230,248,.10)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x+10,p.y-13);ctx.lineTo(p.x+p.w-10,p.y-13);ctx.stroke();
  const seed=(p.x+p.y)%5;
  for(let i=0;i<1+(seed%3);i++){
   const ax=p.x+24+i*34, ay=p.y-12;
   ctx.strokeStyle='rgba(180,210,235,.30)';ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax,ay-18-(i*4));ctx.stroke();
   ctx.fillStyle=accent;ctx.shadowColor=accent;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(ax,ay-19-(i*4),1.7,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  }
  // entrance pool light
  const gx=p.x+p.w-34,gy=p.y+p.h-10;
  let g=ctx.createRadialGradient(gx,gy,0,gx,gy,42);g.addColorStop(0,accent+'28');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(gx,gy,42,0,Math.PI*2);ctx.fill();
  // facade vertical trims
  ctx.strokeStyle=accent+'22';
  for(let x=p.x+12;x<p.x+p.w;x+=52){ctx.beginPath();ctx.moveTo(x,p.y+8);ctx.lineTo(x,p.y+p.h-55);ctx.stroke()}
  ctx.restore();
 }
 function drawStreetTrees8(){
  if(!env8().detail)return;
  const pts=[[1040,820],[1160,820],[1570,820],[1690,820],[1985,1470],[2320,1470],[2900,2110],[3140,2110],[780,1460],[680,2110]];
  pts.forEach(([x,y],i)=>{
   ctx.save();ctx.fillStyle='rgba(8,10,12,.45)';ctx.beginPath();ctx.ellipse(x,y+12,14,5,0,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#283326';ctx.fillRect(x-2,y-7,4,21);
   const gr=ctx.createRadialGradient(x,y-15,2,x,y-15,17);gr.addColorStop(0,i%3===0?'#426249':'#364f3c');gr.addColorStop(1,'#17221a');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y-15,17,0,Math.PI*2);ctx.fill();ctx.restore();
  });
 }
 function drawDistrictAmbient8(){
  if(!env8().districtFX)return;
  const d=dist8(), meta=districtV8[d.name]||{accent:'#82f2ff'};
  ctx.save();
  // screen-space district color wash
  let g=ctx.createRadialGradient(innerWidth*.5,innerHeight*.45,20,innerWidth*.5,innerHeight*.45,Math.max(innerWidth,innerHeight)*.72);
  const c=meta.accent;
  const hex=c.replace('#','');const r=parseInt(hex.slice(0,2),16),gg=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);
  g.addColorStop(0,`rgba(${r},${gg},${b},.025)`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,innerWidth,innerHeight);
  // horizon light streaks
  ctx.globalCompositeOperation='screen';
  for(let i=0;i<5;i++){
   const y=innerHeight*.18+i*13;const alpha=.018+i*.004;ctx.strokeStyle=`rgba(${r},${gg},${b},${alpha})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(innerWidth,y);ctx.stroke();
  }
  ctx.restore();
 }
 function drawTrafficBloom8(){
  if(!env8().trafficGlow||state.interior)return;
  ctx.save();ctx.globalCompositeOperation='screen';
  [...cars,...police].forEach((car,i)=>{const sx=car.x-cam.x,sy=car.y-cam.y;if(sx<-80||sy<-80||sx>innerWidth+80||sy>innerHeight+80)return;const col=i>=cars.length?'rgba(100,170,255,.11)':'rgba(255,210,120,.055)';const g=ctx.createRadialGradient(sx,sy,0,sx,sy,36);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy,36,0,Math.PI*2);ctx.fill()});
  ctx.restore();
 }
 function updateBanner8(){
  const d=dist8(),meta=districtV8[d.name]||{tag:'Black Haven',accent:'#82f2ff'};let el=document.getElementById('v8DistrictBanner');if(!el)return;el.innerHTML=`<b>${d.name.toUpperCase()}</b><span>${meta.tag}</span>`;el.style.borderColor=meta.accent+'44';el.style.boxShadow=`0 16px 36px rgba(0,0,0,.32),0 0 24px ${meta.accent}14`;
 }
 function drawMiniV8(){
  const w=mc.width=150,h=mc.height=118;mctx.clearRect(0,0,w,h);
  let bg=mctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0b1a2b');bg.addColorStop(1,'#040a12');mctx.fillStyle=bg;mctx.fillRect(0,0,w,h);
  if(state.interior){mctx.fillStyle='#162b43';mctx.fillRect(34,24,82,70);mctx.fillStyle='#82f2ff';mctx.beginPath();mctx.arc(75,59,4,0,Math.PI*2);mctx.fill();return}
  const sx=w/W,sy=h/H;
  districts.forEach((d,i)=>{mctx.fillStyle=['#17304a','#1b3551','#292f43','#302d45','#252b31','#3a2544','#14364b','#332635'][i%8];mctx.fillRect(d.x*sx,d.y*sy,d.w*sx,d.h*sy);mctx.strokeStyle='rgba(255,255,255,.07)';mctx.strokeRect(d.x*sx,d.y*sy,d.w*sx,d.h*sy)});
  mctx.fillStyle='rgba(215,226,236,.13)';roads.forEach(r=>mctx.fillRect(r.x*sx,r.y*sy,Math.max(1,r.w*sx),Math.max(1,r.h*sy)));
  mctx.fillStyle='#f3cf78';places.forEach(p=>{mctx.beginPath();mctx.arc((p.x+p.w/2)*sx,(p.y+p.h/2)*sy,1.7,0,Math.PI*2);mctx.fill()});
  mctx.fillStyle='#82f2ff';eventSpots.filter(e=>e.active).forEach(e=>{mctx.beginPath();mctx.arc(e.x*sx,e.y*sy,2.3,0,Math.PI*2);mctx.fill()});
  mctx.strokeStyle='rgba(130,242,255,.18)';mctx.lineWidth=1;mctx.strokeRect((cam.x)*sx,(cam.y)*sy,innerWidth*sx,innerHeight*sy);
  mctx.shadowColor='#82f2ff';mctx.shadowBlur=9;mctx.fillStyle='#82f2ff';mctx.beginPath();mctx.arc(state.x*sx,state.y*sy,3.5,0,Math.PI*2);mctx.fill();mctx.shadowBlur=0;
  if(env8().mapLabels){mctx.font='700 5px system-ui';mctx.fillStyle='rgba(235,246,255,.62)';districts.forEach(d=>mctx.fillText(d.name.slice(0,10).toUpperCase(),d.x*sx+3,d.y*sy+8))}
 }
 window.drawRoad=drawRoad=drawRoadV8;
 window.drawBuilding=drawBuilding=drawBuildingV8;
 window.drawMini=drawMini=drawMiniV8;
 window.drawLighting=drawLighting=function(){v8OldLighting();drawDistrictAmbient8();drawTrafficBloom8();updateBanner8()};
 window.drawWorld=drawWorld=function(){
  // draw via original world function, with v8 road/building overrides active
  v8OldWorld();
 };
 function buildEnvUi8(){
  const wrap=document.getElementById('wrap');if(!wrap)return;
  let b=document.getElementById('v8DistrictBanner');if(!b){b=document.createElement('div');b.id='v8DistrictBanner';wrap.appendChild(b)}
  let d=document.getElementById('v8EnvDock');if(!d){d=document.createElement('div');d.id='v8EnvDock';d.innerHTML='<button onclick="openEnvironment8()">🗺️<span>MAP</span></button><button onclick="openEnvironment8(\'settings\')">🌃<span>ENV</span></button>';wrap.appendChild(d)}
  updateBanner8();
 }
 window.toggleEnv8=function(k){const s=env8();s[k]=!s[k];save();openEnvironment8('settings')}
 window.openEnvironment8=function(tab='overview'){
  const s=env8(),d=dist8(),meta=districtV8[d.name]||{};
  const tabs=`<div class="browserTabs"><button class="btn ${tab==='overview'?'':'alt'}" onclick="openEnvironment8('overview')">ÖVERSIKT</button><button class="btn ${tab==='settings'?'':'alt'}" onclick="openEnvironment8('settings')">MILJÖ</button><button class="btn ${tab==='districts'?'':'alt'}" onclick="openEnvironment8('districts')">DISTRIKT</button></div>`;
  let html='';
  if(tab==='overview')html=`<div class="v8Hero"><h3>Map & Environment Overhaul</h3><p>Stadens canvas har fått mer djup med fasaddetaljer, takantenner, gatustruktur, träd, ljusbloom, distriktsatmosfär och en tydligare minimap.</p><div class="v8Legend"><span>📍 ${d.name}</span><span>🌃 ${meta.tag||'Black Haven'}</span><span>🗺️ 8 distrikt</span></div></div><div class="v8Grid"><div class="v8Card"><h4>🏙️ Stadsmiljö</h4><p>Byggnader har mer fasaddetalj och ljus; vägar har mer struktur och stadsrummet känns mindre platt.</p></div><div class="v8Card"><h4>🚦 Trafikljus</h4><p>Fordon får mjuk bloom och kvällsmiljön får mer liv utan att ändra gameplay.</p></div><div class="v8Card"><h4>🧭 Ny minimap</h4><p>Distrikt, vägar, platser, events, kameraområde och spelare visas tydligare.</p></div></div>`;
  else if(tab==='settings')html=`<div class="v8Hero"><h3>Miljöinställningar</h3><p>Stäng av eller aktivera detaljer om du vill prioritera prestanda på mobil.</p></div><div class="v8Toggle"><span>Extra stadsdetaljer</span><button class="btn ${s.detail?'':'alt'}" onclick="toggleEnv8('detail')">${s.detail?'PÅ':'AV'}</button></div><div class="v8Toggle"><span>Trafik-bloom</span><button class="btn ${s.trafficGlow?'':'alt'}" onclick="toggleEnv8('trafficGlow')">${s.trafficGlow?'PÅ':'AV'}</button></div><div class="v8Toggle"><span>Distriktsatmosfär</span><button class="btn ${s.districtFX?'':'alt'}" onclick="toggleEnv8('districtFX')">${s.districtFX?'PÅ':'AV'}</button></div><div class="v8Toggle"><span>Distriktsnamn på minimap</span><button class="btn ${s.mapLabels?'':'alt'}" onclick="toggleEnv8('mapLabels')">${s.mapLabels?'PÅ':'AV'}</button></div>`;
  else html=`<div class="v8Hero"><h3>Black Havens distrikt</h3><p>Varje område har nu en tydligare visuell identitet som kan byggas ut ännu mer i kommande versioner.</p></div><div class="v8Grid">${districts.map(x=>`<div class="v8Card"><h4>${x.name}</h4><p>${(districtV8[x.name]||{}).tag||'Eget område i Black Haven.'}</p></div>`).join('')}</div>`;
  openSheet('Map & Environment','Visual Overhaul går nu vidare från gränssnittet till själva spelvärlden.','','V8000000',tabs+html);
 };
 // inject trees into original world by wrapping player home draw path via extra render hook
 const prevDrawPlayerHomes8=window.drawPlayerHomes||drawPlayerHomes;
 window.drawPlayerHomes=drawPlayerHomes=function(){prevDrawPlayerHomes8();drawStreetTrees8()};
 const prevMain8=window.openMainMenu;
 window.openMainMenu=function(){
  if(typeof openSheet!=='function')return prevMain8&&prevMain8();
  const lc=state.livingCity||{},city=Math.round(lc.cityScore||0),synergy=state.threeWorlds?.synergy||0;
  openSheet('Black Haven Hub','V8000000 förbättrar nu både gränssnittet och själva staden.','','V8000000',`<div class="v8Hero"><h3>BLACK HAVEN · MAP & ENVIRONMENT</h3><p>Staden har fått ett nytt visuellt lager: tydligare distrikt, bättre minimap, mer detaljerade byggnader, levande trafikljus och en mer atmosfärisk nattmiljö.</p><div class="v8Legend"><span>CITY SCORE ${city}/100</span><span>SYNERGY ${synergy}%</span><span>8 DISTRIKT</span></div></div><div class="v8Grid"><div class="v8Card"><h4>🗺️ Map & Environment</h4><p>Miljöinställningar, distrikt och kartförbättringar.</p><br><button class="btn" onclick="closeSheet();openEnvironment8()">ÖPPNA</button></div><div class="v8Card"><h4>✨ Visual Hub</h4><p>Teman, layout och gränssnittsinställningar.</p><br><button class="btn" onclick="closeSheet();openVisualHub7()">ÖPPNA</button></div><div class="v8Card"><h4>🏛️ Society & Power</h4><p>Politik, ekonomi, lagar och stadens maktsystem.</p><br><button class="btn" onclick="closeSheet();openSociety6()">ÖPPNA</button></div></div><div class="v7Section"><h4>ALLA SYSTEM</h4><div class="fullMenuGrid"><button onclick="closeSheet();openLivingCity()"><strong>🌆</strong>Living City</button><button onclick="closeSheet();openLivingNPCs()"><strong>🧠</strong>Living NPCs</button><button onclick="closeSheet();openChronicle5()"><strong>📜</strong>Chronicle</button><button onclick="closeSheet();openThreeWorlds()"><strong>🔺</strong>Three Worlds</button><button onclick="closeSheet();openLifeHub()"><strong>❤️</strong>Life</button><button onclick="closeSheet();openEmpireHub()"><strong>👑</strong>Empire</button><button onclick="closeSheet();openCrimeHub()"><strong>🕶️</strong>Crime</button><button onclick="closeSheet();openUniverseHub()"><strong>🌌</strong>Universe</button><button onclick="closeSheet();openHousingBuilder()"><strong>🏠</strong>Bo & Bygg</button><button onclick="closeSheet();openPhone()"><strong>📱</strong>Telefon</button><button onclick="closeSheet();openMarketplace()"><strong>🛒</strong>Marknad</button><button onclick="closeSheet();openCharacter()"><strong>👤</strong>Profil</button></div></div>`);
 };
 env8();buildEnvUi8();updateBanner8();
 const chip=document.getElementById('versionChip');if(chip)chip.textContent='V8000000 · MAP & ENVIRONMENT';
 const ls=document.querySelector('.logo small');if(ls)ls.textContent='ONLINE · V8000000';
 document.title='Black Haven Online V8000000 — Map & Environment';
})();




/* V9000000 — Publication Ready */
(function(){
  function initPublication9(){
    state.publication9=state.publication9||{release:'1.0',launched:false,lastBackup:null,firstLaunchSeen:false};
    return state.publication9;
  }
  function money9(n){try{return typeof money==='function'?money(n):Math.round(n).toLocaleString('sv-SE')+' kr'}catch(e){return Math.round(n).toLocaleString('sv-SE')+' kr'}}
  function makeRibbon9(){
    const wrap=document.getElementById('wrap'); if(!wrap) return;
    let r=document.getElementById('pubRibbon');
    if(!r){ r=document.createElement('div'); r.id='pubRibbon'; wrap.appendChild(r); }
    r.innerHTML='PUBLICERING <b>READY</b> · V9000000';
  }
  function showStartScreen9(force=false){
    const s=initPublication9();
    const root=document.getElementById('pubStartOverlay');
    if(!root) return;
    if(force || !s.firstLaunchSeen) root.classList.add('show');
  }
  function hideStartScreen9(markSeen=true){
    const s=initPublication9();
    const root=document.getElementById('pubStartOverlay');
    if(root) root.classList.remove('show');
    if(markSeen){ s.firstLaunchSeen=true; s.launched=true; save(); }
  }
  function buildStartScreen9(){
    let root=document.getElementById('pubStartOverlay');
    if(root) return root;
    root=document.createElement('div');
    root.id='pubStartOverlay';
    root.innerHTML=`<div class="pubStartCard"><div class="pubStartHeader"><div><span class="pubKicker">BLACK HAVEN · RELEASE</span><div class="pubTitle">Publication Ready</div><div class="pubLead">Nu är Black Haven inte bara större — det är också mer presentabelt. Den här versionen finjusterar layouten, lägger till onboarding, guide, backup/import och en mer färdig launch-känsla för att spelet ska vara lättare att visa upp och dela.</div><div class="pubStatRow"><span class="pubStat">Crime · Life · Empire</span><span class="pubStat">Living City</span><span class="pubStat">Living NPCs</span><span class="pubStat">Chronicle</span><span class="pubStat">Society & Power</span></div></div><div class="pubStat">RELEASE 1.0</div></div><div class="pubGrid"><div class="pubPanel"><h4>✨ Finjusterad layout</h4><p>Bättre sheet-beteende, tydligare knappar, bättre scrollbars, fokusmarkeringar och mer konsekvent panelstruktur.</p></div><div class="pubPanel"><h4>📘 Guide & onboarding</h4><p>En tydligare introduktion gör att nya spelare fattar vad Black Haven handlar om snabbare.</p></div><div class="pubPanel"><h4>💾 Publiceringsverktyg</h4><p>Export, import och säkrare reset gör spelet lättare att testa, dela och fortsätta utveckla.</p></div></div><div class="pubActionRow"><button class="btn" onclick="startGame9()">▶ STARTA BLACK HAVEN</button><button class="btn alt" onclick="hideStartScreen9(false);openGuide9()">📘 HUR MAN SPELAR</button><button class="btn alt" onclick="hideStartScreen9(false);openReleaseHub9()">🚀 RELEASE NOTES</button></div><div class="pubFine">Tips: öppna huvudmenyn för Visual Hub, Society & Power, Living City och övriga system när du väl är inne i världen.</div></div>`;
    document.body.appendChild(root);
    return root;
  }
  window.startGame9=function(){hideStartScreen9(true)};
  window.hideStartScreen9=hideStartScreen9;
  function exportSavePayload9(){
    return JSON.stringify({version:'V9000000',exportedAt:new Date().toISOString(),state},null,2);
  }
  window.exportSave9=function(){
    const s=initPublication9();
    const blob=new Blob([exportSavePayload9()],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='black_haven_save_v9000000.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1200);
    s.lastBackup=Date.now(); save();
    toastMsg('Save exporterat.');
  };
  window.copySave9=function(){
    const data=exportSavePayload9();
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(data).then(()=>toastMsg('Save kopierat.'),()=>toastMsg('Kunde inte kopiera.'))}
    else toastMsg('Clipboard stöds inte här.');
  };
  window.openImportSave9=function(){
    openSheet('Backup & Import','Exportera eller importera en sparfil så att Black Haven blir lättare att testa och dela.','','V9000000',`<div class="pubNotice">Export skapar en JSON-kopia av din aktuella speldata. Import ersätter nuvarande lokala sparfil med det du klistrar in nedan.</div><div class="row"><button class="btn" onclick="exportSave9()">EXPORTERA SAVE</button><button class="btn alt" onclick="copySave9()">KOPIERA SAVE</button></div><div class="sectionTitle">Importera save</div><textarea id="pubImportArea" class="pubTextarea" placeholder="Klistra in exporterat JSON-innehåll här..."></textarea><div class="row"><button class="btn green" onclick="applyImportSave9()">IMPORTERA</button><button class="btn red" onclick="resetGame9()">NOLLSTÄLL SAVE</button></div>`);
  };
  window.applyImportSave9=function(){
    const el=document.getElementById('pubImportArea'); if(!el) return;
    try{
      const parsed=JSON.parse(el.value.trim());
      const nextState=parsed&&parsed.state?parsed.state:parsed;
      if(!nextState||typeof nextState!=='object') throw new Error('Ogiltig data');
      localStorage.setItem('bh-v2010000',JSON.stringify(nextState));
      toastMsg('Save importerad. Laddar om...');
      setTimeout(()=>location.reload(),400);
    }catch(err){ toastMsg('Importen misslyckades. Kontrollera JSON.'); }
  };
  window.resetGame9=function(){
    if(!confirm('Vill du verkligen nollställa din sparfil? Detta kan inte ångras.')) return;
    ['bh-v1000','bh-v1500','bh-v2000','bh-v2010000'].forEach(k=>localStorage.removeItem(k));
    location.reload();
  };
  window.openGuide9=function(tab='intro'){
    const tabs=`<div class="browserTabs"><button class="btn ${tab==='intro'?'':'alt'}" onclick="openGuide9('intro')">INTRO</button><button class="btn ${tab==='systems'?'':'alt'}" onclick="openGuide9('systems')">SYSTEM</button><button class="btn ${tab==='goals'?'':'alt'}" onclick="openGuide9('goals')">MÅL</button><button class="btn ${tab==='tips'?'':'alt'}" onclick="openGuide9('tips')">TIPS</button></div>`;
    let html='';
    if(tab==='intro') html=`<div class="v7Hero"><h3>Vad går Black Haven ut på?</h3><p>Black Haven är en levande stads- och maktsimulering där du bygger ett liv genom Crime, Life och Empire. Du kan bli kriminell maktspelare, laglig affärsprofil, social figur eller något mitt emellan — och dina val påverkar hela staden.</p></div><div class="pubSheetGrid"><div class="pubMiniCard"><h4>Spela fritt</h4><p>Rör dig i staden, gör uppdrag, möt NPC:er och öppna menyerna för att hitta system att utveckla.</p></div><div class="pubMiniCard"><h4>Bygg din identitet</h4><p>Din karaktär formas av rykte, värderingar, relationer, företag och vilka världar du satsar på.</p></div></div>`;
    else if(tab==='systems') html=`<div class="pubSheetGrid"><div class="pubMiniCard"><h4>Crime</h4><p>Gatan, territorier, crew, heat och risk.</p></div><div class="pubMiniCard"><h4>Life</h4><p>Behov, återhämtning, relationer, bostad och vardagsliv.</p></div><div class="pubMiniCard"><h4>Empire</h4><p>Företag, tillgångar, prestige, investeringar och långsiktig makt.</p></div><div class="pubMiniCard"><h4>Living City</h4><p>Distrikt, stadsvärden och en värld som reagerar på vad som händer.</p></div><div class="pubMiniCard"><h4>Living NPCs</h4><p>Invånare får jobb, pengar, relationer, familjer och egna livsbanor.</p></div><div class="pubMiniCard"><h4>Society & Power</h4><p>Politik, ekonomi, lagar, rättssystem, media och större samhällskrafter.</p></div></div>`;
    else if(tab==='goals') html=`<div class="pubNotice">Det finns inget enda rätt sätt att vinna. Du kan jaga olika mål beroende på spelstil:</div><ul class="pubList"><li>Bygg hög Three Worlds-synergy genom att balansera Crime, Life och Empire.</li><li>Skapa företag, äg bostäder och öka din nettoförmögenhet.</li><li>Bygg relationer och bli en central figur i stadens sociala väv.</li><li>Påverka stadens historia genom Chronicle och Society & Power.</li><li>Skapa din egen roll: entreprenör, fixer, lokal legend eller stor maktspelare.</li></ul>`;
    else html=`<ul class="pubList"><li>Öppna <b>Visual Hub</b> om du vill ändra tema och layout.</li><li>Öppna <b>Map & Environment</b> om du vill justera miljödetaljer och minimap.</li><li>Testa <b>Simulera 30 samhällsdagar</b> för att snabbt se staden utvecklas.</li><li>Gör backup via <b>Backup & Import</b> innan större testomgångar.</li><li>Använd huvudmenyn som nav — där finns alla större system samlade.</li></ul>`;
    openSheet('Guide','En snabb introduktion som gör spelet lättare att förstå för nya spelare.','','V9000000',tabs+html);
  };
  window.openReleaseHub9=function(tab='notes'){
    const s=initPublication9();
    const tabs=`<div class="browserTabs"><button class="btn ${tab==='notes'?'':'alt'}" onclick="openReleaseHub9('notes')">RELEASE</button><button class="btn ${tab==='publish'?'':'alt'}" onclick="openReleaseHub9('publish')">PUBLICERING</button><button class="btn ${tab==='credits'?'':'alt'}" onclick="openReleaseHub9('credits')">CREDITS</button></div>`;
    let html='';
    if(tab==='notes') html=`<div class="v7Hero"><h3>Release ${s.release}</h3><p>Black Haven V9000000 finjusterar layouten och gör projektet mer redo att visas upp.</p></div><ul class="pubList"><li>Förbättrad läsbarhet, sheet-scroll och fokusmarkeringar.</li><li>Startskärm med tydligare första intryck.</li><li>Guide, release notes och backup/import i själva spelet.</li><li>Säkrare reset av lokal speldata.</li><li>Mer sammanhållen huvudmeny för att navigera alla större system.</li></ul>`;
    else if(tab==='publish') html=`<div class="pubSheetGrid"><div class="pubMiniCard"><h4>Publiceringsstatus</h4><p>Projektet känns nu mer färdigt visuellt och funktionellt, särskilt för testning och demonstration.</p></div><div class="pubMiniCard"><h4>Backup senast</h4><p>${s.lastBackup?new Date(s.lastBackup).toLocaleString('sv-SE'):'Ingen backup registrerad ännu.'}</p></div></div><div class="row"><button class="btn" onclick="exportSave9()">EXPORTERA SAVE</button><button class="btn alt" onclick="openImportSave9()">ÖPPNA BACKUP & IMPORT</button></div><div class="pubNotice">För riktig extern publicering rekommenderas nästa steg också: komprimera filen, lägga in riktiga ikoner/ljudresurser och eventuellt bryta ut CSS/JS till separata filer.</div>`;
    else html=`<div class="pubNotice">Black Haven Online är ett kreativt spelprojekt byggt stegvis från Three Worlds till Living City, Living NPCs, Chronicle, Society & Power, Visual Overhaul och Map & Environment.</div><ul class="pubList"><li>Spelvision: en levande stadsvärld där Crime, Life och Empire hänger ihop.</li><li>Fokus i den här versionen: layoutfinjustering, onboarding och publiceringsverktyg.</li><li>Releaseetikett: Publication Ready.</li></ul>`;
    openSheet('Release Hub','Samlad information för launch-känsla, backup och dokumentation i spelet.','','V9000000',tabs+html);
  };
  const prevMain9=window.openMainMenu;
  window.openMainMenu=function(){
    if(typeof openSheet!=='function') return prevMain9&&prevMain9();
    const lc=state.livingCity||{};
    const city=Math.round(lc.cityScore||0);
    const synergy=state.threeWorlds?.synergy||0;
    const worth=(typeof networth==='function'?networth():(state.cash||0)+(state.bank||0));
    openSheet('Black Haven Hub','V9000000 finjusterar layouten och gör Black Haven mer redo att spelas, testas och visas upp.','','V9000000',`<div class="v7Hero"><h3>BLACK HAVEN · PUBLICATION READY</h3><p>En mer publiceringsklar version med tydligare navigation, guide, startskärm och backup/import — ovanpå alla stora system som redan finns i världen.</p><div class="v7PillRow"><span class="v7Pill">CITY SCORE ${city}/100</span><span class="v7Pill">SYNERGY ${synergy}%</span><span class="v7Pill">NETTO ${money9(worth)}</span></div></div><div class="v7Grid"><div class="v7Tile"><strong>🚀</strong><b>Release Hub</b><span>Release notes, publiceringsinfo och credits.</span><br><br><button class="btn" onclick="closeSheet();openReleaseHub9()">ÖPPNA</button></div><div class="v7Tile"><strong>📘</strong><b>Guide</b><span>Snabb förklaring av vad spelet går ut på och hur systemen hänger ihop.</span><br><br><button class="btn" onclick="closeSheet();openGuide9()">ÖPPNA</button></div><div class="v7Tile"><strong>💾</strong><b>Backup & Import</b><span>Exportera eller återställ sparfiler för testning och fortsatt utveckling.</span><br><br><button class="btn" onclick="closeSheet();openImportSave9()">ÖPPNA</button></div></div><div class="v7Section"><h4>HUVUDSYSTEM</h4><div class="fullMenuGrid"><button onclick="closeSheet();openEnvironment8()"><strong>🗺️</strong>Map & Environment</button><button onclick="closeSheet();openVisualHub7()"><strong>✨</strong>Visual Hub</button><button onclick="closeSheet();openSociety6()"><strong>🏛️</strong>Society & Power</button><button onclick="closeSheet();openLivingCity()"><strong>🌆</strong>Living City</button><button onclick="closeSheet();openLivingNPCs()"><strong>🧠</strong>Living NPCs</button><button onclick="closeSheet();openChronicle5()"><strong>📜</strong>Chronicle</button><button onclick="closeSheet();openThreeWorlds()"><strong>🔺</strong>Three Worlds</button><button onclick="closeSheet();openLifeHub()"><strong>❤️</strong>Life</button><button onclick="closeSheet();openEmpireHub()"><strong>👑</strong>Empire</button><button onclick="closeSheet();openCrimeHub()"><strong>🕶️</strong>Crime</button><button onclick="closeSheet();openUniverseHub()"><strong>🌌</strong>Universe</button><button onclick="closeSheet();openHousingBuilder()"><strong>🏠</strong>Bo & Bygg</button><button onclick="closeSheet();openPhone()"><strong>📱</strong>Telefon</button><button onclick="closeSheet();openMarketplace()"><strong>🛒</strong>Marknad</button><button onclick="closeSheet();openCharacter()"><strong>👤</strong>Profil</button><button onclick="closeSheet();openEndgame()"><strong>👑</strong>Endgame</button></div></div><div class="row"><button class="btn alt" onclick="showStartScreen9(true)">VISA STARTSKÄRM</button><button class="btn blue" onclick="exportSave9()">EXPORTERA SAVE</button></div>`);
  };
  const prevReset=window.resetGame;
  window.resetGame=function(){ return window.resetGame9(); };
  initPublication9();
  makeRibbon9();
  buildStartScreen9();
  const chip=document.getElementById('versionChip'); if(chip) chip.textContent='V9000000 · PUBLICATION READY';
  const ls=document.querySelector('.logo small'); if(ls) ls.textContent='ONLINE · V9000000';
  document.title='Black Haven Online V9000000 — Publication Ready';
  window.showStartScreen9=showStartScreen9;
  showStartScreen9(false);
})();


/* V10000000 — Web Release bootstrap */
(function(){
  const chip=document.getElementById('versionChip');if(chip)chip.textContent='V10000000 · WEB RELEASE';
  const ls=document.querySelector('.logo small');if(ls)ls.textContent='ONLINE · V10000000';
  document.title='Black Haven Online V10000000 — Web Release';
  window.addEventListener('load',()=>{
    const loader=document.getElementById('releaseLoader');
    setTimeout(()=>loader&&loader.classList.add('hide'),450);
  });
  window.addEventListener('error',e=>{try{console.error('Black Haven runtime error:',e.error||e.message)}catch(_){}});
})();

/* =========================================================
   V11000000 — THREE WORLDS NAVIGATION
   ========================================================= */
(function(){
  const worlds={
    crime:{title:'CRIME',sub:'Gatan, riskerna och makten.',hero:'Bygg ditt rykte i Black Havens undre värld. Brott ger snabbare pengar och respekt, men höjer heat och risk.',cls:'crime',actions:[['🕶️','Crime Hub','Brott, street cred och säsongsprogression','openCrimeHub'],['💥','Gör ett brott','Ta en direkt risk för pengar och respekt','runCrime'],['🌙','Nattliv','Besök klubbscenen och stadens kontakter','visitCrimeClub'],['👥','Gang','Bygg eller utveckla ditt kriminella nätverk','openGangV200'],['🛒','Svarta marknaden','Köp och sälj via marknaden','openMarketplace'],['🗺️','Tillbaka till staden','Återvänd till Black Haven','__close']]},
    life:{title:'LIFE',sub:'Relationer, vardag och vem du blir.',hero:'Livet utanför gatan spelar roll. Energi, hälsa, socialt liv, boende och relationer påverkar vilka vägar som öppnas.',cls:'life',actions:[['❤️','Life Hub','Överblick över behov, humör och liv','openLifeHub'],['🏠','Bo & bygg','Utveckla ditt hem och din komfort','openHousingBuilder'],['💬','Socialt','Kontakter, meddelanden och relationer','openSocialHub'],['💼','Jobb','Arbeta lagligt och bygg en stabil vardag','openJobs'],['🧍','Karaktär','Se profil, utveckling och identitet','openCharacter'],['🗺️','Tillbaka till staden','Återvänd till Black Haven','__close']]},
    empire:{title:'EMPIRE',sub:'Företag, fastigheter och långsiktig makt.',hero:'Förvandla pengar och inflytande till ett imperium. Företag, investeringar, personal och tillgångar bygger din långsiktiga makt.',cls:'empire',actions:[['🏢','Empire Hub','Överblick över ditt ekonomiska imperium','openEmpireHub'],['💼','Företag','Köp och utveckla verksamheter','openEmpire'],['🏠','Fastigheter','Bygg värde genom boende och egendom','openHousingBuilder'],['📈','Marknad','Handla och hitta nya möjligheter','openMarketplace'],['🎓','Karriär','Välj väg och bygg professionell status','selectCareer'],['🗺️','Tillbaka till staden','Återvänd till Black Haven','__close']]}
  };
  function safeCall(name){closeWorld();const fn=window[name];if(typeof fn==='function'){setTimeout(()=>{try{fn()}catch(e){console.warn('V11 action',name,e)}},40)}}
  function closeWorld(){const el=document.getElementById('v11WorldOverlay');if(el)el.classList.remove('open')}
  function openWorld(key){const w=worlds[key];if(!w)return;const el=document.getElementById('v11WorldOverlay');el.innerHTML=`<div class="v11WorldShell"><div class="v11WorldHead"><button class="btn alt v11Back" data-v11-close>← STADEN</button><div class="v11WorldTitle"><h1>${w.title}</h1><p>${w.sub}</p></div><div class="v11WorldStats"><span class="v11Pill">Dag <b>${document.getElementById('megaDay')?.textContent||'—'}</b></span><span class="v11Pill">Cash <b>${document.getElementById('megaCash')?.textContent||document.getElementById('cash')?.textContent||'—'}</b></span></div></div><section class="v11WorldHero ${w.cls}"><div><h2>${w.title}</h2><p>${w.hero}</p></div></section><div class="v11ActionGrid">${w.actions.map((a,i)=>`<button class="v11ActionCard" data-v11-action="${a[3]}"><span class="v11ActionIcon">${a[0]}</span><b>${a[1]}</b><small>${a[2]}</small></button>`).join('')}</div></div>`;el.classList.add('open');el.scrollTop=0}
  function init(){
    if(document.getElementById('v11WorldOverlay'))return;
    const overlay=document.createElement('div');overlay.id='v11WorldOverlay';overlay.setAttribute('aria-modal','true');document.body.appendChild(overlay);
    const sw=document.createElement('nav');sw.id='v11WorldSwitcher';sw.setAttribute('aria-label','Tre världar');sw.innerHTML='<button data-world="crime">🕶️ CRIME</button><button data-world="life">❤️ LIFE</button><button data-world="empire">🏢 EMPIRE</button>';document.body.appendChild(sw);
    sw.addEventListener('click',e=>{const b=e.target.closest('[data-world]');if(b)openWorld(b.dataset.world)});
    overlay.addEventListener('click',e=>{if(e.target.closest('[data-v11-close]'))return closeWorld();const b=e.target.closest('[data-v11-action]');if(!b)return;b.dataset.v11Action==='__close'?closeWorld():safeCall(b.dataset.v11Action)});
    document.querySelectorAll('.twCard').forEach((card,i)=>{card.tabIndex=0;card.setAttribute('role','button');card.addEventListener('click',()=>openWorld(['crime','life','empire'][i]));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openWorld(['crime','life','empire'][i])}})});
    window.openV11World=openWorld;window.closeV11World=closeWorld;
    const chip=document.getElementById('versionChip');if(chip)chip.textContent='V11000000';document.title='Black Haven Online V11000000';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
