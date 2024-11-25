import React from 'react';
import { Form, Input, Select, DatePicker, Button, message } from 'antd';
import styled from 'styled-components';
import { authService } from '../services/api';

const CustomerSignupForm = ({ onClose }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      console.log('Form values:', values);
      
      const signupData = {
        ...values,
        birthdate: values.birthdate ? values.birthdate.format('YYYY-MM-DD') : null,
        preferences: values.preferences || null,
        address: values.address || null
      };

      console.log('Sending data:', signupData);
      
      const response = await authService.customerSignup(signupData);
      console.log('Server response:', response);
      
      message.success('회원가입이 완료되었습니다!');
      onClose();
    } catch (error) {
      console.error('Signup error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      const errorMessage = 
        error.response?.data?.details || 
        error.response?.data?.error || 
        '회원가입 중 오류가 발생했습니다.';
        
      message.error(errorMessage);
    }
  };

  return (
    <FormContainer>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="이름"
          rules={[{ required: true, message: '이름을 입력해주세요' }]}
        >
          <Input />
        </Form.Item>

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
            <Select.Option value="일반">일반</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="address" label="주소">
          <Input />
        </Form.Item>

        <Form.Item name="birthdate" label="생년월일">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="preferences" label="선호 장르">
          <Select mode="multiple" placeholder="선호 장르를 선택해주세요">
            <Select.Option value="사전">사전</Select.Option>
            <Select.Option value="철학">철학</Select.Option>
            <Select.Option value="종교">종교</Select.Option>
            <Select.Option value="사회과학">사회과학</Select.Option>
            <Select.Option value="자연과학">자연과학</Select.Option>
            <Select.Option value="응용과학&공학">응용과학&공학</Select.Option>
            <Select.Option value="예술">예술</Select.Option>
            <Select.Option value="문학">문학</Select.Option>
            <Select.Option value="역사&지리">역사&지리</Select.Option>
            <Select.Option value="어린이&청소년">어린이&청소년</Select.Option>
            <Select.Option value="전문서적">전문서적</Select.Option>
            <Select.Option value="취미&실용">취미&실용</Select.Option>
            <Select.Option value="경제&경영">경제&경영</Select.Option>
            <Select.Option value="기타">기타</Select.Option>
          </Select>
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
`;

export default CustomerSignupForm; 