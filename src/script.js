import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

const donats = [];

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker.json", font => {
    const textGeometry = new TextGeometry("Oh shit, here we go again", {
        font,
        size: 0.8,
        height: 2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.02,
        bevelOffset: 0.01,
        bevelSegments: 5,

        extrudePath: new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.5, 0, 0),
            new THREE.Vector3(-0.2, 0.2, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.2, -0.2, 0),
            new THREE.Vector3(0.5, 0, 0),
        ]),
    });

    textGeometry.center();

    textGeometry.computeBoundingSphere();

    const matcapTexture = textureLoader.load("/textures/matcaps/10.png");
    matcapTexture.mapping = THREE.EquirectangularRefractionMapping;

    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

    const text = new THREE.Mesh(textGeometry, textMaterial);

    scene.add(text);

    console.time("donuts");

    // donuts
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

    for (let i = 0; i < 1000; i++) {
        const donut = new THREE.Mesh(donutGeometry, textMaterial);

        donut.position.x = (Math.random() - 0.5) * 100;
        donut.position.y = (Math.random() - 0.5) * 100;
        donut.position.z = (Math.random() - 0.5) * 100;

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scale = Math.random();
        donut.scale.set(scale, scale, scale);

        scene.add(donut);
        donats.push(donut);
    }

    console.timeEnd("donuts");
});

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

/**
 * Object
 */

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Animate donats
    for (let i = 0; i < donats.length; i++) {
        const donat = donats[i];

        if (i % 2 === 0) {
            donat.rotation.x = -(elapsedTime * 0.1);
            donat.rotation.y = -(elapsedTime * 0.1);
        } else {
            donat.rotation.x = elapsedTime * 0.1;
            donat.rotation.y = elapsedTime * 0.1;
        }
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
