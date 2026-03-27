// Joel Patterson
// 28/3/26
// Latex Writer
// Allows tokens to be written back to latex code, constructing the input loop

export const writeToken = (token) => {

    // Start with the string value of the token
    var writeString = token.stringValue

    // If the token has children
    if (token.children.length > 0) {

        // Render all of the children's values, enclosed by {}
        writeString += "{"
        token.children.forEach(child => {
            writeString += writeToken(child)
        })
        writeString += "}"
    }
    
    // Return the string, with a space at the end so it doesn't conflict with the next token (safeguard)
    return writeString + " "

}