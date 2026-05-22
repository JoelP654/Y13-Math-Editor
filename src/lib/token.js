// Joel Patterson
// 21/3/26
// Token Class
// Token object holds variables, and contains functionality for input

import { identifySymbol } from "./symbolIdentifier.jsx"

export default class Token {

    // On class init, setup variables
    constructor(stringValue, type, children) {

        this.stringValue = stringValue

        this.identifyText = identifySymbol(stringValue)

        this.tokenType = type
        this.tokenIndex = 0
        
        if (children) {this.children = children}
        else {this.children = []}
        
        this.htmlSpans = []
        this.setFocusIndex = () => {}

        // Get focus function called by editor
        // Checks if token matches the new focus index, and calls function for all children
        this.getFocus = (index) => {

            if (this.children.length > 0) {
                this.children.forEach(child => { child.getFocus(index) })
            }
            if (this.boxDiv) {
                if (this.tokenIndex == index) {
                    this.boxDiv.classList.add("focused-box")
                    this.boxDiv.focus()
                }
                else {
                    this.boxDiv.classList.remove("focused-box")
                    this.boxDiv.blur()
                }
            }
        }

        // Write function is called by buttons to write strings to tokens
        // If from a expression button in the editor, it adds an extra space between
        this.write = (string, fromButton) => {
            
            if (this.tokenType == "math") {
                if (fromButton && this.stringValue[0] == "\\") {
                    this.stringValue += " "
                }
                this.stringValue += string
                this.writeAll()
            }

            // If the token is empty, simply set the tokens value to the button press
            else if (this.tokenType == "empty") {
                this.stringValue = string
                this.tokenType = "math"
                this.writeAll()
            }
        }

        // When spans are received, this function is called
        // It sets up the input bbox, and event listeners
        this.updateSpans = () => {

            // Calculate bounding box from all spans by using max and min
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
            
            // Create input box
            this.boxDiv = document.createElement("div")
            this.boxDiv.classList.add("math-box")

            // Position box according to bbox
            this.boxDiv.style.position = "fixed"
            this.boxDiv.style.left = minX + "px"
            this.boxDiv.style.top = minY + "px"
            this.boxDiv.style.width = (maxX - minX) + "px"
            this.boxDiv.style.height = (maxY - minY) + "px"
            
            this.boxDiv.tabIndex = -1

            // If the token is empty, add empty box class for styling
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

            // Add event listeners
            this.boxDiv.addEventListener("keydown", ({key}) => {

                // On backspace, if the length is over 1, remove last character
                // Otherwise, set the token to empty
                // Otherwise if it is already empty, remove it
                if (key == "Backspace") {
                    
                    if (this.stringValue.length > 1) {
                        this.stringValue = this.stringValue.slice(0, -1)
                        if (this.stringValue == "\\") {
                            this.stringValue = ""
                            this.children = []
                        }
                    }
                    else {
                        if (this.tokenType == "math" && this.stringValue.length > 0) {
                            this.stringValue = "\\phantom{o}"
                            this.tokenType = "empty"
                        }
                        else if (this.tokenType == "empty") {
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
}