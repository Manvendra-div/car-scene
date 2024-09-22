import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create sky
const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

// Create sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(100, 100, -200);
scene.add(sun);

// Create road
const roadGeometry = new THREE.PlaneGeometry(10, 1000);
const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
scene.add(road);

// Create green land areas
const landGeometry = new THREE.PlaneGeometry(100, 1000);
const landMaterial = new THREE.MeshPhongMaterial({ color: 0x2ecc71 });
const leftLand = new THREE.Mesh(landGeometry, landMaterial);
leftLand.rotation.x = -Math.PI / 2;
leftLand.position.set(-55, -0.1, 0);
scene.add(leftLand);

const rightLand = leftLand.clone();
rightLand.position.set(55, -0.1, 0);
scene.add(rightLand);

// Create white strips
const stripGeometry = new THREE.PlaneGeometry(0.2, 3);
const stripMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const stripSpacing = 5;
const numberOfStrips = 200;

for (let i = 0; i < numberOfStrips; i++) {
  const strip = new THREE.Mesh(stripGeometry, stripMaterial);
  strip.rotation.x = -Math.PI / 2;
  strip.position.set(0, 0.01, i * stripSpacing - 500);
  scene.add(strip);
}

// Create trees
const treeGeometry = new THREE.ConeGeometry(2, 5, 8);
const treeMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2);
const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });

function createTree(x, z) {
  const treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
  treeTop.position.set(x, 2.5, z);
  scene.add(treeTop);

  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, -1, z);
  scene.add(trunk);
}

// Add trees on both sides of the road
for (let i = 0; i < 20; i++) {
  createTree(-20, i * 50 - 500);
  createTree(20, i * 50 - 480);
}

// Create car (cube)
const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
const carMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(0, 0.25, 0);
scene.add(car);

// Add lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

camera.position.set(0, 2, -5);
camera.lookAt(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Car movement controls
const speed = 0.1;
let targetSpeed = 0;
const acceleration = 0.01;
const deceleration = 0.005;

// Create forward and backward buttons
const forwardButton = document.createElement('button');
forwardButton.textContent = '▲';
forwardButton.style.position = 'absolute';
forwardButton.style.bottom = '60px';
forwardButton.style.left = '50%';
forwardButton.style.transform = 'translateX(-50%)';
forwardButton.style.backgroundColor = 'blue';
forwardButton.style.color = 'white';
forwardButton.style.borderRadius = '16px';
forwardButton.style.padding = '10px 20px';
forwardButton.style.border = 'none';
forwardButton.style.marginBottom = '10px';
document.body.appendChild(forwardButton);

const backwardButton = document.createElement('button');
backwardButton.textContent = '▼';
backwardButton.style.position = 'absolute';
backwardButton.style.bottom = '20px';
backwardButton.style.left = '50%';
backwardButton.style.transform = 'translateX(-50%)';
backwardButton.style.backgroundColor = 'blue';
backwardButton.style.color = 'white';
backwardButton.style.borderRadius = '16px';
backwardButton.style.padding = '10px 20px';
backwardButton.style.border = 'none';
document.body.appendChild(backwardButton);

// Mouse wheel event listener for car movement
document.addEventListener('wheel', (event) => {
  if (event.deltaY < 0) {
    // Scroll up, increase target speed forward
    targetSpeed = speed;
  } else if (event.deltaY > 0) {
    // Scroll down, increase target speed backward
    targetSpeed = -speed;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    // Arrow up, increase target speed forward
    targetSpeed = speed;
  } else if (event.key === 'ArrowDown') {
    // Arrow down, increase target speed backward
    targetSpeed = -speed;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    // Key released, start decelerating
    targetSpeed = 0;
  }
});

// Button event listeners for both mouse and touch events
forwardButton.addEventListener('mousedown', () => {
  targetSpeed = speed;
});

backwardButton.addEventListener('mousedown', () => {
  targetSpeed = -speed;
});

forwardButton.addEventListener('mouseup', () => {
  targetSpeed = 0;
});

backwardButton.addEventListener('mouseup', () => {
  targetSpeed = 0;
});

// Add touch event listeners
forwardButton.addEventListener('touchstart', (e) => {
  e.preventDefault();
  targetSpeed = speed;
});

backwardButton.addEventListener('touchstart', (e) => {
  e.preventDefault();
  targetSpeed = -speed;
});

forwardButton.addEventListener('touchend', (e) => {
  e.preventDefault();
  targetSpeed = 0;
});

backwardButton.addEventListener('touchend', (e) => {
  e.preventDefault();
  targetSpeed = 0;
});

function animate() {
  requestAnimationFrame(animate);
  
  // Smooth acceleration and deceleration
  if (car.userData.currentSpeed < targetSpeed) {
    car.userData.currentSpeed = Math.min(car.userData.currentSpeed + acceleration, targetSpeed);
  } else if (car.userData.currentSpeed > targetSpeed) {
    car.userData.currentSpeed = Math.max(car.userData.currentSpeed - deceleration, targetSpeed);
  }
  
  // Move car
  car.position.z += car.userData.currentSpeed;
  
  // Update camera position to follow the car
  camera.position.z = car.position.z - 5;
  camera.lookAt(car.position);
  
  // Ensure the road, land, and objects move with the car to create the illusion of continuous movement
  if (car.position.z > road.position.z + 500) {
    road.position.z += 1000;
    leftLand.position.z += 1000;
    rightLand.position.z += 1000;
    scene.children.forEach(child => {
      if (child instanceof THREE.Mesh && 
         (child.geometry === stripGeometry || 
          child.geometry === treeGeometry || 
          child.geometry === trunkGeometry)) {
        child.position.z += 1000;
      }
    });
  } else if (car.position.z < road.position.z - 500) {
    road.position.z -= 1000;
    leftLand.position.z -= 1000;
    rightLand.position.z -= 1000;
    scene.children.forEach(child => {
      if (child instanceof THREE.Mesh && 
         (child.geometry === stripGeometry || 
          child.geometry === treeGeometry || 
          child.geometry === trunkGeometry)) {
        child.position.z -= 1000;
      }
    });
  }
  
  renderer.render(scene, camera);
}

// Initialize car's current speed
car.userData.currentSpeed = 0;

animate();
