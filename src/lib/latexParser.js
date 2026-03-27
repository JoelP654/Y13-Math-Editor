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
    var inExpression = false // Bool - controls whether content of braces is made as a child of expression or not
    var singleCharExpression = false // Bool - controls whether expression is read as single or multi character

    // This function takes whats in the scan buffer, creates a token, then clears the buffer
    const writeScanBuffer = () => {
        if (scanBuffer.length > 0) {
            tokens.push(new Token(scanBuffer.join(""), "expression"))
        }
        scanBuffer = []
    }

    // Scan across every character in the string
    for (var i = 0; i < input.length; i++) {

        // If character is opening brace, increment count
        // It doesn't really matter what type of brace, the KaTeX API should resolve any errors
        if (input[i] == "{" || input[i] == "[") {
            braceCount += 1
        }

        // If character is closing brace, decrement count
        if (input[i] == "}" || input[i] == "]") {
            braceCount -= 1

            // If brace count goes negative, there must be an unresolved closing brace
            if (braceCount < 0) {
                return ["ERROR: Unresolved }"]
            }

            // If brace count is equal to zero after a closing brace, an expression must be finished
            if (braceCount == 0) {
                
                // If the scanner was reading an expression, write the parsed brace buffer as a child of the expression in the scan buffer
                if (inExpression) {
                    tokens.push(new Token(scanBuffer.join(""), "expression", parseChunk(braceBuffer.join(""))))
                    scanBuffer = []
                    braceBuffer = []
                    inExpression = false
                }

                // If the scanner wasn't reading an expression, write the scan buffer and parsed brace buffer seperately
                else {
                    writeScanBuffer()
                    tokens.push(...parseChunk(braceBuffer.join("")))
                    braceBuffer = []
                }
            }
        }

        // If character is not in braces
        if (braceCount == 0) {

            // If character is a new line, write token
            if (input[i] == "\n") {
                writeScanBuffer()
                inExpression = false
                continue
            }

            // If input is a space, if its after an expression, end it. Continue so the space isn't written
            if (input[i] == " ") {
                if (inExpression) {
                    writeScanBuffer()
                    inExpression = false
                }
                continue
            }

            // If character is the start of an expression, write token, and start reading expression
            if (input[i] == "\\" || input[i] == "^" || input[i] == "_") {
                writeScanBuffer()
                inExpression = true

                // If single character expression, set bool to true
                if (input[i] == "^" || input[i] == "_") {
                    singleCharExpression = true
                }
            }
            
            // Short circuits if detecting first brace or last brace (aren't included, we only want their content)
            if ((input[i] == "{" || input[i] == "[") && braceCount == 1) {continue}
            else if ((input[i] == "}" || input[i] == "]") && braceCount == 0) {continue}
            
            // If fits criteria
            else {


                // If character after single char expression
                if (singleCharExpression && !(input[i] == "^" || input[i] == "_")) {

                    // Set single char expression to false
                    singleCharExpression = false

                    // If not brackets
                    if (!(input[i] == "{" || input[i] == "[")) {

                        // Create tokens, push and continue
                        var childToken = new Token(input[i], "expression")
                        var newToken = new Token(scanBuffer.join(""), "expression", [childToken])
                        tokens.push(newToken)
                        scanBuffer = []
                        continue
                    }
                    
                }

                // Append char to scan buffer
                scanBuffer.push(input[i])
            }
        }

        // If the character is in braces
        else {

            // Append character to brace buffer if it isn't the first brace (again, we only want the content)
            if (!((input[i] == "{" || input[i] == "[") && braceCount == 1)) {
                braceBuffer.push(input[i])
            }
        }
    }
    
    // If scanning is complete and the brace count is over zero, there must be an unresolved opening brace
    if (braceCount > 0) {
        return ["ERROR: Unresolved {"]
    }

    // Write any remaining content of the scan buffer
    writeScanBuffer()

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