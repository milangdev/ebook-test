import { StyledDiv } from "./elements";
import Page404 from "../../images/Page404.svg";

export const PageNotFound = () => {
  return (
    <StyledDiv>
      <img src={Page404} alt="" />
    </StyledDiv>
  );
};
