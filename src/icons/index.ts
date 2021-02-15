// register globally

const req = require.context("./svg", false, /\.svg$/);
// eslint-disable-next-line
const requireAll = (requireContext: any) => {
  requireContext.keys().map(requireContext);
};
requireAll(req);
