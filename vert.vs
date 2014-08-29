uniform float time;

// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif

#define DEG2RAD 2.0*3.14159/360.0;
#define WORLD_SIZE = 50.0;

vec3 degToRad(vec3 p) {
    return p * DEG2RAD;
}

vec3 sphereToCartesian(vec3 p) {
    return vec3(sin(p.x) * cos(p.y),
                sin(p.y),
                cos(p.x) * cos(p.y));
}

void main()
{
    vec3 q = degToRad(position);
    q.x += time;
    vec3 p = sphereToCartesian(q);
    p *= WORLD_SIZE;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
}
