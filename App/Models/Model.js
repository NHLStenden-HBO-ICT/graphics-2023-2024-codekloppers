import * as THREE from "three";

class Model {
    filePath;
    xCoordinate;
    yCoordinate;
    zCoordinate;
    rotation;

    constructor() {
        /*Ja, dit is helaas hoe dat werkt in Javascript*/
        if (this.constructor === Model) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    // Functie om het object recht vooruit te laten bewegen
    move(objectName, x, y, z, duration) {

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

}