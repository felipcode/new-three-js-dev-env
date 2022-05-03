import * as THREE from '../node_modules/three/build/three.module.js'
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
//import fragment from './shader/fragment.glsl'

const vshader  = /*glsl*/ `
uniform float time;
uniform float progress;
uniform vec4 resolution;
varying vec2 vUV;
varying vec2 vShow;
varying vec3 vPosition;
void main() {
	vUV = uv;
	vPosition = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.);

	vShow = gl_Position.xy/gl_Position.w;
}
`;
const fshader = /*glsl*/ `
uniform vec4 resolution;
uniform float progress;
uniform float time;
varying vec2 vUv;
varying vec2 vShow;
void main() {

	gl_FragColor = vec4(vShow, 0. + time * 0.003  , 1.);
}
`;

class WEBGL {

	static isWebGLAvailable() {

		try {

			const canvas = document.createElement( 'canvas' );
			return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );

		} catch ( e ) {

			return false;

		}

	}

	static isWebGL2Available() {

		try {

			const canvas = document.createElement( 'canvas' );
			return !! ( window.WebGL2RenderingContext && canvas.getContext( 'webgl2' ) );

		} catch ( e ) {

			return false;

		}

	}

	static getWebGLErrorMessage() {

		return this.getErrorMessage( 1 );

	}

	static getWebGL2ErrorMessage() {

		return this.getErrorMessage( 2 );

	}

	static getErrorMessage( version ) {

		const names = {
			1: 'WebGL',
			2: 'WebGL 2'
		};

		const contexts = {
			1: window.WebGLRenderingContext,
			2: window.WebGL2RenderingContext
		};

		let message = 'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';

		const element = document.createElement( 'div' );
		element.id = 'webglmessage';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if ( contexts[ version ] ) {

			message = message.replace( '$0', 'graphics card' );

		} else {

			message = message.replace( '$0', 'browser' );

		}

		message = message.replace( '$1', names[ version ] );

		element.innerHTML = message;

		return element;

	}

}

class setup3d {
    constructor(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();                     // magic
        
        this.renderer.setSize( window.innerWidth, window.innerHeight, false );  //magic (divide by 2 for performance) - lower resolution    

        this.camera.position.z = 5
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        document.body.appendChild( this.renderer.domElement )

    }
    init(){

        this.create_meshes()
        this.add_meshes()
        //this.run()
    }

    create_meshes(){
        this.set_1 = new THREE.Group()
        this.set_2 = new THREE.Group()

        this.geometry_1 = new THREE.BoxBufferGeometry( 1, 1, 1 );
        
        this.material_1 = new THREE.MeshBasicMaterial( {color: 0x05ff00} );

		this.shader_mat = new THREE.ShaderMaterial({
			uniforms : {
				time : { value : 0},
				resolution : { value : new THREE.Vector4() }, 
				progress : {value : 0 }
			},
			vertexShader : vshader,
			fragmentShader : fshader,
		})

        this.mesh_1 = new THREE.Mesh(this.geometry_1, this.shader_mat )

        this.set_1.add(this.mesh_1)

    }
    add_meshes(){
        //this.scene.add( this.set_1)
        this.scene.add(this.mesh_1)
    }

    animate(){
        
        requestAnimationFrame(  this.animate.bind(this) );
	    this.renderer.render( this.scene, this.camera );

		this.shader_mat.uniforms.time.value += 1;
        
    }
    run(){
		//this.mesh_1.shader_mat.uniforms.time.value += 1;
        this.animate()
    }
}

export { setup3d }