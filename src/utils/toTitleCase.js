function toTitleCase(str) {
    str = "" + str;
    str = str.replace(/_/g, " ");
    if (str.substr(1).toUpperCase() !== str.substr(1) ) {
      str = str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    return str;
}

export default toTitleCase