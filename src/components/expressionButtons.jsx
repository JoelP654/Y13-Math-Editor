import { useState } from "react"
import { parseLatex } from "../lib/latexParser"
import { writeToken } from "../lib/latexWriter"
import { BlockMath } from "react-katex"
import "../themes/buttons.css"
import buttonData from "../lib/buttonData.json"

export function ExpressionButton({ string }) {
    var token = parseLatex(string)
    var latex = writeToken(token[0])
    return (
        <button 
            className="expressionButton"
            onClick={() => {console.log("WRITING " + string)}}>
            <BlockMath math={latex}/>
        </button>
    )
}

export function ButtonDropDown({ dropDownObject }) {
    const [hovered, setHovered] = useState(false)
    const [dropDownHovered, setDropDownHovered] = useState(false)
    return (
        <div className="buttonDropDown">
            <div
                className="coverButton"
                onMouseEnter={() => {setHovered(true)}}
                onMouseLeave={() => {setHovered(false)}}
            >
                <div className="expressionButton">
                    <BlockMath math={writeToken(parseLatex(dropDownObject.dropDownCover)[0])} />
                    {dropDownObject.dropDownTitle}
                </div>
                
            </div>

            <div
                className="dropDown"
                onMouseEnter={() => {setDropDownHovered(true)}}
                onMouseLeave={() => {setDropDownHovered(false)}}
            >
                {(hovered || dropDownHovered) && dropDownObject.items.map((object, index) => (
                    <ExpressionButton key={index} string={object} />
                ))}
            </div>
            
        </div>
    )
}

export function ButtonBar({ barObjects }) {
    return (
        <div className="buttonBar">
            {console.log(barObjects)}
            {barObjects.map((object, index) => (
                typeof object == "string"
                    ? <ExpressionButton key={index} string={object}/>
                    : <ButtonDropDown key={index} dropDownObject={object}/>
                
            ))}
        </div>
    )
}

export function Buttons() {
    const [tabIndex, setTabIndex] = useState(0)
    const tabs = buttonData.tabs
    console.log(tabs)
    return (
        <div className="buttonTab">
            <div className="tabSelector">
                {tabs.map((object, index) => (
                    <button
                        key={index}
                        onClick={() => {setTabIndex(index)}}
                        className={`tabButton ${tabIndex == index ? "selectedTab" : ""}`}
                    >
                        {object.tabTitle}
                    </button>
                ))}
            </div>
            <ButtonBar barObjects={tabs[tabIndex].barElements}/>
        </div>
    )
}
