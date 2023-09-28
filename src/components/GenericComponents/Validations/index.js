export const validateEmail = (email) => {
    if (email.length) {
        var x = email;
        var atposition = x.indexOf("@");
        var dotposition = x.lastIndexOf(".");

        if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= x.length) {
            return false;
        } else {
            return true
        }
    }
};