class Token {
    constructor(stringValue, tokenType) {
        this.stringValue = stringValue //String
        this.tokenType = tokenType //String
        this.childTokens = [] //Array
    }

    parseStringValue() {
        const [preComment, comment] = seperateByFirstOccurence(this.stringValue, "%")
        const expressions = preComment.split(" ")
        expressions.forEach(expression => {
            if (expression != "") {
                this.childTokens.push(new Token(expression, "expression"))
            }
        })
        this.childTokens.push(new Token(comment, "comment"))
    }

}

export const seperateByFirstOccurence = (string, seperator) => {
    const [before, ...rest] = string.split(seperator)
    const after = rest.join(seperator)
    return [before, after]
}

export const parseLatex = (rawInput) => {
    const lines = rawInput.split("\n")
    const tokens = []
    lines.forEach(line => {
        tokens.push(new Token(line, "line"))
    });
    tokens.forEach(token => {
        token.parseStringValue()
    })
    console.log(tokens)
}