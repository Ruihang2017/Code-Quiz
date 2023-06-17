// question section
let questionPage = document.getElementById("questionPage");
let questionContent = questionPage.querySelector('.questionContent');
let questionResult = questionPage.querySelector('.questionResult');
let questionList = questionPage.querySelector('.questionList');

let questionNextButton = questionPage.querySelector('button');

// start section
let startButton = document.getElementById("startButton");
let welcomePage = document.getElementById("welcomePage");

// result section
let resultPage = document.getElementById("resultPage");
let resultMessage = resultPage.querySelector('.resultMessage');
let resultForm = document.getElementById("resultForm");

// others
let timeBlock = document.getElementById("timeBlock");

const quizzTime = 30;
let time = 0;

let quizz = {
    questions: [],
    questionIndex: 0,
    result: 0,
    name: "",
};

startButton.addEventListener("click", () => {
    startQuizz();
});

questionNextButton.addEventListener("click", () => {
    if (quizz.questionIndex === quizz.questions.length) {
        displayResult();
    } else {
        renderOneQuestion(quizz.questions[quizz.questionIndex]);
    }
})

resultForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTohighScore(quizz);
    routeToHighScore();
})

let routeToHighScore = () => {
    // Navigate to another HTML page
    window.location.href = "./assest/html/highScore.html";

}

let addTohighScore = () => {
    let input = resultForm.querySelector('input');
    if (input) {
        // console.log("added to high score" + input);
        quizz.name = input.value;

        // get localstorage item highScore, create an empty array if it doesn't exist already
        let highScore = JSON.parse(localStorage.getItem("highScore"));
        if (!highScore) {
            highScore = [];
        }
        highScore.push({ name: quizz.name, score: Math.floor(quizz.result) });
        localStorage.setItem("highScore", JSON.stringify(highScore));
    }
}

let setTime = () => {
    time = quizzTime;
    // display the time block 
    timeBlock.style.display = "inline-block";

    // Sets interval in variable
    var timerInterval = setInterval(() => {
        time--;
        timeBlock.textContent = time + " s ";

        if (time === 0) {
            clearInterval(timerInterval);
            displayResult();
        }
    }, 1000);
}

let displayResult = () => {
    timeBlock.style.display = "none";
    questionPage.style.display = "none";
    resultPage.style.display = "block";
    resultMessage.textContent = `Your final score is ${Math.floor(quizz.result)}/100.`

}

// check the result of question
let checkResult = (event, question) => {
    questionResult.style.display = "block"
    let buttons = questionList.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });
    // console.log(buttons);

    if (event.target.textContent === question.answer[0]) {
        questionResult.style.color = "green";
        questionResult.textContent = "Correct, " + question.answer[1];
        quizz.result += (100 / quizz.questions.length);
    } else {
        questionResult.style.color = "red";
        questionResult.textContent = "Incorrect, " + question.answer[1];
        time -= 5;
        if (time < 0) {
            time = 0;
        }
    }

    // button for the next question, of the index reaches the end of the questions, the next button changes its text from Next to Finsh
    if (quizz.questionIndex === quizz.questions.length) {
        questionNextButton.textContent = "Finsih";
    }
    questionNextButton.style.display = "block";
}

let startQuizz = () => {
    // console.log(questions);
    quizz.questionIndex = 0;
    welcomePage.style.display = 'none';
    questionPage.style.display = 'block';
    readQuestion(3).then(result => {
        quizz.questions = result;
        if (quizz.questionIndex >= 0 && quizz.questionIndex < quizz.questions.length) {
            renderOneQuestion(quizz.questions[quizz.questionIndex]);
            setTime();
        }
    }).catch(error => {
        console.error('Error:', error);
    })
}

// render one question
let renderOneQuestion = (question) => {
    questionList.innerHTML = "";
    questionResult.style.display = "none";
    questionContent.textContent = question.question;
    question.choises.forEach(choise => {
        let li = document.createElement('li');
        let button = document.createElement('button');
        button.style.display = "block"
        button.textContent = choise;
        button.addEventListener("click", (event) => {
            checkResult(event, question);
        })
        questionList.appendChild(li.appendChild(button));
    });
    quizz.questionIndex++;
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
