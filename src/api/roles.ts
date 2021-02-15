/* eslint-disable */
import request from "@/utils/request";

export const getRolesList = () =>
request({
  url: "/Roles/getRolesList",
  method: "post",
});  

export const AddRole = (data:any) =>
request({
  url: "/Roles/AddRole",
  method: "post",
  data
});  

export const deleteRole = (id: number) =>
request({
  url: `/Roles/delete/${id}`,
  method: 'delete'
})  

export const updateRole = ( data: any) =>
  request({
    url: `/Roles/update`,
    method: 'put',
    data
  })