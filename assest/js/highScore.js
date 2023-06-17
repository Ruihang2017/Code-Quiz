let highScoreList = document.getElementById("highScoreList");
let clearHighScore = document.getElementById("clearHighScore");

clearHighScore.addEventListener("click", (event) => {
    localStorage.setItem("highScore", JSON.stringify(""));
    init()
})



let init = () => {
    onLoad();
}

let onLoad = () => {
    // refresh the inner html
    highScoreList.innerHTML = "";
    let highScore = JSON.parse(localStorage.getItem("highScore"));

    if (highScore) {
        //sort the rank by score
        highScore.sort((a, b) => b.score - a.score);
        highScoreList.innerHTML = highScore.map((item, index) => `<li>${index + 1}. ${item.name} - ${item.score}</li>`).join("");
    } else {
        console.log("Could not get localStorage file highScore")
    }
}

init();
