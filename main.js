import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import * as dat from 'dat.gui';

// TEXTURE LOADER - PENTRU A INCORPORA TEXTURI
const textureLoader = new THREE.TextureLoader();

// === SCENA PRINCIPALA===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // cer albastru deschis

// === CAMERA SI POZITIE ===
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// === RENDERER ===
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === ORBIT CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
camera.position.set(0, 100, 300); // sus si in spate
controls.target.set(0, 0, 0); // sa priveasca spre centru
controls.update();

// === LUMINI Generale ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); //lumina alba de intensitate medie in mod normal
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 1); //lumina care imita soarele 
sunLight.position.set(100, 100, 50);
scene.add(sunLight);


//==============================================================================
// ================================ SUPRAFATA GENERALA =========================
//==============================================================================

// === TEREN GENERAL (suprafața aeroportului)  - TEXTURA DE IARBA ===
const grassColor = textureLoader.load('./assets/textures/iarba/Grass001_1K-JPG_Color.jpg');
const grassNormal = textureLoader.load('./assets/textures/iarba/Grass001_1K-JPG_NormalGL.jpg');
const grassRoughness = textureLoader.load('./assets/textures/iarba/Grass001_1K-JPG_Roughness.jpg');
const grassAO = textureLoader.load('./assets/textures/iarba/Grass001_1K-JPG_AmbientOcclusion.jpg');

// Repeta textura pe un teren mare pentru a acoperi totul
[grassColor, grassNormal, grassRoughness, grassAO].forEach((tex) => {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(50, 50);
});

const terenGeometry = new THREE.PlaneGeometry(700, 700);  //plan de 700x700 (plansa mare)
terenGeometry.setAttribute('uv2', terenGeometry.attributes.uv);
const terenMaterial = new THREE.MeshStandardMaterial({
  map: grassColor,
  normalMap: grassNormal,
  roughnessMap: grassRoughness,
  aoMap: grassAO 
});
const teren = new THREE.Mesh(terenGeometry, terenMaterial);
teren.rotation.x = -Math.PI / 2;
teren.position.y = -0.01;   //putin sub mapa ca sa acopere tot si sa se poata suprapune restul
scene.add(teren);

// === PISTA DECOLOARE TEXTURA CU MARCAJE  ===
const pistaColor = textureLoader.load('./assets/textures/asfalt/Road006_1K-JPG_Color.jpg');
const pistaNormal = textureLoader.load('./assets/textures/asfalt/Road006_1K-JPG_NormalGL.jpg');
const pistaRoughness = textureLoader.load('./assets/textures/asfalt/Road006_1K-JPG_Roughness.jpg');

// Repeta pentru texturi multiple pentru a acoperi totul
[pistaColor, pistaNormal, pistaRoughness].forEach((tex) => {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 10); // 10 repetitii pe lungimea pistei
});

const pistaGeometry = new THREE.PlaneGeometry(50, 500); //dimensiune latile 50 lungime 500
const pistaMaterial = new THREE.MeshStandardMaterial({
  map: pistaColor,
  normalMap: pistaNormal,
  roughnessMap: pistaRoughness
});

const pista = new THREE.Mesh(pistaGeometry, pistaMaterial);
pista.rotation.x = -Math.PI / 2;
pista.position.y = 0.02;
pista.position.x = 10;
scene.add(pista);

// === SPATIU ARMATA  - unde sunt stationate avioane si tancuri de armata===
const armataGeometry = new THREE.PlaneGeometry(60, 60);
const armataMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const armata = new THREE.Mesh(armataGeometry, armataMaterial);
armata.rotation.x = -Math.PI / 2;
armata.position.y = 0.04; 
armata.position.x = 80; 
armata.position.z = 100; 
scene.add(armata);

// === PISTA ARMATA 2 =============
const pistaArmataGeometry = new THREE.PlaneGeometry(30, 400);
const pistaArmataMaterial = new THREE.MeshStandardMaterial({ color: 0x444333 });
const pistaArmata = new THREE.Mesh(pistaArmataGeometry, pistaArmataMaterial);
pistaArmata.rotation.x = -Math.PI / 2;
pistaArmata.position.y = 0.02;
pistaArmata.position.x = 80; 
pistaArmata.position.z = 100; 
scene.add(pistaArmata);

// === SPATIU CLADIRI =============
const spatiuCladiriGeometry = new THREE.PlaneGeometry(200, 200);
const spatiuCladiriMaterial = new THREE.MeshStandardMaterial({ color: 0x233333 });
const spatiuCladiri = new THREE.Mesh(spatiuCladiriGeometry, spatiuCladiriMaterial);
spatiuCladiri.rotation.x = -Math.PI / 2;
spatiuCladiri.position.y = 0.02; 
spatiuCladiri.position.x = -150; 
spatiuCladiri.position.z = 61;
scene.add(spatiuCladiri);




//==============================================================================
// ============================ IMPORT DE MODELE ===============================
//==============================================================================
const loader = new GLTFLoader();

//  ---------- MODEL AVION ALB COMERCIAL -----------
loader.load(
  './assets/models/Airplane.glb',
  function (gltf) {
    const avion = gltf.scene;
    avion.position.set(10, 0.2, 190);
    avion.rotation.y = Math.PI; //cu fata la pista spre decolare
    avion.scale.set(0.7, 0.7, 0.9); // scalat pentru vizibilitate
    scene.add(avion);
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

// -------------- MODEL RADIO TOWER ARMATA ------------
loader.load(
  './assets/models/Radio_tower.glb',
  function (gltf) {
    const radioTower = gltf.scene;
    radioTower.position.set(120, 0.2, 120); 
    radioTower.rotation.y = Math.PI; 
    radioTower.scale.set(1.3, 1.3, 1.3); // scalat pentru vizibilitate
    scene.add(radioTower);
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);
// --------------- MODEL CORT MILITAR ------------------
loader.load(
  './assets/models/Military_Tent.glb',
  function (gltf) {
    const cort = gltf.scene;
    cort.position.set(100, 0.2,140);
    cort.rotation.y = Math.PI/2; 
    cort.scale.set(1.3, 1.3, 1.3); // scalat pentru vizibilitate
    scene.add(cort);
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

//----------------- MODEL AVION MILITAR MIC 1 ------------------
loader.load(
  './assets/models/Aeroplane.glb',
  function (gltf) {
    const avion = gltf.scene;
    avion.position.set(80, 0.8,120);
    avion.rotation.y = Math.PI;
    avion.scale.set(2.5, 2.5, 2.5); 
    scene.add(avion);
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

//----------------- MODEL AVION MILITAR MIC 2 ------------------
loader.load(
  './assets/models/Aeroplane.glb',
  function (gltf) {
    const avion = gltf.scene;
    avion.position.set(60, 0.8,120);
    avion.rotation.y = Math.PI; 
    avion.scale.set(2.5, 2.5, 2.5); 
    scene.add(avion);
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

//----------------- MODEL AVION MILITAR MIC 3 ------------------
loader.load(
  './assets/models/Aeroplane.glb',
  function (gltf) {
    const avion = gltf.scene;
    avion.position.set(60, 0.8,90);
    avion.rotation.y = -Math.PI*2.2; 
    avion.scale.set(2.5, 2.5, 2.5);
    scene.add(avion);
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

//----------------- MODEL TANK ------------------
loader.load(
  './assets/models/Tank.glb',
  function (gltf) {
    const tankModel = gltf.scene;
    tankModel.position.set(80, 0.8,100); // așezat pe pistă, spre capăt
    tankModel.rotation.y = -Math.PI*2.2; // întors spre pistă
    tankModel.scale.set(0.8, 0.8, 0.8); // scalat pentru vizibilitate
    scene.add(tankModel);
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

//----------------- MODEL SPATIU DE PARCARE AUEROPORT ------------------
loader.load(
  './assets/models/Parking_Lot.glb',
  function (gltf) {
    const parkingLot = gltf.scene;
    parkingLot.position.set(-115, 0.8,180); 
    parkingLot.rotation.y = Math.PI; 
    parkingLot.scale.set(10, 10, 10); 
    scene.add(parkingLot);
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

//----------------- MODEL SPATIU DE PARCARE AUEROPORT 2------------------
loader.load(
  './assets/models/Parking_Lot.glb',
  function (gltf) {
    const parkingLot = gltf.scene;
    parkingLot.position.set(-150, 0.8,181.5); 
    parkingLot.rotation.y = -Math.PI/0.5; // inversat ca sa para perfect fit
    parkingLot.scale.set(10, 10, 10); 
    scene.add(parkingLot);
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

//----------------- MODEL STRADA CARE DA IN PARCARE ----------------
loader.load(
  './assets/models/Road_Piece_Straight.glb',
  function (gltf) {
    const strada = gltf.scene;
    strada.position.set(-130, 0.8,275);
    strada.rotation.y = -Math.PI/0.5; 
    strada.scale.set(12, 10, 60); 
    scene.add(strada);
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

//----------------- MODEL CLADIRI MARI - AEROPORT -------------------
loader.load(
  './assets/models/large_building.glb',
  function (gltf) {
    const modelOriginal = gltf.scene;

      const pozitiiCladiri = [
       { x: -200, y: 0.8, z: 140 },
       { x: -130, y: 0.8, z: 140 },
    ];
      pozitiiCladiri.forEach((pos) => {
      const cladire = modelOriginal.clone(true); 
      cladire.position.set(pos.x, pos.y, pos.z);
      cladire.rotation.y = -Math.PI / 0.5;
      cladire.scale.set(30, 30, 30);
      scene.add(cladire);
    });
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);


loader.load(
  './assets/models/large_building.glb',
  function (gltf) {
    const modelOriginal = gltf.scene;

      const pozitiiCladiri = [
       { x: -70, y: 0.8, z: 130 },
       { x: -70, y: 0.8, z: 60 },
    ];
      pozitiiCladiri.forEach((pos) => {
      const cladire = modelOriginal.clone(true); // true => cu materiale, copii recursive
      cladire.position.set(pos.x, pos.y, pos.z);
      cladire.rotation.y = Math.PI / 2;
      cladire.scale.set(30, 30, 30);
      scene.add(cladire);
    });
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

//----------------- MODEL SKYSCRAPERE AEROPORT-----------------
loader.load(
  './assets/models/Skyscraper.glb',
  function (gltf) {
    const modelOriginal = gltf.scene;

      const pozitiiCladiri = [    // CA SA NU MAI TREBUIASCA SA SCRIU PENTRU FIECARE CLADIRE
       { x: -200, y: 0.8, z: 100 },
       { x: -200, y: 0.8, z: 70 },
       { x: -200, y: 0.8, z: 40 },
       { x: -200, y: 0.8, z: 10 },
    ];
      pozitiiCladiri.forEach((pos) => {
      const cladire = modelOriginal.clone(true); 
      cladire.position.set(pos.x, pos.y, pos.z);
      cladire.rotation.y = Math.PI / 2;
      cladire.scale.set(30, 30, 30);
      scene.add(cladire);
    });
  },
  undefined,
  function (error) {
    console.error('Eroare la incarcarea modelului:', error);
  }
);

// ----------------- MODEL TIP COPAC 1------------------
loader.load(
  './assets/models/tree1.glb',
  function (gltf) {
    const modelOriginal = gltf.scene;
      const pozitiiCopaci = [
      { x: 112, y: 0.8, z: 90 },{ x: 112, y: 0.8, z: 130 },{ x: 48, y: 0.8, z: 90 },{ x: 48, y: 0.8, z: 130 },
      { x: 130, y: 0.8, z: -70 },{ x: 134, y: 0.8, z: -30 },{ x: 132, y: 0.8, z: 10 },{ x: 127, y: 0.8, z: 50 },
      { x: 130, y: 0.8, z: 90 },{ x: 125, y: 0.8, z: 130 },{ x: 131, y: 0.8, z: 170 },
      { x: 150, y: 0.8, z: -70 },{ x: 154, y: 0.8, z: -30 },{ x: 162, y: 0.8, z: 10 },{ x: 137, y: 0.8, z: 50 },
      { x: 150, y: 0.8, z: 90 },{ x: 145, y: 0.8, z: 130 },{ x: 151, y: 0.8, z: 170 },
      { x: -30, y: 0.8, z: -70 },{ x: -34, y: 0.8, z: -30 },{ x: -32, y: 0.8, z: 10 },{ x: -27, y: 0.8, z: 50 },
      { x: -30, y: 0.8, z: 90 },{ x: -25, y: 0.8, z: 130 },{ x: -31, y: 0.8, z: -170 },{ x: -25, y: 0.8, z: -210 },
      { x: -31, y: 0.8, z: -250 },{ x: -180, y: 0.8, z: 210  },{ x: -140, y: 0.8, z: 210  },{ x: -140, y: 0.8, z: 220  },
      { x: -140, y: 0.8, z: 240  },{ x: -140, y: 0.8, z: 260  },{ x: -140, y: 0.8, z: 280  },{ x: -140, y: 0.8, z: 300  },
      { x: -140, y: 0.8, z: 320  },{ x: -140, y: 0.8, z: 340  },{ x: -110, y: 0.8, z: 220  },{ x: -110, y: 0.8, z: 240  },
      { x: -110, y: 0.8, z: 260  },{ x: -110, y: 0.8, z: 280  },{ x: -110, y: 0.8, z: 300  },{ x: -110, y: 0.8, z: 320  },
    ];
      pozitiiCopaci.forEach((pos) => {
      const copac = modelOriginal.clone(true); // true
      copac.position.set(pos.x, pos.y, pos.z);
      copac.rotation.y = -Math.PI * 2.2;
      copac.scale.set(1.2, 1.2, 1.2);
      scene.add(copac);
    });
  },
  undefined,
  function (error) {
    console.error('Eroare la încarcarea modelului:', error);
  }
);


// ----------------- MODEL TIP COPAC 2------------------
loader.load(
  './assets/models/tree2.glb',
  function (gltf) {
    const modelOriginal = gltf.scene;

      const pozitiiCopaci = [
      { x: 112, y: 6, z: 110 },{ x: 48, y: 6, z: 110 },
      { x: 120, y: 6, z: -80 },{ x: -40, y: 6, z: -120 },{ x: -40, y: 6, z: -160 },{ x: -32, y: 6, z: -200 },
      { x: -36, y: 6, z: 40 },{ x: -30, y: 6, z: -10 },{ x: -29, y: 6, z: -40 },{ x: 120, y: 6, z: 10 },
      { x: -40, y: 6, z: 30 },{ x: -40, y: 6, z: 60 },{ x: -32, y: 6, z: 80 },
      { x: 130, y: 6, z: -80 },{ x: 134, y: 6, z: -40 },{ x: 132, y: 6, z: 30 },{ x: 127, y: 6, z: 70 },
      { x: 130, y: 6, z: 110 },{ x: 125, y: 6, z: 150 },{ x: 131, y: 6, z: 190 },
      { x: 150, y: 6, z: -80 },{ x: 154, y: 6, z: -40 },{ x: 152, y: 6, z: 30 },{ x: 147, y: 6, z: 70 },
      { x: 150, y: 6, z: 110 },{ x: 145, y: 6, z: 150 },{ x: 151, y: 6, z: 190 },{ x: -200, y: 6, z: 210  },
      { x: -180, y: 6, z: 190  },{ x: -200, y: 6, z: 180  },{ x: -70, y: 6, z: 210  },{ x: -70, y: 6, z: 180  },
      ,{ x: -50, y: 6, z: 190  },
      { x: -140, y: 6, z: 230  },
      { x: -140, y: 6, z: 250  },{ x: -140, y: 6, z: 270  },{ x: -140, y: 6, z: 290  },{ x: -140, y: 6, z: 310  },
      { x: -140, y: 6, z: 330  },{ x: -140, y: 6, z: 350  },{ x: -110, y: 6, z: 230  },{ x: -110, y: 6, z: 250  },
      { x: -110, y: 6, z: 270  },{ x: -110, y: 6, z: 290  },{ x: -110, y: 6, z: 310  },{ x: -110, y: 6, z: 330  },
    ];
      pozitiiCopaci.forEach((pos) => {
      const copac = modelOriginal.clone(true); 
      copac.position.set(pos.x, pos.y, pos.z);
      copac.scale.set(10, 5, 10);
      scene.add(copac);
    });
  },
  undefined,
  function (error) {
    console.error('Eroare la încarcarea modelului:', error);
  }
);

// ----------------- MODEL LAN DE GRAU------------------
loader.load(
  './assets/models/Field.glb',
  function (gltf) {
    const modelOriginal = gltf.scene;
      const pozitiiLan = [
      { x: 192, y: 0.8, z: 90 },{ x: 232, y: 0.8, z: 90 },{ x: 262, y: 0.8, z: 90 },
      { x: 292, y: 0.8, z: 90 },{ x: 322, y: 0.8, z: 90 },
    ];
      pozitiiLan.forEach((pos) => {
      const lan = modelOriginal.clone(true);
      lan.position.set(pos.x, pos.y, pos.z);
      lan.rotation.y = Math.PI;
      lan.scale.set(0.2, 0.05, 2);
      scene.add(lan);
    });
  },
  undefined,
  function (error) {
    console.error('Eroare la încarcarea modelului:', error);
  }
);

// ----------------- MODEL TRACTOR PE CAMP------------------
loader.load(
  './assets/models/Tractor.glb',
  function (gltf) {
    const tractor = gltf.scene;
    tractor.position.set(180, 0.8,181.5); 
    tractor.rotation.y = Math.PI; 
    tractor.scale.set(0.6, 0.6, 0.6); 
    scene.add(tractor);
  },
  undefined,
  function (error) {
    console.error('Eroare la încarcarea modelului:', error);
  }
);

loader.load(
  './assets/models/Tractor.glb',
  function (gltf) {
    const tractor = gltf.scene;
    tractor.position.set(220, 1.5,100); 
    tractor.rotation.y = Math.PI*2; 
    tractor.scale.set(0.6, 0.6, 0.6); 
    scene.add(tractor);
  },
  undefined,
  function (error) {
    console.error('Eroare la încarcarea modelului:', error);
  }
);

// ----------------- MODEL AVION JET------------------
loader.load(
  './assets/models/Jet.glb',
  function (gltf) {
    const avion = gltf.scene;
    avion.position.set(80, 1.8,190); 
    avion.rotation.y = Math.PI; 
    avion.scale.set(0.03, 0.03, 0.03); 
    scene.add(avion);
  },
  undefined,
  function (error) {
    console.error('Eroare la încarcarea modelului:', error);
  }
);

//=======================================================================
//========================== MODELE PROPRII =============================
//=======================================================================

// ----------- MODEL PROPRIU TURN RADAR ------------
const turnGroup = new THREE.Group();
// BAZA turnului 
const bazaGeometry = new THREE.CylinderGeometry(4, 6, 50, 32);
const bazaMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const baza = new THREE.Mesh(bazaGeometry, bazaMaterial);
baza.position.y = 25; // jumatate din înaltime
turnGroup.add(baza);

// CABINA de control 
const cabinaGeometry = new THREE.BoxGeometry(12, 6, 12);
const cabinaMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
const cabina = new THREE.Mesh(cabinaGeometry, cabinaMaterial);
cabina.position.y = 53;
turnGroup.add(cabina);

// BARA radar
const baraRadarGeometry = new THREE.CylinderGeometry(1, 0.4, 4, 16);
const baraRadarMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const baraRadar = new THREE.Mesh(baraRadarGeometry, baraRadarMaterial);
baraRadar.position.y = 57;
turnGroup.add(baraRadar);

// ANTENA radar
const antenaGeometry = new THREE.BoxGeometry(40, 0.9, 3);
const antenaMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const antena = new THREE.Mesh(antenaGeometry, antenaMaterial);
antena.position.y = 59;
turnGroup.add(antena);
turnGroup.scale.set(2,2,2);
turnGroup.position.set(-70, 0, 0);
scene.add(turnGroup);


// -------------- MODEL PROPRIU AVION CARE ZBOARA -------------
const avionGroup = new THREE.Group();
// FUSELAJ – cilindru orientat implicit pe axa Z (în fata)
const fuselajGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 16, 1, false);
const fuselajMaterial = new THREE.MeshStandardMaterial({ color: 0x8b8589 });
const fuselaj = new THREE.Mesh(fuselajGeometry, fuselajMaterial);
fuselaj.rotation.x = Math.PI / 2; // in fata pe axa Z
avionGroup.add(fuselaj);

// COCKPIT – semisfera în fata
const cockpitGeometry = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI);
const cockpitMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
cockpit.rotation.x = Math.PI / 2;
cockpit.position.z = 4;
avionGroup.add(cockpit);

// FUNCtIE: creeaza o aripa in forma de triunghi prin 3 puncte lipite de body
function createAripaTriunghi(p1, p2, p3, material) {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    p1.x, p1.y, p1.z,
    p2.x, p2.y, p2.z,
    p3.x, p3.y, p3.z
  ]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, material);
}

// ARIPA STANGA – baza aproape de body
const aripaStanga = createAripaTriunghi(
  new THREE.Vector3(0, 0, 1.5),     // baza 1 (fata)
  new THREE.Vector3(0, 0, -1.5),    // baza 2 (spate)
  new THREE.Vector3(-6, 0, 0),      // varf exterior
  fuselajMaterial
);
avionGroup.add(aripaStanga);

// ARIPA DREAPTA – oglinda pe X
const aripaDreapta = aripaStanga.clone();
aripaDreapta.scale.x = -1; // inversare pe X
avionGroup.add(aripaDreapta);


// COADA orizontala
const coadaHGeometry = new THREE.BoxGeometry(2, 0.1, 0.5);
const coadaH = new THREE.Mesh(coadaHGeometry, fuselajMaterial);
coadaH.position.set(0, 0.5, -4);
avionGroup.add(coadaH);

// COADA verticala
const coadaVGeometry = new THREE.BoxGeometry(0.1, 1, 0.5);
const coadaV = new THREE.Mesh(coadaVGeometry, fuselajMaterial);
coadaV.position.set(0, 0.5, -4);
avionGroup.add(coadaV);

// POZITIONARE
avionGroup.scale.set(5, 5, 5);
scene.add(avionGroup);


// ------------- TANK CARE se misca cu WASD ---------------
const tancGroup = new THREE.Group();

// corp
const corpGeo = new THREE.BoxGeometry(8, 4, 6);
const corpMat = new THREE.MeshStandardMaterial({ color: 0x136b14 });
const corp = new THREE.Mesh(corpGeo, corpMat);
tancGroup.add(corp);

// turela
const turelaGeo = new THREE.CylinderGeometry(1.1, 0.8, 15, 16);
const turela = new THREE.Mesh(turelaGeo, corpMat);
turela.rotation.z = Math.PI / 2;
turela.position.set(2.5, 0.5, 0);
tancGroup.add(turela);

//senile 
const senilaGeo = new THREE.BoxGeometry(4, 1, 6.2);
const senilaMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

const senilaStanga = new THREE.Mesh(senilaGeo, senilaMat);
senilaStanga.position.set(-2.2, -0.5, 0);
tancGroup.add(senilaStanga);

const senilaDreapta = new THREE.Mesh(senilaGeo, senilaMat);
senilaDreapta.position.set(2.2, -0.5, 0);
tancGroup.add(senilaDreapta);

//roti la senile
const roataGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
const roataMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const nrRoti = 4;
const distanta = 3;

for (let i = 0; i < nrRoti; i++) {
  const zOffset = -distanta + (i * (distanta * 2) / (nrRoti - 1));
  const roataSt = new THREE.Mesh(roataGeo, roataMat);
  roataSt.rotation.z = Math.PI / 2;
  roataSt.position.set(-2.2, -1, zOffset);
  tancGroup.add(roataSt);
  const roataDr = roataSt.clone();
  roataDr.position.x = 2.2;
  tancGroup.add(roataDr);
}

tancGroup.position.set(80, 2, 160);
scene.add(tancGroup);
const keys = {
  w: false,
  s: false,
  a: false,
  d: false,
  q:false,
  e:false
};

document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// =============================================================
// ======================= INTERFAȚĂ GUI =======================
// =============================================================

const gui = new dat.GUI();
const settings = {
  vreme: 'Zi Normala' // default
};
gui.add(settings, 'vreme', ['Normal', 'Ploaie']).onChange(updateWeather);

let avionControl = {
  viteza: 0.003,
  altitudine: 30
};
gui.add(avionControl, 'viteza', 0.001, 0.02).step(0.001).name('Viteza Avion');
gui.add(avionControl, 'altitudine', 10, 100).step(1).name('Altitudine Avion');

// =============================================================
// =============== EFECTE REALISTE ====================

// ------------ SUNET PLOAIE SI TRASNET ------------------
const listener = new THREE.AudioListener();
camera.add(listener);

const rainSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('./assets/sounds/rain.flac', function (buffer) {
  rainSound.setBuffer(buffer);
  rainSound.setLoop(true);
  rainSound.setVolume(0.5);
});

// -------------- FUNCTIE SCHIMBARE VREME -----------------
function updateWeather() {
  if (settings.vreme === 'Normal') {
    scene.background = new THREE.Color(0x87ceeb); // cer albastru
    sunLight.intensity = 1;
    ambientLight.intensity = 0.5;
    rainParticles.visible = false;
    if (rainSound.isPlaying) rainSound.stop();
   
  } else if (settings.vreme === 'Ploaie') {
    scene.background = new THREE.Color(0x5c5c5c); // gri inchis
    sunLight.intensity = 0.2;
    ambientLight.intensity = 0.3;
    rainParticles.visible = true;
    if (!rainSound.isPlaying) rainSound.play();
  }
}

// ---------------- PARTICULE PLOAIE SI FULGER LIGHT -----------------
const rainGeometry = new THREE.BufferGeometry();
const rainCount = 4000;
const rainPositions = [];

for (let i = 0; i < rainCount; i++) {
  const x = Math.random() * 500 - 250;
  const y = Math.random() * 100 + 30;
  const z = Math.random() * 500 - 250;
  rainPositions.push(x, y, z);
}

rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainPositions, 3));

const rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.5,
  transparent: true,
  opacity: 0.6
});

const rainParticles = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rainParticles);
rainParticles.visible = false; // activam la mod ploaie

// FULGER
const ambientFlashLight = new THREE.AmbientLight(0xcaeeef, 0); // începe cu 0 intensitate
scene.add(ambientFlashLight);

//===========================================================
//============================ ANIMATII ======================
//===========================================================
const tancMoveSpeed = 0.5;
let t = 0;
// ----------------- ANIMTIE -------------------
function animate() {
  requestAnimationFrame(animate);

  // Roteste antena radar non stop
  antena.rotation.y += 0.05;

  //ZBOR CIRCULAR avion custom
  t += avionControl.viteza;
  const radius = 300;
  const x = Math.cos(t) * radius;
  const z = Math.sin(t) * radius;
  const y = avionControl.altitudine;
  avionGroup.position.set(x, y, z);
  // ORIENTARE
  avionGroup.lookAt(
    Math.cos(t + 0.1) * radius,
    y,
    Math.sin(t + 0.1) * radius
  );

  //EFECT PLOAIE
  const positions = rainGeometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] -= 0.5; // scade y (cad particulele)
    if (positions[i + 1] < 0)
       positions[i + 1] = 100; // reapar sus
  }
  rainGeometry.attributes.position.needsUpdate = true;  

  //EFECT FULGER
   if (settings.vreme === 'Ploaie') {
    if (Math.random() < 0.003) { // 0.4% sansa pe frame (~la cateva secunde)
      ambientFlashLight.intensity = 1 + Math.random() * 2;
        setTimeout(() => {
          ambientFlashLight.intensity = 0;
        }, 150 + Math.random() * 200);
    }
  } 

  //CONTROALA TANK WASD QE
  if (keys.w) {
  tancGroup.position.z -= tancMoveSpeed;
  }
  if (keys.s) {
    tancGroup.position.z += tancMoveSpeed;
  }
  if (keys.a) {
    tancGroup.position.x -= tancMoveSpeed;
  }
  if (keys.d) {
    tancGroup.position.x += tancMoveSpeed;
  }
  if (keys.q) {
  tancGroup.rotation.y += 0.05;
  }
  if (keys.e) {
  tancGroup.rotation.y -= 0.05;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate(); //porneste animatiile

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
