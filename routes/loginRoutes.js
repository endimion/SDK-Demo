
const express = require('express');
const router = express.Router()
const randomstring = require("randomstring");



// define the home page route
router.get('/', function (req, res) {
  // res.send('Hello World from login');
  res.render('login',{ title: 'Login', message: 'Login to the DiplomaSupplement WebApp' });
})

router.post('/',(req,res) =>{
    // console.log("req body " );
    // console.log(req.body);

    let userName = req.body.name;
    let password = req.body.password;
    if(userName.toLowerCase() === 'ntua' && password === 'panathinaikos'){
        req.session.userType = 'university';
        req.session.eID = 'ntua';
      
        // res.send("University logged in");
        res.render('univMainView',{ title: 'Publish a new Diploma Supplement',
                                    message: 'Welcome user: ' + req.session.eID ,
                                    supId: randomstring.generate(10),
                                    university: req.session.eID});
    }
    if(userName.toLowerCase() ==='student'){

      req.session.userType = 'student';
      req.session.eID = 'testWebStd1';
      res.send("Student logged in");
    }

    res.send("wrong username password combination")
})


module.exports = router
