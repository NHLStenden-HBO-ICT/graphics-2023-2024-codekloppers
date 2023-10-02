import { SceneController } from "./Controllers/SceneController";
import {Route} from "./Route";
import {Tunnel} from "./3dModels/Tunnel";
import * as THREE from "three";


export class Scene {
    sceneController = new SceneController();
    route;

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
        this.route = new Route(this.sceneController);

        /*Render routes*/
        await this.route.render()
    }

    /**
     * The function "animate" is used to continuously update and render a 3D scene using the
     * requestAnimationFrame method.
     */
    animate() {
        const method = this.animate.bind(this);
        requestAnimationFrame(method);
        this.route.animateMetros()

        // Updates for objects of scene
        this.sceneController.renderer.render(this.sceneController.scene, this.sceneController.camera);
    }
}