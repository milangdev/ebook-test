import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledHeader = styled((props) => {
  return <section {...props} />;
})`
  grid-area: header;
  padding: 24px;
  font-size: 20px;
  font-weight: 600;
  background: rgb(3 21 41);
`;

export const StyledTitle = styled((props) => {
  return <Link {...props} />;
})`
  display: flex;
  width: 100%;
  margin-left: 1.5rem;
  justify-content: start;
  align-items: center;
  color: white;
  text-decoration: none;
`;
