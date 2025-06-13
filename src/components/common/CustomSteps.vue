<template>
  <div class="custom-steps-container">
    <template v-for="(step, index) in steps" :key="index">
      <div
        :class="['custom-step', { 'is-active': index === activeStep, 'is-completed': index < activeStep }]"
      >
        <div class="step-head">
          <div class="step-icon">
            <span v-if="index < activeStep" class="icon-completed">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
        </div>
        <div class="step-main">
          <div class="step-title">{{ step.title }}</div>
          <div class="step-description">{{ step.description }}</div>
        </div>
      </div>
      <div
        v-if="index < steps.length - 1"
        :class="['step-line', { 'is-completed-line': index < activeStep }]" >
      </div>
    </template>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  activeStep: {
    type: Number,
    default: 0
  },
  steps: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['step-click'])

// Removed progressLineWidth as it's no longer needed for individual lines

</script>

<style scoped>
.custom-steps-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
  width: 100%;
}

/* Removed custom-steps-container::before and ::after as lines are now individual elements */

.custom-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto; /* Ensure step only takes its content width */
  position: relative;
  text-align: center;
  cursor: pointer;
  z-index: 1; /* Ensure steps are above the lines */
}

.step-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 10px;
}

.step-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #dcdfe6;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 18px;
  font-weight: bold;
  display: grid;
  place-content: center;
  transition: all 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  z-index: 2; /* Icon above lines */
  flex-shrink: 0;
}

.custom-step.is-active .step-icon {
  background-color: var(--el-color-primary);
  color: #fff;
  border-color: var(--el-color-primary);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
  animation: pulse 1.5s infinite;
}

.custom-step.is-completed .step-icon {
  background-color: var(--el-color-success);
  color: #fff;
  border-color: var(--el-color-success);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.25);
}

.icon-completed {
  font-size: 20px;
  line-height: 1;
}

.step-main {
  text-align: center;
  padding-top: 10px;
}

.step-title {
  font-size: 17px;
  font-weight: 600;
  color: #606266;
  line-height: 1.2;
}

.custom-step.is-active .step-title {
  color: var(--el-color-primary);
}

.custom-step.is-completed .step-title {
  color: var(--el-color-success);
}

.step-description {
  font-size: 14px;
  color: #909399;
  line-height: 1.5;
}

.custom-step.is-active .step-description {
  color: var(--el-color-primary-light-3);
}

.custom-step.is-completed .step-description {
  color: var(--el-color-success-light-3);
}

/* New styles for step-line */
.step-line {
  flex: 1; /* Make the line take flexible space */
  height: 3px;
  background-color: #dcdfe6; /* Default grey line */
  margin: 0 -18px; /* Negative margin to make it go under icons */
  z-index: 0;
  transition: background-color 0.3s ease-in-out;
}

.step-line.is-completed-line {
  background-color: var(--el-color-primary); /* Blue color for completed segments */
}

/* 脉冲动画 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style> 