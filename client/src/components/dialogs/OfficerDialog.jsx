import React from "react";
import { Modal, Button, Form, Input, DatePicker, Select, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import {
  getBranchApi,
  getPropertyStatusApi,
  getStaffApi,
} from "../../services/apiConstants";

const { TextArea } = Input;

const OfficerDialog = ({
  openDialog,
  handleDialogState,
  handleOnSubmit,
  selectedOfficer,
}) => {
  console.log("selectedCustomer", selectedOfficer);
  const [statusData, setStatusData] = useState(null);
  const { user } = useSelector((state) => state.user);
  const [branches, setBranches] = useState(null);

  const [form] = Form.useForm(); // Ant Design Form instance
  console.log("user", user);
  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      if (!values.accountStatusId) {
        const activeStatus = statusData?.find(
          (item) => item.label === "Active"
        );
        if (activeStatus) {
          values.statusId = activeStatus.value;
        }
      }

      const updatedCustomerData = {
        ...values,
        _id:selectedOfficer?._id


      };

      handleOnSubmit(updatedCustomerData);
      handleDialogState();
    });
  };
  const getBranchesData = async () => {
    try {
      const fetchRows = await getBranchApi();
      if (fetchRows.data.success) {
        const transformedData = fetchRows.data?.branches?.map((branch) => ({
          value: branch._id,
          label: branch.branchName,
        }));
        setBranches(transformedData);
        if (selectedOfficer) {
          const filteredBranchesData = fetchRows.data.branches?.filter(
            (item) => item?.customerId == selectedProperty?.customerId
          );
          const transformedData = filteredBranchesData?.map((branch) => ({
            value: branch._id,
            label: branch.branchName,
          }));
          setBranches(transformedData);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (selectedOfficer) {
      form.setFieldsValue({
        ...selectedOfficer,
        statusId: selectedOfficer?.staffStatus?.value,
        address:selectedOfficer?.staffAddress?.address,
        postCode:selectedOfficer?.staffAddress?.postCode,
        city:selectedOfficer?.staffAddress?.city,

      });
    } else {
      form.resetFields();
    }
  }, [selectedOfficer, form]);
  const getStatuses = async () => {
    try {
      const statuses = await getPropertyStatusApi();
      if (statuses.data.success) {
        const transformedData = statuses?.data?.statuses?.map((customer) => ({
          value: customer._id, // Assuming customer id as value
          label: customer.value, // Assuming customer name as label
        }));
        setStatusData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching property statuses:", error);
    }
  };

  useEffect(() => {
    getStatuses();
    getBranchesData();
  }, []);
  return (
    <Modal
      title={selectedOfficer ? "Edit Record" : "Add Record"}
      open={openDialog}
      onCancel={handleDialogState}
      footer={[
        <Button key="cancel" onClick={handleDialogState}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleFormSubmit}>
          {selectedOfficer ? "Update" : "Add"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{ accountCreatedDate: null }}
      >
        <Form.Item
          name="staffName"
          label="Partner Name"
          rules={[{ required: true, message: "Please enter Account Name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())}
          showSearch
          rules={[
            { required: true, message: "Please enter account branch name" },
          ]}
          name="branchId"
          label="Partner Branch"
        >
          <Select options={branches} />
        </Form.Item>

        <Form.Item
          name="staffEmail"
          label="Partner Email"
          rules={[
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item name="staffContact" label="Partner Contact">
          <Input />
        </Form.Item>
        <Form.Item name="statusId" label="Partner Status" colon={false}>
          <Select placeholder={"Active"} options={statusData} />
        </Form.Item>
        <Row
          gutter={24}
          className="rounded-lg shadow-lg p-3 border border-[#e5e5e5]"
        >
          <Col span={24}>
            <Col
              span={24}
              className="text-base font-medium text-center text-[#000000OD]"
            >
              Partner Address
            </Col>

            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Postcode" name="postCode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="City" name="city">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default OfficerDialog;
