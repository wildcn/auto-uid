<template>
  <div>
    <panel-template
      @query="searchList"
      @create="handleAddCategory"
      :total="total"
      :limit="PAGE_SIZE"
      ref="panel-template"
      showSearch
      searchPlaceholder="请输入分类名称"
      showHeader
      showCreateButton
      createText="新增分类"
    >
      <div>当前共计分类{{ total }}条</div>
      <Table :data="categorys">
        <TableColumn
          type="index"
          :index="indexMethod"
          label="序号"
        ></TableColumn>
        <TableColumn
          prop="name"
          label="分类名称"
          show-overflow-tooltip
        ></TableColumn>
        <TableColumn label="状态" prop="status" width="100">
          <template slot-scope="scope">
            <status-badge
              :status="STATUS_MAP[scope.row.status]"
              :text="CATEGORY_STATUS_TEXT[scope.row.status]"
            ></status-badge>
          </template>
        </TableColumn>
        <TableColumn
          prop="modifyTime"
          label="操作时间"
          :formatter="formatModifierTime"
        ></TableColumn>
        <TableColumn prop="modifierName" label="操作人"></TableColumn>
        <TableColumn label="操作">
          <template slot-scope="scope">
            <Button
              @click="editCategoryName(scope.row)"
              class="editButton"
              type="text"
            >
              编辑
            </Button>
            <TablePopoverButton
              @click="editCategoryStatus(scope.row)"
              :tip="ACTION_TIP_MAP[scope.row.status]"
            >
              {{ ACTION_TEXT_MAP[scope.row.status] }}
            </TablePopoverButton>
          </template>
        </TableColumn>
      </Table>
    </panel-template>

    <Dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <Form
        label-width="100px"
        ref="singleCategory"
        :rules="rules"
        :model="singleCategory"
        @submit.native.prevent
      >
        <FormItem label="分类" prop="name">
          <Input
            v-model="singleCategory.name"
            maxlength="10"
            show-word-limit
            placeholder="请输入分类名称"
          />
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="closeDialog">取 消</Button>
        <Button type="primary" @click="submitCategory(singleCategory.name)">
          保 存
        </Button>
      </div>
    </Dialog>
  </div>
</template>