import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';

// Scene setup
const canvas = document.getElementById('model-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true,
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Enhanced lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Main spotlight for dramatic lighting
const mainSpotLight = new THREE.SpotLight(0xffffff, 4);
mainSpotLight.position.set(0, 5, 5);
mainSpotLight.angle = Math.PI / 4;
mainSpotLight.penumbra = 0.3;
mainSpotLight.decay = 1;
scene.add(mainSpotLight);

// Red accent light
const redAccentLight = new THREE.PointLight(0xCB0000, 2, 10);
redAccentLight.position.set(-3, 2, 3);
scene.add(redAccentLight);

// Camera positioning
camera.position.z = 5;
camera.position.y = 2;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.9;

// Load 3D Model
let model;
const loader = new GLTFLoader();
loader.load(
    'camera.glb',
    (gltf) => {
        model = gltf.scene;
        
        // Keep original scale and position
        model.scale.set(1.2, 1.2, 1.2);
        model.position.y = 0.8;
        //model.position.z = 1;
        
        // Enhanced material properties
        model.traverse((child) => {
            if (child.isMesh) {
                const originalMaterial = child.material.clone();
                
                child.material = new THREE.MeshStandardMaterial({
                    map: originalMaterial.map,
                    normalMap: originalMaterial.normalMap,
                    roughnessMap: originalMaterial.roughnessMap,
                    
                    color: 0xffffff,
                    metalness: 0.7,  // Increased metalness for better light reflection
                    roughness: 0.3,  // Decreased roughness for sharper reflections
                });
            }
        });
        
        scene.add(model);
        
        // Entrance animation
        gsap.from(model.rotation, {
            y: Math.PI * 4,
            duration: 4,
            ease: "power2.out",
        });
    },
    (progress) => {
        console.log('Loading model:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
