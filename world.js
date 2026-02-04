import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,4,18);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfff5fa);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

// PHOTO CAROUSEL
const loader = new THREE.TextureLoader();
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
}

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
