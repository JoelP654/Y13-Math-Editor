// Joel Patterson
// 23/5/26
// Editor
// The app's main file, where all the UI is brought together with logic
// Also handles input loops

// React imports
import { useState, useRef, useEffect } from "react"
import { BlockMath } from "react-katex"
import 'katex/dist/katex.min.css'
import { TbLayoutColumns, TbLayoutRows } from "react-icons/tb"
import { FaCode } from "react-icons/fa6"
// My file imports
import { parseLatex } from "../lib/latexParser"
import { identifyTokens } from "../lib/tokenIdentifier"
import "../themes/editor.css"
import "../themes/katex.css"
import { writeToken } from "../lib/latexWriter"
import { Buttons } from "../components/expressionButtons"
import { OpenSaveScreen, SaveScreen } from "../components/saveScreens"
import { addSave } from "../lib/saveFunctions"
import { downloadHtml, copyHtml } from "../lib/download"

// React screen
function Editor() {

    // State variables - persist through renders
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


    // On render or input change, parse all tokens
    // Update display input as well by writing tokens with empty boxes
    useEffect(() => {
        const parsedTokens = parseLatex(input)
        setTokens(parsedTokens)

        var newInputWithEmpty = ""
        parsedTokens.forEach(token => {
            newInputWithEmpty += writeToken(token, true)
        })
        setInputWithEmpty(newInputWithEmpty)

    }, [input])


    // On render, token change or input change, index and identify all tokens
    useEffect(() => {

        // Get math html
        var html = mathRef.current
        if (!html.querySelector(".katex-error")) {
            var katexHtml = html.querySelector(".katex-html")

            // Remove all existing bboxes
            document.getElementById("bBox-container").replaceChildren()

            // Assign Token Indexes. Indexed so first token is highest value, decreasing so that 1 is the last token
            // Call recursively so children are also indexed
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

            // Identify tokens
            identifyTokens(katexHtml, tokens)


            // Add functions that interact with the editor to each token
            // Must be done in editor, as tokens need access to the editors variables
            // Again, called recursively so children also get functions
            const addFunctions = (token) => {

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
            tokens.forEach(token => { addFunctions(token) })

        }
    }, [tokens, inputWithEmpty])


    // Each time tokens or focus index changes, update each token's focus
    useEffect(() => {
        tokens.forEach(token => { token.getFocus(focusIndex) })
    }, [tokens, focusIndex])


    return (
        <div className="editor">

            <div className="topTab">

                {/* Buttons */}
                <Buttons
                    write={(string) => {
                        // Write is called by buttons to write string to focused token
                        if (tokens.length == 0 || focusIndex == 0) {
                            setInput(input + " " + string)
                        }
                        else {
                            // Called recursively for child tokens
                            const writeToChildren = (token) => {
                                token.children.forEach(child => { writeToChildren(child)})
                                
                                if (token.tokenIndex == focusIndex) {
                                    token.write(string, true)

                                    // Ensure correct token is focused
                                    if (focusIndex + 1 > tokens.length) {
                                        setFocusIndex(tokens.length)
                                    }
                                }
                            }
                            tokens.forEach(token => writeToChildren(token))
                        }
                    }}
                    // Set other functions
                    title={title}
                    open={() => {setOpeningSave(true)}}
                    save={() => {setSaving(true)}}
                    setTitle={(newTitle) => {setTitle(newTitle)}}
                />
            </div>

            {/* Work area - contains everything else */}
            {/* Hori class controls horizontal styling */}
            <div className={`workArea ${hori && "hori"}`}>
                
                {/* Math block */}
                <div
                    className="katex-block"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        // If key down, add character to input. This means a token doesn't have to be selected
                        if (e.key.length == 1) {
                            setInput(input + " " + e.key)
                            setFocusIndex(0)
                        }
                    }}
                >
                    <div className="katex-spacer"/>

                    {/* Katex display */}
                    <div
                        ref={mathRef}
                        className="katex-math"
                    >
                        <BlockMath math={`\\begin{aligned}${inputWithEmpty}\\end{aligned}`}/>
                    </div>

                    {/* Copy and download buttons */}
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
                
                {/* Bbox container */}
                <div id="bBox-container"/>
                
                {/* Input text area */}
                <div
                    className={`inputArea ${!inputOpen && "closedInputArea"} ${hori && "hori"}`}
                >

                    {/* Toggle horizontal button */}
                    <div className={`toggleButtonContainer ${hori && "hori"}`}>
                        <div
                            className={`toggleButton ${hori && "hori"}`}
                            onClick={() => setInputOpen(!inputOpen)}
                        >
                            <FaCode size={20}/>
                        </div>
                    </div>

                    {/* Text area */}
                    <textarea
                        className={`textInput ${hori && "hori"}`}
                        id="textInput"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value)
                        }}
                        onClick={() => {setFocusIndex(0)}}
                    />

                    {/* Horizontal/vertical switcher button */}
                    <div className={`horiSwitch ${hori && "hori"} ${!inputOpen && "closed"}`} onClick={() => {setHori(!hori)}}>
                        {hori ? <TbLayoutRows size={20}/> : <TbLayoutColumns size={20}/>}
                    </div>

                </div>
            </div>

            {/* If opening or saving, show backdrop and corresponding component */}
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