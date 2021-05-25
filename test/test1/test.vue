<template>
  <div class="iframe" element-loading-text="数据加载中" element-loading-background="#fff" v-loading="loading" data-testid="class.iframe">
    <iframe frameborder="0" allowfullscreen v-if="!loadingFailure" @load="loadDone" ref="iframe" id="iframe" :src="src" :title="src" data-testid="id#undefined"></iframe>
    <notfound v-if="loadingFailure" :message="errorMessage" data-testid="d7a95a1ffda8">
      <template slot="btn">
        <button @click="tryAgain" type="text" data-testid="f4b29d87fa5c">再试一次</button>
        <button @click="$router.push({ path: '/workbench' })" type="text" data-testid="b8724f696d46">前往工作台</button>
      </template>
    </notfound>
  </div>
</template>

<script>
  import NotFound from "@core/view/components/error/404";

  export default {
    props: {
      src: String
    },
    components: {
      NotFound
    },
    data() {
      return {
        loading: true,
        loadingFailure: false,
        outtime: 30000, // 超时时间 ms
        errorMessage: "资源加载失败"
      };
    },
    mounted() {
      setTimeout(() => {
        // 加载超时
        if (this.loading) {
          this.loadingFailure = true;
          this.loading = false;
        }
      }, this.outtime);
    },
    methods: {
      loadDone() {
        this.loading = false;
      },
      tryAgain() {
        window.location.reload();
      }
    }
  };
</script>
<style lang="less" scoped>
  .iframe,
  iframe {
    width: 100%;
    height: 100%;
  }
</style>