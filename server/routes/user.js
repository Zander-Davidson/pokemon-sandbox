const express = require('express');
const router = express.Router();
const { authJwt } = require("../middleware");
const userController = require("../controllers/userController");

router.post(
    '/teampreviews',
    [authJwt.verifyToken],
    userController.getTeamPreviews
);

router.get(
    '/setsbyteam/:user_id/:team_id', 
    [authJwt.verifyToken],
    userController.getSetsByTeam
);

router.post(
    '/createteam', 
    [authJwt.verifyToken], 
    userController.createTeam    
);

router.post(
    '/updateteam', 
    [authJwt.verifyToken], 
    userController.updateTeam    
);

router.post(
    '/deleteteam', 
    [authJwt.verifyToken], 
    userController.deleteTeam    
);

router.post(
    '/createset', 
    [authJwt.verifyToken],
    userController.createSet    
);

module.exports = router;