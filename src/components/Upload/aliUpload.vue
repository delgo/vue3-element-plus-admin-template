<template>
  <div class="upload-container">
    <el-upload
      drag
      :show-file-list="false"
      class="uploader"
      action=""
      :auto-upload="false"
      :on-change="handleChange"
      accept="(image / png, image / jpeg)"
      ref="uploadInner"
    >
      <el-progress type="circle" :percentage="progress" v-if="uploading" />
      <div v-else>
        <img
          :src="imageUrl + '?imageView2/1/w/200/h/200'"
          alt=""
          v-if="imageUrl"
          style="width: 100%"
        />
        <i class="el-icon-upload" v-if="!imageUrl"></i>
        <div class="el-upload__text" v-if="!imageUrl">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </div>
    </el-upload>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, inject, watch } from "vue";
import OSS from "ali-oss";
import { GetOssToken } from "@/api/upload";
import { GetBaseSetting } from "@/api/setting";
export default defineComponent({
  name: "aliUpload",
  props: {
    url: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    // eslint-disable-next-line
    const message = inject("$message") as any;
    //如果父组件没有再赋值就需要这么绑定
    const imageUrl = ref(props.url);
    //如果父组件onmouted赋值需要watch
    watch(props, (newValue) => {
      imageUrl.value = newValue.url;
    });

    const progress = ref(0);
    const uploading = ref(false);
    // eslint-disable-next-line
    const handleChange = async (file: any) => {
      progress.value = 0;
      uploading.value = true;
      const isJPG =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";
      const isLt2M = file.raw.size / 1024 / 1024 < 2;

      if (!isJPG) {
        message.error("上传头像图片只能是 JPG 或 PNG 格式!");
        uploading.value = false;
        return;
      }
      if (!isLt2M) {
        message.error("上传头像图片大小不能超过 2MB!");
        uploading.value = false;
        return;
      }
      let storeAs =
        "static/upload/" + file.raw.lastModified.toString() + "@" + file.name;

      const getTokenResponse = await GetOssToken();
      let token = null;
      try {
        token = JSON.parse(getTokenResponse.data);
      } catch (e) {
        return message.error("parse sts response info error: " + e.message);
      }

      const getBaseSettingResponse = await GetBaseSetting();
      const baseSetting = getBaseSettingResponse.data;
      let client = new OSS({
        region: baseSetting.aliOssRegion,
        // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录 https://ram.console.aliyun.com 创建RAM账号。
        accessKeyId: token.Credentials.AccessKeyId,
        accessKeySecret: token.Credentials.AccessKeySecret,
        stsToken: token.Credentials.SecurityToken,
        endpoint: baseSetting.aliStsEndpoint,
        bucket: baseSetting.aliOssBucketName,
      });
      // storeAs表示上传的object name , file表示上传的文件
      client
        .multipartUpload(storeAs, file.raw, {
          // eslint-disable-next-line
          progress: (p: any) => {
            // 上传进度
            progress.value = p * 100;
            if (p === 1) {
              setTimeout(() => {
                uploading.value = false;
              }, 1000);
            }
          },
          headers: {
            // 设置上传回调
            // "x-oss-callback": result.callback,
            // "x-oss-callback-var": result["callback-var"],
          },
        })
        // eslint-disable-next-line
        .then((result: any) => {
          if (result.res.status === 200) {
            imageUrl.value = baseSetting.aliOssPath + result.name;
            emit("update:modelValue", imageUrl);
          } else {
            message.error(result.res.timing);
          }
        })
        // eslint-disable-next-line
        .catch((err: any) => {
          message.error(err);
        });
    };
    return {
      imageUrl,
      progress,
      handleChange,
      uploading,
    };
  },
});
</script>
<style lang="scss" scoped>
.uploader,
::v-deep .el-upload {
  overflow: hidden;
}
::v-deep .el-upload-dragger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
