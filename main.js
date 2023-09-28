// import libraries and classes to use in code
import * as THREE from "three";
import { Station } from './classes/3dModels/Station';
import { Metro } from './classes/3dModels/Metro';
import { SceneController} from "./classes/Controllers/SceneController";

let sceneController = new SceneController();

// create new metro object and add to scene with render function
const metro = new Metro(new THREE.Vector3(-5,-1,0));
metro.render(sceneController.scene);

const station = new Station(new THREE.Vector3(0,0,0));
station.render(sceneController.scene);

/**
 * The function "animateScene" is used to continuously update and render a 3D scene using the
 * requestAnimationFrame method.
 */
function animate() {
  requestAnimationFrame(animate);
  // Voeg hier updates voor je model of scène toe
  sceneController.renderer.render(sceneController.scene, sceneController.camera);
}

animate();


