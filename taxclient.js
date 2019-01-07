var mysql = require("mysql");

module.exports = function(server, db_config){
	var cnn;

	conectionDB();

	server.get("/listclientstatus/", (req, res, next) =>{
		var query = "call ShowClientEstatus()";
		conectionDB();

		cnn.query(query, function(err, result, fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	          res.json({success:true , hasdata: true , data: result[0]});
	          cnn.end();
	          return next();
	        }else{
	          //missin parameter
	          res.json({success:true , hasdata: false});
	          cnn.end();
	          return next();
	        }
		});
	});

	server.get("/listvirtualstatus/", (req, res, next) =>{
		var query = "call ShowClientVirtualEstatus()";
		conectionDB();

		cnn.query(query, function(err, result, fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	          res.json({success:true , hasdata: true , data: result[0]});
	          cnn.end();
	          return next();
	        }else{
	          //missin parameter
	          res.json({success:true , hasdata: false});
	          cnn.end();
	          return next();
	        }
		});
	});

	server.post("/updatetaxclient/",(req,res,next) =>{
		var query = "call UpdateClientDrakTake(?,?,?,?,?,?,?,?,?,?,?,@MaxCod); select @MaxCod";
		conectionDB();

		cnn.query(query,[req.body.IdClient, req.body.SocialSecurity,
		req.body.SpouseName, req.body.PhoneClient, req.body.StatusClient, 
		req.body.VirtualStatusClient, req.body.chkRequestFileCabnet, req.body.chkDrakeTake,
		req.body.chkOutStateClient, req.body.RatingSatisfaction, req.body.PermanentPreparer], function(err, result,fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	        	//data: result[0] es el lugar del nodo json en el que mysql envia el dato
	          res.json({success:true , hasdata: true , data: result[1]});
	          cnn.end();
	          return next();
	        }else{
	          //missin parameter
	          res.json({success:true , hasdata: false});
	          cnn.end();
	          return next();
	        }
		})
	});

	server.post("/ShowClientComment/",(req, res, next) =>{
		var query = "call ShowClientComments(?,?)";
		conectionDB();

		cnn.query(query,[req.body.hClient, req.body.SourceID], function(err, result, fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	        	//data: result[0] es el lugar del nodo json en el que mysql envia el dato
	          res.json({success:true , hasdata: true , data: result[0]});
	          cnn.end();
	          return next();
	        }else{
	          //missin parameter
	          res.json({success:true , hasdata: false});
	          cnn.end();
	          return next();
	        }
		})
	})

	server.put("/RecordDatailComm/",(req, res, next) => {
		var query = "call RecordDatailComment(?,?,?,?,?,?)";
		conectionDB();

		cnn.query(query, [req.body.CodComment,req.body.IdClientComm,req.body.CommentEmployeeID,
		req.body.comDate,req.body.commentDatailComment,req.body.SourceCommID], function(err, result, fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	        	//data: result[0] es el lugar del nodo json en el que mysql envia el dato
	          res.json({success:true , hasdata: true , data: result[0]});
	          cnn.end();
	          return next();
	        }else{
	          //missin parameter
	          res.json({success:true , hasdata: false});
	          cnn.end();
	          return next();
	        }
		})
	})

	server.post("/ApplyFilterClient/",(req, res, next) =>{
		var query = "call CreateFilterDrakeTake(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		conectionDB();

		cnn.query(query,[req.body.FilterStatus, req.body.FilterVirtualStatus, req.body.FilterUsualTaxPrep,req.body.YearTaxPrepFilter,req.body.TaxPrepYearFilter,req.body.FilterBinWorkFlow,req.body.FilterStartSSN,req.body.FilterEndSSN,req.body.FilterchkSchC,req.body.FilterchkDeniedEIC,req.body.FilterchkInterestedServ,req.body.FilterchkNotCall,req.body.FilterchkImmigration,req.body.optionsRadiosCalls, req.body.RowIndex], function(err, result, fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	        	//data: result[1] es el lugar del nodo json en el que mysql envia el dato
	          res.json({success:true, hasdata: true, data:result[0]});

	          cnn.end();
	          return next();
	        }else{
	          //missin parameter
	          res.json({success:true , hasdata: false});
	          cnn.end();
	          return next();
	        }
		})
	})

	server.post("/SerchComments/",(req, res,next) =>{
		var query = "select distinct comments from clientcomments limit 500;"
		conectionDB();

		cnn.query(query,[req.body.strComment],function	(err,result,fields){
			if(result != undefined && result[0] != undefined){
	          res.json({success:true , hasdata: true, data:result});
	          cnn.end();
	          return next();
	        }else{
	          res.json({success:true , hasdata: false});
	          cnn.end();
	          return next();
	        }
		});
	});


	function conectionDB(){
	    cnn = mysql.createConnection(db_config);
	    cnn.connect(function(err) {              
	      if(err) {                                     
	        console.log('error when connecting to db:', err);
	        throw err; 
	      }                                
	    }); 

	    cnn.on('error', function(err) {
	      console.log('db error', err.code);
	    });                               
	  }
	  function isInteger(str){
	    var reg = /^\d+$/;
	    return reg.test(str);
	  }
}