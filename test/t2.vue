<template>
  <div v-if="errorLogs.length>0" data-auid="2b93dd938e24">
    <el-badge style="line-height: 25px;margin-top: -5px;" data-auid="1e7a328394f3" :is-dot="true" @click.native="dialogTableVisible=true">
      <el-button style="padding: 8px 10px;" size="small" type="danger" data-auid="8f51a7b6e99d">
        <svg-icon icon-class="bug" data-auid="f7a8e8c6d359" />
      </el-button>
    </el-badge>

    <el-dialog width="80%" append-to-body="" data-auid="c22dff9a4054" :visible.sync="dialogTableVisible">
      <div slot="title" data-auid="c0394702835c">
        <span style="padding-right: 10px;" data-auid="e7759f973bea">Error Log</span>
        <el-button size="mini" type="primary" icon="el-icon-delete" data-auid="41501ccb5d01" @click="clearAll">Clear All</el-button>
      </div>
      <el-table border="" data-auid="e1c5c5d95042" :data="errorLogs">
        <el-table-column label="Message">
          <template slot-scope="{row}">
            <div data-auid="c26d45963848">
              <span class="message-title" data-auid="6b5cf727c0cc@2">Msg:</span>
              <el-tag type="danger" data-auid="f9a798e84d9e@2">
                {{ row.err.message }}
              </el-tag>
            </div>
            <br data-auid="169affeb7c30">
            <div data-auid="c4cda91bdde3">
              <span class="message-title" style="padding-right: 10px;" data-auid="6b5cf727c0cc@2">Info: </span>
              <el-tag type="warning" data-auid="f9a798e84d9e@2">
                {{ row.vm.$vnode.tag }} error in {{ row.info }}
              </el-tag>
            </div>
            <br data-auid="98db555374af">
            <div data-auid="0661614740e5">
              <span class="message-title" style="padding-right: 16px;" data-auid="6b5cf727c0cc@2">Url: </span>
              <el-tag type="success" data-auid="f9a798e84d9e@2">
                {{ row.url }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Stack">
          <template slot-scope="scope">
            {{ scope.row.err.stack }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>