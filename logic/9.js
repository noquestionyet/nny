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
  setForms(userStatus);
  setFormShowers();
}

// hiding all questions apart from the first
function setForms (userStatus) {
  const quizForms = document.querySelectorAll('[nqy-form]');
  const formShowers = document.querySelectorAll('[nqy-formshow]');
  if (userStatus === true) {
    quizForms.forEach((quizForm) => {
      const questionSteps = quizForm.querySelectorAll('[nqy-step]');
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
  } else { showError('Please, upgrade the plan'); }
}

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

// every time the new question appears, check if there are required fields
// call validatation func on every input change
function checkRequiredFields (currentQuestion) {
  const requiredFields = currentQuestion.querySelectorAll('[required]');
  const formInputs = currentQuestion.querySelectorAll('input, select, textarea');
  // check if all required fields are filled in
  if (requiredFields.length !== 0) {
    filledState = false;
    const allFieldsFilled = Array.from(requiredFields).every(field => {
      if (field.type === 'checkbox' || field.type === 'radio') {
        return field.checked;
      } else if (field.type === 'email') {
        const emailLowerCase = field.value.toLowerCase();
        const emailMatch = emailLowerCase.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return emailMatch !== null;
      } else {
        return field.value.trim() !== '';
      }
    })
    formInputs.forEach((input) => {
      input.addEventListener('input', () => {
        checkRequiredFields(currentQuestion);
      })
    })
    // return true if all required fields are filled in, false otherwise
    if (allFieldsFilled) {
      currentQuestion.querySelector('[nqy-action="next"]').style.opacity = '1';
      filledState = true;
      return filledState;
    } else {
      currentQuestion.querySelector('[nqy-action="next"]').style.opacity = '0.6'
      filledState = false
      return filledState;
    }
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
      const quizForm = nextButton.closest('[nqy-form]');
      const nextStepNumber = nextButton.getAttribute('nqy-destination');
      const stepConditional = nextButton.getAttribute('nqy-conditional');
      const currentQuestion = nextButton.closest('.current-question');
      const stepCopyTarget = currentQuestion.querySelectorAll('[nqy-source]');
      // simple logic next step call
      if (nextStepNumber) {
        nextQuestion(nextStepNumber, quizForm);
      }
      // conditional logic next step call
      if (stepConditional) {
        findNextQuestion(nextButton);
      }
      // add custom content from inputs
      if (stepCopyTarget) {
        for (let i = 0; i < stepCopyTarget.length; i++) {
          addCustomContent(stepCopyTarget);
        }
      }
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
  console.log('we are in addcustomtarget function')
  //
  const sourceAttribute = stepCopyTarget.getAttribute('nqy-source');
  console.log(sourceAttribute)
  console.log(stepCopyTarget.value)
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
    console.log(checkbox)
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
