export function compare(a, b) {
    if (a[0] < b[0])
      return 1;
    if (a[0] > b[0])
      return -1;
    return 0;
};

export function isEnterPressed(e) {
    const code = (e.keyCode ? e.keyCode : e.which);
    return code === 13;
};