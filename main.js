"use strict"

let noteList = []
const contentTE = document.getElementById("contentTE")
const timeInput = document.getElementById("timeInput")
const messageDiv = document.getElementById("messageDiv")
let initialTimeShown = ``

function addNote() {
    pushNote()
    displayNoteList()
}

//adding note
function pushNote() {
    const content = contentTE.value
    //removing default T letter in `<input type="datetime-local">`
    const targetTime = timeInput.value
    const note = {content, targetTime, fontSize: 16}
    if (isValidFields(note)) {
        noteList.push(note)
    }
    saveAndUpdateNote()
}

//adjusting minutes in the time so that it has a 0 before the minutes in case that the `minutes` value is less than 10:
//example: 16:4 -> 16:04
function setMinutes(unEditedDate) {
    return unEditedDate.getMinutes() < 10 ? "0" + unEditedDate.getMinutes() : unEditedDate.getMinutes()
}

function displayNoteList() {
    const containerDiv = document.getElementById("containerDiv")
    let dynamicNoteCardDiv = ""
    for (let i = 0; i < noteList.length; i++) {
        let unEditedDate = new Date(noteList[i].targetTime)
        let tagetDate = `${unEditedDate.getDate()}/ ${unEditedDate.getMonth() + 1}/ ${unEditedDate.getFullYear()} ${unEditedDate.getHours()}:${setMinutes(unEditedDate)}`
        const noteCard = `<div class="noteCardDiv">
        <span class="bi bi-trash" onclick="deleteNote(${i})"></span>
        <i class="bi bi-pencil" onclick="editContent(${i})"></i>
        <div class="noteContent" style="font-size: ${noteList[i].fontSize}px">${(noteList[i].content || '').replace(/\n/g, '<br>')}</div>
        <div class="cardBottom">
            <div class="fontDiv">
                <div class="smallerIcon" onclick="makeFontSmaller(${i})"><p>A</p></div>
                <div class="largerIcon" onclick="makeFontLarger(${i})"><p>A</p></div>
            </div>
            <p class="timeText"> ${tagetDate}</p>
        </div>
    </div>`
        dynamicNoteCardDiv = dynamicNoteCardDiv + noteCard
    }
    containerDiv.innerHTML = dynamicNoteCardDiv
}

//managing the size of the content size
function makeFontSmaller(index) {
    if (noteList[index].fontSize > 12) {
        noteList[index].fontSize -= 2
        saveAndUpdateNote()
        displayNoteList()
    }
}

//managing the size of the content size
function makeFontLarger(index) {
    if (noteList[index].fontSize < 40) {
        noteList[index].fontSize += 2
        saveAndUpdateNote()
        displayNoteList()
    }
}

function deleteNote(index) {
    if (confirm("Are you sure you want to delete this note?")) {
        noteList.splice(index, 1)
        saveAndUpdateNote()
        displayNoteList()
    } else {

    }
}

function editContent(index) {
    const updated = prompt("Edit note content")
    if (updated !== null || updated !== "") {
        noteList[index].content = updated.trim()
        saveAndUpdateNote()
        displayNoteList()
    }
}

//clear the form data
function clearForm() {
    contentTE.value = ""
    timeInput.value = ""
    contentTE.focus()
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


function isValidFields(note) {
    const now = new Date()
    const targetDate = new Date(note.targetTime)
    // Check that content field isn't empty or just spaces
    if (!note.content.trim()) {
        messageDiv.innerText = `Content can't be empty`
        return false
    }
    // Check if no time was entered or if user left the default time unchanged
    // Also checks that time can be parsed by Date()
    if (
        !note.targetTime || // empty
        note.targetTime === initialTimeShown || // unchanged
        isNaN(targetDate.getTime()) // invalid format
    ) {
        messageDiv.innerText = `Enter a valid date and time`
        return false
    }
    // Check if the time entered is in the past
    if (now > targetDate) {
        messageDiv.innerText = `Can't enter a past date`
        return false
    }
    // All checks passed — a clear message and return true
    messageDiv.innerText = ``
    return true
}

