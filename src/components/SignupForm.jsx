import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, message } from 'antd';
import styled from 'styled-components';
import { authService } from '../services/api';

const SignupForm = ({ onClose }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await authService.signup({
        ...values,
        birthdate: values.birthdate.format('YYYY-MM-DD')
      });
      message.success('회원가입이 완료되었습니다!');
      onClose();
    } catch (error) {
      message.error('회원가입 중 오류가 발생했습니다.');
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

        <Form.Item
          name="contact"
          label="연락처"
          rules={[{ required: true, message: '연락처를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="이메일"
          rules={[
            { required: true, message: '이메일을 입력해주세요' },
            { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="classification"
          label="회원 구분"
          rules={[{ required: true, message: '회원 구분을 선택해주세요' }]}
        >
          <Select>
            <Select.Option value="학생">학생</Select.Option>
            <Select.Option value="교수">교수</Select.Option>
            <Select.Option value="외부인">외부인</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="주소"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="birthdate"
          label="생년월일"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="preferences"
          label="선호 장르"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            가입하기
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  padding: 24px;
  background: white;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
`;

export default SignupForm; 