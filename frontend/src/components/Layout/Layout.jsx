import React from "react";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";

export const Layout = (props) => {
  return (
    <>
      <Header />
      <Sidebar editTitle={props.editTitle}>{props.children}</Sidebar>
    </>
  );
};
