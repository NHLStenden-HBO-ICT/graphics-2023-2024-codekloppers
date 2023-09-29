import * as THREE from "three";
import { Station } from './3dModels/Station';
import { Metro } from './3dModels/Metro';
import { SceneController } from "./Controllers/SceneController";

export class Scene {
    sceneController = new SceneController();

    constructor() {
        this.render();
        this.animate();
    }

    // Builds the scene
    render() {
        // Build the first station
        const station = new Station(new THREE.Vector3(0,0,0), "Alexanderplatz");
        station.render(this.sceneController.scene);

        // create new metro object and add to scene with render function
        const metro1 = new Metro(new THREE.Vector3(-5,-1,0));
        metro1.render(this.sceneController.scene);

        // create second object and add to scene with render function
        const metro2 = new Metro(new THREE.Vector3(-5,-1,-6.8));
        metro2.render(this.sceneController.scene);
    }

    /**
     * The function "animate" is used to continuously update and render a 3D scene using the
     * requestAnimationFrame method.
     */
    animate() {
        const method = this.animate.bind(this);
        requestAnimationFrame(method);
        
        // Updates for models of scene
        this.sceneController.renderer.render(this.sceneController.scene, this.sceneController.camera);
    }
}