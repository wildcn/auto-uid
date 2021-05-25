<template>
  <lxwebmenu :menudata="filterMenuData" data-testid="bb4474bf8ebe">
    <header class="header" slot="header" data-testid="class.header">
      <div class="header-main" data-testid="class.header-main">
        <dropdown class="user-info test" @command="handleCommand" v-show="isLogin" placement="bottom-end" data-testid="class.user-info test">
          <div data-testid="502ee296396f">
            <span class="org-name" v-show="org" data-testid="class.org-name">{{ org.orgName }}</span>
            <img v-if="info.avatar" class="avatar" :src="info.avatar" data-testid="class.avatar">
            <span class="user-name" data-testid="class.user-name">{{ info.name }}</span>
          </div>
          <dropdownmenu slot="dropdown" data-testid="cc6c7cc74826">
            <dropdownitem command="logout" data-testid="3928e8a8d0a7">退出登录</dropdownitem>
          </dropdownmenu>
        </dropdown>
      </div>
    </header>
    <div :class="['main', 'page-view']" data-testid="5e0d232f81d0">
      <router-view data-testid="a19606842ab0"></router-view>
    </div>
    <footer class="footer" data-testid="class.footer">
      <div data-testid="be27e3b0a894">
        <div data-testid="360089f37bec">
          <a class="links" target="_blank" href="https://login.lanxin.cn/pc/page/about/contract.jsp" data-testid="class.links">
            帮助
          </a>
          |
          <a class="links" target="_blank" href="https://login.lanxin.cn/pc/page/about/privacy.jsp" data-testid="class.links">
            隐私
          </a>
          |
          <a class="links" target="_blank" href="https://login.lanxin.cn/pc/page/about/contract.jsp" data-testid="class.links">
            条款
          </a>
        </div>
        © 2018 lanxin.cn 京ICP证150099号 京ICP备14053792号
      </div>
    </footer>
  </lxwebmenu>
</template>

<script>
import { baseService } from '@common/resources/base';
import { setCookie } from '@app/utils/cookie';
import { LICENSE_MESSAGE } from '@app/configs/message';
import { mapState, mapMutations, mapActions } from 'vuex';
import LxWebMenu from '@app/components/LanxinWebMenu.vue';
import { licenseCM } from '@common/resources/license';
import { LICENSE_OPTIONS } from '@app/configs/message';
import { isEmpty, cloneDeep, get, isUndefined } from 'lodash';
export default {
  name: 'basicLayout',
  components: {
    LxWebMenu
  },
  props: {
    headerFullPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      info: {
        name: ''
      },
      filterMenuData: []
    };
  },
  async beforeMount() {
    // 更新组织信息
    await this.getOrg();
    // 获取组织授权
    await this.getLicense();

    this.init();
  },
  computed: {
    ...mapState('conf', [
      'conf',
      'staffInfo',
      'oauthUrl',
      'org',
      'license',
      'message'
    ]),
    ...mapState('menu', ['menuData']),
    isLogin() {
      return !!this.staffInfo;
    },
    licenseNotActived() {
      return (
        isEmpty(this.license) ||
        this.license.authType === licenseCM.authType.NOT_ACTIVED
      );
    },
    licenseProbation() {
      return (
        !isEmpty(this.license) &&
        this.license.authType === licenseCM.authType.PROBATION
      );
    },
    missingSecret() {
      return (
        !isEmpty(this.license) &&
        this.license.accountType === licenseCM.accountType.XIAOYU &&
        !isEmpty(this.conf) &&
        (!this.conf.enterpriseId || !this.conf.xyDomain)
      );
    }
  },
  watch: {
    message(data, oldData) {
      if (!isEmpty(data)) {
        const [msg = {}] = data;
        const [old = {}] = oldData;
        if (msg.key !== old.key) {
          this.$message.closeAll();
          this.$message(
            Object.assign({}, msg, {
              duration: 0,
              offset: 6,
              type: 'warning'
            })
          );
        }
      } else {
        this.$message.closeAll();
      }
    },
    license: {
      deep: true,
      handler: function() {
        this.init();
      }
    },
    missingSecret(val) {
      if (val && this.$route.name !== 'ConferenceSecret') {
        this.$router.push({
          name: 'ConferenceSecret'
        });
      }
    }
  },
  async created() {
    await this.checkLogin();
  },
  methods: {
    ...mapActions('conf', ['getConf', 'getLicense', 'getOrg']),
    ...mapMutations('conf', [
      'updateStaffInfo',
      'updateOauthUrl',
      'updateMessage',
      'deleteMessage'
    ]),
    ...mapMutations('menu', ['updateMenuData']),
    async init() {
      // 过滤菜单
      this.filterMenuData = this.filterMenuByLicense(cloneDeep(this.menuData));
      // 试用状态提醒
      if (this.licenseProbation) {
        this.updateMessage(LICENSE_MESSAGE.PROBATION);
      } else {
        this.deleteMessage(LICENSE_MESSAGE.PROBATION);
      }
      // 过滤授权文件授权有效期
      this.checkLicense();

      await this.getConf();
      // 缺少token提醒
      if (this.missingSecret) {
        this.updateMessage(LICENSE_MESSAGE.MISSING_SECRET);
      } else {
        this.deleteMessage(LICENSE_MESSAGE.MISSING_SECRET);
      }
    },
    // 过滤菜单
    filterMenuByLicense(data) {
      console.log(
        '%cdata: ',
        'color: MidnightBlue; background: Aquamarine;',
        data
      );
      let filterMenuData;
      if (this.licenseNotActived) {
        // 未开通视频会议，只显示账户中心
        filterMenuData = data.filter(item => item.default);
        const defaultRouteName = 'LicenseInfo';
        if (this.$route.name !== defaultRouteName) {
          this.$router.push({ name: defaultRouteName });
        }

        // 全局未激活提示
        // this.updateMessage(LICENSE_MESSAGE.NOT_ACTIVED);
      } else {
        filterMenuData = data.filter(
          // 按照授权文件，进行菜单级过滤
          item => {
            // 多项约束的菜单控制
            const { licenseControl } = item;
            if (isUndefined(licenseControl)) {
              return true;
            }
            // 处理多点控制的菜单
            if (Array.isArray(licenseControl)) {
              return licenseControl.every(
                itemControl =>
                  this.license[itemControl] === licenseCM[itemControl].OPEN
              );
            }
            // 递归子菜单
            if (Array.isArray(item.children)) {
              item.children = this.filterMenuByLicense(item.children);
            }
            const controlVal = get(this.license, licenseControl);
            // 处理特殊菜单
            if (licenseControl === 'accountType') {
              // 蓝信账户不显示秘钥设定
              return controlVal !== licenseCM[licenseControl].LANXIN;
            }
            // 处理开关
            if (licenseCM[licenseControl] && licenseCM[licenseControl].OPEN) {
              return controlVal === licenseCM[licenseControl].OPEN;
            }
            // 处理>0的授权数字 会议设定在方数为0时不显示
            return controlVal > 0;
          }
        );
      }
      return filterMenuData;
    },
    // 检查授权文件有效期
    checkLicense() {
      if (!isEmpty(this.license) && this.license.resourceStatistics) {
        const {
          maxPersonInfo,
          spaceSizeInfo
        } = this.license.resourceStatistics;
        const expireTime = LICENSE_OPTIONS.MESSAGE_EXPIRED_TIME;
        if (
          (maxPersonInfo.tobeExpired.expireTime &&
            maxPersonInfo.tobeExpired.expireTime - Date.now() < expireTime) ||
          (spaceSizeInfo.tobeExpired.expireTime &&
            spaceSizeInfo.tobeExpired.expireTime - Date.now() < expireTime)
        ) {
          this.updateMessage(LICENSE_MESSAGE.EXPIRE);
        } else {
          this.deleteMessage(LICENSE_MESSAGE.EXPIRE);
        }
      }
    },
    async handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout();
          break;
      }
    },
    async checkLogin() {
      try {
        const adminInfo = await baseService.user();
        this.updateStaffInfo(adminInfo);
        this.info = adminInfo;
      } catch (err) {
        this.updateStaffInfo();
        this.updateOauthUrl(err.detail[0]);
        this.info = {};
        this.$router.push({ name: 'login' });
      }
    },
    async logout() {
      await baseService.logout();
      const domain = ['']
        .concat(window.location.hostname.split('.').slice(1))
        .join('.');
      setCookie('videoconference-sessionId', '', -1, domain, '/api/v1');
      // uc的cookie是sso，不清楚符合正常的sso逻辑，跨域部署后也清不掉
      setCookie('centerId', '', -1, domain, '/');
      setCookie('orgId', '', -1, domain, '/');
      this.checkLogin();
    },
    handlerLogin() {
      this.$router.push({ name: 'ConferenceRecord' });
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === 'login') {
      next();
      return;
    }
    if (this.licenseNotActived && to.name !== 'LicenseInfo') {
      this.$alert(
        '当前视频会议未启用，请联系蓝信相关人员开通视频会议功能。',
        '提醒',
        {
          type: 'warning',
          confirmButtonText: '知道了'
        }
      );
      return;
    }
    if (this.missingSecret && to.name !== 'ConferenceSecret') {
      this.$alert(
        '蓝信客户端视频会议功能、视频会议管理后台功能，必须填写此处秘钥信息后才可使用。',
        '提醒',
        {
          confirmButtonText: '知道了'
        }
      ).then(data => {
        next({
          name: 'ConferenceSecret'
        });
      });
    } else {
      next();
    }
  }
};
</script>

<style lang="scss" scoped>
.layout {
  height: auto;
  min-height: 100%;
  background-color: #f0f2f5;

  .header {
    height: 60px;
    line-height: 60px;
    padding: 0;
    flex: 1;
    justify-content: flex-end;

    .user-info {
      float: right;
      font-size: 16px;
      padding: 0 24px 0 12px;
      .avatar {
        width: 32px;
        height: 32px;
        margin-right: 5px;
        vertical-align: middle;
      }
      .org-name {
        margin-right: 10px;
      }
      .user-name {
        color: $--color-primary;
        cursor: pointer;
      }
    }
  }

  .main {
    padding: 0;
    margin: 20px 20px 0 20px;
    height: 100%;
    .content {
      margin: 200px auto;
      text-align: center;
    }
  }
  .page-view {
    margin: 0;
    overflow: none !important;
  }

  .footer {
    color: #888;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .links {
    padding: 0 6px;
    color: #888;
  }
  .links:hover {
    text-decoration: underline;
  }
}
</style>
