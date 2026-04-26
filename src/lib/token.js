// Joel Patterson
// 21/3/26
// Token Class
// Token object holds variables, and contains functionality for input

import { identifySymbol } from "./symbolIdentifier.jsx"

export default class Token {

    // On class init, setup variables
    constructor(stringValue, type, children) {

        this.stringValue = stringValue

        // Get identified value
        this.identifyText = identifySymbol(stringValue)

        this.tokenType = type
        this.tokenIndex = 0
        
        // Get children
        if (children) {this.children = children}
        else {this.children = []}
        
        this.htmlSpans = []
        this.setFocusIndex = () => {}

        // Get focus function called by editor
        this.getFocus = (index) => {
            // Calls for each child as well
            if (this.children.length > 0) {
                this.children.forEach(child => { child.getFocus(index) })
            }
            if (this.boxDiv) {
                // If this tokens index matches the index, focus
                if (this.tokenIndex == index) {
                    this.boxDiv.classList.add("focused-box")
                    this.boxDiv.focus()
                }
                // Otherwise blur
                else {
                    this.boxDiv.classList.remove("focused-box")
                    this.boxDiv.blur()
                }
            }
        }

        // Write function is called by buttons to write strings
        this.write = (string, fromButton) => {
            
            if (this.tokenType == "math") {
                // If the token begins with \, add an extra space to buffer
                if (fromButton && this.stringValue[0] == "\\") {
                    this.stringValue += " "
                }
                // Add string to string's value
                this.stringValue += string
                // Write all tokens
                this.writeAll()
            }
            // If the token is empty, simply set the tokens value to the button press
            else if (this.tokenType == "empty") {
                this.stringValue = string
                this.tokenType = "math"
                this.writeAll()
            }
        }
    }

    // When spans are received, this function is called
    // It sets up the input
    updateSpans = () => {

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

        // 
        if (this.tokenType == "empty") {
            this.boxDiv.classList.add("empty-box")
        }

        // For each event, add a listener to add or remove class for styling
        this.boxDiv.addEventListener("mouseenter", () => {
            this.boxDiv.classList.add("hovered-box")
        })
        this.boxDiv.addEventListener("mouseleave", () => {
            this.boxDiv.classList.remove("hovered-box")
        })
        this.boxDiv.addEventListener("focus", () => {
            this.boxDiv.classList.add("focused-box")
            this.setFocusIndex(this.tokenIndex) // On focus, set global focus index to this tokens index
        })
        this.boxDiv.addEventListener("blur", () => {
            this.boxDiv.classList.remove("focused-box")
        })

        // On keypress for the input div
        this.boxDiv.addEventListener("keydown", ({key}) => {

            // On backspace
            if (key == "Backspace") {

                // If token length is over 1, remove last
                if (this.stringValue.length > 1) {
                    this.stringValue = this.stringValue.slice(0, -1)

                    // If just slashes remain, remove token
                    if (this.stringValue == "\\") {
                        this.stringValue = ""
                        this.children = []
                    }
                }
                // If token will be removed, set to empty, unless already empty, in which case remove it
                else {
                    if (this.type == "math" && this.stringValue.length > 0) {
                        this.stringValue = "\\phantom{o}"
                        this.tokenType = "empty"
                    }
                    // Somehow remove the token
                    else if (this.type == "empty") {
                        this.tokenType = "math"
                        this.stringValue = ""
                    }
                }

                this.writeAll()

            }

            // On arrow key presses, shift focus left or right
            if (key == "ArrowRight" || key == "ArrowDown") { this.setFocusIndex(this.tokenIndex - 1) }
            if (key == "ArrowLeft" || key == "ArrowUp") { this.setFocusIndex(this.tokenIndex + 1) }


            // If the key is a character (length 1), add the character
            if (key.length === 1) {
                this.write(key, false)
            }

            // Ensure no text has been added to the div
            this.boxDiv.innerText = ""

        })

        // Add bbox to bbox container
        document.getElementById("bBox-container").appendChild(this.boxDiv)
    }
}