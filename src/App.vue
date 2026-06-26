<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': collapsed }">
    <!-- 左侧菜单栏 - 严格匹配原始页面 -->
    <aside class="sidebar">
      <!-- 品牌/Logo -->
      <div class="brand">
        <svg class="brand-logo" viewBox="0 0 28 28" width="28" height="28">
          <rect x="2" y="2" width="24" height="24" rx="6" fill="none" stroke="#e24b8d" stroke-width="2"/>
          <rect x="8" y="8" width="12" height="12" rx="3" fill="#e24b8d" opacity="0.85"/>
          <path d="M8 14 L20 14" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M14 8 L14 20" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="brand-text">兑换系统</span>
      </div>

      <!-- 菜单列表 -->
      <nav class="menu-list">
        <!-- 一级菜单: 社区兑换 (可展开) -->
        <div class="menu-group" :class="{ expanded: expandedMenu === 'community' }">
          <div class="menu-item" :class="{ active: expandedMenu === 'community' }" @click="toggleMenu('community')">
            <svg class="menu-icon" viewBox="0 0 16 16" width="16" height="16">
              <rect x="0.5" y="0.5" width="15" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.2"/>
              <line x1="0.5" y1="5.5" x2="15.5" y2="5.5" stroke="currentColor" stroke-width="1"/>
              <line x1="5.5" y1="5.5" x2="5.5" y2="15.5" stroke="currentColor" stroke-width="1"/>
              <line x1="10.5" y1="5.5" x2="10.5" y2="15.5" stroke="currentColor" stroke-width="1"/>
            </svg>
            <span>社区兑换</span>
            <svg class="menu-arrow" :class="{ rotated: expandedMenu === 'community' }" viewBox="0 0 10 6" width="10" height="6">
              <path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div v-show="expandedMenu === 'community'" class="sub-menu">
            <div class="sub-item" :class="{ active: activeSubMenu === 'community-pool' }" @click="activeSubMenu = 'community-pool'">
              兑换奖池管理
            </div>
            <div class="sub-item" :class="{ active: activeSubMenu === 'community-prize' }" @click="activeSubMenu = 'community-prize'">
              兑换奖品管理
            </div>
            <div class="sub-item" :class="{ active: activeSubMenu === 'community-detail' }" @click="activeSubMenu = 'community-detail'">
              奖品兑换明细
            </div>
            <div class="sub-item" :class="{ active: activeSubMenu === 'community-coupon' }" @click="activeSubMenu = 'community-coupon'">
              优惠券管理
            </div>
          </div>
        </div>

        <!-- 一级菜单: 社区任务中心 (可展开) -->
        <div class="menu-group" :class="{ expanded: expandedMenu === 'task' }">
          <div class="menu-item" :class="{ active: expandedMenu === 'task' }" @click="toggleMenu('task')">
            <svg class="menu-icon" viewBox="0 0 16 16" width="16" height="16">
              <rect x="0.5" y="0.5" width="15" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.2"/>
              <line x1="0.5" y1="5.5" x2="15.5" y2="5.5" stroke="currentColor" stroke-width="1"/>
              <line x1="5.5" y1="5.5" x2="5.5" y2="15.5" stroke="currentColor" stroke-width="1"/>
              <line x1="10.5" y1="5.5" x2="10.5" y2="15.5" stroke="currentColor" stroke-width="1"/>
            </svg>
            <span>社区任务中心</span>
            <svg class="menu-arrow" :class="{ rotated: expandedMenu === 'task' }" viewBox="0 0 10 6" width="10" height="6">
              <path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div v-show="expandedMenu === 'task'" class="sub-menu">
            <div class="sub-item" :class="{ active: activeSubMenu === 'task-pool' }" @click="activeSubMenu = 'task-pool'">
              兑换奖池管理
            </div>
            <div class="sub-item" :class="{ active: activeSubMenu === 'task-prize' }" @click="activeSubMenu = 'task-prize'">
              兑换奖品管理
            </div>
            <div class="sub-item" :class="{ active: activeSubMenu === 'task-detail' }" @click="activeSubMenu = 'task-detail'">
              奖品兑换明细
            </div>
            <div class="sub-item" :class="{ active: activeSubMenu === 'task-coupon' }" @click="activeSubMenu = 'task-coupon'">
              优惠券管理
            </div>
          </div>
        </div>

        <!-- 一级菜单: 社区活动 (可展开) -->
        <div class="menu-group" :class="{ expanded: expandedMenu === 'activity' }">
          <div class="menu-item" :class="{ active: expandedMenu === 'activity' }" @click="toggleMenu('activity')">
            <svg class="menu-icon" viewBox="0 0 16 16" width="16" height="16">
              <rect x="0.5" y="0.5" width="15" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.2"/>
              <line x1="0.5" y1="5.5" x2="15.5" y2="5.5" stroke="currentColor" stroke-width="1"/>
              <line x1="5.5" y1="5.5" x2="5.5" y2="15.5" stroke="currentColor" stroke-width="1"/>
              <line x1="10.5" y1="5.5" x2="10.5" y2="15.5" stroke="currentColor" stroke-width="1"/>
            </svg>
            <span>社区活动</span>
            <svg class="menu-arrow" :class="{ rotated: expandedMenu === 'activity' }" viewBox="0 0 10 6" width="10" height="6">
              <path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div v-show="expandedMenu === 'activity'" class="sub-menu">
            <div class="sub-item" :class="{ active: activeSubMenu === 'activity-pool' }" @click="activeSubMenu = 'activity-pool'">
              兑换奖池管理
            </div>
            <div class="sub-item" :class="{ active: activeSubMenu === 'activity-prize' }" @click="activeSubMenu = 'activity-prize'">
              兑换奖品管理
            </div>
            <div class="sub-item" :class="{ active: activeSubMenu === 'activity-detail' }" @click="activeSubMenu = 'activity-detail'">
              奖品兑换明细
            </div>
            <div class="sub-item" :class="{ active: activeSubMenu === 'activity-coupon' }" @click="activeSubMenu = 'activity-coupon'">
              优惠券管理
            </div>
          </div>
        </div>

        <!-- 一级菜单: 金豆兑换 (可展开, 当前展开) -->
        <div class="menu-group" :class="{ expanded: expandedMenu === 'goldBean' }">
          <div class="menu-item" :class="{ active: expandedMenu === 'goldBean' }" @click="toggleMenu('goldBean')">
            <svg class="menu-icon" viewBox="0 0 16 16" width="16" height="16">
              <rect x="0.5" y="0.5" width="15" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.2"/>
              <line x1="0.5" y1="5.5" x2="15.5" y2="5.5" stroke="currentColor" stroke-width="1"/>
              <line x1="5.5" y1="5.5" x2="5.5" y2="15.5" stroke="currentColor" stroke-width="1"/>
              <line x1="10.5" y1="5.5" x2="10.5" y2="15.5" stroke="currentColor" stroke-width="1"/>
            </svg>
            <span>金豆兑换</span>
            <svg class="menu-arrow" :class="{ rotated: expandedMenu === 'goldBean' }" viewBox="0 0 10 6" width="10" height="6">
              <path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <!-- 子菜单 -->
          <div v-show="expandedMenu === 'goldBean'" class="sub-menu">
            <div class="sub-item" :class="{ active: activeSubMenu === 'pool' }" @click="activeSubMenu = 'pool'">
              兑换奖池管理
            </div>
            <div class="sub-item active" @click="activeSubMenu = 'prize'">
              兑换奖品管理
            </div>
            <div class="sub-item" :class="{ active: activeSubMenu === 'detail' }" @click="activeSubMenu = 'detail'">
              奖品兑换明细
            </div>
          </div>
        </div>
      </nav>

      <!-- 底部折叠按钮 -->
      <div class="sidebar-fold" @click="collapsed = !collapsed">
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path d="M10 3 L5 8 L10 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="13" y1="3" x2="13" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <div class="main-area">
      <!-- 顶部导航 -->
      <header class="topbar">
        <div class="topbar-left">
          <!-- 面包屑 -->
        </div>
        <div class="topbar-right">
          <div class="user-dropdown">
            <span class="user-name">张家敏</span>
            <svg class="user-arrow" viewBox="0 0 10 6" width="10" height="6">
              <path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <PrizeExchangeManagement :activeMenu="expandedMenu" />
    </div>
  </div>
</template>

<script>
import PrizeExchangeManagement from './components/PrizeExchangeManagement.vue'

export default {
  name: 'App',
  components: { PrizeExchangeManagement },
  data() {
    return {
      collapsed: false,
      expandedMenu: 'goldBean',
      activeTopMenu: '',
      activeSubMenu: 'prize'
    }
  },
  methods: {
    toggleMenu(key) {
      this.expandedMenu = this.expandedMenu === key ? '' : key
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  color: #303133;
  background: #f0f2f5;
}

/* ============ Layout ============ */
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ============ Sidebar ============ */
.sidebar {
  width: 200px;
  min-width: 200px;
  background: #fff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8e8e8;
  transition: width 0.2s, min-width 0.2s;
  position: relative;
}

.app-layout.sidebar-collapsed .sidebar {
  width: 64px;
  min-width: 64px;
}

.app-layout.sidebar-collapsed .brand-text,
.app-layout.sidebar-collapsed .menu-item span,
.app-layout.sidebar-collapsed .menu-arrow,
.app-layout.sidebar-collapsed .sub-menu {
  display: none;
}

.app-layout.sidebar-collapsed .brand {
  justify-content: center;
  padding: 0;
}

.app-layout.sidebar-collapsed .menu-item {
  justify-content: center;
  padding: 12px 0;
}

.app-layout.sidebar-collapsed .menu-icon {
  margin-right: 0;
}

/* Brand */
.brand {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.brand-logo {
  flex-shrink: 0;
}

.brand-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
}

/* Menu List */
.menu-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 20px;
  font-size: 14px;
  color: #595959;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  user-select: none;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item.active {
  color: #e24b8d;
  background: #fff0f6;
}

.menu-icon {
  flex-shrink: 0;
  opacity: 0.75;
}

.menu-item.active .menu-icon {
  opacity: 1;
}

.menu-arrow {
  flex-shrink: 0;
  margin-left: auto;
  color: #bfbfbf;
  transition: transform 0.2s;
}

.menu-arrow.rotated {
  transform: rotate(180deg);
}

/* Sub Menu */
.sub-menu {
  overflow: hidden;
}

.sub-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 20px 0 52px;
  font-size: 14px;
  color: #595959;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  user-select: none;
}

.sub-item:hover {
  background: #f5f5f5;
}

.sub-item.active {
  color: #e24b8d;
  background: #fff0f6;
}

/* Sidebar Fold Button */
.sidebar-fold {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e8e8e8;
  color: #bfbfbf;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.15s;
}

.sidebar-fold:hover {
  color: #595959;
}

.app-layout.sidebar-collapsed .sidebar-fold {
  border-top: 1px solid #e8e8e8;
}

/* ============ Main Area ============ */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Top Bar */
.topbar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
  flex-shrink: 0;
}

.topbar-left {
  flex: 1;
}

.topbar-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background 0.15s;
}

.user-dropdown:hover {
  background: #f5f5f5;
}

.user-name {
  font-size: 14px;
  color: #303133;
}

.user-arrow {
  color: #bfbfbf;
}
</style>
