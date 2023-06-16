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
                console.log(questionsCopy.slice(0, number));
                return questionsCopy.slice(0, number);
            }
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });

}

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
