const music = document.getElementById("bgMusic");
const startScreen = document.getElementById("startScreen");
const enterBtn = document.getElementById("enterBtn");

enterBtn.onclick = () => {
  music.volume = 0.4;
  music.play();
  startScreen.style.display = "none";
  startWorld();
};

function startWorld(){

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,4,18);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

// PHOTO CAROUSEL
const loader = new THREE.TextureLoader();
const photos = [];
const radius = 10;

for(let i=1;i<=11;i++){
  const tex = loader.load(`images/picture${i}.jpg`);
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

// CLICK TO ZOOM
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let zoomed = false;
let originalPos = new THREE.Vector3();

window.addEventListener("click", (e)=>{
  mouse.x = (e.clientX/window.innerWidth)*2-1;
  mouse.y = -(e.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(mouse,camera);

  const hit = raycaster.intersectObjects(photos);

  if(zoomed){
    camera.position.copy(originalPos);
    controls.enabled = true;
    zoomed = false;
    return;
  }

  if(hit.length>0){
    originalPos.copy(camera.position);
    const p = hit[0].object.position;
    camera.position.set(p.x*0.6, p.y+1.5, p.z*0.6);
    camera.lookAt(p);
    controls.enabled = false;
    zoomed = true;
  }
});

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

}
