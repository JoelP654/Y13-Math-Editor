// Joel Patterson
// 7/5/26
// Save functions
// This file contains functions to handle and manage saving

// Basic class to use as container for save values
// I though I would need a class for some methods, but I didn't
export class Save {
    constructor(id, title, latex, date) {
        this.id = id
        this.title = title
        this.latex = latex
        this.date = date
    }
}

// Gets item from local storage, defaulting to value def if nothing is found
export const getItem = (key, def) => {
    let data = JSON.parse(localStorage.getItem(key))
    if (data) {return data}
    else {return def}
}

// Sets item in local storage to value, defaulting to value def if no value is set
export const setItem = (key, value, def) => {
    if (value) {localStorage.setItem(key, JSON.stringify(value))}
    else {localStorage.setItem(key, JSON.stringify(def))}
}

// Removes save (based on ID) by filtering it out
export const removeSave = (id) => {
    let saves = getItem("saves", [])
    saves = saves.filter((save) => save.id != id)
    setItem("saves", saves, [])
}

// Adds new save. Removes any previous saves with the same ID to overwrite
export const addSave = (id, title, input) => {
    removeSave(id)
    const newSave = new Save(id, title, input, new Date)
    let saves = getItem("saves", [])
    saves.push(newSave)
    setItem("saves", saves, [])
}