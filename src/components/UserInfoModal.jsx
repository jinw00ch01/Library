import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Button, Form, Input, Select, DatePicker, message } from 'antd';
import { userService } from '../services/api';
import dayjs from 'dayjs';
import styled from 'styled-components';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});

const UserInfoModal = ({ visible, onClose, userType, userId, onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && userId && userType) {
      fetchUserInfo();
    }
  }, [visible, userId, userType]);

  const fetchUserInfo = async () => {
    try {
      const response = await userService.getUserInfo(userType, userId);
      setUserInfo(response.userInfo);
    } catch (error) {
      message.error('사용자 정보를 불러오는 데 실패했습니다.');
    }
  };

  const handleEdit = () => {
    form.setFieldsValue({
      ...userInfo,
      ...(userType === 'customer' && {
        Customer_birthdate: userInfo.Customer_birthdate ? dayjs(userInfo.Customer_birthdate) : undefined,
      }),
    });
    setIsEditMode(true);
  };

  const handleUpdate = async (values) => {
    try {
      let updateData = { ...values };

      if (userType === 'customer') {
        updateData = {
          ...values,
          Customer_birthdate: values.Customer_birthdate
            ? values.Customer_birthdate.format('YYYY-MM-DD')
            : null,
        };
      }

      await userService.updateUserInfo(userType, userId, updateData);
      message.success('정보가 수정되었습니다.');
      setIsEditMode(false);
      fetchUserInfo();
    } catch (error) {
      message.error('정보 수정에 실패했습니다.');
      console.error('정보 수정 오류:', error);
    }
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: userType === 'customer' ? '회원 탈퇴' : '직원 정보 삭제',
      content: '정말 삭제 하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          if (userType === 'customer') {
            await userService.deleteCustomer(userId);
            message.success('회원 탈퇴가 완료되었습니다.');
          } else {
            await userService.deleteStaff(userId);
            message.success('직원 정보가 삭제되었습니다.');
          }
          onLogout();
        } catch (error) {
          if (userType === 'customer') {
            message.error('회원 탈퇴에 실패하였습니다.');
          } else {
            message.error('직원 정보 삭제에 실패하였습니다.');
          }
          console.error('삭제 오류:', error);
        }
      },
    });
  };

  const renderUserInfo = () => {
    if (!userInfo) return null;

    if (userType === 'customer') {
      return (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="이름">{userInfo.Customer_name}</Descriptions.Item>
          <Descriptions.Item label="아이디">{userInfo.Customer_InfoID}</Descriptions.Item>
          <Descriptions.Item label="연락처">{userInfo.Customer_contact}</Descriptions.Item>
          <Descriptions.Item label="이메일">{userInfo.Customer_email}</Descriptions.Item>
          <Descriptions.Item label="회원 구분">{userInfo.Customer_Classification}</Descriptions.Item>
          <Descriptions.Item label="회원 등급">{userInfo.Customer_Credit}</Descriptions.Item>
          <Descriptions.Item label="주소">{userInfo.Customer_address}</Descriptions.Item>
          <Descriptions.Item label="생년월일">{userInfo.Customer_birthdate}</Descriptions.Item>
          <Descriptions.Item label="가입일">{userInfo.Customer_membership_date}</Descriptions.Item>
        </Descriptions>
      );
    } else if (userType === 'staff') {
      return (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="이름">{userInfo.staff_name}</Descriptions.Item>
          <Descriptions.Item label="아이디">{userInfo.staff_InfoID}</Descriptions.Item>
          <Descriptions.Item label="연락처">{userInfo.staff_number}</Descriptions.Item>
          <Descriptions.Item label="이메일">{userInfo.staff_email}</Descriptions.Item>
          <Descriptions.Item label="직급">{userInfo.staff_classification}</Descriptions.Item>
          <Descriptions.Item label="부서">
            {userInfo.department_name}
          </Descriptions.Item>
        </Descriptions>
      );
    }
  };

  const renderEditForm = () => {
    if (userType === 'customer') {
      return (
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="Customer_name" label="이름" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Customer_contact" label="연락처" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Customer_email" label="이메일" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Customer_Classification" label="회원구분" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="학생">학생</Select.Option>
              <Select.Option value="교수">교수</Select.Option>
              <Select.Option value="일반">일반</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="Customer_address" label="주소">
            <Input />
          </Form.Item>
          <Form.Item name="Customer_birthdate" label="생년월일">
            <DatePicker allowClear />
          </Form.Item>
          <ButtonContainer>
            <Button type="primary" htmlType="submit">저장</Button>
            <Button onClick={() => setIsEditMode(false)}>취소</Button>
          </ButtonContainer>
        </Form>
      );
    } else if (userType === 'staff') {
      return (
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="staff_name" label="이름" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="staff_number" label="연락처" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="staff_email" label="이메일" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="staff_classification" label="직급" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="인턴">인턴</Select.Option>
              <Select.Option value="사원">사원</Select.Option>
              <Select.Option value="대리">대리</Select.Option>
              <Select.Option value="과장">과장</Select.Option>
              <Select.Option value="부장">부장</Select.Option>
              <Select.Option value="사장">사장</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="department_ID" label="부서" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={1}>콘텐츠운영팀</Select.Option>
              <Select.Option value={2}>행정지원팀</Select.Option>
              <Select.Option value={3}>영상등록팀</Select.Option>
            </Select>
          </Form.Item>
          <ButtonContainer>
            <Button type="primary" htmlType="submit">저장</Button>
            <Button onClick={() => setIsEditMode(false)}>취소</Button>
          </ButtonContainer>
        </Form>
      );
    }
  };

  return (
    <Modal
      title="내 정보"
      open={visible}
      onCancel={() => {
        onClose();
        setIsEditMode(false);
        form.resetFields();
      }}
      footer={null}
      width={600}
    >
      {!isEditMode ? (
        <>
          {renderUserInfo()}
          <ButtonContainer>
            <Button type="primary" onClick={handleEdit}>
              {userType === 'customer' ? '회원 정보 수정' : '직원 정보 수정'}
            </Button>
            <Button type="primary" danger onClick={handleDeleteAccount}>
              {userType === 'customer' ? '회원 탈퇴' : '직원 정보 삭제'}
            </Button>
          </ButtonContainer>
        </>
      ) : (
        renderEditForm()
      )}
    </Modal>
  );
};

const ButtonContainer = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export default UserInfoModal; 