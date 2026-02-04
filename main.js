// ================= ENTER + MUSIC =================
const music = document.getElementById("bgMusic");
const startScreen = document.getElementById("startScreen");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {
  music.volume = 0;
  music.play().then(() => {
    let v = 0;
    const fade = setInterval(() => {
      if (v < 0.4) { v += 0.02; music.volume = v; }
      else clearInterval(fade);
    }, 200);
  });
  startScreen.style.display = "none";
});

// ================= SCENE =================
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xffc0e6, 10, 120);

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,3,22);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xffd6f2);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff,1.3));

// ================= PLATFORM =================
const platform = new THREE.Mesh(
  new THREE.CylinderGeometry(8,8,1,32),
  new THREE.MeshStandardMaterial({color:0xff99cc})
);
platform.position.y = -2;
scene.add(platform);

// ================= HEART SHAPE =================
function createHeartMesh(size=0.15,color=0xff4d88){
  const x=0,y=0;
  const heartShape = new THREE.Shape();
  heartShape.moveTo(x+5,y+5);
  heartShape.bezierCurveTo(x+5,y+5,x+4,y,x,y);
  heartShape.bezierCurveTo(x-6,y,x-6,y+7,x-6,y+7);
  heartShape.bezierCurveTo(x-6,y+11,x-3,y+15.4,x+5,y+19);
  heartShape.bezierCurveTo(x+12,y+15.4,x+16,y+11,x+16,y+7);
  heartShape.bezierCurveTo(x+16,y+7,x+16,y,x+10,y);
  heartShape.bezierCurveTo(x+7,y,x+5,y+5,x+5,y+5);

  const geo = new THREE.ShapeGeometry(heartShape);
  const mat = new THREE.MeshBasicMaterial({color});
  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.set(size,size,size);
  return mesh;
}

// ================= FLOATING HEARTS =================
const hearts=[];
for(let i=0;i<250;i++){
  const h=createHeartMesh();
  h.position.set((Math.random()-0.5)*60,Math.random()*25,(Math.random()-0.5)*60);
  scene.add(h);
  hearts.push(h);
}

// ================= PHOTO CRYSTALS =================
const loader = new THREE.TextureLoader();
const crystals=[];
const totalPhotos=11;
const radius=13;

for(let i=1;i<=totalPhotos;i++){
  const texture=loader.load(`./images/picture${i}.jpg`);

  const crystal=new THREE.Mesh(
    new THREE.PlaneGeometry(3,4),
    new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide})
  );

  const angle=(i/totalPhotos)*Math.PI*2;
  crystal.position.set(Math.cos(angle)*radius,1,Math.sin(angle)*radius);
  crystal.lookAt(0,1,0);
  crystals.push(crystal);
  scene.add(crystal);
}

// ================= CINEMATIC CAMERA ZOOM =================
const raycaster=new THREE.Raycaster();
const mouse=new THREE.Vector2();

let isZoomed=false;
let originalCamPos=new THREE.Vector3();
let originalLook=new THREE.Vector3();

window.addEventListener("click",(e)=>{
  mouse.x=(e.clientX/innerWidth)*2-1;
  mouse.y=-(e.clientY/innerHeight)*2+1;
  raycaster.setFromCamera(mouse,camera);

  const hit=raycaster.intersectObjects(crystals);

  if(isZoomed){
    camera.position.copy(originalCamPos);
    camera.lookAt(originalLook);
    isZoomed=false;
    return;
  }

  if(hit.length>0){
    const obj=hit[0].object;
    originalCamPos.copy(camera.position);
    originalLook.set(0,1,0);

    const pos=obj.position.clone();
    camera.position.set(pos.x*0.6, pos.y+1.5, pos.z*0.6);
    camera.lookAt(obj.position);
    isZoomed=true;
  }
});

// ================= LETTER =================
function showLetter(){
  const div=document.createElement("div");
  div.innerHTML=`
  <div style="
  position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
  background:white;padding:30px;border-radius:20px;
  width:60%;text-align:center;z-index:50;font-family:serif;">
  <h2>My Love ❤️</h2>
  <p>You make my world magical. Every memory with you means everything to me.</p>
  <button onclick="this.parentElement.remove()">Close</button>
  </div>`;
  document.body.appendChild(div);
}

// ================= ANIMATION =================
let t=0;
function animate(){
  requestAnimationFrame(animate);
  t+=0.01;

  hearts.forEach((h,i)=>{
    h.position.y+=Math.sin(t+i)*0.02;
    h.rotation.z+=0.02;
  });

  camera.position.y=Math.sin(t)*0.4+3;
  if(!isZoomed) camera.lookAt(0,1,0);

  renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
