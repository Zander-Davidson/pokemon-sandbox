const authCtx = require("../contexts/authCtx");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    console.log(req.body)

    let signupData = {
        username: req.body.username,
        email: req.body.email,
        icon_name: req.body.icon_name,
        password: bcrypt.hashSync(req.body.password, 8)
    };

    let user = await authCtx.createUser(signupData);
        
    if (user) {
        res.status(200).json({
            message: 'User was registered successfully.'
        });
    } else {
        res.status(500).json({
            message: 'User registration failed unexpectedly.'
        });
    }
};

exports.login = async (req, res) => {
    let loginData = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    };

    await authCtx.getUser(loginData)
        .then(results => {
            if (results && Array.isArray(results)) {
                let user = results[0];

                let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        
                if (!passwordIsValid) {
                    res.status(401).json({
                        accessToken: null,
                        message: "Invalid password!"
                    });
                } else {
                    var token = jwt.sign({ user_id: user.user_id, username: user.username, icon_url: user.icon_url }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
        
                    res.status(200).json({
                        user_id: user.user_id,
                        username: user.username,
                        email: user.email,
                        icon_url: user.icon_url,
                        accessToken: token,
                        message: 'User logged in.',
                    });
                }       
            } else {
                res.status(404).json({ message: "User not found." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};