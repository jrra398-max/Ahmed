import * as THREE from 'three';
import './style.css';

const products = [
  { id:'n01', name:'SIGNAL TEE', price:850, color:0x151515, accent:'#ff1f2d', desc:'Heavy cotton / oversized fit' },
  { id:'n02', name:'VOID TEE', price:900, color:0x303030, accent:'#d9d9d9', desc:'Soft cotton / relaxed fit' },
  { id:'n03', name:'AFTER DARK', price:950, color:0x111111, accent:'#ff1f2d', desc:'Premium jersey / boxy fit' }
];

const state = { started:false, cart:[], selected:0, checkout:false };

document.querySelector('#app').innerHTML = `
  <div id="intro" class="screen">
    <div class="noise"></div>
    <div class="neon">NOIR</div>
    <div class="intro-sub">VIRTUAL FLAGSHIP STORE</div>
    <button id="enter">ENTER THE STORE</button>
    <button id="direct" class="ghost">VIEW COLLECTION</button>
  </div>
  <main id="world" class="hidden">
    <canvas id="scene"></canvas>
    <div class="hud">
      <div class="brand">NOIR</div>
      <div class="hud-right">
        <button id="sound">SOUND ON</button>
        <button id="bag">BAG <span>0</span></button>
      </div>
    </div>
    <div id="controls" class="controls">
      <div class="pad"><span class="dot"></span></div>
      <div class="hint">DRAG TO EXPLORE · TAP A RACK</div>
    </div>
    <div id="rackPanel" class="panel hidden"></div>
    <div id="collection" class="collection hidden"></div>
    <div id="bagPanel" class="panel bag-panel hidden"></div>
    <div id="checkoutPanel" class="checkout hidden"></div>
  </main>
`;

const intro = document.querySelector('#intro');
const world = document.querySelector('#world');
const canvas = document.querySelector('#scene');
const rackPanel = document.querySelector('#rackPanel');
const collection = document.querySelector('#collection');
const bagPanel = document.querySelector('#bagPanel');
const checkoutPanel = document.querySelector('#checkoutPanel');
const bagButton = document.querySelector('#bag');

function makeScene(){
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080808);
  const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, .1, 100);
  camera.position.set(0, 2.4, 8);

  const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 1.5));
  const red = new THREE.PointLight(0xff1f2d, 10, 14); red.position.set(0,3,-2); scene.add(red);
  const warm = new THREE.PointLight(0xffffff, 4, 12); warm.position.set(-5,4,4); scene.add(warm);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(22,22), new THREE.MeshStandardMaterial({color:0x111111,roughness:.8}));
  floor.rotation.x=-Math.PI/2; scene.add(floor);

  const back = new THREE.Mesh(new THREE.BoxGeometry(18,7,.35), new THREE.MeshStandardMaterial({color:0x151515}));
  back.position.set(0,3,-6); scene.add(back);

  const neon = new THREE.Mesh(new THREE.BoxGeometry(3.5,.06,.04), new THREE.MeshBasicMaterial({color:0xff1f2d}));
  neon.position.set(0,5.2,-5.7); scene.add(neon);

  const racks=[];
  [-4.5,0,4.5].forEach((x,i)=>{
    const rack = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,3,12), new THREE.MeshStandardMaterial({color:0xaaaaaa,metalness:.8}));
    pole.position.y=1.5; rack.add(pole);
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,3.2,12), new THREE.MeshStandardMaterial({color:0x777777,metalness:.9}));
    bar.rotation.z=Math.PI/2; bar.position.y=2.8; rack.add(bar);
    for(let j=0;j<4;j++){
      const shirt = new THREE.Mesh(new THREE.BoxGeometry(.65,.9,.12), new THREE.MeshStandardMaterial({color:products[(i+j)%products.length].color}));
      shirt.position.set(-1.1+j*.72,2.15,0); rack.add(shirt);
    }
    rack.position.x=x; rack.position.z=-2.5; rack.userData.rack=i;
    scene.add(rack); racks.push(rack);
  });

  const counter = new THREE.Mesh(new THREE.BoxGeometry(4,1.1,1.3), new THREE.MeshStandardMaterial({color:0x202020}));
  counter.position.set(0,.55,-4.6); scene.add(counter);

  let dragging=false,lastX=0, rot=0;
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX});
  addEventListener('pointerup',()=>dragging=false);
  addEventListener('pointermove',e=>{if(!dragging)return;rot+=(e.clientX-lastX)*.004;lastX=e.clientX;camera.rotation.y=-rot});
  canvas.addEventListener('click',e=>{
    const rect=canvas.getBoundingClientRect();
    const mouse=new THREE.Vector2((e.clientX/rect.width)*2-1,-(e.clientY/rect.height)*2+1);
    const ray=new THREE.Raycaster(); ray.setFromCamera(mouse,camera);
    const hits=ray.intersectObjects(racks,true);
    if(hits.length) openRack(hits[0].object.parent.userData.rack ?? 0);
  });

  function animate(){requestAnimationFrame(animate);renderer.render(scene,camera)}
  animate();
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
}
function startGame(){
  intro.classList.add('fade');
  setTimeout(()=>{intro.classList.add('hidden');world.classList.remove('hidden');makeScene()},800);
}
function openRack(i){
  rackPanel.classList.remove('hidden');
  const p=products[i%products.length];
  rackPanel.innerHTML=`<button class="close">×</button><div class="eyebrow">RACK 0${i+1}</div><h2>${p.name}</h2><p>${p.desc}</p><div class="product3d" style="--shirt:${p.accent}"><div class="shirt-shape"></div></div><div class="price">${p.price} EGP</div><div class="row"><button id="prev">←</button><button id="add">ADD TO BAG</button><button id="next">→</button></div><small>Drag the product to rotate · front / back view</small>`;
  rackPanel.querySelector('.close').onclick=()=>rackPanel.classList.add('hidden');
  rackPanel.querySelector('#add').onclick=()=>{state.cart.push(p);updateBag();rackPanel.classList.add('hidden')};
  rackPanel.querySelector('#prev').onclick=()=>openRack((i+products.length-1)%products.length);
  rackPanel.querySelector('#next').onclick=()=>openRack((i+1)%products.length);
}
function updateBag(){bagButton.querySelector('span').textContent=state.cart.length}
function openCollection(){
  collection.classList.remove('hidden');
  collection.innerHTML=`<button class="close">×</button><div class="eyebrow">COLLECTION</div><h2>DROP 01</h2><div class="grid">${products.map((p,i)=>`<button class="card" data-i="${i}"><div class="mini-shirt" style="--shirt:${p.accent}"></div><b>${p.name}</b><span>${p.price} EGP</span></button>`).join('')}</div>`;
  collection.querySelector('.close').onclick=()=>collection.classList.add('hidden');
  collection.querySelectorAll('.card').forEach(b=>b.onclick=()=>{collection.classList.add('hidden');openRack(+b.dataset.i)});
}
function openBag(){
  bagPanel.classList.remove('hidden');
  const total=state.cart.reduce((a,p)=>a+p.price,0);
  bagPanel.innerHTML=`<button class="close">×</button><div class="eyebrow">YOUR BAG</div><h2>${state.cart.length} ITEMS</h2>${state.cart.length?state.cart.map(p=>`<div class="bag-item"><span>${p.name}</span><b>${p.price} EGP</b></div>`).join(''):'<p>Your bag is empty.</p>'}<div class="total">TOTAL <b>${total} EGP</b></div>${state.cart.length?'<button id="checkout" class="primary">GO TO CASHIER</button>':''}`;
  bagPanel.querySelector('.close').onclick=()=>bagPanel.classList.add('hidden');
  bagPanel.querySelector('#checkout')?.addEventListener('click',()=>{bagPanel.classList.add('hidden');openCheckout()});
}
function openCheckout(){
  checkoutPanel.classList.remove('hidden');
  checkoutPanel.innerHTML=`<div class="box-scene"><div class="box-logo">NOIR</div></div><div class="eyebrow">CASHIER</div><h2>YOUR ORDER IS READY</h2><p>Everything is packed in your NOIR box.</p><button id="wa" class="primary">CONFIRM VIA WHATSAPP</button><button id="back" class="ghost dark">BACK TO STORE</button>`;
  checkoutPanel.querySelector('#wa').onclick=()=>alert('Demo: WhatsApp confirmation would open here with the order details.');
  checkoutPanel.querySelector('#back').onclick=()=>checkoutPanel.classList.add('hidden');
}
document.querySelector('#enter').onclick=startGame;
document.querySelector('#direct').onclick=()=>{startGame();setTimeout(openCollection,900)};
bagButton.onclick=openBag;
document.querySelector('#sound').onclick=e=>e.currentTarget.textContent=e.currentTarget.textContent==='SOUND ON'?'SOUND OFF':'SOUND ON';
