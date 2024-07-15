import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { useSelector } from 'react-redux';
import { getCustomerNamesApi, getPropertyStatusApi } from '../../services/apiConstants';

const { Option } = Select;
const { TextArea } = Input;

const BranchDialog = ({
  openDialog,
  handleDialogState,
  handleOnSubmit,
  selectedBranch,
}) => {
  const [statusData, setStatusData] = useState(null);
  const [customerNames, setCustomerNames] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading status
  const { user } = useSelector(state => state.user);
  const [form] = Form.useForm();

  console.log('selectedBranch = ', selectedBranch);
  console.log('user', user);

  const handleFormSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true); // Set loading to true when form is submitted

      if (!values.branchStatusId) {
        const activeStatus = statusData?.find(item => item.label === 'Active');
        if (activeStatus) {
          values.branchStatusId = activeStatus.value;
        }
      }

      const updatedBranchData = {
        ...values,
        _id: selectedBranch?._id,
      };

      handleOnSubmit(updatedBranchData).then(() => {
        setLoading(false); // Set loading to false after submission
        handleDialogState(); // Close the modal
      }).catch(() => {
        setLoading(false); // Set loading to false if there's an error
      });
    });
  };

  useEffect(() => {
    if (selectedBranch) {
      form.setFieldsValue({
        ...selectedBranch,
        branchStatusId: selectedBranch.branchStatus?.id,
      });
    } else {
      form.resetFields();
    }
  }, [selectedBranch, form]);

  const getStatuses = async () => {
    try {
      const statuses = await getPropertyStatusApi();
      if (statuses.data.success) {
        const transformedData = statuses?.data?.statuses?.map(customer => ({
          value: customer._id,
          label: customer.value,
        }));
        setStatusData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching property statuses:', error);
    }
  };

  useEffect(() => {
    const fetchRows = async () => {
      try {
        const response = await getCustomerNamesApi();
        if (response.data.success) {
          const transformedData = response.data.customers.map(customer => ({
            value: customer._id,
            label: `${customer.accountName} - ${customer._id.replace(/\D/g, '').substring(0, 4)}`,
          }));
          setCustomerNames(transformedData);
        }
      } catch (error) {
        console.error('Error fetching customer names:', error);
      }
    };
    getStatuses();
    fetchRows();
  }, []);

  return (
    <Modal
      title={selectedBranch ? 'Edit Branch' : 'Add Branch'}
      open={openDialog}
      onCancel={handleDialogState}
      footer={[
        <Button key='cancel' onClick={handleDialogState}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleFormSubmit} loading={loading}>
          {selectedBranch ? 'Update' : 'Add'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFormSubmit}
        initialValues={{
          branchCreatedDate: null,
          branchStatus: statusData?.find(item => item?.label == 'Active')?.value,
        }}
      >
        <Form.Item
          name='customerId'
          label='Select Customer'
          rules={[{ required: true, message: 'Please select customer' }]}
        >
          <Select
            filterOption={(input, option) =>
              (option?.label?.toLowerCase() ?? '').includes(input?.toLowerCase())
            }
            showSearch
            options={customerNames}
          />
        </Form.Item>

        <Form.Item
          name='branchName'
          label='Branch'
          rules={[{ required: true, message: 'Please enter branch name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name='branchId' label='ID'>
          <Input autoFocus />
        </Form.Item>

        <Form.Item name='branchEmail' label='Email'>
          <Input type='email' />
        </Form.Item>

        <Form.Item name='branchContact' label='Contact'>
          <Input />
        </Form.Item>

        <Form.Item name='branchAddress' label='Address'>
          <Input />
        </Form.Item>

        <Form.Item name='branchNotes' label='Notes'>
          <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>

        <Form.Item name='branchStatusId' label='Status' colon={false}>
          <Select placeholder={'Active'} options={statusData} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BranchDialog;
