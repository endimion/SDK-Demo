
const express = require('express');
const router = express.Router()
const randomstring = require("randomstring");
const basic = require('../basicFunctions');
const chainCodeQuery = require('../ChaincodeQuery.js');


router.post('/publish',(req,res) =>{
  basic.init();

  let owner = req.body.owner;
  let university = req.body.university;
  let _id = req.body.id;

  let _args = ['{"Owner":'+ owner +', "University":'+university+',"Authorized":[],"Id":"'+_id+'"}' ];
  let _enrollAttr = [{name:'typeOfUser',value:'University'},{name:"eID",value:university}];
  let _invAttr = ['typeOfUser','eID'];
  let invReq = {
    // Name (hash) required for invoke
    chaincodeID: basic.config.chaincodeID,
    // Function to trigger
    fcn: "publish",
    // Parameters for the invoke function
    args: _args,
    //pass explicit attributes to teh query
    attrs: _invAttr
  };

  let publishFnc = publishDiplomaSupplement(invReq,req,res);

  try{
    basic.enrollAndRegisterUsers(university,_enrollAttr)
    .then(publishFnc)
    .catch(err =>{
      console.log("THIS is err 2 " + err);
    });

  }catch(err){
    res.send("something went worng!!");


  }






})

/**
 *  Currying of the basic invoke function so that the resulting
    function will only take the user as input
@param supplementRequest the invokation request object to publish a supplementRequest
@param req teh express reqeust object
@param res the express response object used to send the response back to the user
 */
function publishDiplomaSupplement(supplementRequest,req,res){
    return  function(user){
        basic.invoke(user,supplementRequest).then(response=> {
        console.log("the response is: \n");
        console.log(response);
        res.send(" user " + req.session.eID + " type " + req.session.userType + "\n response \n"
        +response.toString());
        // process.exit(0);
      }).catch(err => {
        throw err
      });
    }
}


module.exports = router
