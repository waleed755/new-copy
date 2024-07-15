export const getKeysFiles = async (req, res) => {
  const { data } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Creating a new Keys Files Data
    // res.json({ success: true, keysFiles: keysFiles })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getKeysFiles
