import { useState, useRef, useEffect } from "react"
import { BlockMath } from "react-katex"
import 'katex/dist/katex.min.css'
import { parseLatex } from "../lib/latexParser"
import { identifyTokens } from "../lib/tokenIdentifier"
import "../themes/editor.css"
import "../themes/katex.css"
import { writeToken } from "../lib/latexWriter"
import { Buttons } from "../components/expressionButtons"
import { OpenSaveScreen, SaveScreen } from "../components/saveScreens"
import { addSave } from "../lib/saveFunctions"
import { downloadHtml, copyHtml } from "../lib/download"
import { TbLayoutColumns, TbLayoutRows } from "react-icons/tb"
import { FaCode } from "react-icons/fa6"

function Editor() {

    const [id, setId] = useState(0)
    const [title, setTitle] = useState("")
    const [input, setInput] = useState("")
    const [inputWithEmpty, setInputWithEmpty] = useState("")
    const [focusIndex, setFocusIndex] = useState(0)
    const [tokens, setTokens] = useState([])
    const [openingSave, setOpeningSave] = useState(false)
    const [saving, setSaving] = useState(false)
    const [inputOpen, setInputOpen] = useState(true)
    const [hori, setHori] = useState(false)
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


            // Assign Token Indexes. Indexed so first token is highest value, each progressive token -= 1 index
            var totalTokens = 0
            const countTokens = (token) => {
                totalTokens += 1
                token.children.forEach(child => { countTokens(child) })
            }
            tokens.forEach(token => countTokens(token))
            const assignIndexes = (token) => {
                token.tokenIndex = totalTokens
                totalTokens -= 1
                token.children.forEach(child => { assignIndexes(child) })
            }
            tokens.forEach(token => assignIndexes(token))


            identifyTokens(katexHtml, tokens)

            const addFunctions = (token) => {

                // Add write function to all children
                token.children.forEach(child => { addFunctions(child) })

                // Write all rewrites all tokens
                token.writeAll = () => {
                    var newInput = ""
                    tokens.forEach(token => {
                        newInput += writeToken(token, false)
                    })
                    setInput(newInput)
                }

                // Set focus index changes the focus index
                token.setFocusIndex = (newIndex) => { setFocusIndex(newIndex) }
            }

            // Apply functions to each token
            tokens.forEach(token => { addFunctions(token) })

        }
    }, [tokens, inputWithEmpty])



    useEffect(() => {
        tokens.forEach(token => { token.getFocus(focusIndex) })
    }, [tokens, focusIndex])


    return (
        <div className="editor">

            <div className="topTab">
                <Buttons write={(string) => {
                    if (tokens.length == 0 || focusIndex == 0) {
                        setInput(input + " " + string)
                    }
                    else {
                        const writeToChildren = (token) => {
                            token.children.forEach(child => { writeToChildren(child)})
                            if (token.tokenIndex == focusIndex) {
                                token.write(string, true)
                                if (focusIndex + 1 > tokens.length) {
                                    setFocusIndex(tokens.length)
                                }
                            }
                        }
                        tokens.forEach(token => writeToChildren(token))
                    }
                }}
                title={title}
                open={() => {setOpeningSave(true)}}
                save={() => {setSaving(true)}}
                setTitle={(newTitle) => {setTitle(newTitle)}}
                />

            </div>

            <div className={`workArea ${hori && "hori"}`}>
                
                <div
                    className="katex-block"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key.length == 1) {
                            setInput(input + " " + e.key)
                            setFocusIndex(0)
                        }
                    }}
                >
                    <div className="katex-spacer"/>
                    <div
                        ref={mathRef}
                        className="katex-math"
                    >
                        <BlockMath math={`\\begin{aligned}${inputWithEmpty}\\end{aligned}`}/>
                    </div>
                    <div className="katex-buttons">
                        <button className="copyButton" onClick={() => copyHtml(mathRef.current)}>
                            Copy
                        </button>
                        <button className="downloadButton" onClick={() => downloadHtml(mathRef.current, "formulate-output.png", true)}>
                            Download White
                        </button>
                        <button className="downloadButton" onClick={() => downloadHtml(mathRef.current, "formulate-output.png", false)}>
                            Download Transparent
                        </button>
                    </div>
                    
                </div>
                

                <div id="bBox-container"/>
                
                <div
                    className={`inputArea ${!inputOpen && "closedInputArea"} ${hori && "hori"}`}
                >
                    <div className={`toggleButtonContainer ${hori && "hori"}`}>
                        <div
                            className={`toggleButton ${hori && "hori"}`}
                            onClick={() => setInputOpen(!inputOpen)}
                        >
                            <FaCode size={20}/>
                        </div>
                    </div>
                    <textarea
                        className={`textInput ${hori && "hori"}`}
                        id="textInput"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value)
                        }}
                        onClick={() => {setFocusIndex(0)}}
                    />
                    <div className={`horiSwitch ${hori && "hori"} ${!inputOpen && "closed"}`} onClick={() => {setHori(!hori)}}>
                        {hori ? <TbLayoutRows size={20}/> : <TbLayoutColumns size={20}/>}
                    </div>
                </div>
                
            </div>

            {(openingSave || saving) &&
                <div className="modalBackdrop">
                    {openingSave
                        ?
                            <OpenSaveScreen
                                close={() => {setOpeningSave(false)}}
                                openSave={(id, title, input) => {setId(id); setTitle(title); setInput(input)}}
                            />

                        :
                            <SaveScreen
                                title={title}
                                close={() => setSaving(false)}
                                save={(saveTitle) => {
                                    addSave(id || crypto.randomUUID(), saveTitle, input)
                                    setTitle(saveTitle)
                                    setSaving(false)
                                }}
                            />
                    }
                </div>
            }
        </div>
    )
}

export default Editor