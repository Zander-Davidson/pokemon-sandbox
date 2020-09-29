const iconCtx = require("../contexts/iconCtx");

exports.getIcon = async (req, res) => {
    let params = { name: req.params.name ? req.params.name : null };
    let icons = await iconCtx.getIcon(params);

    if (icons && Array.isArray(icons)) {
        res.status(200).json({ 
            message: `Returned ${icons.length} icon(s).`,
            icons: icons
        });
    } else if (!icons) {
        res.status(400).json({
            message: 'That icon could not be found.'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
};