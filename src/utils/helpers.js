
function getRanges(selected, fields) {
    let lbound = null;
    let ubound = null;
    let ranges = [];
    fields = fields.sort(function(a, b) {
      return a - b;
    });
    for (let i = 0; i < fields.length; i++) {
      let value = fields[i];
      let inSelected = selected.indexOf(value) !== -1;
      if (inSelected) {
        lbound = lbound || value;
        if (lbound !== value) {
          ubound = value;
        }
      }
      if (!inSelected || i + 1 === fields.length) {
        if (lbound && ubound) {
          ranges.push(`${lbound}-${ubound}`);
        } else if (lbound !== null) {
          ranges.push(lbound);
        }
        lbound = null;
        ubound = null;
      }
    }
    return ranges;
  };

  export default getRanges