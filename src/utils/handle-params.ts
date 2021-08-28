//序列化并保留type
// eslint-disable-next-line
export const serialization = (params: any) => {
  const temp = JSON.parse(JSON.stringify(params));
  Object.keys(temp).forEach((key) => {
    temp[key + "type"] = typeof temp[key];
  });
  return temp;
};
//反序列化并保留type,目前只支持number|string|boolean|null
// eslint-disable-next-line
export const deserialization = (jsonString: string | null) => {
  // eslint-disable-next-line
  let temp: any = {};
  // eslint-disable-next-line
  const result: any = {};
  if (jsonString) {
    temp = JSON.parse(jsonString);
    Object.keys(temp).forEach((key) => {
      if (temp[key + "type"]) {
        switch (temp[key + "type"]) {
          case "number":
            temp[key] = Number(temp[key]);
            break;
          case "boolean":
            temp[key] === "true" ? (temp[key] = true) : (temp[key] = false);
            break;
          case "object":
            if (temp[key] === "null") temp[key] = null;
            break;
          default:
            break;
        }
        result[key] = temp[key];
      }
    });
  }
  return result;
};
