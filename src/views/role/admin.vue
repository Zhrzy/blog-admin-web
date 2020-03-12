<template>
  <div class="app-container">
       <!-- 1.查询和其他操作 -->
    <div class="filter-container" >
      <el-input
        class="filter-item"
        placeholder="请输入管理员名字"
        v-model="keyword"
        clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline">添加</el-button>
      
      <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">

    <el-table-column
      type="selection"
      width="55">
    </el-table-column>

    <el-table-column label="序号" width="60">
      <template slot-scope="scope">{{ scope.$index+1 }}</template>
    </el-table-column>

    <el-table-column label="头像" width="120">
      <template slot-scope="scope">
        <img class="photo"
        :src="scope.row.avatar"
         />
      </template>
    </el-table-column>

    <el-table-column
      prop="nickName"
      label="用户名"
      width="100">
    </el-table-column>

    <el-table-column
      prop="nickName"
      label="角色"
      width="100">
    </el-table-column>

    <el-table-column
      label="状态"
      width="100">
      <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status==2" type="danger">禁用</el-tag>
        </template>
    </el-table-column>

    <el-table-column
      label="性别"
      width="80">
      <template slot-scope="scope" >
        <span v-if="scope.row.gender==1" >男</span>
        <span v-if="scope.row.gender==2" >女</span>
      </template>
    </el-table-column>

    <el-table-column
      prop="loginCount"
      label="登陆次数"
      width="80">
    </el-table-column>

    <el-table-column
      prop="lastLoginIp"
      label="ip"
      width="120">
    </el-table-column> 

    <el-table-column
      prop="lastLoginTime"
      label="最后登录"
      width="160">
    </el-table-column>

    <el-table-column label="操作" fixed="right" width="150">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
   </el-table> 
    </div>


  </div>
</template>

<script>

import {getAdminList} from "@/api/role";

 export default {
  data(){
    return{
      keyword:"",
      tableData: []
    };   
  },
   created() {

    this.adminList();
    // this.roleList();
  },
  methods: {
    adminList: function() {
      var params = new URLSearchParams();
      params.append("keyword", "小");
      //params.append("currentPage", this.currentPage);
      //params.append("pageSize", this.pageSize);
      getAdminList(params).then(response => {
        this.tableData = response.data.records;
        // this.currentPage = response.data.current;
        // this.pageSize = response.data.size;
        // this.total = response.data.total;
        // console.log(response);        
      });
    }
  }
}

</script>

<style>
   .filter-container{
     margin: 10px 0 10px 0;
   }
   .filter-item{
     width: 200px;
   }
   .photo{
    width: 50px;
    height: 50px;
   }
</style>


