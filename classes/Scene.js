import {SceneController} from "./Controllers/SceneController";
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
        this.sceneController.loadingDone();
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

        /* This code block checks if the camera has been spawned in the scene. If the camera has not been
        spawned, it sets the position of the camera to (0, 2, 5). This is likely the initial position of the
        camera before it starts moving or animating. */
        // if (!this.sceneController.cameraSpawned) {
        //     this.sceneController.camera.position.set(0, 2, 5);
        // }

        requestAnimationFrame(this.animate.bind(this));

        // Animeer de metros
        this.routeU5.animateMetros()
        // this.routeU6.animateMetros()

        // Update de camera matrix wereld
        this.sceneController.camera.updateMatrixWorld();

        this.sceneController.user.walk();
        // Check for camera collision
        this.sceneController.collision.checkCameraCollision();

        // Updates for objects of scene
        this.sceneController.renderer.render(this.sceneController.scene, this.sceneController.camera);

    }
}