// set the scene size
var WIDTH = 400,
    HEIGHT = 300,
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

var geometry, lineData, pointData, x, y;
coastline.forEach(function (lineData) {
    geometry = new THREE.Geometry();
    lineData.forEach(function (pointData) {
        x = pointData[0];
        y = pointData[1];
        geometry.vertices.push(new THREE.Vector3(x, y, 0));
    });
    scene.add(new THREE.Line(geometry, material));
});

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
    stats.begin();
    tick();
    render();
    stats.end();
    requestAnimationFrame(step);
}

requestAnimationFrame(step);
