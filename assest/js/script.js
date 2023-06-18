// define constants
const quizzTime = 30;
const numOfQuestions = 5;

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
let time = 0;
let quizz = {
    questions: [],
    questionIndex: 0,
    result: 0,
    name: "",
};

// add event listener
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


// Navigate to another HTML page
let routeToHighScore = () => {
    window.location.href = "./assest/html/highScore.html";
}

// add to the ranking
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

// set time
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

// display the result
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
    console.log("event.target.dataset.value: " + event.target.dataset.value);
    console.log("question.answer[0]: " + question.answer[0]);

    if (event.target.dataset.value === question.answer[0]) {
        // questionResult.style.color = "green";
        if (!questionResult.classList.contains("alert-success")) {
            questionResult.classList.add("alert-success");
        }
        if (questionResult.classList.contains("alert-danger")) {
            questionResult.classList.remove("alert-danger");
        }

        // questionResult.classList.add("alert-success");
        questionResult.textContent = "Correct, " + question.answer[1];

        // accumulate the score
        quizz.result += (100 / quizz.questions.length);
    } else {
        // questionResult.style.color = "red";
        if (questionResult.classList.contains("alert-success")) {
            questionResult.classList.remove("alert-success");
        }
        if (!questionResult.classList.contains("alert-danger")) {
            questionResult.classList.add("alert-danger");
        }

        questionResult.textContent = "Incorrect, " + question.answer[1];

        // reduce the time due to the incorrec answer
        time -= 5;
        if (time < 0) {
            time = 0;
        }
    }

    // button for the next question, of the index reaches the end of the questions, the next button changes its text from Next to Finsh
    if (quizz.questionIndex === quizz.questions.length) {
        questionNextButton.textContent = "Finish";
    }
    questionNextButton.style.display = "block";
}

// startQuiz
let startQuizz = () => {
    // console.log(questions);
    quizz.questionIndex = 0;
    welcomePage.style.display = 'none';
    questionPage.style.display = 'block';
    readQuestion(numOfQuestions).then(result => {
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
    questionContent.textContent = `${(quizz.questionIndex + 1)}. ${question.question}`;
    let i = 65;
    question.choises.forEach(choise => {
        let li = document.createElement('li');
        let button = document.createElement('button');
        button.classList.add("btn", "btn-secondary", "w-100", "text-start", "my-1");
        button.type = "button";
        button.textContent = `${String.fromCharCode(i)}. ${choise}`;
        button.dataset.value = choise;
        button.addEventListener("click", (event) => {
            checkResult(event, question);
        })
        questionList.appendChild(li.appendChild(button));
        i++;
    });
    quizz.questionIndex++;
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
