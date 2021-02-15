// eslint-disable-next-line
const _import = (file: any) => (): any => {
  const component = import("@/views" + file + ".vue");
  return component;
};

export default _import;
