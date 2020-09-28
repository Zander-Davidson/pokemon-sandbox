const abilityCtx = require("../contexts/abilityCtx");

exports.getAbility = async (req, res) => {
    let params = { name: req.params.name ? req.params.name.toLowerCase() : null};
    let abilities = await abilityCtx.getAbility(params);

    if (abilities && Array.isArray(abilities)) {
        res.status(200).json({
            message: `Returned ${abilities.length} abilities.`,
            abilities: abilities
        });
    } else if (!abilities) {
        res.status(400).json({
            message: 'That ability could not be found.'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}