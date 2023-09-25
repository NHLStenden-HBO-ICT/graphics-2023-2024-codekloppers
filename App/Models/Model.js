import * as THREE from "three";

class Model {
    constructor() {
        /*Ja dit is helaas hoe dat werkt in Javascript*/
        if (this.constructor === Model) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    // Functie om het object recht vooruit te laten bewegen
    moveModel(objectName, x, y, z, duration) {

        var object = objects[objectName];

        if (object) { // Controleer of het object is geladen
            var startPosition = object.position.clone(); // Huidige positie van het object
            var endPosition = new THREE.Vector3(x, y, z); // Eindpositie waarheen het object moet bewegen

            // TweenMax-animatie om de positie van het object te veranderen
            var animation = TweenMax.to(object.position, duration, {
                x: endPosition.x,
                y: endPosition.y,
                z: endPosition.z,
                ease: Power1.easeInOut, // Easing-functie voor de animatie (kan worden aangepast)
                onUpdate: function () {
                    // Hier kun je extra acties uitvoeren tijdens de animatie-update, indien nodig
                },
                onComplete: function () {
                    // Hier kun je acties uitvoeren wanneer de animatie is voltooid
                }
            });

            //   animation.play();
        } else {
            console.error("Object is nog niet geladen."); // Object is nog niet geladen
        }
    }

    loadObject(filePath, x, y, z, rotation) {

        var loader = new THREE.GLTFLoader();
        loader.crossOrigin = true;

        loader.load(filePath, function (data) {
            let object = data.scene; // Wijs de geladen scène toe aan de objectvariabele

            const animations = data.animations;
            mixer = new THREE.AnimationMixer(object);

            window.addEventListener(
                "keydown",
                (event) => {

                    switch (event.key) {
                        case "e":
                            // console.log(objects);
                            // Open deuren aan de rechterkant
                            openDoors_right(animations);
                            break;
                        case "r":
                            closeDoors_right(animations);
                            break;
                        case "l":
                            moveObject(0, x = 345, y = 0, z = 0, 10);
                            break;
                        case "k":
                            moveObject(0, x = 0, y = 0, z = 0, 10);
                            break;
                    }
                });

            object.rotation.x = rotation;
            object.position.set(x, y, z);
            object.position.y = y;

            objects[objectName] = object;
            objectName++;
            return scene.add(object);
        });
    }

}