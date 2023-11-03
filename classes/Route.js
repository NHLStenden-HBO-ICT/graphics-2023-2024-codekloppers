import * as THREE from "three";
import { Station } from "./3dModels/Station";
import { Metro } from "./3dModels/Metro";
import { Tunnel } from "./3dModels/Tunnel";
import { Routes } from "/config/routes";

// Define the Route class
export class Route {
    // Private variables for the Route class
    #stations;
    #leftTrainVector;
    #rightTrainVector;
    #leftCarriage;
    #rightCarriage;
    #sceneController;

    // Constructor for the Route class, initializes the route with stations and vectors
    constructor(sceneController, routeName) {
        this.#sceneController = sceneController;
        // Get stations for the specified route name from the Routes configuration
        this.#stations = Routes.routes[routeName];
        // Set initial train vectors
        this.#setVectors();
    }

    // Method to set initial train vectors based on station coordinates
    #setVectors() {
        this.#leftTrainVector = new THREE.Vector3(
            this.#stations[0]['vector']['x'] - 5,
            this.#stations[0]['vector']['y'] - 1,
            this.#stations[0]['vector']['z'] - 6.8,
        );

        this.#rightTrainVector = new THREE.Vector3(
            this.#stations[this.#stations.length-1]['vector']['x'] - 5,
            this.#stations[this.#stations.length-1]['vector']['y'] - 1,
            this.#stations[this.#stations.length-1]['vector']['z'],
        );
    }

    // Method to render stations, tunnels, and metros for the route
    async render() {
        await this.#renderStations();
        await this.#renderTunnels();
        await this.#renderMetros();
    }

    // Method to render stations along the route
    async #renderStations() {
        const station = new Station(this.#sceneController, this.#stations[0]['vector']);

        for (let i = 0; i < this.#stations.length; i++) {
            if (i === 0) {
                await station.render(this.#sceneController.getScene());
                continue;
            }

            await station.clone(this.#sceneController.getScene(), new Station(
                this.#sceneController,
                this.#stations[i]['vector']
            ));
        }
    }

    // Method to render metros for the route
    async #renderMetros() {
        this.#leftCarriage = await (new Metro(this.#leftTrainVector, this.#stations[0]['rotation'], this.#sceneController.getSoundController(), this.#sceneController.getUser(), false)).render(this.#sceneController.getScene());
        this.#rightCarriage = await this.#leftCarriage.clone(this.#sceneController.getScene(), new Metro(this.#rightTrainVector, this.#stations[this.#stations.length-1]['rotation'], this.#sceneController.getSoundController(), this.#sceneController.getUser(), true));
        this.#leftCarriage.driveRoute(this.#stations);
        this.#rightCarriage.driveRoute(this.#stations.reverse());
    }

    // Method to animate metros along the route
    animateMetros() {
        if (this.#leftCarriage.getMixer()) {
            this.#leftCarriage.getMixer().update(0.006);
        }

        if (this.#rightCarriage.getMixer() != null) {
          this.#rightCarriage.getMixer().update(0.006);
        }
    }

    // Method to render tunnels between stations
    async #renderTunnels() {
        let amountOfTunnels;
        let direction;
        let startingValue;
        let stationA;
        let stationB;
        let lengthOfTunnel = 10;
    
        for (let i = 0; i < this.#stations.length; i++) {
            if (i === this.#stations.length - 1) {
                return;
            }
            stationA = this.#stations[i]['vector']['x'];
            stationB = this.#stations[i + 1]['vector']['x'];
    
            // Calculate the number of tunnels required between two stations
            amountOfTunnels = ((Math.abs(stationA - stationB) - 64 - 34) / 10) + 1;
    
            // Determine the direction of the tunnel based on the relative positions of the stations
            if (stationA > stationB) {
                startingValue = 64 - stationA;
                direction = -1;
            }
            if (stationA < stationB) {
                startingValue = 34 + stationA;
                direction = 1;
            }
    
            // Create a new Tunnel object at each station and clone it to create multiple tunnels
            const tunnel = new Tunnel(new THREE.Vector3(
                startingValue * direction,
                this.#stations[i]['vector']['y'],
                this.#stations[i]['vector']['z'] - 3.4
            ));
    
            // Loop to create and render the specified number of tunnels between two stations
            for (let y = 0; y < amountOfTunnels; y++) {
                if (y === 0) {
                    // Render the first tunnel
                    await tunnel.render(this.#sceneController.getScene());
                    continue;
                }
                // Clone the tunnel to create additional tunnels and render them at appropriate positions
                await tunnel.clone(this.#sceneController.getScene(),
                    new Tunnel(new THREE.Vector3((startingValue + (y * lengthOfTunnel)) * direction, this.#stations[i]['vector']['y'], this.#stations[i]['vector']['z'] - 3.4)));
            }
        }
    }
}
