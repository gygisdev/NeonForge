console.log("Main JS loaded");

/* Where everything renders */
const view = document.getElementById("view");

/* Route controller */
function router() {
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

function renderNotes() {
  view.innerHTML = `
    <h2>Notes</h2>
    <p>Your knowledge base will live here.</p>
  `;
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