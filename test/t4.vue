<template lang="html">
  <BasicDialog ref="dialog" title="选择人员" data-auid="2ab27feb2d59" :visible.sync="dialogVisible" :width="width" @confirm="handleConfirm" @cancel="handleCancel">
    <Button v-if="mode !== 'tag'" slot="trigger" data-auid="72b4377bd4d0" :disabled="disabled" :type="buttonType" @click="handleTriggerClick">
      <slot name="button-name" data-auid="8b0d2010b00c">选择人员</slot>
    </Button>
    <TagSelector v-if="mode === 'tag'" slot="trigger" placeholder="请选择人员" data-auid="94772efee944" :tags="selectedTags" :disabled="disabled" @click.native="handleTriggerClick" @remove="removeTag"></TagSelector>
    <div class="selector" data-auid="a2628a8b4afb" :style="{ height: height }">
      <Row data-auid="59ac60e20a62" :gutter="20">
        <Col class="main" data-auid="39bd16810149" :span="15">
          <Input v-model.trim="keyword" placeholder="请输入人员名称或手机号码" data-auid="7c3ac6e73df4">
            <i v-if="keyword !== ''" class="input-icon el-input__icon el-icon-circle-close-outline" slot="suffix" data-auid="7f9cc0518cea" @click="keyword = ''"></i>
            <i class="input-icon el-input__icon el-icon-search" slot="suffix" data-auid="43f4c46d1e1d" @click="search"></i>
          </Input>
          <div class="container" data-auid="301cce73bab1">
            <Row v-show="!keyword" data-auid="4ba299a9e48b" :gutter="10">
              <Col data-auid="88a7f01976de" :span="15">
                <SectorTree class="tree" data-test-tree_sector data-auid="f980d9e9e188" :markid="markId" :show-checkbox="false" @node-click="handleNodeClick"></SectorTree>
              </Col>
              <Col data-auid="f6d37e9be455" :span="9">
                <StaffList empty-text="当前分支无人员信息" data-auid="b2702117f147" :items="staffItems" :selectedkeys="selectedStaffIds" :loading="staffLoading" :maxcount="maxCount" @select="handleStaffChange" @selectall="handleAllStaffChange"></StaffList>
              </Col>
            </Row>
            <StaffList v-show="keyword" emptytext="未查询到符合条件的结果" data-auid="46738272bec1" :show-check-all="false" :items="searchResult" :selectedkeys="selectedStaffIds" :loading="searchResultLoading" :maxcount="maxCount" @select="handleStaffChange"></StaffList>
          </div>
        </Col>
        <Col class="result" data-auid="ec4583c59b17" :span="9">
          <div class="summary" data-test-span_selected data-auid="f91d463ee27a">
            已选人员 {{ selectedStaffs.length }} 个
            {{ this.maxCount ? `（最多${this.maxCount}个）` : '' }}
          </div>
          <div class="list" data-auid="301cce73bab1@2">
            <div v-for="staff in selectedStaffs" class="item" :key="staff.id" data-auid="36eaab6e6c88">
              <span class="name" data-auid="4ed4f4d7dca8">{{ staff.name }}</span>
              <span class="mobilePhone" data-auid="2b41c0edf459">{{ staff.mobilePhone }}</span>
              <span class="close el-icon-close" data-auid="e5ed4a150186" @click="deselect(staff.id)"></span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </BasicDialog>
</template>
