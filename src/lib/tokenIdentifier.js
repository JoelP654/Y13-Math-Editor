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
    

    const identifyToken = (token) => {

        token.children.forEach(childToken => {
            identifyToken(childToken)
        })


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

                    for (var j = 0; j < tokenChars.length; j++) {
                        mathChars[i + j].char = ""
                        if (!token.htmlSpans.includes(mathChars[i + j].span)) {
                            token.htmlSpans.push(mathChars[i + j].span)
                        }
                    }
                    
                    console.log("Token " + token.stringValue + " found at index " + i)
                }

                })

            }

        }

        if (!tokenFound) {
            console.log("Token " + token.stringValue + " was not found")
        }
        
    
    }


    tokens.forEach(token => {
        identifyToken(token)
    })

    return tokens

}