import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesConfig";

// subject: string,
// body: Array<string>,
// toAddress: string,
// fromAddress: string
const createSendEmailCommand = (subject, body, toAddress, fromAddress) => {
  const mensaje = `
          <!doctype html>
          <html>
            <body>
              <div
                style='background-color:#F2F5F7;color:#242424;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
              >
                <table
                  align="center"
                  width="100%"
                  style="margin:0 auto;max-width:600px;background-color:#FFFFFF"
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
                            href="https://psiuniverse.com"
                            style="text-decoration:none"
                            target="_blank"
                            ><img
                              alt="Marketbase"
                              src="https://www.psiuniverse.com/logoNegativo.png"
                              style="outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:24px;max-height:24px;border-radius:50%;"
                          /></a>
                        </div>
                        ${body
                          .map((bodyText) => {
                            return `<div style="font-weight:normal;padding:0px 24px 16px 24px">${bodyText}</div>`;
                          })
                          .join("")}
                        <div style="background-color:#7643BE;padding:16px 24px 16px 24px">
                          <div
                            style="color:#ffffff;font-size:13px;font-weight:bold;text-align:right;padding:16px 24px 16px 24px"
                          >
                            © ${new Date().getFullYear()} psi•universe
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
      ToAddresses: [toAddress, "psi.universe.uy@gmail.com"],
    },
    Message: {
      Body: {
        // Text: {
        //   Charset: "UTF-8",
        //   Data: body,
        // },
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

export const sendEmail = async (subject, body, toAddress, fromAddress) => {
  const sendEmailCommand = createSendEmailCommand(
    subject,
    body,
    toAddress,
    fromAddress || "soporte@psiuniverse.com"
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};
