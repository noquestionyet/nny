/* eslint-disable semi */
/* attributes are used
-- required
1. nqy-step="step-n" - number of step
2. nqy-action="next" - next button (even if conditional step, every next button should has this!!!)
3. nqy-action="previous" - previous button

4. nqy-destination="step-n" - show what is the next step
nqy-destination="final" -show results
5. nqy-conditional="step-conditional" - if the next step depends on a chosen option
6. nqy-destination="step-n" - set to the radio buttons in conditional logic (real radio buttons)

nqy-form-active radio button active class
nqy-input-error - error class

7. nqy-form="form" - main form
8. nqy-points="40" -amount of points for each answer (add to radio button)

9. nqy-source="text" - reuse the input content, add text-1, text-2 etc
10. nqy-target="target"
12. nqy-action="start-over" - reload page

--final steps
12. nqy-step="final" - every screen with the result
13. nqy-range-from="40" - start of the range to show this result
14. nqy-range-to="100" - end of the range to show this result

---show specific forms
nqy-formshow = "form-name" - add to the link and form
*/

// main variables
let filledState = true;
const apirUrl = 'https://api.noquestionyet.com/api:84zPS-li';
const paidPlanId = 'prc_deploy-plan-n4ae053s';
let userStatus = false;

// checking the subscription status in the db
function getMemberStatus (currentUserId) {
  let activeStatus = true;
  const currentMember = fetch(`${apirUrl}/member/${currentUserId}`);
  currentMember.then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then((text) => {
        throw new Error(text);
      })
    }
  }).then(data => {
    // check if subscription is not expired
    const expirationDate = data.memberstack_expiration_date;
    const currentDate = Math.floor(Date.now() / 1000);
    const currentUserPriceId = data.price_id;
    console.log(currentUserPriceId)
    if (currentUserPriceId === paidPlanId) {
      console.log(expirationDate)
      expirationDate && currentDate > expirationDate ? activeStatus = false : activeStatus = true;
    } else {
      activeStatus = false;
    }
    activateScript(activeStatus);
  }).catch(error => {
    showError(error.message);
  })
}

// checking the status of the subscription and setting the main variables based on that
function activateScript (activeStatus) {
  const currentURL = window.location.hostname;
  currentURL.includes('webflow.io') ? userStatus = true : userStatus = activeStatus;
  setFormShowers();
}

// hiding all questions apart from the first

const quizForms = document.querySelectorAll('[nqy-form]');
const formShowers = document.querySelectorAll('[nqy-formshow]');
quizForms.forEach((quizForm) => {
  turnOffNativeForm(quizForm);
  const questionSteps = quizForm.querySelectorAll('[nqy-step]');
  console.log(questionSteps)
  for (let i = 0; i < questionSteps.length; i++) {
    questionSteps[i].style.display = 'none';
    if (i === 0) {
      questionSteps[i].style.display = 'block';
      questionSteps[i].classList.add('current-question');
      if (formShowers.length !== 0) {
        quizForm.style.display = 'none';
      } else { checkRequiredFields(questionSteps[i]) }
    }
  }
})

// if there are links to show the forms, activate them
function setFormShowers () {
  const formShowers = document.querySelectorAll('[nqy-formshow]');
  if (formShowers) {
    formShowers.forEach((formShower) => {
      if (formShower.tagName !== 'A') return;
      const quizFormName = formShower.getAttribute('nqy-formshow');
      formShower.addEventListener('click', function () {
        showForm(quizFormName);
      });
    })
  }
}

// show form on form shower link click
function showForm (formName) {
  const quizForms = document.querySelectorAll('[nqy-form]');
  quizForms.forEach((quizForm) => {
    const quizFormName = quizForm.getAttribute('nqy-formshow');
    if (quizFormName === formName) {
      quizForm.style.display = 'block';
      const currentQuestion = quizForm.querySelector('.current-question');
      checkRequiredFields(currentQuestion);
    }
  })
}

// turn off native webflow forms
function turnOffNativeForm (quizForm) {
  const defaultState = quizForm.getAttribute('nqy-behavior');
  if (!defaultState || defaultState !== 'default') {
    quizForm.addEventListener('submit', handlerCallback, true);
    function handlerCallback (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}

// every time the new question appears, check if there are required fields
// call validatation func on every input change
function checkRequiredFields (currentQuestion) {
  const requiredFields = currentQuestion.querySelectorAll('[required]');
  if (requiredFields.length !== 0) {
    setNextButtonState(false, currentQuestion);
    return Array.from(requiredFields).every(field => {
      if (field.type === 'checkbox' || field.type === 'radio') {
        return field.checked;
      } else if (field.type === 'email') {
        const emailLowerCase = field.value.toLowerCase();
        const emailMatch = emailLowerCase.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return emailMatch !== null;
      } else {
        return field.value.trim() !== '';
      }
    });
  }
}

// Check if required inputs are filled on every input change
const currentQuestions = document.querySelectorAll('.current-question');
currentQuestions.forEach(currentQuestion => {
  currentQuestion.addEventListener('input', () => {
    const allFieldsFilled = checkRequiredFields(currentQuestion);
    setNextButtonState(allFieldsFilled, currentQuestion);
  })
})

// Enable/disable the next button based on the allFieldsFilled parameter
function setNextButtonState (allFieldsFilled, currentQuestion) {
  const nextButton = currentQuestion.querySelector('[nqy-action="next"]');
  if (allFieldsFilled) {
    nextButton.style.opacity = '1';
    filledState = true; // this goes to the show next question function
  } else {
    nextButton.style.opacity = '0.6';
    filledState = false;
  }
}

// show validation error
function validationError (currentQuestion) {
  const requiredFields = currentQuestion.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (field.type === 'checkbox' || field.type === 'radio') {
      !field.checked ? field.classList.add('nqy-input-error') : field.classList.remove('nqy-input-error');
    } else if (field.type === 'email') {
      const emailLowerCase = field.value.toLowerCase();
      const emailMatch = emailLowerCase.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      emailMatch == null ? field.classList.add('nqy-input-error') : field.classList.remove('nqy-input-error');
    } else {
      field.value.trim() === '' ? field.classList.add('nqy-input-error') : field.classList.remove('nqy-input-error');
    }
  })
}

// call next question function on each "next question" button click
const nextButtons = document.querySelectorAll('[nqy-action="next"]');
if (nextButtons.length !== 0) {
  nextButtons.forEach((nextButton) => {
    // if we have "next buttons"
    nextButton.addEventListener('click', () => {
      if (userStatus) {
        const quizForm = nextButton.closest('[nqy-form]');
        const nextStepNumber = nextButton.getAttribute('nqy-destination');
        const stepConditional = nextButton.getAttribute('nqy-conditional');
        const currentQuestion = nextButton.closest('.current-question');
        const stepCopyTarget = currentQuestion.querySelectorAll('[nqy-source]');
        // simple logic next step call
        if (nextStepNumber) {
          nextQuestion(nextStepNumber, quizForm);
        }
        if (!nextStepNumber) {
          const currentStep = currentQuestion.getAttribute('nqy-step');
          const currentStepNumber = parseInt(currentStep.match(/\d+/)[0]);
          const nextStepNumber = currentStepNumber + 1;
          let nextStep = 'step-' + nextStepNumber;
          const nextQuestionStep = quizForm.querySelector(`[nqy-step='step-${nextStepNumber}']`);
          !nextQuestionStep ? nextStep = 'final' : null;
          nextQuestion(nextStep, quizForm);
        }
        // conditional logic next step call
        if (stepConditional) {
          findNextQuestion(nextButton);
        }
        // add custom content from inputs
        if (stepCopyTarget) {
          for (let i = 0; i < stepCopyTarget.length; i++) {
            addCustomContent(stepCopyTarget[i]);
          }
        }
      } else { showError('Please, upgrade the plan') }
    })
  })
}

// call previous question function on each "previous question" button click
const previousButtons = document.querySelectorAll('[nqy-action="previous"]')
if (previousButtons.length !== 0) {
  previousButtons.forEach((el) => {
    const quizForm = el.closest('[nqy-form]');
    el.addEventListener('click', function () {
      previousQuestion(quizForm);
    })
  })
}

// show next question
function nextQuestion (stepNumber, quizForm) {
  console.log(stepNumber)
  console.log(filledState)
  const currentQuestion = quizForm.querySelector('.current-question');
  if (filledState) {
    savePoints(currentQuestion);
    const existingStepFlow = sessionStorage.getItem('stepFlow');
    existingStepFlow ? sessionStorage.setItem('stepFlow', `${existingStepFlow},${stepNumber}`) : sessionStorage.setItem('stepFlow', `step-1,${stepNumber}`);
    currentQuestion.classList.remove('current-question');
    currentQuestion.style.display = 'none';
    if (stepNumber === 'final') {
      showResult();
    } else {
      const nextQuestion = quizForm.querySelector(`[nqy-step='${stepNumber}']`);
      console.log(nextQuestion)
      nextQuestion.classList.add('current-question');
      nextQuestion.style.display = 'block';
      checkRequiredFields(nextQuestion);
    }
  } else { validationError(currentQuestion) }
}

// show conditional next question
function findNextQuestion (currentQuestionNextButton) {
  const currentQuestion = currentQuestionNextButton.closest('[nqy-step]');
  const radioButtons = currentQuestion.querySelectorAll('input[type="radio"]');
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      const stepNumber = radioButtons[i].getAttribute('nqy-destination');
      const quizForm = radioButtons[i].closest('[nqy-form]');
      nextQuestion(stepNumber, quizForm);
    }
  }
}

// show previous question
function previousQuestion (quizForm) {
  const existingStepFlow = sessionStorage.getItem('stepFlow');
  const existingStepFlowArray = existingStepFlow.split(',');
  const previousQuestionNumber = existingStepFlowArray.at(-2);
  const previousQuestion = quizForm.querySelector(`[nqy-step='${previousQuestionNumber}']`);
  const currentQuestion = quizForm.querySelector('.current-question');
  previousQuestion.classList.add('current-question');
  previousQuestion.style.display = 'block';
  currentQuestion.classList.remove('current-question');
  currentQuestion.style.display = 'none';
  const newStepFlowArray = existingStepFlowArray.splice(-1)
  const newStepFlow = newStepFlowArray.toString();
  sessionStorage.setItem('stepFlow', `${newStepFlow}`);
  deletePoints();
}

// if we have points, add points results to the sessionStorage
function savePoints (currentQuestion) {
  let currentQuestionPointNumber = 0;
  const currentQuestionPoints = currentQuestion.querySelectorAll('[nqy-points]');
  if (currentQuestionPoints) {
    currentQuestionPoints.forEach((currentQuestionPoint) => {
      if (currentQuestionPoint.type === 'radio' && currentQuestionPoint.checked) {
        const currentQuestionPointAttribute = Number(currentQuestionPoint.getAttribute('nqy-points'));
        currentQuestionPointNumber = currentQuestionPointAttribute;
      }
    })
    const existingPoints = sessionStorage.getItem('points');
    if (existingPoints) {
      return sessionStorage.setItem('points', `${existingPoints},${currentQuestionPointNumber}`);
    }
    return sessionStorage.setItem('points', `${currentQuestionPointNumber}`);
  }
}

// if we have points results, delete them from sessionStorage
function deletePoints () {
  const existingPoints = sessionStorage.getItem('points');
  if (existingPoints) {
    const existingPointsArray = existingPoints.split(',');
    const newPointsArray = existingPointsArray.splice(-1)
    const newPoints = newPointsArray.toString();
    sessionStorage.setItem('points', `${newPoints}`);
  }
}

// if we have points show the custom result message
function showResult () {
  const resultScreens = document.querySelectorAll('[nqy-step="final"]');
  if (resultScreens.length === 1) {
    document.querySelectorAll('[nqy-step="final"]').item(0).style.display = 'block';
  } else {
    const pointFinalSum = pointSum();
    for (let i = 0; i < resultScreens.length; i++) {
      const minRange = Number(resultScreens[i].getAttribute('nqy-range-from'));
      const maxRange = Number(resultScreens[i].getAttribute('nqy-range-to'));
      minRange <= pointFinalSum && pointFinalSum <= maxRange ? resultScreens[i].style.display = 'block' : null;
    }
  }
}

// get the sum of the points
function pointSum () {
  const pointString = sessionStorage.getItem('points');
  const pointArray = pointString.split(',');
  let pointSum = 0;
  for (let i = 0; i < pointArray.length; i++) {
    !isNaN(pointArray[i]) ? pointSum += Number(pointArray[i]) : null;
  }
  return pointSum;
}

// if we have personalised content, like name, to reuse in the form text
function addCustomContent (stepCopyTarget) {
  const sourceAttribute = stepCopyTarget.getAttribute('nqy-source');
  const textTargets = document.querySelectorAll('[nqy-target]');
  textTargets.forEach(textTarget => {
    const targetAttribute = textTarget.getAttribute('nqy-target');
    if (sourceAttribute === targetAttribute) {
      textTarget.innerHTML = stepCopyTarget.value;
    }
  })
}

// reload page function
function startOver () {
  window.location.reload();
  sessionStorage.clear();
}

// every "start over" button activates the reload page function
const startOverBtns = document.querySelectorAll('[nqy-action="start-over"]')
if (startOverBtns) {
  startOverBtns.forEach((startOverBtn) => {
    startOverBtn.addEventListener('click', startOver);
  })
}

// custom active class for radio buttons and checkboxed
const radioButtonsAll = document.querySelectorAll('input[type="radio"]');
radioButtonsAll.forEach((radioButton) => {
  radioButton.addEventListener('click', () => {
    for (let i = 0; i < radioButtonsAll.length; i++) {
      radioButtonsAll[i].parentElement.classList.remove('nqy-form-active');
    }
    radioButton.parentElement.classList.add('nqy-form-active');
  })
})
const checkboxAll = document.querySelectorAll('input[type="checkbox"]');
checkboxAll.forEach((checkbox) => {
  checkbox.addEventListener('click', () => {
    for (let i = 0; i < checkboxAll.length; i++) {
      const checkboxWrapper = checkboxAll[i].parentElement;
      !checkboxAll[i].checked ? checkboxWrapper.classList.remove('nqy-form-active') : checkboxWrapper.classList.add('nqy-form-active');
    }
  })
})

// custom error toast message display
function showError (value) {
  const toastError = document.querySelector('.toast-message');
  if (!toastError) {
    const toastMessage = document.createElement('div');
    toastMessage.style.position = 'fixed';
    toastMessage.style.bottom = '2%';
    toastMessage.style.left = '50%';
    toastMessage.style.marginLeft = '-25%';
    toastMessage.style.width = '50%';
    toastMessage.style.backgroundColor = '#CC0000';
    toastMessage.style.color = '#ffffff';
    toastMessage.style.padding = '1.5rem';
    toastMessage.style.textAlign = 'center';
    toastMessage.innerHTML = value;
    document.body.appendChild(toastMessage);
    setTimeout(function () {
      toastMessage.style.display = 'none';
    }, 2000);
  } else {
    toastError.innerHTML = value;
    toastError.style.display = 'block';
    setTimeout(function () {
      toastError.style.display = 'none';
    }, 2000)
  }
}

// clear session storage on load
window.onload = () => {
  const currentUserId = document.querySelector('script[data-quiz-id]').getAttribute('data-quiz-id');
  getMemberStatus(currentUserId);
  sessionStorage.clear();
}
