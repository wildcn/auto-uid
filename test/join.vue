<template>
  <div class="header-search" data-auid="f5e8de44aa45" :class="{'show':show}">
    <el-select data-auid="055e85b8d140">
      <el-option v-for="item in options" :key="item.path" data-auid="03ba6887e4bb" :value="item" :label="item.title.join(' > ')" /></el-select></div>
    
  
</template>