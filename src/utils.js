import { SHUFFLE_BOOST, TELEPORT_BOOST } from './constants/index';

/**
 * create interval
 * @param {function} callback Callback
 * @param {number} interval Delay
 * @returns
 */
export function callWithInterval(callback, interval) {
  return setInterval(callback, interval);
}

/**
 * find interface target
 * @param {number} x coordinates x
 * @param {number} y coordinates y
 * @returns
 */
export function getInterfaceTarget(x, y) {
  if (x <= 750 && x >= 650 && y <= 400 && y >= 300) {
    return SHUFFLE_BOOST;
  }

  if (x <= 900 && x >= 800 && y <= 400 && y >= 300) {
    return TELEPORT_BOOST;
  }

  return null;
}
