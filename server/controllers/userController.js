const userCtx = require("../contexts/userCtx");

exports.getTeamPreviews = async (req, res) => {
    let userTeams = await userCtx.getTeamPreviews(req.body);

    if (userTeams) {
        res.status(201).json({
            message: 'Returned ' + userTeams.length + ' user team(s)',
            teamPreviews: userTeams
        });
    } else if (!userTeams) {
        res.status(400).json({
            message: 'That user could not be found'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}

exports.createTeam = async (req, res) => {
    let params = {
        user_id: Number(req.body.user_id),
        name: req.body.name
    };
    let newTeamPreview = await userCtx.createTeam(params);

    if (newTeamPreview) {
        res.status(201).json({
            message: `${newTeamPreview.length} user team(s) created`,
            newTeamPreview: newTeamPreview[0]
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}

exports.updateTeam = async (req, res) => {
    let params = {
        user_id: Number(req.body.user_id),
        team_id: Number(req.body.team_id),
        name: req.body.name
    };
    let updatedTeam = await userCtx.updateTeam(params);

    if (updatedTeam) {
        res.status(201).json({
            message: `${updatedTeam.length} user team(s) updated`,
            updatedTeam: updatedTeam[0]
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}

exports.deleteTeam = async (req, res) => {
    let params = {
        user_id: Number(req.body.user_id),
        team_id: Number(req.body.team_id)
    };
    let deletedTeam = await userCtx.deleteTeam(params);

    if (deletedTeam) {
        res.status(201).json({
            message: `${deletedTeam.length} user team(s) deleted`,
            deletedTeamId: deletedTeam[0].team_id
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}

exports.createSet = async (req, res) => {
    // let params = {
    //     user_id: Number(req.body.user_id),
    //     team_id: Number(req.body.team_id),
    //     set_name: req.body.set_name,
    //     pokemon_slot: req.body.pokemon_slot,
    //     pokemon_name: req.body.pokemon_name,
    //     nickname: req.body.nickname,
    //     item_name: req.body.item_name,
    //     level: req.body.level,
    //     gender: req.body.gender,
    //     is_shiny: req.body.is_shiny,
    //     ability_name: req.body.ability_name,
    //     nature_name: req.body.nature_name,
    //     stats: req.body.stats,
    //     moves: req.body.moves
    // };
    let params = {
        user_id: Number(req.body.user_id),
        team_id: Number(req.body.team_id),
        pokemon_name: req.body.pokemon_name
    }

    let userSets = await userCtx.createSet(params);

    if (userSets && Array.isArray(userSets)) {
        let newSet = userSets[0];

        if (newSet.is_error) {
            res.status(500).json({
                code: newSet.code,
                message: newSet.message
            });
        } else {
            res.status(201).json({
                message: `${userSets.length} user set(s) created`,
                user_set: newSet
            });
        }
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}

exports.updateSet = async (req, res) => {

}

exports.deleteSet = async (req, res) => {

}

exports.getSetsByTeam = async (req, res) => {
    let params = {
        user_id: Number(req.params.user_id),
        team_id: Number(req.params.team_id)
    };
    let userSets = await userCtx.getSetsByTeam(params);

    if (userSets) {
        res.status(200).json({
            message: 'Returned ' + userSets.length + ' user set(s)',
            userSets: userSets
        });
    } else if (!userSets) {
        res.status(400).json({
            message: 'That team could not be found'
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
}
