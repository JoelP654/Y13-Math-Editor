import { FaTrash } from "react-icons/fa"
import { useEffect, useState } from "react"
import { getItem, removeSave } from "../lib/saveFunctions"
import { MdCancel } from "react-icons/md"


function SaveComponent({ id, title, latex, date, openSave, close }) {

    return (
        <div className="saveComponent">
            {title}
            {"Last modified: " + (new Date(date)).toLocaleDateString()}
            <FaTrash icon={"trash-can"} onClick={() => { removeSave(id) }}/>
            <div
                onClick={() => { openSave(id, title, latex); close() }}
            >
                Open
            </div>
        </div>
    )
}

export function OpenSaveScreen({ close, openSave }) {
    const [saves, setSaves] = useState([])
    const [update, setUpdate] = useState(0)

    useEffect(() => {
        const getSaves = () => {
            const get = getItem("saves", [])
            setSaves(get)
        }
        getSaves()
    }, [update])

    return (
        <div className="saveModal">
            <div>
                <h1>Load Save</h1>
                <MdCancel icon={"cancel"} onClick={close}/>
            </div>
            {saves && saves.map((save) => (
                <div className="saveComponent" key={save.id}>
                    {save.title}
                    {"Last modified: " + (new Date(save.date)).toLocaleDateString()}
                    <FaTrash icon={"trash-can"} onClick={() => { removeSave(save.id); setUpdate(update + 1) }}/>
                    <div
                        onClick={() => { openSave(save.id, save.title, save.latex); close() }}
                    >
                        Open
                    </div>
                </div>
            ))}
            {saves.length == 0 &&
                <div>No saves found</div>
            }
        </div>
    )
}

export function SaveScreen({ close, save, title }) {
    const [inputTitle, setInputTitle] = useState(title)
    const [message, setMessage] = useState("")

    useEffect(() => {
        setInputTitle(title);
    }, [title]);

    return (
        <div className="saveModal">
            <div>
                <h1>Save</h1>
                <MdCancel icon={"cancel"} onClick={close}/>
            </div>
            <input
                value={inputTitle}
                onChange={(e) => {
                    setInputTitle(e.target.value)
                    setMessage("")
                }}
            />
            <div onClick={() => {
                if (inputTitle != "") {
                    save(inputTitle)
                    close()
                }
                else {
                    setMessage("Enter a Valid Save Name")
                }
                
            }}>
                Save
            </div>
            <div>
                {message}
            </div>
        </div>
    )
}