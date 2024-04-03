import { randomBytes } from 'crypto'

export class CodeGenerator {
    private static CHARS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    private static CODE_LENGTH: number = 4
    private static codes_generated: string[] = []

    static generate(): string {
        let code = ''
        
        do {
            // Generate a random index for each character in the code
            const bytes = randomBytes(CodeGenerator.CODE_LENGTH)
            code = Array.from(bytes).map((byte) => CodeGenerator.CHARS.charAt(byte % CodeGenerator.CHARS.length)).join('')
        } while (CodeGenerator.codes_generated.includes(code))
        
        CodeGenerator.codes_generated.push(code)
        return code
    }
}
