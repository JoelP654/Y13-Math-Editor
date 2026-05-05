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

export function SaveScreen({ close, save }) {
    const [title, setTitle] = useState("")

    return (
        <div className="saveModal">
            <div>
                <h1>Save</h1>
                <MdCancel icon={"cancel"} onClick={close}/>
            </div>
            <input
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value)
                }}
            />
            <div onClick={() => {save(title); close()}}>
                Save
            </div>
        </div>
    )
}