import * as THREE from "three";
import {Station} from "./3dModels/Station";
import {Metro} from "./3dModels/Metro";
import {Tunnel} from "./3dModels/Tunnel";

export class Route {

    stations = [
        {'vector': new THREE.Vector3(0, 0, 0), 'rotation': [0, 0, 0]},
        {'vector': new THREE.Vector3(-700, 0, 0), 'rotation': [0, 0, 0]},
        {'vector': new THREE.Vector3(-1200, 0, 0), 'rotation': [0, 0, 0]},
    ];

    #leftTrainVector = new THREE.Vector3(
        this.stations[0]['vector']['x'] - 5,
        this.stations[0]['vector']['y'] - 1,
        this.stations[0]['vector']['z'] - 6.8,
    );

    #rightTrainVector = new THREE.Vector3(
        this.stations[0]['vector']['x'] - 5,
        this.stations[0]['vector']['y'] - 1,
        this.stations[0]['vector']['z'],
    );

    metro1;
    metro12;
    metro2;
    metro22;

    constructor(sceneController) {
        this.sceneController = sceneController;
    }

    async render() {
        await this.#renderStations();
        await this.#renderMetros();
        await this.#renderTunnels();
    }

    async #renderStations() {
        const station = new Station(this.stations[0]['vector']);

        for (let i = 0; i < this.stations.length; i++) {
            if (i === 0) {
                await station.render(this.sceneController.scene);
                continue;
            }

            await station.clone(this.sceneController.scene, new Station(
                this.stations[i]['vector']
                // this.stations[i]['rotation']
            ));
        }
    }

    async #renderMetros() {
        let secondCarriageRotation = this.stations[0]['rotation'];
        secondCarriageRotation[1] += 3.1415926536;
        // console.log(secondCarriageRotation);

        this.metro1 = new Metro(this.#leftTrainVector, this.stations[0]['rotation']);

        await this.metro1.render(this.sceneController.scene);
        this.metro12 = await this.metro1.clone(this.sceneController.scene, new Metro(this.#leftTrainVector, secondCarriageRotation));

        this.metro2 = await this.metro1.clone(this.sceneController.scene, new Metro(this.#rightTrainVector, this.stations[0]['rotation']));
        this.metro22 = await this.metro1.clone(this.sceneController.scene, new Metro(this.#rightTrainVector, secondCarriageRotation));
    }

    animateMetros() {
        if (this.metro1.mixer) {
            this.metro1.mixer.update(0.003);
        }

        if (this.metro12.mixer) {
            this.metro12.mixer.update(0.003);
        }

        if (this.metro2.mixer) {
            this.metro2.mixer.update(0.003);
        }

        if (this.metro22.mixer) {
            this.metro22.mixer.update(0.003);
        }
    }

    async #renderTunnels() {
        let amountOfTunnels;
        let direction;
        let startingValue;
        let endValue;

        for (let i = 0; i < this.stations.length; i++) {
            if (i === this.stations.length - 1) {
                return;
            }

            if (this.stations[i]['vector']['x'] > this.stations[i + 1]['vector']['x']) {
                startingValue = 64 + this.stations[i]['vector']['x'];
                endValue = 34;
                amountOfTunnels = 1 + (this.stations[i]['vector']['x'] - this.stations[i + 1]['vector']['x'] - startingValue - endValue) / 10
                direction = -1
            }

            if (this.stations[i]['vector']['x'] < this.stations[i + 1]['vector']['x']) {
                startingValue = 34 + this.stations[i]['vector']['x'];
                endValue = 64
                amountOfTunnels = (this.stations[i + 1]['vector']['x'] - this.stations[i]['vector']['x'] - startingValue - endValue) / 10
                direction = 1
            }

            const tunnel = new Tunnel(new THREE.Vector3(startingValue * direction, 0, -3.4));
            for (let y = 0; y < amountOfTunnels; y++) {
                if (y === 0) {
                    await tunnel.render(this.sceneController.scene);
                    continue;
                }
                await tunnel.clone(this.sceneController.scene, new Tunnel(new THREE.Vector3((startingValue + (y*10)) * direction,0,-3.4)));
            }


        }
    }


}