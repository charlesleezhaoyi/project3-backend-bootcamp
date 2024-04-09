const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

const mailjetRequest = mailjet.post("send", { version: "v3.1" });

exports.sendMail = async (req, res) => {
  const { to, from, subject, text } = req.body;

  mailjetRequest.request({
    Messages: [
      {
        From: {
          Email: from,
          Name: "",
        },
        To: [
          {
            Email: to,
            Name: "",
          },
        ],
        Subject: "Book request accepted notification",
        TextPart: text,
      },
    ],
  });

  try {
    const result = await mailjetRequest;
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};
