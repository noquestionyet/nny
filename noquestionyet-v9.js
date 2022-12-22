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
8. nny-quiz="right-answers" - all right answers in the cms
8. nny-quiz="total-result-right-answers" - total amount of right answers
9. nny-quiz="total-result-points" - total amount of points
10. nny-quiz="result" - main div with the result collection
11. nny-quiz="result-item" - collection item with the result
12. nny-quiz="result-points" - number of final points
13. nny-quiz="start-over" - reload the page


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
function turnOffNativeForm() {
    const quizForm = document.querySelector('[nny-quiz="form"]');
    if (!quizForm){
        alert('Please, add a main form with questions, answers and user inputs on the page and set an attribute nny-quiz="form" to the form element');
    }
    quizForm.addEventListener("submit", handlerCallback, true);

    function handlerCallback(event) {
        event.preventDefault();
        event.stopPropagation();
    }
}

//start again
function startOver() {
    window.location.reload();
    //remove the data from local storage
    localStorage.removeItem('totalPoints');
    localStorage.removeItem('currentEmail');
    localStorage.removeItem('allUserAnswers');
    localStorage.removeItem('rightAnswers');
}

//hide splash screen
function hideSplash() {
    const quizForm = document.querySelector('[nny-quiz="form"]');
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
            if (i < totalAnsweredQuestions.length) {
                progressBarParts[i + 1].classList.add('active');
            }
        }
    }
}

//add script for the circle progress bar
function addProgressCircleScript() {
    const circleProgressBarScript = document.createElement("script");
    circleProgressBarScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/progressbar.js/1.0.0/progressbar.min.js';
    document.head.appendChild(circleProgressBarScript);
    let bar;
    circleProgressBarScript.addEventListener('load', function () {
        createProgressCircle();
    });
}

//create progress circle using the script above
function createProgressCircle() {
    const progressCircleIcon = document.querySelector('[nny-quiz="progress-circle-element"]');
    const progressCircleColorActive = window.getComputedStyle(progressCircleIcon).getPropertyValue("border-color");
    const progressCircleWidth = Number(window.getComputedStyle(progressCircleIcon).getPropertyValue("border-width").replace(/em|rem|px|ch|vw|vh|%/g, ''));
    let progressCircleColor = progressCircleColorActive.replace(/rgb/i, "rgba");
    progressCircleColor = progressCircleColor.replace(/\)/i, ',0.3)');
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
        bar.animate(progress / 100);
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
        } else {
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
    const totalPoints = localStorage.getItem('totalPoints');
    const allUserAnswers = localStorage.getItem('allUserAnswers');
    const rightAnswers = localStorage.getItem('rightAnswers');
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
            const newTotalPoints = Number(totalPoints) + Number(answerPoints);
            localStorage.setItem('totalPoints', newTotalPoints);
            localStorage.setItem('rightAnswers', (Number(rightAnswers) + 1));
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
    const leaderboardScreen = document.querySelector('[nny-quiz="leaderboard-result"]');
    if (resultScreen) {
        document.querySelector('[nny-quiz="finish"]').style.display = 'none';
        resultScreen.style.display = 'block';
    }
    //if we have leaderboard
    if (sentToDb == 'true') {
        if (leaderboardScreen && !resultScreen) {
            showLeaderboard();
        }
    }

    //if we have points
    const possiblePoints = document.querySelectorAll('[nny-quiz="result-points"]');
    const totalPoints = localStorage.getItem('totalPoints');
    const possiblePointsNumber = document.querySelector('[nny-quiz="total-result-points"]');
    if (possiblePointsNumber) {
        if (Number(totalPoints) != 0) {
            possiblePointsNumber.innerHTML = totalPoints;
        } else {
            possiblePointsNumber.innerHTML = 0;
        }
    }

    if (possiblePoints) {
        for (i = 0; i < possiblePoints.length; i++) {
            if (Number(possiblePoints[i].innerHTML) == Number(totalPoints)) {
                const resultItem = possiblePoints[i].closest('[nny-quiz="result-item"]');
                resultItem.style.display = 'block';
            };
        }
    }
    //if we have right answers
    const rightAnswersNumber = document.querySelectorAll('[nny-quiz="right-answers"]');
    const rightAnswersAmount = localStorage.getItem('rightAnswers');
    const rightAnswerText = document.querySelector('[nny-quiz="total-result-right-answers"]');
    if (rightAnswerText) {
        rightAnswerText.innerHTML = rightAnswersAmount;
    }
    if (rightAnswersNumber) {
        for (i = 0; i < rightAnswersNumber.length; i++) {
            if (Number(rightAnswersNumber[i].innerHTML) == Number(rightAnswersAmount)) {
                const resultItem = rightAnswersNumber[i].closest('[nny-quiz="result-item"]');
                resultItem.style.display = 'block';                
            }
        }
    }
}

//sending the user results to the db
function sendPoints() {
    const total_points = localStorage.getItem('totalPoints');
    const allUserAnswers = localStorage.getItem('allUserAnswers');
    const allUserAnswersArray = allUserAnswers.split(',');
    const user_name = document.querySelector('[nny-quiz="user-name"]').value;
    const user_email = document.querySelector('[nny-quiz="user-email"]').value;
    const currentEmailLocalStorage = localStorage.setItem('currentEmail', user_email);
    const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
    let quizName;
    if(document.querySelector('[nny-quiz="quiz-name"]')){
        quizName = document.querySelector('[nny-quiz="quiz-name"]').innerHTML;
    }
    else {
        quizName ='undefined';
    }
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
        'https://api.noquestionyet.com/api:84zPS-li/create_participant';
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
    const leaderboardScreen = document.querySelector('[nny-quiz="leaderboard-result"]');
    const result = document.querySelector('[nny-quiz="result"]');
    const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
    const quizName = document.querySelector('[nny-quiz="quiz-name"]').innerHTML;
    const resultScreen = document.querySelector('[nny-quiz="leaderboard-wrapper"]');
    const url =
        `https://api.noquestionyet.com/api:84zPS-li/member_current/${currentUserId}/${quizName}`;
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
            const leaderboardItemTemplateStyle = document.querySelector('[nny-quiz="leaderboard-item"]');
            const leaderboardItemTemplateClass = leaderboardItemTemplate.className;
            const originalResultColor = window.getComputedStyle(leaderboardItemTemplateStyle).getPropertyValue("background-color");
            console.log(leaderboardItemTemplateStyle)
            console.log(originalResultColor)
            let loopTime;
            if (data.length < 11) {
                loopTime = data.length;
            } else {
                loopTime = 10;
            }
            let currentParticipantDb;
            const currentEmailLocalStorage = localStorage.getItem('currentEmail');
            const currentParticipant = currentEmailLocalStorage;
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
                leaderboardPosition.innerHTML = i + 1;
                
                let leaderboardPositionDiv = leaderboardPosition.outerHTML;

                let leaderboardName = document.querySelector('[nny-quiz="leaderboard-name"]');
                leaderboardName.classList.add('clone');
                leaderboardName.innerHTML = data[i].name;
                let leaderboardNameDiv = leaderboardName.outerHTML;

                let leaderboardScore = document.querySelector('[nny-quiz="leaderboard-score"]');
                leaderboardScore.innerHTML = data[i].total_points;
                let leaderboardScoreDiv = leaderboardScore.outerHTML;

                let leaderboardItem = leaderboardItemTemplate.replace(leaderboardPositionTemplate, leaderboardPositionDiv).replace(leaderboardNameTemplate, leaderboardNameDiv).replace(leaderboardScoreTemplate, leaderboardScoreDiv);
                newParent.innerHTML += leaderboardItem;
            };
            leaderboardParent.remove();
            const allResultItems = document.querySelectorAll(leaderboardItemTemplateClass);
            if (originalResultColor != 'rgba(0, 0, 0, 0)'){
                console.log('yes, there is color')
                for (i = 0; i < allResultItems.length; i++){
                    allResultItems[0].style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    allResultItems[1].style.backgroundColor = "rgba(" + originalResultColor + ", 0.1)";
                    allResultItems[2].style.backgroundColor = "rgba(" + originalResultColor + ", 0.3)";
                    if (i > 2){
                        allResultItems[i].style.backgroundColor = originalResultColor;
                    }
                }
            }
            leaderboardScreen.style.display = 'flex';
            result.style.display = 'none';
            //remove the data from local storage
            localStorage.removeItem('totalPoints');
            localStorage.removeItem('currentEmail');
            localStorage.removeItem('allUserAnswers');
            localStorage.removeItem('rightAnswers');
        })
        .catch((error) => {
            showError(error.message);
        })
};

//checking the status of the subscription and setting the main variables based on that
function activateScript(activeStatus) {
    let userStatus = false;
    let currentURL = window.location.hostname;
    if (currentURL.includes("webflow.io")) {
        userStatus = true;
    } else {
        if (activeStatus == true) {
            userStatus = true;
        }
    }

    if (userStatus == true) {
        console.log('the user is active')
        //setting main variables and create first question
        const answerPoints = document.querySelector('[nny-quiz="points"]').innerHTML;
        if (document.querySelector('[nny-quiz="points"]')) {
          if (isNaN(Number(answerPoints))){
              alert("Please, set the amount of points for the correct answer in number format!");
          }
        }
        const list = document.querySelector('[nny-quiz="list"]');
        if (!list){
            alert('Please, add a CMS collection with questions and answers on the page and set an attribute nny-quiz="list" to the CMS Collection List');
        }
        const finalScreen = document.querySelector('[nny-quiz="finish"]');
        if (!finalScreen){
            alert('Please, add a final screen after all questions and answers with user inputs on the page and set an attribute nny-quiz="finish"');
        }
        finalScreen.style.display = 'none';
        const quizName = document.querySelector('[nny-quiz="quiz-name"]');
        if (quizName) {
            quizName.style.display = 'none';
        }

        const resultScreen = document.querySelector('[nny-quiz="result"]');
        if (resultScreen) {
            resultScreen.style.display = 'none';
        }

        const leaderboardScreen = document.querySelector('[nny-quiz="leaderboard-result"]');
        if (leaderboardScreen) {
            if (!quizName){
                alert('Please, put the name of the quiz on a page with nny-quiz="quiz-name" attribute');
            }
            leaderboardScreen.style.display = 'none';
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
            for (let i = 0; i < totalQuestions; i++) {
                const newProgressPartElement = document.createElement("div");
                newProgressPartElement.classList.add(progressPartClass);
                newProgressPartElement.setAttribute('nny-quiz', 'progress-part-element');
                newProgressPartElement.style.width = `${100/totalQuestions}%`;
                progressPartsWrapper.appendChild(newProgressPartElement);
            }
            progressPartsWrapper.firstElementChild.classList.add('active');
        }

        if (document.querySelector('[nny-quiz="submit"]')) {
            document.querySelector('[nny-quiz="submit"]').addEventListener('click', function(){
                if (document.querySelector('[nny-quiz="user-name"]').value && document.querySelector('[nny-quiz="user-email"]').value) {
                    sendPoints();
                };
            })        
        }

        //if splash screen exists
        const quizForm = document.querySelector('[nny-quiz="form"]');
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

        const showLeaderboardBtns = document.querySelectorAll('[nny-quiz="show-leaderboard"]');
        if (showLeaderboardBtns) {
            for (let i = 0; i < showLeaderboardBtns.length; i++ ){
                showLeaderboardBtns[i].addEventListener('click', showLeaderboard);
            }
        }
        
        const startOverBtns = document.querySelectorAll('[nny-quiz="start-over"]');
        if (startOverBtns) {
            for (let i = 0; i < startOverBtns.length; i++ ){
                startOverBtns[i].addEventListener('click', startOver);
            }
        }

    } else {
        alert("Please, upgrade the plan for the quiz to work on the custom domain!");
    }

}

//checking the subscription status in the db
function getMemberStatus(currentUserId) {
    const url =
        `https://api.noquestionyet.com/api:84zPS-li/member/${currentUserId}`;
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
            let currentUserPriceId = data.price_id;
            if (currentUserPriceId == "prc_deploy-plan-n4ae053s") {
                if (expirationDate) {
                    if (currentDate > expirationDate) {
                        activeStatus = false;
                    } else {
                        activeStatus = true;
                    }
                } else {
                    activeStatus = true;
                }
            } else {
                activeStatus = false;
            }

            activateScript(activeStatus);

        })
        .catch((error) => {
            console.log(error);
            showError(error.message);
        })
}

//loading page events

document.addEventListener("DOMContentLoaded", () => {
    const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
    getMemberStatus(currentUserId);
    turnOffNativeForm();
    const progressCircle = document.querySelector('[nny-quiz="progress-circle"]');
    if (progressCircle) {
        addProgressCircleScript();
    };
    localStorage.removeItem('totalPoints');
    localStorage.removeItem('currentEmail');
    localStorage.removeItem('allUserAnswers');
    localStorage.removeItem('rightAnswers');
})
