import jsonExpressions from "./expressions.json" with { type: 'json' }

class Token {
    constructor(stringValue, tokenType) {
        this.stringValue = stringValue //String
        this.tokenType = tokenType //String
        this.childTokens = [] //Array
    }

    parseStringValue() {
        switch (this.tokenType) {

            case "line": {
                const [preComment, comment] = seperateByFirstOccurence(this.stringValue, "%")
                const chunks = preComment.split(" ")
                chunks.forEach(chunk => {
                    if (chunk != "") {
                        const newToken = new Token(chunk, "chunk")
                        newToken.parseStringValue()
                        this.childTokens.push(newToken)
                    }
                })
                this.childTokens.push(new Token(comment, "comment"))
                break
            }

            case "chunk": {
                // Recognise expressions
                const [before, ...expressions] = this.stringValue.split("\\")
                const newTokens = [new Token(before, "value")]
                expressions.forEach(expression => {
                    if (!jsonExpressions.includes(expression)) {
                        newTokens.push(new Token(("\\backslash " + expression), "value"))
                        // throw new Error("Unrecognised expression: " + expression)
                    } else {
                        newTokens.push(new Token((expression), "expression"))
                    }
                this.childTokens = newTokens
                })
            }
        }
    }
}

export const seperateByFirstOccurence = (string, seperator) => {
    const [before, ...rest] = string.split(seperator)
    const after = rest.join(seperator)
    return [before, after]
}

export const parseLatex = (rawInput) => {
    console.log(rawInput)
    if (rawInput != "") {
        var lines = rawInput.split("\n").join("\\\\").split("\\\\").join("\\newline").split("\\newline")
        const tokens = []
        lines.forEach(line => {
            tokens.push(new Token(line, "line"))
        });
        tokens.forEach(token => {
            token.parseStringValue()
        })
        console.log(tokens)
    }
}