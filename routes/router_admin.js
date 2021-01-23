const express = require("express");
const router = express.Router()
const userController = require("../controller/usercontroller");

router.get('/', userController.create);

router.post('/login',userController.login);
// @ts-ignore
router.get("/dashboard",userController.dashboard);
router.get("/users",userController.users);
router.get("/activate",userController.activate);
router.get("/deactivate",userController.deactivate);
router.get("/viewfeed",userController.viewfeed);
router.get("/deletefeed",userController.deletefeed);
router.get("/editfeed",userController.editfeed);
router.get("/addfeed",userController.addfeed);

// @ts-ignore
router.post("/save",userController.save);

// @ts-ignore
router.post("/update",userController.update);
router.get("/userfeed",userController.userfeed);
router.get("/activatefeed",userController.activatefeed);
router.get("/deactivatefeed",userController.deactivatefeed);
router.get('/logout',userController.logout);

module.exports = router