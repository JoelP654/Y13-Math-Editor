// Joel Patterson
// 21/3/26
// Token Identifier
// This script looks at at the HTML code and tokens, and matches them up

export const identifyTokens = (katexHtml, tokens) => {

    // Get all spans
    var htmlSpans = katexHtml.querySelectorAll("span")

    var mathSpans = []
    htmlSpans.forEach(span => {

        // Select spans with no children, className starting with m and innerText
        // This selects the math display spans
        if (span.childElementCount == 0 && span.className[0] == "m" && span.innerText != "") {
            
            // If there is more than one character in the span, split the span
            if (span.innerText.length > 1) {
                var chars = span.innerText.split("")

                // Get next sibling to place split spans before
                var nextElement = span.nextElementSibling

                // For each character, clone span and set text to the character
                chars.forEach(char => {
                    var cloneSpan = span.cloneNode()
                    cloneSpan.innerText = char

                    // If there is a next element, insert cloned span before it
                    if (nextElement) {
                        span.parentElement.insertBefore(cloneSpan, nextElement)
                    }

                    // Otherwise, just add it to the end
                    else {
                        span.parentElement.appendChild(cloneSpan)
                    } 

                    // Add span to mathspans
                    mathSpans.push(cloneSpan)
                })

                // Remove dud span
                span.remove()
            }

            // If span just has one character, add it to mathSpans
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

    // Inner function just identifies one token
    // This allows recursion for child tokens
    const identifyToken = (token) => {

        // If token has any children, identify the children
        if (token.children && token.children.length > 0) {
            token.children.forEach(childToken => {
                identifyToken(childToken)
            })
        }

        // Split tokens characters - USING identifyText
        var tokenChars = token.identifyText ? token.identifyText.split("") : []

        var tokenFound = false

        // For each math character to start searching from
        for (var i = 0; i < mathChars.length; i++) {

            // If the token hasn't been found yet
            if (!tokenFound) {

                // First assume success
                var success = true

                var searchIndex = 0

                // For each token character, if a character doesn't match its corresponding character in mathChars it fails
                tokenChars.forEach(tokenChar => {
                    if ((i + searchIndex) < mathChars.length && mathChars[i + searchIndex].char == tokenChar) {
                        searchIndex++
                    } else {
                        success = false
                    }
                
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
                    token.updateSpans(true)
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