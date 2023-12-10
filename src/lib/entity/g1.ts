import { GcodeOp } from './gcode-op'

export class G1 extends GcodeOp {
  x: number | null = null
  y: number | null = null
  z: number | null = null
  e: number | null = null

  constructor(lineNumber: number, args: Record<string, string>) {
    super(lineNumber, 'g1', args, 'move to specific position')

    if (args.x) {
      this.x = GcodeOp.parseNumericArg(args.x)
    }
    if (args.y) {
      this.y = GcodeOp.parseNumericArg(args.y)
    }
    if (args.z) {
      this.z = GcodeOp.parseNumericArg(args.z)
    }
    if (args.e) {
      this.e = GcodeOp.parseNumericArg(args.e)
    }
  }

  isMoving() {
    return this.x !== null || this.y !== null || this.z !== null
  }

  isExtrude() {
    return this.e !== null && this.e > 0
  }
}
