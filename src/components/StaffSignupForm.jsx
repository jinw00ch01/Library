import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import styled from 'styled-components';
import { authService } from '../services/api';

const StaffSignupForm = ({ onClose }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const signupData = {
        ...values,
        department_ID: values.department_ID,
      };
      await authService.staffSignup(signupData);
      message.success('직원 등록이 완료되었습니다!');
      onClose();
    } catch (error) {
      message.error('직원 등록에 실패했습니다.');
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
          name="number"
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
          label="직급"
          rules={[{ required: true, message: '직급을 선택해주세요' }]}
        >
          <Select>
            <Select.Option value="인턴">인턴</Select.Option>
            <Select.Option value="사원">사원</Select.Option>
            <Select.Option value="대리">대리</Select.Option>
            <Select.Option value="과장">과장</Select.Option>
            <Select.Option value="부장">부장</Select.Option>
            <Select.Option value="사장">사장</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="department_ID"
          label="부서"
          rules={[{ required: true, message: '부서를 선택해주세요' }]}
        >
          <Select>
            <Select.Option value={1}>콘텐츠운영팀</Select.Option>
            <Select.Option value={2}>행정지원팀</Select.Option>
            <Select.Option value={3}>영상등록팀</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            등록하기
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  padding: 24px;
`;

export default StaffSignupForm; 