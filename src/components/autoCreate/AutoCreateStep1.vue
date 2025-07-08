<template>
  <div>
    <!-- 基本信息表单 -->
    <div v-if="currentSubStep === 0" class="narrow-form-container">
      <h4>步骤1: 配置基本信息</h4>
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="120px">
        <el-form-item label="appName" prop="appName">
          <el-input v-model="form.appName" placeholder="请输入小程序名称" />
        </el-form-item>
        <el-form-item label="platform" prop="platform">
          <el-radio-group v-model="form.platform" class="platform-radio-group">
            <el-radio-button label="douyin">
              <el-icon style="vertical-align: middle; color: #2c2c2c; margin-right: 6px;"><Platform /></el-icon>
              抖音小程序
            </el-radio-button>
            <el-radio-button label="kuaishou">
              <el-icon style="vertical-align: middle; color: #ff4e33; margin-right: 6px;"><Share /></el-icon>
              快手小程序
            </el-radio-button>
            <el-radio-button label="weixin">
              <el-icon style="vertical-align: middle; color: #07c160; margin-right: 6px;"><ChatDotRound /></el-icon>
              微信小程序
            </el-radio-button>
            <el-radio-button label="baidu">
              <el-icon style="vertical-align: middle; color: #4e6ef2; margin-right: 6px;"><Connection /></el-icon>
              百度小程序
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="version" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="appCode" prop="appCode">
          <el-input v-model="form.appCode" placeholder="例：tt_miniapp_yunyounovel" />
        </el-form-item>
        <el-form-item label="product" prop="product">
          <el-input v-model="form.product" placeholder="例：yunyounovel" />
        </el-form-item>
        <el-form-item label="customer" prop="customer">
          <el-input v-model="form.customer" placeholder="例：tt_yunyounovel" />
        </el-form-item>
        <el-form-item label="appid" prop="appid">
          <el-input v-model="form.appid" placeholder="请输入AppID" />
        </el-form-item>
        <el-form-item label="token_id" prop="token_id">
          <el-input-number v-model="form.token_id" :min="1" placeholder="请输入Token ID" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="cl" prop="cl">
          <el-input v-model="form.cl" placeholder="例：tt_miniapp_yunyounovel" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 主题色选择 -->
    <div v-if="currentSubStep === 1" class="narrow-form-container">
      <h4>步骤1: 配置主题色</h4>
      <div class="theme-selection-content">
        <el-form :model="form" label-width="120px">
          <el-form-item label="mainTheme" prop="mainTheme">
            <el-color-picker v-model="form.mainTheme" show-alpha color-format="hex" />
          </el-form-item>
          <el-form-item label="secondTheme" prop="secondTheme">
            <el-color-picker v-model="form.secondTheme" show-alpha color-format="hex" />
          </el-form-item>
          <el-form-item label="预设主题" prop="predefinedThemes">
            <div class="predefined-themes-container">
              <div
                v-for="theme in predefinedThemes"
                :key="theme.name"
                class="theme-option"
                @click="selectPredefinedTheme(theme)"
              >
                <div class="theme-colors">
                  <div class="main-color" :style="{ backgroundColor: theme.main }"></div>
                  <div class="second-color" :style="{ backgroundColor: theme.second }"></div>
                </div>
                <span class="theme-name">{{ theme.name }}</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div v-show="selectedThemeImage" class="theme-image-preview">
          <img v-if="selectedThemeImage" :src="selectedThemeImage" alt="Theme Preview" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Platform, Share, ChatDotRound, Connection } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  currentSubStep: {
    type: Number,
    required: true
  }
});
const emit = defineEmits(['update:modelValue']);

// 表单数据双向绑定
const form = ref({ ...props.modelValue });

// 监听 props 变化，更新本地表单数据
watch(() => props.modelValue, (newVal) => {
  nextTick(() => {
    // 避免不必要的更新
    if (JSON.stringify(newVal) !== JSON.stringify(form.value)) {
      form.value = { ...newVal };
    }
});
}, { deep: true });

// 监听本地表单数据变化，触发更新事件
watch(form, (newVal) => {
  nextTick(() => {
    // 避免不必要的更新
    if (JSON.stringify(newVal) !== JSON.stringify(props.modelValue)) {
      emit('update:modelValue', { ...newVal });
    }
  });
}, { deep: true });

// 表单校验规则
const formRules = {
  appName: [{ required: true, message: 'Please input app name', trigger: 'blur' }],
  platform: [{ required: true, message: 'Please select platform', trigger: 'change' }],
  version: [{ required: true, message: 'Please input version', trigger: 'blur' }],
  appCode: [{ required: true, message: 'Please input app code', trigger: 'blur' }],
  product: [{ required: true, message: 'Please input product line', trigger: 'blur' }],
  customer: [{ required: true, message: 'Please input customer identifier', trigger: 'blur' }],
  appid: [{ required: true, message: 'Please input AppID', trigger: 'blur' }],
  token_id: [{ required: true, message: 'Please input Token ID', trigger: 'blur' }],
  cl: [{ required: true, message: 'Please input CL identifier', trigger: 'blur' }],
  mainTheme: [],
  secondTheme: [],
};

// 预设主题色数据（和AutoCreate.vue保持一致）
const predefinedThemes = ref([
  { name: '阅界视窗主题色', main: '#2552F5FF', second: '#DCE7FFFF', image: 'theme_yuejie.jpg' },
  { name: '悦动故事主题色', main: '#EF5350FF', second: '#FFEBEEFF', image: 'theme_yuedong.jpg' },
  { name: '风行推广主题色', main: '#F86003FF', second: '#FFEFE7FF', image: 'theme_fun.jpg' },
  { name: '漫影主题色', main: '#FF4363FF', second: '#FFE5EBFF', image: 'theme_manying.jpg' },
]);
const selectedThemeImage = ref('');

// 选择预设主题色
const selectPredefinedTheme = (theme) => {
  // 创建一个新的对象来更新表单数据
  const newForm = {
    ...form.value,
    mainTheme: theme.main,
    secondTheme: theme.second
  };
  form.value = newForm;
  selectedThemeImage.value = `/images/theme/${theme.image}`;
  ElMessage.success(`已应用预设主题: ${theme.name}`);
};

// 表单ref和校验暴露
const formRef = ref(null);
const validate = async () => {
  if (!formRef.value) return false;
  return await formRef.value.validate().catch(() => false);
};
defineExpose({ validate });
</script>

<style scoped>
.narrow-form-container {
  max-width: 600px;
  margin: 0 auto;
}
.theme-selection-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}
.predefined-themes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}
.theme-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 12px;
  transition: all 0.2s ease-in-out;
}
.theme-option:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}
.theme-colors {
  display: flex;
  margin-right: 10px;
}
.main-color,
.second-color {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
}
.main-color {
  border-radius: 4px 0 0 4px;
}
.second-color {
  border-radius: 0 4px 4px 0;
}
.theme-name {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}
.theme-image-preview {
  width: 250px;
  height: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f5f7fa;
  flex-shrink: 0;
}
.theme-image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.platform-radio-group {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}
:deep(.el-radio-button__inner) {
  display: flex;
  align-items: center;
  font-size: 15px;
  padding: 6px 18px;
}
</style> 