// Joel Patterson
// 5/3/26
// Latex Parser
// This script should provide functionality to get a sequence of tokens from LaTeX code
// It doesn't need to contain every detail in the LaTeX code, as these tokens should be used for identifying contents in the jumble of HTML the KaTeX API gives

// Import token class
import Token from './token.js'

// Takes the string and seperates it into two strings, one before and one after the seperator
const seperateByFirstOccurence = (string, seperator) => {
    const [before, ...rest] = string.split(seperator)
    const after = rest.join(seperator)
    return [before, after]
}

// Returns object with two strings, comment and preComment
const parseComment = (input) => {

    if (input.includes("%")) {

        // Split by \n first, then by %
        const [preComment, comment] = seperateByFirstOccurence(seperateByFirstOccurence(input, "\n"), "%")
        return {
            "comment": comment,
            "preComment": preComment
        }
    }
    else {
        return {
            "comment": "",
            "preComment": input
        }
    }
}

// Returns an array of TOKENs, containing the parsed LaTeX code by scanning from left to right
// Upon reaching brackets, it will recursively call itself to parse their contents
const parseChunk = (input) => {
    var tokens = []
    var scanBuffer = []
    var braceCount = 0
    var braceBuffer = []
    var inSlash = false
    var inChar = false

    // Takes what's in the scanBuffer and creates a token for it
    const writeScanBuffer = () => {
        if (scanBuffer.length > 0) {
            tokens.push(new Token(scanBuffer.join(""), "math"))
        }
        scanBuffer = []
    }

    // Writes a string as a child of the latest token
    const writeChild = (string) => {
        if (string.length > 0) {
            tokens[tokens.length - 1].children.push(new Token(string, "math"))
        }
    }

    // For every character in string, deal with it accordingly
    for (var i = 0; i < input.length; i++) { 

        // Count braces down
        if ("}]".includes(input[i])) { braceCount -= 1 }

        // If inside braces
        if (braceCount > 0) { braceBuffer.push(input[i]) }

        if (braceCount == 0) {
            if ("}]".includes(input[i])) {
                // If a brace is just closed, handle the contents of those braces
                // If nothing, add an empty box, otherwise parse the contents
                if (braceBuffer.length == 0) {
                    var token = new Token("\\phantom{o}", "empty", [])
                    if (inSlash || inChar) { tokens[tokens.length - 1].children.push(token) }
                    else { tokens.push(token) }
                }
                else {
                    parseChunk(braceBuffer.join("")).forEach((token) => {
                        if (inSlash || inChar) { tokens[tokens.length - 1].children.push(token) }
                        else { tokens.push(token) }
                    })
                }
                inChar = false
                braceBuffer = []
                continue
            }
            
            // Detect functions - slashes and single character functions
            if ("\\".includes(input[i])) { writeScanBuffer(); inSlash = true }
            if ("^_".includes(input[i])) {
                writeScanBuffer()
                scanBuffer.push(input[i])
                writeScanBuffer()
                inChar = true
                inSlash = false
                continue
            }
            
            // Upon reaching a space, terminate functions
            if (" ".includes(input[i])) {
                if (inSlash) {
                    if (inChar) {
                        writeChild(scanBuffer.join(""))
                        inChar = false
                        scanBuffer = []}
                    else { writeScanBuffer() }
                    inSlash = false
                }
            }
            // Handle other terminators
            else if ("{[\n".includes(input[i])) { writeScanBuffer() }
            else if (inChar && !inSlash) {
                writeChild(input[i])
                inChar = false
            }
            // If nothing else, write character to buffer
            else { scanBuffer.push(input[i]) }
        }
        // Handle open braces
        if ("{[".includes(input[i])) { braceCount += 1 }
    }

    // Tidy up remaining buffers
    if (inChar) { writeChild(scanBuffer.join("")) }
    else { writeScanBuffer() }

    return tokens
}

// Returns an array of tokens with fully parsed LaTeX, with minimal nesting
export const parseLatex = (input) => {

    var tokens = []
    var lines = input.split("\n")
    
    lines.forEach(line => {

        // Parse line for comments and chunks
        var result = parseComment(line)
        tokens.push(...parseChunk(result.preComment))

        // If there is a comment which exists, create a comment token
        if (result.comment != "") {
            tokens.push(new Token(result.comment, 0, "comment"))
        }
    })

    return tokens
}