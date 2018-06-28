precision highp float;
precision highp int;

varying vec2 vUv;
varying highp vec4 vColor;
varying mat4 vMVMatrix;
varying vec4 vModelPosition;
varying vec3 vTransformedNormal;

uniform sampler2D uTextura;
uniform sampler2D uTextura2;
uniform sampler2D uNormalSampler;
uniform float uT;
uniform int uId;


//luces
uniform vec3 uAmbientColor; // ambiente
uniform vec3 uLightDirection; // sol
uniform vec3 uDirectionalColor; // sol
uniform vec3 ulampLightOnePosition; // farol 1
uniform vec3 ulampLightTwoPosition;	// farol 2
uniform vec3 ulampLightGruaPosition; // farol grua
uniform vec3 ulampLightColour;	// color faroles
uniform vec3 uLampLightColourSpecular;	// specular faroles
uniform vec3 uTarget;	// donde mira
uniform vec3 uCameraPos;	// camara posicion
uniform float uMaterialShininess;	// material objetos
uniform int uUseReflection;

void main(void) {

	vec4 color = vec4(0.0,0.0,0.0,1.0);
	vec3 textColor;

	// luz direccional sol
	float directionalLightWeighting = max(dot(normalize(uLightDirection), normalize(vTransformedNormal.xyz)), 0.0);

	// luz puntual faroles
	vec4 textureNormalLighting = texture2D(uNormalSampler, vec2(vUv.s, vUv.t));
	vec4 normalMapeadaVista = vMVMatrix * textureNormalLighting;

	vec3 eyeDirection = normalize(-uTarget.xyz);

	vec3 lampLightDirectionOne = normalize(ulampLightOnePosition - vModelPosition.xyz);
	float lampLightWeightingOne = max(dot(normalize(vTransformedNormal), normalize(lampLightDirectionOne)), 0.0);
	vec3 reflectionDirectionOne = normalize(reflect(-lampLightDirectionOne, textureNormalLighting.xyz));			//Recomiendan ponerle +normal
	float specularLampLightWeightingOne = pow(max(dot(reflectionDirectionOne, eyeDirection), 0.0), uMaterialShininess);
	
	vec3 lampLightDirectionTwo = normalize(ulampLightTwoPosition - vModelPosition.xyz);		
	float lampLightWeightingTwo = max(dot(normalize(vTransformedNormal), normalize(lampLightDirectionTwo)), 0.0);		
	vec3 reflectionDirectionTwo = normalize(reflect(-lampLightDirectionTwo, textureNormalLighting.xyz));		//Recomiendan ponerle +normal
	float specularLampLightWeightingTwo = pow(max(dot(reflectionDirectionTwo, eyeDirection), 0.0), uMaterialShininess);

	vec3 lampLightDirectionGrua = normalize(ulampLightGruaPosition - vModelPosition.xyz);		
	float lampLightWeightingGrua = max(dot(normalize(vTransformedNormal), normalize(lampLightDirectionGrua)), 0.0);		
	vec3 reflectionDirectionGrua = normalize(reflect(-lampLightDirectionGrua, textureNormalLighting.xyz));		//Recomiendan ponerle +normal
	float specularLampLightWeightingGrua = pow(max(dot(reflectionDirectionGrua, eyeDirection), 0.0), uMaterialShininess);

	float distOne = length(ulampLightOnePosition - vModelPosition.xyz);
	float distTwo = length(ulampLightTwoPosition - vModelPosition.xyz);
	float distGrua = length(ulampLightGruaPosition - vModelPosition.xyz);

	vec3 lightWeighting = ulampLightColour * 12.0 * (lampLightWeightingOne/distOne + lampLightWeightingTwo/distGrua + lampLightWeightingTwo/distGrua) + 10.0 * uLampLightColourSpecular * (specularLampLightWeightingOne/distOne + specularLampLightWeightingTwo/distTwo + specularLampLightWeightingGrua/distGrua);		

	if (uId == 1){
		vec2 offset=vec2(uT*0.01, uT*0.02);
		vec2 offset2=vec2(uT*0.025, uT*0.01);

		vec3 colorAgua1=vec3(0.3,0.5,0.86);
	   	vec3 colorAgua2=vec3(0.2,0.5,0.7);

		textColor = mix(colorAgua1*texture2D(uTextura, mod(vUv+offset,1.0)).xyz, colorAgua2*texture2D(uTextura2, mod(vUv*0.3+ offset2,1.0)).xyz, 0.5);
	} else{
		textColor = texture2D(uTextura, vUv).xyz;
	}

	color.x = textColor.x + vColor.x;
	color.y = textColor.y + vColor.y;
	color.z = textColor.z + vColor.z;

	if (uUseReflection == 1){
		float piValue = 3.14159265359;
		vec3 espejoReflejado = normalize(reflect(normalize(normalMapeadaVista.xyz), normalize(uCameraPos-vModelPosition.xyz)));
		float valueX = acos((espejoReflejado.z)/(sqrt(espejoReflejado.x*espejoReflejado.x + espejoReflejado.y*espejoReflejado.y + espejoReflejado.z*espejoReflejado.z)));
		if (espejoReflejado.y <= 0.1){
			espejoReflejado.y = 0.1;
		}			
		float valueY = atan(espejoReflejado.y/espejoReflejado.x);
		vec4 textureColorD = texture2D(uTextura2, vec2(valueY/piValue,valueX/piValue)); // correcto? vec2(valueY/piValue,valueX/piValue)
		gl_FragColor = vec4(textureColorD.rgb/7.0 + color.rgb * (uAmbientColor + uDirectionalColor * directionalLightWeighting + lightWeighting), color.a);
	}
	else{
		gl_FragColor = vec4(color.rgb * (uAmbientColor + uDirectionalColor * directionalLightWeighting + lightWeighting), color.a);
		//gl_FragColor = vec4(vTransformedNormal, 1.0);
		//gl_FragColor = vec4(color.rgb, 1.0);
	}
	

	
}