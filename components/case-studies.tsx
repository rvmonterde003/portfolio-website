"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Text3D, Center } from "@react-three/drei"
import * as THREE from "three"
import { Phone } from "lucide-react"

function RotatingDotSphere() {
  const pointsRef = useRef<THREE.Points>(null!)

  const positions = useMemo(() => {
    const count = 500
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      const x = Math.cos(theta) * Math.sin(phi)
      const y = Math.sin(theta) * Math.sin(phi)
      const z = Math.cos(phi)
      const radius = 1.5
      pos[i * 3] = x * radius
      pos[i * 3 + 1] = y * radius
      pos[i * 3 + 2] = z * radius
    }
    return pos
  }, [])

  useFrame(() => {
    pointsRef.current.rotation.y += 0.005
    pointsRef.current.rotation.x += 0.002
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#1e1e1e" size={0.04} sizeAttenuation={true} depthWrite={false} />
    </Points>
  )
}

export function DotSphereSection() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <RotatingDotSphere />
      </Canvas>
    </div>
  )
}

export function DialingPhone() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] bg-transparent">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-20 h-20 border border-black/20 rounded-full animate-ripple" />
        <div className="absolute w-20 h-20 border border-black/20 rounded-full animate-ripple [animation-delay:1s]" />
        <div className="absolute w-20 h-20 border border-black/20 rounded-full animate-ripple [animation-delay:2s]" />
        <div className="relative z-10 bg-[#e4e4e4] p-6 rounded-full border border-black/10 shadow-sm">
          <Phone className="w-8 h-8 text-black" strokeWidth={1.5} />
        </div>
      </div>
      <style jsx>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 3s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
      `}</style>
    </div>
  )
}

function SpinningDollarSign() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    groupRef.current.rotation.y += 0.015
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
  })

  // Create dollar sign shape using lines and curves
  const dollarShape = useMemo(() => {
    const shape = new THREE.Shape()
    
    // S curve of dollar sign (simplified)
    shape.moveTo(0.3, 0.8)
    shape.bezierCurveTo(0.3, 0.95, 0.1, 1, -0.1, 1)
    shape.bezierCurveTo(-0.4, 1, -0.5, 0.85, -0.5, 0.7)
    shape.bezierCurveTo(-0.5, 0.55, -0.3, 0.45, 0, 0.35)
    shape.bezierCurveTo(0.3, 0.25, 0.5, 0.15, 0.5, -0.05)
    shape.bezierCurveTo(0.5, -0.25, 0.3, -0.4, 0, -0.4)
    shape.bezierCurveTo(-0.2, -0.4, -0.35, -0.35, -0.4, -0.25)
    
    return shape
  }, [])

  return (
    <group ref={groupRef} scale={1.8}>
      {/* Main S curve */}
      <mesh>
        <extrudeGeometry 
          args={[dollarShape, { 
            depth: 0.15, 
            bevelEnabled: true, 
            bevelThickness: 0.02, 
            bevelSize: 0.02, 
            bevelSegments: 3,
            curveSegments: 32
          }]} 
        />
        <meshBasicMaterial color="#1e1e1e" />
      </mesh>
      
      {/* Vertical line through dollar sign */}
      <mesh position={[0, 0.3, 0.075]}>
        <boxGeometry args={[0.12, 1.6, 0.15]} />
        <meshBasicMaterial color="#1e1e1e" />
      </mesh>
      
      {/* Wireframe outline for depth */}
      <lineSegments position={[0, 0, 0.075]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.12, 1.6, 0.15)]} />
        <lineBasicMaterial color="#1e1e1e" linewidth={1} />
      </lineSegments>
    </group>
  )
}

export function SpinningDollar() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <SpinningDollarSign />
      </Canvas>
    </div>
  )
}

export function PixelCharacter() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frameCount = 0
    const pixelSize = 8
    const runFrames = [
      [
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 0],
      ],
      [
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 1, 0, 0],
      ],
    ]

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const frameIndex = Math.floor(frameCount / 10) % runFrames.length
      const currentFrame = runFrames[frameIndex]
      ctx.fillStyle = "#1e1e1e"
      currentFrame.forEach((row, y) => {
        row.forEach((pixel, x) => {
          if (pixel === 1) ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
        })
      })
      frameCount++
      requestAnimationFrame(draw)
    }
    draw()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]">
      <div className="relative w-full overflow-hidden border-b border-black/10 py-8">
        <div className="animate-pixel-move">
          <canvas ref={canvasRef} width={64} height={64} className="mx-auto" />
        </div>
      </div>
      <style jsx global>{`
        @keyframes pixel-move {
          0% { transform: translateX(-50px); }
          100% { transform: translateX(50px); }
        }
        .animate-pixel-move {
          animation: pixel-move 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}
