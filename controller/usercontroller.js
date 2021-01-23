// @ts-nocheck
var model = require('../models/user-model');
var multer = require('multer');
const { body, validationResult } = require('express-validator');
var FCM = require('fcm-node');
var serverKey = 'AAAAPOupuYI:APA91bGqN_WFrL4osCo6zQtQ-q3MEHaSX8ck141eyU4uAPg9XtSGzg-0jQyRhpg67TsxPhOHHV877BaUvXFwc73L4lU7RtImoMu2x-W5LF7HzC7tWhqKAKwMGv8kcs1oFFzSPMMw9f_T'; //put your key here
var fcm = new FCM(serverKey); //pass it to FCM constructor
const { GeneralError, NotFound } = require("../middleware/error");
const { GeneralResponse } = require("../middleware/response");


var multerStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images/');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    }
});

// __dirname = "C:\Users\Shiv-1\dating_admin_MVC\controller"
//setting multer storage how uploading image/file should be stored

var user;
var user1;

exports.login = [
    body('username', 'Username is required').trim().isLength({ min: 1 }).escape(),
    body('password', 'Password is required').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                var err1 = errors.array();
                console.log(err1);
                res.render("login.ejs", {
                    error: err1
                });
            }
            else {
                model.login((req.body), (err, result) => {
                    if (err) {
                        next(new NotFound('no users found'));
                        var error1 = [];
                        error1.push({ msg: 'No User Found' });
                        console.log(error1);
                        res.render("login.ejs", {
                            error: error1
                        });
                    }
                    else {
                        if (result.length > 0) {
                            console.log(result);
                            req.session.userId = result[0].userId;
                            console.log(req.session.userId);
                            res.redirect("/dashboard")
                        }
                        else {
                            var error1 = [];
                            error1.push({ msg: 'No User Found' });
                            console.log(error1);
                            res.render("login.ejs", {
                                error: error1
                            });
                        }

                    }
                });
            }
        }
        catch (err) {
            var error1 = [];
            error1.push({ msg: 'Please try again' });
            console.log(error1);
            res.render("login.ejs", {
                error: error1
            });
        }
    }
];
exports.create = async (req, res, next) => {
    res.render("login.ejs", {});
}
exports.dashboard = async (req, res, next) => {
    
    var total_unpaid = 0;
    var total_paid = 0;
    var earning = 0;
    try {
        if(req.session.userId != " "){
        model.dashboard((err, result) => {
            if (result.length > 0) {
                user = result[0].totaluser;
            }
            else {
                user = 0;
            }
            res.render("index.ejs", {
                total_user: user,
                total_paid: total_paid,
                total_unpaid: total_unpaid,
                earning: earning
            });
        })
        }
        else{
            res.redirect('/');
        }      
    }
    catch {
        next(new GeneralError('No User found'))
    }
}

exports.users = async (req, res, next) => {
    
    try {
        if(req.session.userId){
            model.users((err, result) => {
                console.log(result);
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        user1 = result[i].DOB;
                        result[i].DOB = new Date(user1).toLocaleDateString();;
                    }
                    user1 = result;
                }
                res.render('user_index.ejs', {
                    users: user1,
                });
            })
        }
        else{
            res.redirect('/');
        }
    }
    catch {
        next(new GeneralError('No User found'))
    }
}
exports.userfeed = async (req, res, next) => {
    
    try {
        console.log(req.session.userId);
        if(req.session.userId != " ")
        {
            model.userfeed(req.session.userId,(err, result) => {
                console.log(result);
                if (result.length > 0) {
                    res.render('user_feed.ejs', {
                        users: result,
                    });
                }
            });
        }
        else{
            res.redirect('/');
        }
        // console.log(req.session.userId);
        
    }
    catch {
        next(new GeneralError('No User found'))
    }

}
exports.activatefeed = async (req, res, next) => {
    try {
        model.activatefeed(req.query.userId, (err, result) => {
                console.log(result);
                if (result) {
                    res.json({ msg: 'Your feed is successfully activated' });
                }
                if (err) {
                    res.json({ msg: 'Please try again' });
                }
            })
    }
    catch {
        next(new GeneralError('No User found'))
    }

}
exports.deactivatefeed = async (req, res, next) => {
    try {

        model.deactivatefeed(req.query.userId, (err, result) => {
            console.log(result);
            if (result) {
                res.json({ msg: 'Your feed is successfully deactivated' });
            }
            if (err) {
                res.json({ msg: 'Please try again' });
            }
        })
    }
    catch {
        next(new GeneralError('No User found'))
    }

}
exports.activate = async (req, res, next) => {
    try {
        // @ts-ignore
        model.activate(req.query.userId, (err, result) => {
            console.log(result);
            if (result) {
                res.json({ msg: 'Your account is successfully activated' });
            }
            if (err) {
                res.json({ msg: 'Please try again' });
            }
        })
    }
    catch {
        next(new GeneralError('No User found'))
    }

}
exports.deactivate = async (req, res, next) => {
    try {
        var fcm_devicetoken;
        model.deactivate(req.query.userId, (err, result) => {
            if (result) {
                model.fetch_id(req.query.userId, (err1, res1) => {
                    if (res1) {
                        fcm_devicetoken = res1[0].device_token;
                        console.log(fcm_devicetoken);
                        var message1 = { //based on message type (single recipient, multicast, topic, et cetera)
                            to: fcm_devicetoken, // saved in fcmToken variable
                            notification: {
                                title: 'Deactivate account.',
                                body: 'Your account is deactivated sucessfully.'
                            },
                        };
                        fcm.send(message1, function (err3, response) {
                            if (err3) {
                                console.log(err3);
                                console.log("Something has gone wrong!");
                            } else {
                                user1 = {
                                    userId: req.query.userId,
                                    title: "Deactivate Account",
                                    description: "Your account is deactivated sucessfully."
                                }
                                model.insert_notification(user1);
                                console.log("Successfully sent with response: ", response);
                            }
                        });
                    }
                });
                res.json({ msg: 'Your account is successfully deactivated' });
            }
            if (err) {
                res.json({ msg: 'Please try again' });
            }
        })
    }
    catch {
        next(new GeneralError('No User found'))
    }
    // @ts-ignore

}
exports.viewfeed = async (req, res, next) => {
    try {
        console.log(req.session.userId);
        if(req.session.userId != ' ')
        {   
            model.viewfeed(req.session.userId, (err, result) => {
                if (result.length > 0) {
                    user = result;
                }
                else {
                    user = "No record found";
                }
                res.render('admin_feed.ejs', {
                    users: user,
                });
            })
        }
        else{
           res.redirect('/');
        }
    }
    catch {
        next(new GeneralError('No User found'))
    }
}
exports.deletefeed = async (req, res, next) => {
    try {
        if(req.session.userId != " ")
        {
            model.deletefeed(req.query.feedId, (err, result) => {
                if (result) {
                    res.redirect("/viewfeed");
                }
            })
        }
        else{
            res.redirect('/');
        }
    }
    catch {
        next(new GeneralError('No User found'))
    }
}
exports.editfeed = async (req, res, next) => {
    try {
        if(req.session.userId != ' ')
        {
            model.editfeed(req.query.feedId, (err, result) => {
                if (result) {
                    res.render('edit_feed.ejs', {
                        user: result[0],
                    });
                }
            })
        }
        else{
            res.redirect("/");
        }
    } catch (err) {
        next(new GeneralError('error while getting user feed'))
    }
}
exports.addfeed = async (req, res, next) => {
    try {
        if (req.session.userId != ' ') {
            res.render('add_feed.ejs', {
            });
        }
        else {
            res.redirect ("/");
        }
    } catch (err) {
        next(new GeneralError('error while getting user feed'))
    }
  
}
exports.save = async (req, res, next) => {
    try {
        var multerSigleUpload = multer({ storage: multerStorage });
        multerSigleUpload.any()(req, res, async function (error) {
            // console.log(req.body);
            if (error)
                throw error;
            console.log(req.files);
            if(req.session.userId != " ")
            {
                if(!req.files)
                {
                    if (req.files[0].fieldname == "image") {
                        user1 = {
                            loginid: req.session.userId,
                            title: req.body.title,
                            hashtag: req.body.hashtag,
                            description: req.body.details,
                            image: req.files[0].filename,
                            video: 'NULL'
                        }
                        model.addfeed(user1, (err, result) => {
                            if (result) {
                                console.log(result);
                                var fcm_devicetoken;
                                model.except_adminfetchdata(req.session.userId,(err1, res1) => {
                                    if (res1) {
                                        console.log(res1);
                                        for (let i = 0; i < res1.length; i++) {
                                            fcm_devicetoken = res1[i].device_token;
                                            console.log(fcm_devicetoken);
                                            if (fcm_devicetoken != " ") {
                                                var message1 = {
                                                    to: fcm_devicetoken,
                                                    notification: {
                                                        title: 'New feed Added',
                                                        body: 'Admin new feed added sucessfully.'
                                                    },
                                                };
                                                fcm.send(message1, function (err3, response) {
                                                    if (err3) {
                                                        console.log(err3);
                                                        console.log("Something has gone wrong!");
                                                    } else {
                                                        user1 = {
                                                            userId: res1[i].userId,
                                                            title: "New feed Added",
                                                            description: "Admin new feed added sucessfully."
                                                        };
                                                        model.insert_notification(user1);
                                                        console.log("Successfully sent with response: ", response);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                                res.redirect("/viewfeed");
                            }
                        });
                    }
                    else if (req.files[0].fieldname == "video") {
                        user1 = {
                            loginid: req.session.userId,
                            title: req.body.title,
                            hashtag: req.body.hashtag,
                            description: req.body.details,
                            image: ' ',
                            video: req.files[0].filename
                        }
                        model.addfeed(user1, (err, result) => {
                            if (result) {
                                console.log(result);
                                var fcm_devicetoken;
                                model.except_adminfetchdata((err1, res1) => {
                                    if (res1) {
                                        console.log(res1);
                                        for (let i = 0; i < res1.length; i++) {
                                            fcm_devicetoken = res1[i].device_token;
                                            console.log(fcm_devicetoken);
                                            if (fcm_devicetoken != " ") {
                                                var message1 = {
                                                    to: fcm_devicetoken,
                                                    notification: {
                                                        title: 'New feed Added',
                                                        body: 'Admin new feed added sucessfully.'
                                                    },
                                                };
                                                fcm.send(message1, function (err3, response) {
                                                    if (err3) {
                                                        console.log(err3);
                                                        console.log("Something has gone wrong!");
                                                    } else {
                                                        user1 = {
                                                            userId: res1[i].userId,
                                                            title: "New feed Added",
                                                            description: "Admin new feed added sucessfully."
                                                        };
                                                        model.insert_notification(user1);
                                                        console.log("Successfully sent with response: ", response);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                                res.redirect("/viewfeed");
                            }
                        });
                    }
                }else{    
                }
                
            }
            else{
                res.redirect('/');
            }
            
        });
    }
    catch (err) {
        next(new GeneralError('error while getting user feed'))
    }
}
exports.update = async (request, res, next) => {
    try {
        var multerSigleUpload = multer({ storage: multerStorage });
        multerSigleUpload.any()(request, res, async function (error) {
            if (error)
                throw error;
            // console.log(request.files[0].fieldname);
            if (request.files.length > 0) {
                if (request.files[0].fieldname == "image") {
                    user1 = {
                        feedId: request.body.feedId,
                        title: request.body.title,
                        hashtag: request.body.hashtag,
                        description: request.body.details,
                        image: request.files[0].filename,
                        video: 'Null'
                    }
                    console.log(user1);
                    model.updateimagefeed(user1, (err, result) => {
                        if (result) {
                            res.redirect("/viewfeed");
                        }
                    })
                }
                else if (request.files[0].fieldname == "video") {
                    user1 = {
                        feedId: request.body.feedId,
                        title: request.body.title,
                        hashtag: request.body.hashtag,
                        description: request.body.details,
                        image: ' ',
                        video: request.files[0].filename
                    }
                    // console.log(user1);
                    model.updateimagefeed(user1, (err, result) => {
                        if (result) {
                            res.redirect("/viewfeed");
                        }
                    })
                }
            }
            else {
                user1 = {
                    feedId: request.body.feedId,
                    title: request.body.title,
                    hashtag: request.body.hashtag,
                    description: request.body.details
                }
                model.updatefeed(user1, (err, result) => {
                    if (result) {
                        res.redirect("/viewfeed");
                    }
                })
            }

        });
    }
    catch (err) {
        next(new GeneralError('error while getting user feed'))
    }

}
exports.logout = (req,res)=>{
    try{
        req.session.destroy();
        res.redirect("/");
    }
    catch(err)
    {
        next(new GeneralError('error while logout'))
    }

}
exports.sendnotification_uploadfeed = () => {
    var fcm_devicetoken;
    model.except_adminfetchdata((err1, res1) => {
        if (res1) {
            for (let i = 0; i < res1.length; i++) {
                fcm_devicetoken = res1[i].device_token;
                console.log(fcm_devicetoken);
                var message1 = {
                    to: fcm_devicetoken,
                    notification: {
                        title: 'New feed Added',
                        body: 'Admin new feed added sucessfully.'
                    },
                };
                fcm.send(message1, function (err3, response) {
                    if (err3) {
                        console.log(err3);
                        console.log("Something has gone wrong!");
                    } else {
                        user1 = {
                            userId: res1[i].userId,
                            title: "New feed Added",
                            description: "Admin new feed added sucessfully."
                        };
                        model.insert_notification(user1);
                        console.log("Successfully sent with response: ", response);
                    }
                });
            }
        }
    });
}
