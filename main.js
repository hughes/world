// set the scene size
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var scene = new THREE.Scene();

scene.add(camera);
camera.position.z = 300;
renderer.setSize(WIDTH, HEIGHT);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var container = document.getElementById('container');
container.appendChild(renderer.domElement);

var uniforms = {
    time: { type: 'f', value: 0.0 },
    texture1: { type: 't', value: THREE.ImageUtils.loadTexture('./ocean_dist_resize.png') },
    cutoff: { type: 'f', value: 0.456887065393 }
};

uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;

var textVShader = document.getElementById('texturedVert').innerText,
    textFShader = document.getElementById('texturedFrag').innerText;

var geometry   = new THREE.SphereGeometry(100, 128, 64);
var material  = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: textVShader,
    fragmentShader: textFShader
});

var earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh);

var startTime = new Date();
var dt = 0.0;

function tick() {
    var now = new Date();
    dt = (now - startTime) / 1000.0;
    uniforms.time.value = dt;
}

function render() {
    renderer.render(scene, camera);
}

function step(timestamp) {
    tick();
    render();
    requestAnimationFrame(step);
}

requestAnimationFrame(step);
