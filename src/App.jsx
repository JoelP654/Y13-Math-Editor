// React Imports
import { useState } from 'react'
import { BlockMath } from 'react-katex'
// Dev Imports
import './App.css'

// Main app
function App() {

  // Input state
  const [input, setInput] = useState("")

  return (
    <div>

      {/* Input box Component */}
      <input value={input} onChange={(e) => setInput(e.target.value)}/>

      {/* Math Display */}
      <BlockMath math={input}/>

    </div>
  )
}

export default App
