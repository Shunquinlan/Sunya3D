import * as THREE from './assets/three.module.js';
import { RoomEnvironment } from './assets/RoomEnvironment.js';
import { RoundedBoxGeometry } from './assets/RoundedBoxGeometry.js';
const canvas=document.querySelector('#design-canvas'),holder=document.querySelector('#scene');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
renderer.setClearColor(0xe9e8e3,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();
const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();
scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
const camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(5.5,4.5,6.5);camera.lookAt(0,.25,0);
scene.add(new THREE.HemisphereLight(0xffffff,0xb4a797,1.5));
const light=new THREE.DirectionalLight(0xfff5e8,3);light.position.set(-3,7,4);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-5;light.shadow.camera.right=5;light.shadow.camera.top=5;light.shadow.camera.bottom=-5;light.shadow.normalBias=.025;light.shadow.radius=4;scene.add(light);
const fill=new THREE.DirectionalLight(0xe7efff,1.4);fill.position.set(5,3,-3);scene.add(fill);
const assembly=new THREE.Group();assembly.rotation.y=-.35;scene.add(assembly);
const polymer=new THREE.MeshStandardMaterial({color:0xda5a27,roughness:.62,metalness:0});
const lidMat=new THREE.MeshStandardMaterial({color:0xe8e8df,roughness:.55,metalness:0});
const black=new THREE.MeshStandardMaterial({color:0x252828,roughness:.5});
const pcbMat=new THREE.MeshStandardMaterial({color:0x225349,roughness:.66});
const steel=new THREE.MeshStandardMaterial({color:0xbbc0c1,roughness:.25,metalness:.9});
const gold=new THREE.MeshStandardMaterial({color:0xcaa753,roughness:.35,metalness:.7});
function box(w,h,d,mat,x=0,y=0,z=0,r=.06){const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,r),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;}
function circle(w,d,r,Type=THREE.Shape){const s=new Type(),x=-w/2,y=-d/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+d-r);s.quadraticCurveTo(x+w,y+d,x+w-r,y+d);s.lineTo(x+r,y+d);s.quadraticCurveTo(x,y+d,x,y+d-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
const tray=new THREE.Group();tray.position.y=-.68;assembly.add(tray);
tray.add(box(3.2,.12,2.2,polymer,0,0,0,.12));
const contour=circle(3.2,2.2,.18);contour.holes.push(circle(2.94,1.94,.1,THREE.Path));
const wallGeom=new THREE.ExtrudeGeometry(contour,{depth:.78,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:2,steps:1});wallGeom.rotateX(-Math.PI/2);
const walls=new THREE.Mesh(wallGeom,polymer);walls.castShadow=true;walls.receiveShadow=true;tray.add(walls);
// Subtle print layers on the enclosure exterior.
for(let i=1;i<18;i++){const g=new THREE.EdgesGeometry(new RoundedBoxGeometry(3.22,.008,2.22,2,.14),32);const l=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xa24422,transparent:true,opacity:.12}));l.position.y=i*.041;tray.add(l);}
const board=new THREE.Group();assembly.add(board);board.position.y=-.3;
board.add(box(2.62,.055,1.56,pcbMat,0,0,0,.04));
board.add(box(.7,.12,.6,black,-.2,.08,.1,.02));board.add(box(.6,.18,.45,steel,.91,.12,.49,.02));board.add(box(.49,.12,.3,black,.92,.12,.66,.01));
for(let i=0;i<8;i++){board.add(box(.065,.05,.12,steel,-.48+i*.085,.09,-.25,.003));board.add(box(.065,.05,.12,steel,-.48+i*.085,.09,.44,.003));}
for(let i=0;i<10;i++){board.add(box(.06,.18,.06,gold,-1.04+i*.16,.11,-.55,.01));}
for(const x of [-1.22,1.22])for(const z of [-.7,.7]){const mount=new THREE.Mesh(new THREE.CylinderGeometry(.09,.1,.25,20),polymer);mount.position.set(x,.2,z);tray.add(mount);}
const lid=new THREE.Group();assembly.add(lid);lid.position.y=.15;lid.add(box(3.25,.15,2.25,lidMat,0,0,0,.15));
for(let i=0;i<7;i++) lid.add(box(.07,.008,.65,black,-.57+i*.19,.079,.05,.025));
const screws=new THREE.Group();assembly.add(screws);screws.position.y=.255;
for(const x of [-1.34,1.34])for(const z of [-.85,.85]){const head=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.035,24),steel);head.position.set(x,0,z);head.castShadow=true;screws.add(head);screws.add(box(.065,.006,.013,black,x,.019,z,.001));const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.032,.032,.19,12),steel);shaft.position.set(x,-.11,z);screws.add(shaft);}
const shadow=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.17}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.81;shadow.receiveShadow=true;scene.add(shadow);
let spinning=!reduced.matches,visible=true,drag=false,frame=null,lastTime=0,explode=0,target=0,lastX=0,lastY=0,startX=0,startY=0;
const toggle=document.querySelector('#rotation-toggle');
function ui(){toggle.setAttribute('aria-pressed',String(spinning));toggle.setAttribute('aria-label',spinning?'Pause 3D rotation':'Start 3D rotation');toggle.querySelector('span').textContent=spinning?'Pause':'Rotate';toggle.querySelector('path').setAttribute('d',spinning?'M7 5v10M13 5v10':'m7 4 9 6-9 6Z');}
function render(time=0){frame=null;const dt=Math.min((time-lastTime)/1000,.04);lastTime=time;if(spinning&&!drag)assembly.rotation.y+=dt*.18;explode=reduced.matches?target:THREE.MathUtils.damp(explode,target,5,dt);lid.position.y=.15+explode*1.48;board.position.y=-.3+explode*.7;screws.position.y=.255+explode*2.0;renderer.render(scene,camera);if(visible&&!document.hidden&&(spinning||Math.abs(explode-target)>.0001))frame=requestAnimationFrame(render);}
function requestRender(){if(frame===null&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
function resize(){const w=holder.clientWidth,h=holder.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;const factor=Math.max(1,1.12/camera.aspect);camera.position.set(5.5*factor,4.5*factor,6.5*factor);camera.lookAt(0,.4,0);camera.updateProjectionMatrix();requestRender();}
new ResizeObserver(resize).observe(holder);new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)requestRender();},{rootMargin:'100px'}).observe(holder);document.addEventListener('visibilitychange',requestRender);
toggle.addEventListener('click',()=>{spinning=!spinning;ui();requestRender();});reduced.addEventListener('change',e=>{spinning=!e.matches;ui();requestRender();});
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{target=b.dataset.view==='wire'?1:0;document.querySelectorAll('[data-view]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b));});requestRender();}));
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag=true;lastX=e.clientX;lastY=e.clientY;startY=assembly.rotation.y;startX=assembly.rotation.x;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';});canvas.addEventListener('pointermove',e=>{if(!drag)return;assembly.rotation.y=startY+(e.clientX-lastX)*.008;assembly.rotation.x=THREE.MathUtils.clamp(startX+(e.clientY-lastY)*.004,-.4,.4);requestRender();});function end(){drag=false;canvas.style.cursor='grab';requestRender();}canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(frame)cancelAnimationFrame(frame);frame=null;holder.classList.remove('ready');document.querySelector('.scene-controls').hidden=true;});ui();resize();renderer.render(scene,camera);holder.classList.add('ready');
