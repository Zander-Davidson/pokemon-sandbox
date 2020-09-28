const moveCtx = require("../contexts/moveCtx");

exports.getMove = async (req, res) => {
    let params = { name: req.params.name ? req.params.name.toLowerCase() : null };
    let moves = await moveCtx.getMove(params);

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