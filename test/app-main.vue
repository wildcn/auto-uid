<template>
  <div class="app-wrapper" data-auid="e3c3e4302581" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" data-auid="123" @click="handleClickOutside" />
    <sidebar class="sidebar-container" data-auid="ad4acc2639b7" />
    <div class="main-container" data-auid="71a774858286" :class="{hasTagsView:needTagsView}">
      <div data-auid="5a9b333370ed" :class="{'fixed-header':fixedHeader}">
        <navbar data-auid="44bf2a9f2b62" /></div></div>
        <tags-view v-if="needTagsView" data-auid="f15ee9b96c30" />
      </div>
      <app-main data-auid="c2d86674a448" />
      <right-panel v-if="showSettings" data-auid="60ce65fb695a">
        <settings data-auid="0daff770a7cc" /></right-panel>
      
    
  
</template>