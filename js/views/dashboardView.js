function renderDashboard() {
  const container = document.getElementById("mainView");

  container.innerHTML = `
    <h1>Dashboard</h1>

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
}