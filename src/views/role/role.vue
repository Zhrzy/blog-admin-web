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
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->

      <el-table-column label="序号" width="60">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>

      <el-table-column label="角色名称" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色介绍" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.summary }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status==0" type="danger">已删除</el-tag>
          
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.categoryMenuUids)">编辑</el-button>
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
    
    <!--添加或修改对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍" :label-width="formLabelWidth">
          <el-input v-model="form.summary" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="访问菜单" :label-width="formLabelWidth">
          <el-tree
            ref="tree"
            :data="categoryMenuList"
            show-checkbox
            node-key="uid"
            :props="defaultProps"
            :default-checked-keys="form.categoryMenuUids"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加或修改对话框 -->
  </div>
</template>

<script>
import {getRoleList} from "@/api/role"
import {getAllMenu} from "@/api/menu"
export default {
  data() {
    return{
      formLabelWidth:"120px",
      keyword:'',
      tableData: [],
      currentPage: 1, //当前页
      pageSize: 5, //每页数量
      total: 0, //总数

      isEditForm : "false",
      dialogTitle:'', //弹窗标题
      categoryMenuList: [], //分类菜单列表
      dialogFormVisible:false, //控制是否弹窗
      form: {
        uid: null,
        roleName: "",
        summary: "",
        categoryMenuUids: [],
      },
      // tree配置项
      defaultProps: {
        children: "childCategoryMenu",
        label: "name"
      },
      //默认选中的key
      defaultCheckedKeys: []
    }
  },
  created(){
      this.AllMenu();
      this.roleList();
  },
  methods: {
    // 获取角色列表
    roleList: function() {
      var params = new URLSearchParams();
      params.append("keyword", this.keyword);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      getRoleList(params).then(response => {
        var data = response.data.records;     
        //初始化菜单UID
          for (let a = 0; a < data.length; a++) {
            if (data[a].categoryMenuUids) {
              data[a].categoryMenuUids = eval("(" + data[a].categoryMenuUids + ")");
            } else {
              data[a].categoryMenuUids = [];
            }
          }
        this.tableData = data;
       
        this.currentPage = response.data.current;
        this.pageSize = response.data.size;
        this.total = response.data.total;
      });
    },
    //获取所有菜单
    AllMenu: function() {
      getAllMenu().then(response => {
        if (response.code == "success") { 
          this.categoryMenuList = response.data;
        }
      });
    },
    // 按关键字查询
    handSerach: function() {
      this.roleList();
    },
    //切换当前页
    handleCurrentChange: function(val) {
      this.currentPage = val;
      this.roleList();
    },
    //切换每页显示数目
    handleSizeChange: function(val) {
      this.pageSize = val;
      this.roleList();
    },
     //添加
    handAddOne: function() {
      this.dialogFormVisible = true;
      this.isEditForm = "false";
      this.dialogTitle = "添加角色信息";
      this.form = {
        uid: null,
        roleName: null,
        summary: null,
        categoryMenuUids: [],
      };
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(this.form.categoryMenuUids);
      }, 0);
    }, 
    //编辑
    handleEdit: function(row) {
     
      this.dialogFormVisible = true;
      this.dialogTitle= "修改角色信息";
      this.isEditForm = "true";
      this.form.categoryMenuUids = row; 
      console.log("====>"+row);
      // setTimeout(() => {
      //   this.$refs.tree.setCheckedKeys(row);
      // }, 0);
    }




  }
}
</script>


<style >
.filter-container {
  margin: 10px 0 10px 0;
}
.filter-item {
  width: 200px;
}
</style>