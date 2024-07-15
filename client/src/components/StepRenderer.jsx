import React from "react";
import { Row, Col, Form, Input, Select, DatePicker, Divider, Upload, Switch, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const StepRenderer = ({
  currentStep,
  form,
  formData,
  handleAddButtonClick,
  handleCustomerChange,
  handleSwitchChange,
  handleServiceSelect,
  data,
  selectedServices,
  isSwitchChecked,
}) => {
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const preventMinus = (e) => {
    if (e.code === "Minus" || e.key == "e" || e.key == "E") {
      e.preventDefault();
    }
  };

  const renderStep1 = () => (
    <Row gutter={24} className="justify-between rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Branch Information
      </Col>
      <Col span={12}>
        <Form.Item
          label="Customer Name"
          name="customerId"
          rules={[{ required: true, message: "Please select customer" }]}
        >
          <Select
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())}
            showSearch
            options={data.customersData}
            onChange={handleCustomerChange}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Branch Name"
          name="branchId"
          rules={[{ required: true, message: "Please select branch" }]}
        >
          <Select
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())}
            showSearch
            allowClear
            options={data.branches}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep2 = () => (
    <Row gutter={24} className="justify-between rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Property Information
      </Col>
      <Col span={11}>
        <Form.Item label="Property ID" name="propertyId">
          <Input />
        </Form.Item>
      </Col>
      <Col span={11}>
        <Form.Item label="Property Reference" name="propertyReference">
          <Input />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Property Name"
          name="propertyName"
          rules={[{ required: true, message: "Please input Property Name!" }]}
        >
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep3 = () => (
    <Row gutter={24} className="rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24}>
        <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
          Address
        </Col>
        <Form.Item label="Property Address" name="address">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Property Postcode" name="postCode">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Property City" name="city">
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep4 = () => (
    <Row gutter={24} className="justify-between rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Basic Details
      </Col>
      <Col span={12}>
        <Form.Item label="Property Type" name="typeId">
          <Select
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())}
            showSearch
            options={data.types}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "flex-start", padding: "4px 8px" }}>
                  <Button type="text" onClick={() => handleAddButtonClick("propertyType")}>
                    + Add
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Property Category" name="categoryId">
          <Select
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())}
            showSearch
            options={data.categories}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "flex-start", padding: "4px 8px" }}>
                  <Button type="text" onClick={() => handleAddButtonClick("propertyCategory")}>
                    + Add
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item colon={false} label="Property Status" name="statusId">
          <Select placeholder="Active" options={data.statusData} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="AI"
          name="aiID"
          rules={[{ required: false, message: "Please select AI" }]}
        >
          <Select
            filterOption={(input, option) => (option?.label ?? "").includes(input)}
            showSearch
            options={data.aiData}
            onChange={(value) => form.setFieldsValue({ aiID: value })}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep5 = () => (
    <Row gutter={24} className="justify-between rounded-lg  p-3 border border-[#e5e5e5] mb-4 ">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Dates
      </Col>
      <Col span={11}>
        <Form.Item
          rules={[{ required: true, message: "Please input Property Start Date!" }]}
          label="Property Start Date"
          name="propertyStartDate"
        >
          <DatePicker
            defaultValue={dayjs()}
            format={"DD-MM-YYYY"}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
      <Col span={11}>
        <Form.Item label="Property Finish Date" name="propertyFinishDate">
          <DatePicker
            format={"DD-MM-YYYY"}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep6 = () => (
    <Row gutter={24} className="justify-between rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Point of Contact
      </Col>
      <Col span={24}>
        <Form.Item
          rules={[{ required: true, message: "Please add at least one point of contact" }]}
          label="Point of Contact"
          name="pointOfContact"
        >
          <Select
            showSearch
            options={data.pointOfContactData}
            mode="multiple"
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "flex-start", padding: "4px 8px" }}>
                  <Button type="text" onClick={() => handleAddButtonClick("propertyPointOfContact")}>
                    + Add
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep7 = () => (
    <Row gutter={24} className="rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Key Information
      </Col>
      <Col span={12}>
        <Form.Item
          label="Key Type"
          name="keysId"
          rules={[{ required: false, message: "Please select key type" }]}
        >
          <Select
            filterOption={(input, option) => (option?.label ?? "").includes(input)}
            showSearch
            options={data.keysData}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "flex-start", padding: "4px 8px" }}>
                  <Button type="text" onClick={() => handleAddButtonClick("propertyKeys")}>
                    + Add
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Key Value"
          name="propertyKeyValue"
          rules={[{ required: false, message: "Please enter a key value" }]}
        >
          <Input placeholder="Enter Property Key value" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name="keyImages" className="" label="Upload Key Images">
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            accept=".png,.jpeg,.jpg"
            multiple
          >
            {uploadButton}
          </Upload>
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep8 = () => (
    <Row gutter={24} className="rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Additional Information
      </Col>
      <Col span={24}>
        <Form.Item
          label="Retainer"
          name="propertyChargeable"
          valuePropName="checked"
        >
          <Switch
            defaultChecked={isSwitchChecked}
            checked={isSwitchChecked}
            onChange={handleSwitchChange}
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        </Form.Item>
      </Col>
      {isSwitchChecked && (
        <>
          <Col span={12}>
            <Form.Item
              rules={[{ required: true, message: "Please input subscription type" }]}
              label="Subscription Type"
              name="subscriptionFeeId"
            >
              <Select
                filterOption={(input, option) =>
                  (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())
                }
                showSearch
                options={data.subscriptionsData}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              rules={[{ required: true, message: "Please input subscription value" }]}
              label="Subscription Charges"
              name="propertySubscriptionFeeValue"
            >
              <Input min="0" onKeyDown={preventMinus} type="number" />
            </Form.Item>
          </Col>
        </>
      )}
      <Col span={12}>
        <Form.Item
          label="Internal Notes"
          name="propertyInternalNotes"
          rules={[{ required: false, message: "Please enter internal notes" }]}
        >
          <Input.TextArea placeholder="Enter internal notes" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="External Notes"
          name="propertyExternalNotes"
          rules={[{ required: false, message: "Please enter external notes" }]}
        >
          <Input.TextArea placeholder="Enter external notes" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Flat Fee Service"
          name="propertyFlatFeeService"
        >
          <Select
            filterOption={(input, option) =>
              (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())
            }
            showSearch
            mode="multiple"
            options={data.flatServiceFeeData}
            onChange={handleServiceSelect}
          />
        </Form.Item>
        {selectedServices?.map((service) => (
          <Row key={service} gutter={16}>
            <Col span={7} className="flex items-center">
              <p className="text-base font-medium flex items-center">
                {`${data.flatServiceFeeData?.find((item) => item?.value === service)?.label}`}
              </p>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Initial Time (mins)"
                name={`${service}_initialTimeMinutes`}
                onKeyDown={preventMinus}
              >
                <Input min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Initial Time Fees"
                name={`${service}_initialTimeFees`}
                onKeyDown={preventMinus}
              >
                <Input min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Additional Time (mins)"
                name={`${service}_additionalTimeMinutes`}
                onKeyDown={preventMinus}
              >
                <Input min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Additional Time Fees"
                name={`${service}_additionalTimeFees`}
                onKeyDown={preventMinus}
              >
                <Input min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );

  switch (currentStep) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    case 3:
      return renderStep3();
    case 4:
      return renderStep4();
    case 5:
      return renderStep5();
    case 6:
      return renderStep6();
    case 7:
      return renderStep7();
    case 8:
      return renderStep8();
    default:
      return null;
  }
};

export default StepRenderer;
