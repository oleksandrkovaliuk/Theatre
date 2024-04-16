const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const mailOptions = ({ userEmail, userName, ticket }) => {
  return {
    form: process.env.EMAIL,
    to: userEmail,
    subject: `Hi ${userName} , it is Teater here is your ticket.`,
    html: `${ticket}`,
  };
};

const sendTicket = (req, res) => {
  const { username, email, ticket } = req.body;
  console.log("hello");
  console.log(ticket, "ticket");
  try {
    if (username && email && ticket) {
      const mailOpt = mailOptions({
        userEmail: email,
        userName: username,
        ticket: ticket,
      });
      transporter.sendMail(mailOpt, (err, info) => {
        if (err) {
          return res
            .status(401)
            .json({ errorText: "failed with sending email" });
        } else {
          console.log("good");
          return res.status(200).json({
            text: `email with your ticket succesfully sent on ${email}`,
          });
        }
      });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ errorText: "failed with getting info for sending email" });
  }
};
module.exports = sendTicket;
