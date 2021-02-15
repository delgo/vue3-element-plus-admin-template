<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新帐户</el-button>
    <el-table
      :data="accountList.list"
      style="width: 100%; margin-top: 20px"
      row-key="id"
      border
      v-loading="loading"
    >
      <el-table-column
        align="center"
        label="id"
        width="50"
        sortable
        prop="id"
      />
      <el-table-column align="center" label="用户名">
        <template v-slot="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属权限角色">
        <template v-slot="scope">
          {{ scope.row.roleKey }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="真实姓名">
        <template v-slot="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template v-slot="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.avatar"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱">
        <template v-slot="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="介绍">
        <template v-slot="scope">
          {{ scope.row.introduction }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话">
        <template v-slot="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        :formatter="parseTime"
        prop="createTime"
        sortable
      >
      </el-table-column>
      <el-table-column align="header-center" label="状态" width="100">
        <template v-slot="scope">
          <el-tooltip :content="'更改状态'" placement="top">
            <el-switch
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              @change="changeSwitch(scope.row)"
            />
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template v-slot="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'edit' ? '编辑角色' : '新角色'"
      top="40px"
      destroy-on-close
    >
      <el-form
        :model="user.value"
        :rules="formRules"
        label-width="80px"
        label-position="left"
        ref="userRef"
      >
        <el-form-item label="名称" prop="userName">
          <el-input
            v-model="user.value.userName"
            autocomplete="off"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="user.value.password"
            autocomplete="off"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="重复密码" prop="checkPassword">
          <el-input
            v-model="user.value.checkPassword"
            autocomplete="off"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="选择权限" prop="roleId">
          <el-select v-model="user.value.roleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="电话号码" prop="phone">
              <el-input
                v-model="user.value.phone"
                autocomplete="off"
                placeholder="请输入电话号码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="真实姓名" prop="name">
              <el-input
                v-model="user.value.name"
                autocomplete="off"
                placeholder="请输入真实姓名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="头像" prop="avatar">
              <el-input
                v-model="user.value.avatar"
                autocomplete="off"
                placeholder="请输入头像"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="email" prop="email">
              <el-input
                v-model="user.value.email"
                autocomplete="off"
                placeholder="请输入email"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="简介" prop="introduction">
          <el-input
            v-model="user.value.introduction"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入简介"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="user.value.status"> </el-switch>
        </el-form-item>
        <div style="text-align: right">
          <el-button type="danger" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" @click="confirm" v-loading="confirmLoading"
            >确定</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts">
interface user {
  id?: number;
  userName: string;
  password: string;
  checkPassword: string;
  roleId: number | undefined;
  roleKey: string;
  phone?: string;
  userType?: string;
  name?: string;
  avatar: string;
  email?: string;
  introduction?: string;
  status: boolean;
  createTime?: number;
  updateTime?: number;
}
import { defineComponent, onMounted, reactive, ref } from "vue";
import { getUsersList, addUser, updateUser, deleteUser } from "@/api/users";
import { getRolesList } from "@/api/roles";
import { parseTime as utilparseTime } from "@/utils/index";
import { ElMessage, ElMessageBox } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";

export default defineComponent({
  components: { Pagination },
  setup() {
    const accountList: { list: user[] } = reactive({ list: [] });
    const loading = ref(true);
    const rolesList = ref();
    const listQuery = reactive({
      page: 1,
      limit: 10,
    });
    const total = ref(0);

    const getList = async () => {
      loading.value = true;
      const res = await getUsersList(listQuery.page, listQuery.limit);
      accountList.list = res.data.list;
      total.value = res.data.total;
      if (res.data) {
        const roles = await getRolesList();
        rolesList.value = roles.data;
        loading.value = false;
      }
    };
    onMounted(() => {
      getList();
    });

    // eslint-disable-next-line
    const parseTime = (row: any) => {
      return utilparseTime(row.createTime);
    };

    const dialogVisible = ref(false);
    const dialogType = ref("add");
    const userAssign: user = {
      userName: "",
      password: "",
      checkPassword: "",
      roleId: undefined,
      roleKey: "",
      name: "",
      phone: "",
      avatar: "http://api.tongshuzaixian.com/static/avatar.png",
      introduction: "",
      status: false,
    };
    const user: { value: user } = reactive({ value: userAssign });
    const userRef = ref();
    // eslint-disable-next-line
    const validateUserName = (rule: any, value: any, callback: any) => {
      const reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){3,20}$/;
      if (!reg.test(value)) {
        callback(
          new Error("用户名为3-20个以字母开头、可带数字、“_”、“.”的字串")
        );
      } else {
        callback();
      }
    };
    // eslint-disable-next-line
    const validatePassword = (rule: any, value: any, callback: any) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (!reg.test(value)) {
        callback(new Error("密码必须是由6-20位字母+数字组合"));
      } else {
        callback();
      }
    };
    // eslint-disable-next-line
    const validateCheckPassword = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== user.value.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    const formRules = reactive({
      userName: [
        { required: true, message: "请输入名称", trigger: "blur" },
        { validator: validateUserName, trigger: "blur" },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { validator: validatePassword, trigger: "blur" },
      ],
      checkPassword: [
        { required: true, validator: validateCheckPassword, trigger: "blur" },
      ],
      roleId: [{ required: true, message: "请选择角色", trigger: "blur" }],
      email: [{ type: "email", message: "请输入正确的Emall", trigger: "blur" }],
      phone: [
        {
          pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
          message: "请输入正确的手机号",
          trigger: "blur",
        },
      ],
    });
    const handleAdd = () => {
      dialogVisible.value = true;
      user.value = {
        userName: "",
        password: "",
        checkPassword: "",
        roleId: undefined,
        roleKey: "",
        name: "",
        phone: "",
        avatar: "http://api.tongshuzaixian.com/static/avatar.png",
        introduction: "",
        status: false,
      };
      dialogType.value = "add";
    };

    const confirmLoading = ref(false);
    const confirm = async () => {
      confirmLoading.value = true;
      if (!userRef.value) return;
      await userRef.value.validate(async (valid: boolean) => {
        if (valid) {
          try {
            const roleKey = rolesList.value.filter(
              // eslint-disable-next-line
              (item: any) => item.id === user.value.roleId
            )[0].roleKey;
            user.value.roleKey = roleKey;
            if (dialogType.value === "add") {
              await addUser(user.value);
              getList();
            } else {
              await updateUser(user.value, user.value.password);
            }
            dialogVisible.value = false;
            ElMessage.success({
              message: dialogType.value === "add" ? "添加成功" : "更新成功",
              type: "success",
            });
          } catch (error) {
            console.log("error");
            confirmLoading.value = false;
          }
        }
        confirmLoading.value = false;
      });
    };
    // eslint-disable-next-line
    const changeSwitch = async (row: any) => {
      try {
        await updateUser(row, row.password);
        ElMessage.success({
          message: "更改成功",
          type: "success",
        });
      } catch (error) {
        console.log(error);
      }
    };
    // eslint-disable-next-line
    const handleEdit = async (scope: any) => {
      dialogType.value = "edit";
      dialogVisible.value = true;
      user.value = scope.row;
    };
    // eslint-disable-next-line
    const handleDelete = async ({ $index, row }: any) => {
      ElMessageBox.confirm("是否删除此帐户?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteUser(row.id);
          accountList.list.splice($index, 1);
          ElMessage.success({
            message: "删除成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.error(err);
        });
    };
    return {
      accountList,
      parseTime,
      loading,
      getList,
      listQuery,
      total,
      rolesList,
      dialogVisible,
      dialogType,
      handleAdd,
      user,
      userRef,
      confirmLoading,
      formRules,
      confirm,
      changeSwitch,
      handleDelete,
      handleEdit,
    };
  },
});
</script>
