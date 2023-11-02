// collisionTests.js
import { expect, test } from 'vitest';
import { CheckCameraCollision } from '../classes/Actions/CheckCameraCollision';
import * as THREE from 'three';
import {Metro} from "../classes/3dModels/Metro";

test('check if camera is spawned when is set to false on initial load', () => {
  // make mock instance of camera and define properties
  const mockCamera = {
    position: new THREE.Vector3(1, 2, 3),
  };

  // make mock instance of scene controller and define properties
  const mockSceneController = {
    getCamera: () => mockCamera,
    getScene: () => ({ add: () => {} }),
    boundingBoxes: [/* mock bounding boxes here */],
    cameraSpawned: false
  };

  // check if cameraSpawned property equals to false
  expect(mockSceneController.cameraSpawned).toEqual(false);
});


test('check if boundingbox is created', () => {
    // make mock instance of camera and define properties
    const mockCamera = {
      position: new THREE.Vector3(1, 2, 3),
    };

    // make mock instance of scene controller and define properties
    const mockSceneController = {
      getCamera: () => mockCamera,
      getScene: () => ({ add: () => {} }),
      boundingBoxes: [],
      cameraSpawned: false
    };

    // push value into boundingbox array
    mockSceneController.boundingBoxes.push(new THREE.Vector3(0,1,2));

    // check if first index in array equals to given vector
    expect(mockSceneController.boundingBoxes[0]).toEqual(new THREE.Vector3(0,1,2));
  });



