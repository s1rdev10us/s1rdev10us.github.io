import { DoubleSide, SphereGeometry, PointLight, PCFSoftShadowMap, TextureLoader, Vector2, BoxGeometry, FloatType, MeshStandardMaterial, PMREMGenerator, Scene, PerspectiveCamera, WebGLRenderer, Color, ACESFilmicToneMapping, sRGBEncoding, Mesh, CylinderGeometry, MeshPhysicalMaterial } from 'https://cdn.skypack.dev/three@0.137';
import { RGBELoader } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';
import SimplexNoise from 'https://cdn.skypack.dev/simplex-noise';

const scene = new Scene();
scene.background = new Color("#222222");

const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(-17, 31, 33);
//camera.position.set(0, 0, 50)

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const light = new PointLight(new Color("#FFCB8E").convertSRGBToLinear().convertSRGBToLinear(), 80, 200)
light.position.set(10, 20, 10)

light.castShadow = true;
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

let envmap;
const SIZE = Math.floor(Math.random * 9)+1;//const SIZE = 2;
const MAX_HEIGHT = 10;
const STONE_HEIGHT = MAX_HEIGHT * 0.8;
const DIRT_HEIGHT = MAX_HEIGHT * 0.7;
const GRASS_HEIGHT = MAX_HEIGHT * 0.5;
const SAND_HEIGHT = MAX_HEIGHT * 0.3;
const DIRT2_HEIGHT = MAX_HEIGHT * 0;

(async function () {
	let pmrem = new PMREMGenerator(renderer);
	let envmapTexture = await new RGBELoader().setDataType(FloatType).loadAsync("./assets/envmap.hdr");
	envmap = pmrem.fromEquirectangular(envmapTexture).texture;

	let textures = {
		dirt: await new TextureLoader().loadAsync("./assets/dirt.png"),
		dirt2: await new TextureLoader().loadAsync("./assets/dirt2.jpg"),
		grass: await new TextureLoader().loadAsync("./assets/grass.jpg"),
		sand: await new TextureLoader().loadAsync("./assets/sand.jpg"),
		water: await new TextureLoader().loadAsync("./assets/water.jpg"),
		stone: await new TextureLoader().loadAsync("./assets/stone.png"),
	};

	const simplex = new SimplexNoise();

	for (var i = -(SIZE * 20); i <= (SIZE * 20); i++) {
		for (var j = -(SIZE * 20); j <= (SIZE * 20); j++) {
			let position = tileToPosition(i, j);

			if (position.length() > (SIZE * 16)) continue;

			let noise = (simplex.noise2D(i * 0.1, j * 0.1) + 1) * 0.5;
			noise = Math.pow(noise,1.5);

			makeHex(noise*MAX_HEIGHT, position);
		}
	}

	let stoneMesh = hexMesh(stoneGeo, textures.stone);
	let grassMesh = hexMesh(grassGeo, textures.grass);
	let dirt2Mesh = hexMesh(dirt2Geo, textures.dirt2);
	let dirtMesh = hexMesh(dirtGeo, textures.dirt);
	let sandMesh = hexMesh(sandGeo, textures.sand);
	scene.add(stoneMesh, dirtMesh, dirt2Mesh, sandMesh, grassMesh);

	let seaTexture = textures.water;
	seaTexture.repeat = new Vector2(1, 1);
	seaTexture.wrapS = RepeatWrapping;
	seaTexture.wrapT = RepeatWrapping;

	let seaMesh = new Mesh(
		new CylinderGeometry((SIZE * 17), (SIZE * 17), MAX_HEIGHT * 0.2, 50),
		new MeshPhysicalMaterial({
			envMap: envmap,
			color: new Color("#55aaff").convertSRGBToLinear().multiplyScalar(3),
			ior: 1.4,
			transmission: 1,
			transparent: true,
			thickness: -1.5,
			envMapIntensity: 0.2,
			roughness: 1,
			metalness: 0.025,
			roughnessMap: seaTexture,
			metalnessMap: seaTexture
		})
	);
	seaMesh.recieveShadow = true;
	seaMesh.position.set(0, MAX_HEIGHT * 0.1, 0);
	//scene.add(seaMesh);


	let mapContainer = new Mesh(
		new CylinderGeometry((SIZE * 17) + 0.1, (SIZE * 17)+0.1, MAX_HEIGHT * 0.25, 50, 1, true),
		new MeshPhysicalMaterial({
			envMap: envmap,
			map: textures.dirt,
			envMapIntensity: 0.2,
			side: DoubleSide
		})
	);
	mapContainer.recieveShadow = true;
	mapContainer.position.set(0, MAX_HEIGHT * 0.125, 0);
	scene.add(mapContainer);


	let mapFloor = new Mesh(
		new CylinderGeometry((SIZE * 18) + 0.5, (SIZE * 18) + 0.5, MAX_HEIGHT * 0.1, 50),
		new MeshPhysicalMaterial({
			envMap: envmap,
			map: textures.dirt2,
			envMapIntensity: 0.1,
			side:DoubleSide
		})
	);
	mapFloor.recieveShadow = true;
	mapFloor.position.set(0, -MAX_HEIGHT * 0.05, 0);
	scene.add(mapFloor);

	clouds();


	renderer.setAnimationLoop(() => {
		controls.update();
		renderer.render(scene, camera);
	});
})();


function tileToPosition(tileX, tileY) {
	return new Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
}


let stoneGeo = new BoxGeometry(0, 0, 0);
let dirtGeo = new BoxGeometry(0, 0, 0);
let dirt2Geo = new BoxGeometry(0, 0, 0);
let sandGeo = new BoxGeometry(0, 0, 0);
let grassGeo = new BoxGeometry(0, 0, 0);

function hexGeometry(height, position) {
	let geo = new CylinderGeometry(1, 1, height, 6, 1, false);
	geo.translate(position.x, height * 0.5, position.y);

	return geo;
}

function makeHex(height, position) {
	let geo = hexGeometry(height, position);

	if (height > STONE_HEIGHT) {
		stoneGeo = mergeBufferGeometries([geo, stoneGeo]);

		if (Math.random() > 0.8) {
			stoneGeo = mergeBufferGeometries([geo, stone(height,position)]);
		}
	} else if (height > DIRT_HEIGHT) {
		dirtGeo = mergeBufferGeometries([geo, dirtGeo]);

		if (Math.random() > 0.8) {
			grassGeo = mergeBufferGeometries([geo, tree(height, position)]);
		}
	} else if (height > GRASS_HEIGHT) {
		grassGeo = mergeBufferGeometries([geo, grassGeo]);
	} else if (height > SAND_HEIGHT) {
		sandGeo = mergeBufferGeometries([geo, sandGeo]);

		if (Math.random() > 0.8) {
			stoneGeo = mergeBufferGeometries([geo, stone(height, position)]);
		}
	} else if (height > DIRT2_HEIGHT) {
		dirt2Geo = mergeBufferGeometries([geo, dirt2Geo]);
	}
}

function hexMesh(geo, map) {
	let mat = new MeshPhysicalMaterial({
		envMap: envmap,
		envMapIntensity: 0.135,
		flatShading: true,
		map
	});

	let mesh = new Mesh(geo, mat);
	mesh.castShadow = true;
	mesh.recieveShadow = true;

	return mesh;
}

function stone(height, position) {
	const px = Math.random() * 0.4;
	const pz = Math.random() * 0.4;

	const geo = new SphereGeometry(Math.random() * 0.3 + 0.1, 7, 7);
	geo.translate(position.x + px, height, position.y + pz);

	return geo;
}

function tree(height, position) {
	const treeHeight = Math.random() * 1 + 1.25;

	const geo = new CylinderGeometry(0, 1.5, treeHeight, 3);
	geo.translate(position.x, height + treeHeight * 0 + 1, position.y);

	const geo2 = new CylinderGeometry(0, 1.15, treeHeight, 3);
	geo2.translate(position.x, height + treeHeight * 0.6 + 1, position.y);

	const geo3 = new CylinderGeometry(0, 0.8, treeHeight, 3);
	geo3.translate(position.x, height + treeHeight * 1.25 + 1, position.y);

	return mergeBufferGeometries([geo,geo2,geo3])
}

function clouds() {
	let geo = new SphereGeometry(0, 0, 0);
	let count = Math.floor(Math.pow(Math.random(), 0.45) * 4);
	//count = Math.random()*4

	for (let i = 0; i < count; i++) {
		const puff1 = new SphereGeometry(1.2, 7, 7);
		const puff2 = new SphereGeometry(1.5, 7, 7);
		const puff3 = new SphereGeometry(0.9, 7, 7);

		puff1.translate(-1.85, Math.random() * 0.3, 0);
		puff2.translate(0, Math.random() * 0.3, 0);
		puff3.translate(1.85, Math.random() * 0.3, 0);

		const cloudGeo = mergeBufferGeometries([puff1, puff2, puff3]);
		cloudGeo.translate(
			Math.random() * 20 - 10,
			Math.random() * 7 + 7,
			Math.random() * 20 - 10
		);
		cloudGeo.rotateY(Math.random() * Math.PI * 2);

		geo = mergeBufferGeometries([geo, cloudGeo]);
	}

	const mesh = new Mesh(
		geo,
		new MeshStandardMaterial({
			envMap: envmap,
			envMapIntensity: 0.75,
			flatShading:true
		})
	);

	scene.add(mesh);
}