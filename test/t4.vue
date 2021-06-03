<template>
  <div class="pagination-container" data-auid="4cc49eafa82b" :class="{'hidden':hidden}">
    <el-pagination data-auid="97bd136653a0" :background="background" :current-page.sync="currentPage" :page-size.sync="pageSize" :layout="layout" :page-sizes="pageSizes" :total="total" v-bind="$attrs" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>