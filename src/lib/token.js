// Joel Patterson
// 21/3/26
// Token Class
// Token object holds variables, and contains functionality for input

import { identifySymbol } from "./symbolIdentifier.jsx"

export default class Token {

    // On class init, setup variables
    constructor(stringValue, tokenIndex, children) {

        this.stringValue = stringValue

        // Get identified value
        this.identifyText = identifySymbol(stringValue)

        this.tokenIndex = tokenIndex
        
        if (children) {this.children = children}
        else {this.children = []}
        
        this.htmlSpans = []
        this.setFocusIndex = () => {}
    }

    // When spans are received, this function is called
    // It sets up the input
    updateSpans() {


        // Calculate bounding box, maxX and so on
        var maxX = -Infinity
        var maxY = -Infinity
        var minX = Infinity
        var minY = Infinity

        // For each span, update bbox
        this.htmlSpans.forEach(span => {
            var box = span.getBoundingClientRect()
            maxX = Math.max(box.right, maxX)
            maxY = Math.max(box.bottom, maxY)
            minX = Math.min(box.left, minX)
            minY = Math.min(box.top, minY)
        })
        
        // Create input box
        this.boxDiv = document.createElement("div")
        this.boxDiv.classList.add("math-box")

        // Position box according to bbox
        this.boxDiv.style.position = "fixed"
        this.boxDiv.style.left = minX + "px"
        this.boxDiv.style.top = minY + "px"
        this.boxDiv.style.width = (maxX - minX) + "px"
        this.boxDiv.style.height = (maxY - minY) + "px"
        
        // This means the input box can be tabbed to
        this.boxDiv.tabIndex = -1

        // For each event, add a listener to add or remove class for styling
        this.boxDiv.addEventListener("mouseenter", () => {
            this.boxDiv.classList.add("hovered-box")
        })
        this.boxDiv.addEventListener("mouseleave", () => {
            this.boxDiv.classList.remove("hovered-box")
        })
        this.boxDiv.addEventListener("focus", () => {
            this.boxDiv.classList.add("focused-box")
            this.setFocusIndex(this.tokenIndex)
        })
        this.boxDiv.addEventListener("blur", () => {
            this.boxDiv.classList.remove("focused-box")
            // this.setFocusIndex(0)
        })

        // On keypress for the input div
        this.boxDiv.addEventListener("keydown", ({key}) => {

            // If backspace, remove last character of string
            if (key == "Backspace") {
                this.stringValue = this.stringValue.slice(0, -1)
                this.writeAll()
            }

            // If the key is a character (length 1), add the character
            if (key.length === 1) {
                this.stringValue += key
                this.writeAll()
            }

            // Ensure no text has been added to the div
            this.boxDiv.innerText = ""

        })

        // Add bbox to bbox container
        document.getElementById("bBox-container").appendChild(this.boxDiv)
    }

}