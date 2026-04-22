import { useState } from "react"
import { BlockMath } from "react-katex"
import "../themes/buttons.css"
import buttonData from "../lib/buttonData.json"


const addEmpty = (string) => {
    return string.split("{").join("{\\phantom{o}")
}

export function ExpressionButton({ string, write }) {
    let latex = addEmpty(string)
    

    return (
        <button 
            className="expressionButton"
            onClick={() => { write(string) }}>
            <BlockMath math={latex}/>
            
        </button>
    )
}

export function ButtonDropDown({ dropDownObject, write }) {
    const [hovered, setHovered] = useState(false)
    const [dropDownHovered, setDropDownHovered] = useState(false)
    var latex = dropDownObject.dropDownCover

    return (
        <div className="buttonDropDown">
            <div
                className="coverButton"
                onMouseEnter={() => {setHovered(true)}}
                onMouseLeave={() => {setHovered(false)}}
            >
                <div className="expressionButton">
                    <BlockMath
                        math={latex}
                        write={write}
                    />
                    {dropDownObject.dropDownTitle}
                    <div className="downArrow">⌄</div>
                </div>
                
            </div>

            <div
                className="dropDown"
                onMouseEnter={() => {setDropDownHovered(true)}}
                onMouseLeave={() => {setDropDownHovered(false)}}
            >
                {(hovered || dropDownHovered) && dropDownObject.items.map((object, index) => (
                    <ExpressionButton key={index} string={object} write={write}/>
                ))}
            </div>
            
        </div>
    )
}

export function ButtonBar({ barObjects, write }) {
    return (
        <div className="buttonBar">
            {barObjects.map((object, index) => (
                typeof object == "string"
                    ? <ExpressionButton key={index} string={object} write={write}/>
                    : <ButtonDropDown key={index} dropDownObject={object} write={write}/>
                
            ))}
        </div>
    )
}

export function Buttons({ write }) {
    const [tabIndex, setTabIndex] = useState(0)
    const tabs = buttonData.tabs
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
            <ButtonBar barObjects={tabs[tabIndex].barElements} write={write}/>
        </div>
    )
}
