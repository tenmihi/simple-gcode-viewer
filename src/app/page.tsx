'use client'

import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  AccumulativeShadows,
  RandomizedLight
} from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { GcodeParser } from '@/lib/gcode-parser'
import { BufferGeometry, Vector3 } from 'three'
import { G1 } from '@/lib/entity/g1'
import { useState } from 'react'

type Prop = { vector3s: Vector3[]; currentLine: number }

const LinesFromGcode = (props: Prop) => {
  const lineGeometry = new BufferGeometry().setFromPoints(props.vector3s)
  return (
    <>
      <group position={[0, -2.5, -10]}>
        <line>
          <bufferGeometry attach="geometry" {...lineGeometry} />
          <lineBasicMaterial
            attach="material"
            color={'#9c88ff'}
            linewidth={10}
            linecap={'round'}
            linejoin={'round'}
          />
        </line>
      </group>
    </>
  )
}

export default function Home() {
  const [currentLine, setCurrentLine] = useState(2)
  const [vector3s, setVector3s] = useState<Vector3[]>([])
  const intensity = 4

  const increaseLine = () => {
    setCurrentLine((prev) => prev + 1)
    console.log(currentLine)
  }

  const inputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files === null) return

    const file = files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      const gcodes = new GcodeParser()
        .parseFile(reader.result as string)
        .filter((g) => g instanceof G1 && g.isMoving()) as G1[]

      const vectors = []
      let lastPoint = { x: 0, y: 0, z: 0 }
      for (const gcode of gcodes) {
        const vec = new Vector3(
          gcode.x || lastPoint.x,
          gcode.y || lastPoint.y,
          gcode.z || lastPoint.z
        )
        if (gcode.isExtrude()) {
          vectors.push(vec)
        }
        lastPoint = { x: vec.x, y: vec.y, z: vec.z }
      }
      setVector3s(vectors)
    }
  }

  return (
    <>
      <div id="canvas-container" style={{ width: '50vw', height: '50vh' }}>
        <Canvas>
          <OrbitControls makeDefault />

          <Perf position="top-left" />
          <ambientLight intensity={intensity} />
          <hemisphereLight intensity={0.5} />

          <AccumulativeShadows temporal frames={100} scale={10}>
            <RandomizedLight amount={8} position={[5, 5, -10]} />
          </AccumulativeShadows>

          <LinesFromGcode currentLine={currentLine} vector3s={vector3s} />
        </Canvas>
      </div>
      <input type="file" id="input" accept=".gcode" onChange={inputFile} />
      <button onClick={increaseLine}>Write</button>
    </>
  )
}
