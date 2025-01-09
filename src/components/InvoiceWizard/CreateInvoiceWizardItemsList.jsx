import React, { useState } from 'react';
import { Button, Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../assets/styles/CreateInvoiceWizardItemsList.scss';
import InvoiceItemsList from '../Invoice/AddCustomItemComponent';

function CreateInvoiceWizardItemsList({ items, onAddItem, onRemoveItem }) {
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleRemoveItem = (index) => {
    onRemoveItem(index); 
  };

  return (
    <div>
      <h5 className="section-title">Invoice Items</h5>

      <div className="d-flex justify-content-end align-items-start mt-4">
        <Button variant="contained" color="primary" onClick={handleModalShow}>
          Add
        </Button>
      </div>
      <div className="card-list">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div className="item-card" key={index}>
              <span className="item-name">{item.name}</span>
              <span className="item-price">${item.price}</span>
              <span className="item-quantity">{item.quantity}</span>
              <IconButton
                color="secondary"
                onClick={() => handleRemoveItem(index)}
                className="remove-button"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))
        ) : (
          <p className="text-center">Add Items!</p>
        )}
      </div>



      <Modal open={showModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vw',
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: '1vw',
            boxShadow: 24,
            p: '2vh',
            position: 'relative'
          }}
        >
          <IconButton
            onClick={handleModalClose}
            sx={{
              position: 'absolute',
              top: '1vh',
              right: '1vw'
            }}
          >
            <CloseIcon />
          </IconButton>
          <InvoiceItemsList onAddItem={onAddItem} />
        </Box>
      </Modal>
    </div>
  );
}

export default CreateInvoiceWizardItemsList;