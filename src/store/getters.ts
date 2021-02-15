/* eslint-disable */
const getters = {
  sidebar:(state:any)=>{return state.app.sidebar},
  device:(state:any)=>{return state.app.device},
  visitedViews:(state:any)=>{return state.tagsView.visitedViews},
  cachedViews:(state:any)=>{return state.tagsView.cachedViews},
  token:(state:any)=>{return state.user.token},
  avatar:(state:any)=>{return state.user.avatar},
  name:(state:any)=>{return state.user.name},
  introduction:(state:any)=>{return state.user.introduction},
  roleKey:(state:any)=>{return state.user.roleKey},
  permissionRoutes:(state:any)=>{return state.permission.dynamicRoutes},
  routes:(state:any)=>{return state.permission.routes}
}
export default getters
