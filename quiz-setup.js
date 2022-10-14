/* attributes are used
-- required
1. nny-quiz="list" - list of questions
2. nny-quiz="finish" - final screen
3. nny-quiz="sumbit" - submit btn
4. nny-quiz="form" - the actual form


-- optional
1. nny-quiz="next" - next button
2. nny-quiz="total-questions" - total amount of questions
3. nny-quiz="current-question" - current question
4. nny-quiz="progress-bar" - progress bar
5. nny-quiz="points" - points for each question
6. nny-quiz="user-name" - name to db
7. nny-quiz="user-email" - email to db
8. nny-quiz="form-error" - display error


*/

//turn off native webflow forms
const quizForm = document.querySelector('[nny-quiz="form"]');
quizForm.addEventListener("submit", handlerCallback, true);
function handlerCallback(event) {
  event.preventDefault();
  event.stopPropagation();
}

//update progress
let gameOver = false;
//show current question number
function currentQuestionNumber(totalAnsweredQuestions, totalQuestions) {
    const totalAnsweredQuestionsText = document.querySelectorAll('[nny-quiz="current-question"]');
    if (totalAnsweredQuestionsText) {
        if (totalAnsweredQuestions.length != totalQuestions) {
            Array.from(totalAnsweredQuestionsText).forEach((el) => {
                el.innerHTML = totalAnsweredQuestions.length + 1;
            })
        } else {
            Array.from(totalAnsweredQuestionsText).forEach((el) => {
                el.innerHTML = totalQuestions;
            })
        }
    }

}
//show progress bar
function updateProgressBar(progress) {
    const progressBar = document.querySelector('[nny-quiz="progress-bar"]');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// show next question
function nextQuestion(totalQuestions) {
    const currentQuestion = document.querySelector('.current-question');
    if (gameOver == false) {
        const nextQuestion = currentQuestion.nextElementSibling;
        if (nextQuestion) {
            nextQuestion.classList.add('current-question');
            nextQuestion.style.display = 'flex';
            currentQuestion.classList.remove('current-question');
            currentQuestion.style.display = 'none';
        }
        currentQuestion.classList.add('answered')
    } else {
        const finalScreen = document.querySelector('[nny-quiz="finish"]');
        finalScreen.style.display = 'flex';
        currentQuestion.style.display = 'none';
    }
    const totalAnsweredQuestions = document.querySelectorAll('.answered');
    const progress = 100 * (totalAnsweredQuestions.length / totalQuestions);
    if (progress == 100) {
        gameOver = true;
    } else {
        gameOver = false;
    }
    currentQuestionNumber(totalAnsweredQuestions, totalQuestions);
    updateProgressBar(progress);
}

// show previous question
function previousQuestion(totalQuestions) {
    const currentQuestion = document.querySelector('.current-question');
    const previousQuestion = currentQuestion.previousElementSibling;
    if (previousQuestion) {
        previousQuestion.classList.add('current-question');
        previousQuestion.style.display = 'flex';
        currentQuestion.classList.remove('current-question');
        currentQuestion.style.display = 'none';
    }
    previousQuestion.classList.remove('answered')
    const totalAnsweredQuestions = document.querySelectorAll('.answered');
    const progress = 100 * (totalAnsweredQuestions.length / totalQuestions);
    currentQuestionNumber(totalAnsweredQuestions, totalQuestions);
    updateProgressBar(progress);
}


//copy the current answer points and put in the hidden input
document.querySelectorAll('label').forEach((el) => {
    el.addEventListener('click', () => {
        const currentAnswerPoints = el.querySelector('[nny-quiz="points"]').innerHTML;
        const currentQuestion = document.querySelector('.current-question');
        const currentAnswer = currentQuestion.querySelector('.nny-points');
        currentAnswer.value = currentAnswerPoints;
    });
});

//show error
function showError(value) {
    if (value) {
        const defaultError = document.querySelector('.w-form-fail');
        const customError = document.querySelector('[nny-quiz="form-error"]');
        if (defaultError) {
            defaultError.style.display = 'flex';
            defaultError.innerHTML = value;
        } else {
            customError.style.display = 'flex';
            customError.innerHTML = value;
        }

    }
}

//sending the user results to the db
function sendPoints() {
    const allAnswers = Array.from(document.querySelectorAll('.nny-points'));
    let total_points = [];
    for (i = 0; i < allAnswers.length; i++) {
        let currentAnswer = Number(allAnswers[i].value);
        total_points.push(currentAnswer);
    }
    const total_points_number = total_points.reduce((a, b) => a + b, 0);
    const total_points_final = total_points_number.toString();
    const user_name = document.querySelector('[nny-quiz="user-name"]').value;
    const user_email = document.querySelector('[nny-quiz="user-email"]').value;
    const final_data = {
        Total_points: total_points_final,
        Name: user_name,
        Email: user_email
    }

    console.log(final_data)
    const url =
        'https://x8ki-letl-twmt.n7.xano.io/api:84zPS-li/create_participant';
    fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(final_data),
        })
        .then((response) => {
            if (response.ok) {
                return response.text();
            }
            return response.text().then((text) => {
                throw new Error(text);
            });
        })
        .catch((error) => {
            showError(error.message);
        })
};

document.querySelector('[nny-quiz="submit"]').addEventListener('click', sendPoints);






onload = (event) => {
    //setting main variables and create first question
    const list = document.querySelector('[nny-quiz="list"]');
    const finalScreen = document.querySelector('[nny-quiz="finish"]');
    finalScreen.style.display = 'none';
    list.firstElementChild.classList.add('current-question');
    Array.from(list.children).forEach((el) => {
        if (!el.classList.contains('current-question')) {
            el.style.display = 'none';
        }
    })
    //show total questions
    const totalQuestions = list.children.length;
    const totalQuestionsText = document.querySelectorAll('[nny-quiz="total-questions"]');
    if (totalQuestionsText) {
        Array.from(totalQuestionsText).forEach((el) => {
            el.innerHTML = totalQuestions;
        })
    }
    //if we want the next button
    const nextButton = document.querySelectorAll('[nny-quiz="next"]');
    if (nextButton) {
        nextButton.forEach((el) => {
            el.addEventListener('click', () => {
                nextQuestion(totalQuestions);
            });
        });
    } else {
        document.querySelectorAll('.w-radio').forEach((el) => {
            el.addEventListener('click', () => {
                nextQuestion(totalQuestions);
            });
        });
    }
    //if we want the previous button
    const previousButton = document.querySelectorAll('[nny-quiz="previous"]');
    if (previousButton) {
        previousButton[0].style.display = 'none';
        previousButton.forEach((el) => {
            el.addEventListener('click', () => {
                previousQuestion(totalQuestions);
            });
        });
    }

    //hide the points
    const points = document.querySelectorAll('[nny-quiz="points"]');
    if (points) {
        Array.from(points).forEach((el) => {
            el.style.display = 'none';
        });
    };
}
