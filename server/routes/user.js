const express = require('express');
const userCtx = require("../contexts/UserCtx");
const router = express.Router();

router.get('/get-user/:username', async (req, res, next) => {   
    let user = await userCtx.getUser(req.params.username);

    if (user) {
        res.status(200).json({
            message: 'Returned user',
            user: user
        });
    } else if (user === null) {
        res.status(400).json({
            message: 'That user could not be found'
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.get('/get-user-teams/:username', async (req, res, next) => {
    let userTeams = await userCtx.getUserTeams(req.params.username);
    
    if (userTeams) {
        res.status(200).json({
            message: 'Returned ' + userTeams.length + ' user team(s)',
            user_teams: userTeams
        }); 
    } else if (userTeams === null) {
        res.status(400).json({
            message: 'That user could not be found'
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
})

router.get('/get-user-sets-by-team/:teamguid', async (req, res, next) => {
    let userTeamData = {teamguid: Number(req.params.teamguid)};
    let userSets = await userCtx.getUserSetsByTeam(userTeamData);
    
    if (userSets) {
        res.status(200).json({
            message: 'Returned ' + userSets.length + ' user set(s)',
            user_sets: userSets
        }); 
    } else if (userSets === null) {
        res.status(400).json({
            message: 'That team could not be found'
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
})


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
            user_team: newUserTeam 
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
            user_set: newUserSet 
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});


module.exports = router;