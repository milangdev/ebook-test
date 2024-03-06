import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { Layout } from "../Layout";
import { StyledInput, StyledTextArea } from "./elements";
import {
  deleteSection,
  getSection,
  getSections,
  updateBook,
  updateSection,
} from "../../services/apis";
import { useNavigate, useParams } from "react-router-dom";
import { Error } from "../../services/fetcher";
import { AddSections } from "../AddSections";
import { ToastSuccess } from "../Toast";
import { getUserFromCookies } from "../../services/utils";

export const Sections = () => {
  const params = useParams();
  const { bookId, sectionId } = params;
  const navigate = useNavigate();

  const user = getUserFromCookies();
  const [sections, setSections] = useState([]);
  const [error, setError] = useState({ key: "", value: "" });
  const [editTitle, setEditTitle] = useState({
    value: sectionId ? sections?.title : sections[0]?.title,
    edit: false,
  });
  const [editContent, setEditContent] = useState({
    value: sectionId ? sections?.content : sections[0]?.content,
    edit: false,
  });

  const fetchSections = async () => {
    try {
      let response;
      if (!sectionId) {
        response = await getSections(bookId);
      }
      if (sectionId) {
        response = await getSection(sectionId);
      }

      const _data = response?.data;

      if (_data?.success) {
        setSections(_data?.data);
        setEditTitle({
          ...editTitle.edit,
          value: sectionId ? _data?.data?.title : _data?.data[0]?.title,
        });
        setEditContent({
          ...editContent.edit,
          value: sectionId ? _data?.data?.content : _data?.data[0]?.content,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSections();
    // eslint-disable-next-line
  }, [sectionId]);

  const handleChange = async (data, id) => {
    try {
      let response;
      if (sectionId) {
        response = await updateSection(data, id);
      }
      if (!sectionId) {
        response = await updateBook(data, id);
      }

      if (response?.data?.success) {
        await fetchSections();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    if (!editTitle.edit) {
      setEditTitle({
        value: sectionId ? sections?.title : sections[0]?.title,
        edit: true,
      });
      setEditContent({
        value: sectionId ? sections?.content : sections[0]?.content,
        edit: true,
      });
      return;
    }
    if (editTitle.value.length >= 3 && editTitle.edit) {
      setEditTitle({ ...editTitle, edit: !editTitle.edit });
      if (editContent.edit) {
        setEditContent({ ...editContent, edit: !editContent.edit });
      }
      const data = { title: editTitle?.value, content: editContent?.value };
      handleChange(data, sectionId ? sectionId : bookId);
    } else {
      setError({
        key: "title",
        value: "At least 3 characters required",
      });
      return;
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteSection(sectionId ? sectionId : bookId);
      if (response?.data?.success) {
        ToastSuccess(response?.data?.message);
        if (sectionId) {
          if (!sections?.parentSection) {
            navigate(`/books/${bookId}`);
          } else {
            navigate(`/books/${bookId}/section/${sections?.parentSection}`);
          }
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      Error(error);
    }
  };

  return (
    <Layout editTitle={editTitle.edit}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "5em",
          }}
        >
          <div style={{ width: "100%", marginBottom: "18px" }}>
            <h3 style={{ marginBottom: "6px" }}>
              {sectionId ? "Section Title" : "Book Title"}
            </h3>
            <div style={{ width: "100%" }}>
              <StyledInput
                disabled={!editTitle.edit}
                status={error.key === "title" ? "error" : ""}
                onChange={(e) => {
                  setEditTitle({ ...editTitle, value: e.target.value });
                  setError({
                    key: "",
                    value: "",
                  });
                }}
                value={editTitle?.value}
              />
              {error.key === "title" && (
                <p
                  style={{
                    height: "0px",
                    color: "red",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {error.value}
                </p>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "4px",
            }}
          >
            <AddSections
              bookId={bookId}
              sectionId={sectionId && sectionId}
              text={`${!sectionId ? "Add Section" : "Add Subsection"}`}
              disabled={user?.role === "collaborator"}
            />
            <Button onClick={() => handleEdit()} type="primary">
              {editTitle.edit && editContent.edit ? "Save" : "Edit"}
            </Button>
            <Button
              onClick={() => handleDelete()}
              disabled={user?.role === "collaborator"}
              type="primary"
            >
              Delete
            </Button>
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: "6px" }}>
            {sectionId ? "Content" : "Description"}
          </h3>
          <StyledTextArea
            disabled={!editContent.edit}
            onChange={(e) => {
              setEditContent({ ...editContent, value: e.target.value });
            }}
            value={editContent?.value}
            rows={30}
          />
        </div>
      </div>
    </Layout>
  );
};
