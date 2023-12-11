'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useState } from 'react'
import { GcodeRender } from '@/components/gcode-render'
import { convertGcodeToVector3 } from '@/lib/gcode-to-vector3-converter'

export default function Home() {
  const [vectorsGroupByZ, setVectorsGroupByZ] =
    useState<Record<number, Vector3[]>>()

  const inputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files === null) return

    const file = files[0]
    const reader = new FileReader()
    reader.readAsText(file)

    reader.onload = () => {
      const gcode = reader.result as string
      const zToVec3 = convertGcodeToVector3(gcode)
      setVectorsGroupByZ(zToVec3)
    }
  }

  return (
    <>
      <div id="canvas-container" style={{ width: '50vw', height: '50vh' }}>
        <Canvas camera={{ position: [100, 100, 100] }}>
          <axesHelper args={[200]} />

          <OrbitControls />

          <ambientLight intensity={0.5} />
          <directionalLight intensity={0.5} position={[-10, 10, 10]} />

          {vectorsGroupByZ !== undefined && (
            <GcodeRender vectorsGroupByZ={vectorsGroupByZ} />
          )}
        </Canvas>
      </div>
      <input type="file" id="input" accept=".gcode" onChange={inputFile} />
    </>
  )
}
