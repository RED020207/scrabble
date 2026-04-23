const veasy = ["table", "water", "happy", "friend", "understand"];
const easy = ["garden", "surprised", "journey", "comfortable", "prepare"];
const medium = ["skeptical", "subtle", "profound", "procastinate", "significant"];
const hard = ["meticulous", "ambiguous", "magnanimous", "resilient", "ubiquitous"];
const vhard = ["pulchritudinous", "defenestration", "floccinaucinihilipilification", "sesquipedalian", "inchoate"];
let guess="";
let word="";
let s = 0;
let w = 0;
score = document.getElementById("score");
letters = document.getElementById("letters");
buttons = document.querySelectorAll(".btn.diff");
exit = document.getElementById("exit");
letter = document.querySelectorAll(".letter");
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('runAsync') === 'true') {
        console.log("Triggering asynchronous function...");
        word = await generateWord(urlParams.get('diff'));
        await showPuzzle(scramble(word));
    }
};
function handleLetterClick(button){
    guess += button.textContent;
    button.disabled = true;
    console.log("Current guess:", guess);
    if (guess.length === word.length)
        checkGuess();
}
async function generateWord(id){
    let api = "https://random-word-api.herokuapp.com/word?number=1&diff="+id+"&length="+ randomLength(id);
    console.log("Fetching word from API:", api);
    try {
        response = await fetch(api);
        if (!response.ok)
            throw new Error('Network response was not ok');
        data = await response.json();
        console.log("Your random word is:", data[0]);
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
            return veasy[Math.floor(Math.random() * veasy.length)];
        case "2":
            return easy[Math.floor(Math.random() * easy.length)];
        case "3":
            return medium[Math.floor(Math.random() * medium.length)];
        case "4":
            return hard[Math.floor(Math.random() * hard.length)];
        case "5":
            return vhard[Math.floor(Math.random() * vhard.length)];
    }
}   
function scramble(word){
    let arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    let scrambled = arr.join('');
    console.log("Your scrambled word is:", scrambled);
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
        }

    }
    guess = "";
    window.onload();
}
function randomLength(id){
    switch(id){
        case "1":
            return Math.random() < 0.8 ? 4 : 3;
        case "2":
            return Math.random() < 0.7 ? 5 : 6;
        case "3":
            return Math.random() < 0.7 ? 7 : 8;
        case "4":
            return Math.random() < 0.7 ? 9 : 10;
        case "5":
            return Math.random() < 0.7 ? 13 : 14;
    }
}
