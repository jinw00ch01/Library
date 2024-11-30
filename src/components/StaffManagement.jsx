import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Alert } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getStaffs();
      console.log('Fetched staff data:', response);
      if (response.success && response.staffs) {
        setStaffList(response.staffs);
      } else {
        setError('직원 데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching staff list:', error);
      setError('직원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    form.setFieldsValue(staff);
    setIsEditModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await adminService.updateStaff(selectedStaff.staff_ID, values);
      message.success('직원 정보가 수정되었습니다.');
      setIsEditModalVisible(false);
      fetchStaffList();
    } catch (error) {
      message.error('직원 정보 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (staffId) => {
    try {
      await adminService.deleteStaff(staffId);
      message.success('직원 정보가 삭제되었습니다.');
      fetchStaffList();
    } catch (error) {
      message.error('직원 정보 삭제에 실패했습니다.');
    }
  };

  const columns = [
    {
      title: '직원 ID',
      dataIndex: 'staff_ID',
      key: 'staff_ID',
    },
    {
      title: '이름',
      dataIndex: 'staff_name',
      key: 'staff_name',
    },
    {
      title: '직급',
      dataIndex: 'staff_classification',
      key: 'staff_classification',
    },
    {
      title: '이메일',
      dataIndex: 'staff_email',
      key: 'staff_email',
    },
    {
      title: '연락처',
      dataIndex: 'staff_number',
      key: 'staff_number',
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <ButtonGroup>
          <Button onClick={() => handleEdit(record)}>수정</Button>
          <Button danger onClick={() => handleDelete(record.staff_ID)}>삭제</Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <Container>
      <h2>직원 데이터 관리</h2>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      <Table
        columns={columns}
        dataSource={staffList}
        rowKey="staff_ID"
        loading={loading}
      />

      <Modal
        title="직원 정보 수정"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            name="staff_name"
            label="이름"
            rules={[{ required: true, message: '이름을 입력해주세요' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="staff_classification"
            label="직급"
            rules={[{ required: true, message: '직급을 선택해주세요' }]}
          >
            <Select>
              <Select.Option value="사원">사원</Select.Option>
              <Select.Option value="대리">대리</Select.Option>
              <Select.Option value="과장">과장</Select.Option>
              <Select.Option value="차장">차장</Select.Option>
              <Select.Option value="부장">부장</Select.Option>
              <Select.Option value="사장">사장</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="staff_email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력해주세요' },
              { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="staff_number"
            label="연락처"
            rules={[{ required: true, message: '연락처를 입력해주세요' }]}
          >
            <Input />
          </Form.Item>

          <ButtonGroup>
            <Button type="primary" htmlType="submit">
              저장
            </Button>
            <Button onClick={() => setIsEditModalVisible(false)}>
              취소
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export default StaffManagement; 