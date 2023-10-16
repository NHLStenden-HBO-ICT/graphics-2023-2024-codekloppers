import { SceneController } from "./Controllers/SceneController";
import {Route} from "./Route";
import {Tunnel} from "./3dModels/Tunnel";
import * as THREE from "three";


export class Scene {
    sceneController = new SceneController();
    routeU5;
    routeU6;

    constructor() {
        this.startScene();
    }

    async startScene() {
        await this.render();
        this.animate();
        this.sceneController.hideLoader();
        this.sceneController.user.walk(this.sceneController);
    }

    /**
     * The render function creates the 3d objects in the scene.
     */
    async render() {
        /*Define routes*/
        this.routeU5 = new Route(this.sceneController, 'U5');
        // this.routeU6 = new Route(this.sceneController, 'U6');


        /*Render routes*/
        await this.routeU5.render()
        // await this.routeU6.render()
    }

    /**
     * The function "animate" is used to continuously update and render a 3D scene using the
     * requestAnimationFrame method.
     */
    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Animeer de metros
        this.routeU5.animateMetros()
        // this.routeU6.animateMetros()

        // Update de camera matrix wereld
        this.sceneController.camera.updateMatrixWorld();

        // Beweeg de camera op basis van toetsenbordinvoer
        this.sceneController.camera.position.x += (this.sceneController.user.cameraPosition.x - this.sceneController.camera.position.x) * 0.1;
        this.sceneController.camera.position.z += (this.sceneController.user.cameraPosition.z - this.sceneController.camera.position.z) * 0.1;

        // Updates for objects of scene
        this.sceneController.renderer.render(this.sceneController.scene, this.sceneController.camera);

        // Check for camera collision
        this.sceneController.checkCameraCollision();

        // console.log(this.sceneController.renderer.info.render);
    }
}