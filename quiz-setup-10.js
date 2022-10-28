/* attributes are used
-- required
1. nny-quiz="list" - list of questions
2. nny-quiz="finish" - final screen
3. nny-quiz="form" - the actual form

--required for the db
1. nny-quiz="user-name" - name to db
2. nny-quiz="user-email" - email to db
3. nny-quiz="sumbit" - submit btn


-- optional
1. nny-quiz="next" - next button
2. nny-quiz="total-questions" - total amount of questions
3. nny-quiz="current-question" - current question
4. nny-quiz="progress-bar" - progress bar
5. nny-quiz="points" - points for each question
6. nny-quiz="form-error" - display error
7. nny-quiz="right-answers" - total amount of right answers
8. nny-quiz="result" - main div with the result collection
9. nny-quiz="result-item" - collection item with the result
10. nny-quiz="result-points" - number of final points
11. nny-quiz="result-total-right-answers" - number of final right answers

--leaderboard

1. nny-quiz="leaderboard" - container for the leaderboard
2. nny-quiz="leaderboard-item" - container for the leaderboard item
3. nny-quiz="leaderboard-name" - name from the db
4. nny-quiz="leaderboard-score" - final points from the db
5. nny-quiz="current-participant" - current user item
6. nny-quiz="leaderboard-position" - position number






*/

//turn off native webflow forms
function turnOffNativeForm() {
    const quizForm = document.querySelector('[nny-quiz="form"]');
    quizForm.addEventListener("submit", handlerCallback, true);

    function handlerCallback(event) {
        event.preventDefault();
        event.stopPropagation();
    }
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
        if (!document.querySelector('[nny-quiz="submit"]')) {
            showResult();
        }

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
let rightAnswersAmount = 0;
document.querySelectorAll('input').forEach((el) => {
    el.addEventListener('click', function () {
        if (el.type == "radio") {
            const currentAnswerPoints = el.parentElement.querySelector('[nny-quiz="points"]').innerHTML;
            const currentQuestion = document.querySelector('.current-question');
            const currentAnswer = currentQuestion.querySelector('.nny-points');
            currentAnswer.value = currentAnswerPoints;
            if (currentAnswer.value != 0) {
                rightAnswersAmount = rightAnswersAmount + 1;
                if (document.querySelector('[nny-quiz="right-answers"]')) {
                    document.querySelector('[nny-quiz="right-answers"]').innerHTML = rightAnswersAmount;
                }
            }
        }
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

//show result in the amount of right answers
function showResult() {
    const allAnswers = Array.from(document.querySelectorAll('.nny-points'));
    let total_points = [];
    for (i = 0; i < allAnswers.length; i++) {
        let currentAnswer = Number(allAnswers[i].value);
        total_points.push(currentAnswer);
    }
    const total_points_number = total_points.reduce((a, b) => a + b, 0);
    const resultScreen = document.querySelector('[nny-quiz="result"]');
    if (resultScreen) {
        document.querySelector('[nny-quiz="finish"]').style.display = 'none';
        resultScreen.style.display = 'block';
    }
    //if we have points
    const possiblePoints = document.querySelectorAll('[nny-quiz="result-points"]');
    if (possiblePoints) {
        for (i = 0; i < possiblePoints.length; i++) {
            if (Number(possiblePoints[i].innerHTML) == total_points_number) {
                const resultItem = $(possiblePoints[i]).closest(document.querySelector('[nny-quiz="result-item"]'));
                resultItem.css({
                    "display": "block"
                });
            }
        }
    }
    //if we have right answers
    const rightAnswersNumber = document.querySelectorAll('[nny-quiz="result-total-right-answers"]');
    if (rightAnswersNumber) {
        for (i = 0; i < rightAnswersNumber.length; i++) {
            console.log(rightAnswersAmount)
            if (Number(rightAnswersNumber[i].innerHTML) == rightAnswersAmount) {
                const resultItem = $(rightAnswersNumber[i]).closest(document.querySelector('[nny-quiz="result-item"]'));
                resultItem.css({
                    "display": "block"
                });
            }
        }
    }
}

//sending the user results to the db
function sendPoints() {
    console.log('sendPoint is working')
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
        total_points: total_points_final,
        name: user_name,
        email: user_email,
        memberstack_id: currentUserId
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
        .finally(() => {
            showResult();
        })
};
if (document.querySelector('[nny-quiz="submit"]')) {
    document.querySelector('[nny-quiz="submit"]').addEventListener('click', sendPoints);
}

//show the leaderboard
function showLeaderboard() {
    const url =
        'https://x8ki-letl-twmt.n7.xano.io/api:84zPS-li/participants';
    fetch(url, {
            method: 'GET',
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then((text) => {
                throw new Error(text);
            });
        })
        .then((data) => {
            const leaderboardParent = document.querySelector('[nny-quiz="leaderboard"]');
            const leaderboardClass = leaderboardParent.className;
            const newParent = document.createElement('div');
            newParent.className = leaderboardClass;
            document.body.appendChild(newParent);
            const leaderboardPositionTemplate = document.querySelector('[nny-quiz="leaderboard-position"]').outerHTML;
            const leaderboardNameTemplate = document.querySelector('[nny-quiz="leaderboard-name"]').outerHTML;
            const leaderboardScoreTemplate = document.querySelector('[nny-quiz="leaderboard-score"]').outerHTML;
            const leaderboardItemTemplate = document.querySelector('[nny-quiz="leaderboard-item"]').outerHTML;
            let loopTime;
            if (data.length < 11) {
                loopTime = data.length;
            } else {
                loopTime = 11;
            }
            for (let i = 1; i < loopTime; i++) {
                let leaderboardPosition = document.querySelector('[nny-quiz="leaderboard-position"]');
                if (i < 10) {
                    leaderboardPosition.innerHTML = `0${i}`;
                } else {
                    leaderboardPosition.innerHTML = i;
                }
                let leaderboardPositionDiv = leaderboardPosition.outerHTML;

                let leaderboardName = document.querySelector('[nny-quiz="leaderboard-name"]');
                leaderboardName.classList.add('clone');
                leaderboardName.innerHTML = data[i].Name;
                let leaderboardNameDiv = leaderboardName.outerHTML;

                let leaderboardScore = document.querySelector('[nny-quiz="leaderboard-score"]');
                leaderboardScore.innerHTML = data[i].Total_points;
                let leaderboardScoreDiv = leaderboardScore.outerHTML;

                let leaderboardItem = leaderboardItemTemplate.replace(leaderboardPositionTemplate, leaderboardPositionDiv).replace(leaderboardNameTemplate, leaderboardNameDiv).replace(leaderboardScoreTemplate, leaderboardScoreDiv);;
                newParent.innerHTML += leaderboardItem;
            };
            leaderboardParent.remove();

        })
        .catch((error) => {
            showError(error.message);
        })
};

//checking the status of the subscription and setting the main variables based on that
function activateScript(activeStatus) {

    if (activeStatus == true) {
        console.log('the user is active')
        //setting main variables and create first question
        const list = document.querySelector('[nny-quiz="list"]');
        const finalScreen = document.querySelector('[nny-quiz="finish"]');
        finalScreen.style.display = 'none';
        const resultScreen = document.querySelector('[nny-quiz="result"]');
        if (resultScreen) {
            resultScreen.style.display = 'none';
        }

        const resultItems = document.querySelectorAll('[nny-quiz="result-item"]');
        if (resultItems) {
            resultItems.forEach((el) => {
                el.style.display = 'none';
            })
        };

        list.firstElementChild.classList.add('current-question');
        Array.from(list.children).forEach((el) => {
            if (!el.classList.contains('current-question')) {
                el.style.display = 'none';
            }
        })
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
    
        //show total questions
        const totalQuestions = list.children.length;
        const totalQuestionsText = document.querySelectorAll('[nny-quiz="total-questions"]');
        if (totalQuestionsText) {
            Array.from(totalQuestionsText).forEach((el) => {
                el.innerHTML = totalQuestions;
            })
        }
    
    } else { console.log('the user is not active')
}
}


//checking the subscription status in the db
function getMemberStatus(currentUserId) {
    const url =
        `https://x8ki-letl-twmt.n7.xano.io/api:84zPS-li/member/${currentUserId}`;
    fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then((text) => {
                throw new Error(text);
            });
        })
        .then((data) => {
            const expirationDate = data.memberstack_expiration_date;
            const currentDate = Math.floor(Date.now() / 1000);
            if (expirationDate) {
                if (currentDate > expirationDate) {
                    activeStatus = false;
                } else {
                    activeStatus = true;
                }

            } else {
                activeStatus = true;
            }

            activateScript(activeStatus);

        })
        .catch((error) => {
            showError(error.message);
        })
}

//loading page events
onload = (event) => {
    const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
    getMemberStatus(currentUserId);
    turnOffNativeForm();
}
