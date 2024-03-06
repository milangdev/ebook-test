import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import { createBook, getCollaborators } from "../../services/apis";
import { Error } from "../../services/fetcher";
import { ToastSuccess } from "../Toast";

export const AddBooks = ({ fetchBooks, disabled }) => {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState("optional");

  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [collaborator, setCollaborator] = useState([]);
  const showModal = () => {
    setOpen(true);
  };

  const fetchCollaborators = async () => {
    try {
      const response = await getCollaborators({ role: "collaborator" });
      const _data = response.data;
      if (_data?.success) {
        setCollaborator(_data?.data);
      }
    } catch (error) {
      Error(error);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const values = await form.validateFields();
      const response = await createBook(values);
      const _data = response.data;
      if (_data?.success) {
        ToastSuccess(_data?.message);
      }
      handleCancel();
    } catch (error) {
      Error(error);
    } finally {
      await fetchBooks();
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const options = collaborator.map((e) => {
    return { label: e?.username, value: e?._id };
  });

  return (
    <div style={{ textAlign: "end", marginBottom: "2rem" }}>
      <Button
        type="primary"
        onClick={showModal}
        disabled={disabled && disabled}
      >
        Add Book
      </Button>
      <Modal
        title="Add Book"
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
            label="Book Name"
            name="title"
            rules={[
              {
                required: true,
                message: "Title must be requried",
              },
            ]}
          >
            <Input placeholder="Book name" />
          </Form.Item>

          <Form.Item label="Collaborator" name="collaborator">
            <Select
              mode="multiple"
              placeholder="Select collaborator"
              options={options}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
