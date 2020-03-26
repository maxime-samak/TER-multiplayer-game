const players = [];

const addPlayer = function(player) {
    players.push(player);
    console.log(`Player ${player.id} added to the list`);
};

const removePlayer = function (id) {
    const index = players.findIndex(player => player.id === id);
    if (index !== -1) {
        console.log(`Player ${id} removed to the list, index ${index}`);
        return players.splice(index, 1)[0];
    }
};

const getPlayer = function(id) {
    return players.find(player => player.id === id);
};

const getPlayers = function() {
    return players;
};


module.exports = {
    addPlayer,
    removePlayer,
    getPlayer,
    getPlayers
};
