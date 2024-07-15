import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config()

AWS.config.update({
  accessKeyId: `${process.env.AWS_ACCESS_KEY_ID_FOR_EMAIL}`,
  secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY_FOR_EMAIL}`,
  region: `${process.env.AWS_REGION_FOR_EMAIL}`,
})

// Create SES service object
const ses = new AWS.SES({ apiVersion: '2010-12-01' })

export const sendEmail = async (
  toAddressEmail,
  subjectData,
  bodyData,
  successMessage
) => {
  let params = {
    Source: 'no-reply@rapto.uk', // Ensure this email is verified in SES
    Destination: {
      ToAddresses: [toAddressEmail],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: bodyData,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subjectData,
      },
    },
  }

  try {
    // Send email
    await ses.sendEmail(params, (err, data) => {
      if (err) {
        console.log('error = ', err)
      } else {
        console.log(successMessage)
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export default sendEmail
