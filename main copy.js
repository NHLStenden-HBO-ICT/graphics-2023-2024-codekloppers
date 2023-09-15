const backgroundColor = 0x000000;

var renderCalls = [];

function render() {
  requestAnimationFrame(render);
  renderCalls.forEach((callback) => {
    callback();
  });
}

render();

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 800);
camera.position.set(20, 1, 1);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(backgroundColor);

renderer.toneMapping = THREE.LinearToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

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

var light = new THREE.PointLight(0xffffcc, 20, 200);
light.position.set(4, 30, -20);
scene.add(light);

var light2 = new THREE.AmbientLight(0x20202A, 20, 100);
light2.position.set(30, -10, 30);
scene.add(light2);

var mixer; // Declare the mixer variable outside the loader callback

var loader = new THREE.GLTFLoader();
loader.crossOrigin = true;
loader.load('Models/animation_test4.glb', function (data) {
  var object = data.scene;
  const animations = data.animations;

  mixer = new THREE.AnimationMixer(object);

  console.log(animations)


  window.addEventListener(
    "keydown",
    (event) => {

        switch (event.key) {
            case "e":
                    // Do something for "down arrow" key press.
                    //   Play a specific animation
                    const clip = THREE.AnimationClip.findByName(animations, "open_door");
                    const clip2 = THREE.AnimationClip.findByName(animations, "open_window");
                    const action = mixer.clipAction(clip);
                    const action2 = mixer.clipAction(clip2);
                    action.setLoop(THREE.LoopOnce);
                    action2.setLoop(THREE.LoopOnce);
                    action.clampWhenFinished = true
                    action2.clampWhenFinished = true
                    action.play();
                    action2.play();

                    action.reset();
                    action2.reset();
              break;
            case "ArrowUp":
              // Do something for "up arrow" key press.
              break;
            case "ArrowLeft":
              // Do something for "left arrow" key press.
              break;
            case "ArrowRight":
              // Do something for "right arrow" key press.
              break;
            case "Enter":
              // Do something for "enter" or "return" key press.
              break;
            case "Escape":
              // Do something for "esc" key press.
              break;
            default:
              return; // Quit when this doesn't handle the key event.
          }
    });



  object.rotation.y = 29.9;

  scene.add(object);
});

function update() {
  // Check if mixer is defined before updating
  if (mixer) {
    mixer.update(0.003);
  }
}

renderCalls.push(update);
