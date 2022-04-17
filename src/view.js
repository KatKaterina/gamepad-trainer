const gamepadButtonInfo = document.getElementById('gamepad-button-info');
const buttonStart = document.getElementById('start');
const gamepadInfo = document.getElementById('gamepad-info');

const renderAnswer = (value) => {
  switch (value) {
    case true:
      gamepadButtonInfo.classList.remove('btn-outline-secondary');
      gamepadButtonInfo.classList.add('btn-success');
      break;
    case false:
      gamepadButtonInfo.classList.remove('btn-outline-secondary');
      gamepadButtonInfo.classList.add('btn-danger');
      break;
    default:
      gamepadButtonInfo.classList.remove('btn-danger', 'btn-success');
      gamepadButtonInfo.classList.add('btn-outline-secondary');
      break;
  }
};

const renderResult = (state, i18nInstance) => {
  const { countQuestion, percentAnswer, percentRightAnswer } = state.result;
  const result = document.getElementById('result');
  result.textContent = `${i18nInstance.t('elements.textCountQuestion')}${countQuestion} | ${i18nInstance.t('elements.textPercentAnswer')}${percentAnswer}% | ${i18nInstance.t('elements.textPercentRightAnswer')}${percentRightAnswer}%`;
};

const renderQuestion = (state) => {
  const { descr } = state.question;
  gamepadButtonInfo.textContent = '';
  gamepadButtonInfo.insertAdjacentHTML('beforeend', descr);
};

const renderTest = (value, i18nInstance) => {
  const questionElement = document.getElementById('question');
  const selectElement = document.getElementById('select-speed');
  const selectScheme = document.getElementById('select-scheme');
  const selectVibration = document.getElementById('select-vibration');
  switch (value) {
    case 'in progress':
      buttonStart.removeAttribute('disabled');
      buttonStart.textContent = i18nInstance.t('elements.buttonStop');
      selectElement.setAttribute('disabled', 'true');
      selectScheme.setAttribute('disabled', 'true');
      selectVibration.setAttribute('disabled', 'true');
      questionElement.textContent = i18nInstance.t('elements.textPress');
      break;
    case 'in waiting':
      buttonStart.removeAttribute('disabled');
      buttonStart.textContent = i18nInstance.t('elements.buttonStart');
      selectElement.removeAttribute('disabled');
      selectScheme.removeAttribute('disabled');
      selectVibration.removeAttribute('disabled');
      gamepadButtonInfo.textContent = '?';
      questionElement.textContent = '';
      break;
    default:
      break;
  }
};

const render = (state, value, i18nInstance) => {
  const gp = state.gamepad;
  switch (value) {
    case true:
      gamepadInfo.textContent = `${i18nInstance.t('elements.descrOn')}${gp.id}`;
      buttonStart.removeAttribute('disabled');
      break;
    case false:
      gamepadInfo.textContent = i18nInstance.t('elements.descrOff');
      buttonStart.setAttribute('disabled', 'true');
      break;
    default:
      break;
  }
};

const renderLang = (value, i18nInstance, state) => {
  const itemsLang = document.querySelectorAll('[data-language]');
  itemsLang.forEach((item) => {
    if (item.dataset.language === value) {
      item.classList.add('fw-bold');
    } else {
      item.classList.remove('fw-bold');
    }
  });

  const selectSpeed1 = document.getElementById('speed-1');
  const selectSpeed2 = document.getElementById('speed-2');
  const selectSpeed3 = document.getElementById('speed-3');
  const schemeX = document.getElementById('scheme-xbox');
  const schemePs = document.getElementById('scheme-ps');
  const vibrationOff = document.getElementById('vibration-off');
  const vibrationOn = document.getElementById('vibration-on');

  selectSpeed1.textContent = i18nInstance.t('elements.speed1');
  selectSpeed2.textContent = i18nInstance.t('elements.speed2');
  selectSpeed3.textContent = i18nInstance.t('elements.speed3');

  schemeX.textContent = i18nInstance.t('elements.schemeX');
  schemePs.textContent = i18nInstance.t('elements.schemePs');

  vibrationOff.textContent = i18nInstance.t('elements.vibrationOff');
  vibrationOn.textContent = i18nInstance.t('elements.vibrationOn');

  buttonStart.textContent = i18nInstance.t('elements.buttonStart');

  const { connection, training } = state;

  render(state, connection, i18nInstance);
  renderTest(training, i18nInstance);
  renderResult(state, i18nInstance);
};

export default (state, path, value, i18nInstance) => {
  switch (path) {
    case 'connection':
      render(state, value, i18nInstance);
      break;
    case 'training':
      renderTest(value, i18nInstance);
      break;
    case 'question.descr':
      renderQuestion(state);
      break;
    case 'answer':
      renderAnswer(value);
      break;
    case 'result.countQuestion':
      renderResult(state, i18nInstance);
      break;
    case 'result.percentAnswer':
      renderResult(state, i18nInstance);
      break;
    case 'result.percentRightAnswer':
      renderResult(state, i18nInstance);
      break;
    case 'lng':
      renderLang(value, i18nInstance, state);
      break;
    default:
      break;
  }
};
