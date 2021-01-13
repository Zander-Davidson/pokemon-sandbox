const natureCtx = require("../contexts/natureCtx");

exports.getNatures = async (req, res) => {
    let natures = await natureCtx.getNatures();

    if (natures && Array.isArray(natures)) {
        res.status(200).json({
            message: `Returned ${natures.length} natures.`,
            natures: natures
        });
    }  else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}