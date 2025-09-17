"use client"

import { Canvas, useLoader, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Html, Environment, shaderMaterial } from "@react-three/drei"
import { useRef, useState, useMemo, Suspense } from "react"
import { TextureLoader, CanvasTexture, AdditiveBlending, BackSide, DoubleSide, Vector2 } from "three"
import { extend } from "@react-three/fiber"
import type { Mesh } from "three"
import NoSSR from "./NoSSR"

// Atmospheric glow shader material based on the reference
const AtmosphereShaderMaterial = shaderMaterial(
  {},
  // Vertex shader
  `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
      gl_FragColor = vec4(0.1, 0.6, 1.0, 1.0) * intensity;
    }
  `
)

// Extend to make it available in JSX
extend({ AtmosphereShaderMaterial })

// TypeScript declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      atmosphereShaderMaterial: any
    }
  }
}

interface HarvestPoint {
  id: string
  position: [number, number, number]
  latitude: number
  longitude: number
  region: string
  quantity: number
  quality: string
}

// Convert latitude/longitude to 3D coordinates on a sphere
function latLonToCartesian(lat: number, lon: number, radius: number = 1): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180) // Convert latitude to spherical coordinates
  const theta = (lon + 180) * (Math.PI / 180) // Convert longitude to spherical coordinates
  
  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  
  return [x, y, z]
}

const harvestPoints: HarvestPoint[] = [
  { 
    id: "1", 
    position: latLonToCartesian(28.6139, 102.2090, 1.5), // New Delhi, India
    latitude: 28.6139, 
    longitude: 77.2090, 
    region: "North India", 
    quantity: 150, 
    quality: "Premium" 
  },
  { 
    id: "2", 
    position: latLonToCartesian(25.0760, 108.8777, 1.5), // Mumbai, India
    latitude: 19.0760, 
    longitude: 72.8777, 
    region: "West India", 
    quantity: 200, 
    quality: "Grade A" 
  },
  { 
    id: "3", 
    position: latLonToCartesian(10.0827, 102.2707, 1.5), // Chennai, India
    latitude: 13.0827, 
    longitude: 80.2707, 
    region: "South India", 
    quantity: 75, 
    quality: "Premium" 
  },
  { 
    id: "4", 
    position: latLonToCartesian(22.5726, 88.3639, 1.5), // Kolkata, India
    latitude: 22.5726, 
    longitude: 88.3639, 
    region: "East India", 
    quantity: 120, 
    quality: "Grade A" 
  },
  { 
    id: "5", 
    position: latLonToCartesian(12.9716, 102.5946, 1.5), // Bangalore, India
    latitude: 12.9716, 
    longitude: 77.5946, 
    region: "South India", 
    quantity: 180, 
    quality: "Premium" 
  },
]

// Earth texture URLs - using confirmed working textures
const EARTH_DAY_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
const EARTH_NORMAL_MAP_URL = 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'
const EARTH_SPECULAR_MAP_URL = 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'

function HarvestMarker({ point, onHoverChange }: { point: HarvestPoint, onHoverChange: (hovered: boolean) => void }) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const handleHoverIn = () => {
    setHovered(true)
    onHoverChange(true)
  }

  const handleHoverOut = () => {
    setHovered(false)
    onHoverChange(false)
  }

  return (
    <group position={point.position}>
      <Sphere
        ref={meshRef}
        args={[0.015, 16, 16]}
        onPointerOver={handleHoverIn}
        onPointerOut={handleHoverOut}
      >
        <meshStandardMaterial
          color={hovered ? "#f59e0b" : "#10b981"}
          emissive={hovered ? "#f59e0b" : "#10b981"}
          emissiveIntensity={0.3}
        />
      </Sphere>
      {hovered && (
        <Html distanceFactor={5} position={[0, 0.1, 0]}>
          <div className="bg-white px-1 py-0.5 rounded shadow border text-xs w-16">
            <div className="font-semibold text-blue-600 text-xs">{point.region.split(' ')[0]}</div>
            <div className="text-gray-600 text-xs">{point.quantity}kg</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function Globe() {
  // Load confirmed working Earth textures
  const [dayTexture, normalTexture, specularTexture] = useLoader(TextureLoader, [
    EARTH_DAY_TEXTURE_URL,
    EARTH_NORMAL_MAP_URL,
    EARTH_SPECULAR_MAP_URL
  ])
  
  const earthRef = useRef<Mesh>(null)
  const atmosphereRef = useRef<Mesh>(null)
  const [isAnyPointHovered, setIsAnyPointHovered] = useState(false)

  // Track hover state from harvest points
  const handleHoverChange = (hovered: boolean) => {
    setIsAnyPointHovered(hovered)
  }

  // Rotate the Earth slowly only when no point is hovered
  useFrame((state) => {
    if (earthRef.current && !isAnyPointHovered) {
      earthRef.current.rotation.y += 0.0005 // Slowed down from 0.002 to 0.0005
    }
  })

  return (
    <group>
      {/* Main Earth sphere with realistic textures - positioned to show India initially */}
      <Sphere ref={earthRef} args={[1.5, 64, 64]} rotation={[0, -4.2, 0]}>
        <meshLambertMaterial 
          map={dayTexture}
        />
        {/* Harvest points as children of the Earth sphere so they rotate together */}
        {harvestPoints.map((point) => (
          <HarvestMarker key={point.id} point={point} onHoverChange={handleHoverChange} />
        ))}
      </Sphere>
      
      {/* Atmospheric glow effect */}
      <Sphere ref={atmosphereRef} args={[1.55, 64, 64]}>
        <atmosphereShaderMaterial 
          blending={AdditiveBlending}
          side={BackSide}
          transparent
        />
      </Sphere>
    </group>
  )
}

function HarvestGlobe3D() {
  return (
<<<<<<< Updated upstream
    <div className="w-full h-[600px] rounded-lg overflow-hidden bg-card">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 60 }}>
        {/* Background matching typical card color */}
        <color attach="background" args={['#f8fafc']} />
        
        {/* Enhanced lighting for better Earth visibility */}
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={2.5} 
          color="#ffffff"
        />
        <directionalLight 
          position={[-5, -3, -5]} 
          intensity={1.0} 
          color="#ffffff"
        />
        <ambientLight intensity={0.8} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        
        {/* Suspense for texture loading with better fallback */}
        <Suspense fallback={
          <group>
            <Sphere args={[1, 32, 32]}>
              <meshStandardMaterial color="#1e40af" />
            </Sphere>
            {harvestPoints.map((point) => (
              <HarvestMarker key={point.id} point={point} onHoverChange={() => {}} />
            ))}
          </group>
        }>
          <Globe />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={1.5}
          maxDistance={5}
          rotateSpeed={0.5}
        />
=======
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-emerald-50 to-emerald-100">
      <Canvas 
        camera={{ position: [0, 0, 3], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Environment preset="dawn" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Globe />
        <OrbitControls enableZoom={true} enablePan={false} />
>>>>>>> Stashed changes
      </Canvas>
    </div>
  )
}

export default function HarvestGlobe() {
  return (
    <NoSSR 
      fallback={
        <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-emerald-50 to-emerald-100 flex items-center justify-center">
          <div className="text-emerald-600 text-lg">Loading 3D Globe...</div>
        </div>
      }
    >
      <HarvestGlobe3D />
    </NoSSR>
  )
}
