<template>
  <div data-auid="9985bb0aef4a">
    <panel-template ref="panel-template" showsearch searchplaceholder="请输入姓名" showheader data-auid="ad8bad19b286" :total="total" :limit="20" :loading="loading" @query="handleParamsSearch">
      <staff-selector slot="buttons" buttontype="primary" data-auid="fcae170f8c4a" :value="selectStaffs" :maxcount="10" @input="selectStaff">
        <span slot="button-name" data-auid="127cb44c3dbf">新增主播</span>
      </staff-selector>
      <div class="total" data-auid="9bee59c6b291">共有{{ total }}名主播</div>
      <Table class="table" data-auid="19ac9f88c1c1" :data="owners">
        <TableColumn prop="name" label="姓名" width="200" show-overflow-tooltip data-auid="79544274286a"></TableColumn>
        <TableColumn label="所属部门" width="236" data-auid="08ef60d097b9">
          <template slot-scope="{ row }">
            <sector-column data-auid="1b257a5ec9cd" :sectors="get(row, 'departments', [])"></sector-column>
          </template>
        </TableColumn>
        <TableColumn label="状态" prop="status" width="100" data-auid="df892f039760">
          <template slot-scope="scope">
            <status-badge data-auid="86de85f73b17" :status="STATUS_MAP[scope.row.status]" :text="OWNER_STATUS_TEXT[scope.row.status]"></status-badge>
          </template>
        </TableColumn>
        <TableColumn prop="modifyTime" label="操作时间" width="200" data-auid="8769b7985d02" :formatter="formatModifierTime"></TableColumn>
        <TableColumn prop="modifierName" label="操作人" width="200" data-auid="933d4776eeae"></TableColumn>
        <TableColumn label="操作" width="200" data-auid="7efdfdfad5f2">
          <template slot-scope="scope">
            <TablePopoverButton data-auid="038b25f05783" :tip="ACTION_TIP_MAP[scope.row.status]" @click="editOwnerStatus(scope.row)">
              {{ ACTION_TEXT_MAP[scope.row.status] }}
            </TablePopoverButton>
            <TablePopoverButton tip="确认删除该主播吗？" data-auid="fe308d54fa22" @click="deleteOwner(scope.row)">
              删除
            </TablePopoverButton>
          </template>
        </TableColumn>
      </Table>
    </panel-template>
  </div>
</template>