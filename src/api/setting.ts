/* eslint-disable */
import request from "@/utils/request";

export const SetBaseSetting = (data: any) =>
  request({
    url: "/Settings/SetBaseSetting",
    method: "post",
    data,
  });

export const GetBaseSetting = () =>
  request({
    url: "/Settings/GetBaseSetting",
    method: "post",
  });

export const SetPaySetting = (data: any) =>
  request({
    url: "/Settings/SetPaySetting",
    method: "post",
    data,
  });

export const GetPaySetting = () =>
  request({
    url: "/Settings/GetPaySetting",
    method: "post",
  });

export const SetMemberSetting = (data: any) =>
  request({
    url: "/Settings/SetMemberSetting",
    method: "post",
    data,
  });

export const GetMemberSetting = () =>
  request({
    url: "/Settings/GetMemberSetting",
    method: "post",
  });