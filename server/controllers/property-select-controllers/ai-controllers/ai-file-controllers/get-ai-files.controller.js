export const getAIFiles = async (req, res) => {
  const { data } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Creating a new AI Files Data
    // res.json({ success: true, aiFiles: aiFiles })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAIFiles
