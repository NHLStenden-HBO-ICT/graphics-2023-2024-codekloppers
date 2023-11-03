import { SceneController } from "./Controllers/SceneController";
import { Route } from "./Route";

// Define the Scene class
export class Scene {
    // Private variables for the Scene class
    #sceneController;
    #routeU5;
    #routeU6;
    #pixelRatio;

    // Constructor for the Scene class, initializes the scene when the start button is clicked
    constructor() {
        // Add an event listener to the start button that calls the onStartButtonClicked method
        document.getElementById("startButton").addEventListener("click", () => this.onStartButtonClicked());
    }

    // Method called when the start button is clicked
    onStartButtonClicked() {
        // Hide the loading indicator and display the 3D scene
        document.getElementById("indicator").style.display = "block";
        document.getElementById("controlBox").style.display = "none";
        // Get quality and antialiasing values from input fields
        const quality = document.getElementById('qualityInput').value;
        const antialiasing = document.getElementById('antialiasingInput').value;
        // Start the scene with the specified quality and antialiasing settings
        this.startScene(quality, antialiasing);
    }

    // Method called when the loading of the scene is completed
    loadingDone() {
        // Hide the loading indicator and display the 3D scene
        document.getElementById('loader').style.display = 'none';
        document.getElementById('sceneCanvas').style.display = 'block';
    }

    // Method to start the 3D scene with specified pixel ratio and antialiasing settings
    async startScene(pixelRatio, antialiasing) {
        // Initialize the SceneController with the specified settings
        this.#sceneController = new SceneController(pixelRatio, antialiasing);
        // Render the scene and start the animation
        await this.render();
        this.animate();
        // Indicate that the loading of the scene is completed
        this.loadingDone();
    }

    /**
     * The render function creates the 3D objects in the scene.
     */
    async render() {
        /*Define routes*/
        // Create the route for the U5 metro line
        this.#routeU5 = new Route(this.#sceneController, 'U5');
        // Create the route for the U6 metro line
        // this.#routeU6 = new Route(this.#sceneController, 'U6');

        /*Render routes*/
        // Render the U5 metro line
        await this.#routeU5.render()
        // Render the U6 metro line
        // await this.#routeU6.render()
    }

    /**
     * The function "animate" is used to continuously update and render a 3D scene using the
     * requestAnimationFrame method.
     */
    animate() {
        // Request the next animation frame and call the current method again for continuous animation
        requestAnimationFrame(this.animate.bind(this));

        // Animate the metros on the U5 metro line
        this.#routeU5.animateMetros()
        // Animate the metros on the U6 metro line
        // this.#routeU6.animateMetros()

        // Update the world matrix of the camera
        this.#sceneController.getCamera().updateMatrixWorld();

        // Make the user walk in the scene
        this.#sceneController.getUser().walk();
        // Check for camera collisions
        this.#sceneController.getCollision().checkCameraCollision();

        // Render the objects in the scene using the renderer
        this.#sceneController.getRenderer().render(this.#sceneController.getScene(), this.#sceneController.getCamera());
    }
}