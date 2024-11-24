import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Spin, message } from 'antd';
import { authService } from '../services/api';

const UserInfoModal = ({ visible, onClose, userType, userId }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = userType === 'customer' 
          ? await authService.getCustomerInfo(userId)
          : await authService.getStaffInfo(userId);
        
        setUserInfo(userType === 'customer' ? response.customerInfo : response.staffInfo);
      } catch (error) {
        message.error('정보를 불러오는데 실패했습니다.');
      }
      setLoading(false);
    };

    if (visible && userId) {
      fetchUserInfo();
    }
  }, [visible, userId, userType]);

  return (
    <Modal
      title={userType === 'customer' ? '고객 정보' : '직원 정보'}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {loading ? (
        <Spin />
      ) : userInfo && (
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
      )}
    </Modal>
  );
};

export default UserInfoModal; 