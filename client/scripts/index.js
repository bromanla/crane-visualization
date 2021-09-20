import * as THREE from './three.js'
import { OrbitControls } from './orbitControls.js'
import { GLTFLoader } from './GLTFLoader.js'

const threeContainer = document.querySelector('#three')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, threeContainer.offsetWidth / threeContainer.offsetHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(threeContainer.offsetWidth, threeContainer.offsetHeight);

threeContainer.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: '#f5f5f5' });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.update()

window.addEventListener('resize', () => {
  camera.aspect = threeContainer.offsetWidth / threeContainer.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(threeContainer.offsetWidth, threeContainer.offsetHeight)
})

// const light = new THREE.AmbientLight('#FF0017');
// scene.add(light);

// let light2 = new THREE.PointLight('#FF0017');
// light2.position.set(0, 200, 200);
// scene.add(light2)

const animate = function () {
  requestAnimationFrame(animate);
  controls.update()
  renderer.render(scene, camera);
};

animate();
