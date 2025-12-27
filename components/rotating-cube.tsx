"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function AudioRipple() {
  const groupRef = useRef<THREE.Group>(null!)
  const count = 64
  const radius = 1.8

  const bars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      return { x, y, angle }
    })
  }, [count, radius])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    groupRef.current.children.forEach((child, i) => {
      const scale = 0.5 + Math.sin(time * 1.2 + i * 0.2) * 0.3 + Math.random() * 0.05
      child.scale.y = scale
    })
    groupRef.current.rotation.x += 0.0015
    groupRef.current.rotation.y += 0.002
    groupRef.current.rotation.z += 0.001
  })

  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <mesh key={i} position={[bar.x, bar.y, 0]} rotation={[0, 0, bar.angle + Math.PI / 2]}>
          <boxGeometry args={[0.05, 1, 0.05]} />
          <meshBasicMaterial color="#1e1e1e" />
        </mesh>
      ))}
    </group>
  )
}

function GridCube() {
  const meshRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.15
    meshRef.current.rotation.y += delta * 0.2
  })

  const lines = useMemo(() => {
    const size = 2
    const segments = 3
    const step = size / segments
    const tempLines = []

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const offset = -size / 2 + i * step
        const otherOffset = -size / 2 + j * step

        tempLines.push(
          <line key={`x-${i}-${j}`}>
            <bufferGeometry
              attach="geometry"
              onUpdate={(self) =>
                self.setFromPoints([
                  new THREE.Vector3(-size / 2, offset, otherOffset),
                  new THREE.Vector3(size / 2, offset, otherOffset),
                ])
              }
            />
            <lineBasicMaterial attach="material" color="#1e1e1e" linewidth={1} />
          </line>,
          <line key={`y-${i}-${j}`}>
            <bufferGeometry
              attach="geometry"
              onUpdate={(self) =>
                self.setFromPoints([
                  new THREE.Vector3(offset, -size / 2, otherOffset),
                  new THREE.Vector3(offset, size / 2, otherOffset),
                ])
              }
            />
            <lineBasicMaterial attach="material" color="#1e1e1e" linewidth={1} />
          </line>,
          <line key={`z-${i}-${j}`}>
            <bufferGeometry
              attach="geometry"
              onUpdate={(self) =>
                self.setFromPoints([
                  new THREE.Vector3(offset, otherOffset, -size / 2),
                  new THREE.Vector3(offset, otherOffset, size / 2),
                ])
              }
            />
            <lineBasicMaterial attach="material" color="#1e1e1e" linewidth={1} />
          </line>,
        )
      }
    }
    return tempLines
  }, [])

  return <group ref={meshRef}>{lines}</group>
}

export default function RotatingCube() {
  return (
    <div className="w-full h-[400px] md:h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <GridCube />
        <AudioRipple />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
