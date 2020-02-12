#ifdef GL_ES
precision highp float;
#endif
        
uniform float uShininess;
uniform vec3 uLightDirection;
        
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
        
varying vec3 n;
varying vec3 v;
varying float f;
varying vec3 sl;
varying vec3 sv;

uniform float uFogNear;
uniform float uFogFar;
uniform vec4 uFogColor;
uniform float uLightness;

uniform bool uBlinnModel;
uniform bool uReflector;
uniform bool uFog;

uniform float uReflectorShininess;
        
void main(void)
{
    vec3 N = normalize(n);
    vec3 SL = normalize(sl);
    vec3 SV = normalize(sv);
    vec3 HV = normalize(SL + SV);
            
    float light = 0.0;
    float specular = 0.0;
                
    light = dot(N, SL);
    if (light > 0.0) {
        if(dot(N, HV)>0.0) specular = pow(dot(N, HV), uReflectorShininess);
    }

    vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0);
             
    vec3 L = normalize(uLightDirection-v);
    vec3 V = normalize(-v);
    vec3 R = reflect(-L, N);
    vec3 H = normalize(L + V);

    float lambertTerm = dot(L, N);

    vec4 Ia = vec4(1.0, 1.0, 1.0, 1.0) * uMaterialAmbient;
    vec4 Id = vec4(0.0,0.0,0.0,1.0);
    vec4 Is = vec4(0.0,0.0,0.0,1.0);

    if(lambertTerm > 0.0)
    {
        Id = uMaterialDiffuse * lambertTerm;

        if(uBlinnModel) Is = uMaterialSpecular * pow(max(dot(N, H), 0.0), uShininess);
        else Is = uMaterialSpecular * pow(max(dot(R, V), 0.0), uShininess);
    }
             
    finalColor = Ia + uLightness * Id + uLightness *Is;
    if(uReflector) finalColor += vec4(0.0, 0.0, 0.0, 1.0) * light + specular;
    finalColor.a = 1.0;
 
    if(uFog) {
        float fogAmount = smoothstep(uFogNear, uFogFar, length(v));
        gl_FragColor = mix(finalColor, uFogColor, fogAmount);
    } else {
        gl_FragColor = finalColor;
    }
}