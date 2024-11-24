import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Button, Form, Input, message, Space, Spin } from 'antd';
import { authService } from '../services/api';

const UserInfoModal = ({ visible, onClose, userType, userId, onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && userId) {
      fetchUserInfo();
    }
  }, [visible, userId, userType]);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = userType === 'customer' 
        ? await authService.getCustomerInfo(userId)
        : await authService.getStaffInfo(userId);
      
      setUserInfo(response.customerInfo || response.staffInfo);
    } catch (error) {
      message.error('정보를 불러오는데 실패했습니다.');
    }
    setLoading(false);
  };

  const handleUpdate = async (values) => {
    try {
      if (userType === 'customer') {
        await authService.updateCustomerInfo(userId, values);
      } else {
        await authService.updateStaffInfo(userId, values);
      }
      message.success('정보가 수정되었습니다.');
      setIsEditing(false);
      fetchUserInfo();
    } catch (error) {
      message.error('정보 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: '회원 탈퇴',
      content: '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      okText: '탈퇴',
      okType: 'danger',
      cancelText: '취소',
      onOk: async () => {
        try {
          if (userType === 'customer') {
            await authService.deleteCustomer(userId);
          } else {
            await authService.deleteStaff(userId);
          }
          message.success('탈퇴가 완료되었습니다.');
          onClose();
          onLogout();
        } catch (error) {
          message.error('탈퇴 처리에 실패했습니다.');
        }
      }
    });
  };

  return (
    <Modal
      title={userType === 'customer' ? '고객 정보' : '직원 정보'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : userInfo && (
        <>
          {!isEditing ? (
            <>
              <Descriptions bordered column={1}>
                {userType === 'customer' ? (
                  <>
                    <Descriptions.Item label="아이디">{userInfo.Customer_InfoID}</Descriptions.Item>
                    <Descriptions.Item label="연락처">{userInfo.Customer_contact}</Descriptions.Item>
                    <Descriptions.Item label="이메일">{userInfo.Customer_email}</Descriptions.Item>
                    <Descriptions.Item label="회원구분">{userInfo.Customer_Classification}</Descriptions.Item>
                    <Descriptions.Item label="회원등급">{userInfo.Customer_Credit}</Descriptions.Item>
                    <Descriptions.Item label="주소">{userInfo.Customer_address}</Descriptions.Item>
                    <Descriptions.Item label="생년월일">{userInfo.Customer_birthdate}</Descriptions.Item>
                    <Descriptions.Item label="가입일">{userInfo.Customer_membership_date}</Descriptions.Item>
                  </>
                ) : (
                  <>
                    <Descriptions.Item label="아이디">{userInfo.staff_InfoID}</Descriptions.Item>
                    <Descriptions.Item label="이름">{userInfo.staff_name}</Descriptions.Item>
                    <Descriptions.Item label="직급">{userInfo.staff_classification}</Descriptions.Item>
                    <Descriptions.Item label="이메일">{userInfo.staff_email}</Descriptions.Item>
                    <Descriptions.Item label="연락처">{userInfo.staff_number}</Descriptions.Item>
                    <Descriptions.Item label="부서번호">{userInfo.department_ID}</Descriptions.Item>
                  </>
                )}
              </Descriptions>
              <Space style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => setIsEditing(true)}>
                  회원정보 수정
                </Button>
                <Button danger onClick={handleDelete}>
                  회원 탈퇴
                </Button>
              </Space>
            </>
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdate}
              initialValues={userType === 'customer' ? {
                contact: userInfo.Customer_contact,
                email: userInfo.Customer_email,
                address: userInfo.Customer_address
              } : {
                email: userInfo.staff_email,
                number: userInfo.staff_number
              }}
            >
              {userType === 'customer' ? (
                <>
                  <Form.Item name="contact" label="연락처">
                    <Input />
                  </Form.Item>
                  <Form.Item name="email" label="이메일">
                    <Input />
                  </Form.Item>
                  <Form.Item name="address" label="주소">
                    <Input />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item name="email" label="이메일">
                    <Input />
                  </Form.Item>
                  <Form.Item name="number" label="연락처">
                    <Input />
                  </Form.Item>
                </>
              )}
              <Space>
                <Button type="primary" htmlType="submit">
                  저장
                </Button>
                <Button onClick={() => setIsEditing(false)}>
                  취소
                </Button>
              </Space>
            </Form>
          )}
        </>
      )}
    </Modal>
  );
};

export default UserInfoModal; 