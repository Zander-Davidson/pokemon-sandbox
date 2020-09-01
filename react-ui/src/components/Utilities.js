module.exports = {
    // in database, titles (e.g. pokemon names, move names) are stored in lowercase with hyphens
    // instead of spaces. this method turns '-' into ' ' and capitalizes the first letter of each word.
    // Example: 'tapu-koko' becomes 'Tapu Koko'
    titleFormatter: (str) => {
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
}