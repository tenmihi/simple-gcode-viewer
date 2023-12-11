import { Vector3 } from 'three'
import { G1 } from './entity/g1'
import { parseFile } from './gcode-parser'

export const convertGcodeToVector3 = (
  gcode: string
): Record<number, Vector3[]> => {
  const gcodes = parseFile(gcode).filter(
    (g) => g instanceof G1 && g.isMoving()
  ) as G1[]

  const positions = []
  let lastPos = { x: 0, y: 0, z: 0 }
  let minPos = { x: 0, y: 0 }
  let maxPos = { x: 0, y: 0 }

  for (const gcode of gcodes) {
    const pos = {
      x: gcode.x || lastPos.x,
      y: gcode.y || lastPos.y,
      z: gcode.z || lastPos.z
    }

    if (gcode.isExtrude()) {
      positions.push(pos)
    }

    lastPos = { x: pos.x, y: pos.y, z: pos.z }

    if (pos.x < minPos.x) minPos.x = pos.x
    if (pos.x > maxPos.x) maxPos.x = pos.x
    if (pos.y < minPos.y) minPos.y = pos.y
    if (pos.y > maxPos.y) maxPos.y = pos.y
  }

  const centerPos = {
    x: (maxPos.x - minPos.x) / 2,
    y: (maxPos.y - minPos.y) / 2
  }

  const zToVec3: Record<number, Vector3[]> = []
  for (const pos of positions) {
    if (zToVec3[pos.z] === undefined) {
      zToVec3[pos.z] = []
    }
    zToVec3[pos.z].push(
      new Vector3(pos.x - centerPos.x, pos.z, pos.y - centerPos.y)
    )
  }

  return zToVec3
}
