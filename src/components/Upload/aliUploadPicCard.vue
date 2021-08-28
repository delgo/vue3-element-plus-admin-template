<template>
  <div class="upload-container">
    <div class="uploader">
      <el-upload
        action=""
        list-type="picture-card"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleChange"
        accept="(image / png, image / jpeg)"
        ref="uploadInner"
        drap
        multiple
        style="width: 20%"
      >
        <el-progress type="circle" :percentage="progress" v-if="uploading" />
        <i class="el-icon-plus" v-else />
      </el-upload>
      <draggable
        class="dragArea list-group w-full"
        v-model="images"
        @change="sort"
      >
        <transition-group>
          <div class="image-list" v-for="(item, index) in images" :key="index">
            <div class="close" @click="delImage(index)">
              <el-icon color="red">
                <CircleClose />
              </el-icon>
            </div>
            <img :src="item.url + '?imageView2/1/w/200/h/200'" alt="" />
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, inject, watch } from "vue";
import OSS from "ali-oss";
import { GetOssToken } from "@/api/upload";
import { GetBaseSetting } from "@/api/setting";
import { CircleClose } from "@element-plus/icons";
import { VueDraggableNext } from "vue-draggable-next";

export default defineComponent({
  name: "aliUpload",
  props: {
    url: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CircleClose,
    draggable: VueDraggableNext,
  },
  setup(props, { emit }) {
    // eslint-disable-next-line
    const message = inject("$message") as any;
    const progress = ref(0);

    // eslint-disable-next-line
    const images = ref(props.url);

    watch(props, (newValue) => {
      images.value = newValue.url;
    });

    //需要排序后传递值给父组件
    const sort = () => {
      emit("update:modelValue", images.value);
    };
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
          progress: (p: any, checkPoint:any) => {
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
          if (images.value.length >= 6) {
            message.error("最多上传6张图片");
            uploading.value = false;
            return;
          }
          if (result.res.status === 200) {
            images.value.push({
              url: baseSetting.aliOssPath + result.name,
            });
            emit("update:modelValue", images.value);
          } else {
            message.error(result.res.timing);
          }
        })
        // eslint-disable-next-line
        .catch((err: any) => {
          message.error(err);
          console.log("err", err);
        });
    };

    const delImage = (index: number) => {
      images.value.splice(index, 1);
      emit("update:modelValue", images.value);
    };

    return {
      progress,
      handleChange,
      images,
      uploading,
      delImage,
      sort,
    };
  },
});
</script>
<style lang="scss" scoped>
.uploader {
  display: flex;
  flex-direction: row;
  .image-list {
    width: 20%;
    margin-left: 2%;
    border-radius: 6px;
    height: 148px;
    overflow: hidden;
    border: 1px solid var(--el-card-border-color);
    position: relative;
    img {
      width: 100%;
    }
    .close {
      display: none;
      position: absolute;
      top: 0;
      right: 5px;
      animation: close 1s;
      cursor: pointer;
    }
  }
  .image-list:hover {
    border-color: var(--el-color-primary);
    .close {
      display: block;
    }
  }
}
@keyframes close {
  from {
    opacity: 0;
    right: 0;
  }
  to {
    opacity: 1;
    right: 5px;
  }
}
.uploader {
  overflow: hidden;
}
::v-deep .el-upload-dragger,
::v-deep .el-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
::v-deep .dragArea {
  display: flex;
  width: 80%;
}
</style>
