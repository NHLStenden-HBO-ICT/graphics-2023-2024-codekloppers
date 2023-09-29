import * as THREE from "three";
import { Station } from './3dModels/Station';
import { Metro } from './3dModels/Metro';
import { Tunnel } from './3dModels/Tunnel';
import { SceneController } from "./Controllers/SceneController";

export class Scene {
    sceneController = new SceneController();
    metro1;
    metro12;
    metro2;
    metro21;

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
        this.metro1 = new Metro(new THREE.Vector3(-5,-1,0));
        this.metro1.render(this.sceneController.scene).then(() => {
            this.metro12 = this.metro1.clone(this.sceneController.scene, undefined, undefined, 3.1415926536);
        }).then(() => {
            this.metro2 = this.metro1.clone(this.sceneController.scene, new THREE.Vector3(-5,-1,-6.8));
        }).then(() => {
            this.metro21 = this.metro1.clone(this.sceneController.scene, new THREE.Vector3(-5,-1,-6.8, undefined, 3.1415926536));
            this.metro1.openDoors();
            this.metro12.openDoors();
            this.metro2.openDoors();
            this.metro21.openDoors();
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

        if(this.metro1.mixer) {
            this.metro1.mixer.update(0.003);
        }

        if(this.metro12.mixer) {
            this.metro12.mixer.update(0.003);
        }

        if(this.metro2.mixer) {
            this.metro2.mixer.update(0.003);
        }

        if(this.metro21.mixer) {
            this.metro21.mixer.update(0.003);
        }

        // Updates for objects of scene
        this.sceneController.renderer.render(this.sceneController.scene, this.sceneController.camera);
    }
}