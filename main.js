const music = document.getElementById("bgMusic");
const startScreen = document.getElementById("startScreen");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {
  music.volume = 0.4;
  music.play();
  startScreen.style.display = "none";
});

// SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0, 4, 18);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xfff5fa);
document.body.appendChild(renderer.domElement);

// CONTROLS (spin around)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.enablePan = false;

// LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

// HEART PARTICLES
function heartShape(){
  const s=new THREE.Shape();
  s.moveTo(0,0);
  s.bezierCurveTo(0,2,-2,2,-2,0);
  s.bezierCurveTo(-2,-2,0,-3,0,-4);
  s.bezierCurveTo(0,-3,2,-2,2,0);
  s.bezierCurveTo(2,2,0,2,0,0);
  const g=new THREE.ShapeGeometry(s);
  const m=new THREE.MeshBasicMaterial({color:0xff6b9e});
  const mesh=new THREE.Mesh(g,m);
  mesh.scale.set(0.3,0.3,0.3);
  return mesh;
}

const hearts=[];
for(let i=0;i<150;i++){
  const h=heartShape();
  h.position.set((Math.random()-0.5)*40,Math.random()*15,(Math.random()-0.5)*40);
  scene.add(h);
  hearts.push(h);
}

// PHOTO CAROUSEL
const loader=new THREE.TextureLoader();
const photos=[];
const radius=10;
const total=11;

for(let i=1;i<=total;i++){
  const tex=loader.load(`./images/picture${i}.jpg`);
  const plane=new THREE.Mesh(
    new THREE.PlaneGeometry(4,5),
    new THREE.MeshBasicMaterial({map:tex, side:THREE.DoubleSide})
  );

  const angle=(i/total)*Math.PI*2;
  plane.position.set(Math.cos(angle)*radius,2,Math.sin(angle)*radius);
  plane.lookAt(0,2,0);

  scene.add(plane);
  photos.push(plane);
}

// CLICK TO ZOOM
const raycaster=new THREE.Raycaster();
const mouse=new THREE.Vector2();
let zoomed=false;
let savedPos=new THREE.Vector3();

window.addEventListener("click",(e)=>{
  mouse.x=(e.clientX/innerWidth)*2-1;
  mouse.y=-(e.clientY/innerHeight)*2+1;
  raycaster.setFromCamera(mouse,camera);
  const hit=raycaster.intersectObjects(photos);

  if(zoomed){
    camera.position.copy(savedPos);
    controls.enabled=true;
    zoomed=false;
    return;
  }

  if(hit.length>0){
    savedPos.copy(camera.position);
    const p=hit[0].object.position;
    camera.position.set(p.x*0.6, p.y+1.5, p.z*0.6);
    camera.lookAt(p);
    controls.enabled=false;
    zoomed=true;
  }
});

// ANIMATION
function animate(){
  requestAnimationFrame(animate);

  hearts.forEach((h,i)=>{
    h.position.y+=Math.sin(Date.now()*0.001+i)*0.01;
  });

  controls.update();
  renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
