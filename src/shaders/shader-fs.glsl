precision highp float;
precision highp int;

varying vec2 vUv;
varying highp vec4 vColor;
varying mat4 vMVMatrix;
varying vec3 vModelPosition;
varying vec3 vTransformedNormal;
varying vec3 vCameraPosition;

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
uniform float uMaterialShininess;	// material objetos
uniform int uUseReflection;

void main(void) {

	vec4 color = vec4(0.0,0.0,0.0,1.0);
	vec3 textColor;

	// luz direccional sol
	float directionalLightWeighting = max(dot(normalize(uLightDirection), normalize(vTransformedNormal.xyz)), 0.0);

	vec4 textureNormalLighting = texture2D(uNormalSampler, vec2(vUv.s, vUv.t));
	vec4 normalMapeadaVista = vMVMatrix * textureNormalLighting;

	//camara a objeto
	vec3 camObj = normalize(vCameraPosition - (vModelPosition));

	// normalizo
	vec3 vTransformedNormal_n = normalize(vTransformedNormal);

	// luz puntual faroles
	vec3 lampLightDirectionOne = normalize(ulampLightOnePosition - vModelPosition);
	float lampLightWeightingOne = max(dot(vTransformedNormal_n, lampLightDirectionOne), 0.0);
	//vec3 halfVectorOne = normalize(camObj + lampLightDirectionOne);
	vec3 halfVectorOne = reflect(-lampLightDirectionOne, vTransformedNormal_n);
	float specularLampLightWeightingOne = pow(dot(camObj, halfVectorOne), uMaterialShininess);
	
	vec3 lampLightDirectionTwo = normalize(ulampLightTwoPosition - vModelPosition);		
	float lampLightWeightingTwo = max(dot(vTransformedNormal_n, lampLightDirectionTwo), 0.0);	
	//vec3 halfVectorTwo = normalize(camObj + lampLightDirectionTwo);
	vec3 halfVectorTwo = reflect(-lampLightDirectionTwo, vTransformedNormal_n);
	float specularLampLightWeightingTwo = pow(dot(camObj, halfVectorTwo), uMaterialShininess);

	vec3 lampLightDirectionGrua = normalize(ulampLightGruaPosition - vModelPosition);		
	float lampLightWeightingGrua = max(dot(vTransformedNormal_n, lampLightDirectionGrua), 0.0);
	//vec3 halfVectorGrua = normalize(camObj + lampLightDirectionGrua);	
	vec3 halfVectorGrua = reflect(-lampLightDirectionGrua, vTransformedNormal_n);
	float specularLampLightWeightingGrua = pow(dot(camObj, halfVectorGrua), uMaterialShininess);	

	float distOne = length(ulampLightOnePosition - vModelPosition.xyz);
	float distTwo = length(ulampLightTwoPosition - vModelPosition.xyz);
	float distGrua = length(ulampLightGruaPosition - vModelPosition.xyz);


	vec3 difuse = 5.0 * ulampLightColour * (lampLightWeightingOne/distOne + lampLightWeightingTwo/distTwo + lampLightWeightingGrua/distGrua);
	vec3 specular = 10.0 * uLampLightColourSpecular * (specularLampLightWeightingOne/distOne + specularLampLightWeightingTwo/distTwo + specularLampLightWeightingGrua/distGrua);
	vec3 lightWeighting = difuse + specular;		

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
		vec3 espejoReflejado = normalize(reflect(normalize(normalMapeadaVista.xyz), normalize(vCameraPosition-vModelPosition)));
		float valueX = acos((espejoReflejado.z)/(sqrt(espejoReflejado.x*espejoReflejado.x + espejoReflejado.y*espejoReflejado.y + espejoReflejado.z*espejoReflejado.z)));
		if (espejoReflejado.y <= 0.1){
			espejoReflejado.y = 0.1;
		}			
		float valueY = atan(espejoReflejado.y/espejoReflejado.x);
		vec4 textureColorD = texture2D(uTextura2, vec2(valueY/piValue,valueX/piValue)); // correcto? vec2(valueY/piValue,valueX/piValue)  incorrecto: vec2(vUv.x, 1.0-vUv.y)
		gl_FragColor = vec4(textureColorD.rgb/7.0 + color.rgb * (uAmbientColor + uDirectionalColor * directionalLightWeighting + lightWeighting), color.a);
		//gl_FragColor = vec4(vTransformedNormal, 1.0);
	}
	else{
		gl_FragColor = vec4(color.rgb * (uAmbientColor + uDirectionalColor * directionalLightWeighting + lightWeighting), color.a);
		//gl_FragColor = vec4(vTransformedNormal, 1.0);
		//gl_FragColor = vec4(color.rgb, 1.0);
		//gl_FragColor = vec4(specularLampLightWeightingOne,specularLampLightWeightingOne,specularLampLightWeightingOne, 1.0);
	}
	

	
}