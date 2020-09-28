const express = require('express');
const router = express.Router();
const { authJwt } = require("../middleware");
const userController = require("../controllers/userController");

router.get(
    '/get-team-previews',
    [authJwt.verifyToken],
    userController.getTeamPreviews
);

router.get(
    '/get-sets-by-team', 
    [authJwt.verifyToken],
    userController.getSetsByTeam
);

router.post(
    '/create-team', 
    [authJwt.verifyToken], 
    userController.createTeam    
);

router.post(
    '/create-set', 
    [authJwt.verifyToken],
    userController.createSet    
);

module.exports = router;