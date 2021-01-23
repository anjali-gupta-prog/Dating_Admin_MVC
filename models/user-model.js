const md5 = require('md5');
// @ts-ignore
// import { conn } from './mysqldb';
var conn = require('./mysqldb');

var msg;
module.exports={
    login : function(body,callback){
    username =body.username;
    password =body.password;
    password_md5 =md5(password);
    let sql ="SELECT userId FROM registration WHERE email='"+ username+"' AND (password='"+ password_md5 +"')";
    console.log(sql);  
    conn.query(sql,(err,response)=>{
        if(!err && response)
        {
            if(response.length >0)
            {

            }
            callback(null,response);
        }
        else callback(err);
    });

    },
    dashboard: function(callback)
    {
        conn.query("Select Count(userId) AS totaluser from registration where role != 'Admin'",callback);
    },
    users : function(callback)
    {
        conn.query("Select * from registration where role != 'Admin'",callback);
    },
    activate : function(id,callback)
    {
        conn.query("Update registration SET `active_status`=1 where userId='"+id+"' ",callback);
    },
    deactivate : function(id,callback)
    {
        conn.query("Update registration SET `active_status`=0 where userId='"+id+"' ",callback);
    },
    // @ts-ignore
    viewfeed : function(feedid,callback)
    {
        // const feedid1=feedid;
        // console.log(feedid);
        conn.query("Select * from user_feed where userId = '"+feedid+"' ",callback);
    },
    deletefeed : function(feedid, callback)
    {
        conn.query("Delete from user_feed where id ='"+feedid+"' ",callback);
    },
    addfeed : function(request,callback)
    {
        const loginid = request.loginid;
        conn.query("INSERT INTO user_feed (title,hashtag,description,image,video,userId) VALUES ('"+request.title+"','"+request.hashtag+"','"+request.description+"','"+request.image+"','"+request.video+"','"+loginid+"')",callback);
    },
    editfeed: function (id, callback)
    {
        conn.query("Select * from user_feed where id = '"+id+"' ",callback);
    },
    updatefeed : function(request,callback)
    {
        conn.query("Update user_feed SET `title`='"+request.title+"', hashtag='"+request.hashtag+"', description='"+request.description+"' where id='"+request.feedId+"' ",callback);
    },
    updateimagefeed : function(request,callback)
    {
       console.log(request); 
       console.log("Update user_feed SET `title`='"+request.title+"', hashtag='"+request.hashtag+"', description='"+request.description+"' , image='"+request.image+"', video='"+request.video+"' where id='"+request.feedId+"' ");
        conn.query("Update user_feed SET `title`='"+request.title+"', hashtag='"+request.hashtag+"', description='"+request.description+"' , image='"+request.image+"', video='"+request.video+"' where id='"+request.feedId+"' ",callback);
    },
    fetch_id(userId,callback)
    {
        conn.query("Select device_token,fullName from registration where userId= '"+userId+"'",callback);
    },
    insert_notification(request,callback)
    {
        conn.query("INSERT INTO `user_notification` (`user_id`,`title`,`description`) VALUES ("+request.userId+",'"+request.title+"','"+request.description+"')", callback);
    },
    except_adminfetchdata(id,callback)
    {
        conn.query("Select * from registration where userId != '"+id+"' ",callback);
    },
    userfeed (id,callback)
    {
        console.log("userfeed :"+id);
        conn.query("Select * from user_feed where userId != '"+id+"' ",callback);
    },
    activatefeed(id,callback)
    {
        conn.query("Update user_feed SET `active_status`=1 where id='"+id+"' ",callback);
    },
    deactivatefeed(id,callback)
    {
        conn.query("Update user_feed SET `active_status`=0 where id='"+id+"' ",callback);
    }
    // updatevideofeed : function
}