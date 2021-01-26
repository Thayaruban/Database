const ifHr = (req, res, next) => {
    if (req.session.user && req.session.user.type) {
        if (req.session.user.type === 'Hr') { // if admin
            res.redirect(`/${req.session.user.type}`);
        }else{
            res.redirect(`/${req.session.user.type}`);
        }
    } else {
        res.redirect('/');
    }
};

module.exports = ifHr;
