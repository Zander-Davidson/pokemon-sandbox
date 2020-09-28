const { getMatchingEmail, getMatchingUsername } = require("../contexts/authCtx");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    let emailMatch = await getMatchingEmail({ email: req.body.email });
    let usernameMatch = await getMatchingUsername({ username: req.body.username });

    if (usernameMatch) {
        res.status(400).send({
            message: "Signup failed: username is already in use."
        });
    } else if (emailMatch) {
        res.status(400).send({
            message: "Signup failed: email is already in use."
        });
    } else {
        next();
    }
};

// // if implementing roles, use this additional check
// const checkRolesExist = async (req, res, next) => {}

const verifySignup = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};

module.exports = verifySignup;