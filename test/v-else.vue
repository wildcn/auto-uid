<template>
  <div data-testid="73dbacd10d83">
    <div class="labelInfo" data-testid="class.labelInfo">
      <div class="label" data-testid="class.label">
        <span data-testid="1a00b97fb252">{{ label }}</span>
      </div>
      <template v-if="!isList">
        <div v-if="!isList" class="info-panel" data-testid="class.info-panel">
          <span data-testid="685ac4cb4bb3">{{ text }}</span>
        </div>
      </template>
      <template v-else>
        <div class="info-panel" data-testid="class.info-panel">
          <div v-for="(item, index) in listData" :key="index" data-testid="9b9aeae653df">
            <div v-if="isVideo" class="video" @click="playVideo(item.playUrl)" data-testid="class.video">
              <img src="~@app/assets/video.png" class="video-logo" data-testid="class.video-logo">
              <div class="video-info" data-testid="class.video-info">
                <div data-testid="73755d9dbf88">{{ item.displayName }}</div>
                <div data-testid="02e5da0eeb44">{{ bytesToSize(item.fileSize) }}</div>
              </div>
            </div>
            <span v-else data-testid="0b2314da2b21">
              {{ dateFormat(item.ctime) + ' ' + item.body }}
            </span>
          </div>
        </div>
      </template>
    </div>
    <!-- <div v-if="!isList" class="info-panel">
      <span>{{ text }}</span>
    </div>
    <div class="info-panel" v-else>
      <div v-for="(item, index) in listData" :key="index">
        {{ item.text }}
      </div>
    </div> -->
  </div>
</template>
<script>
import { dateFormat } from '@app/utils/format.js';
export default {
  props: {
    label: String,
    text: String,
    isList: {
      type: Boolean,
      default: false
    },
    isVideo: {
      type: Boolean,
      default: false
    },
    listData: Array
  },
  data() {
    return {
      dateFormat
    };
  },
  mounted() {},
  methods: {
    playVideo(playUrl) {
      window.open(playUrl);
    },
    bytesToSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
  }
};
</script>
<style lang="scss" scoped>
.labelInfo {
  margin-bottom: 16px;
  line-height: 22px;
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  .label {
  }
  .info-panel {
    width: 665px;
  }
  .video {
    padding: 5px 10px;
    border: 1px solid #ebecef;
    height: 65px;
    width: 300px;
    cursor: pointer;

    .video-logo {
      float: left;
      width: 50px;
      height: 50px;
    }

    .video-info {
      float: left;
      padding: 3px 10px;
    }
  }
  .video:hover {
    color: #5b98f1;
  }
}
</style>
