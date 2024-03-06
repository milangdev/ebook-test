import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AppWrapper = ({ children }) => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeOnClick
        theme="light"
      />
      {children}
    </>
  );
};
