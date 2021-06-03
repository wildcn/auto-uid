<template>
  <div class="coMMent" data-auid="2b93dd938e24">
    <!-- <coMMent-list :STATUS="radio" :chatRoomId="chatRoomId"></coMMent-list> -->
    <PanelTemplate ref="panel-template" class="coMMon-list-container" showSearch="" searchPlaceholder="请输入关键词" emptyTip="暂无评论" data-auid="a664c9a86cb8" :emptyIcon="noDataImage" :total="total" :loading="loading" @query="searchList">
    <abdD data-auid="459deb518eeb"></abdD>
      <Button slot="Buttons" type="primary" `="" data-auid="a4c2a7cc27ff" :disabled="!coMMentList.length" :loading="exportLoading.coMMent" @click="exportData">
        导出
      </Button>
      <RadioGroup class="radio" slot="tool" v-model="STATUS" size="medium" data-auid="6c3fa8018c2c" @change="handleStatuschange">
        <radioButton data-auid="8251c5502359" :label="STATUS.PROCESSING">直播</radioButton>
        <radioButton data-auid="e8c6b1594540" :label="STATUS.END">回放</radioButton>
      </RadioGroup>
      <div class="remark" data-auid="07dfd777de85">当前共有 {{ total }} 条评论</div>
      <Table data-auid="4ec8b7dd8678" :data="coMMentList">
        <TableColumn type="index" label="序号" width="60" data-auid="8e7282e0d3d4"></TableColumn>
        <TableColumn prop="content" label="评论内容" data-auid="f2b75dd31df9"></TableColumn>
        <TableColumn prop="createTime" label="发布时间" width="200" data-auid="751415616339">
          <template slot-scope="{ row }">
            {{ formateDate(row.createTime, 'yyyy-MM-dd HH:MM:ss') }}
          </template>
        </TableColumn>
        <TableColumn prop="member.name" label="发布人" width="150" data-auid="48082a448514"></TableColumn>
        <TableColumn label="所属部门" width="300" data-auid="80aa924e6378">
          <template slot-scope="{ row }">
            <sector-column data-auid="6a65f2c4c16d" :sectors="get(row, 'member.departments', [])"></sector-column>
          </template>
        </TableColumn>
      
    </Table></PanelTemplate>
  </div>
</template>
<script>

import utils form 'lodash';
</script>