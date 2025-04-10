<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        :router="true"
        default-active="/apps"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#fff"
      >
        <el-menu-item index="/apps">
          <el-icon><Platform /></el-icon>
          <span>小程序列表</span>
        </el-menu-item>
        
        <el-menu-item index="/config">
          <el-icon><Setting /></el-icon>
          <span>微距</span>
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
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-content">
          <h2>小说小程序管理系统</h2>
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
import { Platform, Setting, Picture, Money, Tools, ArrowDown } from '@element-plus/icons-vue'
</script>

<style>
.el-container {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
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
</style> 