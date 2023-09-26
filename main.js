// import libraries and classes to use in code
import { Metro } from './classes/Metro';
import { Station } from './classes/Station';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// need to call to create and append scene to canvas
var scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add controls with orbit control
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update();


// create new metro object and add to scene with render function
var metro = new Metro();
metro.render(scene);


/**
 * The function "animate" is used to continuously update and render a 3D scene using the
 * requestAnimationFrame method.
 */
function animate() {
  requestAnimationFrame(animate);
  // Voeg hier updates voor je model of scène toe
  renderer.render(scene, camera);
}

animate();


