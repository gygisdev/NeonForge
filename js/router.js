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