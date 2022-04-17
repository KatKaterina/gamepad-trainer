import i18n from 'i18next';
import onChange from 'on-change';
import {
  connecthandler, disconnecthandler, handlerStart, handlerChangeLang,
} from './handler.js';
import resources from './locales/index.js';
import watchedState from './view.js';

const haveEvents = 'GamepadEvent' in window;
const haveWebkitEvents = 'WebKitGamepadEvent' in window;

const scanConnection = (watched) => {
  if (haveEvents) {
    window.addEventListener('gamepadconnected', () => connecthandler(watched));
    window.addEventListener('gamepaddisconnected', () => disconnecthandler(watched));
  } else if (haveWebkitEvents) {
    window.addEventListener('webkitgamepadconnected', () => connecthandler(watched));
    window.addEventListener('webkitgamepaddisconnected', () => disconnecthandler(watched));
  } else {
    setInterval(scanConnection(watched), 500);
  }
};

export default () => {
  const state = {
    lng: 'ru',
    gamepad: {},
    connection: false,
    training: '',
    buttonPressed: null,
    question: {
      value: '',
      descr: '',
    },
    answer: '',
    result: {
      countQuestion: 0,
      countAnswer: 0,
      countRightAnswer: 0,
      percentAnswer: 0,
      percentRightAnswer: 0,
    },
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    resources,
  });

  const watched = onChange(state, (path, value) => (
    watchedState(state, path, value, i18nInstance)));

  scanConnection(watched);

  const buttonStart = document.getElementById('start');
  buttonStart.addEventListener('click', () => {
    handlerStart(watched);
  });

  const itemsLang = document.querySelectorAll('[data-language]');
  itemsLang.forEach((item) => {
    item.addEventListener('click', ((e) => {
      handlerChangeLang(watched, e, i18nInstance);
    }));
  });
};
