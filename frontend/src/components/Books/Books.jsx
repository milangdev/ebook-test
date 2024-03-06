import React, { useEffect, useState } from "react";
import { Button, Select, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { AddBooks } from "../AddBooks";
import { Error } from "../../services/fetcher";
import {
  deleteBook,
  getBooks,
  getCollaborators,
  updateCollaborator,
} from "../../services/apis";
import moment from "moment";
import { ToastSuccess } from "../Toast";
import { Layout } from "../Layout";
import { capitalize, getUserFromCookies } from "../../services/utils";

export const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const user = getUserFromCookies();
  const [collaborator, setCollaborator] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await getBooks();
      const _data = response.data;

      if (_data?.success) {
        setBooks(_data?.data);
      }
    } catch (error) {
      Error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, []);

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

  const options = collaborator.map((e) => {
    return { label: e?.username, value: e?._id };
  });

  const handleChange = async (value, record) => {
    const bookId = record?._id;
    try {
      await updateCollaborator({
        bookId,
        collaborator: value.length === 0 ? [] : value,
      });
    } catch (error) {
      Error(error);
    } finally {
      fetchBooks();
      fetchCollaborators();
    }
  };

  const columns = [
    {
      title: "Book Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author Name",
      dataIndex: "author.username",
      key: "author.username",
      render: (text, record) => capitalize(record?.author?.username),
    },
    {
      title: "Collaborator",
      key: "collaborator",
      dataIndex: "Collaborator",

      render: (_, record) => {
        return (
          <Select
            mode="multiple"
            style={{ minWidth: "150px", maxWidth: "200px" }}
            placeholder="Please select collaborator"
            defaultValue={record?.collaborator?.map((e) => e?._id)}
            onChange={(e) => handleChange(e, record)}
            options={options}
            disabled={user?._id !== record?.author?._id}
          />
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        return moment(date).format("DD/MM/YYYY");
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex" }}>
          <span style={{ marginLeft: "8px" }}>
            <Button
              type="primary"
              disabled={
                user?._id !== record?.author?._id &&
                !record.collaborator.some(
                  (collaborator) => collaborator._id === user?._id
                )
              }
              onClick={() => {
                navigate(`/books/${record?._id}`);
              }}
            >
              View
            </Button>
          </span>
          <span style={{ marginLeft: "8px" }}>
            <Button
              type="primary"
              disabled={user?._id !== record?.author?._id}
              onClick={() => deleteHandler(record?._id)}
            >
              Delete
            </Button>
          </span>
        </div>
      ),
    },
  ];

  const deleteHandler = async (id) => {
    try {
      const response = await deleteBook(id);
      if (response?.data?.success) {
        ToastSuccess(response?.data?.message);
      }
    } catch (error) {
      Error(error);
    } finally {
      fetchBooks();
    }
  };
  return (
    <Layout>
      <AddBooks
        fetchBooks={fetchBooks}
        disabled={user?.role === "collaborator"}
      />
      <Table
        loading={loading}
        columns={columns}
        dataSource={books}
        pagination={false}
      />
    </Layout>
  );
};
