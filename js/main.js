// =========================
// STATE (Single Source of Truth)
// =========================

let state = {
  // data
  defaultNotes: [],
  userNotes: [],
  notes: [],

  // notes filtering
  filterText: "",
  filterTag: "all",

  // routing
  activeView: "dashboard"
};

// =========================
// INITIALIZATION
// =========================

async function init() {
  loadLocalNotes();
  await loadDefaultNotes();
  attachSidebarHandlers();
  render();
}

init();

// =========================
// LOAD DEFAULT JSON NOTES
// =========================

async function loadDefaultNotes() {
  const response = await fetch("data/notes.json");
  const data = await response.json();

  state.defaultNotes = data.map(note => ({
    ...note,
    source: "json"
  }));

  combineNotes();
}

// =========================
// LOAD LOCAL NOTES
// =========================

function loadLocalNotes() {
  const stored = localStorage.getItem("userNotes");
  state.userNotes = stored ? JSON.parse(stored) : [];
}

// =========================
// SAVE LOCAL NOTES
// =========================

function saveLocalNotes() {
  localStorage.setItem("userNotes", JSON.stringify(state.userNotes));
}

// =========================
// COMBINE NOTES
// =========================

function combineNotes() {
  state.notes = [...state.defaultNotes, ...state.userNotes];
}

// =========================
// FILTERING
// =========================

function getFilteredNotes() {
  return state.notes.filter(note => {

    const matchesText =
      note.title.toLowerCase().includes(state.filterText.toLowerCase()) ||
      note.content.toLowerCase().includes(state.filterText.toLowerCase());

    const matchesTag =
      state.filterTag === "all" || note.tag === state.filterTag;

    return matchesText && matchesTag;
  });
}

// =========================
// RENDER
// =========================

function render() {
  updateActiveSidebar();

  switch (state.activeView) {
    case "dashboard":
      renderDashboard();
      break;
    case "notes":
      renderNotes();
      break;
    case "playground":
      renderPlayground();
      break;
    case "projects":
      renderProjects();
      break;
    case "resources":
      renderResources();
      break;
  }
}

function renderDashboard() {
  const container = document.getElementById("mainView");

  container.innerHTML = `
    <h1><span id="terminalTitle"></span></h1>

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h3>Total Notes</h3>
        <p>${state.notes.length}</p>
      </div>

      <div class="dashboard-card">
        <h3>User Notes</h3>
        <p>${state.userNotes.length}</p>
      </div>

      <div class="dashboard-card">
        <h3>JSON Notes</h3>
        <p>${state.defaultNotes.length}</p>
      </div>
    </div>
  `;
  typeTerminalText("terminalTitle", "Dashboard");
}

function typeTerminalText(elementId, text) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = "";
  let index = 0;

  function type() {
    if (index < text.length) {
      el.textContent += text.charAt(index);
      index++;
      setTimeout(type, 40);
    }
  }

  type();
}

function renderNotes() {
  const container = document.getElementById("mainView");

  container.innerHTML = `
    <h1><span id="notesTitle"></span></h1>

    <section class="controls">
      <input type="text" id="searchInput" placeholder="Search notes..." />
      <select id="tagFilter">
        <option value="all">All</option>
        <option value="javascript">JavaScript</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
      </select>
    </section>

    <section class="note-form-section">
      <form id="noteForm">
        <input type="text" id="noteTitle" placeholder="Title" required />
        <textarea id="noteContent" placeholder="Write your note..." required></textarea>
        <select id="noteTag">
          <option value="javascript">JavaScript</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
        </select>
        <button type="submit">Add Note</button>
      </form>
    </section>

    <section id="notesContainer" class="notes-grid"></section>
  `;

  attachFormHandler();
  attachFilterHandlers();
  attachNotesControls();
  renderNotesGrid();
  typeTerminalText("notesTitle", "Notes");
}

function attachNotesControls() {
  const deleteButtons = document.querySelectorAll(".delete-note");

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const id = this.dataset.id;
      deleteNote(id);
    });
  });
}

function renderPlayground() {
  const container = document.getElementById("mainView");

  container.innerHTML = `
    <h1><span id="playgroundTitle"></span></h1>
    <p>Use this space to test ideas.</p>
  `;
  typeTerminalText("playgroundTitle", "Playground");
}

function renderProjects() {
  const container = document.getElementById("mainView");

  container.innerHTML = `
    <h1><span id="projectsTitle"></span></h1>
    <p>Project tracking system coming soon.</p>
  `;
  typeTerminalText("projectsTitle", "Projects");
}

function renderResources() {
  const container = document.getElementById("mainView");

  container.innerHTML = `
    <h1><span id="resourcesTitle"></span></h1>
    <p>Curated dev resources and links.</p>
  `;
  typeTerminalText("resourcesTitle", "Resources");
}

function renderNotesGrid() {
  const container = document.getElementById("notesContainer");
  if (!container) return;

  const filtered = getFilteredNotes();

  container.innerHTML = filtered.map(note => `
    <div class="note-card">
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <span class="tag">${note.tag}</span>

      ${note.source === "local" ? 
        `<button class="delete-note" data-id="${note.id}">Delete</button>` 
        : ""
      }
    </div>
  `).join("");

  attachNotesControls();
}

// =========================
// FORM HANDLER
// =========================

function attachFormHandler() {
  const form = document.getElementById("noteForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;
    const tag = document.getElementById("noteTag").value;

    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      tag,
      source: "local"
    };

    state.userNotes.push(newNote);
    saveLocalNotes();
    combineNotes();

    form.reset();
  });
}

// =========================
// FILTER HANDLERS
// =========================

function attachFilterHandlers() {
  document.getElementById("searchInput")
    .addEventListener("input", (e) => {
      state.filterText = e.target.value;
      renderNotesGrid();
    });

  document.getElementById("tagFilter")
    .addEventListener("change", (e) => {
      state.filterTag = e.target.value;
      renderNotesGrid();
    });
}

// =========================
// Sidebar Handlers
// =========================

function attachSidebarHandlers() {
  console.log("Attaching sidebar handlers");
  const items = document.querySelectorAll(".sidebar li");

  items.forEach(item => {
    item.addEventListener("click", () => {
      console.log("Clicked:", item.dataset.view);
      state.activeView = item.dataset.view;
      render();
    });
  });
}

function updateActiveSidebar() {
  document.querySelectorAll(".sidebar li").forEach(li => {
    li.classList.remove("active");

    if (li.dataset.view === state.activeView) {
      li.classList.add("active");
    }
  });
}