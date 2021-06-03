<template>
  <el-breadcrumb class="app-breadcrumb" data-auid="08006491fde3" separator="/">
    <transition-group data-auid="158160e3453e" name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path" data-auid="14c58766061c">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect" data-auid="f42f053876fe" /></el-breadcrumb-item></transition-group></el-breadcrumb>
        <a v-else data-auid="84aacb2b374d" @click.prevent="handleLink(item)" /></template>