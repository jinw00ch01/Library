import React from 'react';
import { Form, Input, Button, message } from 'antd';
import styled from 'styled-components';
import { authService } from '../services/api';

const CustomerLoginForm = ({ onClose, onLoginSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await authService.customerLogin(values);
      message.success('로그인되었습니다!');
      onLoginSuccess(response.user, 'customer');
      onClose();
    } catch (error) {
      message.error('로그인에 실패했습니다.');
    }
  };

  return (
    <FormContainer>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="infoId"
          label="아이디"
          rules={[{ required: true, message: '아이디를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="비밀번호"
          rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            로그인
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  padding: 24px;
`;

export default CustomerLoginForm; 