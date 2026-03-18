
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

    updateSpans() {

        var maxX = -Infinity
        var maxY = -Infinity
        var minX = Infinity
        var minY = Infinity

        this.htmlSpans.forEach(span => {
            var box = span.getBoundingClientRect()
            maxX = Math.max(box.right, maxX)
            maxY = Math.max(box.bottom, maxY)
            minX = Math.min(box.left, minX)
            minY = Math.min(box.top, minY)
        })
        
        this.boxDiv = document.createElement("div")

        this.boxDiv.style.position = "fixed"
        this.boxDiv.style.left = minX + "px"
        this.boxDiv.style.top = minY + "px"
        this.boxDiv.style.width = (maxX - minX) + "px"
        this.boxDiv.style.height = (maxY - minY) + "px"
        
        this.boxDiv.contentEditable = true

        this.boxDiv.addEventListener("mouseenter", () => {
            this.boxDiv.classList.add("hovered-box")
        })
        this.boxDiv.addEventListener("mouseleave", () => {
            this.boxDiv.classList.remove("hovered-box")
        })
        this.boxDiv.addEventListener("focus", () => {
            this.boxDiv.classList.add("focused-box")
        })
        this.boxDiv.addEventListener("blur", () => {
            this.boxDiv.classList.remove("focused-box")
        })

        document.getElementById("bBox-container").appendChild(this.boxDiv)
    }

}