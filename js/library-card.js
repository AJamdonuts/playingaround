let currentRow = null;

document.addEventListener('DOMContentLoaded', () => {
  // Open main popup and store clicked row
  document.querySelectorAll('.clickable-row').forEach(row => {
    row.addEventListener('click', () => {
      currentRow = row; // Save the clicked row
      document.getElementById('popup').style.display = 'block';
    });
  });

  // Mini form handling
  document.getElementById('mini-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('mini-input').value.trim();
    const type = document.getElementById('mini-form').dataset.type;

    if (!input || !currentRow) return;

    if (type === 'comment') {
      document.getElementById('comment-text-display').textContent = input;
    } else if (type === 'rating') {
      document.getElementById('rating-display').textContent = `Rating: ${input}`;
      currentRow.dataset.rating = parseFloat(input);
      currentRow.cells[4].textContent = input;
    } else if (type === 'tally') {
      document.getElementById('tally-display').textContent = `Tally: ${input}`;
      currentRow.dataset.tally = parseInt(input);
      currentRow.cells[3].textContent = input;
    }

    document.getElementById('mini-input').value = '';
    closeMiniPopup();
    recalculateScores(); // update all scores
  });
});

function recalculateScores() {
  const rows = Array.from(document.querySelectorAll('.clickable-row'));

  // Only include rows with both rating and tally
  const scoredRows = rows.filter(row => {
    const rating = parseFloat(row.dataset.rating);
    const tally = parseInt(row.dataset.tally);
    return !isNaN(rating) && !isNaN(tally);
  });

  // Compute score and store it in data-score
  scoredRows.forEach(row => {
    const rating = parseFloat(row.dataset.rating);
    const tally = parseInt(row.dataset.tally);
    const score = (rating * 10) + (tally * 2);
    row.dataset.score = score;
  });

  // Sort rows by score descending
  scoredRows.sort((a, b) => b.dataset.score - a.dataset.score);

  // Assign ranks
  scoredRows.forEach((row, index) => {
    row.cells[0].textContent = index + 1; // 1-based rank
  });

  // Clear ranks from unscored rows
  const unscoredRows = rows.filter(row => !scoredRows.includes(row));
  unscoredRows.forEach(row => {
    row.cells[0].textContent = ''; // no rank
  });

  // Optionally re-append rows if you want them visually sorted in the table
  const tbody = document.querySelector('.notepad-table tbody');
  rows.forEach(row => tbody.appendChild(row)); // keep all rows, scored + unscored
}
