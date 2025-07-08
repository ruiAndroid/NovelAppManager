<template>
  <div class="generate-app-container">
    <el-card class="workflow-container">
      <template #header>
        <div class="header">
          <h3>小程序创建</h3>
        </div>
      </template>
      <div class="workflow-content">
        <div v-if="loading" class="placeholder-content">
          <el-empty description="正在连接日志服务..." />
        </div>
        
        <div class="log-timeline-container" ref="logContentRef">
          <transition-group name="log-item-fade" tag="div">
            <div v-for="log in logs" :key="log.id" :class="['log-item', log.status]">
              <div class="log-icon">
                <template v-if="log.status === 'success'">
                  <span class="icon-bg success"><el-icon><CircleCheckFilled /></el-icon></span>
                </template>
                <template v-else-if="log.status === 'error'">
                  <span class="icon-bg error"><el-icon><CircleCloseFilled /></el-icon></span>
                </template>
                <template v-else-if="log.status === 'processing'">
                  <span class="icon-bg processing"><el-icon class="spin"><Loading /></el-icon></span>
                </template>
                <template v-else>
                  <span class="icon-bg info"><el-icon><InfoFilled /></el-icon></span>
                </template>
              </div>
              <div class="log-content-wrapper">
                <template v-if="log.isJson">
                  <pre class="json-log code-log"><code v-html="log.highlightedJson"></code></pre>
                </template>
                <template v-else-if="log.isCode">
                  <pre class="json-log code-log"><code v-html="log.highlightedCode"></code></pre>
                </template>
                <template v-else>
                  <p class="log-message">{{ log.message }}</p>
                </template>
                <span class="log-timestamp">{{ log.timestamp }}</span>
              </div>
            </div>
          </transition-group>
        </div>
        
        <div v-if="!logs.length && !loading" class="placeholder-content">
          <el-empty description="暂无生成日志" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {
  CircleCheckFilled,
  CircleCloseFilled,
  InfoFilled,
  Loading,
} from '@element-plus/icons-vue';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);

const route = useRoute();

const logs = ref([]);
const loading = ref(true); // Start with loading true
const logContentRef = ref(null);
let stompClient = null;

function tryFormatJson(msg) {
  if (typeof msg === 'object' && msg !== null) {
    const pretty = JSON.stringify(msg, null, 2);
    return {
      isJson: true,
      prettyJson: pretty,
      highlightedJson: hljs.highlight(pretty, { language: 'json' }).value,
      raw: msg
    };
  }
  if (typeof msg === 'string') {
    // 处理 export default { ... } 结构
    if (msg.trim().startsWith('export default')) {
      return { isCode: true, code: msg };
    }
    // 识别常见 JS 文件内容
    const jsKeywords = ['import ', 'export ', 'function ', 'const ', 'let ', 'var ', '=>', 'class '];
    if (jsKeywords.some(kw => msg.includes(kw))) {
      return { isCode: true, code: msg };
    }
    // 普通 JSON
    try {
      const obj = JSON.parse(msg);
      if (typeof obj === 'object' && obj !== null) {
        const pretty = JSON.stringify(obj, null, 2);
        return {
          isJson: true,
          prettyJson: pretty,
          highlightedJson: hljs.highlight(pretty, { language: 'json' }).value,
          raw: msg
        };
      }
    } catch {}
    // 不是JSON字符串
    return { isJson: false, prettyJson: '', raw: msg };
  }
  return { isJson: false, prettyJson: '', raw: msg };
}

const subscribeCreateLog = (taskId) => {
  const socket = new SockJS(`${window.location.protocol}//${window.location.hostname}:8080/ws`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 0,
    heartbeatOutgoing: 0,
    debug: () => {},
    onConnect: () => {
      loading.value = false;
      stompClient.subscribe(`/topic/novel-create-log/${taskId}`, (msg) => {
        if (msg.body) {
          const logData = JSON.parse(msg.body);
          const jsonInfo = tryFormatJson(logData.message);
          let highlightedCode = '';
          if (jsonInfo.isCode) {
            highlightedCode = hljs.highlight(jsonInfo.code, { language: 'javascript' }).value;
          }
          logs.value.push({
            id: Date.now() + Math.random(),
            message: logData.message,
            status: logData.type,
            timestamp: logData.timestamp,
            isJson: jsonInfo.isJson,
            prettyJson: jsonInfo.prettyJson,
            isCode: jsonInfo.isCode,
            code: jsonInfo.code,
            highlightedCode,
            highlightedJson: jsonInfo.highlightedJson,
          });
          
          nextTick(() => {
            if (logContentRef.value) {
              logContentRef.value.scrollTop = logContentRef.value.scrollHeight;
            }
          });
          
          if (logData.type === 'finish') {
            setTimeout(disconnectLog, 2000);
          }
        }
      });
    },
    onStompError: (frame) => {
      loading.value = false;
      logs.value.push({
        id: Date.now(),
        message: `连接日志服务失败: ${frame.headers['message']}`,
        status: 'error',
        timestamp: new Date().toLocaleTimeString('en-GB'),
      });
    },
  });
  stompClient.activate();
};

const disconnectLog = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

onMounted(() => {
  const taskId = route.query.taskId;
  if (!taskId) {
    loading.value = false;
    logs.value.push({
      id: Date.now(),
      message: '错误：未获取到任务ID，无法订阅日志。',
      status: 'error',
      timestamp: new Date().toLocaleTimeString('en-GB'),
    });
    return;
  }
  subscribeCreateLog(taskId);
});

onUnmounted(() => {
  disconnectLog();
});
</script>

<style scoped>
.generate-app-container {
  padding: 20px;
}

.workflow-container {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
}

.workflow-content {
  padding: 10px 20px;
}

.log-timeline-container {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 32px;
  min-height: 320px;
  max-height: 70vh;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
}

.log-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-left: 48px; /* Increased padding for larger icon */
  margin-bottom: 15px;
}

.log-item::before {
  content: '';
  position: absolute;
  left: 15px; /* (32px icon / 2) - 1px for line width */
  top: 5px;
  bottom: -15px;
  width: 2px;
  background-color: #e5e7eb;
  z-index: 0;
}

.log-item:last-child::before {
  display: none;
}

.log-icon {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.log-icon .icon-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  font-size: 18px; /* Adjusted icon font size */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.log-item.success .icon-bg {
  background: linear-gradient(135deg, #67c23a, #95d475);
  color: #fff;
}

.log-item.error .icon-bg {
  background: linear-gradient(135deg, #f56c6c, #f89898);
  color: #fff;
}

.log-item.info .icon-bg,
.log-item.processing .icon-bg,
.log-item.finish .icon-bg {
  background: linear-gradient(135deg, #409eff, #79bbff);
  color: #fff;
}

.log-icon .icon-bg:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.log-content-wrapper {
  padding-top: 4px;
}

.log-message {
  margin: 0;
  line-height: 1.5;
  color: #303133;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.log-timestamp {
  font-size: 0.75rem;
  color: #909399;
  margin-top: 4px;
}

.placeholder-content {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

/* Animation */
.log-item-fade-enter-active {
  transition: all 0.5s ease;
}

.log-item-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.json-log {
  background: #f6f8fa;
  color: #444;
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 6px;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  overflow-x: auto;
  line-height: 1.6;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.code-log {
  background: #f6f8fa;
  color: #24292e;
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  font-size: 13px;
  border-left: 4px solid #b3b3b3;
  padding: 10px 14px;
  border-radius: 6px;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  overflow-x: auto;
  line-height: 1.6;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
</style> 