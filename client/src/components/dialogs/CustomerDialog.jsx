import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { useSelector } from 'react-redux';
import { getPropertyStatusApi } from '../../services/apiConstants';

const { TextArea } = Input;

const CustomerDialog = ({
  openDialog,
  handleDialogState,
  handleOnSubmit,
  selectedCustomer,
}) => {
  console.log('selectedCustomer', selectedCustomer);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading status
  const { user } = useSelector(state => state.user);
  const [form] = Form.useForm(); // Ant Design Form instance
  console.log('user', user);

  const handleFormSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true); // Set loading to true when form is submitted

      if (!values.accountStatusId) {
        const activeStatus = statusData?.find(item => item.label === 'Active');
        if (activeStatus) {
          values.accountStatusId = activeStatus.value;
        }
      }

      const updatedCustomerData = {
        ...values,
        customerId: selectedCustomer?._id,
      };

      handleOnSubmit(updatedCustomerData)
        .then(() => {
          setLoading(false); // Set loading to false after submission
          handleDialogState(); // Close the modal
        })
        .catch(() => {
          setLoading(false); // Set loading to false if there's an error
        });
    });
  };

  console.log('selectedCustomer.accountStatus', selectedCustomer?.accountStatus);
  useEffect(() => {
    if (selectedCustomer) {
      form.setFieldsValue({
        ...selectedCustomer,
        accountStatusId: selectedCustomer?.accountStatus?.id,
      });
    } else {
      form.resetFields();
    }
  }, [selectedCustomer, form]);

  const getStatuses = async () => {
    try {
      const statuses = await getPropertyStatusApi();
      if (statuses.data.success) {
        const transformedData = statuses?.data?.statuses?.map(customer => ({
          value: customer._id, // Assuming customer id as value
          label: customer.value, // Assuming customer name as label
        }));
        setStatusData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching property statuses:', error);
    }
  };

  useEffect(() => {
    getStatuses();
  }, []);

  return (
    <Modal
      title={selectedCustomer ? 'Edit Customer' : 'Add Customer'}
      open={openDialog}
      onCancel={handleDialogState}
      footer={[
        <Button key='cancel' onClick={handleDialogState}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleFormSubmit} loading={loading}>
          {selectedCustomer ? 'Update' : 'Add'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFormSubmit}
        initialValues={{ accountCreatedDate: null }}
      >
        <Form.Item
          name='accountName'
          label='Name'
          rules={[{ required: true, message: 'Please enter account name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, message: 'Please enter branch name' }]}
          name='accountBranch'
          label='Branch'
        >
          <Input />
        </Form.Item>

        <Form.Item name='accountId' label='ID'>
          <Input autoFocus />
        </Form.Item>

        <Form.Item name='accountEmail' label='Email'>
          <Input type='email' />
        </Form.Item>

        <Form.Item name='accountContact' label='Contact'>
          <Input />
        </Form.Item>

        <Form.Item name='accountAddress' label='Address'>
          <Input />
        </Form.Item>

        <Form.Item name='accountNotes' label='Notes'>
          <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>

        <Form.Item name='accountStatusId' label='Status' colon={false}>
          <Select placeholder={'Active'} options={statusData} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomerDialog;
