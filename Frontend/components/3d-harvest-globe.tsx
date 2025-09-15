"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Html, Environment } from "@react-three/drei"
import { useRef, useState } from "react"
import type { Mesh } from "three"

interface HarvestPoint {
  id: string
  position: [number, number, number]
  crop: string
  quantity: number
  quality: string
}

const harvestPoints: HarvestPoint[] = [
  { id: "1", position: [1, 0.5, 0.5], crop: "Turmeric", quantity: 150, quality: "Premium" },
  { id: "2", position: [-0.8, 0.3, -0.6], crop: "Ginger", quantity: 200, quality: "Grade A" },
  { id: "3", position: [0.2, -0.9, 0.4], crop: "Cardamom", quantity: 75, quality: "Premium" },
  { id: "4", position: [-0.5, 0.8, -0.3], crop: "Black Pepper", quantity: 120, quality: "Grade A" },
]

function HarvestMarker({ point }: { point: HarvestPoint }) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  return (
    <group position={point.position}>
      <Sphere
        ref={meshRef}
        args={[0.05, 16, 16]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#f59e0b" : "#10b981"}
          emissive={hovered ? "#f59e0b" : "#10b981"}
          emissiveIntensity={0.3}
        />
      </Sphere>
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-white p-2 rounded-lg shadow-lg border text-xs min-w-32">
            <div className="font-semibold text-emerald-700">{point.crop}</div>
            <div className="text-gray-600">{point.quantity}kg</div>
            <div className="text-emerald-600">{point.quality}</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function Globe() {
  return (
    <group>
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial color="#065f46" transparent opacity={0.8} wireframe />
      </Sphere>
      {harvestPoints.map((point) => (
        <HarvestMarker key={point.id} point={point} />
      ))}
    </group>
  )
}

export default function HarvestGlobe() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-emerald-50 to-emerald-100">
      <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
        <Environment preset="dawn" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Globe />
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  )
}
