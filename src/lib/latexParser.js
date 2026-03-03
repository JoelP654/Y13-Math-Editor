class Token {
    constructor(stringValue, tokenType, children) {
        this.stringValue = stringValue
        this.tokenType = tokenType
        this.children = children
    }
}

const seperateByFirstOccurence = (string, seperator) => {
    const [before, ...rest] = string.split(seperator)
    const after = rest.join(seperator)
    return [before, after]
}

const parseLines = (input) => {
    if (input != "") {
        var lines = input.split("\n").join("\\\\").split("\\\\").join("\\newline").split("\\newline")
        return lines
    } else {
        return []
    }
}

// Returns array of length two, with before and after comment
const parseComment = (input) => {
    if (input.includes("%")) {
        const [preComment, comment] = seperateByFirstOccurence(input, "%")
        return {
            "comment": comment,
            "preComment": preComment
        }
    } else {
        return {
            "comment": "",
            "preComment": input
        }
    }
}

// Returns an array of TOKENs
const parseChunk = (input) => {
    var tokens = []
    var scanBuffer = []
    var curlyBraces = 0
    var braceBuffer = []
    var inExpression = false

    const writeScanBuffer = () => {
        if (scanBuffer.length > 0) {
            tokens.push(new Token(scanBuffer.join(""), "expression"))
        }
        scanBuffer = []
    }

    for (var i = 0; i < input.length; i++) {

        if (input[i] == "{") {
            curlyBraces += 1
        }
        if (input[i] == "}") {
            curlyBraces -= 1
            if (curlyBraces < 0) {
                return ["ERROR: Unresolved }"]
            }
            if (curlyBraces == 0) {
                if (inExpression) {
                    tokens.push(new Token(scanBuffer.join(""), "expression", parseChunk(braceBuffer.join(""))))
                    scanBuffer = []
                    braceBuffer = []
                    inExpression = false
                } else {
                    writeScanBuffer()
                    tokens.push(...parseChunk(braceBuffer.join("")))
                    braceBuffer = []
                }
            }
        }

        if (curlyBraces == 0) {

            if (input[i] == " ") {
                writeScanBuffer()
                inExpression = false
                continue
            }
            if (input[i] == "\\") {
                writeScanBuffer()
                inExpression = true
            }
            
            if (input[i] == "{" && curlyBraces == 1) {continue}
            else if (input[i] == "}" && curlyBraces == 0) {continue}
            else {scanBuffer.push(input[i])}
            
        } else {

            if (!(input[i] == "{" && curlyBraces == 1)) {
                braceBuffer.push(input[i])
            }

        }
    }
    
    if (curlyBraces > 0) {
        return ["ERROR: Unresolved {"]
    }

    writeScanBuffer()
    return tokens
}

// Returns an array of tokens, minimal nesting
export const parseLatex = (input) => {
    var lines = parseLines(input)
    var tokens = []
    lines.forEach(line => {
        var result = parseComment(line)
        tokens.push(...parseChunk(result.preComment))

        if (result.comment != "") {
            tokens.push(new Token(result.comment, "comment"))
        }
    })
    console.log(tokens)
}