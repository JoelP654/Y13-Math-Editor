// Joel Patterson
// 21/3/26
// Token Identifier
// This script looks at at the HTML code and tokens, and matches them up

// Identifies all tokens by matching identified symbols with HTML code
export const identifyTokens = (katexHtml, tokens) => {

    var htmlSpans = katexHtml.querySelectorAll("span")

    var mathSpans = []
    htmlSpans.forEach(span => {

        // Select all math spans
        if (span.childElementCount == 0 && span.className[0] == "m" && span.innerText != "") {
            
            // Spans with multiples characters are split into multiple spans
            // Otherwise, push the span
            if (span.innerText.length > 1) {
                var chars = span.innerText.split("")
                var nextElement = span.nextElementSibling

                chars.forEach(char => {
                    var cloneSpan = span.cloneNode()
                    cloneSpan.innerText = char

                    // If there is a next element, insert cloned span before it. Otherwise, add it to the end
                    if (nextElement) { span.parentElement.insertBefore(cloneSpan, nextElement) }
                    else { span.parentElement.appendChild(cloneSpan) } 

                    mathSpans.push(cloneSpan)
                })

                // Remove span with multiple characters
                span.remove()
            }
            else { mathSpans.push(span) }  
        }
    })

    // For each mathSpan, extract its character and span into an object
    var mathChars = []
    mathSpans.forEach(span => {
            mathChars.push({
                "char": span.innerText,
                "span": span
            })
    })

    // Tokens are identified by splitting characters, and finding successive spans in which the characters match
    // Called recursively for children
    const identifyToken = (token) => {
        if (token.children && token.children.length > 0) {
            token.children.forEach(childToken => {
                identifyToken(childToken)
            })
        }

        // Split token characters
        var tokenChars = token.identifyText ? token.identifyText.split("") : []

        var tokenFound = false
        for (var i = 0; i < mathChars.length; i++) {

            if (!tokenFound) {

                // First assume success
                var success = true
                var searchIndex = 0

                // For each token character, if a character doesn't match its corresponding character in mathChars it fails
                tokenChars.forEach(tokenChar => {
                    if ((i + searchIndex) < mathChars.length && mathChars[i + searchIndex].char == tokenChar) {
                        searchIndex++
                    }
                    else { success = false }
                
                    // If token was found, escape loop by setting tokenFound to true
                    if (success) {
                        tokenFound = true

                        // For each character, associate character's span with token
                        for (var j = 0; j < tokenChars.length; j++) {
                            if ((i + j) < mathChars.length) {
                                mathChars[i + j].char = ""
                                if (!token.htmlSpans.includes(mathChars[i + j].span)) {
                                    token.htmlSpans.push(mathChars[i + j].span)
                                }
                            }
                        }

                        // Update spans - function in class
                        token.updateSpans()
                    }
                })
            }
        }
    }

    // Call function to identify each token
    tokens.forEach(token => {
        identifyToken(token)
    })

    return tokens

}