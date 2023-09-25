import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';


let SceneController = new SceneController();

SceneController.startScene();
function renderScene() {
    renderer.render(scene, camera);
}

renderCalls.push(renderScene);
renderCalls.push(function () {
    controls.update()
});

var mixer; // Declareer de mixer-variabele buiten de loader-callback
var object; // Declareer de object-variabele buiten de loader-callback

function update() {
    // Controleer of de mixer is gedefinieerd voordat deze wordt bijgewerkt
    if (mixer) {
        mixer.update(0.003);
    }
}

renderCalls.push(update);