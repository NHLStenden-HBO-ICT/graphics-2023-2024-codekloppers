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
        const method = this.animate.bind(this);
        requestAnimationFrame(method);
        this.routeU5.animateMetros()
        // this.routeU6.animateMetros()

        // Updates for objects of scene
        this.sceneController.renderer.render(this.sceneController.scene, this.sceneController.camera);
    }
}