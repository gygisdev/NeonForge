function renderNotes() {
  const container = document.getElementById("mainView");

  container.innerHTML = `
    <h1>Notes</h1>

    <section class="controls">
      <input type="text" id="searchInput" placeholder="Search notes..." />
      <select id="tagFilter">
        <option value="all">All</option>
        <option value="javascript">JavaScript</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
      </select>
    </section>

    <section id="notesContainer" class="notes-grid"></section>
  `;

  attachNotesControls();
  renderNotesGrid();
}