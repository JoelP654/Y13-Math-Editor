import { useState, useRef, useEffect } from "react"
import { BlockMath } from "react-katex"
import 'katex/dist/katex.min.css'
import { parseLatex } from "../lib/latexParser"
import { identifyTokens } from "../lib/tokenIdentifier"
import "../themes/editor.css"
import { writeToken } from "../lib/latexWriter"
function Editor() {

    const [input, setInput] = useState("")
    const [inputWithEmpty, setInputWithEmpty] = useState("")
    const [focusIndex, setFocusIndex] = useState(0)
    const mathRef = useRef(null)

    useEffect(() => {
        const parsedTokens = parseLatex(input)

        var newInputWithEmpty = ""
        parsedTokens.forEach(token => {
            newInputWithEmpty += writeToken(token, true)
        })
        setInputWithEmpty(newInputWithEmpty)

        var html = mathRef.current
        if (!html.querySelector(".katex-error")) {
            var katexHtml = html.querySelector(".katex-html")

            // Empty bbox container
            document.getElementById("bBox-container").replaceChildren()

            
            identifyTokens(katexHtml, parsedTokens)
            console.log(parsedTokens)


            const addWriteFunction = (token) => {

                if (token.children.length > 0) {
                    token.children.forEach(child => {
                        addWriteFunction(child)
                    })
                }

                token.writeAll = () => {
                    var newInput = ""
                    parsedTokens.forEach(token => {
                        newInput += writeToken(token, false)
                    })
                    setInput(newInput)
                }
            }

            parsedTokens.forEach(parsedToken => {
                addWriteFunction(parsedToken)
                parsedToken.setFocusIndex = (newIndex) => {setFocusIndex(newIndex)}
                if (parsedToken.boxDiv) {
                    if (parsedToken.tokenIndex == focusIndex) {
                        parsedToken.boxDiv.classList.add("focused-box")
                        parsedToken.boxDiv.focus()
                    }
                    else {
                        parsedToken.boxDiv.classList.remove("focused-box")
                        parsedToken.boxDiv.blur()
                    }
                }
            })
        }

    }, [input, focusIndex])

    return (
        <div>
            <textarea
                value={input}
                onChange={(e) => {
                        setInput(e.target.value)
                }}
            />

            <div ref={mathRef}>
                <BlockMath math={inputWithEmpty}/>
            </div>

            <div id="bBox-container"/>

        </div>
    )
}

export default Editor