import { questions } from './questions.js'

console.log("This is a js script");

let questionPage = document.getElementById("questionPage");
let questionContent = questionPage.querySelector('.questionContent');

if (questionContent) {
    questionContent.textContent = "What is your name";
}

let init = () => {
    onLoad();
}

let onLoad = () => {
    readQuestion(4);
}

let readQuestion = (number) => {
    fetch("assest/js/questions.json")
        .then(response => response.json())
        .then(data => {
            if (number < data.questions.length) {
                // Shuffle the array 
                const questionsCopy = data.questions.slice();

                for (let i = questionsCopy.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
                }
                return questionsCopy.slice(0, number);
            }
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });

}



// // Create a copy of the original array
// const numbersCopy = numbers.slice();

// // Shuffle the array using the Fisher-Yates algorithm
// for (let i = numbersCopy.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [numbersCopy[i], numbersCopy[j]] = [numbersCopy[j], numbersCopy[i]];
// }

// // Select the first 5 numbers from the shuffled array
// const randomNumbers = numbersCopy.slice(0, 5);

init();

// var parentElement = document.getElementById('parentElement');
// var hasContentClass = parentElement.querySelector('.content') !== null;

// if (hasContentClass) {
//     // Child element with class .content exists
//     console.log('Child element with class .content found.');
// } else {
//     // Child element with class .content does not exist
//     console.log('Child element with class .content not found.');
// }
