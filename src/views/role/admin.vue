<template>
  <div class="app-container">
    <!-- 1.查询和其他操作 -->
    <div class="filter-container">
      <el-input
        class="filter-item"
        placeholder="请输入管理员名字"
        v-model="keyword"
        clearable
        @keyup.enter.native="handSerach"
      ></el-input>
      <el-button type="primary" :loading="loading" icon="el-icon-search" @click="handSerach">搜索</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handAddOne">添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column label="序号" width="60">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>

      <el-table-column label="头像" width="120">
        <template slot-scope="scope">
          <img class="photo" :src="scope.row.avatar" />
        </template>
      </el-table-column>

      <el-table-column prop="userName" label="用户名" width="100"></el-table-column>

      <el-table-column label="角色" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.role.roleName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">可用</el-tag>
          <el-tag v-if="scope.row.status==2" type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="性别" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.gender==1">男</span>
          <span v-if="scope.row.gender==2">女</span>
        </template>
      </el-table-column>

      <el-table-column prop="loginCount" label="登陆次数" width="80"></el-table-column>

      <el-table-column prop="lastLoginIp" label="ip" width="120"></el-table-column>

      <el-table-column prop="lastLoginTime" label="最后登录" width="160"></el-table-column>

      <el-table-column label="操作" fixed="right" width="230">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.status==1"
            type="danger"
            @click="changeStatus(scope.row)"
          >禁用</el-button>
          <el-button
            size="mini"
            v-if="scope.row.status==2"
            type="success"
            @click="changeStatus(scope.row)"
          >启用</el-button>
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 5, 10, 20]"
        layout="sizes,total,prev, pager, next"
        :current-page.sync="currentPage"
        :total="total"
        :page-size="pageSize"
      ></el-pagination>
    </div>

    <!-- 弹出修改或者新增窗口 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="formRules" ref="form">
        <!-- 头像 -->
        <!-- <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>-->

        <el-form-item label="用户名" :label-width="formLabelWidth" required>
          <el-input v-model="form.userName"></el-input>
        </el-form-item>

        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>

        <el-form-item label="性别" :label-width="formLabelWidth" required>
          <template>
            <el-radio v-model="form.gender" label="1">男</el-radio>
            <el-radio v-model="form.gender" label="2">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>

        <el-form-item label="微信号" :label-width="formLabelWidth">
          <el-input v-model="form.weChat"></el-input>
        </el-form-item>

        <el-form-item label="QQ号码" :label-width="formLabelWidth">
          <el-input v-model="form.qqNumber"></el-input>
        </el-form-item>

        <el-form-item label="职业" :label-width="formLabelWidth">
          <el-input v-model="form.occupation"></el-input>
        </el-form-item>

        <el-form-item label="最后登录时间" :label-width="formLabelWidth" :hidden="isHidden">
          <el-input v-model="form.lastLoginTime" :disabled="isEditForm"></el-input>
        </el-form-item>

        <el-form-item label="最后登录IP" :label-width="formLabelWidth" :hidden="isHidden">
          <el-input v-model="form.lastLoginIp" :disabled="isEditForm"></el-input>
        </el-form-item>
      </el-form>
      <!-- 表单提交按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handClickChance">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAdminList,
  addAdmin,
  editorAdmin,
  deleteAdmin,
  changeStatus
} from "@/api/role";

export default {
  data() {
    //定义表单验证规则
    // 邮箱
    var checkEmail = (rule, value, callback) => {
      if (this.isEditForm == "false") {
        if (!value) {
          return callback(new Error("邮箱不能为空"));
        } else {
          var email = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!email.test(value)) {
            return callback(new Error("邮箱格式不正确！"));
          } else {
            return callback();
          }
        }
      } else {
        callback();
      }
    };
    var checkMobile = (rule, value, callback) => {
      if (this.isEditForm == "false") {
        if (!value) {
          return callback(new Error("电话号码不能为空"));
        } else {
          var mobile = /^(0|86|17951)?(13[0-9]|14[01456789]|15[0-9]|16[56]|17[0-8]|18[0-9]|198|199)[0-9]{8}$/;
          if (!mobile.test(value)) {
            return callback(new Error("邮箱格式不正确！"));
          } else {
            return callback();
          }
        }
      } else {
        callback();
      }
    };
    //
    return {
      imageUrl: "",
      keyword: "",
      formLabelWidth: "100px",
      tableData: [],
      currentPage: 1, //当前页
      pageSize: 5, //每页数量
      total: 0, //总数
      dialogVisible: false, //控制弹出页面是否弹出
      isEditForm: "false", //控制弹出页面是新增或者是编辑
      isHidden: true, //控制是否显示某个表单项
      dialogTitle: "", //弹出框标题
      form: {}, //表单
      formRules: {
        //自定义表单数据验证规则
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }]
      }
    };
  },
  //渲染前方法
  created() {
    this.adminList();
  },
  methods: {
    adminList: function() {
      var params = new URLSearchParams();
      params.append("keyword", this.keyword);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      getAdminList(params).then(response => {
        this.tableData = response.data.records;
        this.currentPage = response.data.current;
        this.pageSize = response.data.size;
        this.total = response.data.total;
        // console.log(response);
      });
    },
    // 按关键字查询
    handSerach: function() {
      this.adminList();
    },
    //切换当前页
    handleCurrentChange: function(val) {
      this.currentPage = val;
      this.adminList();
    },
    //切换每页显示数目
    handleSizeChange: function(val) {
      this.pageSize = val;
      this.adminList();
    },
    //添加页面默认性别
    getFormObject: function() {
      var formObject = {
        uid: null,
        gender: "1"
      };
      return formObject;
    },
    //添加
    handAddOne: function() {
      this.dialogVisible = true;
      this.isEditForm = "false";
      this.isHidden = true;
      this.form = this.getFormObject();
      this.dialogTitle = "添加管理员信息";
    },
    //编辑
    handleEdit: function(row) {
      this.dialogVisible = true;
      this.isHidden = false;
      this.isEditForm = "true";
      this.dialogTitle = "修改管理员信息";
      this.form = row;
    },
    //取消时候重置可显示表单项
    handClickChance: function() {
      this.dialogVisible = false;
      if (isEditForm == "true") {
        this.isHidden = true;
      }
    },
    //提交新增或者提交修改
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.isEditForm == "true") {
            editorAdmin(this.form).then(response => {
              if (response.code == "success") {
                this.$message({
                  type: "success",
                  message: response.message
                });
                this.dialogVisible = false;
                this.adminList();
              } else {
                this.$message({
                  type: "error",
                  message: response.message
                });
              }
            });
          } else {
            addAdmin(this.form).then(response => {
              if (response.code == "success") {
                this.$message({
                  type: "success",
                  message: response.message
                });
                this.dialogVisible = false;
                this.adminList();
              } else {
                this.$message({
                  type: "error",
                  message: response.message
                });
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除管理员
    handleDelete: function(row) {
      var that = this;
      this.$confirm("此操作将该管理员删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = new URLSearchParams();
          var adminUids = [];
          adminUids.push(row.uid);
          params.append("adminUids", adminUids);
          deleteAdmin(params).then(response => {
            console.log(response);
            this.$message({
              type: "success",
              message: response.message
            });
            that.adminList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    changeStatus: function(row) {
      let params = new URLSearchParams();
      params.append("uid", row.uid);
      params.append("status", row.status);
      changeStatus(params).then(response => {
        if (response.code == "success") {
          this.$message({
            type: "success",
            message: response.message
          });
          this.adminList();
        } else {
          this.$message({
            type: "erroe",
            message: response.message
          });
        }
      });
    }

    // 头像
    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === "image/jpeg";
    //   const isLt2M = file.size / 1024 / 1024 < 2;

    //   if (!isJPG) {
    //     this.$message.error("上传头像图片只能是 JPG 格式!");
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("上传头像图片大小不能超过 2MB!");
    //   }
    //   return isJPG && isLt2M;
    // }
    // 头像
  }
};
</script>

<style>
.filter-container {
  margin: 10px 0 10px 0;
}
.filter-item {
  width: 200px;
}
.photo {
  width: 50px;
  height: 50px;
}
.img {
  height: 120px;
  width: 120px;
}
.imgBody {
  width: 100px;
  height: 100px;
  border: solid 2px #ffffff;
  float: left;
  position: relative;
}
/* 头像 */
/* .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
} */
/* 头像 */
</style>


