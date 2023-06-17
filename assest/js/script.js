// question section
let questionPage = document.getElementById("questionPage");
let questionContent = questionPage.querySelector('.questionContent');
let questionNextButton = questionPage.querySelector('button');

// start section
let startButton = document.getElementById("startButton");
let welcomePage = document.getElementById("welcomePage");

// result section
let resultPage = document.getElementById("resultPage");

let questions;
let questionIndex;

startButton.addEventListener("click", () => {
    startQuizz();
});

questionNextButton.addEventListener("click", () => {

    if (questionIndex === questions.length) {
        displayResult();
    } else {
        renderOneQuestion(questions[questionIndex]);
    }
})

let displayResult = () => {
    console.log("Displaying result.")
}

// check the result of question
let checkResult = (event, question) => {
    if (event.target.textContent === question.answer[0]) {
        console.log("correct");
    } else {
        console.log("incorrect");
    }

    // button for the next question, of the index reaches the end of the questions, the next button changes its text from Next to Finsh
    if (questionIndex === questions.length) {
        questionNextButton.textContent = "Finsih";
    }
    questionNextButton.style.display = "block";
}

let startQuizz = () => {
    // console.log(questions);
    questionIndex = 0;
    welcomePage.style.display = 'none';
    questionPage.style.display = 'block';
    readQuestion(3).then(result => {
        questions = result;
        // result.forEach(question => {
        //     renderOneQuestion(question);
        // });
        if (questionIndex >= 0 && questionIndex < questions.length) {
            renderOneQuestion(questions[questionIndex]);
        }
    }).catch(error => {
        console.error('Error:', error);
    })
}

// render one question
let renderOneQuestion = (question) => {
    let ul = questionPage.querySelector('ul');
    ul.innerHTML = "";

    questionContent.textContent = question.question;
    question.choises.forEach(choise => {
        let li = document.createElement('li');
        let button = document.createElement('button');
        button.style.display = "block"
        button.textContent = choise;
        button.addEventListener("click", (event) => {
            checkResult(event, question);
        })
        ul.appendChild(li.appendChild(button));
    });
    questionIndex++;
}


if (questionContent) {
    questionContent.textContent = "What is your name";
}

let init = () => {
    // onLoad();
}

let onLoad = () => {
    readQuestion(4).then(result => {
        console.log(result)
    }).catch(error => {
        console.error('Error:', error);
    });
}

let readQuestion = (number) => {
    return new Promise((resolve, reject) => {
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
                    resolve(questionsCopy.slice(0, number));
                }
            })
            .catch(error => {
                reject('Error loading JSON:', error);
            });
    })

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
