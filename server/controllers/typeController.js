const typeCtx = require("../contexts/typeCtx");

exports.getType = async (req, res) => {
    let params = { 
        name: req.params.name ? req.params.name.toLowerCase() : null,
        altName: '.*' 
    };
    let types = await typeCtx.getType(params);

    if (types && Array.isArray(types)) {
        res.status(200).json({
            message: `Returned ${types.length} types.`,
            types: types
        });
    } else if (!types) {
        res.status(400).json({
            message: 'That type could not be found.'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
};

exports.getTypeMatchup = async (req, res) => {
    let params = {
        attacking: req.params.attacking.toLowerCase(),
        defending: req.params.defending.toLowerCase()
    }
    let matchups = await typeCtx.getTypeMatchup(params);

    if (matchups && Array.isArray(matchups)) {
        res.status(200).json({
            message: `Returned ${matchups.length} matchup(s).`,
            matchups: matchups
        });
    } else if (!matchups) {
        res.status(400).json({
            message: 'That type could not be found.'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
};

exports.getMatchupsByDefending = async (req, res) => {
    let params = {
        defending: req.params.defending.toLowerCase(),
        multiplier: req.params.multiplier ? parseFloat(req.params.multiplier) : null
    }
    let matchups = await typeCtx.getMatchupsByDefending(params);

    if (matchups && Array.isArray(matchups)) {
        res.status(200).json({
            message: `Returned ${matchups.length} matchup(s).`,
            matchups: matchups
        });
    } else if (!matchups) {
        res.status(400).json({
            message: 'That type or multiplier could not be found.'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
};

exports.getMatchupsByAttacking = async (req, res) => {
    let params = {
        attacking: req.params.attacking.toLowerCase(),
        multiplier: req.params.multiplier ? parseFloat(req.params.multiplier) : null
    }   
    let matchups = await typeCtx.getMatchupsByAttacking(params);

    if (matchups && Array.isArray(matchups)) {
        res.status(200).json({
            message: `Returned ${matchups.length} matchup(s).`,
            matchups: matchups
        });
    } else if (!matchups) {
        res.status(400).json({
            message: 'That type or multiplier could not be found.'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
};
