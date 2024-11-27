import React from 'react';
import { Form, Input, DatePicker, Button, message, Select } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const BookRegistrationForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const formData = {
        ...values,
        Book_published_date: values.Book_published_date?.format('YYYY-MM-DD')
      };
      await adminService.registerBook(formData);
      message.success('도서가 등록되었습니다!');
      form.resetFields();
    } catch (error) {
      message.error('도서 등록에 실패했습니다.');
    }
  };

  return (
    <FormContainer>
      <h2>신규 도서 등록</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="Book_name"
          label="도서명"
          rules={[{ required: true, message: '도서명을 입력해주세요' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Book_publisher"
          label="출판사"
          rules={[{ required: true, message: '출판사를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Book_author"
          label="저자"
          rules={[{ required: true, message: '저자를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Book_genre"
          label="장르"
          rules={[{ required: true, message: '장르를 선택해주세요' }]}
        >
          <Select>
            <Select.Option value="사전">사전</Select.Option>
            <Select.Option value="철학">철학</Select.Option>
            <Select.Option value="종교">종교</Select.Option>
            <Select.Option value="사회과학">사회과학</Select.Option>
            <Select.Option value="자연과학">자연과학</Select.Option>
            <Select.Option value="응용과학/공학">응용과학/공학</Select.Option>
            <Select.Option value="예술">예술</Select.Option>
            <Select.Option value="문학">문학</Select.Option>
            <Select.Option value="역사/지리">역사/지리</Select.Option>
            <Select.Option value="어린이/청소년">어린이/청소년</Select.Option>
            <Select.Option value="전문서적">전문서적</Select.Option>
            <Select.Option value="취미/실용">취미/실용</Select.Option>
            <Select.Option value="경제/경영">경제/경영</Select.Option>
            <Select.Option value="기타">기타</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="Book_language"
          label="언어"
          rules={[{ required: true, message: '언어를 선택해주세요' }]}
        >
          <Select>
            <Select.Option value="한국어">한국어</Select.Option>
            <Select.Option value="영어">영어</Select.Option>
            <Select.Option value="일본어">일본어</Select.Option>
            <Select.Option value="중국어">중국어</Select.Option>
            <Select.Option value="프랑스어">프랑스어</Select.Option>
            <Select.Option value="스페인어">스페인어</Select.Option>
            <Select.Option value="아랍어">아랍어</Select.Option>
            <Select.Option value="힌디어">힌디어</Select.Option>
            <Select.Option value="기타">기타</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="Book_ISBN" label="ISBN">
          <Input />
        </Form.Item>

        <Form.Item name="Book_pages" label="페이지 수">
          <Input type="number" />
        </Form.Item>

        <Form.Item name="Book_published_date" label="출판일">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="Book_description" label="도서 설명">
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="Book_state"
          label="도서 상태"
          rules={[{ required: true, message: '도서 상태를 선택해주세요' }]}
          initialValue="대출가능"
        >
          <Select>
            <Select.Option value="대출가능">대출가능</Select.Option>
            <Select.Option value="대출중">대출중</Select.Option>
            <Select.Option value="연체중">연체중</Select.Option>
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

export default BookRegistrationForm; 