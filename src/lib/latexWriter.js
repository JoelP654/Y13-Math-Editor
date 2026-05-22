// Joel Patterson
// 28/3/26
// Latex Writer
// Allows tokens to be written back to latex code, constructing the input loop

// Takes a token and attempts to accurately return its LaTeX code
// Will only write empty boxes if specified
export const writeToken = (token, includeEmpty) => {

    if (token.tokenType == "math" || includeEmpty) {

        var writeString = token.stringValue

        // For every child, write the child enlocsed by braces, and add it
        if (token.children.length > 0) {
            writeString += "{"
            token.children.forEach(child => {
                writeString += writeToken(child, includeEmpty)
            })
            writeString += "}"
        }
        
        return writeString + " "
    }
    else { return "" }
}