import httpRequest from "./fetcher";

//register user
export const register = (e) =>
  httpRequest({ method: "POST", url: `/auth/register`, data: e });

//login user
export const login = (e) =>
  httpRequest({ method: "POST", url: `/auth/login`, data: e });

//get books
export const getBooks = () => httpRequest({ method: "GET", url: `/book` });

//create books
export const createBook = (e) =>
  httpRequest({ method: "POST", url: `/book`, data: e });

//update book
export const updateBook = (e, id) =>
  httpRequest({
    method: "PUT",
    url: `/book/${id}`,
    data: e,
  });

//delete books
export const deleteBook = (id) =>
  httpRequest({ method: "DELETE", url: `/book/${id}` });

//get collaborators
export const getCollaborators = (params) =>
  httpRequest({ method: "GET", url: `/auth/users`, params });

//update collaborators
export const updateCollaborator = (e) =>
  httpRequest({ method: "POST", url: `/book/updateCollaborator`, data: e });

//create section
export const createSection = (e) =>
  httpRequest({ method: "POST", url: `/section`, data: e });

//get section
export const getSection = (id) =>
  httpRequest({ method: "GET", url: `/section/${id}` });

//get sections
export const getSections = (id) =>
  httpRequest({ method: "GET", url: `/book/${id}` });

//update section
export const updateSection = (e, id) =>
  httpRequest({
    method: "PUT",
    url: `/section/${id}`,
    data: e,
  });

//delete books
export const deleteSection = (id) =>
  httpRequest({ method: "DELETE", url: `/section/${id}` });
