import { GcodeOp } from './gcode-op'

export class Comment extends GcodeOp {
  text: string = ''

  constructor(lineNumber: number, text: string) {
    super(lineNumber, 'comment', {}, 'comment')

    this.text = text
  }
}
