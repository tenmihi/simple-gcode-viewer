import { GcodeOp } from './gcode-op'

export class NotSupportedOp extends GcodeOp {
  constructor(lineNumber: number, args: Record<string, string>) {
    super(lineNumber, 'not-supported', args, 'Not supported')
  }
}
