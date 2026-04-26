const easy = ["apple", "banana", "cat", "dog", "sun", "moon", "book", "tree", "house", "car", "bird", "fish", "park", "milk", "bread", "lamp", "desk", "hand", "shoe", "rain"];
const medium = ["banana", "computer", "kitchen", "picture", "window", "mountain", "journey", "library", "keyboard", "example", "friendly", "weather", "package", "airport", "concert", "perfect", "channel", "message", "journey", "curtain"];
const hard = ["extraordinary", "phenomenon", "conscience", "maintenance", "refrigerator", "understanding", "government", "environment", "necessary", "opportunity", "sophisticated", "magnificent", "appreciation", "characteristic", "conscientious", "articulate", "circumstance", "fascinating", "imagination", "rehabilitation"];
const vhard = ["idiosyncrasy", "quintessential", "unintelligible", "conscientiousness", "phlebotomy", "epistemology", "histrionic", "valetudinarian", "pulchritudinous", "antediluvian", "heterogeneous", "interdisciplinary", "unconscionable", "obstreperous", "magnanimous", "prevaricate", "sesquipedalian", "surreptitious", "taciturn", "vicissitude"];
const insane = ["floccinaucinihilipilification", "antidisestablishmentarianism", "honorificabilitudinitatibus", "incomprehensibility", "pseudopseudohypoparathyroidism", "dichlorodiphenyltrichloroethane", "thyroparathyroidectomize", "pathophysiology", "otorhinolaryngological", "spectrophotofluorometrically", "tetramethylenedisulfotetramine", "deoxyribonucleic", "anthropomorphism", "transubstantiation", "electroencephalographically", "farthest", "counterrevolutionaries", "scientific", "investigational", "authoritatively"];
const levels = ["Easy", "Medium", "Hard", "Very Hard", "Insane"];
let guess="";
let word="";
let s = 0;
let w = 0;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [0, 0, 0, 0, 0];
score = document.getElementById("score");
letters = document.getElementById("letters");
buttons = document.querySelectorAll(".btn.diff");
exit = document.getElementById("exit");
letter = document.querySelectorAll(".letter");
hint = document.getElementById("hint");
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('diff') === "1")
            hint.disabled = true;
    if (urlParams.get('runAsync') === 'true') {
        console.log("Triggering asynchronous function...");
        letters.innerHTML = "<div class='choice'>Loading...</div>";
        document.getElementById("levelhighscore").textContent = "Level: " + levels[parseInt(urlParams.get('diff')) - 1] + "     High Score: " + highScores[parseInt(urlParams.get('diff')) - 1];
        word = await generateWord(urlParams.get('diff'));
        await showPuzzle(scramble(word));
    }
};
function exitGame(){
    window.location.href = 'index.html';
}
function handleLetterClick(button){
    guess += button.textContent;
    button.disabled = true;
    console.log("Current guess:", guess);
    if (guess.length === word.length)
        checkGuess();
}
async function generateWord(id){
    let api = "https://random-word-api.herokuapp.com/word?number=1" + "&length=" + randomLength(id);
    console.log("Fetching word from API:", api);
    try {
        response = await fetch(api);
        if (!response.ok)
            throw new Error('Network response was not ok');
        data = await response.json();
        console.log("Random word fetched!");
        return data[0];
    }
    catch (error) {
        console.log(error);
        return genWord(id);
    }
}
function genWord(id){
    switch(id){
        case "1":
            return easy[Math.floor(Math.random() * 20)];
        case "2":
            return medium[Math.floor(Math.random() * 20)];
        case "3":
            return hard[Math.floor(Math.random() * 20)];
        case "4":
            return vhard[Math.floor(Math.random() * 20)];
        case "5":
            return insane[Math.floor(Math.random() * 20)];
    }
}   
function scramble(word){
    let arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    let scrambled = arr.join('');
    console.log("Scrambled word:", scrambled);
    return scrambled;
}
showPuzzle = (scrambled) => {
    let puzzle = "";
    for (let i = 0; i < scrambled.length; i++){
        puzzle += '<button class="btn letter" id="'+i+'" onclick="handleLetterClick(this)">'+scrambled[i]+'</button>';
    }
    letters.innerHTML = puzzle;
}
async function checkGuess(){
    if (guess.toLowerCase() === word.toLowerCase()){
        score.textContent = "Score: " + (++s) + "     Wrong: " + w;
    }
    else{
        api = "https://api.dictionaryapi.dev/api/v2/entries/en/"+guess;
        try {
            response = await fetch(api);
            if (!response.ok)
                throw new Error('Network response was not ok');
            score.textContent = "Score: " + (++s) + "     Wrong: " + w;
        }
        catch (error) {
            score.textContent = "Score: " + (--s) + "     Wrong: " + (++w);
            alert("Wrong guess! The correct word was: " + word.toUpperCase());
        }

    }
    guess = "";
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('diff') !== "1")
        hint.disabled = false;
    if (s > highScores[parseInt(urlParams.get('diff')) - 1]) {
        highScores[parseInt(urlParams.get('diff')) - 1] = s;
        localStorage.setItem("highScores", JSON.stringify(highScores));
        document.getElementById("levelhighscore").textContent = "Level: " + levels[parseInt(urlParams.get('diff')) - 1] + "     High Score: " + highScores[parseInt(urlParams.get('diff')) - 1];
        console.log("New high score for difficulty " + urlParams.get('diff') + ": " + s);
    }
    window.onload();
}
function randomLength(id){
    switch(id){
        case "1":
            return Math.random() < 0.8 ? 4 : 3;
        case "2":
            return Math.random() < 0.5 ? 5 : 6;
        case "3":
            return Math.random() < 0.5 ? 7 : 8;
        case "4":
            return Math.random() < 0.5 ? 9 : 10;
        case "5":
            return Math.random() < 0.5 ? 13 : 14;
    }
}
function showHint(){
    let l = Math.floor((word.length - 1)/2) + 1;
    showPuzzle(word.substring(0, l) + scramble(word.substring(l)));
    for (let i = 0; i < l; i++)
        handleLetterClick(document.getElementById(i));
    hint.disabled = true;
}
