const nodemailer = require("nodemailer");
// const pool = require('../Model/DB_connection');
const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");

dotenv.config();

exports.sendMail = async (result) => {
  try {
    // Construct the email content with a colorful, modern design
    let mailContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .email-wrapper {
                    max-width: 700px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #2c3e50;
                    text-align: center;
                    font-size: 28px;
                    margin-bottom: 20px;
                }
                ul {
                    padding: 0;
                    list-style-type: none;
                }
                li {
                    background-color: #ecf0f1;
                    border-radius: 5px;
                    margin: 10px 0;
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
                }
                .label {
                    font-weight: bold;
                    color: #2980b9;
                    text-transform: uppercase;
                }
                .content {
                    color: #34495e;
                    font-style: italic;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #7f8c8d;
                }
                .email-footer {
                    font-size: 12px;
                    margin-top: 20px;
                    text-align: center;
                    color: #7f8c8d;
                }
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #2980b9;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 15px;
                }
                .btn:hover {
                    background-color: #3498db;
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <h2>${ `Get in Touch With ${result.email} `}</h2>
                <ul>
                    <li>
                        <span class="label">Name:</span> <span class="content">${result.name}</span>
                    </li>
                    <li>
                        <span class="label">Email:</span> <span class="content">${result.email}</span>
                    </li>
                    <li>
                        <span class="label">Message:</span> <span class="content">${result.message}</span>
                    </li>
                    <li>
                        <span class="label">Number:</span> <span class="content">${result.number}</span>
                    </li>
                    <li>
                        <span class="label">Type:</span> <span class="content">${result.type}</span>
                    </li>
                </ul>
                <div class="email-footer">
                    <p>This email was generated by your database system.</p>
                    <a class="btn" href="#">View More Details</a>
                </div>
            </div>
        </body>
        </html>
        `;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env["EMAIL_HOST"],
      port: process.env["EMAIL_PORT"],
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Setup email data
    const mailOptions = {
      from: result.email ,
      to: process.env.EMAIL_TO, // Add recipient email here
      subject: `Get in Touch With ${result.email} `,
      html: mailContent, // Use HTML for rich formatting
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

exports.sendMailforResetPassword = async (email,resetToken) => {
    // console.log(resetToken);
    return new Promise(async (resolve, reject) => {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env["EMAIL_HOST"],
          port: process.env["EMAIL_PORT"],
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        // Email HTML template
        const mailContent = `
              <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html dir="ltr" lang="en">
          <head>
            <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
            <meta name="x-apple-disable-message-reformatting" />
          </head>
          <body
            style="
              background-color: #ffffff;
              margin: 0 auto;
              font-family: Arial, sans-serif;
            "
          >
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              style="max-width: 600px; margin: 0 auto"
            >
              <tr>
                <td style="text-align: center; padding: 20px 0">
                  <img
                    src="https://enrich12.netlify.app/assets/logo-qxzcuzYY.png"
                    height="50"
                    alt="Evvi Solutions"
                  />
                </td>
              </tr>
              <tr>
                <td
                  style="
                    background-color: #f7f7f7;
                    padding: 30px;
                    text-align: left;
                    border-radius: 8px;
                  "
                >
                  <h1 style="color: #333; font-size: 24px">Reset your password</h1>
                  <p style="font-size: 16px; color: #555; line-height: 1.6">
                    We received a request to reset the password associated with your
                    email. If you made this request, please click the button below to
                    reset your password:
                  </p>
                  <div style="text-align: center; margin: 20px 0">
                    <a
                      href="https://www.evvisolutions.com//resetPassword?token=${resetToken}"
                      style="
                        background-color: #4caf50;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-radius: 5px;
                        text-decoration: none;
                      "
                      >Reset Password</a
                    >
                  </div>
                  <p style="font-size: 14px; color: #999">
                    If you did not request a password reset, you can safely ignore this
                    email.
                  </p>
                  <p style="font-size: 12px; color: #999; margin-top: 20px">
                    ©2024 Evvi Solutions Private Limited, TCE - TBI, Thiyagarajar
                    Advanced Research Centre, Thiruparankundram, Madurai-625015. All
                    rights reserved.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="text-align: center; padding-top: 20px">
                  <a
                    href="https://www.evvisolutions.com/Blog"
                    style="color: #b7b7b7; text-decoration: underline"
                    >Our blog</a
                  >
                </td>
              </tr>
              <tr>
                <td style="text-align: center; padding-top: 20px">
                  <div style="display: flex; justify-content: center;">
                    <div>
                      <a
                        href="https://www.facebook.com/evvisolutions"
                        style="margin-right: 15px"
                      >
                        <img
                          src="https://react-email-demo-hbzssj3q3-resend.vercel.app/static/slack-facebook.png"
                          alt="Facebook"
                          width="32"
                          height="32"
                        />
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://twitter.com/evvisolutions"
                        style="margin-right: 15px"
                      >
                        <img
                          src="https://react-email-demo-hbzssj3q3-resend.vercel.app/static/slack-twitter.png"
                          alt="Twitter"
                          width="32"
                          height="32"
                        />
                      </a>
                    </div>
                    <div>
                      <a href="https://www.linkedin.com/company/evvisolutions">
                        <img
                          src="https://react-email-demo-hbzssj3q3-resend.vercel.app/static/slack-linkedin.png"
                          alt="LinkedIn"
                          width="32"
                          height="32"
                        />
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>`;
  
        // Send email
        let info = await transporter.sendMail({
          from: "enrich@evvisolutions.com", // sender address
          to:  email, // recipient address
          subject: "Reset Your Password-Regards", // Subject line
          html: mailContent, // email body (HTML)
        });
  
        resolve(info); // Resolves when email is successfully sent
      } catch (error) {
        reject(error); // Rejects on error
      }
    });
  };


// Function to send a single email
exports.sendBulkMail = async ({to, subject, content})=> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env["EMAIL_HOST"],
        port: process.env["EMAIL_PORT"],
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_TO, // sender address
            to:to, // recipient address
            subject:"test", // email subject
            text: content, // plain text body
            html: `<p>${content}</p>` // HTML body
        });

        return 'success';
    } catch (err) {
        console.error(`Failed to send email to ${to}:`, err);
        return 'failed';
    }
}
exports.sendEmailforAppointments = async(frommail,recipient, subject, templateData, templateName) => {

    
  const transporter = nodemailer.createTransport({
      host: process.env["EMAIL_HOST"],
      port: process.env["EMAIL_PORT"],
      secure: true,
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
      },
  });   // Define the path to your HTML templates
  const templatePath = path.join(__dirname, `../Email_Template/${templateName}.html`);

  // Read the template file
  fs.readFile(templatePath, 'utf8', (err, html) => {
      if (err) {
          console.error('Error reading email template:', err);
          return;
      }

      // Replace placeholders in the template with actual data
      const emailHtml = html
          .replace(/\${name}/g, templateData.name)
          .replace(/\${email}/g, templateData.email)
          .replace(/\${number}/g, templateData.number)
          .replace(/\${age}/g, templateData.age)
          .replace(/\${selectedAssessment}/g, templateData.selectedAssessment)
          .replace(/\${selectDate}/g, templateData.selectDate)            
          // .replace(/\${paymentMethod}/g, templateData.paymentMethod)
          .replace(/\${paymentDetails}/g, templateData.paymentDetails)
          .replace(/\${slots}/g, templateData.slots);
         

      // Set up email data
      const mailOptions = {
          from:frommail ,
          to: recipient,
          subject: subject,
          html: emailHtml // Send the HTML content
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.error('Error sending email:', error);
          }
          console.log('Email sent:', info.response);
      });
}
)};


// module.exports = { sendMail,sendBulkMail };
