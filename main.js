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

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,3,20);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff,1.5));

// PLATFORM
const platform = new THREE.Mesh(
  new THREE.CylinderGeometry(8,8,1,32),
  new THREE.MeshStandardMaterial({color:0xff99cc})
);
platform.position.y=-2;
scene.add(platform);

// HEART SHAPE
function heart(){
  const shape=new THREE.Shape();
  shape.moveTo(0,0);
  shape.bezierCurveTo(0,3,-3,3,-3,0);
  shape.bezierCurveTo(-3,-3,0,-5,0,-7);
  shape.bezierCurveTo(0,-5,3,-3,3,0);
  shape.bezierCurveTo(3,3,0,3,0,0);
  const geo=new THREE.ShapeGeometry(shape);
  const mat=new THREE.MeshBasicMaterial({color:0xff4d88});
  const mesh=new THREE.Mesh(geo,mat);
  mesh.scale.set(0.3,0.3,0.3);
  return mesh;
}

const hearts=[];
for(let i=0;i<200;i++){
  const h=heart();
  h.position.set((Math.random()-0.5)*50,Math.random()*20,(Math.random()-0.5)*50);
  scene.add(h);
  hearts.push(h);
}

// PHOTOS
const loader=new THREE.TextureLoader();
const crystals=[];
const radius=12;

for(let i=1;i<=11;i++){
  const tex=loader.load(`./images/picture${i}.jpg`);
  const mesh=new THREE.Mesh(
    new THREE.PlaneGeometry(4,5),
    new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide})
  );
  const angle=(i/11)*Math.PI*2;
  mesh.position.set(Math.cos(angle)*radius,1,Math.sin(angle)*radius);
  mesh.lookAt(0,1,0);
  scene.add(mesh);
  crystals.push(mesh);
}

// CAMERA ZOOM
const raycaster=new THREE.Raycaster();
const mouse=new THREE.Vector2();
let zoom=false;
let original=new THREE.Vector3();

window.addEventListener("click",(e)=>{
  mouse.x=(e.clientX/innerWidth)*2-1;
  mouse.y=-(e.clientY/innerHeight)*2+1;
  raycaster.setFromCamera(mouse,camera);

  const hit=raycaster.intersectObjects(crystals);

  if(zoom){
    camera.position.copy(original);
    camera.lookAt(0,1,0);
    zoom=false;
    return;
  }

  if(hit.length>0){
    original.copy(camera.position);
    const p=hit[0].object.position;
    camera.position.set(p.x*0.6,p.y+1.5,p.z*0.6);
    camera.lookAt(p);
    zoom=true;
  }
});

// ANIMATE
let t=0;
function animate(){
  requestAnimationFrame(animate);
  t+=0.01;

  hearts.forEach((h,i)=>{
    h.position.y+=Math.sin(t+i)*0.02;
  });

  if(!zoom){
    camera.position.y=Math.sin(t)*0.4+3;
    camera.lookAt(0,1,0);
  }

  renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
