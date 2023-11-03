import * as THREE from "three";

export class SoundController {

    #listener;
    #audioLoader = new THREE.AudioLoader();

    constructor(listener) {
        this.listener = listener;
    }

    loadPositionalSound(pathToSoundFile, volume = 1, refDistance = 0.5, duration = undefined) {
        const sound = new THREE.PositionalAudio(this.listener);

        this.#audioLoader.load(pathToSoundFile, function (buffer) {
            sound.duration = duration;
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setRefDistance(refDistance)
            sound.setVolume(volume);
            sound.play()
        });

        return sound;
    }
}