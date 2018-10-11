
export function getRanges(selected, fields) {
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

  export function toCurrency(x) {
    var dec_split = x.toString().split("."),
        currency = "$",
        len_b4_dec = dec_split[0].length,
        remainder = len_b4_dec % 3,
        num_commas;
    if (remainder > 0) {
        num_commas = Math.floor(len_b4_dec/3);
        currency += dec_split[0].substr(0, remainder);
    } else {
        num_commas = (len_b4_dec/3) - 1;
        currency += dec_split[0].substr(0, 3);
    }
    for (var i = 0; i < num_commas; i++) {
        currency += "," + dec_split[0].substr(remainder + i * 3, 3);
    }
    if (dec_split.length > 1) {
        currency += "." + dec_split[1];
    }
    return currency;
}

export function toTitleCase(str) {
  str = "" + str;
  str = str.replace(/_/g, " ");
  if (str.substr(1).toUpperCase() !== str.substr(1) ) {
    str = str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  return str;
}