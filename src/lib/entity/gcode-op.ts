const GcodeOperations = {
  G1: 'G1'
} as const

export type GcodeOperation =
  (typeof GcodeOperations)[keyof typeof GcodeOperations]

export abstract class GcodeOp {
  constructor(
    public lineNumber: number,
    public operation: string,
    public args: Record<string, string>,
    public description: string
  ) {}

  static parseNumericArg(arg: string): number {
    return parseFloat(arg.slice(1))
  }
}
