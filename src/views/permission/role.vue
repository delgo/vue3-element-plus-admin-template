<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新角色</el-button>

    <el-table
      :data="rolesList.list"
      :max-height="tableMinHeight()"
      v-loading="loading"
      style="width: 100%; margin-top: 30px"
      border
    >
      <el-table-column
        align="center"
        Prop="RoleKey"
        label="角色key"
        width="220"
      >
        <template #default="scope">
          {{ scope.row.roleKey }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="角色描述">
        <template #default="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column
        align="header-center"
        label="创建时间"
        prop="createTime"
        :formatter="parseTime"
      >
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'edit' ? '编辑角色' : '新角色'"
      destroy-on-close
    >
      <el-form
        :model="role.value"
        :rules="formRules"
        label-width="80px"
        label-position="left"
        ref="roleRef"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="role.value.name"
            autocomplete="off"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="key" prop="roleKey">
          <el-input
            v-model="role.value.roleKey"
            autocomplete="off"
            placeholder="请输入角色key"
          />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            v-model="role.value.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入简介"
          />
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="baseAsyncRoutes.value"
            :props="defaultProps"
            show-checkbox
            node-key="name"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmRole"
          v-loading="confirmLoading"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  nextTick,
  inject,
} from "vue";
import { getRolesList, AddRole, deleteRole, updateRole } from "@/api/roles";
import { parseTime as utilparseTime } from "@/utils/index";

import { RouteRecordRaw } from "vue-router";
import { asyncRoutes } from "@/router";
interface role {
  id?: number;
  roleKey: string;
  name: string;
  description: string;
  routes: string;
  createTime?: number;
  updateTime?: number;
}

export default defineComponent({
  name: "role",
  setup() {
    // eslint-disable-next-line
    const message = inject("$message") as any;
    // eslint-disable-next-line
    const messageBox = inject("$messageBox") as any;
    const rolesList: { list: role[] } = reactive({ list: [] });
    // eslint-disable-next-line
    const baseAsyncRoutes: { value: any[] } = reactive({ value: asyncRoutes });

    const loading = ref(true);
    async function getList() {
      const res = await getRolesList();
      rolesList.list = res.data;
      loading.value = false;
    }

    onMounted(() => {
      getList();
    });

    const tableMinHeight = () => {
      return window.innerHeight - 156;
    };
    // eslint-disable-next-line
    const parseTime = (row: any) => {
      return utilparseTime(row.createTime);
    };

    const dialogVisible = ref(false);
    const dialogType = ref("add");
    const role: { value: role } = reactive({
      value: {
        roleKey: "",
        name: "",
        description: "",
        routes: "",
      },
    });

    const checkStrictly = ref(false);
    const defaultProps = reactive({
      children: "children",
      // eslint-disable-next-line
      label: (item: any) => {
        return item.meta.title;
      },
    });

    const roleRef = ref();
    const formRules = reactive({
      name: [
        { required: true, message: "请输入角色名称", trigger: "blur" },
        { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
      ],
      roleKey: [
        { required: true, message: "请输入角色key", trigger: "blur" },
        { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
      ],
    });
    const tree = ref();
    const confirmLoading = ref(false);

    const handleAddRole = () => {
      dialogVisible.value = true;
      role.value = {
        roleKey: "",
        name: "",
        description: "",
        routes: "",
      };
      nextTick(() => {
        tree.value.setCheckedNodes([]);
      });
    };

    const confirmRole = async () => {
      confirmLoading.value = true;
      if (!roleRef.value) return;
      await roleRef.value.validate(async (valid: boolean) => {
        if (valid) {
          const checkRoutes = tree.value.getCheckedNodes(false, true);
          if (checkRoutes.length === 0) {
            message.error("请最少选择一个菜单!");
            confirmLoading.value = false;
            return;
          }
          const routes = GenerateRoutes(baseAsyncRoutes.value, checkRoutes);
          const jsonRoutes = JSON.stringify(routes);

          role.value.routes = jsonRoutes;
          try {
            if (dialogType.value === "add") {
              await AddRole(role.value);
              getList();
            } else {
              await updateRole(role.value);
              checkStrictly.value = false;
            }

            dialogVisible.value = false;
            message.success({
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
    const handleEdit = async (scope: any) => {
      dialogType.value = "edit";
      dialogVisible.value = true;
      checkStrictly.value = true; //不这么设置，编辑的时候，tree已选中遍历会出问题。
      role.value = scope.row;
      const routes = JSON.parse(role.value.routes);
      const checkedRoutes = getCheckedRoutes(routes);
      nextTick(() => {
        tree.value.setCheckedNodes(checkedRoutes);
      });
    };
    // eslint-disable-next-line
    const handleDelete = async ({ $index, row }: any) => {
      messageBox
        .confirm("是否删除此角色?", "警告", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          await deleteRole(row.id);
          rolesList.list.splice($index, 1);
          message.success({
            message: "删除成功",
            type: "success",
          });
        })
        // eslint-disable-next-line
        .catch((err: any) => {
          console.error(err);
        });
    };
    // eslint-disable-next-line
    const getCheckedRoutes = (checkedRoutes: RouteRecordRaw[]): any[] => {
      // eslint-disable-next-line
      const tmp: any[] = [];
      checkedRoutes.forEach((route: RouteRecordRaw) => {
        const r = { ...route };
        if (r.children) {
          const child = getCheckedRoutes(r.children);
          tmp.push(...child);
        }
        tmp.push(r);
      });
      return tmp;
    };

    const GenerateRoutes = (
      baseAsyncRoutes: RouteRecordRaw[],
      // eslint-disable-next-line
      checkedRoutes: any[]
    ): RouteRecordRaw[] => {
      const res: RouteRecordRaw[] = [];
      baseAsyncRoutes.forEach((route: RouteRecordRaw) => {
        const r = { ...route };
        if (hasChecked(checkedRoutes, r)) {
          if (r.children) {
            r.children = GenerateRoutes(r.children, checkedRoutes);
          }
          res.push(r);
        }
      });
      return res;
    };
    const hasChecked = (
      // eslint-disable-next-line
      checkRoutes: any[],
      routes: RouteRecordRaw
    ): boolean => {
      let b = false;
      checkRoutes.forEach((item) => {
        if (item.name === routes.name) {
          b = true;
        }
      });
      return b;
    };
    return {
      rolesList,
      loading,
      tableMinHeight,
      dialogVisible,
      parseTime,
      dialogType,
      handleAddRole,
      role,
      checkStrictly,
      defaultProps,
      baseAsyncRoutes,
      formRules,
      confirmRole,
      roleRef,
      tree,
      confirmLoading,
      handleDelete,
      handleEdit,
    };
  },
});
</script>
