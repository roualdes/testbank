var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('database', {title: 'database',
                            session: req.session});
});

module.exports = router;
