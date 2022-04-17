/* eslint-disable no-param-reassign */
import buttonsGamepad from './gamepads/index.js';

const requestAnimationFrame = window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame || window.requestAnimationFrame;

const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

const { buttonsPS, buttonsXbox } = buttonsGamepad;

const getGamepad = () => {
  const webkitGamepads = navigator.webkitGetGamepads ? navigator.webkitGetGamepads()[0] : [];
  return navigator.getGamepads ? navigator.getGamepads()[0] : webkitGamepads;
};

const getSettings = () => {
  const selectScheme = document.getElementById('select-scheme');
  const selectSpeed = document.getElementById('select-speed');
  const selectVibration = document.getElementById('select-vibration');
  const scheme = selectScheme.value === 'Xbox' ? buttonsXbox : buttonsPS;
  const speed = selectSpeed.value;
  const vibration = selectVibration.value === 'on';
  return { scheme, speed, vibration };
};

export const connecthandler = (watched) => {
  watched.gamepad = getGamepad();
  watched.connection = true;
  watched.training = 'in waiting';
};

export const disconnecthandler = (watched) => {
  watched.gamepad = {};
  watched.training = '';
  watched.connection = false;
};

const getRandomIndex = (buttons) => {
  const indexes = Object.keys(buttons);
  const randomIndex = Math.floor(Math.random() * indexes.length);
  return indexes[randomIndex];
};

const calculatePercentAnswers = (countQuestion, countAnswer, countRightAnswer) => {
  const percentAnswer = countQuestion === 0 ? 0
    : ((countAnswer * 100) / countQuestion).toFixed(1);
  const percentRightAnswer = countQuestion === 0 ? 0
    : ((countRightAnswer * 100) / countQuestion).toFixed(1);
  return { percentAnswer, percentRightAnswer };
};

const ids = { timerId: '', requestId: '' };

export const handlerStart = (watched) => {
  const { scheme, speed, vibration } = getSettings();
  const gamepad = getGamepad();

  const interval = speed * 1000;
  const startInterval = 5;

  const handlerResult = (button) => {
    const { answer, buttonPressed } = watched;
    watched.buttonPressed = button;

    if (watched.buttonPressed !== null && buttonPressed === null) {
      watched.result.countAnswer += 1;
      watched.answer = watched.buttonPressed === Number(watched.question.value);
      if (answer !== watched.answer) {
        if (watched.answer) {
          watched.result.countRightAnswer += 1;
        } else if (!watched.answer && vibration) {
          gamepad.vibrationActuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: 100,
            weakMagnitude: 0.5,
            strongMagnitude: 0.5,
          });
        }
      }
      const { countAnswer, countQuestion, countRightAnswer } = watched.result;
      const {
        percentAnswer,
        percentRightAnswer,
      } = calculatePercentAnswers(countQuestion, countAnswer, countRightAnswer);
      watched.result.percentAnswer = percentAnswer;
      watched.result.percentRightAnswer = percentRightAnswer;
    }
  };

  const handlerPress = () => {
    const { buttons, axes } = getGamepad();
    let { buttonPressed } = watched;
    buttons.forEach((bt, i) => {
      const pressed = typeof bt === 'object' ? (bt.value > 0 || bt.pressed) : (bt === 1);
      if (pressed && buttonPressed === null) {
        buttonPressed = i;
      }
    });

    axes.forEach((ax, i) => {
      const value = Math.round(ax);
      if (buttonPressed === null) {
        if (i === 0 && value <= -0.5) {
          buttonPressed = 14;
        } else if (i === 0 && value >= 0.5) {
          buttonPressed = 15;
        } else if (i === 1 && value <= -0.5) {
          buttonPressed = 12;
        } else if (i === 1 && value >= 0.5) {
          buttonPressed = 13;
        }
      }
    });

    handlerResult(buttonPressed);

    const requestId = requestAnimationFrame(handlerPress);
    if (watched.training !== 'in progress') {
      cancelAnimationFrame(requestId);
    }
    return requestId;
  };

  const updateQuestion = () => {
    if (watched.training === 'in waiting') {
      clearTimeout(ids.timerId);
      return;
    }
    const buttons = scheme;
    watched.result.countQuestion += 1;

    const { countAnswer, countQuestion, countRightAnswer } = watched.result;
    const {
      percentAnswer,
      percentRightAnswer,
    } = calculatePercentAnswers(countQuestion, countAnswer, countRightAnswer);
    watched.result.percentAnswer = percentAnswer;
    watched.result.percentRightAnswer = percentRightAnswer;

    watched.question.value = getRandomIndex(buttons);
    watched.question.descr = buttons[watched.question.value];

    watched.buttonPressed = null;
    watched.answer = '';

    ids.requestId = handlerPress();

    const timerId2 = setTimeout(updateQuestion, interval);
    ids.timerId = timerId2;
  };

  if (watched.training === 'in waiting') {
    watched.buttonPressed = null;
    watched.answer = '';
    watched.result = {
      countRightAnswer: 0,
      countAnswer: 0,
      percentAnswer: 0,
      percentRightAnswer: 0,
      countQuestion: 0,
    };
    const timerId1 = setTimeout(updateQuestion, startInterval);
    ids.timerId = timerId1;
    watched.training = 'in progress';
  } else if (watched.training === 'in progress') {
    clearTimeout(ids.timerId);
    watched.question = { value: '', descr: '' };
    watched.answer = '';
    watched.training = 'in waiting';
  }
};

export const handlerChangeLang = (watched, el, i18nInstance) => {
  i18nInstance.changeLanguage(el.target.dataset.language);
  watched.lng = el.target.dataset.language;
};
