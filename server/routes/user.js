const express = require('express');
const router = express.Router();
const { authJwt } = require("../middleware");
const userController = require("../controllers/userController");

router.get(
    '/teampreviews/:user_id',
    [authJwt.verifyToken],
    userController.getTeamPreviews
);

router.get(
    '/setsbyteamid/:user_id/:team_id', 
    [authJwt.verifyToken],
    userController.getSetsByTeamId
);

router.post(
    '/createteam', 
    [authJwt.verifyToken], 
    userController.createTeam    
);

router.post(
    '/createset', 
    [authJwt.verifyToken],
    userController.createSet    
);

module.exports = router;