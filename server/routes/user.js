const express = require('express');
const userCtx = require("../contexts/UserCtx");
const router = express.Router();

router.get('/get-user/:name?', async (req, res, next) => {
    let name = req.params.name ? req.params.name : null;
    let user = await userCtx.getUser(name);

    if (user) {
        res.status(200).json({
            message: 'Returned ' + num + ' user(s)',
            user: user
        });
    } else if (user === null) {
        res.status(400).json({
            message: 'That user could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/create-user', async (req, res, next) => {
    let newUser = await userCtx.createUser(req.body.userData);

    if (newUser) {
        res.status(201).json({
            message: 'User created',
            user: newUser 
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/create-user-team', async (req, res, next) => {
    console.log(req.body.userTeamData)
    let newUserTeam = await userCtx.createUserTeam(req.body.userTeamData);

    if (newUserTeam) {
        res.status(201).json({
            message: 'User team created',
            userTeam: newUserTeam 
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/create-user-set', async (req, res, next) => {
    let newUserSet = await userCtx.createUserSet(req.body.userSetData);

    if (newUserSet) {
        res.status(201).json({
            message: 'User set created',
            userSet: newUserSet 
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});


module.exports = router;