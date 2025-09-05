const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } =  require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1>Hello DevIndia Developer's</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is DevIndia email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "HELLO WORLD FROM SES",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "ayush26052005hjp@gmail.com",
    "kumar.ayushhh.05@gmail.com",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {

      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = {run};