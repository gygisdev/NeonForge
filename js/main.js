console.log("Main JS loaded");

/* App State */
const state = {
  defaultNotes: [],
  userNotes: [],
  notes: []
};

/* Storage Helper */
const STORAGE_KEY = "neonforge_notes";

function saveNotesToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.userNotes));
}

function loadNotesFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/* Where everything renders */
const view = document.getElementById("view");

/* Route controller */
async function router() {
  const hash = window.location.hash;

  switch (hash) {
    case "#/dashboard":
      renderDashboard();
      break;
    case "#/notes":
      renderNotes();
      break;
    case "#/playground":
      renderPlayground();
      break;
    case "#/resources":
      renderResources();
      break;
    case "#/projects":
      renderProjects();
      break;
    default:
      renderDashboard();
  }
}

/* Temporary render functions */
function renderDashboard() {
  view.innerHTML = `
    <h2>Dashboard</h2>
    <p>Welcome to your dev operating system.</p>
  `;
}

async function renderNotes() {
    console.log("renderNotes running");
  if (state.defaultNotes.length === 0) {
  const response = await fetch("./data/notes.json");
  state.defaultNotes = await response.json();
}

state.userNotes = loadNotesFromStorage();

state.notes = [...state.defaultNotes, ...state.userNotes];
  

  view.innerHTML = `
    <h2>Notes</h2>

    <form id="note-form">
      <input type="text" id="note-title" placeholder="Title" required />
      <input type="text" id="note-tags" placeholder="Tags (comma separated)" />
      <textarea id="note-content" placeholder="Content" required></textarea>
      <button type="submit">Add Note</button>
    </form>

    <div class="notes-container"></div>
  `;
  renderNotesList();
attachNoteFormHandler();
}
  function renderNotesList() {
  const container = document.querySelector(".notes-container");
  container.innerHTML = "";

  state.notes.forEach(note => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note-card");

    noteElement.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="tags">
        ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>
    `;

    container.appendChild(noteElement);
    console.log("About to attach form handler");
  });
}
  function attachNoteFormHandler() {
    console.log("attachNoteFormHandler running");
      const form = document.getElementById("note-form");
  
      form.addEventListener("submit", function (e) {
      e.preventDefault();

    const title = document.getElementById("note-title").value;
    const tagsInput = document.getElementById("note-tags").value;
    const content = document.getElementById("note-content").value;

    const newNote = {
      id: Date.now(),
      title,
      content,
      tags: tagsInput.split(",").map(tag => tag.trim()).filter(Boolean)
    };

    state.userNotes.push(newNote);
    state.notes = [...state.defaultNotes, ...state.userNotes];

    saveNotesToStorage();
    renderNotesList();
    form.reset();
  });
}

function renderPlayground() {
  view.innerHTML = `
    <h2>Playground</h2>
    <p>Experimental zone.</p>
  `;
}

function renderResources() {
  view.innerHTML = `
    <h2>Resources</h2>
    <p>Curated links and tools.</p>
  `;
}

function renderProjects() {
  view.innerHTML = `
    <h2>Projects</h2>
    <p>What you've built.</p>
  `; 
}

/* Listen for route changes */
window.addEventListener("hashchange", router);
window.addEventListener("load", router);