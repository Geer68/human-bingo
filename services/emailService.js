import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../config/ses.js";

const getSocialMediaIcon = (type) => {
  switch (type) {
    case "twitter":
      return "";
    case "instagram":
      return '<img src="https://www.nerdconf.com/logos/instagram.svg" alt="Instagram" style="width:24px; height:24px; filter: invert(100%);"/>';
    case "facebook":
      return '<img src="https://www.nerdconf.com/logos/facebook.svg" alt="Facebook" style="width:24px; height:24px;"/>';
    default:
      return "";
  }
};

const renderUserContent = (user) => {
  if (typeof user === "object" && Object.keys(user).length > 0) {
    let socialType = "";
    let socialText = "";

    if (user.twitter) {
      socialType = "twitter";
      socialText = user.twitter;
    } else if (user.instagram) {
      socialType = "instagram";
      socialText = user.instagram;
    } else if (user.facebook) {
      socialType = "facebook";
      socialText = user.facebook;
    }

    return `<p style="color:#fff;">${`@${socialText}` || "No respondida"}</p>`;
  }
  return "<span style='color: #fff;'>No respondida</span>";
};

const createSendEmailCommand = (subject, body, toAddress, fromAddress) => {
  const mensaje = `
    <!doctype html>
    <html>
      <body>
        <div
          style='background-color:#f2f5f7;color:#242424;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
        >
          <table
            align="center"
            width="100%"
            style="margin:0 auto;max-width:600px;background-color:#0d0e0d"
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
          >
            <tbody>
              <tr style="width:100%">
                <td>
                  <div style="padding:24px 24px 24px 24px">
                    <a
                      href="https://nerdconf.com"
                      style="text-decoration:none"
                      target="_blank"
                    >
                      <img
                        alt="Marketbase"
                        src="https://www.nerdconf.com/nerdconfLogo.png"
                        style="outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;width:70px; height:70px;"
                      />
                    </a>
                  </div>
                  ${body.answers
                    .map((answer) => {
                      const userContent = renderUserContent(answer.user);
                      return `<div style="color:#fff; padding:0px 24px 24px 24px;">
                                <p style="color:#fff; margin-right: 8px;">${answer.pregunta}:</p>
                                  <div style="display: flex; align-items: center; ">
                                    <img src="https://www.nerdconf.com/logos/ig.png" alt="Instagram" style="width:24px; height:24px; filter: invert(100%);"/>
                                    ${userContent}
                                  </div>
                              </div>
                            `;
                    })
                    .join("")}
                  <div style="background-color:#00ffae;padding:16px 24px 16px 24px">
                    <div
                      style="color:#0d0e0d;font-size:13px;font-weight:bold;text-align:right;padding:16px 24px 16px 24px"
                    >
                      © ${new Date().getFullYear()} nerdconf
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>`;

  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: mensaje,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

// Función para enviar el correo
export const sendEmailToAddress = async (
  subject,
  body,
  toAddress,
  fromAddress
) => {
  const sendEmailCommand = createSendEmailCommand(
    subject,
    body,
    toAddress,
    fromAddress || "noreply@nerdconf.com"
  );

  try {
    console.log("Email sent to: ", toAddress);
    console.log("Email sent from: ", fromAddress);
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    console.error("Error sending email: ", caught);
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};
