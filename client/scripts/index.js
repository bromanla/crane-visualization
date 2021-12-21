import * as THREE from './three.js'
import { OrbitControls } from './orbitControls.js'
import { GLTFLoader } from './GLTFLoader.js'
import * as TWEEN from './tween.esm.js'

console.log(TWEEN)

// Инициализируем Three JS
const threeContainer = document.querySelector('#three')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, threeContainer.offsetWidth / threeContainer.offsetHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

renderer.setSize(threeContainer.offsetWidth, threeContainer.offsetHeight)
threeContainer.appendChild(renderer.domElement)
camera.position.set(10, 10, 10)

// Контроллер передвижения
const controls = new OrbitControls(camera, renderer.domElement)
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

const degToRad = (deg) => deg * Math.PI / 180
const radToDeg = (rad) => rad * 180 / Math.PI

const mat = new THREE.MeshBasicMaterial({color:'#ff0000'});

const mainHandGeometry = new THREE.BoxGeometry(2, 0.3, 0.3);
const mainMesh = new THREE.Mesh(mainHandGeometry, mat);

const midHandGeometry = new THREE.BoxGeometry(2, 0.3, 0.3);
const midMesh = new THREE.Mesh(midHandGeometry, mat);

const lastHandGeometry = new THREE.BoxGeometry(2, 0.3, 0.3);
const lastMesh = new THREE.Mesh(lastHandGeometry, mat);

mainHandGeometry.translate(1, 0, 0)
mainMesh.rotateZ(degToRad(90))

midHandGeometry.translate(1, 0, 0)
midMesh.position.set(2.05, 0, 0);
mainMesh.add(midMesh)

lastHandGeometry.translate(1, 0, 0)
lastMesh.position.set(2.05, 0, 0)
midMesh.add(lastMesh)

scene.add(mainMesh)

function smoothMovement (mesh, current) {
  const amimations = new TWEEN.Tween({ deg: radToDeg(mesh.rotation.z) })
    .to({ deg: current }, 200 )
    .easing(TWEEN.Easing.Quadratic.InOut)

  const update = (el) => mesh.rotation.z = degToRad(el.deg);
  amimations.onUpdate(update)
  amimations.start()
}

// const anim1 = new TWEEN.Tween({ rotZ: 0})
//   .to({ rotZ: degToRad(180) }, 100)
//   .easing(TWEEN.Easing.Quadratic.InOut)

// const updateAnum = function (object, elapsed) {
//   mainMesh.rotation.z = object.rotZ;
// }

// anim1.onUpdate(updateAnum)
// anim1.start()

let socket = new WebSocket('ws://localhost:8080');
socket.onmessage = (e) => {
  const [main, mid, last] = JSON.parse(e.data)

  smoothMovement(mainMesh, main);
  smoothMovement(midMesh, mid)
  smoothMovement(lastMesh, last)

  // console.log(main, mid, last)

  // smoothMovement(mainMesh.rotation.z, main)

  // mainMesh.rotation.z = degToRad(main);
  // midMesh.rotation.z = degToRad(mid);
  // lastMesh.rotation.z = degToRad(last);

  // [tmpMain, tmpMid, tmpLast] = [main, mid, last];
}

const animate = () => {
  TWEEN.update();
  requestAnimationFrame(animate);
  controls.update()
  renderer.render(scene, camera);
};

animate();
