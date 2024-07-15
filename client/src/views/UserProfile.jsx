import React, { useState, useEffect } from "react";
import { Row, Col, Avatar, Card, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getSingleUserApi } from "../services/apiConstants";

const { Title, Text } = Typography;

const UserProfile = () => {
  const [userData, setUserData] = useState(null);

  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const userId = user?._id;

  useEffect(() => {
    if (userString) {
      getSingleUserApi(userId).then((data) => {
        setUserData(data?.data?.user);
      });
    }
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <Title level={2} style={{ textAlign: "left", marginBottom: 40 }}>User Profile</Title>
      {userData && (
        <Card bordered={false} style={{ borderRadius: 10, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <Row gutter={[32, 32]} justify="center">
            <Col>
              <Avatar size={120} icon={<UserOutlined />} src={userData.avatar} />
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col span={12}>
              <Text strong>Name:</Text>
              <p>{userData.fullName}</p>
            </Col>
            <Col span={12}>
              <Text strong>Email:</Text>
              <p>{userData.email}</p>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>Role:</Text>
              <p>{userData.role}</p>
            </Col>
            <Col span={12}>
              <Text strong>Job:</Text>
              <p>{userData.job}</p>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
