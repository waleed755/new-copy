import otpGenerator from 'otp-generator'

export const generateOTP = () => {
  const OTP = otpGenerator.generate(5, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  })

  return OTP
}

export default generateOTP
