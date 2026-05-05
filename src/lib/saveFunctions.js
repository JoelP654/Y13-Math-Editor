export class Save {
    constructor(id, title, latex, date) {
        this.id = id
        this.title = title
        this.latex = latex
        this.date = date
    }
}

export const getItem = (key, def) => {
    let data = JSON.parse(localStorage.getItem(key))
    if (data) {return data}
    else {return def}
}
export const setItem = (key, value, def) => {
    if (value) {localStorage.setItem(key, JSON.stringify(value))}
    else {localStorage.setItem(key, JSON.stringify(def))}
}

export const removeSave = (id) => {
    let saves = getItem("saves", [])
    saves = saves.filter((save) => save.id != id)
    setItem("saves", saves, [])
}

export const addSave = (id, title, input) => {
    removeSave(id)
    const newSave = new Save(id, title, input, new Date)
    let saves = getItem("saves", [])
    saves.push(newSave)
    setItem("saves", saves, [])
}