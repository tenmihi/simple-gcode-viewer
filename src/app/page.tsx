'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useEffect, useState } from 'react'
import { GcodeRenderer } from '@/components/gcode-renderer'
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
  const [layerPercent, setLayerPercent] = useState<number>(100)

  const [originalVectorsGroupByZ, setOriginalVectorsGroupByZ] =
    useState<Record<string, Vector3[]>>()
  const [vectorsGroupByZ, setVectorsGroupByZ] =
    useState<Record<string, Vector3[]>>()
  const [sortedZLayers, setSortedZLayers] = useState<number[]>([])

  const inputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files === null) return

    const file = files[0]
    const reader = new FileReader()
    reader.readAsText(file)

    reader.onload = () => {
      const gcode = reader.result as string
      const zToVec3 = convertGcodeToVector3(gcode)

      const zArr = Object.keys(zToVec3)
        .map((z) => Number(z))
        .sort((a, b) => a - b)
      setSortedZLayers(zArr)

      setOriginalVectorsGroupByZ(zToVec3)
    }
  }

  const onChangeLayerPercent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number(event.target.value)
    setLayerPercent(percent)
  }

  useEffect(() => {
    if (originalVectorsGroupByZ === undefined) return

    const filteredVectorsGroupByZ: Record<string, Vector3[]> = {}
    const minZ = sortedZLayers[0]
    const maxZ = sortedZLayers[sortedZLayers.length - 1]
    for (const z of sortedZLayers) {
      const zNum = Number(z)
      if (zNum > (maxZ - minZ) * (layerPercent / 100)) break
      filteredVectorsGroupByZ[zNum] = originalVectorsGroupByZ[zNum]
    }

    setVectorsGroupByZ(filteredVectorsGroupByZ)
  }, [layerPercent, originalVectorsGroupByZ])

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

                      <GcodeRenderer vectorsGroupByZ={vectorsGroupByZ} />
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
                  Print Layer
                </Label>
                <Input
                  className="w-full"
                  id="range"
                  max="100"
                  min="1"
                  step="1"
                  type="range"
                  style={{ paddingLeft: '0', paddingRight: '0' }}
                  onChange={onChangeLayerPercent}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
