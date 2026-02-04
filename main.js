import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

window.addEventListener("DOMContentLoaded", () => {

const music = document.getElementById("bgMusic");
const startScreen = document.getElementById("startScreen");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {
  music.volume = 0.4;
  music.play();
  startScreen.style.display = "none";
});


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,4,18);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xfff5fa);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

// Photos in circle
const loader = new THREE.TextureLoader();
const photos = [];
const radius = 10;

for(let i=1;i<=11;i++){
  const tex = loader.load(`./images/picture${i}.jpg`);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(4,5),
    new THREE.MeshBasicMaterial({map:tex, side:THREE.DoubleSide})
  );

  const angle = (i/11)*Math.PI*2;
  plane.position.set(Math.cos(angle)*radius,2,Math.sin(angle)*radius);
  plane.lookAt(0,2,0);

  scene.add(plane);
  photos.push(plane);
}

// Animate
function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
  });




