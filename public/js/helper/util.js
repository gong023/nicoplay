var nicoutil = {
  parseDate :function(date) {
    return date.match(/^[0-9]+-[0-9]+-[0-9]+/);
  },
  addStrings :function(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    return String(x + y);
  }
};
