// Importeer de benodigde bibliotheken en klassen
import { test, expect } from 'vitest';
import * as THREE from 'three';
import { User } from './classes/User';

// Schrijf de tests voor de User-klasse
test('User', () => {
  // Test 1: Test voor het maken van een User-instantie
  test('should create a User instance', () => {
    let sceneController;
    let user;

    const setup = () => {
      sceneController = {
        getCamera: () => new THREE.PerspectiveCamera(),
        getScene: () => new THREE.Scene(),
      };
      user = new User(sceneController);
    };

    setup();
    expect(user).toBeInstanceOf(User);
  });


  // Test 2: Test voor de disableWalking- en enableWalking-methoden
  test('disableWalking and enableWalking methods should toggle walking state', () => {
    let sceneController;
    let user;

    const setup = () => {
      sceneController = {
        getCamera: () => new THREE.PerspectiveCamera(),
        getScene: () => new THREE.Scene(),
      };
      user = new User(sceneController);
    };

    setup();
    user.disableWalking();
    expect(user.get).toBe(true);
    user.enableWalking();
    expect(user.walkingDisabled).toBe(false);
  });

  // Test 3: Test voor de getPosition- en setPosition-methoden
  test('getPosition and setPosition methods should get and set user position', () => {
    let sceneController;
    let user;

    const setup = () => {
      sceneController = {
        getCamera: () => new THREE.PerspectiveCamera(),
        getScene: () => new THREE.Scene(),
      };
      user = new User(sceneController);
    };

    setup();
    const newPosition = new THREE.Vector3(1, 2, 3);
    user.setPosition(newPosition);
    expect(user.getPosition()).toEqual(newPosition);
  });
});