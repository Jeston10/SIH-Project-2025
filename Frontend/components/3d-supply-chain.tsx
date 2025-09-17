"use client"

import { Canvas } from "@react-three/fiber"
import { Box, Cylinder, OrbitControls, Text, Environment } from "@react-three/drei"
import { useRef, useState } from "react"
import type { Group } from "three"

interface SupplyChainStep {
  id: string
  name: string
  position: [number, number, number]
  status: "completed" | "in-progress" | "pending"
  color: string
}

const supplyChainSteps: SupplyChainStep[] = [
  { id: "1", name: "Farm", position: [-3, 0, 0], status: "completed", color: "#10b981" },
  { id: "2", name: "Processing", position: [-1, 0, 0], status: "completed", color: "#10b981" },
  { id: "3", name: "Quality Test", position: [1, 0, 0], status: "in-progress", color: "#f59e0b" },
  { id: "4", name: "Distribution", position: [3, 0, 0], status: "pending", color: "#6b7280" },
]

function SupplyChainNode({ step }: { step: SupplyChainStep }) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  return (
    <group
      ref={groupRef}
      position={step.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[0.8, 0.8, 0.8]}>
        <meshStandardMaterial color={step.color} emissive={step.color} emissiveIntensity={hovered ? 0.3 : 0.1} />
      </Box>
      <Text position={[0, -0.8, 0]} fontSize={0.2} color="#374151" anchorX="center" anchorY="middle">
        {step.name}
      </Text>
      {step.status === "in-progress" && (
        <Cylinder args={[0.1, 0.1, 1.5]} position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
        </Cylinder>
      )}
    </group>
  )
}

function ConnectionLine({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const midPoint: [number, number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2]

  return (
    <group position={midPoint}>
      <Cylinder args={[0.02, 0.02, 1.8]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#d1d5db" />
      </Cylinder>
    </group>
  )
}

function SupplyChain3DComponent() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-r from-emerald-50 to-blue-50">
      <Canvas 
        camera={{ position: [0, 2, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Environment preset="studio" />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />

        {/* Supply chain nodes */}
        {supplyChainSteps.map((step) => (
          <SupplyChainNode key={step.id} step={step} />
        ))}

        {/* Connection lines */}
        {supplyChainSteps.slice(0, -1).map((step, index) => (
          <ConnectionLine key={`connection-${index}`} from={step.position} to={supplyChainSteps[index + 1].position} />
        ))}

        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  )
}

export default function SupplyChain3D() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-r from-emerald-50 to-blue-50">
      <SupplyChain3DComponent />
    </div>
  )
}
