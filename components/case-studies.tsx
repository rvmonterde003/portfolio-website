"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Text } from "@react-three/drei"
import * as THREE from "three"
import type { Group, Mesh } from "three"
import { Phone } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

function RotatingDotSphere({ color }: { color: string }) {
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
      <PointMaterial transparent color={color} size={0.04} sizeAttenuation={true} depthWrite={false} />
    </Points>
  )
}

export function DotSphereSection() {
  const { resolvedTheme } = useTheme()
  const dotColor = resolvedTheme === "light" ? "#1e1e1e" : "#e4e4e4"

  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <RotatingDotSphere color={dotColor} />
      </Canvas>
    </div>
  )
}

export function DialingPhone() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] bg-transparent">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-20 h-20 border border-line/20 rounded-full animate-ripple" />
        <div className="absolute w-20 h-20 border border-line/20 rounded-full animate-ripple [animation-delay:1s]" />
        <div className="absolute w-20 h-20 border border-line/20 rounded-full animate-ripple [animation-delay:2s]" />
        <div className="relative z-10 bg-surface p-6 rounded-full border border-line/15 shadow-sm">
          <Phone className="w-8 h-8 text-ink" strokeWidth={1.5} />
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

function Coin({ bodyColor, inkColor }: { bodyColor: string; inkColor: string }) {
  const groupRef = useRef<Group>(null)
  const coinRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 1.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main coin body */}
      <mesh ref={coinRef}>
        <cylinderGeometry args={[2, 2, 0.2, 64]} />
        <meshBasicMaterial color={bodyColor} />
      </mesh>

      {/* Outline mesh - scaled up with inverted normals */}
      <mesh scale={[1.03, 1.15, 1.03]}>
        <cylinderGeometry args={[2, 2, 0.2, 64]} />
        <meshBasicMaterial color={inkColor} side={THREE.BackSide} />
      </mesh>

      {/* Front face - Dollar sign */}
      <Text
        position={[0, 0.11, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.2}
        color={inkColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={inkColor}
      >
        $
      </Text>

      {/* Back face - Dollar sign */}
      <Text
        position={[0, -0.11, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        fontSize={1.2}
        color={inkColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={inkColor}
      >
        $
      </Text>
    </group>
  )
}

export function SpinningDollar() {
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === "light"
  const bodyColor = isLight ? "#e4e4e4" : "#1e1e1e"
  const inkColor = isLight ? "#1e1e1e" : "#e4e4e4"

  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Coin bodyColor={bodyColor} inkColor={inkColor} />
      </Canvas>
    </div>
  )
}

export function PixelCharacter() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const pixelColor = resolvedTheme === "light" ? "#1e1e1e" : "#e4e4e4"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frameCount = 0
    let animationFrameId = 0
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
      ctx.fillStyle = pixelColor
      currentFrame.forEach((row, y) => {
        row.forEach((pixel, x) => {
          if (pixel === 1) ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
        })
      })
      frameCount++
      animationFrameId = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(animationFrameId)
  }, [pixelColor])

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]">
      <div className="relative w-full overflow-hidden border-b border-line/15 py-8">
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

export function CostMeter() {
  const bars = [
    { label: "Before", width: "100%", note: "Every session re-reads the codebase" },
    { label: "After", width: "30%", note: "Memory + code graph, right model per task" },
  ]

  return (
    <div className="flex flex-col justify-center w-full h-full min-h-[300px] px-10 gap-10 bg-transparent">
      {bars.map((bar, i) => (
        <div key={bar.label} className="space-y-3">
          <div className="flex items-baseline justify-between font-atkinson text-[10px] uppercase tracking-widest">
            <span className="font-black">{bar.label}</span>
            <span className="opacity-40">{bar.note}</span>
          </div>
          <div className="h-6 w-full border border-line/15 rounded-sm overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: bar.width }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut", delay: i * 0.4 }}
              className={i === 0 ? "h-full bg-ink/30" : "h-full bg-ink"}
            />
          </div>
        </div>
      ))}
      <div className="font-atkinson text-[10px] uppercase tracking-widest opacity-40">AI coding spend, same workload</div>
    </div>
  )
}
