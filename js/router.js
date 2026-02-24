async function router() {
  let hash = window.location.hash;

  if (!hash) {
    hash = "#/dashboard";
    window.location.hash = hash;
  }

  switch (hash) {
    case "#/dashboard":
      renderDashboard();
      break;
    case "#/notes":
      await renderNotes();
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