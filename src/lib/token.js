export default class Token {
    constructor(stringValue, tokenType, children) {
        this.stringValue = stringValue
        this.tokenType = tokenType
        this.children = children
    }
}