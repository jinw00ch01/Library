import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Descriptions, message, Form, Input, DatePicker, Select } from 'antd';
import styled from 'styled-components';
import { bookService } from '../services/api';
import dayjs from 'dayjs';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBooksSummary();
      setBooks(response.books);
    } catch (error) {
      message.error('도서 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = async (bookId) => {
    try {
      const response = await bookService.getBookDetail(bookId);
      setSelectedBook(response.book);
      setIsDetailVisible(true);
    } catch (error) {
      message.error('도서 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleEdit = () => {
    form.setFieldsValue({
      ...selectedBook,
      Book_published_date: selectedBook.Book_published_date ? dayjs(selectedBook.Book_published_date) : null
    });
    setIsEditMode(true);
  };

  const handleUpdate = async (values) => {
    try {
      const updatedData = {
        ...values,
        Book_published_date: values.Book_published_date?.format('YYYY-MM-DD')
      };
      
      await bookService.updateBook(selectedBook.Book_ID, updatedData);
      message.success('도서 정보가 수정되었습니다.');
      setIsEditMode(false);
      fetchBooks();
      setIsDetailVisible(false);
    } catch (error) {
      message.error('도서 정보 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: '도서 삭제',
      content: '정말로 이 도서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: async () => {
        try {
          await bookService.deleteBook(selectedBook.Book_ID);
          message.success('도서가 삭제되었습니다.');
          setIsDetailVisible(false);
          fetchBooks();
        } catch (error) {
          message.error('도서 삭제에 실패했습니다.');
        }
      }
    });
  };

  const columns = [
    {
      title: '도서 ID',
      dataIndex: 'Book_ID',
      key: 'Book_ID',
    },
    {
      title: '도서명',
      dataIndex: 'Book_name',
      key: 'Book_name',
    },
    {
      title: '상태',
      dataIndex: 'Book_state',
      key: 'Book_state',
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleDetailClick(record.Book_ID)}>
          상세 정보
        </Button>
      ),
    },
  ];

  return (
    <Container>
      <Table
        columns={columns}
        dataSource={books}
        rowKey="Book_ID"
        loading={loading}
      />
      
      <Modal
        title="도서 상세 정보"
        open={isDetailVisible}
        onCancel={() => {
          setIsDetailVisible(false);
          setIsEditMode(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        {selectedBook && !isEditMode ? (
          <>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="도서 ID">{selectedBook.Book_ID}</Descriptions.Item>
              <Descriptions.Item label="도서명">{selectedBook.Book_name}</Descriptions.Item>
              <Descriptions.Item label="출판사">{selectedBook.Book_publisher}</Descriptions.Item>
              <Descriptions.Item label="저자">{selectedBook.Book_author}</Descriptions.Item>
              <Descriptions.Item label="장르">{selectedBook.Book_genre}</Descriptions.Item>
              <Descriptions.Item label="언어">{selectedBook.Book_language}</Descriptions.Item>
              <Descriptions.Item label="ISBN">{selectedBook.Book_ISBN}</Descriptions.Item>
              <Descriptions.Item label="페이지 수">{selectedBook.Book_pages}</Descriptions.Item>
              <Descriptions.Item label="출판일">{selectedBook.Book_published_date}</Descriptions.Item>
              <Descriptions.Item label="설명">{selectedBook.Book_description}</Descriptions.Item>
              <Descriptions.Item label="상태">{selectedBook.Book_state}</Descriptions.Item>
            </Descriptions>
            <ButtonContainer>
              <Button type="primary" onClick={handleEdit}>
                도서 정보 수정
              </Button>
              <Button type="primary" danger onClick={handleDelete}>
                도서 정보 삭제
              </Button>
            </ButtonContainer>
          </>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item name="Book_name" label="도서명" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Book_publisher" label="출판사" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Book_author" label="저자" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Book_genre" label="장르" rules={[{ required: true }]}>
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
              </Select>
            </Form.Item>
            <Form.Item name="Book_language" label="언어" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="한국어">한국어</Select.Option>
                <Select.Option value="영어">영어</Select.Option>
                <Select.Option value="일본어">일본어</Select.Option>
                <Select.Option value="중국어">중국어</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="Book_ISBN" label="ISBN">
              <Input />
            </Form.Item>
            <Form.Item name="Book_pages" label="페이지 수">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="Book_published_date" label="출판일">
              <DatePicker />
            </Form.Item>
            <Form.Item name="Book_description" label="설명">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="Book_state" label="상태" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="대출가능">대출가능</Select.Option>
                <Select.Option value="대출중">대출중</Select.Option>
                <Select.Option value="연체중">연체중</Select.Option>
              </Select>
            </Form.Item>
            <ButtonContainer>
              <Button type="primary" htmlType="submit">
                저장
              </Button>
              <Button onClick={() => setIsEditMode(false)}>
                취소
              </Button>
            </ButtonContainer>
          </Form>
        )}
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

const ButtonContainer = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export default BookManagement; 