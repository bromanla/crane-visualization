import * as THREE from './libs/three.js'
import { OrbitControls } from './libs/orbitControls.js'
import * as TWEEN from './libs/tween.js'

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
controls.minDistance = 1
// Плавная прокрутка
// controls.enableDamping = true
controls.update()

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

// Отрисовка устройства
const mat = new THREE.MeshBasicMaterial({color:'#9D9D9D'});

const mainHandGeometry = new THREE.BoxGeometry(2, 0.3, 0.3);
const mainMesh = new THREE.Mesh(mainHandGeometry, mat);

const midHandGeometry = new THREE.BoxGeometry(2, 0.3, 0.3);
const midMesh = new THREE.Mesh(midHandGeometry, mat);

const lastHandGeometry = new THREE.BoxGeometry(2, 0.3, 0.3);
const lastMesh = new THREE.Mesh(lastHandGeometry, mat);

mainHandGeometry.translate(1, 0, 0)
mainMesh.rotateZ(degToRad(90))

midHandGeometry.translate(1, 0, 0)
midMesh.position.set(2, 0, 0);
mainMesh.add(midMesh)

lastHandGeometry.translate(1, 0, 0)
lastMesh.position.set(2, 0, 0)
midMesh.add(lastMesh)

scene.add(mainMesh)

// Массив активных анимаций
let animationTmp = []

function smoothMovement (meshs) {
  animationTmp.forEach(anim => anim.stop())
  animationTmp = [];

  meshs.forEach(({mesh, deg}) => {
    const amimations = new TWEEN.Tween({ deg: radToDeg(mesh.rotation.z) })
      .to({ deg }, 200 )

    const update = (el) => mesh.rotation.z = degToRad(el.deg);
    amimations.onUpdate(update)
    amimations.start()
    animationTmp.push(amimations)
  })
}

// Взамодействие с сервером
const socket = new WebSocket('ws://localhost:8080');

socket.onmessage = (e) => {
  const { event, data } = JSON.parse(e.data)

  if (event === 'ok') {
    const [main, mid, last] = data

    smoothMovement([
      { mesh: mainMesh, deg: main },
      { mesh: midMesh, deg: mid },
      { mesh: lastMesh, deg: last }
    ]);
  }

  if (event === 'close') {
    console.log('close')
  }
}

const animate = () => {
  TWEEN.update();
  requestAnimationFrame(animate);
  controls.update()
  renderer.render(scene, camera);
};

animate();
