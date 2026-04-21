import { useState, useRef, useEffect } from "react"
import { BlockMath } from "react-katex"
import 'katex/dist/katex.min.css'
import { parseLatex } from "../lib/latexParser"
import { identifyTokens } from "../lib/tokenIdentifier"
import "../themes/editor.css"
import { writeToken } from "../lib/latexWriter"
import { Buttons } from "../components/expressionButtons"
function Editor() {

    const [input, setInput] = useState("")
    const [inputWithEmpty, setInputWithEmpty] = useState("")
    const [focusIndex, setFocusIndex] = useState(0)
    const [tokens, setTokens] = useState([])
    const mathRef = useRef(null)

    useEffect(() => {
        const parsedTokens = parseLatex(input)
        setTokens(parsedTokens)

        var newInputWithEmpty = ""
        parsedTokens.forEach(token => {
            newInputWithEmpty += writeToken(token, true)
        })
        setInputWithEmpty(newInputWithEmpty)

    }, [input])



    useEffect(() => {

        var html = mathRef.current
        if (!html.querySelector(".katex-error")) {

            var katexHtml = html.querySelector(".katex-html")
            document.getElementById("bBox-container").replaceChildren()

            identifyTokens(katexHtml, tokens)
            console.log(tokens)

            const addWriteFunction = (token) => {

                // Add write function to all children
                if (token.children.length > 0) {
                    token.children.forEach(child => {
                        addWriteFunction(child)
                    })
                }

                // Write all rewrites all tokens
                token.writeAll = () => {
                    var newInput = ""
                    tokens.forEach(token => {
                        newInput += writeToken(token, false)
                    })
                    setInput(newInput)
                }
            }

            // Apply functions to each token
            tokens.forEach(token => {
                addWriteFunction(token)
                token.setFocusIndex = (newIndex) => { setFocusIndex(newIndex) }
            })

        }
    }, [tokens, inputWithEmpty])



    useEffect(() => {
        tokens.forEach(token => { token.getFocus(focusIndex) })
    }, [tokens, focusIndex])


    return (
        <div>
            <textarea
                value={input}
                onChange={(e) => {
                        setInput(e.target.value)
                }}
            />

            <div className="workArea">
                <Buttons/>
                <div ref={mathRef}>
                    <BlockMath math={inputWithEmpty}/>
                </div>

                <div id="bBox-container"/>
            </div>

        </div>
    )
}

export default Editor