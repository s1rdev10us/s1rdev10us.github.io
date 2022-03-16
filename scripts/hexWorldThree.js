import { Vector2, BoxGeometry, FloatType, MeshStandardMaterial, PMREMGenerator, Scene, PerspectiveCamera, WebGLRenderer, Color, ACESFilmicToneMapping, sRGBEncoding, Mesh, CylinderGeometry, MeshBasicMaterial } from 'https://cdn.skypack.dev/three@0.137';
import { RGBELoader } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';


const scene = new Scene();
scene.background = new Color("#222222");

const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
//camera.position.set(-17, 31, 33);
camera.position.set(0, 0, 50);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

let envmap;

(async function () {
	let pmrem = new PMREMGenerator(renderer);
	let envmapTexture = await new RGBELoader().setDataType(FloatType).loadAsync("./assets/envmap.hdr");
	envmap = pmrem.fromEquirectangular(envmapTexture).texture;

	for (var i = -10; i <= 10; i++) {
		for (var j = -10; j <= 10; j++) {
			let position = tileToPosition(i, j);

			if (position.length() > 16) continue;

			makeHex(3, position);
		}
	}
	
	let hexagonMesh = new Mesh(
		hexagonGeometries,
		new MeshStandardMaterial({
			envMap: envmap,
			flatShading: true,
		})
	);
	scene.add(hexagonMesh);

	renderer.setAnimationLoop(() => {
		controls.update();
		renderer.render(scene, camera);
	});
})();


function tileToPosition(tileX, tileY) {
	return new Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
}


let hexagonGeometries = new BoxGeometry(0, 0, 0);

function hexGeometry(height, position) {
	let geo = new CylinderGeometry(1, 1, height, 6, 1, false);
	geo.translate(position.x, height * 0.5, position.y);

	return geo;
}

function makeHex(height, position) {
	let geo = hexGeometry(height, position);
	hexagonGeometries = mergeBufferGeometries([hexagonGeometries, geo]);
}