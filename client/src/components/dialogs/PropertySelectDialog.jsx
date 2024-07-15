import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { useState } from 'react'
import { DialogContent } from '@mui/material'

export const PropertySelectDialog = ({
  openDialog,
  handleDialogState,
  handleOnSubmit,
  title,
}) => {
  const [propertyData, setPropertyData] = useState({
    inputValue: '',
  })

  const handleChange = e => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    handleOnSubmit(propertyData)
    handleDialogState()
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleDialogState}
        PaperProps={{
          component: 'form',
        }}
      >
        <DialogTitle>Add New {title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin='dense'
            id='inputValue'
            name='inputValue'
            value={propertyData.inputValue}
            onChange={handleChange}
            label='Add New Item'
            type='text'
            fullWidth
            variant='standard'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogState}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant='contained'>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PropertySelectDialog
