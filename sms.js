var mysql = require('mysql');

var accountSid ="ACf26eec48af2b1f571b91a6c97a92ab9f";
var authToken = "b24674ae4f2257b41e5eee20f3cebfa2";
var smsclient = require('twilio')(accountSid, authToken);

module.exports = function(server, db_config, io){

var cnn;

server.post('/smsreply/', (req, res, next) => {
    var Body = req.body.Body;
    var From = req.body.From;
    var mediaUrl = req.body.MediaUrl0;
    var numMedia = req.body.NumMedia;
    if (numMedia > 0) {
        for (var i = 0; i < numMedia; i++)
        {
            //var mediaUrl = req.Form[$"MediaUrl{i}"];
            //console.log(wMedia);
            insertsms(0,'',Body, From,'','', req.body.MediaUrl0);
        }
    }else{insertsms(0,'',Body, From,'','');}
    setTimeout(function(){smsUpdateSms(0,From, 1)}, 1000);
    io.emit('newsms',{Body:Body, From:From, smsMMSReceived:mediaUrl});
}); 

server.post('/sendingsms/',(req, res, next)=>{
    var wSms = req.body.SmsString;
    var wTo = req.body.smsTo;
    
    var wFrom = '+19144762202';
    var wUrlMMS = req.body.smsUrlMms;
    if (wUrlMMS == '') {
        smsclient.messages.create({
            to: wTo,
            from: wFrom,
            body: wSms
        });

        // .then(function(sms) {
        //  console.log('Message success! SMS SID: ' + sms.sid);
        // }, function(error) {
        //  console.error('SMS failed!  Reason: ' + error.message);
        // });
    }
    else{
        smsclient.messages.create({
            to: wTo,
            from: wFrom,
            body: wSms,
            mediaUrl: wUrlMMS
        });
    }
    
    //.then((err, message) => console.log(err));

    

    insertsms(req.body.wIdContact, wSms,'', '',wTo,wUrlMMS,'');

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
});

server.get('/smsGetListCampaign/',(req,res,next)=>{
    var query = "call smsGetListCampaign();"
    conectionDB();

    cnn.query(query,function(err, result, fields){
        if(err){
            res.send(500,{message:err});
            cnn.end();
            return;
        }
        res.json({hasdata:true, data:result[0]});
        cnn.end();
        return;
    });
});

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

function insertsms(wIdContact, wsmsTxtSend, wsmsTxtReceived, wFrom, wTo, smsUrlMms, MmsUrlReceived){
    var query ="call smsInsert(?,?,?,?,?,?,?)";
    conectionDB();

    cnn.query(query,[wIdContact, wsmsTxtSend, wsmsTxtReceived, wFrom, wTo, smsUrlMms,MmsUrlReceived], function(err, result, fields){
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



