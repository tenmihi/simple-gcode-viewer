import { Vector3, BufferGeometry } from 'three'

type Prop = { vectorsGroupByZ: Record<number, Vector3[]> }

export const GcodeRender = ({ vectorsGroupByZ }: Prop) => {
  const zArr = Object.keys(vectorsGroupByZ)
    .map((z) => Number(z))
    .sort((a, b) => a - b)

  const zRange = zArr[zArr.length - 1] - zArr[0]

  const lines = zArr.map((z) => {
    const vectors = vectorsGroupByZ[z]
    const lineGeometry = new BufferGeometry().setFromPoints(vectors)
    const colorL = 20 + (40 / zRange) * z

    return (
      <line key={z}>
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial
          attach="material"
          color={`hsl(150,30%,${colorL}%)`}
          linewidth={10}
          linecap={'round'}
          linejoin={'round'}
        />
      </line>
    )
  })
  return (
    <>
      <group position={[0, -2.5, -10]}>{lines}</group>
    </>
  )
}
