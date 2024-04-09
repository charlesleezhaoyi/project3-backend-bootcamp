const { Router } = require("express");

const router = Router();

const mailjetService = require("../middlewares/mailjetService");

router.post("/send-mailjet", async (req, res) => {
  try {
    const response = await mailjetService.sendMail(req, res);
    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Email not sent",
    });
  }
});

module.exports = router;
