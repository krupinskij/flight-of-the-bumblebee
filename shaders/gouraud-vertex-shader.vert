attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

uniform float uShininess;
uniform vec3 uLightDirection;

uniform vec3 uLightWorldPosition;
uniform vec3 uViewWorldPosition;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;

varying vec4 color;

uniform float uFogNear;
uniform float uFogFar;
uniform vec4 uFogColor;
uniform float uLightness;

uniform bool uBlinnModel;
 
void main(void) {

    vec4 vertex = uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    vec3 surfaceWorldPosition = vec3( uModelMatrix * vec4(aVertexPosition, 1.0));

    vec3 N = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    color = vec4(0.0, 0.0, 0.0, 1.0);

    vec3 L = normalize(uLightDirection - vec3(vertex)); 
    vec3 V = normalize(-vec3(vertex));
    vec3 R = reflect(-L, N);
    vec3 H = normalize(L + V);

    vec3 SL = normalize(uLightWorldPosition - surfaceWorldPosition);
    vec3 SV = normalize(uViewWorldPosition - surfaceWorldPosition);
    vec3 HV = normalize(SL + SV);
    float light = 0.0;
    float specular = 0.0;

    light = dot(N, SL);
    if (light > 0.0) {
        if(dot(N, HV)>0.0) specular = pow(dot(N, HV), 150.0);
    }

    float lambertTerm = dot(L, N);

    vec4 Ia = vec4(0.0, 0.0, 0.0, 1.0) * uMaterialAmbient;
    vec4 Id = vec4(0.0,0.0,0.0,1.0);
    vec4 Is = vec4(0.0,0.0,0.0,1.0);

    if(lambertTerm > 0.0)
    {
        Id = uMaterialDiffuse * lambertTerm;

        if(uBlinnModel) Is = uMaterialSpecular * pow(max(dot(N, H), 0.0), uShininess);
        else Is = uMaterialSpecular * pow(max(dot(R, V), 0.0), uShininess);
    }

    color = Ia + uLightness * Id + Is;
    color += vec4(0.0, 0.0, 0.0, 1.0) * light + specular;
    color.a = 1.0;

    float fogAmount = smoothstep(uFogNear, uFogFar, length(vertex));
    color = mix(color, uFogColor, fogAmount);

    gl_Position = uProjectionMatrix * vertex;
}