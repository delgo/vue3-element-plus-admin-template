<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

export default defineComponent({
  components: {
    ElConfigProvider,
  },
  setup() {
    return {
      locale: zhCn,
    };
  },
});
</script>
<style lang="scss" scoped>
::v-deep .el-input-number__increase,
::v-deep .el-input-number__decrease {
  top: 2px;
}
::v-deep .btn-next .el-icon-arrow-right,
::v-deep .btn-prev .el-icon-arrow-left {
  margin: 0 auto;
}
</style>
