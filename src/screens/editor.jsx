import { useEffect, useState } from "react"
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
        </div>
    )
}

export default Editor