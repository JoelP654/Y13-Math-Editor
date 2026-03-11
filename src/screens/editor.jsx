import { useState, useRef, useEffect } from "react"
import { BlockMath } from "react-katex"
import 'katex/dist/katex.min.css'
import { parseLatex } from "../lib/latexParser"

function Editor() {

    const [input, setInput] = useState("")
    const mathRef = useRef(null)

    useEffect(() => {
        parseLatex(input)

        var html = mathRef.current
        if (!html.querySelector(".katex-error")) {
            var katexHtml = html.querySelector(".katex-html")
            var mathElements = katexHtml.querySelectorAll("span")
            var mathStrings = []
            mathElements.forEach(element => {
                if (element.childElementCount == 0 &&
                    element.className[0] == "m" &&
                    element.innerText != "") {
                    mathStrings.push(element.innerText)
                }
            })
            console.log(mathStrings)
        }

    }, [input])

    return (
        <div>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}    
            />
            <h1>{input}</h1>

            <div ref={mathRef}>
                <BlockMath math={input}/>
            </div>

        </div>
    )
}

export default Editor