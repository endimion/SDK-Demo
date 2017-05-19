
const express = require('express');
const router = express.Router()
const randomstring = require("randomstring");
const basic = require('../basicFunctions');
const chainCodeQuery = require('../ChaincodeQuery.js');



router.get('/publish',(req,res) =>{

  res.render('publishSupplementView',{ title: 'Publish a new Diploma Supplement',
  message: 'Welcome user: ' + req.session.eID ,
  supId: randomstring.generate(10),
  university: req.session.eID});
});



router.post('/publish',(req,res) =>{


  let owner = req.body.owner;
  let university = req.body.university;
  let _id = req.body.id;

  let _args = ['{"Owner":"'+ owner +'", "University":"'+university+'","Authorized":[],"Id":"'+_id+'"}' ];
  let _enrollAttr = [{name:'typeOfUser',value:'University'},{name:"eID",value:university.toString()}];

  console.log(_enrollAttr);

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

  /**
      closure to include a counter, to attempt to publish for a max of 10 times;
  **/
  let tryToPublish = (function(){
    let counter = 0;
    if(counter < 10){
      return function(){
        basic.enrollAndRegisterUsers(university,_enrollAttr)
        .then(publishFnc)
        .then( rsp => {
          counter = 10;
          res.send(rsp);
        })
        .catch(err =>{
          console.log("AN ERROR OCCURED!!! atempt:"+counter+"\n");
          console.log(err);
          counter ++;
          tryToPublish();
        });

      }
    }else{
      res.send("failed, to get  supplements after " + counter + " attempts");
    }

  })();
  tryToPublish();
});



router.get('/view',(req,res) =>{

  let queryArgs = [req.session.eID];
  let userName = req.session.eID;

  let enrollAttr = [{name:'typeOfUser',value:'University'}];
  let queryAttributes = ['typeOfUser'];

  let testQ2 = new chainCodeQuery(queryAttributes, queryArgs, basic.config.chaincodeID,"getSupplements",basic.query);
  let testQfunc2 = testQ2.makeQuery.bind(testQ2);


  // basic.enrollAndRegisterUsers(userName,enrollAttr)
  // .then(testQfunc2).then(response =>{
  //   console.log("\nthe result is" + response);
  //   res.send(JSON.parse(response));
  //   // process.exit(0);
  // })
  // .catch(err =>{
  //   console.log("AN ERROR OCCURED!!!\n");
  //   console.log(err);
  //
  // });
  /**
  closure to add atempts to re-try in case of exceptions
  **/
  let tryToGetSupplements = (function(){
    let counter = 0;
    let supplements =[];
    if(counter < 10){
      return function(){
        basic.enrollAndRegisterUsers(userName,enrollAttr)
        .then(testQfunc2).then(response =>{
          console.log("\nthe result is" + response);
          // res.send(JSON.parse(response));
          supplements = JSON.parse(response);
          // process.exit(0);
          counter = 10;
          res.render('viewSupplements',{ title: 'Published Supplements',
          message: 'Welcome user: ' + req.session.eID ,
          supplements: supplements});

        })
        .catch(err =>{
          console.log("AN ERROR OCCURED!!! atempt:"+counter+"\n");
          console.log(err);
          counter ++;
          tryToGetSupplements();
        });
      }
    }else{
      res.send("failed, to get  supplements after " + counter + " attempts");
    }

  })();
  tryToGetSupplements();
});







/**
*  Currying of the basic invoke function so that the resulting
function will only take the user as input
@param supplementRequest the invokation request object to publish a supplementRequest
@param req teh express reqeust object
@param res the express response object used to send the response back to the user
*/
function publishDiplomaSupplement(supplementRequest,req,res){

  return function(user){
    return  new Promise(function(resolve,reject){

      console.log("will send invoke request");
      basic.invoke(user,supplementRequest)
      .then(rsp=> {
        console.log("the response is: \n");
        console.log(rsp);
        // res.send(" user " + req.session.eID + " type " + req.session.userType + "\n response \n"
        // +response.toString());
        resolve(rsp);
        // process.exit(0);
      }).catch(err => {
        reject(err)
      });
    });

  }


}





module.exports = router
