interface Settings {
  title: string; // Overrides the default title
  errorLog: string[]; // The env to enable the errorlog component, default 'production' only
  sidebarTextTheme: boolean; // If true, will change active text color for sidebar based on theme
  devServerPort: number; // Port number for webpack-dev-server
}

// You can customize below settings :)
const settings: Settings = {
  title: "后台管理系统",
  errorLog: ["production"],
  sidebarTextTheme: true,
  devServerPort: 9527,
};

export default settings;
