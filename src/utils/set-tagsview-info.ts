import store from "@/store";

export const setTagsViewTitle = (
  title: string,
  // eslint-disable-next-line
  setRoute: any,
  litTitle: string
): void => {
  const tempRoute = Object.assign({}, setRoute);
  const route = Object.assign({}, tempRoute, {
    title: `${title}-${litTitle}`,
  });
  store.dispatch("tagsView/updateVisitedView", route);
};

export const setPageTitle = (title: string, litTitle: string): void => {
  document.title = `${title} - ${litTitle}`;
};
