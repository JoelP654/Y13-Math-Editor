import { useEffect, useState } from "react"
import { BlockMath } from "react-katex"
import { parseLatex } from "../lib/latexParser"

function Editor() {

    const [input, setInput] = useState("")


    useEffect(() => {
        parseLatex(input)
    }, [input])

    return (
        <div>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}    
            />
            <h1>{input}</h1>
            <BlockMath math={input}/>
        </div>
    )
}

export default Editor