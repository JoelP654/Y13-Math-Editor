// Joel Patterson
// 28/3/26
// Symbol Identifier
// This allows a string to be input (such as \pi), and the actual symbol to be output
// Good to note that this is a .jsx file so it can use React components

// Imports
import { renderToString } from "react-dom/server"
import { BlockMath } from "react-katex"

// Function to get the rendered math
// I used a bit of AI to research how to make this function, 
const getSymbolDoc = (string) => {
    var html = renderToString(<BlockMath math={string}/>)
    const parser = new DOMParser()
    var doc = parser.parseFromString(html, "text/html")
    return doc
}

// Returns symbol for a latex string
export const identifySymbol = (string) => {

    var math = getSymbolDoc(string)
    var spans = math.querySelectorAll("span")
    
    // Search through spans for math symbols
    var identifyText = ""
    spans.forEach(span => {
        if (span.childElementCount == 0 && span.className[0] == "m" && span.innerText != "") {
            identifyText += span.innerText
        }
    })
    return identifyText
}