// Joel Patterson
// 7/5/26
// Save screens
// This contains react components to 

// Imports
import { FaTrash } from "react-icons/fa"
import { useEffect, useState } from "react"
import { getItem, removeSave } from "../lib/saveFunctions"
import { MdCancel } from "react-icons/md"

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
        <div className="saveModal">

            {/* Top bar */}
            <div>
                <h1>Load Save</h1>
                <MdCancel icon={"cancel"} onClick={close}/>
            </div>

            {/* For each save, render the save */}
            {saves && saves.map((save) => (
                <div className="saveComponent" key={save.id}>

                    {/* Save information */}
                    {save.title}
                    {"Last modified: " + (new Date(save.date)).toLocaleDateString()}
                    
                    {/* Delete save button */}
                    <FaTrash icon={"trash-can"} onClick={() => { removeSave(save.id); setUpdate(update + 1) }}/>
                    
                    {/* Open save button */}
                    <div
                        onClick={() => { openSave(save.id, save.title, save.latex); close() }}
                    >
                        Open
                    </div>
                </div>
            ))}

            {/* If no saves, display message */}
            {saves.length == 0 &&
                <div>No saves found</div>
            }
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
            <div>
                <h1>Save</h1>
                <MdCancel icon={"cancel"} onClick={close}/>
            </div>

            {/* Input bar */}
            <input
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
            }}>
                Save
            </div>

            {/* Display message */}
            <div>
                {message}
            </div>
        </div>
    )
}