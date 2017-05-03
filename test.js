let basic  = require('./basicFunctions.js');


let attributes = [{name:'typeOfUser',value:'University'}];

const testQuery = function(user){
  //request,attr,chaincodeID
    let attributes = ['typeOfUser'];
    let args = basic.config.config.queryRequest
    let queryRequest = {
        // Name (hash) required for query
        chaincodeID: basic.config.chaincodeID,
        // Function to trigger
        fcn: basic.config.config.queryRequest.functionName,
        // Existing state variable to retrieve
        args: args,
        //pass explicit attributes to teh query
         attrs: attributes
    };
  return basic.query(user,queryRequest,attributes,args);
}


basic.init();
basic.enrollAndRegisterUsers(basic.config.newUserName,attributes)
    .then(testQuery).then(res =>{
  console.log("\nthe result is" + res);
  process.exit(0);
}).
  // user =>{
  // //console.log(user);
  // basic.query(user).then(res =>{
  //   console.log("\nthe result is" + res);
  //   process.exit(0);
  // });
// }).

catch(err =>{
  console.log(err);
  process.exit(1);
});
