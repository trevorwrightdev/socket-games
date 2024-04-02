export class CodeGenerator {
    private static CHARS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    private static CODE_LENGTH: number = 4
    private static codes_generated: string[] = []

    static generate(): string {
        let code = ''
        
        do {
            code = ''
            for (let i = 0; i < CodeGenerator.CODE_LENGTH; i++) {
                code += CodeGenerator.CHARS.charAt(Math.floor(Math.random() * CodeGenerator.CHARS.length))
            }
        } while (CodeGenerator.codes_generated.includes(code))
        
        CodeGenerator.codes_generated.push(code)
        return code
    }
}