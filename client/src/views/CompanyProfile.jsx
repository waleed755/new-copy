import React, { useState, useEffect, useMemo } from "react";
import { Form, Input, Button, Row, Col, Upload, Avatar, Divider, Typography, Select } from "antd";
import { UploadOutlined, BankOutlined, EditOutlined } from "@ant-design/icons";
import { getCompanyApi, updateCompanyApi } from "../services/apiConstants";
import countryList from 'react-select-country-list'
import moment from "moment";


const { Title } = Typography;
const { Option } = Select;

const CompanyProfile = () => {
  const [form] = Form.useForm();
  const [editableFields, setEditableFields] = useState({
    companyName: false,
    city: false,
    country: false,
    industry: false,
    postCode: false,
    streetAddress: false,
  });
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const options = useMemo(() => countryList().getData(), [])

  const toggleFieldEditability = (fieldName) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [fieldName]: !prevFields[fieldName],
    }));
  };

  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const companyId = user?.companyId;

  useEffect(() => {
    if (userString) {
      getCompanyApi(companyId).then((data) => {
        setCompanyData(data?.data?.company);
        form.setFieldsValue(data?.data?.company);
      });
    }
  }, [form, loading]);

  const handleSubmit = async (values) => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setLoading(true); // Set loading state to true
      const user = JSON.parse(userString);
      const companyId = companyData._id;
      await updateCompanyApi({ companyData: values }, companyId)
        .then((response) => {
          console.log("Company updated:", response);
          setEditableFields({
            companyName: false,
            city: false,
            country: false,
            industry: false,
            postCode: false,
            streetAddress: false,
          }); // Set all fields to non-editable after update
          // Handle success or error response
        })
        .finally(() => {
          getCompanyApi(companyId);
          setLoading(false); // Set loading state to false
        });
    }
  };

  const isAnyFieldEditable = Object.values(editableFields).some(
    (isEditable) => isEditable
  );

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ textAlign: "" }}>
        Company Profile
      </Title>
      {companyData && (
        <Row gutter={[16, 16]} justify="">
          <Col span={8} style={{ textAlign: "" }}>
            <Avatar size={120} icon={<BankOutlined />} src={companyData.logo} />
            <Upload showUploadList={false}>
              <Button icon={<UploadOutlined />} style={{ marginTop: "10px" }}>
                Change Logo
              </Button>
            </Upload>
          </Col>
        </Row>
      )}
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={companyData}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              {editableFields.companyName ? (
                <Input prefix={<BankOutlined />} />
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{companyData?.companyName}</span>
                  <EditOutlined
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => toggleFieldEditability("companyName")}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please enter city" }]}
            >
              {editableFields.city ? (
                <Input />
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{companyData?.city}</span>
                  <EditOutlined
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => toggleFieldEditability("city")}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: "Please enter country" }]}
            >
              {editableFields.country ? (
                <Select filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                  showSearch>
                  {options.map(option => (
                    <Option key={option.value} value={option.label}>
                      {option.label}
                    </Option>
                  ))}
                </Select>) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{companyData?.country}</span>
                  <EditOutlined
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => toggleFieldEditability("country")}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Industry"
              name="industry"
              rules={[{ required: true, message: "Please enter industry" }]}
            >
              {editableFields.industry ? (
                <Input />
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{companyData?.industry}</span>
                  <EditOutlined
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => toggleFieldEditability("industry")}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Post Code"
              name="postCode"
              rules={[{ required: true, message: "Please enter post code" }]}
            >
              {editableFields.postCode ? (
                <Input />
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{companyData?.postCode}</span>
                  <EditOutlined
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => toggleFieldEditability("postCode")}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Street Address"
              name="streetAddress"
              rules={[{ required: true, message: "Please enter street address" }]}
            >
              {editableFields.streetAddress ? (
                <Input />
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{companyData?.streetAddress}</span>
                  <EditOutlined
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => toggleFieldEditability("streetAddress")}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Created At" name="createdAt">
        <div>{companyData?.createdAt ? moment(companyData.createdAt).format('DD-MM-YYYY [at] HH:mm') : 'N/A'}</div>
        </Form.Item>
        {isAnyFieldEditable && (
          <Row>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Changes
                </Button>
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
};

export default CompanyProfile;
