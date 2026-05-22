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
import { FaFolder } from "react-icons/fa"

// Returns latex string with any {} filled in with 
const addEmpty = (string) => {
    return string.split("{").join("{\\phantom{o}")
}

// Button to add an expression
export function ExpressionButton({ string, write, inDropDown }) {
    const mathRef = useRef(null)
    const [custom_display, setCustomDisplay] = useState("")

    // Once every render, update empty boxes to have correct class
    useEffect(() => {

        // Linter workaround (so it stops yelling at me)
        const setCustom = (text) => {
            setCustomDisplay(text)
        }
        if (string == "\\text{}") { setCustom("Text") }
        if (string == "\\newline") { setCustom("New Line") }

        let html = mathRef.current
        // If no custom display, render the math about the button will input
        if (custom_display == "") {
            let spans = Array.from(html.querySelectorAll("span"))
            spans.forEach(span => {
                if (span.childElementCount == 0 && span.classList.contains("mord") && span.textContent == "o") {
                    span.classList.add("empty-box")
                }
            })
        }
        
    })

    return (
        <button 
            className= {`expressionButton ${inDropDown && "inDropDownButton"}`}
            // On press, write string to token
            onClick={() => { write(string) }}
        >
            
            {/* If no custom display, render math */}
            {custom_display == "" ? (
                <div className="buttonKatex" ref={mathRef}>
                    {/* Katex display */}
                    <BlockMath math={addEmpty(string)}/>
                </div>
            ) : (
                // Otherwise, render custom display
                <div>{custom_display}</div>
            )}
            
            
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
                    <div className="buttonKatex">
                        <BlockMath
                            math={latex}
                            write={write}
                        />
                    </div>

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
                    <ExpressionButton key={index} string={object} write={write} inDropDown={true}/>
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
export function Buttons({ write, open, save, title, setTitle}) {
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
                    <div className="saveButtons">
                        <input
                            className="saveTitleInput"
                            placeholder="Save name..."
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                            }}
                        />
                        <FaFolder icon={"folder"} color="white" onClick={open} size={25}/>
                        <button className="saveButton" onClick={save}>
                            Save
                        </button>
                    </div>
                    
            </div>
            {/* Render the button bar of the currently selected tab */}
            <ButtonBar barObjects={tabs[tabIndex].barElements} write={write}/>
        </div>
    )
}
