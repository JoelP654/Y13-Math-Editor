export const identifyTokens = (katexHtml, tokens) => {
    var htmlSpans = katexHtml.querySelectorAll("span")
    var mathSpans = []
    htmlSpans.forEach(span => {
        if (span.childElementCount == 0 &&
            span.className[0] == "m" &&
            span.innerText != "") {
            mathSpans.push(span)
        }
    })

    var mathChars = []
    mathSpans.forEach(span => {

        span.innerText.split("").forEach(char => {
            mathChars.push({
                "char": char,
                "span": span
            })
        })
    })
    
    var unfoundTokens = []

    const identifyToken = (token) => {

        if (token.children.length > 0) {
            token.children.forEach(childToken => {
                identifyToken(childToken)
            })
        }

        var tokenChars = token.stringValue.split("")
        var tokenFound = false
        for (var i = 0; i < mathChars.length; i++) {

            if (!tokenFound) {

                var success = true
                var searchIndex = 0
                tokenChars.forEach(tokenChar => {
                    if ((i + searchIndex) < mathChars.length && mathChars[i + searchIndex].char == tokenChar) {
                        searchIndex++
                    } else {
                        success = false
                    }
                
                if (success) {
                    tokenFound = true
                    console.log("Token " + token.stringValue + " found at " + i)
                    for (var j = 0; j < tokenChars.length; j++) {
                        if ((i + j) < mathChars.length) {
                            mathChars[i + j].char = ""
                            if (!token.htmlSpans.includes(mathChars[i + j].span)) {
                                token.htmlSpans.push(mathChars[i + j].span)
                            }
                        }
                    }
                    token.updateSpans()
                }

                })

            }

        }

        if (!tokenFound) {
            unfoundTokens.push(token)
        } 
    }


    
    tokens.forEach(token => {
        identifyToken(token)
    })


    if (unfoundTokens.length > 0) {
        var foundIndex = 0
        
        mathChars.forEach(char => {
            
            if (char.char != "") {
                
                char.char = ""
                unfoundTokens[foundIndex].htmlSpans.push(char.span)
                unfoundTokens[foundIndex].updateSpans()
                foundIndex += 1
            }
        })
    }

    return tokens

}