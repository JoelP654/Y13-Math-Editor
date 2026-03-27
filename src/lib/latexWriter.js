
export const writeToken = (token) => {
    var writeString = token.stringValue

    if (token.children.length > 0) {
        writeString += "{"
        token.children.forEach(child => {
            if (child.stringValue == "\\") {
                // console.log(child.children)
            }
            writeString += writeToken(child)
        })
        writeString += "}"
    }
    // console.log(writeString)
    return writeString + " "

}