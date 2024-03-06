import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { Error } from "../../services/fetcher";
import { ToastSuccess } from "../Toast";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import { createSection } from "../../services/apis";

export const AddSections = ({ sectionId, bookId, text, disabled }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState("optional");

  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        parentSection: sectionId && sectionId,
        book: bookId,
      };
      const response = await createSection(data);
      const _data = response.data;
      if (_data?.success) {
        ToastSuccess(_data?.message);
        navigate(`/books/${bookId}/section/${_data?.data?._id}`);
      }
      handleCancel();
    } catch (error) {
      Error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <div style={{ textAlign: "end" }}>
      <Button
        disabled={disabled && disabled}
        onClick={showModal}
        type="primary"
      >
        {text}
      </Button>
      <Modal
        title="Add Section"
        open={open}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            loading={confirmLoading}
            type="primary"
            onClick={handleOk}
          >
            Add
          </Button>,
        ]}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            requiredMarkValue: requiredMark,
          }}
          onValuesChange={onRequiredTypeChange}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Title must be requried",
              },
            ]}
          >
            <Input placeholder="Enter Section Title" />
          </Form.Item>

          <Form.Item label="Content" name="content">
            <TextArea rows={6} placeholder="Enter Content" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
