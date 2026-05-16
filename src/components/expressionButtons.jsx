// Joel Patterson
// 26/4/26
// Expression buttons
// Provides all the react components to display buttons

// Imports
import { useRef, useState, useEffect } from "react"
import { BlockMath } from "react-katex"
import "../themes/buttons.css"
// Imports all information from json for buttons
import buttonData from "../lib/buttonData.json"
import logo from "../assets/logo.png"

// Returns latex string with any {} filled in with 
const addEmpty = (string) => {
    return string.split("{").join("{\\phantom{o}")
}

// Button to add an expression
export function ExpressionButton({ string, write }) {
    const mathRef = useRef(null)

    // Once every render, update empty boxes to have correct class
    useEffect(() => {
        let html = mathRef.current
        let spans = Array.from(html.querySelectorAll("span"))
        spans.forEach(span => {
            if (span.childElementCount == 0 && span.classList.contains("mord") && span.textContent == "o") {
                span.classList.add("empty-box")
            }
        })
    })

    return (
        <button 
            className="expressionButton"
            // On press, write string to token
            onClick={() => { write(string) }}>
            <div ref={mathRef}>
                {/* Katex display */}
                <BlockMath math={addEmpty(string)}/>
            </div>
            
        </button>
    )
}

// Drop down component
export function ButtonDropDown({ dropDownObject, write }) {
    const [hovered, setHovered] = useState(false)
    var latex = dropDownObject.dropDownCover

    return (
        // Handles drop down state
        <div className="buttonDropDown"
                onMouseEnter={() => {setHovered(true)}}
                onMouseLeave={() => {setHovered(false)}}
        >
            <div className="coverButton">
                <div className="expressionButton">
                    {/* Katex display */}
                    <BlockMath
                        math={latex}
                        write={write}
                    />
                    {/* Drop down title */}
                    {dropDownObject.dropDownTitle}
                    {/* Down arrow (indicates drop down) */}
                    <div className="downArrow">⌄</div>
                </div>
            </div>

            {/* Drop down page */}
            <div className="dropDown">
                {/* For each object, render expression button */}
                {hovered && dropDownObject.items.map((object, index) => (
                    <ExpressionButton key={index} string={object} write={write}/>
                ))}
            </div>
            
        </div>
    )
}

// One tabs worth of buttons
export function ButtonBar({ barObjects, write }) {
    return (
        <div className="buttonBar">
            {/* For each object, whether it be a button or a drop down, render it */}
            {barObjects.map((object, index) => (
                typeof object == "string"
                    ? <ExpressionButton key={index} string={object} write={write}/>
                    : <ButtonDropDown key={index} dropDownObject={object} write={write}/>
            ))}
        </div>
    )
}

// Renders all buttons and tab bar
export function Buttons({ write }) {
    const [tabIndex, setTabIndex] = useState(0)
    // Get information from .json file
    const tabs = buttonData.tabs
    return (
        <div className="buttonTab">
            <div className="tabSelector">
                <img src={logo}/>
                {/* Tab bar, for each tab render a button to switch to it */}
                {tabs.map((object, index) => (
                    <div
                        key={index}
                        className="tabCont"
                    >
                        {index != 0 && (
                            <div className="seperator">
                                |
                            </div>
                        )}
                        <button
                            
                            onClick={() => {setTabIndex(index)}}
                            className={`tabButton ${tabIndex == index ? "selectedTabButton" : ""}`}
                        >
                            {object.tabTitle}
                        </button>
                    </div>
                ))}
            </div>
            {/* Render the button bar of the currently selected tab */}
            <ButtonBar barObjects={tabs[tabIndex].barElements} write={write}/>
        </div>
    )
}
