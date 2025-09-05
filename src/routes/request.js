const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const sendEmail = require("../utils/sendEmail")

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //If user is trying to send connection request to self.
      // if(fromUserId==toUserId){
      //   return res.status(400).json({
      //     message : "Connection request to self not possible"
      //   });
      // }
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status Type: " + status,
        });
      }

      //IF my "toUserId" ->user exists in my User collection or not.
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found!! ",
        });
      }

      //IF there is an existing ConnectionRequest in database
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Already sent or received connection request!! ",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      const emailRes = await sendEmail.run();

      console.log(emailRes);

      res.json({
        message: "Connection Request sent successfully",
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //Ayush is sending connection request to Himanshu. Only Himanshu can accept or reject the Ayush connection request.
      //  Validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status Type: " + status,
        });
      }

      // check if the requestId is present in our database or not.
      // is Himanshu loggedIn user => toUserId
      // if the existing connection request is only interested then only Himanshu can accept or reject the profile.
      // requestId should be valid (means present in our database).
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found!!" });
      }

      //Now i am safe to change the status.(accept/reject)
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
