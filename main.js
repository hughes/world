// set the scene size
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000,
    RADIUS = 100,
    ICON_SIZE = 5;

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var scene = new THREE.Scene();

scene.add(camera);
camera.position.z = 300;
renderer.setSize(WIDTH, HEIGHT);

window.addEventListener('resize', onWindowResize, false);
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mousemove', onDocumentMouseDown, false );
document.addEventListener( 'touchstart', onDocumentTouchStart, false );
document.addEventListener( 'mousedown', click, false );
document.addEventListener( 'touchstart', click, false );

var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var objects = [];

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

var geometry = new THREE.SphereGeometry(RADIUS, 128, 64);
var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: textVShader,
    fragmentShader: textFShader
});

var earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh);
objects.push(earthMesh);

var gardenLat = 34.05*Math.PI/180,
    gardenLon = -30*Math.PI/180;
var gardenLink = new THREE.PlaneGeometry(ICON_SIZE*3, ICON_SIZE*3);
var leafUniforms = {
    time: { type: 'f', value: 0.0 },
    texture1: { type: 't', value: THREE.ImageUtils.loadTexture('./leaf.png') },
};
var iconVshader = document.getElementById('iconVert').innerText,
    iconFshader = document.getElementById('iconFrag').innerText;
var iconMaterial = new THREE.ShaderMaterial({
    uniforms: leafUniforms,
    vertexShader: iconVshader,
    fragmentShader: iconFshader,
    transparent: true,
});
var iconScale = 1.0;
// var iconMaterial = new THREE.MeshBasicMaterial();
var gardenMesh = new THREE.Mesh(gardenLink, iconMaterial);
gardenMesh.position.y = (RADIUS+ICON_SIZE)*Math.sin(gardenLat);
scene.add(gardenMesh);
objects.push(gardenMesh);

var startTime = new Date();
var dt = 0.0;

function tick() {
    var now = new Date();
    dt = (now - startTime) / 1000.0;
    uniforms.time.value = dt;
    leafUniforms.time.value = dt;
    // gardenMesh.lookAt(camera.position);
    gardenMesh.position.x = (RADIUS+ICON_SIZE)*Math.sin(dt/32*2*Math.PI+gardenLon)*Math.cos(gardenLat);
    gardenMesh.position.z = (RADIUS+ICON_SIZE)*Math.cos(dt/32*2*Math.PI+gardenLon)*Math.cos(gardenLat);
    gardenMesh.scale.x = gardenMesh.scale.y = gardenMesh.scale.z = iconScale;

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 && intersects[0].object === gardenMesh) {
        iconScale = 1.5;
        document.body.classList.add('iconHover');
    } else {
        iconScale = 1.0;
        document.body.classList.remove('iconHover');
    }
}

function render() {
    renderer.render(scene, camera);
}

function step(timestamp) {
    tick();
    render();
    requestAnimationFrame(step);
}

function onDocumentTouchStart( event ) {
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown( event );
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
}

function click(event) {
    if (document.body.classList.contains('iconHover')) {
        window.location = "/kibana/#/dashboard/Matt's-Garden";
    }
}

requestAnimationFrame(step);
