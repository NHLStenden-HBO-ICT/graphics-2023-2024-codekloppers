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
        this.startScene();
    }

    async startScene() {
        await this.render();
        this.animate();

        this.sceneController.hideLoader();
    }

    /**
     * The render function creates the 3d objects in the scene.
     */
    async render() {
        // Build the metro stations
        const station = new Station(new THREE.Vector3(0,0,0));
        await station.render(this.sceneController.scene);
        await station.clone(this.sceneController.scene, new Station(new THREE.Vector3(-700,0,0)));
        await station.clone(this.sceneController.scene, new Station(new THREE.Vector3(-1200,0,0)));

        // Build the metro cars
        this.metro1 = new Metro(new THREE.Vector3(-5,-1,0));
        await this.metro1.render(this.sceneController.scene);
        this.metro12 = await this.metro1.clone(this.sceneController.scene, new Metro(new THREE.Vector3(-5,-1,0), [0, 3.1415926536, 0]));
        this.metro2 = await this.metro1.clone(this.sceneController.scene, new Metro(new THREE.Vector3(-5,-1,-6.8)));
        this.metro21 = await this.metro1.clone(this.sceneController.scene, new Metro(new THREE.Vector3(-5,-1,-6.8), [0, 3.1415926536, 0]));
        this.metro1.openDoors();
        this.metro12.openDoors();
        this.metro2.openDoors();
        this.metro21.openDoors();

        // Build the metro tunnels
        const tunnel = new Tunnel(new THREE.Vector3(0,0,0));
        await tunnel.render(this.sceneController.scene);
        await tunnel.clone(this.sceneController.scene, new Tunnel(new THREE.Vector3(100,0,0)));
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