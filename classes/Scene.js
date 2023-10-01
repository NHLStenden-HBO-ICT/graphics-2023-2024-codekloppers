import { SceneController } from "./Controllers/SceneController";
import {Route} from "./Route";

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
        this.route = new Route(this.sceneController);
        await this.route.render()

        // Build the metro tunnels
        // const tunnel = new Tunnel(new THREE.Vector3(34,0,-3.4));
        // await tunnel.render(this.sceneController.scene);
        // await tunnel.clone(this.sceneController.scene, new Tunnel(new THREE.Vector3(44,0,-3.4)));
        // await tunnel.clone(this.sceneController.scene, new Tunnel(new THREE.Vector3(-64,0,-3.4)));
        // await tunnel.clone(this.sceneController.scene, new Tunnel(new THREE.Vector3(-74,0,-3.4)));
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