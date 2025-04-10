<template>
  <div class="user-list">
    <el-card>
      <template #header>
        <div class="header">
          <h3>用户管理</h3>
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户"
            style="width: 200px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </template>

      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="registerTime" label="注册时间" />
        <el-table-column prop="lastLogin" label="最后登录" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button 
              size="small"
              @click="handleViewDetail(scope.row)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleBlock(scope.row)"
              v-if="scope.row.status === '正常'"
            >
              封禁
            </el-button>
            <el-button
              size="small"
              type="success"
              @click="handleUnblock(scope.row)"
              v-else
            >
              解封
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const users = ref([
  {
    id: 1,
    avatar: 'https://placeholder.com/50',
    nickname: '用户1',
    registerTime: '2024-03-20',
    lastLogin: '2024-03-21',
    status: '正常'
  },
  // 添加更多测试数据...
])

const filteredUsers = computed(() => {
  return users.value.filter(user => 
    user.nickname.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleViewDetail = (user) => {
  // 实现查看用户详情
}

const handleBlock = (user) => {
  ElMessageBox.confirm(`确定要封禁用户 ${user.nickname} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现封禁用户
    user.status = '已封禁'
  })
}

const handleUnblock = (user) => {
  ElMessageBox.confirm(`确定要解封用户 ${user.nickname} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现解封用户
    user.status = '正常'
  })
}
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 