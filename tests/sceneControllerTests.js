// collisionTests.js
import { expect, test } from 'vitest';
import { CheckCameraCollision } from '../classes/Actions/CheckCameraCollision';
import * as THREE from 'three';
import { Scene } from '../classes/Scene.js';



/* test one */

test('check if camera is spawned when is set to false on initial load', () => {
  // make mock instance of camera and define properties
  const mockCamera = {
    position: new THREE.Vector3(1, 2, 3),
  };

  // make mock instance of scene controller and define properties
  const mockSceneController = {
    getCamera: () => mockCamera,
    getScene: new THREE.Scene(),
    getBoundingBoxes: [/* mock bounding boxes here */],
    getCameraSpawned: false
  };

  // check if cameraSpawned property equals to false
  expect(mockSceneController.getCameraSpawned).toEqual(false);
});


/* test two */

test('check if boundingbox can be filled with boundingboxdata', () => {
    // make mock instance of camera and define properties
    const mockCamera = {
      position: new THREE.Vector3(1, 2, 3),
    };

    // make mock instance of scene controller and define properties
    const mockSceneController = {
      getCamera: () => mockCamera,
      getScene: () => new THREE.Scene(),
      boundingBoxes: [],
      getCameraSpawned: false
    };

    // push value into boundingbox array
    mockSceneController.boundingBoxes.push(new THREE.Vector3(0,1,2));

    // check if first index in array equals to given vector
    expect(mockSceneController.boundingBoxes[0]).toEqual(new THREE.Vector3(0,1,2));
});


/* test three */

test('check if camera can collide with bounding box', () => {
    // make mock instance of camera and define properties
    const mockCamera = {
      position: new THREE.Vector3(1, 2, 3),
    };

    const boundingBox = {
            scene: new THREE.Scene(), // scene
            geometry: new THREE.Vector3(11, 3, 0.5), // geometry
            position: new THREE.Vector3(11, 4.2, 14), //  position
            rotationX: (Math.PI / 2), // rotation on x axis
            rotationZ: 0, // rotation on z axis
            rotationY: - 38.40, // rotation on y axis
            name: 'rightStair' // id
    }

    console.log(boundingBox);

    // make mock instance of scene controller and define properties
    const mockSceneController = {
      getCamera: () => mockCamera,
      getScene: () => new THREE.Scene(),
      boundingBoxes: [],
      getCameraSpawned: false
    };

    // push value into boundingbox array
    mockSceneController.boundingBoxes.push(new THREE.Vector3(0,1,2));

    // check if first index in array equals to given vector
    expect(mockSceneController.boundingBoxes[0]).toEqual(new THREE.Vector3(0,1,2));
});



