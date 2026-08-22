import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { TeamOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AdminDashboard() {
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-4">
        <Title level={4} className="m-0 text-gray-800">Dashboard Admin</Title>
        <Text className="text-gray-500">Selamat datang, Administrator. Berikut adalah ringkasan sistem.</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card hoverable className="border border-gray-100 shadow-sm rounded-xl">
            <Statistic title="Total Siswa" value={324} prefix={<TeamOutlined className="text-blue-500 mr-2" />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable className="border border-gray-100 shadow-sm rounded-xl">
            <Statistic title="Total Guru & Staf" value={45} prefix={<UserOutlined className="text-emerald-500 mr-2" />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable className="border border-gray-100 shadow-sm rounded-xl">
            <Statistic title="Total Kelas" value={12} prefix={<BookOutlined className="text-purple-500 mr-2" />} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
