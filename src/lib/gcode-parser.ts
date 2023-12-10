import { GcodeOp } from './entity/gcode-op'
import { G1 } from './entity/g1'
import { Comment } from './entity/comment'

export class GcodeParser {
  constructor() {
    console.log('GcodeParser constructor')
  }

  parseFile(file: string): GcodeOp[] {
    const lines = file.split('\n')
    return lines.map((line, index) => this.parseLine(line, index))
  }

  parseLine(line: string, lineNumber: number = 0): GcodeOp {
    const [operation, comment] = line.split(';')
    if (operation.length === 0) {
      return new Comment(lineNumber, comment)
    }

    const [op, ...args] = operation.split(' ')

    const argMap: Record<string, string> = {}
    args.forEach((arg) => {
      const prefix = arg.match(/^[A-Za-z]/)
      if (prefix) {
        argMap[prefix[0].toString().toLowerCase()] = arg.slice(0)
      } else {
        console.log(`Skipped arg: ${arg}`)
      }
    })

    switch (op) {
      case 'G1':
        return new G1(lineNumber, argMap)
      default:
        console.log(`Unsupported operation: ${op}`)
        return new Comment(lineNumber, 'Not supported')
    }
  }
}
