document.getElementById('add-player').addEventListener('click', addPlayer);
document.getElementById('clear-all').addEventListener('click', clearAll);
document.getElementById('undo-action').addEventListener('click', undoAction);

let roster = [];
let history = [];

function addPlayer() {
  const playerName = document.getElementById('player-input').value;
  if (playerName) {
    const playerBox = document.createElement('div');
    playerBox.classList.add('player-box');
    playerBox.textContent = playerName;
    playerBox.draggable = true;
    playerBox.addEventListener('dragstart', drag);
    playerBox.addEventListener('longpress', deletePlayer);

    document.getElementById('roster').appendChild(playerBox);
    roster.push(playerName);
    history.push({ action: 'add', player: playerName });
    document.getElementById('player-input').value = '';
  }
}

function clearAll() {
  document.getElementById('roster').innerHTML = '';
  document.querySelectorAll('.lineup-spot').forEach(spot => spot.innerHTML = '');
  roster = [];
  history = [];
}

function undoAction() {
  const lastAction = history.pop();
  if (lastAction) {
    if (lastAction.action === 'add') {
      const playerBoxes = document.querySelectorAll('.player-box');
      playerBoxes[playerBoxes.length - 1].remove();
      roster.pop();
    }
    // Add logic for other actions
  }
}

function deletePlayer(event) {
  if (confirm('Do you really want to delete this player?')) {
    event.target.remove();
    roster = roster.filter(player => player !== event.target.textContent);
    history.push({ action: 'delete', player: event.target.textContent });
  }
}

function drag(event) {
  event.dataTransfer.setData('text/plain', event.target.textContent);
}

document.querySelectorAll('.lineup-spot').forEach(spot => {
  spot.addEventListener('dragover', event => event.preventDefault());
  spot.addEventListener('drop', event => {
    event.preventDefault();
    const playerName = event.dataTransfer.getData('text/plain');
    if (!event.target.textContent) {
      event.target.textContent = playerName;
      event.target.classList.add('player-box');
    }
  });
});
