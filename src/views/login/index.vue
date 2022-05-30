<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="loginForm">
        <div class="title-container">
          <h3 class="title">后台管理系统</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
            autosize
          />
        </el-form-item>

        <el-tooltip
          v-model="capsTooltip"
          content="大写已打开"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px; padding: 20px 0"
          @click="handleLogin()"
        >
          登录
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter, stringifyQuery } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "login",
  setup() {
    const route = useRoute(); //路由信息
    const router = useRouter(); //使用路由
    const store = useStore();

    let redirect = "";
    watch(
      route,
      () => {
        let query = stringifyQuery(route.query);
        const index = query.indexOf("=");
        query = query.substring(index + 1);
        if (query) {
          redirect = query;
        }
      },
      { immediate: true }
    );

    const loginFormRef = ref();

    const loginForm = reactive({
      username: "hxl",
      password: "hxl3221505",
    });

    const loading = ref(false);
    const username = ref();
    const password = ref();

    const loginRules = ref({
      username: [
        { required: true, message: "请输入用户名名称", trigger: "blur" },
        { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        {
          min: 6,
          max: 30,
          message: "长度大于 6 并且小于 30 个字符",
          trigger: "blur",
        },
      ],
    });

    onMounted(() => {
      if (loginForm.username === "") {
        username.value.focus();
      } else if (loginForm.password === "") {
        password.value.focus();
      }
    });

    const handleLogin = async () => {
      if (!loginForm) return;
      await loginFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          loading.value = true;
          try {
            await store.dispatch("user/Login", loginForm);

            router.push(redirect || "/dashboard").catch((err) => {
              console.warn(err);
            });
            setTimeout(() => {
              loading.value = false;
            }, 0.5 * 1000);
          } catch (err) {
            loading.value = false;
          }
        }
      });
    };

    const passwordType = ref("password");
    const showPwd = (): void => {
      if (passwordType.value === "password") {
        passwordType.value = "";
      } else {
        passwordType.value = "password";
      }
      password.value.focus();
    };

    const capsTooltip = ref(false);
    const checkCapslock = (e: KeyboardEvent) => {
      const { key } = e;
      capsTooltip.value =
        key !== null && key.length === 1 && key >= "A" && key <= "Z";
    };

    return {
      loginForm,
      loginFormRef,
      loginRules,
      loading,
      capsTooltip,
      handleLogin,
      passwordType,
      showPwd,
      password,
      checkCapslock,
      username,
    };
  },
});
</script>

<style lang="scss">
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input {
      color: $loginCursorColor;
    }
    input::first-line {
      color: #c2ccd0;
    }
  }
}
.login-container {
  .loginForm {
    background: rgb(255, 254, 254, 0.5);
    padding: 30px 40px;
    border-radius: 15px;
  }
  .el-form-item__error {
    margin-top: 5px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    .el-input__wrapper {
      height: 47px;
      width: 100%;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #c2ccd0;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;
      box-shadow: 0 0 0 0px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px white inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 25px;
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 1024px) {
  .login-container {
    background-size: auto;
  }
}
@media screen and (min-width: 1024px) {
  .login-container {
    background-size: 100% auto;
  }
}
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url("../../assets/loginBg.jpg");
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: white;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: white;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: white;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
