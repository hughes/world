// set the scene size
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

var stats = new Stats();
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
container.appendChild(stats.domElement);

var vShader = document.getElementById('vert').innerText,
    fShader = document.getElementById('frag').innerText;

var uniforms = {
    time: { type: 'f', value: 0.0 }
};

var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vShader,
    fragmentShader: fShader
});

// var geometry, lineData, pointData, x, y;
// coastline.forEach(function (lineData) {
//     geometry = new THREE.Geometry();
//     lineData.forEach(function (pointData) {
//         x = pointData[0];
//         y = pointData[1];
//         geometry.vertices.push(new THREE.Vector3(x, y, 0));
//     });
//     scene.add(new THREE.Line(geometry, material));
// });

var uniforms2 = {
    // time: { type: 'f', value: 0.0 },
    texture1: { type: 't', value: THREE.ImageUtils.loadTexture('./ocean_dist_resize.png') },
    cutoff: { type: 'f', value: 0.456887065393 }
};

var textVShader = document.getElementById('texturedVert').innerText,
    textFShader = document.getElementById('texturedFrag').innerText;

var geometry2   = new THREE.SphereGeometry(80, 32, 32);
var material2  = new THREE.ShaderMaterial({
    uniforms: uniforms2,
    vertexShader: textVShader,
    fragmentShader: textFShader
});
material2.map    = THREE.ImageUtils.loadTexture('./ocean_dist.png')
var earthMesh = new THREE.Mesh(geometry2, material2);
scene.add(earthMesh);
window.mesh = earthMesh;

// add subtle blue ambient lighting
var ambientLight = new THREE.AmbientLight(0x444499);
scene.add(ambientLight);

// directional lighting
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

var startTime = new Date();
var dt = 0.0;

function tick() {
    var now = new Date();
    dt = (now - startTime) / 1000.0;
    uniforms.time.value = Math.PI/2;//dt/3;
}

function render() {
    earthMesh.rotation.y = dt / 4.0;
    renderer.render(scene, camera);
}

function step(timestamp) {
    stats.begin();
    tick();
    render();
    stats.end();
    requestAnimationFrame(step);
}

requestAnimationFrame(step);
