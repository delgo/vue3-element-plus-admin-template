<template>
  <div class="tinymce-box">
    <Editor
      v-model="contentValue"
      :init="initOptions"
      :disabled="disabled"
      @onClick="onClick"
    />
  </div>
</template>

<script lang="ts">
//引入tinymce编辑器
import Editor from "@tinymce/tinymce-vue";
// 引入富文本编辑器主题的js和css
// import 'tinymce/skins/content/default/content.css'
//引入方式引入node_modules里的tinymce相关文件文件
import tinymce from "tinymce/tinymce"; //tinymce默认hidden，不引入则不显示编辑器
import "tinymce/themes/silver"; //编辑器主题，不引入则报错
import "tinymce/icons/default"; //引入编辑器图标icon，不引入则不显示对应图标

// 引入编辑器插件
import "tinymce/plugins/advlist"; //高级列表
import "tinymce/plugins/anchor"; //锚点
import "tinymce/plugins/autolink"; //自动链接
import "tinymce/plugins/autoresize"; //编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
import "tinymce/plugins/autosave"; //自动存稿
import "tinymce/plugins/charmap"; //特殊字符
import "tinymce/plugins/code"; //编辑源码
import "tinymce/plugins/codesample"; //代码示例
import "tinymce/plugins/directionality"; //文字方向
//import "tinymce/plugins/emoticons"; //表情
import "tinymce/plugins/fullpage"; //文档属性
import "tinymce/plugins/fullscreen"; //全屏
import "tinymce/plugins/help"; //帮助
import "tinymce/plugins/hr"; //水平分割线
import "tinymce/plugins/image"; //插入编辑图片
import "tinymce/plugins/importcss"; //引入css
import "tinymce/plugins/insertdatetime"; //插入日期时间
import "tinymce/plugins/link"; //超链接
import "tinymce/plugins/lists"; //列表插件
import "tinymce/plugins/media"; //插入编辑媒体
import "tinymce/plugins/nonbreaking"; //插入不间断空格
import "tinymce/plugins/pagebreak"; //插入分页符
import "tinymce/plugins/paste"; //粘贴插件
import "tinymce/plugins/preview"; //预览
import "tinymce/plugins/print"; //打印
import "tinymce/plugins/quickbars"; //快速工具栏
import "tinymce/plugins/save"; //保存
import "tinymce/plugins/searchreplace"; //查找替换
// import 'tinymce/plugins/spellchecker'  //拼写检查，暂未加入汉化，不建议使用
import "tinymce/plugins/tabfocus"; //切入切出，按tab键切出编辑器，切入页面其他输入框中
import "tinymce/plugins/table"; //表格
import "tinymce/plugins/template"; //内容模板
import "tinymce/plugins/textcolor"; //文字颜色
import "tinymce/plugins/textpattern"; //快速排版
import "tinymce/plugins/toc"; //目录生成器
import "tinymce/plugins/visualblocks"; //显示元素范围
import "tinymce/plugins/visualchars"; //显示不可见字符
import "tinymce/plugins/wordcount"; //字数统计
// import '../../public/tinymce/axupimgs' //多图上传
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  ref,
  onMounted,
  inject,
} from "vue";
import OSS from "ali-oss";
import { GetOssToken } from "@/api/upload";
import { GetBaseSetting } from "@/api/setting";
export default defineComponent({
  components: {
    Editor,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
        "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave ",
    },
    toolbar: {
      type: [String, Array],
      default:
        "fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                table image charmap hr pagebreak insertdatetime print preview | code selectall | indent2em lineheight formatpainter axupimgs",
    },
  },
  setup(props, ctx) {
    // eslint-disable-next-line
    const message = inject("$message") as any;

    const state = reactive({
      contentValue: props.value,
    });

    const initOptions = ref({
      //emoticons_database_url: "/tinymce/emoticons/js/emojis.js", //更改表情插件路径
      language_url: "/tinymce/langs/zh_CN.js", //引入语言包文件
      language: "zh_CN", //语言类型

      skin_url: "/tinymce/skins/ui/oxide", //皮肤：浅色
      // skin_url: '/tinymce/skins/ui/oxide-dark',//皮肤：暗色

      plugins: props.plugins, //插件配置
      toolbar: props.toolbar, //工具栏配置，设为false则隐藏
      // menubar: 'file edit',  //菜单栏配置，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”

      fontsize_formats:
        "12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px", //字体大小
      font_formats:
        "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",

      height: 600, //注：引入autoresize插件时，此属性失效
      placeholder: "在这里输入文字...",
      branding: false, //tiny技术支持信息是否显示
      resize: false, //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
      // statusbar: false,  //最下方的元素路径和字数统计那一栏是否显示
      elementpath: false, //元素路径是否显示

      // content_style: 'img {max-width:100%;}', //直接自定义可编辑区域的css样式
      content_css: "/tinymce/tinycontent.css", //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
      paste_data_images: true, //图片是否可粘贴
      // images_upload_url: '/demo/upimg.php',  //后端处理程序的url
      // images_upload_base_path: '/demo',  //相对基本路径--关于图片上传建议查看--http://tinymce.ax-z.cn/general/upload-images.php
      // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
      // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler

      // eslint-disable-next-line
      images_upload_handler: async ( blobInfo: any, success: any, failure: any ) => {

        const file = blobInfo.blob();
        const isJPG = file.type === "image/jpeg" || file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          message.error("上传图片只能是 JPG 或 PNG 格式!");
          failure("上传图片只能是 JPG 或 PNG 格式!");
          return;
        }
        if (!isLt2M) {
          message.error("上传图片大小不能超过 2MB!");
          failure("上传图片大小不能超过 2MB!");
          return;
        }

        let storeAs =
          "static/upload/" + file.lastModified.toString() + "@" + file.name;

        const getTokenResponse = await GetOssToken();
        let token = null;
        try {
          token = JSON.parse(getTokenResponse.data);
          // eslint-disable-next-line
        } catch (e: any) {
          failure("parse sts response info error: " + e.message);
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
          .multipartUpload(storeAs, file, {
            // eslint-disable-next-line
          progress: (p: any) => {
              // 上传进度
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
              success(baseSetting.aliOssPath + result.name);
            } else {
              message.error(result.res.timing);
            }
          })
          // eslint-disable-next-line
        .catch((err: any) => {
            message.error(err);
            console.log("err", err);
          });
      },
    });
    const methods = reactive({
      // eslint-disable-next-line
      onClick(e: any) {
        ctx.emit("onClick", e, tinymce);
      },
      // 可以添加一些自己的自定义事件，如清空内容
      clear() {
        state.contentValue = "";
      },
    });
    onMounted(() => {
      tinymce.init({});
    });
    watch(
      () => props.value,
      (newValue) => {
        state.contentValue = newValue;
      }
    );
    watch(
      () => state.contentValue,
      (newValue) => {
        ctx.emit("input", newValue);
      }
    );
    return {
      initOptions,
      ...toRefs(state),
      ...toRefs(methods),
    };
  },
});
</script>

<style lang="scss"></style>
