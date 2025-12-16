import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/8.png')

//
// particls
//
//geometry

    const particlesGeometry = new THREE.BufferGeometry()
    const count = 5000
    
    const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)
    const colors = new Float32Array(count * 3)

    for(let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
    {
        positions[i] = (Math.random() - 0.5) * 10// Math.random() - 0.5 to have a random value between -0.5 and +0.5
        colors[i] = Math.random()
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    // color: '#9ac9c4'
})

particlesMaterial.vertexColors = true
particlesMaterial.alphaMap = particleTexture
particlesMaterial.transparent = true
particlesMaterial.map = particleTexture
// particlesMaterial.alphaTest = 0.002
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(),
//     new THREE.MeshBasicMaterial(),
// )

// scene.add(cube)





//points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)








/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
function animateParticles() {
    requestAnimationFrame(animateParticles);

    const positions = particlesGeometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) { 
        positions[i] *= 1.001;      // Gradually expand outward (X)
        positions[i + 1] *= 1.001;  // Expand outward (Y)
        positions[i + 2] *= 1.001;  // Expand outward (Z)

        // If a particle moves too far, reset it near the center
        if (Math.abs(positions[i]) > 15 || Math.abs(positions[i + 1]) > 15 || Math.abs(positions[i + 2]) > 15) {
            positions[i] = (Math.random() - 0.5) * 10;   // Reset X
            positions[i + 1] = (Math.random() - 0.5) * 10; // Reset Y
            positions[i + 2] = (Math.random() - 0.5) * 10; // Reset Z
        }
    }

    particlesGeometry.attributes.position.needsUpdate = true; // Tell Three.js to update the geometry

    renderer.render(scene, camera);
}

// Call the animation function
animateParticles();


