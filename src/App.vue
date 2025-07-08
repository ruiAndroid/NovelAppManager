<template>
  <el-container>
    <el-aside width="200px">
      <div class="logo-container">
        <img src="/images/logo/wenqu_logo.png" class="logo-image">
      </div>
      <el-menu
        :router="true"
        default-active="/apps"
        class="el-menu-vertical"
        background-color="#eef1f3"
        text-color="#333"
      >
        <el-menu-item index="/apps">
          <el-icon><Platform /></el-icon>
          <span>小程序列表</span>
        </el-menu-item>
        
        <el-menu-item index="/config">
          <el-icon><Setting /></el-icon>
          <span>微距(for测试同学)</span>
        </el-menu-item>
        
        <el-menu-item index="/ads">
          <el-icon><Picture /></el-icon>
          <span>广告</span>
        </el-menu-item>
        
        <el-menu-item index="/payment">
          <el-icon><Money /></el-icon>
          <span>支付</span>
        </el-menu-item>
        
        <el-menu-item index="/general-config">
          <el-icon><Tools /></el-icon>
          <span>通用配置</span>
        </el-menu-item>
        
        <el-menu-item index="/wenqu-auto">
          <el-icon><Monitor /></el-icon>
          <span>文曲自动化</span>
        </el-menu-item>
        
        <el-menu-item index="/wenqu-ai">
          <el-icon><ChatDotRound /></el-icon>
          <span>文曲AI</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-content">
          <h2>文曲-小说小程序创作中心</h2>
          <!-- <h4>让需求流动更简单</h4> -->
          <el-dropdown>
            <span class="admin-info">
              管理员 <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { Platform, Setting, Picture, Money, Tools, ArrowDown, Monitor, ChatDotRound } from '@element-plus/icons-vue'
</script>

<style>
.el-container {
  height: 100vh;
}

.el-aside {
  background-color: #eef1f3;
}

.logo-container {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #dcdfe6;
}

.logo-image {
  height: 50px;
  border-radius: 12px;
  object-fit: contain;
}

.el-menu {
  border-right: none;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.admin-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.el-menu-vertical {
  height: 100%;
}

.el-menu-vertical .el-menu-item {
  color: #333; /* Default text color */
}

.el-menu-vertical .el-menu-item:hover {
  background-color: #e0e3e6; /* Subtle hover effect */
}

.el-menu-vertical .el-menu-item.is-active {
  background-color: #d3dce6; /* Active background */
  color: #409eff; /* Active text color */
  border-left: 3px solid #409eff; /* Active indicator */
}
</style> 