'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useState } from 'react'
import { GcodeRender } from '@/components/gcode-render'
import { convertGcodeToVector3 } from '@/lib/gcode-to-vector3-converter'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-3xl p-4 mx-auto">
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                3D Model Viewer
              </CardTitle>
              <CardDescription className="text-gray-500">
                Upload and view your 3D model
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center w-full">
              <div className="w-full h-[500px] bg-gray-200 rounded-lg mb-4">
                {vectorsGroupByZ !== undefined ? (
                  <div
                    id="canvas-container"
                    className="w-full h-full rounded-lg"
                  >
                    <Canvas camera={{ position: [100, 100, 100] }}>
                      <axesHelper args={[200]} />

                      <OrbitControls />

                      <ambientLight intensity={0.5} />
                      <directionalLight
                        intensity={0.5}
                        position={[-10, 10, 10]}
                      />

                      <GcodeRender vectorsGroupByZ={vectorsGroupByZ} />
                    </Canvas>
                  </div>
                ) : (
                  <img
                    alt="Gcode is not loaded"
                    className="object-cover w-full h-full rounded-lg"
                    height="500"
                    src="https://placeholder.pics/svg/500x1000/DEDEDE/555555/Gcode%20is%20not%20loaded"
                    style={{
                      aspectRatio: '1000/500',
                      objectFit: 'cover'
                    }}
                    width="1000"
                  />
                )}
              </div>
              <div className="w-full grid items-center gap-4">
                <Label className="text-left" htmlFor="model">
                  Upload 3D Model
                </Label>
                <Input
                  className="w-full"
                  id="model"
                  type="file"
                  accept=".gcode"
                  onChange={inputFile}
                />
                <Label className="text-left" htmlFor="range">
                  Adjust Zoom
                </Label>
                <Input
                  className="w-full"
                  id="range"
                  max="100"
                  min="1"
                  type="range"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
