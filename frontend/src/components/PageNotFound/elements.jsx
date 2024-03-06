import styled from "styled-components";

export const StyledDiv = styled((props) => {
  return <div {...props} />;
})`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;
