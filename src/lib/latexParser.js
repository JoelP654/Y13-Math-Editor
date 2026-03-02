// import jsonExpressions from "./expressions.json" with { type: 'json' }

class Token {
    constructor(stringValue, tokenType) {
        this.stringValue = stringValue
        this.tokenType = tokenType
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

// Returns an array of expressions
const parseChunk = (input) => {
    var values = []
    var valueBuffer = []

    for (var i = 0; i < input.length; i++) {
        if (input[i] == " ") {
            values.push(valueBuffer.join(""))
            valueBuffer = []
        } else {
            valueBuffer.push(input[i])
        }
    }
    values.push(valueBuffer.join(""))
    return values
}

// Returns an array of tokens, minimal nesting
export const parseLatex = (input) => {
    var lines = parseLines(input)
    var tokens = []
    lines.forEach(line => {
        var result = parseComment(line)
        console.log(result)
        var expressions = parseChunk(result.preComment)
        expressions.forEach(expression => {
            tokens.push(new Token(expression, "expression"))
        })
        if (result.comment != "") {
            tokens.push(new Token(result.comment, "comment"))
        }
    })
    console.log(tokens)
}