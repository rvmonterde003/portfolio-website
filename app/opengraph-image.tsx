import { ImageResponse } from "next/og"

export const alt = 'Rommel "Mel" Monterde | AI Agents, Physical AI & Hardware Prototyping'
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#141414",
          color: "#e4e4e4",
          padding: "80px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: -2, textTransform: "uppercase" }}>
          {'ROMMEL "MEL" MONTERDE'}
        </div>
        <div style={{ display: "flex", fontSize: 36, marginTop: 28, opacity: 0.8 }}>
          AI Agents · Physical AI · Hardware Prototyping
        </div>
        <div style={{ display: "flex", position: "absolute", left: 80, bottom: 56, fontSize: 24, opacity: 0.55 }}>
          monterdesystems.xyz
        </div>
      </div>
    ),
    { ...size },
  )
}
