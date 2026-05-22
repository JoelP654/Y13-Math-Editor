// Joel Patterson
// 7/5/26
// Save screens
// This contains react components to 

// Imports
import { FaTrash } from "react-icons/fa"
import { useEffect, useState } from "react"
import { getItem, removeSave } from "../lib/saveFunctions"
import { MdCancel } from "react-icons/md"
import "../themes/saveScreens.css"

// The screen that appears to open saves.
export function OpenSaveScreen({ close, openSave }) {
    // State variables
    const [saves, setSaves] = useState([])
    const [update, setUpdate] = useState(0) // This is used as a cheat to refresh saves

    // On mount or when updating, get the saves
    useEffect(() => {
        const getSaves = () => {
            const get = getItem("saves", [])
            setSaves(get)
        }
        getSaves()
    }, [update])

    return (
        <div className="saveModal filesModal">

            {/* Top bar */}
            <div className="saveModalTopBar">
                <div className="filesTitle">
                    <h1>Files</h1>
                    <div className="filesWarning">Any current unsaved projects will be lost</div>
                </div>
                
                <MdCancel icon={"cancel"} onClick={close} size={30}/>
            </div>

            <div className="savesContainer">
                {/* For each save, render the save */}
                {saves && saves.map((save) => (
                    <div className="saveComponent" key={save.id}>

                        {/* Save information */}
                        <div className="saveTitleContainer">{save.title}</div>
                        
                        <div>{"Last modified: " + (new Date(save.date)).toLocaleDateString()}</div>
                        
                        <div className="loadSaveButtons">
                            {/* Open save button */}
                            <div
                                onClick={() => { openSave(save.id, save.title, save.latex); close() }}
                                className="openButton"
                            >
                                Open
                            </div>
                            {/* Delete save button */}
                            <FaTrash icon={"trash-can"} onClick={() => { removeSave(save.id); setUpdate(update + 1) }}/>
                        </div>
                        
                    </div>
                ))}

                {/* If no saves, display message */}
                {saves.length == 0 &&
                    <div>No Files Found</div>
                }
            </div>
        </div>
    )
}

// Component to create a new save
export function SaveScreen({ close, save, title }) {

    // State variables
    const [inputTitle, setInputTitle] = useState(title)
    const [message, setMessage] = useState("")

    // When title changes or on mount, set the input bar's value to the title
    useEffect(() => {
        setInputTitle(title);
    }, [title]);

    return (
        <div className="saveModal">

            {/* Top bar */}
            <div className="saveModalTopBar">
                <h1>Save</h1>         
                <MdCancel icon={"cancel"} onClick={close} size={30}/>
            </div>


            <div className="saveContent">

                 {/* Input bar */}
                <input
                    className="saveSaveTitleInput"
                    value={inputTitle}
                    onChange={(e) => {
                        setInputTitle(e.target.value)
                        setMessage("")
                    }}
                />

                {/* Save button */}
                <div onClick={() => {
                    // If valid title, save and close
                    if (inputTitle != "") {
                        save(inputTitle)
                        close()
                    }
                    // Otherwise, set warning message
                    else {
                        setMessage("Enter a Valid Save Name")
                    }
                }}
                className="saveSaveButton"
                >
                    Save
                </div>

                {/* Display message */}
                <div className="saveMessage">
                    {message}
                </div>

            </div>
           
        </div>
    )
}