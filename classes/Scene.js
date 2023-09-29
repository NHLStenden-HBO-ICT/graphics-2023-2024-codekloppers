import * as THREE from "three";
import { Station } from './3dModels/Station';
import { Metro } from './3dModels/Metro';
import { Tunnel } from './3dModels/Tunnel';
import { SceneController } from "./Controllers/SceneController";

export class Scene {
    sceneController = new SceneController();

    constructor() {
        this.render();
        this.animate();
    }

    /**
     * The render function creates the 3d objects in the scene.
     */
    render() {
        // Build the metro stations
        const station = new Station(new THREE.Vector3(0,0,0), "Alexanderplatz");
        station.render(this.sceneController.scene).then(() => {
            station.clone(this.sceneController.scene, new THREE.Vector3(-700,0,0));
        }).then(() => {
            station.clone(this.sceneController.scene, new THREE.Vector3(-1200,0,0));
        });

        // Build the metro cars
        const metro = new Metro(new THREE.Vector3(-5,-1,0));
        metro.renderFull(this.sceneController.scene).then(() => {
            metro.cloneFull(this.sceneController.scene, new THREE.Vector3(-5,-1,-6.8));
        });

        // Build the metro tunnels
        const tunnel = new Tunnel(new THREE.Vector3(0,0,0));
        tunnel.render(this.sceneController.scene).then(() => {
            tunnel.clone(this.sceneController.scene, new THREE.Vector3(100,0,0));
        });
    }

    /**
     * The function "animate" is used to continuously update and render a 3D scene using the
     * requestAnimationFrame method.
     */
    animate() {
        const method = this.animate.bind(this);
        requestAnimationFrame(method);
        
        // Updates for objects of scene
        this.sceneController.renderer.render(this.sceneController.scene, this.sceneController.camera);
    }
}