const moveCtx = require("../contexts/moveCtx");

exports.getMoveNames = async (req, res) => {
    let moveNames = await moveCtx.getMoveNames();

    if (moveNames && Array.isArray(moveNames)) {
        res.status(200).json({
            message: `Returned ${moveNames.length} move names.`,
            moveNames: moveNames
        });
    }  else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}

exports.getDamageClassNames = async (req, res) => {
    let dcNames = await moveCtx.getDamageClassNames();

    if (dcNames && Array.isArray(dcNames)) {
        res.status(200).json({
            message: `Returned ${dcNames.length} damage class names.`,
            damageClassNames: dcNames
        });
    }  else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}

exports.getMove = async (req, res) => {
    // all sort/filter params are optional. if no sort/filter specifed, return first 50 moves sorted by game_id ASC
    let params = req.body;
    let { offset, limit, total, names, moves } = await moveCtx.getMoves(params);

    if (moves && Array.isArray(moves)) {
        res.status(200).json({
            message: `Returned ${moves.length} out of ${total} moves.`,
            offset: offset,
            limit: limit,
            total: total,
            names: names,
            moves: moves
        });
    } else if (!moves) {
        res.status(400).json({
            message: 'There are no moves that match your search.'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
};

exports.getMovesByType = async (req, res) => {
    let params = { typeName: req.params.typeName ? req.params.typeName.toLowerCase() : null };
    let moves = await moveCtx.getMovesByType(params);

    if (moves && Array.isArray(moves)) {
        res.status(200).json({
            message: `Returned ${moves.length} moves.`,
            moves: moves
        });
    } else if (!moves) {
        res.status(400).json({
            message: 'That move could not be found.'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
};