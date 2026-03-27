// Joel Patterson
// 28/3/26
// Symbol Identifier
// This allows a string to be input (such as \pi), and the actual symbol to be output
// I found this easier than collating a big list of all symbols
// Basically this just does a single invisible render for the string, and gives the html's text value
// Also good to note that this is a .jsx file so I can render the react component for math

// Imports
import { renderToString } from "react-dom/server"
import { BlockMath } from "react-katex"

// Function to get the rendered math
// I used a bit of AI to research how to make this function, I didn't know about renderToString or DOMParser
const getSymbolDoc = (string) => {
    var html = renderToString(<BlockMath math={string}/>)
    const parser = new DOMParser()
    var doc = parser.parseFromString(html, "text/html")
    return doc
}

export const identifySymbol = (string) => {

    // Get all spans from the math
    var math = getSymbolDoc(string)
    var spans = math.querySelectorAll("span")
    
    // Search through all spans, and if it is suitable (same check as tokenIdentifier), append its value to return value
    var identifyText = ""
    spans.forEach(span => {
        if (span.childElementCount == 0 && span.className[0] == "m" && span.innerText != "") {
            identifyText += span.innerText
        }
    })
    return identifyText
}