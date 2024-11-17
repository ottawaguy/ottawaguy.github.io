let players = [];
let lineup = {
    forwards: [[], [], []],
    defensemen: [[], [], []],
    goalie: []
};
let actionHistory = [];

function addPlayer() {
    const playerName = document.getElementById('player-name').value;
    if (playerName) {
        const playerBox = document.createElement('div');
        playerBox.className = 'player-box';
        playerBox.textContent = playerName;
        playerBox.draggable = true;
        playerBox.addEventListener('dragstart', dragStart);
        playerBox.addEventListener('touchstart', longPress);
        document.getElementById('player-list').appendChild(playerBox);
        players.push(playerName);
        actionHistory.push({ type: 'add', player: playerName });
        document.getElementById('player-name').value = '';
    }
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.textContent);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const playerName = event.dataTransfer.getData('text/plain');
    const target = event.target;
    if (target.classList.contains('line') || target.classList.contains('pair') || target.classList.contains('spot')) {
        if (target.children.length === 0) {
            const playerBox = document.createElement('div');
            playerBox.className = 'player-box';
            playerBox.textContent = playerName;
            playerBox.draggable = true;
            playerBox.addEventListener('dragstart', dragStart);
            playerBox.addEventListener('touchstart', longPress);
            target.appendChild(playerBox);
            actionHistory.push({ type: 'move', player: playerName, from: 'roster', to: target.id });
        }
    }
}

function longPress(event) {
    let pressTimer;
    event.target.addEventListener('touchstart', function startPress(e) {
        pressTimer = setTimeout(function () {
            const playerName = e.target.textContent;
            e.target.remove();
            players = players.filter(p => p !== playerName);
            actionHistory.push({ type: 'delete', player: playerName });
        }, 1000);
    });

    event.target.addEventListener('touchend', function cancelPress() {
        clearTimeout(pressTimer);
    });
}

function undoAction() {
    if (actionHistory.length > 0) {
        const lastAction = actionHistory.pop();
        if (lastAction.type === 'add') {
            const playerBox = document.querySelector(`.player-box:contains(${lastAction.player})`);
            playerBox.remove();
            players = players.filter(p => p !== lastAction.player);
        } else if (lastAction.type === 'move') {
            const playerBox = document.querySelector(`.player-box:contains(${lastAction.player})`);
            playerBox.remove();
            const playerIndex = players.indexOf(lastAction.player);
            if (playerIndex !== -1) {
                players.splice(playerIndex, 1);
            }
        } else if (lastAction.type === 'delete') {
            const playerBox = document.createElement('div');
            playerBox.className = 'player-box';
            playerBox.textContent = lastAction.player;
            playerBox.draggable = true;
            playerBox.addEventListener('dragstart', dragStart);
            playerBox.addEventListener('touchstart', longPress);
            document.getElementById('player-list').appendChild(playerBox);
            players.push(lastAction.player);
        }
    }
}

function clearAll() {
    document.getElementById('player-list').innerHTML = '';
    document.getElementById('line1').innerHTML = '';
    document.getElementById('line2').innerHTML = '';
    document.getElementById('line3').innerHTML = '';
    document.getElementById('pair1').innerHTML = '';
    document.getElementById('pair2').innerHTML = '';
    document.getElementById('pair3').innerHTML = '';
    document.getElementById('goalie-spot').innerHTML = '';
    players = [];
    lineup = {
        forwards: [[], [], []],
        defensemen: [[], [], []],
        goalie: []
    };
    actionHistory = [];
}
