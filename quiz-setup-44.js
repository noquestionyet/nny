/* attributes are used
-- required
1. nny-quiz="list" - list of questions
2. nny-quiz="finish" - final screen
3. nny-quiz="form" - the actual form


--required for the db
1. nny-quiz="user-name" - name to db
2. nny-quiz="user-email" - email to db
3. nny-quiz="sumbit" - submit btn
4. nny-quiz="quiz-name" - name of the quiz



-- optional
1. nny-quiz="next" - next button
2. nny-quiz="total-questions" - total amount of questions
3. nny-quiz="current-question" - current question
4. nny-quiz="progress-bar" - progress bar
5. nny-quiz="points" - points for each question
6. nny-quiz="state" - true/false state for each answer
7. nny-quiz="form-error" - display error
8. nny-quiz="right-answers" - total amount of right answers
9. nny-quiz="result" - main div with the result collection
10. nny-quiz="result-item" - collection item with the result
11. nny-quiz="result-points" - number of final points
12. nny-quiz="result-total-right-answers" - number of final right answers

--leaderboard

1. nny-quiz="leaderboard" - container for the leaderboard
2. nny-quiz="leaderboard-item" - container for the leaderboard item
3. nny-quiz="leaderboard-name" - name from the db
4. nny-quiz="leaderboard-score" - final points from the db
5. nny-quiz="current-participant" - current user item
6. nny-quiz="leaderboard-position" - position number

--splash
1. nny-quiz="splash" - container for the splash, don't put it inside the form!
2. nny-quiz="splash-start" - start button that lead to the quiz







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

//hide splash screen
function hideSplash() {
    const quizForm = document.querySelector('[nny-quiz="form"]');
    const splashScreen = document.querySelector('[nny-quiz="splash"]');
    const progressBar = document.querySelector('[nny-quiz="progress-bar"]');
    splashScreen.style.display = 'none';
    quizForm.style.display = 'flex';
    progressBar.style.display = 'flex';

}

//update progress
let gameOver = false;
//show current question number
function currentQuestionNumber(totalAnsweredQuestions, totalQuestions) {
    //console.log(`total points in current question numbera ${total_points}`);

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
    //console.log(`total points update progress ${total_points}`);

    const progressBar = document.querySelector('[nny-quiz="progress-bar"]');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// show next question
function nextQuestion(totalQuestions) {
    //delete this
    //console.log('next question func fires')
    //console.log(`total points in next question ${total_points}`);

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
    const progress = 100 * ((totalAnsweredQuestions.length + 1) / totalQuestions);
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


//show error
function showError(value) {
    if (value) {
        /*const defaultError = document.querySelector('.w-form-fail');
        const customError = document.querySelector('[nny-quiz="form-error"]');
        if (defaultError) {
            defaultError.style.display = 'flex';
            defaultError.innerHTML = value;
        } else {
            customError.style.display = 'flex';
            customError.innerHTML = value;
        }*/
        console.log(value)

    }
}

//show result in the amount of right answers
function showResult() {
    const resultScreen = document.querySelector('[nny-quiz="result"]');
    if (resultScreen) {
        document.querySelector('[nny-quiz="finish"]').style.display = 'none';
        resultScreen.style.display = 'block';
    }
    //if we have points
    const possiblePoints = document.querySelectorAll('[nny-quiz="result-points"]');
    if (possiblePoints) {
        for (i = 0; i < possiblePoints.length; i++) {
            if (Number(possiblePoints[i].innerHTML) == total_points) {
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
    console.log(total_points);
    console.log(allUserAnswers);
    console.log('sendPoint is working')
    const user_name = document.querySelector('[nny-quiz="user-name"]').value;
    const user_email = document.querySelector('[nny-quiz="user-email"]').value;
    const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
    const quizName = document.querySelector('nny-quiz="quiz-name"]');


   /* const final_data = {
        total_points: total_points,
        name: user_name,
        email: user_email,
        answers: allUserAnswers,
        member_uuid: currentUserId,
        quiz_name: quizName
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
            console.log(showError);
            showError(error.message);
        })
        .finally(() => {
            showResult();
        })*/
};

//show the leaderboard
function showLeaderboard() {
    const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
    const quizName = document.querySelector('[nny-quiz="quiz-name"]');

    const url =
        `https://x8ki-letl-twmt.n7.xano.io/api:84zPS-li/member_current/${currentUserId}/${quizName}`;
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
            console.log(error);
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
        const quizName = document.querySelector('[nny-quiz="quiz-name"]');
        if (quizName) {
            quizName.style.display = 'none';  
        }

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
        updateProgressBar(20);

        //if we want the next button
        const nextButton = document.querySelectorAll('[nny-quiz="next"]');
        if (nextButton.length != 0) {
            nextButton.forEach((el) => {
                el.addEventListener('click', () => {
                    nextQuestion(totalQuestions);
                });
            });
        } else {
            document.querySelectorAll('input[type="radio"]').forEach((el) => {
                el.addEventListener('click', () => {
                    setTimeout (
                        function(){
                            nextQuestion(totalQuestions);
                        }, 100
                    )
                });
            });
        }

        //if we want the previous button
        const previousButton = document.querySelectorAll('[nny-quiz="previous"]');
        if (previousButton.length != 0) {
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

        if (document.querySelector('[nny-quiz="submit"]')) {
            document.querySelector('[nny-quiz="submit"]').addEventListener('click', sendPoints);
        }

        //if splash screen exists
        const quizForm = document.querySelector('[nny-quiz="form"]');
        const splashScreen = document.querySelector('[nny-quiz="splash"]');
        const progressBar = document.querySelector('[nny-quiz="progress-bar"]');
        if (splashScreen) {
            quizForm.style.display = 'none';
            progressBar.style.display = 'none';

        }

        if (document.querySelector('[nny-quiz="splash-start"]')) {
            document.querySelector('[nny-quiz="splash-start"]').addEventListener('click', hideSplash);
        }

        //copy the current answer points and put in the hidden input
        let rightAnswersAmount = 0;
        let allUserAnswers = [];
        let total_points = [];
document.querySelectorAll('input[type="radio"]').forEach((el) => {
    el.addEventListener('click', () => {

            console.log('FUNCTION is firing')
            const currentAnswerPoints = el.parentElement.querySelector('[nny-quiz="points"]').innerHTML;
            const currentAnswerLabel = el.parentElement.querySelector('.w-form-label').innerHTML;
            const currentAnswerState = el.parentElement.querySelector('[nny-quiz="state"]').innerHTML;
            const answerPoints = document.querySelector('[nny-quiz="points"]').innerHTML;
            const currentQuestion = document.querySelector('.current-question');
            allUserAnswers.push(currentAnswerLabel);
            console.log(allUserAnswers);
            if (currentAnswerPoints){
                console.log(currentAnswerPoints)
              total_points.push(Number(currentAnswerPoints));
              console.log(total_points)
            }
            else {
                if (currentAnswerState == 'true') {
                    total_points.push(Number(currentAnswerPoints));
                }
                else {
                    total_points.push(0);
                }
            }
            if (currentAnswerState == 'true') {
                rightAnswersAmount = rightAnswersAmount + 1;
                if (document.querySelector('[nny-quiz="right-answers"]')) {
                    document.querySelector('[nny-quiz="right-answers"]').innerHTML = rightAnswersAmount;
                }
            }
            
    });
});
console.log(total_points);
            console.log(allUserAnswers);


    } else {
        console.log('the user is not active')
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
            console.log(error);
            showError(error.message);
        })
}


//loading page events
onload = (event) => {
    const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
    getMemberStatus(currentUserId);
    turnOffNativeForm();
}
