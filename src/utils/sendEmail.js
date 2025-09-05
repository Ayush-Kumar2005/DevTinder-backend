const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

// Function to build email command
const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
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

// Run function
const run = async (toAddress, fromAddress, subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    toAddress,
    fromAddress,
    subject,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (error) {
    if (error.name === "MessageRejected") {
      console.error("MessageRejected:", error.message);
      return error;
    }
    console.error("SES Error:", error);
    throw error;
  }
};

module.exports = { run };
