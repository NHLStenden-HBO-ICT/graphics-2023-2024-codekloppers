const backgroundColor = 0x000000;

var objectName = 0;
var objects = {};
var renderCalls = [];

function render() {
  requestAnimationFrame(render);
  renderCalls.forEach((callback) => {
    callback();
  });
}
// loadObject('Models/animation_test4.glb', 7, -1, -7, 0);
loadObject('Models/ubahnTrain.glb',0, 0, 0, 0);
// loadObject('Models/ubahnStation.glb', 0,1,6.6,0);
loadObject('Models/rail.glb', 0,0,0,0);

render();

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 800);
camera.position.set(20, 1, 1);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(backgroundColor);

document.body.appendChild(renderer.domElement);

function renderScene() {
  renderer.render(scene, camera);
}

renderCalls.push(renderScene);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.rotateSpeed = 0.3;
controls.zoomSpeed = 0.9;

controls.minDistance = 3;
controls.maxDistance = 20;

controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI / 2; // radians

controls.enableDamping = true;
controls.dampingFactor = 0.05;

renderCalls.push(function () {
  controls.update()
});

var light2 = new THREE.AmbientLight(0x20202A, 10, 30);
light2.position.set(10, 10, 10);
scene.add(light2);

var mixer; // Declareer de mixer-variabele buiten de loader-callback
var object; // Declareer de object-variabele buiten de loader-callback

function update() {
  // Controleer of de mixer is gedefinieerd voordat deze wordt bijgewerkt
  if (mixer) {
    mixer.update(0.003);
  }
}

renderCalls.push(update);

function openDoors_right(animations) {

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


  function closeDoors_right(animations) {

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


/* The `moveObject` function is responsible for animating the movement of an object in the scene. It
takes in the `object` to be moved and the `x`, `y`, and `z` coordinates representing the destination
position of the object. */
// Functie om het object recht vooruit te laten bewegen
function moveObject(objectName, x, y, z, duration) {

    var object = objects[objectName];

    if (object) { // Controleer of het object is geladen
      var startPosition = object.position.clone(); // Huidige positie van het object
      var endPosition = new THREE.Vector3(x, y, z); // Eindpositie waarheen het object moet bewegen
      var duration = duration; // Duur van de animatie in seconden

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

function loadObject(filePath, x, y, z,rotation) {

    var loader = new THREE.GLTFLoader();
    loader.crossOrigin = true;

    loader.load(filePath, function (data) {
    object = data.scene; // Wijs de geladen scène toe aan de objectvariabele

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
                    moveObject(0, x = 0 , y = 0, z = 0, 10);
                break;
            }
        });

    object.rotation.x = rotation;
    object.position.set(x,y,z);
    object.position.y = y;

    objects[objectName] = object;
    objectName++;
    return scene.add(object);
    });
}


