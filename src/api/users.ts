/* eslint-disable */
import request from "@/utils/request";

export const getUsersList = (page: number, limit: number) =>
  request({
    url: `/Users/getUsersList/${page}/${limit}`,
    method: "get",
  });

export const getUserInfo = () =>
  request({
    url: "/Users/getUserInfo",
    method: "post",
  });

export const addUser = (data: any) =>
  request({
    url: "/Users/addUser",
    method: "post",
    data,
  });
export const updateUser = (data: any, password: string) =>
  request({
    url: `/Users/updateUser`,
    method: "put",
    data,
  });
// export const getUserByName = (username: string) =>
//   request({
//     url: `/users/${username}`,
//     method: 'get'
//   })

// export const updateUser = (username: string, data: any) =>
//   request({
//     url: `/users/${username}`,
//     method: 'put',
//     data
//   })

export const deleteUser = (id: number) =>
  request({
    url: `/Users/deleteUser/${id}`,
    method: "delete",
  });

export const login = (data: any) =>
  request({
    url: "/Users/Authenticate",
    method: "post",
    data,
  });
//jwt 不需要
// export const logout = () =>
//   request({
//     url: "/users/logout",
//     method: "post",
//   });
