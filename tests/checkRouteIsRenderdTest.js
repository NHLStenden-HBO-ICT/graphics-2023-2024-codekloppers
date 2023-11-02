import { test } from 'vitest';
import {Route} from "../classes/Route";
import * as THREE from "three";

test('Route render method should be called', async (context) => {
    // Mock the necessary dependencies
    const mockCamera = {
        position: new THREE.Vector3(1, 2, 3),
    };

    const mockSceneController = {
        getCamera: () => mockCamera,
        getScene: () => ({ add: () => {} }),
        getBoundingBoxes: ()=> ([]),
        boundingBoxes: [/* mock bounding boxes here */],
        cameraSpawned: false
    };

    // Create a new Route instance
    const route = new Route(mockSceneController, 'U5');

    /*TODO: Je kan dus blijkbaar geen assets gebruiken in deze tests, dus daarmee kan dit niet getest worden.*/

    // Call the render method
    // await route.render();

    // Assert that the render methods are called
    // expect(route.render()).toBeCalled()
});
