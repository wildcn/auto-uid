<script>
import { isUndefined, get } from 'lodash';
import { Menu, Submenu, MenuItem } from 'element-ui';
import SpriteIcon from './SpriteIcon.vue';

const regUrl = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
const isUrl = function(string) {
  return regUrl.test(string);
};

const defaultPathFilter = function(path, currentPath) {
  return path;
};

const checkActive = function(path, currentPath, pathFilter) {
  const realPath = pathFilter(path, currentPath);
  return currentPath.indexOf(realPath) === 0;
};

const renderMenuItem = function(h, item, collapse, currentPath, pathFilter) {
  const { title, path, className, activeClassName, target = '_self' } = item;
  let $menuItem = null;
  if (isUrl(path)) {
    $menuItem = (
      <li class="el-menu-item">
        <a class="link el-menu-item__inner" domPropsHref={path} target={target}>
          {title}
        </a>
      </li>
    );
  } else if (!isUndefined(path)) {
    const isActive = checkActive(path, currentPath, pathFilter);
    $menuItem = (
      <MenuItem index={path} class={isActive ? 'is-active' : ''}>
        <div class="lanxin-menu-item">
          {className ? <i class={className + ' icon-logo'}></i> : ''}
          <span slot="title">{title}</span>
        </div>
        {collapse ? <span slot="title">{title}</span> : ''}
      </MenuItem>
    );
  }
  return $menuItem;
};

const renderSubMenu = function(h, item, collapse, currentPath, pathFilter) {
  const { title, path, className, activeClassName, children } = item;
  const $children = renderMenuItems(
    h,
    children,
    collapse,
    currentPath,
    pathFilter
  );
  const isActive = checkActive(path, currentPath, pathFilter);
  return (
    <Submenu index={path} class={isActive ? 'is-active' : ''}>
      <template slot="title">
        {className ? <i class={className + ' icon-logo'} data-testid="class.d664eeb1e691"></i> : ''}
        <span data-testid="99d4f2c8e66b">{title}</span>
      </template>
      {$children.map(item => item)}
    </Submenu>
  );
};

const renderMenuItems = function(
  h,
  menuData,
  collapse,
  currentPath,
  pathFilter
) {
  return menuData.map(item => {
    const { children } = item;
    const hasSubMenu = Array.isArray(children) && children.length;
    return hasSubMenu
      ? renderSubMenu(h, item, collapse, currentPath, pathFilter)
      : renderMenuItem(h, item, collapse, currentPath, pathFilter);
  });
};

export default {
  name: 'LxNavMenu',
  props: {
    data: {
      type: Array, // 菜单项数组
      required: true
    },
    defaultActive: String, // 当前激活菜单的 index
    router: Boolean, // 是否使用 vue-router 的模式
    mode: {
      type: String,
      default: 'vertical', // 模式, [horizontal / vertical]
      validator(value) {
        return ['horizontal', 'vertical'].indexOf(value) > -1;
      }
    },
    collapse: {
      type: Boolean,
      default: true
    },
    pathFilter: {
      type: Function,
      default: defaultPathFilter
    }
  },
  mounted() {
    this.$forceUpdate();
  },
  render(h) {
    const { $attrs, $props } = this;

    const { mode, defaultActive, router, data, collapse, pathFilter } = $props;
    const currentPath = this.$route.path || null;
    const $menuItems = renderMenuItems(
      h,
      data,
      collapse,
      currentPath,
      pathFilter
    );
    const $menu = (
      <Menu
        class="navmenu"
        ref="navmenu"
        unique-opened={true}
        {...{ $attrs }}
        router={router}
        defaultActive={defaultActive}
        collapse={collapse}
        mode={mode}>
        {$menuItems}
      </Menu>
    );
    return $menu;
  }
};
</script>

<style lang="scss">
// overwrite  Element menu
.lanxin-menu {
  width: 100%;
  background: $lx-new-color-main !important;
  border: none;
  overflow: hidden;
  border: none !important;

  // 覆盖element
  .el-menu-item:hover,
  .el-menu-item:focus {
    outline: none;
    background-color: inherit;
  }

  // 缩略状态一级菜单样式
  &.el-menu--collapse {
    > .el-submenu > .el-submenu__title,
    > .el-menu-item {
      padding-left: 31px !important;
    }
    > .el-menu-item > .el-tooltip {
      left: 11px !important;
    }
  }

  &:not(.el-menu--collapse) {
    .el-menu-item,
    .el-submenu {
      color: $lx-font-color-white-normal;
      background: $lx-children-menu-background;
      &.is-active > .lanxin-menu-item {
        color: $lx-font-color-white;
        background: $lx-selected-background;
      }
    }
    .el-menu-item,
    .el-submenu__title {
      height: 48px;
      line-height: 40px;
      padding: 4px 0;
    }
    > .el-menu-item,
    > .el-submenu > .el-submenu__title {
      background: $lx-new-color-main;
    }

    // 一级菜单缩进
    > .el-menu-item {
      padding-left: 0px !important;
    }
    > .el-menu-item > .lanxin-menu-item,
    > .el-submenu > .el-submenu__title {
      padding-left: 24px !important;
    }
  }

  // 展开选中状态高亮文字
  &:not(.el-menu--collapse) .el-submenu.is-active > .el-submenu__title {
    // background: $lx-new-color-main;
    color: $lx-font-color-white;
  }

  .el-menu-item:hover,
  .el-submenu__title:hover {
    color: $lx-font-color-white !important;
    .el-submenu__icon-arrow {
      color: $lx-font-color-white !important;
    }
  }
  .el-menu .el-submenu__title:hover {
    background: inherit !important;
  }
  &.el-menu--collapse {
    > .el-menu-item:hover,
    .el-submenu__title {
      background: $lx-new-color-main !important;
    }
    .icon-logo {
      font-size: 20px;
    }
  }

  .el-submenu__title {
    padding-right: 24px;
    color: $lx-font-color-white-normal;
  }

  // 二级菜单背景
  &.el-menu .el-menu {
    background: $lx-children-menu-background;
    padding-bottom: 1px;
  }

  // 二级菜单缩进
  .el-menu.el-menu--inline .el-menu-item {
    padding-left: 0px !important;
  }
  .el-menu.el-menu--inline > .el-menu-item .lanxin-menu-item,
  .el-menu.el-menu--inline > .el-submenu > .el-submenu__title {
    padding-left: 52px !important;
  }

  // 三级菜单缩进
  .el-menu.el-menu--inline .el-menu--inline {
    > .el-menu-item .lanxin-menu-item,
    > .el-submenu > .el-submenu__title {
      padding-left: 68px !important;
    }
  }

  .icon-logo {
    display: inline-block;
    margin-right: 5px;
  }
  .is-active .icon-logo .icon-logo-list {
    left: -16px;
  }
  .el-menu-item,
  .el-submenu__title {
    &:hover .icon-logo .icon-logo-list {
      left: -16px;
    }
  }

  .el-submenu__icon-arrow {
    color: $lx-font-color-white-normal;
    top: 54%;
  }
  .is-active > .el-submenu__title > .el-submenu__icon-arrow {
    color: $lx-font-color-white;
  }
}

.el-menu--vertical {
  .el-menu {
    background: $lx-children-menu-background;
    // 悬浮二级菜单
    &.el-menu--popup {
      border-radius: 4px;
    }

    .el-submenu__title {
      margin-top: 4px;
      margin-bottom: 8px;
    }
    .el-menu-item {
      margin-top: 4px;
      margin-bottom: 4px;
    }
    &.el-menu--popup {
      padding: 0;
    }
    .el-submenu__title,
    .el-menu-item {
      height: 40px;
      line-height: 40px;
      color: $lx-font-color-white-normal;
      background: $lx-children-menu-background;
      &:hover {
        color: $lx-font-color-white;
        // background: $lx-children-menu-background;
      }
      &.is-active {
        color: $lx-font-color-white;
        background: $lx-selected-background;
      }
    }
    .el-submenu.is-active .el-submenu__title {
      color: $lx-font-color-white;
    }
  }
  // 缩略状态下，active时二级菜单右边的箭头不反转
  .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
    transform: rotateZ(0deg) !important;
    top: 54%;
  }
  .el-submenu.is-active,
  .el-submenu:hover {
    > .el-submenu__title .el-submenu__icon-arrow {
      color: $lx-font-color-white;
    }
  }
}
</style>
