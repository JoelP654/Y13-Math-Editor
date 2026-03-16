export const IdentifyTokens = (katexHtml, tokens) => {
    var mathElements = katexHtml.querySelectorAll("span")
    var mathStrings = []
    mathElements.forEach(element => {
        if (element.childElementCount == 0 &&
            element.className[0] == "m" &&
            element.innerText != "") {
            mathStrings.push(element.innerText)
        }
    })
    var mathCharacters = []
    mathStrings.forEach(string => {
        mathCharacters.push(...string.split(""))
    })
    
    tokens.forEach(token => {
        var tokenChars = token.stringValue.split("")
        var tokenFound = false
        for (var i = 0; i < mathCharacters.length; i++) {

            if (!tokenFound) {

                var success = true
                var searchIndex = 0
                tokenChars.forEach(tokenChar => {
                    if ((i + searchIndex) < mathCharacters.length && mathCharacters[i + searchIndex] == tokenChar) {
                        searchIndex++
                    } else {
                        success = false
                    }
                
                if (success) {
                    tokenFound = true
                    mathCharacters.splice(i, tokenChars.length, "")
                    console.log("Token " + token.stringValue + " found at index " + i)
                }

                })

            }

        }
        if (!tokenFound) {
            console.log("Token " + token.stringValue + " was not found")
        }
        
        
    })
}