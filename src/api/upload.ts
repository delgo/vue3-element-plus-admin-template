/* eslint-disable */
import request from "@/utils/request";

export const GetOssToken = () =>
  request({
    url: "/Upload/GetOssToken",
    method: "post",
  });
