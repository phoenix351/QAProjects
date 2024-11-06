'use strict';

module.exports = function (app,myDataBase) {
  

  app.route('/api/issues')
  
    .get(async function (req, res){
      // let project = req.params.project;
      // let issue = await myDataBase.findOne("test")
      // console.log({issue});
      res.send('percobaan')     
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
