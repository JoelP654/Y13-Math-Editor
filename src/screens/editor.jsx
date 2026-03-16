import { useState, useRef, useEffect } from "react"
import { BlockMath } from "react-katex"
import 'katex/dist/katex.min.css'
import { parseLatex } from "../lib/latexParser"
import { IdentifyTokens } from "../lib/tokenIdentifier"

function Editor() {

    const [input, setInput] = useState("")
    const mathRef = useRef(null)

    useEffect(() => {
        const parsedTokens = parseLatex(input)

        var html = mathRef.current
        if (!html.querySelector(".katex-error")) {
            var katexHtml = html.querySelector(".katex-html")
            IdentifyTokens(katexHtml, parsedTokens)
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