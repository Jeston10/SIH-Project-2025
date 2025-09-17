"use client"

import { Canvas } from "@react-three/fiber"
import { Sphere, Box, OrbitControls, Text, Environment } from "@react-three/drei"
import { useRef, useState } from "react"
import type { Group } from "three"
import NoSSR from "./NoSSR"

interface QualityMetric {
  name: string
  value: number
  position: [number, number, number]
  color: string
}

const qualityMetrics: QualityMetric[] = [
  { name: "Purity", value: 95, position: [0, 1.5, 0], color: "#10b981" },
  { name: "Moisture", value: 12, position: [1.3, 0.75, 0], color: "#3b82f6" },
  { name: "Pesticides", value: 2, position: [1.3, -0.75, 0], color: "#ef4444" },
  { name: "Heavy Metals", value: 1, position: [0, -1.5, 0], color: "#f59e0b" },
  { name: "Microbial", value: 8, position: [-1.3, -0.75, 0], color: "#8b5cf6" },
  { name: "Nutritional", value: 88, position: [-1.3, 0.75, 0], color: "#06b6d4" },
]

function QualityNode({ metric }: { metric: QualityMetric }) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  const height = (metric.value / 100) * 2 + 0.2

  return (
    <group
      ref={groupRef}
      position={metric.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[0.3, height, 0.3]} position={[0, height / 2 - 1, 0]}>
        <meshStandardMaterial color={metric.color} emissive={metric.color} emissiveIntensity={hovered ? 0.4 : 0.2} />
      </Box>
      <Text position={[0, -1.3, 0]} fontSize={0.15} color="#374151" anchorX="center" anchorY="middle">
        {metric.name}
      </Text>
      <Text position={[0, -1.5, 0]} fontSize={0.12} color="#6b7280" anchorX="center" anchorY="middle">
        {metric.value}%
      </Text>
    </group>
  )
}

function QualityVisualization3DComponent() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <Canvas 
        camera={{ position: [3, 2, 3], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />

        {/* Central sphere */}
        <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#065f46" transparent opacity={0.3} wireframe />
        </Sphere>

        {/* Quality metrics */}
        {qualityMetrics.map((metric, index) => (
          <QualityNode key={index} metric={metric} />
        ))}

        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  )
}

export default function QualityVisualization3D() {
  return (
    <NoSSR 
      fallback={
        <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-blue-600 text-lg">Loading Quality Visualization...</div>
        </div>
      }
    >
      <QualityVisualization3DComponent />
    </NoSSR>
  )
}
