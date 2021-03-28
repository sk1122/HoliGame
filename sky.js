import * as THREE from './node_modules/three/src/Three.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";


let scene, camera, renderer, skyboxGeo, skybox, controls;
let skyboxImage = "skybox/Daylight_Box";
var dir = new THREE.Vector3();
var speed = 100.0;

function createPathStrings(filename) {
  const basePath = "";
  const baseFilename = basePath + filename;
  const fileType = ".bmp";
  const sides = ["Front", "Back", "Top", "Bottom", "Right", "Left"];
  const pathStings = sides.map(side => {
    return baseFilename + "_" + side + fileType;
  });

  return pathStings;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

const init = () => {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
	camera.position.set(100, -299, 100);
	camera.lookAt( new THREE.Vector3( 0, -299, 0 ) );

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.id = "canvas";
	document.body.appendChild(renderer.domElement);

	controls = new OrbitControls(camera, renderer.domElement);
	controls.enabled = true;
	controls.minDistance = 700;
	controls.maxDistance = 1500;

	const materialArray = createMaterialArray(skyboxImage);
	skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
	skybox = new THREE.Mesh(skyboxGeo, materialArray);
	scene.add(skybox);

	window.addEventListener('resize', onWindowResize, false);

	animate();
}

const moveForward = () => {
	let keycode = event.keyCode;
	let delta = 200;
	switch(keycode){
		case 37 : //left arrow 
			camera.position.x = camera.position.x - delta;
			camera.updateProjectionMatrix();
			break;
		case 38 : // up arrow 
			camera.position.z = camera.position.z - delta;
			camera.updateProjectionMatrix();
			break;
		case 39 : // right arrow 
			camera.position.x = camera.position.x + delta;
			camera.updateProjectionMatrix();
			break;
		case 40 : // down arrow
			camera.position.z = camera.position.z + delta;
			camera.updateProjectionMatrix();
			break;
	}
}

const createMaterialArray = (filename) => {
	var skyboxImagePaths = createPathStrings(filename);
	console.log(skyboxImagePaths);
	for(let i=0;i<skyboxImagePaths.length;i++) {
		if(skyboxImagePaths[i] == 'Daylight_Box_Bottom.bmp') {
			skyboxImagePaths[i] = 'Solid_green.png';
			break;
		}
	}
	const materialArray = skyboxImagePaths.map(image => {
		let texture = new THREE.TextureLoader().load(image);
		return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
	});
	return materialArray;
}

const animate = () => {

	controls.update();

	window.addEventListener('keydown', moveForward, false );

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

init();