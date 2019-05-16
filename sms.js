var mysql = require('mysql');

var accountSid ="ACdc4bb2957360b3a2648ee03c867d76a0";
var authToken = "61f017bfb5c0f0ec2f59a901095ff183";
var smsclient = require('twilio')(accountSid, authToken);

module.exports = function(server, db_config, io){

var cnn;

server.post('/smsreply/', (req, res, next) => {
    var Body = req.body.Body;
    var From = req.body.From;
    insertsms(0,'',Body, From,'');
    setTimeout(function(){smsUpdateSms(0,From, 1)}, 1000);
    io.emit('newsms',{Body:Body, From:From});
}); 

server.post('/sendingsms/',(req, res, next)=>{
    var wSms = req.body.SmsString;
    var wTo = req.body.smsTo;
    //var wFrom = '+19739881002';
    var wFrom = '+19144762202';
    //var wUrlMMS = req.body.smsUrlMms;
    smsclient.messages.create({
        to: wTo,
        from: wFrom,
        body: wSms
    });
    //.then((err, message) => console.log(err));

    // .then(function(sms) {
    //  console.log('Message success! SMS SID: ' + sms.sid);
    // }, function(error) {
    //  console.error('SMS failed!  Reason: ' + error.message);
    // });

    insertsms(req.body.wIdContact, wSms,'', '',wTo);

    res.json({data:"sent"});
   
 });

server.get('/smsGetAllContacts/',(req,res,next)=>{
    var query ="call smsGetAllContacts();";
    conectionDB();

    cnn.query(query, function(err, result, fields){
        if(err){
            res.send(500,{message:err});
            cnn.end();
            return;
        }
        res.json({data:result[0]});
        cnn.end();
        return;
    })
 });

server.post('/smsGetAllMessageByContact',(req,res,next)=>{
    var query = "call smsGetAllMessageByContact(?);";
    conectionDB();

    cnn.query(query,[req.body.wIdContact],function(err, result, fields){
        if (err){
            res.send(500,{message:err});
            cnn.end();
            return;
        }
        res.json({data:result[0]});
        cnn.end();
        return;
    })
})

server.post('/saveSmsContact/',(req,res,next)=>{
    var query = "call smsSaveContact(?,?,?,?)";
    conectionDB();

    cnn.query(query, [req.body.Wich, req.body.Phone, req.body.lastname, req.body.firstname],function(err, result, fields){
        if (err){
            res.send(500,{message:err});
            cnn.end();
            return;
        }
        res.json({success:true});
        cnn.end();
        return;
    })
});

server.post('/smsUpdateSms/',(req, res, next)=>{
    //smsUpdateSms(req.body.wIdContact, req.body.wFrom, req.body.wRead);
    var query = "call smsUpdateSMS(?,?,?)";
    conectionDB();

    cnn.query(query, [req.body.wIdContact, req.body.wFrom, req.body.wRead], function(err, result, fields){
        if (err){
            res.send(500,{message:err});
            cnn.end();
            return;
        }
        res.json({success:true});
        cnn.end();
        return;
    });
});

server.post('/SaveCampaign/',(req,res,next)=>{
    var query = "call smsSaveCampaign(?,?,?,?,?,?,?,?);"
    conectionDB();

    cnn.query(query,[req.body.IsNew, req.body.NameCampaign, 
        req.body.SmsCampaignText, req.body.DateCampaign, 
        req.body.HourCampaign, req.body.MmsCampaign, 
        req.body.PhoneClientCampaign, req.body.statusCampaign], function(err, result, fields){
            if (err){
                res.send(500, {message:err});
                cnn.end();
                return;
            }
            res.json({success:true});
            cnn.end();
            return;
        });
})

function smsUpdateSms(wIdContact, wFrom, wRead){
    var query = "call smsUpdateSMS(?,?,?)";
    conectionDB();

    cnn.query(query, [wIdContact, wFrom, wRead], function(err, result, fields){
        if (err){
            console.log(err);
            cnn.end();
            return;
        }
        cnn.end();
        return;
    });
};

function insertsms(wIdContact, wsmsTxtSend, wsmsTxtReceived, wFrom, wTo){
    var query ="call smsInsert(?,?,?,?,?)";
    conectionDB();

    cnn.query(query,[wIdContact, wsmsTxtSend, wsmsTxtReceived, wFrom, wTo], function(err, result, fields){
        if(err){
            console.log(err);
            cnn.end();
            return;
        }
        //response.status(200).json({success:true});
        cnn.end();
        return;
    });
}

function conectionDB(){
    cnn = mysql.createConnection(db_config);
    cnn.connect(function(err) {              
      if(err) {                                     
        console.log('error when connecting to db:', err);
        throw err; 
      }                                     
    }); 

    cnn.on('error', function(err) {
      console.log('db error sms', err.code);
    });                               
}
    
};



