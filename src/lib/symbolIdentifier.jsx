import { renderToString } from "react-dom/server"
import { BlockMath } from "react-katex"


const getSymbolDoc = (string) => {
    var html = renderToString(<BlockMath math={string}/>)
    const parser = new DOMParser()
    var doc = parser.parseFromString(html, "text/html")
    return doc
}

export const identifySymbol = (string) => {

    var math = getSymbolDoc(string)
    var spans = math.querySelectorAll("span")
    var identifyText = ""
    spans.forEach(span => {
        if (span.childElementCount == 0 && span.className[0] == "m" && span.innerText != "") {
            identifyText += span.innerText
        }
    })
    return identifyText
}