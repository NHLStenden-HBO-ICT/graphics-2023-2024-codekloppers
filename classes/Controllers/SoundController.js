import * as THREE from "three";

/**
 * SoundController class manages positional audio in the scene.
 */
export class SoundController {

    #listener; // The audio listener to which the positional audio is attached
    #audioLoader = new THREE.AudioLoader(); // Three.js audio loader object for loading sound files

    /**
     * Constructor for the SoundController class.
     * @param {THREE.AudioListener} listener - The audio listener object representing the camera or player's ears.
     */
    constructor(listener) {
        this.#listener = listener;
    }

    /**
     * Loads and returns a positional sound based on the provided sound file path.
     * @param {string} pathToSoundFile - The file path to the sound file.
     * @param {number} [volume=1] - The volume of the positional sound (default is 1).
     * @param {number} [refDistance=0.5] - The reference distance for volume attenuation (default is 0.5).
     * @param {number} [duration=undefined] - The duration of the sound in seconds (optional).
     * @returns {THREE.PositionalAudio} - The loaded positional audio object.
     */
    loadPositionalSound(pathToSoundFile, volume = 2, refDistance = 0.5, duration = undefined) {
        const sound = new THREE.PositionalAudio(this.#listener);

        // Load the sound file using the audio loader
        this.#audioLoader.load(pathToSoundFile, function (buffer) {
            sound.duration = duration; // Set the duration of the sound (if provided)
            sound.setBuffer(buffer); // Set the audio buffer for the sound
            sound.setLoop(false); // Disable looping for the sound
            sound.setRefDistance(refDistance); // Set the reference distance for volume attenuation
            sound.setVolume(volume); // Set the volume of the sound
            sound.play(); // Play the sound
        });

        return sound; // Return the loaded positional audio object
    }
}
