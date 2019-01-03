var mysql = require('mysql');
var js2xmlparser = require("js2xmlparser");
var writeFile = require('write-file')

var jsonFormat;

module.exports = function(server, db_config){
	var cnn;
	
	server.post('/show_client/', (req, res, next) =>{
		var query = "call showclient(?,?,?,?,?,?,?,?,?,?,?)";
		conectionDB();
		
		cnn.query(query, [req.body.IdClient,req.body.ClientSSN,req.body.DocID,req.body.Name,req.body.Status,
			req.body.VirtualStatus,req.body.UsualTaxPrep,req.body.YearTaxPrep,req.body.TaxPrepYear,
			req.body.DefComp,req.body.wTicket], function(err, result, fields){

			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        if(result != undefined && result[0] != undefined){
	          if (result[0].length > 0){
	        	res.json({success:true , hasdata: true , data: result[0]});
		        cnn.end();
		        return next();
	          }
	          else{
	          	res.json({success:true , hasdata: false});
		        cnn.end();
	          }
	        }else{
	          //missin parameter
	          res.json({success:true , hasdata: false});
	          cnn.end();
	          return next();
	        }

		});
		
	});

	server.get('/showticketnumber/', (req, res, next) =>{
		var query = "call sp_Ticket(@MaxTicket); select @MaxTicket";
		conectionDB();

		cnn.query(query,true, function(err, result, fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
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
	})

	server.put('/save_client/', (req,res,next) =>{
		var query = "call SaveCustomerInfo(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@MaxCod); select @MaxCod";
		conectionDB();

		cnn.query(query, [req.body.IdClient,req.body.LastNameCustomer, req.body.FirstNameCustomer,
			req.body.MiddleNameCustomer, req.body.EMail, req.body.DocumentIdImm, req.body.SocialSecutiyCustomer, 
			req.body.HomePhoneCustomer, req.body.OtherPhoneCustomer, req.body.OtherPhoneCustomer2,
			req.body.AddressCustomer, req.body.CityCustomer, req.body.StateCustomer, req.body.ZipCustomer,
			req.body.DOBCustomer, req.body.SelectSourceCustomer, req.body.CommentCustomer, 
			req.body.SelectSexCustomer, req.body.SelectLanguageCustomer, req.body.SelectStatusCustomer, 
			req.body.TypeClient, req.body.IdTicket, req.body.SubjectTicket, req.body.QuickNoteTicket],function(err, result, fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	        	//data: result[3] es el lugar del nodo json en el que mysql envia el dato
	          res.json({success:true , hasdata: true , data: result[3]});
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

	server.put('/save_ProcRec/', (req,res,next) =>{
		var query = "call SaveProcRec(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		conectionDB();

		cnn.query(query, [req.body.IdClient,req.body.proc1,req.body.proc2, req.body.proc3,
			req.body.proc4, req.body.proc5, req.body.proc6, req.body.proc7, 
			req.body.proc8, req.body.proc9, req.body.proc10,
			req.body.proc11, req.body.proc12, req.body.proc13, req.body.proc14,
			req.body.proc15, req.body.proc16, 
			req.body.proc17,req.body.proc18, req.body.proc19,
			req.body.proc20, req.body.proc21, req.body.proc22, req.body.proc23, 
			req.body.proc24, req.body.proc25, req.body.proc26,
			req.body.proc27, req.body.proc28, req.body.proc29, req.body.proc30,
			req.body.proc31, req.body.proc32,
			req.body.proc33,req.body.proc34, req.body.proc35,
			req.body.proc36, req.body.proc37, req.body.proc38, req.body.proc39, 
			req.body.proc40,req.body.TaxYear],function(err, result, fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	        	//data: result[3] es el lugar del nodo json en el que mysql envia el dato
	          res.json({success:true});
	          cnn.end();
	          return next();
	        }else{
	          //missin parameter
	          res.json({success:false});
	          cnn.end();
	          return next();
	        }
		})
	});

	server.post('/get_ProcRec/', (req,res,next) =>{
		var query = "call GetProcReception(?,?)";
		conectionDB();

		cnn.query(query, [req.body.IdClient,req.body.TaxYear],function(err, result, fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result[0].length > 0){
	          res.json({success:true , hasdata: true , data: result[0]});
	          cnn.end();
	          return next();
	        }else{
	          //missin parameter
	          res.json({hasdata:false});
	          cnn.end();
	          return next();
	        }
		})
	});

	server.post('/CreateNewTicket/', (req, res, next) =>{
		var query = "call RecordTicket(?,?,?,?,?,?,@MaxTicketId); select @MaxTicketId";
		conectionDB();

		cnn.query(query, [req.body.wSSN,req.body.NameClientTicket,req.body.SelectAgent,req.body.TypeService,req.body.ReasonVisit,1], function(err, result, fields){

			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	          res.json({success:true , hasdata: true , data: result});
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

	server.post('/reportticket', (req, res, next) =>{
		var query = "call ReportTickets(?)";
		var dataXML;
		var filxml;
		conectionDB();

		cnn.query(query,[req.body.wTicket], function(err, result, fields){
			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	        	dataXML = result[0] ;
	        	
	          res.json(result[0]);

	          filexml = js2xmlparser.parse("NewDataSet", {"ReportTickets": dataXML});
	          //writeFile('Pupilo/PC01/PrintTicket.xml', filexml)

	          cnn.end();

	          UpdateTicketXML(filexml, req.body.wTicket);

	          return next();

	        }else{
	          //missin parameter
	          res.json({success:true , hasdata: false});
	          cnn.end();
	        }
		})
	});

	server.post('/VerifyRegistedClient',(req, res, next)=>{
		var query = "call VerifyRegistedClient(?,@IdClient); select @IdClient";
		conectionDB();

		cnn.query(query,[req.body.SSN], function(err, result, fields){
			if (err){
				res.send(500,{message:err});
				cnn.end();
				return;
			}

			if(result != undefined && result[0] != undefined){
				res.json({success:true, hasdata:true, data:result[1]});
				cnn.end();
				return;
			}else{
				res.json({success:true, hasdata:false});
				cnn.end();
				return;
			}
		})

	})

	function UpdateTicketXML(StrinXML, IdTicket){
		var query = "UPDATE Tickets SET StringXML = ? WHERE IdTicket = ? ";
		conectionDB();
		cnn.query(query,[StrinXML, IdTicket])
		cnn.end();
	}
	

	server.put('/save_TaxClient', (req, res, next)=>{
		var query = "call UpdateClientDrakTake(?,?,?,?,?,?,?,?,?,?,?,@MaxCod); select @MaxCod";
		conectionDB();

		cnn.query(query, [req.body.IdClient,req.body.wSSN, req.body.SpouseName,
			req.body.HomePhone, req.body.Status, req.body.VirtualStatus, req.body.ReqFileCabnet, 
			req.body.EmailFileCabnet, req.body.OutState, req.body.RatingSatisfaction,
			req.body.PermanentPreparer],function(err, result, fields){

			if (err){
	          res.send(500, {message: err});
	          cnn.end();
	          return next(false);
	        }
	        
	        if(result != undefined && result[0] != undefined){
	        	//data: result[3] es el lugar del nodo json en el que mysql envia el dato
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

	server.post('/ShowListClientTicket', (req, res, next) => {
		var query = "call ListClientTickes(?)";
		conectionDB();
		cnn.query(query, [req.body.ssncl], function(err, result, fields){

			if (err){
	          res.send(500, {message: err});
	          connection.end();
	          return next(false);
	        }

			if (result != undefined){
				res.json({success:true, hasdata:true, data: result[0]});
				cnn.end();
				return next();
			}
			else{
				res.json({success:true , hasdata: false});
	          	cnn.end();
	          	return next();
			}
		})
	});

	server.post('/UpdateBinWorkFlow',(req, res, next)=>{
		var query = "call TicketTaxWorkFlow(?,?)";
		conectionDB();

		cnn.query(query, [req.body.IdTicket, req.body.StatusTicket], function(err, result, fields){
			if (err){
				res.send(500, {message: err});
				cnn.end();
				return next(false);
			}
			res.json({success:true});
	        cnn.end();
	        return next(false);
		})
	})



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