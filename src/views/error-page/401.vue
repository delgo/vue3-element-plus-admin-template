<template>
  <div class="errPage-container">
    <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back">
      返回
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2 class="no-permission">你没有权限去该页面</h2>
        <h6>如有不满请联系你领导</h6>
        <ul class="list-unstyled">
          <li>或者你可以去:</li>
          <li class="link-type">
            <router-link to="/dashboard"> 回首页 </router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img
          :src="errGif"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import errorGif from "@/assets/401_images/401.gif";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  name: "Page401",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const errGif = ref(errorGif + "?" + +new Date());
    const back = () => {
      if (route.query.noGoBack) {
        router.push({ path: "/dashboard" });
      } else {
        router.go(-1);
      }
    };
    return {
      errGif,
      back,
    };
  },
});
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .no-permission {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .list-unstyled {
    margin-top: 20px;
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
