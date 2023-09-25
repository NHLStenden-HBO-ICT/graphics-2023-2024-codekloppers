import * as THREE from "three";

class MetroModel extends Model {
    constructor() {
        super();

    }

    load() {

        var loader = new THREE.GLTFLoader();
        loader.crossOrigin = true;

        loader.load(this.filePath, function (data) {
            let object = data.scene; // Wijs de geladen scène toe aan de objectvariabele

            const animations = data.animations;
            mixer = new THREE.AnimationMixer(object);

            // window.addEventListener(
            //     "keydown",
            //     (event) => {
            //
            //         switch (event.key) {
            //             case "e":
            //                 // console.log(objects);
            //                 // Open deuren aan de rechterkant
            //                 openDoors_right(animations);
            //                 break;
            //             case "r":
            //                 closeDoors_right(animations);
            //                 break;
            //             case "l":
            //                 moveObject(0, x = 345, y = 0, z = 0, 10);
            //                 break;
            //             case "k":
            //                 moveObject(0, x = 0, y = 0, z = 0, 10);
            //                 break;
            //         }
            //     });

            object.rotation.x = this.rotation;
            object.position.set(this.xCoordinate, this.yCoordinate, this.zCoordinate);
            object.position.y = y;

            objects[objectName] = object;
            objectName++;
            return scene.add(object);
        });
    }
    openDoors_right(animations) {

        for (var i = 0; i < animations.length; i++) {
            var action = mixer.clipAction(animations[i], objects[0]);
            action.paused = false; // Hervat de animatie

            // Zorg ervoor dat de animatie in de juiste richting wordt afgespeeld (voorwaarts)
            action.timeScale = 1;
            action.setLoop(THREE.LoopOnce); // Bijvoorbeeld: speel de animatie slechts één keer
            action.clampWhenFinished = true; // Houd de animatie op het laatste frame wanneer deze is voltooid

            // Als de actie eindigt (completed) of als deze nog niet is gestart (uninitialized),
            // dan start de actie opnieuw.
            if (action._clip.tracks.length === 0 || action._clip.tracks[0].times[0] === 0) {
                action.reset();
            }
            action.play();
        }
    }

    closeDoors_right(animations) {

        for (var i = 0; i < animations.length; i++) {
            var action = mixer.clipAction(animations[i], objects[0]);
            action.paused = false; // Hervat de animatie

            // Speel de animatie in omgekeerde richting af door timeScale in te stellen op -1
            action.timeScale = -1;
            action.clampWhenFinished = true; // Houd de animatie op het laatste frame wanneer deze is voltooid
            action.setLoop(THREE.LoopOnce); // Bijvoorbeeld: speel de animatie slechts één keer
            // Voeg de actie toe aan de mixer
            action.play();
        }
    }
}