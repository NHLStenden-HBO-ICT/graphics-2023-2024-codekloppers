import { test, expect } from 'vitest';
import * as THREE from 'three';
import { Station } from '/classes/3dModels/Station';

test('Station', () => {
  let sceneController;
  let station;

  const setup = () => {
    // Perform setup before each test, such as creating a scene controller
    sceneController = {
      getBoundingBoxes: () => [],
      getScene: () => new THREE.Scene(),
    };
    station = new Station(sceneController, new THREE.Vector3(0, 0, 0), 0);
  };

  test('should create a Station instance', () => {
    setup();

    // Expect that the station instance is successfully created
    expect(station).toBeInstanceOf(Station);
  });

  test('should set boundary boxes for the station', () => {
    setup();

    // Call the _setBoundaryBoxes method to set boundary boxes for the station
    station._setBoundaryBoxes();

    // Expect that boundary boxes are added to the scene controller
    expect(sceneController.getBoundingBoxes()).toHaveLength(8);
  });
});
