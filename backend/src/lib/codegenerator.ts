import { randomBytes } from 'crypto'

export class CodeGenerator {
    private static CHARS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    private static CODE_LENGTH: number = 4

    static generate(): string {
        const bytes = randomBytes(CodeGenerator.CODE_LENGTH)
        const code = Array.from(bytes).map((byte) => CodeGenerator.CHARS.charAt(byte % CodeGenerator.CHARS.length)).join('')
        return code
    }
}
