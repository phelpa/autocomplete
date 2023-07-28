// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */


//instead of using lodash's debounce we use this function that does the same thing
//https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce

function debounce(func: (...args: any[]) => void, wait: number, immediate?: boolean): (...args: any[]) => void {
  let timeout: number | null | undefined;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export default debounce
