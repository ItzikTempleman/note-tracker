"use-strict"

let noteList = []
const contentTE = document.getElementById("contentTE")
const timeInput = document.getElementById("timeInput")
const messageDiv = document.getElementById("messageDiv")


setCurrentTime()

function addNote() {
    pushNote()
    displayNoteList()
    clearForm()

}

function pushNote() {
    const content = contentTE.value
    const targetTime = timeInput.value.replace("T", " ")
    const note = {content, targetTime, fontSize: 16}
    if (isValidFields(note)) {
        noteList.push(note)
    }
    saveAndUpdateNote()
}

function setMinutes(unEditedDate) {
    return unEditedDate.getMinutes() < 10 ? "0" + unEditedDate.getMinutes() : unEditedDate.getMinutes()
}

function displayNoteList() {
    const containerDiv = document.getElementById("containerDiv")

    let dynamicNoteCardDiv = ""
    for (let i = 0; i < noteList.length; i++) {
        let unEditedDate = new Date(noteList[i].targetTime)
        let tagetDate = unEditedDate.getHours() + ":" + setMinutes(unEditedDate)
        const noteCard = `
    <div class="noteCardDiv">
        <span class="bi bi-trash" onclick="deleteNote(${i})"></span>
        <i class="bi bi-pencil" onclick="editContent(${i})"></i>
        <div class="noteContent" style="font-size: ${noteList[i].fontSize}px">${noteList[i].content}</div>
        
        <div class="cardBottom">
            <div class="fontDiv">
                <div class="smallerIcon" onclick="makeFontSmaller(${i})"><p>A</p></div>
                <div class="largerIcon" onclick="makeFontLarger(${i})"><p>A</p></div>
            </div>
            <p class="timeText" style="font-weight: bold"> ${tagetDate}</p>
        </div>
    </div> 
`
        dynamicNoteCardDiv = dynamicNoteCardDiv + noteCard
    }
    containerDiv.innerHTML = dynamicNoteCardDiv
}


function makeFontSmaller(index) {
    if (noteList[index].fontSize > 12) {
        noteList[index].fontSize -= 2
        saveAndUpdateNote()
        displayNoteList()
    }
}

function makeFontLarger(index) {
    if (noteList[index].fontSize < 40) {
        noteList[index].fontSize += 2
        saveAndUpdateNote()
        displayNoteList()
    }
}

function deleteNote(index) {
    noteList.splice(index, 1)
    saveAndUpdateNote()
    displayNoteList()
}

function editContent(index) {
    const updated = prompt("Edit note content")
    if (updated !== null || updated !== "") {
        noteList[index].content = updated.trim()
        saveAndUpdateNote()
        displayNoteList()
    }
}

function clearForm() {
    contentTE.value = ""
    timeInput.value = ""
    contentTE.focus()
    setCurrentTime()
}

function saveAndUpdateNote() {
    const json = JSON.stringify(noteList)
    localStorage.setItem("notes", json)
}



function loadNotes() {
    const json = localStorage.getItem("notes")
    if (json) {
        noteList = JSON.parse(json)
        for (const note of noteList) {
            if (note.fontSize === undefined) {
                note.fontSize = 16
            }
        }
    }
    displayNoteList()
}

function setCurrentTime() {
    let now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    timeInput.value = `${year}-${month}-${day} ${hours}:${minutes}`
}

function isValidFields(note) {
    const now = new Date()
    let targetDate = new Date(note.targetTime)

    if (!note.content.trim()) {
        messageDiv.innerText = `Content can't be empty`
        return false
    }

    if (!note.targetTime || isNaN(targetDate.getTime()) || now > targetDate) {
        messageDiv.innerText = `Enter a valid date and time`
        return false
    }

    messageDiv.innerText = ""
    return true
}

