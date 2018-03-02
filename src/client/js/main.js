var global = require('./global');
var nameInput = document.getElementById('namePlayerInput');
function validationName() {
    var regex = /^\w*$/;
    debug('Regex Test', regex.exec(nameInput.value));
    console.log(nameInput.value);
    return regex.exec(nameInput.value) !== null;
}
// nameInput.value.replace(/(<([^>]+)>)/ig, '').substring(0,30);
window.onload = function() {
    var btnStart = document.getElementById('butStart'),
    btnWatch = document.getElementById('butWatch'),
    nickErrorText = document.querySelector('#menuStart .input-error');
    btnStart.onclick = function () {
        console.log(nameInput.value);
                // Checks if the nick is valid.
                if (validationName()) {
                    nickErrorText.style.opacity = 0;
                    console.log("Ok");
                   // startGame('player');
                } else {
                    nickErrorText.style.opacity = 1;
                    console.log("No");
                }
            };
    var instructions = document.getElementById('rule');



}