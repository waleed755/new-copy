import React, { useState } from 'react';
import { Modal, Input, Form, Row, Col, Button } from 'antd';

const AddFieldModal = ({ currentfield, disabled, visible, onCreate, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    setLoading(true);
    await onCreate(formData);
    setFormData({});
    setLoading(false);
  };
  function camelCaseToTitleCase(camelCaseStr) {
    // Insert spaces before each uppercase letter
    let titleCaseStr = camelCaseStr.replace(/([A-Z])/g, ' $1');
    
    // Capitalize the first letter of each word
    titleCaseStr = titleCaseStr.replace(/\b\w/g, char => char.toUpperCase());
    
    // Trim any leading spaces
    return titleCaseStr.trim();
  }
  return (
    <Modal
      width={'50%'}
      maskClosable={false}
      open={visible}
      title={
        currentfield === 'propertyPointOfContact'
          ? 'Add New Point of Contact'
          : currentfield === 'propertyKeys'
          ? `Add New ${camelCaseToTitleCase(currentfield)}`
          : `Add New ${camelCaseToTitleCase(currentfield)}`
      }
      footer={null}
    >
      {currentfield === 'propertyPointOfContact' ? (
        <Form
          name="contactForm"
          initialValues={formData}
          onFinish={handleOk}
          layout={'vertical'}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input
              placeholder="Enter name"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
          >
            <Input
              placeholder="Enter address"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Postcode"
                name="postCode"
              >
                <Input
                  placeholder="Enter postcode"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, postCode: e.target.value }))
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
              >
                <Input
                  placeholder="Enter city"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Contact No."
                name="contact"
              >
                <Input
                  placeholder="Enter Contact Number"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contact: e.target.value }))
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please enter email' }]}
              >
                <Input
                  placeholder="Enter Email"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className='flex justify-end'>
            <Button type="primary" htmlType="submit" loading={loading || disabled} disabled={disabled}>
              Add
            </Button>
            <Button type="default" onClick={onCancel} style={{ marginLeft: '8px' }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          name="valueForm"
          initialValues={formData}
          onFinish={handleOk}
        >
          <Form.Item
            label=""
            name="name"
            rules={[{ required: true, message: 'Please type something' }]}
          >
            <Input
              placeholder="Type ..."
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item className='flex justify-end'>
            <Button type="primary" htmlType="submit" loading={loading || disabled} disabled={disabled}>
              Add
            </Button>
            <Button type="default" onClick={onCancel} style={{ marginLeft: '8px' }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AddFieldModal;
