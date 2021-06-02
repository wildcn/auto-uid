<template>
  <div class="list" data-auid="51b815b7ae6b">
      <el-table :data="serverList" align="center" data-auid="4da3ea40799d">
        <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="host" label="服务器地址" header-align="center" align="center"></el-table-column>

        <!-- <el-table-column
          prop="shortCuts"
          label="快捷路径"
          header-align="center"
        >
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.shortCuts" :key="index">
              {{ item }}
            </p>
          </template>
        </el-table-column> -->
        <el-table-column prop="description" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="action" label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="list-btn" @click="loginServer(scope.row)" data-auid="b00faa40114f">登录</el-button>
            <el-button type="text" size="mini" class="list-btn" @click="serverEdit(scope.row)" data-auid="b5b26945a850">编辑</el-button>

            <el-popconfirm :title="`确认删除${scope.row.host}吗？`" width="200" @confirm="serverDelete(scope.row)" data-auid="2c2a14bd319a">
              <el-button slot="reference" class="list-btn" size="mini" type="text" data-auid="01cdfd174505">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
