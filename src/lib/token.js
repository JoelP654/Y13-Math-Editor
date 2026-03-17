
// Token is currently just a container for variables
// Eventually, I will add functionality to the class, probably for detecting input and rendering
export default class Token {
    constructor(stringValue, tokenType, children) {
        this.stringValue = stringValue
        this.tokenType = tokenType
        
        if (children) {this.children = children}
        else {this.children = []}
        
        this.htmlSpans = []
    }
}