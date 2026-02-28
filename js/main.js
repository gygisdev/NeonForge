// =========================
// STATE (Single Source of Truth)
// =========================

let state = {
  // data
  defaultNotes: [],
  userNotes: [],
  notes: [],

  playground: {
  liveMode: true,
  theme: "light"
},

  // notes filtering
  filterText: "",
  filterTag: "all",

  // routing
  activeView: "dashboard"
};

// =========================
// Initialize Monaco
// =========================

let htmlEditor, cssEditor, jsEditor;

function initMonacoEditors() {
  require.config({
    paths: { vs: "https://unpkg.com/monaco-editor@0.45.0/min/vs" }
  });

  require(["vs/editor/editor.main"], function () {

    htmlEditor = monaco.editor.create(
      document.getElementById("htmlEditor"),
      {
        value: "<h2>Hello Dev</h2>",
        language: "html",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false }
      }
    );

    cssEditor = monaco.editor.create(
      document.getElementById("cssEditor"),
      {
        value: "h2 { color: cyan; }",
        language: "css",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false }
      }
    );

    jsEditor = monaco.editor.create(
      document.getElementById("jsEditor"),
      {
        value: 'console.log("Playground ready");',
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false }
      }
    );

    attachPlaygroundHandlers();
    updatePreview();
  });
}

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

    <div class="playground-toolbar">
      <button id="runBtn">Run</button>
      <button id="liveToggle">Live: ON</button>
      <button id="saveSnippet">Save</button>
      <button id="prettifyBtn">Prettify</button>
      <button id="themeToggle">Preview: Light</button>
    </div>

    <div class="playground-container">

      <div class="editor-panel">
        <div id="htmlEditor" class="editor"></div>
        <div id="cssEditor" class="editor"></div>
        <div id="jsEditor" class="editor"></div>
      </div>

      <div class="preview-panel">
        <iframe id="previewFrame"></iframe>
        <div class="console-panel">
          <h4>Console</h4>
          <div id="consoleOutput"></div>
        </div>
      </div>

    </div>
  `;

  initMonacoEditors();
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

// =========================
// Playground Handlers
// =========================

function attachPlaygroundHandlers() {
  const htmlEditor = document.getElementById("htmlEditor");
  const cssEditor = document.getElementById("cssEditor");
  const jsEditor = document.getElementById("jsEditor");

  const runBtn = document.getElementById("runBtn");
  const liveToggle = document.getElementById("liveToggle");
  const saveBtn = document.getElementById("saveSnippet");
  const prettifyBtn = document.getElementById("prettifyBtn");
  const themeToggle = document.getElementById("themeToggle");

  [htmlEditor, cssEditor, jsEditor].forEach(editor => {
    editor.addEventListener("input", () => {
      if (state.playground.liveMode) updatePreview();
    });
  });

  runBtn.addEventListener("click", updatePreview);

  liveToggle.addEventListener("click", () => {
    state.playground.liveMode = !state.playground.liveMode;
    liveToggle.textContent = "Live: " + (state.playground.liveMode ? "ON" : "OFF");
  });

  saveBtn.addEventListener("click", saveSnippet);

  prettifyBtn.addEventListener("click", prettifyEditors);

  themeToggle.addEventListener("click", () => {
    state.playground.theme =
      state.playground.theme === "light" ? "dark" : "light";

    themeToggle.textContent =
      "Preview: " +
      (state.playground.theme === "light" ? "Light" : "Dark");

    updatePreview();
  });
}

function updatePreview() {
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();

  const iframe = document.getElementById("previewFrame");
  const consoleOutput = document.getElementById("consoleOutput");
  consoleOutput.innerHTML = "";

  const fullCode = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>
          const originalLog = console.log;
          console.log = function(...args) {
            parent.postMessage(
              { type: "console", message: args.join(" ") },
              "*"
            );
            originalLog.apply(console, args);
          };

          try {
            ${js}
          } catch (error) {
            parent.postMessage(
              { type: "console", message: error.toString() },
              "*"
            );
          }
        <\/script>
      </body>
    </html>
  `;

  iframe.srcdoc = fullCode;

  window.addEventListener("message", (event) => {
  if (event.data.type === "console") {
    const consoleOutput = document.getElementById("consoleOutput");
    const line = document.createElement("div");
    line.textContent = event.data.message;
    consoleOutput.appendChild(line);
  }
});
}

function saveSnippet() {
  const snippet = {
    html: htmlEditor.value,
    css: cssEditor.value,
    js: jsEditor.value
  };

  localStorage.setItem("playgroundSnippet", JSON.stringify(snippet));
}

function loadSnippet() {
  const saved = localStorage.getItem("playgroundSnippet");
  if (!saved) return;

  const snippet = JSON.parse(saved);
  htmlEditor.value = snippet.html;
  cssEditor.value = snippet.css;
  jsEditor.value = snippet.js;
}

function prettifyEditors() {
  htmlEditor.value = formatCode(htmlEditor.value);
  cssEditor.value = formatCode(cssEditor.value);
  jsEditor.value = formatCode(jsEditor.value);
}

function formatCode(code) {
  return code
    .replace(/;\s*/g, ";\n")
    .replace(/{\s*/g, "{\n")
    .replace(/}\s*/g, "\n}\n")
    .trim();
}