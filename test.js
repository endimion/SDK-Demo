'use strict';

let basic  = require('./basicFunctions.js');
let ChainCodeQuery = require('./ChaincodeQuery.js');


// intialize the network configuartion
basic.init();



let attributes = ['typeOfUser'];
let enrollAttr = [{name:'typeOfUser',value:'University'}];
let args = ["a"];
let funcName = "query";
let testQ = new ChainCodeQuery(attributes, args, basic.config.chaincodeID,funcName,basic.query);
let testQfunc = testQ.makeQuery.bind(testQ);

let armgnts = ["a","b","10"];
let invokeRequest = {
    // Name (hash) required for invoke
    chaincodeID: basic.config.chaincodeID,
    // Function to trigger
    fcn: basic.config.config.invokeRequest.functionName,
    // Parameters for the invoke function
    args: armgnts
};


let depArgs = [
   "a",
   "100",
   "b",
   "200"
];
let depFunCName = "init";
let chaincodePath = "chaincode";
let certPath  = "";

let deployRequest = {
    // Function to trigger
    fcn:depFunCName,
    // Arguments to the initializing function
    args: depArgs,
    chaincodePath: chaincodePath,
    // the location where the startup and HSBN store the certificates
    certificatePath: basic.config.network.cert_path
};



// actual tests



// testDeploy();
testQueries2();
// testInvoke2()
//testInvoke();

function testDeploy(){
  basic.enrollAndRegisterUsers(basic.config.newUserName,enrollAttr)
    .then(user => {
      basic.deploy(user,deployRequest).then(res=> {console.log(res);
        process.exit(0);
      }).catch(err =>{
        console.log(err);
        process.exit(1);
      });
    }).catch(err =>{
      console.log(err);
    });
}

function testInvoke(){
  basic.enrollAndRegisterUsers(basic.config.newUserName,enrollAttr)
    .then(user => {
      basic.invoke(user,invokeRequest).then(res=> {console.log(res);
        process.exit(0);
      }).catch(err =>{
        console.log(err);
        process.exit(1);
      });
    }).catch(err =>{
      console.log(err);
    });
}



function testInvoke2(){
  let _args = ['{"Owner": "me", "University":"ntua","Authorized":[],"Id":""}' ];
  let _enrollAttr = [{name:'typeOfUser',value:'Student'}];
  let req = {
      // Name (hash) required for invoke
      chaincodeID: basic.config.chaincodeID,
      // Function to trigger
      fcn: "publish",
      // Parameters for the invoke function
      args: _args,
      //pass explicit attributes to teh query
      attrs: attributes
  };
  basic.enrollAndRegisterUsers("testUser",_enrollAttr)
    .then(user => {
      basic.invoke(user,req).then(res=> {console.log(res);
        process.exit(0);
      }).catch(err =>{
        console.log(err);
        process.exit(1);
      });
    }).catch(err =>{
      console.log(err);
    });
}




function testQueries(){
  basic.enrollAndRegisterUsers(basic.config.newUserName,enrollAttr)
      .then(testQfunc).then(res =>{
        console.log("\nthe result is" + res);
        process.exit(0);
      })
      .then(res => {
          basic.enrollAndRegisterUsers("dummyUser",[])
              .then(testQfunc).then(res =>{
            console.log("\nthe result is" + res);
            process.exit(0);
          }).catch(err =>{
            console.log(err);
            process.exit(1);
          });

      })
      .catch(err =>{
        console.log(err);
        process.exit(1);
      });

}



function testQueries2(){
  let _args = ["ntua"];
  let testQ2 = new ChainCodeQuery(attributes, _args, basic.config.chaincodeID,"getSupplements",basic.query);
  let testQfunc2 = testQ2.makeQuery.bind(testQ2);
  basic.enrollAndRegisterUsers(basic.config.newUserName,enrollAttr)
      .then(testQfunc2).then(res =>{
        console.log("\nthe result is" + res);
        process.exit(0);
      })
      .catch(err =>{
        console.log("AN ERROR OCCURED!!!");
        console.log(err);
        if(err.toString().indexOf("Security handshake") > 0){
          console.log("there was a handshake error");
        }
        process.exit(1);
      });
}

//
