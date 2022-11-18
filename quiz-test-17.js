/* attributes are used
-- required
1. nny-quiz="list" - list of questions
2. nny-quiz="form" - the actual form
we would need final screen after the quiz
3. nny-quiz="finish" - final screen with the login form (send data to the db)
4. nny-quiz="result" - final screen with the result



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
4.1. nny-quiz="progress-circle" -progress circle wrapper
4.2. nny-quiz="progress-circle-element" - circle element that we use for styling the progress bar
4.3. nny-quiz="progress-part" - partial progress
4.4. nny-quiz="progress-part-element" - if the progress is partial, this is one of the elements
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
7. nny-quiz="show-leaderboard" - button which shows the leaderboard
8. nny-quiz="leaderboard-wrapper" - container for the leaderboard

--splash
1. nny-quiz="splash" - container for the splash, don't put it inside the form!
2. nny-quiz="splash-start" - start button that lead to the quiz

*/

//turn off native webflow forms
function turnOffNativeForm(quizForm) {
    //const quizForm = document.querySelector('[nny-quiz="form"]');
    quizForm.addEventListener("submit", handlerCallback, true);

    function handlerCallback(event) {
        event.preventDefault();
        event.stopPropagation();
    }
}

//hide splash screen
function hideSplash() {
    //const quizForm = document.querySelector('[nny-quiz="form"]');
    const splashScreen = document.querySelector('[nny-quiz="splash"]');
    const progressBar = document.querySelector('[nny-quiz="progress-bar"]');
    const progressCircle = document.querySelector('[nny-quiz="progress-circle"]');
    splashScreen.style.display = 'none';
    quizForm.style.display = 'block';
    if (progressBar) {
        progressBar.style.display = 'block';
    }
    if (progressCircle) {
        progressCircle.style.display = 'block';
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
    //update the partial progress bar
    const progressBarParts = document.querySelectorAll('[nny-quiz="progress-part-element"]');
    if (progressBarParts) {
        for (let i = 0; i < progressBarParts.length; i++) {
            if (i < totalAnsweredQuestions.length){
                progressBarParts[i + 1].classList.add('active');
            }
        }
    }
}

//add script for the circle progress bar
function addProgressCircleScript(){
    const circleProgressBarScript = document.createElement("script");
    circleProgressBarScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/progressbar.js/1.0.0/progressbar.min.js';
    document.head.appendChild(circleProgressBarScript);
    let bar;  
    circleProgressBarScript.addEventListener('load', function() {
        createProgressCircle();
    });
}

//create progress circle using the script above
function createProgressCircle() {
    const progressCircleIcon = document.querySelector('[nny-quiz="progress-circle-element"]');
    const progressCircleColorActive = window.getComputedStyle(progressCircleIcon).getPropertyValue("border-color");
    const progressCircleWidth = Number(window.getComputedStyle(progressCircleIcon).getPropertyValue("border-width").replace(/em|rem|px|ch|vw|vh|%/g,''));
    let progressCircleColor = progressCircleColorActive.replace(/rgb/i, "rgba");
    progressCircleColor = progressCircleColor.replace(/\)/i,',0.3)');
    document.querySelector('[nny-quiz="progress-circle-element"]').style.display = 'none';
     bar = new ProgressBar.Circle('[nny-quiz="progress-circle"]', {
        strokeWidth: progressCircleWidth,
        easing: 'easeOut',
        duration: 400,
        color: progressCircleColorActive,
        trailColor: progressCircleColor,
        trailWidth: progressCircleWidth,
        svgStyle: null
      });    
};

//show progress bar
function updateProgressBar(progress) {
    const progressBar = document.querySelector('[nny-quiz="progress-bar"]');
    const progressCircle = document.querySelector('[nny-quiz="progress-circle"]');

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    if (progressCircle) {
        bar.animate(progress/100);
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
        const progressBar = document.querySelector('[nny-quiz="progress-bar"]');
        const progressCircle = document.querySelector('[nny-quiz="progress-circle"]');
        const progressPartial = document.querySelector('[nny-quiz="progress-part"]');

        if (finalScreen) {
        
        finalScreen.style.display = 'flex';
        currentQuestion.style.display = 'none';
        if (progressBar) {
            progressBar.style.display = 'none';
        }
        if (progressCircle) {
            progressCircle.style.display = 'none';
        }
        if (progressPartial) {
            progressPartial.style.display = 'none';
        }
    }
    else {
        showResult('false');
    }
}
    const totalAnsweredQuestions = document.querySelectorAll('.answered');
    const progress = 100 * ((totalAnsweredQuestions.length + 1) / totalQuestions);
    if (progress == 100) {
        gameOver = true;
    } else {
        gameOver = false;
    }

    //get the current answer value and points
    let rightAnswersAmount = 0;
    const totalPoints = localStorage.getItem('totalPoints');
    const allUserAnswers = localStorage.getItem('allUserAnswers');
    const checkedRadio = document.querySelector('input[type=radio]:checked');
    const currentAnswerPoints = checkedRadio.parentElement.querySelector('[nny-quiz="points"]').innerHTML;
    const currentAnswerLabel = checkedRadio.parentElement.querySelector('.w-form-label').innerHTML;
    const currentAnswerState = checkedRadio.parentElement.querySelector('[nny-quiz="state"]').innerHTML;
    const answerPoints = document.querySelector('[nny-quiz="points"]').innerHTML;
    if (allUserAnswers == '') {
        localStorage.setItem('allUserAnswers', currentAnswerLabel);
    } else {
        const newAllUserAnswers = allUserAnswers + ',' + currentAnswerLabel;
        localStorage.setItem('allUserAnswers', newAllUserAnswers);
    }
    if (currentAnswerPoints) {
        const newTotalPoints = Number(totalPoints) + Number(currentAnswerPoints);
        localStorage.setItem('totalPoints', newTotalPoints);
    } else {
        if (currentAnswerState == 'true') {
            const newTotalPoints = Number(totalPoints) + Number(currentAnswerPoints);
            localStorage.setItem('totalPoints', newTotalPoints);
        }
    }
    if (currentAnswerState == 'true') {
        rightAnswersAmount = rightAnswersAmount + 1;
        if (document.querySelector('[nny-quiz="right-answers"]')) {
            document.querySelector('[nny-quiz="right-answers"]').innerHTML = rightAnswersAmount;
        }
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
function showResult(sentToDb) {
    const resultScreen = document.querySelector('[nny-quiz="result"]');
    const leaderboardScreen = document.querySelector('[nny-quiz="leaderboard"]');
    if (resultScreen) {
        document.querySelector('[nny-quiz="finish"]').style.display = 'none';
        resultScreen.style.display = 'block';
    }
    //if we have leaderboard
    if(sentToDb == 'true') {
         if (resultScreen.querySelector(leaderboardScreen)) {
            showLeaderboard();
        }
    }

    //if we have points
    const possiblePoints = document.querySelectorAll('[nny-quiz="result-points"]');
    const totalPoints = localStorage.getItem('totalPoints');
    if (possiblePoints) {
        for (i = 0; i < possiblePoints.length; i++) {
            if (Number(possiblePoints[i].innerHTML) == totalPoints) {
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
    //remove the data from local storage
    localStorage.removeItem('totalPoints');
    localStorage.removeItem('allUserAnswers');
}

//sending the user results to the db
function sendPoints() {
    const total_points = localStorage.getItem('totalPoints');
    const allUserAnswers = localStorage.getItem('allUserAnswers');
    const allUserAnswersArray = allUserAnswers.split(',');
    const user_name = document.querySelector('[nny-quiz="user-name"]').value;
    const user_email = document.querySelector('[nny-quiz="user-email"]').value;
    const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
    const quizName = document.querySelector('[nny-quiz="quiz-name"]').innerHTML;
    const final_data = {
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
            showResult('true');
        })
};

//show the leaderboard
function showLeaderboard() {
    const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
    const quizName = document.querySelector('[nny-quiz="quiz-name"]').innerHTML;
    const resultScreen = document.querySelector('[nny-quiz="leaderboard-wrapper"]');
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
            resultScreen.appendChild(newParent);
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
            let currentParticipantDb;
            const currentParticipant = 'pasta@test.com';
            for (let i = 0; i < data.length; i++) {
                if (currentParticipant == data[i].email) {
                    currentParticipantDb = data[i];
                    if (i > loopTime) {
                        const newCurrentParent = document.createElement('div');
                        newCurrentParent.className = leaderboardClass;
                        newCurrentParent.style.marginTop = "1.5rem";
                        resultScreen.appendChild(newCurrentParent);
                        let leaderboardPositionCurrent = document.querySelector('[nny-quiz="leaderboard-position"]');
                        leaderboardPositionCurrent.innerHTML = i + 1;

                        let leaderboardPositionCurrentDiv = leaderboardPositionCurrent.outerHTML;

                        let leaderboardNameCurrent = document.querySelector('[nny-quiz="leaderboard-name"]');
                        leaderboardNameCurrent.classList.add('clone');
                        leaderboardNameCurrent.innerHTML = data[i].name;
                        let leaderboardNameCurrentDiv = leaderboardNameCurrent.outerHTML;

                        let leaderboardScoreCurrent = document.querySelector('[nny-quiz="leaderboard-score"]');
                        leaderboardScoreCurrent.innerHTML = data[i].total_points;
                        let leaderboardScoreCurrentDiv = leaderboardScoreCurrent.outerHTML;

                        let leaderboardItemCurrent = leaderboardItemTemplate.replace(leaderboardPositionTemplate, leaderboardPositionCurrentDiv).replace(leaderboardNameTemplate, leaderboardNameCurrentDiv).replace(leaderboardScoreTemplate, leaderboardScoreCurrentDiv);;
                        newCurrentParent.innerHTML = leaderboardItemCurrent;
                    }
                }
            }
            for (let i = 0; i < loopTime; i++) {
                let leaderboardPosition = document.querySelector('[nny-quiz="leaderboard-position"]');
                if (i < 10) {
                    leaderboardPosition.innerHTML = `0${i + 1}`;
                } else {
                    leaderboardPosition.innerHTML = i + 1;
                }
                let leaderboardPositionDiv = leaderboardPosition.outerHTML;

                let leaderboardName = document.querySelector('[nny-quiz="leaderboard-name"]');
                leaderboardName.classList.add('clone');
                leaderboardName.innerHTML = data[i].name;
                let leaderboardNameDiv = leaderboardName.outerHTML;

                let leaderboardScore = document.querySelector('[nny-quiz="leaderboard-score"]');
                leaderboardScore.innerHTML = data[i].total_points;
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
function activateScript(activeStatus, quizForm) {
    let userStatus = false;
    let currentURL = window.location.hostname;
    if (currentURL.includes("webflow.io")){
        userStatus = true;
    }
    else {
        if (activeStatus == true) {
            userStatus = true;
        }
    }

    if (userStatus == true){
        console.log('the user is active')
        //setting main variables and create first question
        //const list = document.querySelector('[nny-quiz="list"]');
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

        //create local storage keys to store total points and answers
        const totalPointsElement = localStorage.setItem('totalPoints', '');
        const totalAnswersElement = localStorage.setItem('allUserAnswers', '');

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
                    setTimeout(
                        function () {
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

        //if we have partial progress
        const progressPartsWrapper = document.querySelector('[nny-quiz="progress-part"]');
        if (progressPartsWrapper) {
            const progressPart = document.querySelector('[nny-quiz="progress-part-element"]'); 
            const progressPartClass = progressPart.className;
            while (progressPartsWrapper.firstChild) {
                progressPartsWrapper.firstChild.remove()
            }
            for (let i=0; i < totalQuestions; i++){
                const newProgressPartElement = document.createElement("div");
                newProgressPartElement.classList.add(progressPartClass);
                newProgressPartElement.setAttribute('nny-quiz','progress-part-element');
                newProgressPartElement.style.width = `${100/totalQuestions}%`;
                progressPartsWrapper.appendChild(newProgressPartElement);
            }
            progressPartsWrapper.firstElementChild.classList.add('active');
        }

        if (document.querySelector('[nny-quiz="submit"]')) {
            document.querySelector('[nny-quiz="submit"]').addEventListener('click', sendPoints);
        }

        //if splash screen exists
        //const quizForm = document.querySelector('[nny-quiz="form"]');
        const splashScreen = document.querySelector('[nny-quiz="splash"]');
        const progressBar = document.querySelector('[nny-quiz="progress-bar"]');
        if (splashScreen) {
            quizForm.style.display = 'none';
            if (progressBar) {
                progressBar.style.display = 'none';
            }

        }

        if (document.querySelector('[nny-quiz="splash-start"]')) {
            document.querySelector('[nny-quiz="splash-start"]').addEventListener('click', hideSplash);
        }

        if (document.querySelector('[nny-quiz="show-leaderboard"]')) {
            document.querySelector('[nny-quiz="show-leaderboard"]').addEventListener('click', showLeaderboard);
        }

    } else {
        console.log('the user is not active')
    }

}

//checking the subscription status in the db
function getMemberStatus(currentUserId, quizForm) {
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
            let expirationDate = data.memberstack_expiration_date;
            let currentDate = Math.floor(Date.now() / 1000);
            if (expirationDate) {
                if (currentDate > expirationDate) {
                    activeStatus = false;
                } else {
                    activeStatus = true;
                }

            } else {
                activeStatus = true;
            }

            activateScript(activeStatus, quizForm);

        })
        .catch((error) => {
            console.log(error);
            showError(error.message);
        })
}

//loading page events

document.addEventListener("DOMContentLoaded", () => {
    const quizForm = document.querySelector('[nny-quiz="form"]');
    const list = document.querySelector('[nny-quiz="list"]');
    const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
    getMemberStatus(currentUserId, quizForm);
    turnOffNativeForm(quizForm);
    const progressCircle = document.querySelector('[nny-quiz="progress-circle"]');
    if (progressCircle) {
        addProgressCircleScript();
    };
})
