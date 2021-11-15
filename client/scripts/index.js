import * as THREE from './three.js'
import { OrbitControls } from './orbitControls.js'
import { GLTFLoader } from './GLTFLoader.js'

// Инициализируем Three JS
const threeContainer = document.querySelector('#three')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, threeContainer.offsetWidth / threeContainer.offsetHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(threeContainer.offsetWidth, threeContainer.offsetHeight);

threeContainer.appendChild(renderer.domElement)

camera.position.set(10, 10, 10)

// Контроллер передвижения
const controls = new OrbitControls(camera, renderer.domElement);
controls.update()
// Плавная прокрутка
// controls.enableDamping = true
controls.minDistance = 1

// Перерисовка canvas при изменении ширины окна
window.addEventListener('resize', () => {
  camera.aspect = threeContainer.offsetWidth / threeContainer.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(threeContainer.offsetWidth, threeContainer.offsetHeight)
})

// Отрисовка пола
const plane = new THREE.GridHelper(15, 10);
scene.add(plane);

// Загрузка модели
// const loader = new GLTFLoader()

// loader.load('../shiba/scene.gltf', (gltf) => {
//   gltf.scene.position.set(0, 1.005, 0)
//   console.log(gltf.scene)
//   scene.add(gltf.scene);
// })

const animate = function () {
  requestAnimationFrame(animate);
  controls.update()
  renderer.render(scene, camera);
};

animate();
