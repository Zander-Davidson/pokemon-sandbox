
// in database, titles (e.g. pokemon names, move names) are stored in lowercase with hyphens
// instead of spaces. this method turns '-' into ' ' and capitalizes the first letter of each word.
// Example: 'tapu-koko' becomes 'Tapu Koko'
const titleFormatter = (str) => {
    if (str == null)
        return ''

    str = str.charAt(0).toUpperCase() + str.slice(1);
    for (var i = 1; i < str.length; i++) {
        if (str.charAt(i) === ' ') 
            str = str.slice(0, i+1) + str.charAt(i+1).toUpperCase() + str.slice(i+2)
        
        else if (str.charAt(i) === '-')
            str = str.slice(0, i) + ' ' + str.charAt(i+1).toUpperCase() + str.slice(i+2)
    }
    return str
}

// initialize an array of size <length> with the given <item> in each position
const initArray = (length, item) => {
    var arr1 = [item],
        arr2 = [];
    while (length > 0) {
        if (length & 1) arr2 = arr2.concat(arr1);
        arr1 = arr1.concat(arr1);
        length >>>= 1;
    }
    return arr2;
}

export {
    titleFormatter,
    initArray
}