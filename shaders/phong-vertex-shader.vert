attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;        

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

uniform vec3 uLightWorldPosition;
uniform vec3 uViewWorldPosition;

varying vec3 n;
varying vec3 v;
varying float f;
varying vec3 sl;
varying vec3 sv;
        
void main(void) {

    vec4 vertex = uViewMatrix  * uModelMatrix * vec4(aVertexPosition, 1.0);
    vec3 surfaceWorldPosition = vec3( uModelMatrix * vec4(aVertexPosition, 1.0));
             
    n = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    v = vec3(vertex.xyz);
    f = -vertex.z;
    sl = uLightWorldPosition - surfaceWorldPosition;
    sv = uViewWorldPosition - surfaceWorldPosition;
             
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
}