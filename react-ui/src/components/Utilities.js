module.exports = {
    titleFormatter: (str) => {
        if (str == null)
            return ''

        str = str.charAt(0).toUpperCase() + str.slice(1);
        for (var i = 1; i < str.length; i++) {
            if (str.charAt(i) == ' ') 
                str = str.slice(0, i+1) + str.charAt(i+1).toUpperCase() + str.slice(i+2)
            
            else if (str.charAt(i) == '-')
                str = str.slice(0, i) + ' ' + str.charAt(i+1).toUpperCase() + str.slice(i+2)
        }
        return str
    }
}