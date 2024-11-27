import React from 'react';
import { Form, Input, DatePicker, Select, Button, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const ContentsRegistrationForm = ({ staffId }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const formData = {
        ...values,
        Contents_date: values.Contents_date?.format('YYYY-MM-DD'),
        staff_ID: staffId
      };
      
      console.log('전송되는 데이터:', formData);
      
      await adminService.registerContents(formData);
      message.success('콘텐츠가 등록되었습니다!');
      form.resetFields();
    } catch (error) {
      console.error('등록 실패:', error);
      message.error('콘텐츠 등록에 실패했습니다.');
    }
  };

  return (
    <FormContainer>
      <h2>신규 콘텐츠 등록</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="Book_ID"
          label="도서 ID"
          rules={[{ required: true, message: '도서 ID를 입력해주세요' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="Contents_type"
          label="유형"
          rules={[{ required: true, message: '콘텐츠 유형을 선택해주세요' }]}
        >
          <Select>
            <Select.Option value="정기 행사">정기 행사</Select.Option>
            <Select.Option value="특별 행사">특별 행사</Select.Option>
            <Select.Option value="독서 프로그램">독서 프로그램</Select.Option>
            <Select.Option value="참여형 이벤트">참여형 이벤트</Select.Option>
            <Select.Option value="기타">기타</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="Contents_name"
          label="콘텐츠명"
          rules={[{ required: true, message: '콘텐츠명을 입력해주세요' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Contents_author"
          label="주최자"
          rules={[{ required: true, message: '주최자를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Contents_date"
          label="등록일"
          rules={[{ required: true, message: '등록일을 선택해주세요' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="Contents_state"
          label="상태"
          initialValue="진행전"
          rules={[{ required: true, message: '상태를 선택해주세요' }]}
        >
          <Select>
            <Select.Option value="진행전">진행전</Select.Option>
            <Select.Option value="진행중">진행중</Select.Option>
            <Select.Option value="진행 완료">진행 완료</Select.Option>
            <Select.Option value="취소됨">취소됨</Select.Option>
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

export default ContentsRegistrationForm; 