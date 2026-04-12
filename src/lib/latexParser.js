// Joel Patterson
// 5/3/26
// Latex Parser
// This script should provide functionality to get a sequence of tokens from LaTeX code
// It doesn't need to contain every detail, as these tokens should be used for identifying contents in the jumble of HTML the KaTeX API gives

// Import token class
import Token from './token.js'

// Input - two strings, one input and one the seperator
// Returns two strings, one before and one after the seperator is detected
const seperateByFirstOccurence = (string, seperator) => {
    const [before, ...rest] = string.split(seperator)
    const after = rest.join(seperator)
    return [before, after]
}

// Returns array of strings, one for each detected line
const parseLines = (input) => {

    // If there is any input
    if (input != "") {

        // Split by "\\", then join by \\newline so it can then split all \\newlines
        var lines = input.split("\\\\").join("\\newline").split("\\newline")
        return lines
    }
    
    // If there was no input, return empty array
    else { return [] }
}

// Input should be single line
// Returns object with two strings, comment and preComment
const parseComment = (input) => {

    // If there is a comment in the string
    if (input.includes("%")) {

        // Split by \n first, then by %
        const [preComment, comment] = seperateByFirstOccurence(seperateByFirstOccurence(input, "\n"), "%")
        
        // Return object
        return {
            "comment": comment,
            "preComment": preComment
        }
    }
    
    // If there was no comment, return the input as the preComment
    else {
        return {
            "comment": "",
            "preComment": input
        }
    }
}

// Returns an array of TOKENs, containing the parsed LaTeX code
// This function scans left to right, using buffers to hold values until a break is detected
// It then creates a token for whats in the buffer
// If brackets are detected, it doesn't try parse whats in them, just gets the string then parses the string
const parseChunk = (input) => {
    var tokens = [] // Array of tokens
    var scanBuffer = [] // Buffer for scanning
    var braceCount = 0 // Count of open braces, should never be negative
    var braceBuffer = [] // Buffer for string inside braces
    var inSlash = false
    var inChar = false
    var tokenIndex = 1


    // This function takes whats in a buffer and creates a token for it
    const writeScanBuffer = () => {
        if (scanBuffer.length > 0) {
            tokens.push(new Token(scanBuffer.join(""), tokenIndex))
            tokenIndex += 1
        }
        scanBuffer = []
    }
    const writeChild = (string) => {
        if (string.length > 0) {
            tokens[tokens.length - 1].children.push(new Token(string, tokenIndex))
            tokenIndex += 1
        }
    }


    // Scan across every character in the string
    for (var i = 0; i < input.length; i++) { 

        if ("}]".includes(input[i])) { braceCount -= 1 }

        // Excludes braces
        if (braceCount > 0) { braceBuffer.push(input[i]) }

        // Includes braces
        if (braceCount == 0) {
            if ("}]".includes(input[i])) {
                parseChunk(braceBuffer.join("")).forEach((token) => {
                    if (inSlash || inChar) { tokens[tokens.length - 1].children.push(token) }
                    else { tokens.push(token) }
                })
                inChar = false
                braceBuffer = []
                continue
            }
            
            if ("\\".includes(input[i])) { writeScanBuffer(); inSlash = true }

            if ("^_".includes(input[i])) {
                writeScanBuffer()
                scanBuffer.push(input[i])
                writeScanBuffer()
                inChar = true
                inSlash = false
                continue
            }
            
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
            else if ("{[\n".includes(input[i])) { writeScanBuffer() }
            else if (inChar && !inSlash) {
                writeChild(input[i])
                inChar = false
            }
            // else if ("".includes(input[i])) { continue }
            else { scanBuffer.push(input[i]) }
        }
        if ("{[".includes(input[i])) { braceCount += 1 }

    }

    if (inChar) { writeChild(scanBuffer.join("")) }
    else { writeScanBuffer() }

    // Return the array of tokens
    return tokens
}

// Returns an array of tokens with fully parsed LaTeX, minimal nesting
export const parseLatex = (input) => {

    var tokens = [] // Array of tokens

    // Parse the input into lines
    var lines = parseLines(input)
    
    // For every line
    lines.forEach(line => {

        // Parse line for comments
        var result = parseComment(line)
        // Parse the preComment as a chunk
        tokens.push(...parseChunk(result.preComment))

        // If there is a comment which exists, create a comment token
        if (result.comment != "") {
            tokens.push(new Token(result.comment, "comment"))
        }
    })

    return tokens
}