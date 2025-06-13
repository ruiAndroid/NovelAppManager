<template>
  <div class="ai-create-module">
    <el-card class="workflow-container">
      <template #header>
        <div class="header">
          <h3>创意小程序孵化器 - 创建向导</h3>
        </div>
      </template>
      <div class="workflow-content">
        <CustomSteps :active-step="currentStep" :steps="stepsData" @step-click="handleStepClick" />

        <!-- 步骤内容 -->
        <div class="step-panel">
          <!-- 步骤1: 配置基本信息 -->
          <div v-if="currentStep === 0">
            <AiCreateStep1
              v-model="basicInfoForm"
              :current-sub-step="currentSubStep"
              @update:current-sub-step="currentSubStep = $event"
              ref="basicInfoStepRef"
            />
          </div>

          <!-- 步骤2: 配置支付，广告信息 -->
          <div v-if="currentStep === 1">
            <!-- 步骤2.1: 微距配置 -->
            <div v-if="currentSubStep === 0" class="narrow-form-container">
              <h4>步骤2: 微距配置</h4>
              <el-form :model="microConfigForm" :rules="microConfigFormRules" ref="microConfigFormRef" label-width="120px">
                <el-form-item label="deliverId" prop="deliverId">
                  <el-input v-model="microConfigForm.deliverId" placeholder="请输入deliverId" />
                </el-form-item>
                <el-form-item label="bannerId" prop="bannerId">
                  <el-input v-model="microConfigForm.bannerId" placeholder="请输入bannerId" />
                </el-form-item>
              </el-form>
            </div>

            <!-- 步骤2.2: 支付配置 -->
            <div v-if="currentSubStep === 1" class="wide-form-container">
              <h4>步骤2: 支付配置</h4>
              <el-form :model="paymentConfigForm" :rules="paymentConfigFormRules" ref="paymentConfigFormRef" style="width: 100%;">
                <div class="payment-config-grid">
                  <!-- 普通支付配置 -->
                  <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                    <div class="payment-card-wrapper">
                      <div class="payment-card-header" :class="{ 'configured': paymentConfigForm.normalPay.enabled && paymentConfigForm.normalPay.gatewayAndroid && paymentConfigForm.normalPay.gatewayIos }">
                        <div class="payment-type-info">
                          <el-icon><Money /></el-icon>
                          <div class="payment-type-title">
                            <h4>普通支付</h4>
                          </div>
                        </div>
                        <el-tag size="small" :type="paymentConfigForm.normalPay.enabled ? 'success' : 'info'" effect="plain">
                          {{ paymentConfigForm.normalPay.enabled ? '已启用' : '未启用' }}
                        </el-tag>
                      </div>

                      <div class="payment-card-content">
                        <div class="payment-info-list">
                          <div class="payment-info-item">
                            <span class="label">状态</span>
                            <el-switch v-model="paymentConfigForm.normalPay.enabled" />
                          </div>
                          <el-form-item label="网关(A)" prop="normalPay.gatewayAndroid" class="gateway-form-item">
                            <div v-if="paymentConfigForm.normalPay.enabled">
                              <el-input v-model="paymentConfigForm.normalPay.gatewayAndroid" placeholder="请输入网关 (Android)" />
                            </div>
                          </el-form-item>
                          <el-form-item label="网关(I)" prop="normalPay.gatewayIos" class="gateway-form-item">
                            <div v-if="paymentConfigForm.normalPay.enabled">
                              <el-input v-model="paymentConfigForm.normalPay.gatewayIos" placeholder="请输入网关 (iOS)" />
                            </div>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </el-card>

                  <!-- 订单支付配置 -->
                  <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                    <div class="payment-card-wrapper">
                      <div class="payment-card-header" :class="{ 'configured': paymentConfigForm.orderPay.enabled && paymentConfigForm.orderPay.gatewayAndroid && paymentConfigForm.orderPay.gatewayIos }">
                        <div class="payment-type-info">
                          <el-icon><Goods /></el-icon>
                          <div class="payment-type-title">
                            <h4>通用交易支付</h4>
                          </div>
                        </div>
                        <el-tag size="small" :type="paymentConfigForm.orderPay.enabled ? 'success' : 'info'" effect="plain">
                          {{ paymentConfigForm.orderPay.enabled ? '已启用' : '未启用' }}
                        </el-tag>
                      </div>

                      <div class="payment-card-content">
                        <div class="payment-info-list">
                          <div class="payment-info-item">
                            <span class="label">状态</span>
                            <el-switch v-model="paymentConfigForm.orderPay.enabled" />
                          </div>
                          <el-form-item label="网关(A)" prop="orderPay.gatewayAndroid" class="gateway-form-item">
                            <div v-if="paymentConfigForm.orderPay.enabled">
                              <el-input v-model="paymentConfigForm.orderPay.gatewayAndroid" placeholder="请输入网关 (Android)" />
                            </div>
                          </el-form-item>
                          <el-form-item label="网关(I)" prop="orderPay.gatewayIos" class="gateway-form-item">
                            <div v-if="paymentConfigForm.orderPay.enabled">
                              <el-input v-model="paymentConfigForm.orderPay.gatewayIos" placeholder="请输入网关 (iOS)" />
                            </div>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </el-card>

                  <!-- 连包支付配置 -->
                  <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                    <div class="payment-card-wrapper">
                      <div class="payment-card-header" :class="{ 'configured': paymentConfigForm.renewPay.enabled && paymentConfigForm.renewPay.gatewayAndroid && paymentConfigForm.renewPay.gatewayIos }">
                        <div class="payment-type-info">
                          <el-icon><Calendar /></el-icon>
                          <div class="payment-type-title">
                            <h4>连包支付</h4>
                          </div>
                        </div>
                        <el-tag size="small" :type="paymentConfigForm.renewPay.enabled ? 'success' : 'info'" effect="plain">
                          {{ paymentConfigForm.renewPay.enabled ? '已启用' : '未启用' }}
                        </el-tag>
                      </div>

                      <div class="payment-card-content">
                        <div class="payment-info-list">
                          <div class="payment-info-item">
                            <span class="label">状态</span>
                            <el-switch v-model="paymentConfigForm.renewPay.enabled" />
                          </div>
                          <el-form-item label="网关(A)" prop="renewPay.gatewayAndroid" class="gateway-form-item">
                            <div v-if="paymentConfigForm.renewPay.enabled">
                              <el-input v-model="paymentConfigForm.renewPay.gatewayAndroid" placeholder="请输入网关 (Android)" />
                            </div>
                          </el-form-item>
                          <el-form-item label="网关(I)" prop="renewPay.gatewayIos" class="gateway-form-item">
                            <div v-if="paymentConfigForm.renewPay.enabled">
                              <el-input v-model="paymentConfigForm.renewPay.gatewayIos" placeholder="请输入网关 (iOS)" />
                            </div>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </el-card>

                  <!-- 抖钻支付配置 (抖音平台特有) -->
                  <template v-if="basicInfoForm.platform === '抖音'">
                    <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                      <div class="payment-card-wrapper">
                        <div class="payment-card-header" :class="{ 'configured': paymentConfigForm.douzuanPay.enabled && paymentConfigForm.douzuanPay.gatewayAndroid && paymentConfigForm.douzuanPay.gatewayIos }">
                          <div class="payment-type-info">
                            <el-icon><Star /></el-icon>
                            <div class="payment-type-title">
                              <h4>抖钻支付</h4>
                            </div>
                          </div>
                          <el-tag size="small" :type="paymentConfigForm.douzuanPay.enabled ? 'success' : 'info'" effect="plain">
                            {{ paymentConfigForm.douzuanPay.enabled ? '已启用' : '未启用' }}
                          </el-tag>
                        </div>

                        <div class="payment-card-content">
                          <div class="payment-info-list">
                            <div class="payment-info-item">
                              <span class="label">状态</span>
                              <el-switch v-model="paymentConfigForm.douzuanPay.enabled" />
                            </div>
                            <el-form-item label="网关(A)" prop="douzuanPay.gatewayAndroid" class="gateway-form-item">
                              <div v-if="paymentConfigForm.douzuanPay.enabled">
                                <el-input v-model="paymentConfigForm.douzuanPay.gatewayAndroid" placeholder="请输入网关 (Android)" />
                              </div>
                            </el-form-item>
                            <el-form-item label="网关(I)" prop="douzuanPay.gatewayIos" class="gateway-form-item">
                              <div v-if="paymentConfigForm.douzuanPay.enabled">
                                <el-input v-model="paymentConfigForm.douzuanPay.gatewayIos" placeholder="请输入网关 (iOS)" />
                              </div>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </template>

                  <!-- 微信虚拟支付配置 (微信平台特有) -->
                  <template v-if="basicInfoForm.platform === '微信'">
                    <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                      <div class="payment-card-wrapper">
                        <div class="payment-card-header" :class="{ 'configured': paymentConfigForm.wxVirtualPay.enabled && paymentConfigForm.wxVirtualPay.gatewayAndroid && paymentConfigForm.wxVirtualPay.gatewayIos }">
                          <div class="payment-type-info">
                            <el-icon><Wallet /></el-icon>
                            <div class="payment-type-title">
                              <h4>微信虚拟支付</h4>
                            </div>
                          </div>
                          <el-tag size="small" :type="paymentConfigForm.wxVirtualPay.enabled ? 'success' : 'info'" effect="plain">
                            {{ paymentConfigForm.wxVirtualPay.enabled ? '已启用' : '未启用' }}
                          </el-tag>
                        </div>

                        <div class="payment-card-content">
                          <div class="payment-info-list">
                            <div v-if="paymentConfigForm.wxVirtualPay.enabled">
                              <el-input v-model="paymentConfigForm.wxVirtualPay.gatewayAndroid" placeholder="请输入网关 (Android)" />
                            </div>
                            <el-form-item label="网关(A)" prop="wxVirtualPay.gatewayAndroid" class="gateway-form-item">
                            </el-form-item>
                            <el-form-item label="网关(I)" prop="wxVirtualPay.gatewayIos" class="gateway-form-item">
                              <div v-if="paymentConfigForm.wxVirtualPay.enabled">
                                <el-input v-model="paymentConfigForm.wxVirtualPay.gatewayIos" placeholder="请输入网关 (iOS)" />
                              </div>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </template>
                </div>
              </el-form>
            </div>

            <!-- 步骤2.3: 广告配置 -->
            <div v-if="currentSubStep === 2" class="wide-form-container">
              <h4>步骤2: 广告配置</h4>
              <el-form :model="adConfigForm" :rules="adConfigFormRules" ref="adConfigFormRef" style="width: 100%;">
                <div class="payment-config-grid">
                  <!-- 激励广告配置 -->
                  <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                    <div class="payment-card-wrapper">
                      <div class="payment-card-header" :class="{ 'configured': adConfigForm.rewardPay.enabled && adConfigForm.rewardPay.rewardAdId && adConfigForm.rewardPay.rewardCount > 0 }">
                        <div class="payment-type-info">
                          <el-icon><VideoPlay /></el-icon>
                          <div class="payment-type-title">
                            <h4>激励广告</h4>
                          </div>
                        </div>
                        <el-tag size="small" :type="adConfigForm.rewardPay.enabled ? 'success' : 'info'" effect="plain">
                          {{ adConfigForm.rewardPay.enabled ? '已启用' : '未启用' }}
                        </el-tag>
                      </div>

                      <div class="payment-card-content">
                        <div class="payment-info-list">
                          <div class="payment-info-item">
                            <span class="label">状态</span>
                            <el-switch v-model="adConfigForm.rewardPay.enabled" />
                          </div>
                          <el-form-item label="广告位ID" prop="rewardPay.rewardAdId" class="gateway-form-item">
                            <div v-if="adConfigForm.rewardPay.enabled">
                              <el-input v-model="adConfigForm.rewardPay.rewardAdId" placeholder="请输入激励广告ID" />
                            </div>
                          </el-form-item>
                          <el-form-item label="激励次数" prop="rewardPay.rewardCount" class="gateway-form-item">
                            <div v-if="adConfigForm.rewardPay.enabled">
                              <el-input-number v-model="adConfigForm.rewardPay.rewardCount" :min="1" />
                            </div>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </el-card>

                  <!-- 插屏广告配置 -->
                  <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                    <div class="payment-card-wrapper">
                      <div class="payment-card-header" :class="{ 'configured': adConfigForm.interstitialPay.enabled && adConfigForm.interstitialPay.interstitialAdId && adConfigForm.interstitialPay.interstitialCount > 0 }">
                        <div class="payment-type-info">
                          <el-icon><Picture /></el-icon>
                          <div class="payment-type-title">
                            <h4>插屏广告</h4>
                          </div>
                        </div>
                        <el-tag size="small" :type="adConfigForm.interstitialPay.enabled ? 'success' : 'info'" effect="plain">
                          {{ adConfigForm.interstitialPay.enabled ? '已启用' : '未启用' }}
                        </el-tag>
                      </div>

                      <div class="payment-card-content">
                        <div class="payment-info-list">
                          <div class="payment-info-item">
                            <span class="label">状态</span>
                            <el-switch v-model="adConfigForm.interstitialPay.enabled" />
                          </div>
                          <el-form-item label="广告位ID" prop="interstitialPay.interstitialAdId" class="gateway-form-item">
                            <div v-if="adConfigForm.interstitialPay.enabled">
                              <el-input v-model="adConfigForm.interstitialPay.interstitialAdId" placeholder="请输入插屏广告ID" />
                            </div>
                          </el-form-item>
                          <el-form-item label="展示次数" prop="interstitialPay.interstitialCount" class="gateway-form-item">
                            <div v-if="adConfigForm.interstitialPay.enabled">
                              <el-input-number v-model="adConfigForm.interstitialPay.interstitialCount" :min="1" style="width: 100%;" />
                            </div>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </el-card>

                  <!-- 信息流广告配置 -->
                  <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                    <div class="payment-card-wrapper">
                      <div class="payment-card-header" :class="{ 'configured': adConfigForm.nativePay.enabled && adConfigForm.nativePay.nativeAdId }">
                        <div class="payment-type-info">
                          <el-icon><Document /></el-icon>
                          <div class="payment-type-title">
                            <h4>信息流广告</h4>
                          </div>
                        </div>
                        <el-tag size="small" :type="adConfigForm.nativePay.enabled ? 'success' : 'info'" effect="plain">
                          {{ adConfigForm.nativePay.enabled ? '已启用' : '未启用' }}
                        </el-tag>
                      </div>

                      <div class="payment-card-content">
                        <div class="payment-info-list">
                          <div class="payment-info-item">
                            <span class="label">状态</span>
                            <el-switch v-model="adConfigForm.nativePay.enabled" />
                          </div>
                          <el-form-item label="广告位ID" prop="nativePay.nativeAdId" class="gateway-form-item">
                            <div v-if="adConfigForm.nativePay.enabled">
                              <el-input v-model="adConfigForm.nativePay.nativeAdId" placeholder="请输入信息流广告ID" />
                            </div>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </div>
              </el-form>
            </div>
          </div>

          <!-- 步骤3: 配置其他通用信息 -->
          <div v-if="currentStep === 2" class="narrow-form-container">
            <h4>步骤3: 配置其他通用信息</h4>
            <el-form :model="generalConfigForm" :rules="generalConfigFormRules" ref="generalConfigFormRef" label-width="120px">
              <el-form-item label="客服URL" prop="contact">
                <el-input v-model="generalConfigForm.contact" placeholder="请输入客服URL" />
              </el-form-item>

              <el-form-item label="支付卡片样式" prop="payCardStyle" class="pay-card-style-item">
                <el-radio-group v-model="generalConfigForm.payCardStyle">
                  <el-radio :value="1" label="样式1" />
                  <el-radio :value="2" label="样式2" />
                  <el-radio :value="3" label="样式3" />
                  <el-radio :value="4" label="样式4" />
                </el-radio-group>
                <div v-if="selectedPayCardImage" class="pay-card-image-preview">
                  <img :src="selectedPayCardImage" alt="支付卡片样式预览" />
                </div>
              </el-form-item>
              <el-form-item label="首页卡片样式" prop="homeCardStyle">
                <el-select v-model="generalConfigForm.homeCardStyle" placeholder="请选择首页卡片样式" style="width: 100%;">
                  <el-option :value="1" label="样式1" />
                </el-select>
              </el-form-item>

              <el-form-item label="构建命令" prop="buildCode">
                <el-input v-model="generalConfigForm.buildCode" placeholder="请输入构建命令（如 npm run build:xxx）" />
              </el-form-item>

              <!-- Conditionally show Douyin field -->
              <template v-if="basicInfoForm.platform === '抖音'">
                <el-form-item label="抖音IM ID" prop="douyinImId">
                  <el-input v-model="generalConfigForm.douyinImId" placeholder="请输入抖音IM ID" />
                </el-form-item>
                <el-form-item label="抖音AppToken" prop="douyinAppToken">
                  <el-input
                    v-model="generalConfigForm.douyinAppToken"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入抖音AppToken（私钥内容）"
                  />
                </el-form-item>
              </template>

              <!-- Conditionally show Weixin fields -->
              <template v-if="basicInfoForm.platform === '微信'">
                <el-form-item label="微信AppToken" prop="weixinAppToken">
                  <el-input
                    v-model="generalConfigForm.weixinAppToken"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入微信AppToken（私钥内容）"
                  />
                </el-form-item>
              </template>

              <!-- Conditionally show Kuaishou fields -->
              <template v-if="basicInfoForm.platform === '快手'">
                <el-form-item label="快手Client ID" prop="kuaishouClientId">
                  <el-input v-model="generalConfigForm.kuaishouClientId" placeholder="请输入快手Client ID" />
                </el-form-item>
                <el-form-item label="快手Client Secret" prop="kuaishouClientSecret">
                  <el-input v-model="generalConfigForm.kuaishouClientSecret" placeholder="请输入快手Client Secret" show-password />
                </el-form-item>
                <el-form-item label="快手AppToken" prop="kuaishouAppToken">
                  <el-input
                    v-model="generalConfigForm.kuaishouAppToken"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入快手AppToken（私钥内容）"
                  />
                </el-form-item>
              </template>

              <el-form-item label="我的页登录类型" class="login-type-item">
                <el-radio-group v-model="generalConfigForm.mineLoginType">
                  <el-radio label="anonymousLogin">静默登录</el-radio>
                  <el-radio label="phoneLogin">
                    手机号授权登录
                    <span class="form-tip">无手机号权限的小程序默认使用静默登录</span>
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="阅读页登录类型" class="login-type-item">
                <el-radio-group v-model="generalConfigForm.readerLoginType">
                  <el-radio label="anonymousLogin">静默登录</el-radio>
                  <el-radio label="phoneLogin">
                    手机号授权登录
                    <span class="form-tip">无手机号权限的小程序默认使用静默登录</span>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>

          <!-- 步骤4: 展示配置数据并确认 -->
          <div v-if="currentStep === 3" class="data-confirm-container">
            <h4>步骤4: 展示配置数据并确认</h4>
            <div class="config-data-blocks">
              <div class="config-block">
                <h5>1. 基本配置</h5>
                <div class="config-data-display">
                  <pre><code>{{ formattedConfigData.baseConfig }}</code></pre>
                </div>
              </div>

              <div class="config-block">
                <h5>2. 主题色信息</h5>
                <div class="config-data-display">
                  <pre><code>{{ formattedConfigData.themeConfig }}</code></pre>
                </div>
              </div>

              <div class="config-block">
                <h5>3. 微距配置信息</h5>
                <div class="config-data-display">
                  <pre><code>{{ formattedConfigData.deliverConfig }}</code></pre>
                </div>
              </div>

              <div class="config-block">
                <h5>4. 支付配置信息</h5>
                <div class="config-data-display">
                  <pre><code>{{ formattedConfigData.payConfig }}</code></pre>
                </div>
              </div>

              <div class="config-block">
                <h5>5. 广告配置信息</h5>
                <div class="config-data-display">
                  <pre><code>{{ formattedConfigData.adConfig }}</code></pre>
                </div>
              </div>
              
              <div class="config-block">
                <h5>6. 通用配置信息</h5>
                <div class="config-data-display">
                  <pre><code>{{ formattedConfigData.commonConfig }}</code></pre>
                </div>
              </div>

            </div>
          </div>

          <!-- 步骤5: 小程序生成 -->
          <div v-if="currentStep === 4" class="creation-progress-area narrow-form-container">
            <h4>步骤5: 小程序生成</h4>
            <el-progress :percentage="creationProgress" :status="creationProgress === 100 && creationStatusType === 'success' ? 'success' : creationStatusType === 'error' ? 'exception' : undefined" :stroke-width="12" text-inside />
            <el-alert
              :title="creationStatusTitle"
              :type="creationStatusType"
              show-icon
              :closable="false"
              class="status-alert"
            />

            <el-card class="log-output-card">
              <template #header>
                <div class="card-header">
                  <span>生成日志</span>
                  <el-button size="small" @click="copyLogs">复制日志</el-button>
                </div>
              </template>
              <div ref="logDisplayArea" class="log-display-area">
                <div v-for="(log, index) in logs" :key="index" :class="[`log-entry`, log.type]">
                  <span class="log-timestamp">[{{ log.timestamp }}]</span>
                  <span class="log-message">{{ log.message }}</span>
                </div>
              </div>
            </el-card>

            <div class="step-actions" style="margin-top: 0; padding-top: 0;">
              <el-button v-if="creationStatusType === 'error'" type="warning" @click="retryCreation">重试</el-button>
              <el-button v-if="creationStatusType === 'success' || creationStatusType === 'error'" type="info" @click="resetWizard">返回向导首页</el-button>
            </div>
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="step-actions">
          <el-button v-if="currentStep > 0 || currentSubStep > 0 && currentStep !== 4" @click="prevStep">上一步</el-button>
          <el-button v-if="currentStep < 3 || (currentStep === 0 && currentSubStep === 0)" type="primary" @click="nextStep">下一步</el-button>
          <el-button v-if="currentStep === 3" type="success" @click="handleSubmit">完成配置</el-button>
          <!-- Buttons for step 4 are managed inside its own div -->
        </div>

      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import CustomSteps from '../components/common/CustomSteps.vue'
import { Money, Goods, Calendar, Star, Wallet, VideoPlay, Picture, Document } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import AiCreateStep1 from '../components/aiCreate/AiCreateStep1.vue'

const router = useRouter()

const currentStep = ref(0)
const currentSubStep = ref(0)

// 表单引用
const basicInfoStepRef = ref(null) // <-- use this for AiCreateStep1
const microConfigFormRef = ref(null)
const paymentConfigFormRef = ref(null)
const adConfigFormRef = ref(null)
const generalConfigFormRef = ref(null)

// 表单校验规则
const basicInfoFormRules = reactive({
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
})

const microConfigFormRules = reactive({
  deliverId: [{ required: true, message: '请输入deliverId', trigger: 'blur' }],
  bannerId: [{ required: true, message: '请输入bannerId', trigger: 'blur' }],
})

const paymentConfigFormRules = reactive({
  'normalPay.gatewayAndroid': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.value.normalPay.enabled && !value) {
        callback(new Error('请输入网关 (Android)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'normalPay.gatewayIos': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.value.normalPay.enabled && !value) {
        callback(new Error('请输入网关 (iOS)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'orderPay.gatewayAndroid': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.value.orderPay.enabled && !value) {
        callback(new Error('请输入网关 (Android)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'orderPay.gatewayIos': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.value.orderPay.enabled && !value) {
        callback(new Error('请输入网关 (iOS)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'renewPay.gatewayAndroid': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.value.renewPay.enabled && !value) {
        callback(new Error('请输入网关 (Android)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'renewPay.gatewayIos': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.value.renewPay.enabled && !value) {
        callback(new Error('请输入网关 (iOS)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'douzuanPay.gatewayAndroid': [{
    validator: (rule, value, callback) => {
      if (basicInfoForm.value.platform === '抖音' && paymentConfigForm.value.douzuanPay.enabled && !value) {
        callback(new Error('请输入网关 (Android)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'douzuanPay.gatewayIos': [{
    validator: (rule, value, callback) => {
      if (basicInfoForm.value.platform === '抖音' && paymentConfigForm.value.douzuanPay.enabled && !value) {
        callback(new Error('请输入网关 (iOS)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'wxVirtualPay.gatewayAndroid': [{
    validator: (rule, value, callback) => {
      if (basicInfoForm.value.platform === '微信' && paymentConfigForm.value.wxVirtualPay.enabled && !value) {
        callback(new Error('请输入网关 (Android)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'wxVirtualPay.gatewayIos': [{
    validator: (rule, value, callback) => {
      if (basicInfoForm.value.platform === '微信' && paymentConfigForm.value.wxVirtualPay.enabled && !value) {
        callback(new Error('请输入网关 (iOS)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
})

const adConfigFormRules = reactive({
  'rewardPay.rewardAdId': [{
    validator: (rule, value, callback) => {
      if (adConfigForm.value.rewardPay.enabled && !value) {
        callback(new Error('请输入激励广告ID'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'rewardPay.rewardCount': [{
    validator: (rule, value, callback) => {
      console.log('Validator triggered for rewardPay.rewardCount:', { value, type: typeof value, enabled: adConfigForm.value.rewardPay.enabled });
      if (adConfigForm.value.rewardPay.enabled) {
        const numValue = Number(value);
        console.log('  Inside enabled block:', { numValue, isNaN: isNaN(numValue), isLessThanOrEqualZero: numValue <= 0 });
        if (isNaN(numValue) || numValue <= 0) {
          callback(new Error('请输入有效激励次数'));
        } else {
          callback();
        }
      } else {
        console.log('  Not enabled, passing validation.');
        callback();
      }
    },
    trigger: 'blur'
  }],
  'interstitialPay.interstitialAdId': [{
    validator: (rule, value, callback) => {
      if (adConfigForm.value.interstitialPay.enabled && !value) {
        callback(new Error('请输入插屏广告ID'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'interstitialPay.interstitialCount': [{
    validator: (rule, value, callback) => {
      if (adConfigForm.value.interstitialPay.enabled && (!value || value <= 0)) {
        callback(new Error('请输入有效展示次数'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'nativePay.nativeAdId': [{
    validator: (rule, value, callback) => {
      if (adConfigForm.value.nativePay.enabled && !value) {
        callback(new Error('请输入信息流广告ID'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
})

// 新增通用配置表单校验规则
const generalConfigFormRules = reactive({
  contact: [{ required: true, message: '请输入客服URL', trigger: 'blur' }],
  payCardStyle: [{ required: true, message: '请选择支付卡片样式', trigger: 'change' }],
  homeCardStyle: [{ required: true, message: '请选择首页卡片样式', trigger: 'change' }],
  buildCode: [{ required: true, message: '请输入构建命令', trigger: 'blur' }],
  mineLoginType: [{ required: true, message: '请选择我的页登录类型', trigger: 'change' }],
  readerLoginType: [{ required: true, message: '请选择阅读页登录类型', trigger: 'change' }],
  'douyinImId': [{
    validator: (rule, value, callback) => {
      if (basicInfoForm.value.platform === '抖音' && !value) {
        callback(new Error('请输入抖音IM ID'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'kuaishouClientId': [{
    validator: (rule, value, callback) => {
      if (basicInfoForm.value.platform === '快手' && !value) {
        callback(new Error('请输入快手Client ID'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'kuaishouClientSecret': [{
    validator: (rule, value, callback) => {
      if (basicInfoForm.value.platform === '快手' && !value) {
        callback(new Error('请输入快手Client Secret'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  // AppTokens are not required, so no rules for them.
});

const stepsData = ref([
  {
    title: '基本信息',
    description: '配置小程序名称、简介及主题色'
  },
  {
    title: '微距，支付与广告',
    description: '设置微距，支付和广告相关配置'
  },
  {
    title: '其他通用信息',
    description: '配置其他通用设置'
  },
  {
    title: '展示配置数据并确认',
    description: '核对所有配置数据并完成创建'
  }
]);

const handleStepClick = (index) => {
  currentStep.value = index;
  currentSubStep.value = 0; // Reset sub-step when main step is clicked
}

// 表单数据模型
const basicInfoForm = ref({
  appName: '',
  platform: '',
  version: '',
  appCode: '',
  product: '',
  customer: '',
  appid: '',
  token_id: null,
  cl: '',
  mainTheme: '',
  secondTheme: '',
})

const microConfigForm = ref({
  deliverId: '',
  bannerId: '',
})

const paymentConfigForm = ref({
  normalPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
  orderPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
  renewPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
  douzuanPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
  wxVirtualPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
})

const adConfigForm = ref({
  rewardPay: { enabled: false, rewardAdId: '', rewardCount: null },
  interstitialPay: { enabled: false, interstitialAdId: '', interstitialCount: null },
  nativePay: { enabled: false, nativeAdId: '' },
})

const generalConfigForm = ref({
  contact: '',
  payCardStyle: null,
  homeCardStyle: null,
  buildCode: '',
  mineLoginType: 'anonymousLogin',
  readerLoginType: 'anonymousLogin',
  douyinImId: '',
  douyinAppToken: '',
  weixinAppToken: '',
  kuaishouClientId: '',
  kuaishouClientSecret: '',
  kuaishouAppToken: '',
})

// 预设主题色数据
const predefinedThemes = ref([
  { name: '阅界视窗主题色', main: '#2552F5', second: '#dce7ff', image: 'theme_yuejie.jpg' },
  { name: '悦动故事主题色', main: '#EF5350', second: '#FFEBEE', image: 'theme_yuedong.jpg' },
  { name: '风行推广主题色', main: '#F86003', second: '#FFEFE7', image: 'theme_fun.jpg' },
  { name: '漫影主题色', main: '#FF4363', second: '#ffe5eb', image: 'theme_manying.jpg' },
]);

const selectedThemeImage = ref('');
const selectedPayCardImage = ref(''); // New reactive variable for payment card style image

// Helper function to map Chinese platform names to English
const mapPlatformToEnglish = (platform) => {
  const platformMap = {
    '抖音': 'douyin',
    '快手': 'kuaishou',
    '微信': 'weixin',
    '百度': 'baidu',
  };
  return platformMap[platform] || platform; // Fallback to original if not found
};

// 选择预设主题色
const selectPredefinedTheme = (theme) => {
  basicInfoForm.value.mainTheme = theme.main;
  basicInfoForm.value.secondTheme = theme.second;
  selectedThemeImage.value = `/images/theme/${theme.image}`; // Set image path
  ElMessage.success(`已应用预设主题: ${theme.name}`);
}

// Computed property to combine and format all config data
const formattedConfigData = computed(() => {
  const combinedData = {
    baseConfig: {
      appName: basicInfoForm.value.appName,
      appCode: basicInfoForm.value.appCode,
      platform: mapPlatformToEnglish(basicInfoForm.value.platform),
      version: basicInfoForm.value.version,
      product: basicInfoForm.value.product,
      customer: basicInfoForm.value.customer,
      appid: basicInfoForm.value.appid,
      tokenId: basicInfoForm.value.token_id,
      cl: basicInfoForm.value.cl,
    },
    themeConfig: {
      mainTheme: basicInfoForm.value.mainTheme,
      secondTheme: basicInfoForm.value.secondTheme,
    },
    deliverConfig: {
      deliverId: microConfigForm.value.deliverId,
      bannerId: microConfigForm.value.bannerId,
    },
    payConfig: {
      renewPay: paymentConfigForm.value.renewPay,
      normalPay: paymentConfigForm.value.normalPay,
      orderPay: paymentConfigForm.value.orderPay,
      douzuanPay: paymentConfigForm.value.douzuanPay,
      wxVirtualPay: paymentConfigForm.value.wxVirtualPay,
    },
    commonConfig: {
      appId: basicInfoForm.value.appid,
      buildCode: generalConfigForm.value.buildCode,
      contact: generalConfigForm.value.contact,
      douyinAppToken: generalConfigForm.value.douyinAppToken,
      douyinImId: generalConfigForm.value.douyinImId,
      homeCardStyle: generalConfigForm.value.homeCardStyle,
      // id: null, // This ID is typically assigned by the backend after creation. Omitting for now.
      kuaishouAppToken: generalConfigForm.value.kuaishouAppToken,
      kuaishouClientId: generalConfigForm.value.kuaishouClientId,
      kuaishouClientSecret: generalConfigForm.value.kuaishouClientSecret,
      mineLoginType: generalConfigForm.value.mineLoginType,
      payCardStyle: generalConfigForm.value.payCardStyle,
      readerLoginType: generalConfigForm.value.readerLoginType,
      weixinAppToken: generalConfigForm.value.weixinAppToken,
    },
    // Ad configuration is not explicitly listed in commonConfig, 
    // but should be displayed as a separate block.
    adConfig: {
      appId: basicInfoForm.value.appid, // Add appId to adConfig
      reward: {
        rewardAdId: adConfigForm.value.rewardPay.rewardAdId,
        rewardCount: adConfigForm.value.rewardPay.rewardCount,
        isRewardAdEnabled: adConfigForm.value.rewardPay.enabled,
      },
      interstitial: {
        interstitialAdId: adConfigForm.value.interstitialPay.interstitialAdId,
        interstitialCount: adConfigForm.value.interstitialPay.interstitialCount,
        isInterstitialAdEnabled: adConfigForm.value.interstitialPay.enabled,
      },
      nativeAd: {
        nativeAdId: adConfigForm.value.nativePay.nativeAdId,
        isNativeAdEnabled: adConfigForm.value.nativePay.enabled,
      },
    },
  };

  // Convert each sub-object to a pretty-printed JSON string
  const formattedBlocks = {};
  for (const key in combinedData) {
    if (combinedData.hasOwnProperty(key)) {
      formattedBlocks[key] = JSON.stringify(combinedData[key], null, 2);
    }
  }
  console.log('Formatted Config Blocks:', formattedBlocks); // Log the formatted JSON blocks
  return formattedBlocks; // Return object with formatted JSON strings
});

// watch for payCardStyle change to update the image
watch(() => generalConfigForm.value.payCardStyle, (newVal) => {
  if (newVal) {
    selectedPayCardImage.value = `/images/payStyle/pay_style${newVal}.png`;
  } else {
    selectedPayCardImage.value = ''; // Clear image if no style selected
  }
}, { immediate: true }); // immediate: true to set initial image if a value exists

// New reactive variables for creation process
const creationProgress = ref(0);
const creationStatusTitle = ref('准备开始生成...');
const creationStatusType = ref('info'); // info, success, warning, error
const logs = ref([]);
const logDisplayArea = ref(null); // Ref for log display area to enable auto-scrolling

// Simulated backend API calls
const simulateCreationProcess = async (config) => {
  logs.value = [];
  creationProgress.value = 0;
  creationStatusType.value = 'info';
  creationStatusTitle.value = '正在初始化环境...';

  addLog('info', '开始创建小程序...');
  await delay(1000);
  creationProgress.value = 10;
  addLog('info', '环境初始化完成。');

  await delay(1500);
  creationProgress.value = 30;
  addLog('info', '正在编译代码...');

  await delay(2000);
  creationProgress.value = 60;
  addLog('info', '代码编译完成。');

  await delay(1000);
  creationProgress.value = 80;
  addLog('info', '正在部署到目标平台...');

  await delay(1500);
  // Simulate success or failure
  const isSuccess = Math.random() > 0.2; // 80% chance of success
  if (isSuccess) {
    creationProgress.value = 100;
    creationStatusType.value = 'success';
    creationStatusTitle.value = '小程序生成成功！';
    addLog('success', '小程序已成功生成并部署。');
    ElMessage.success('小程序创建完成！');
  } else {
    creationProgress.value = 75; // Partial progress
    creationStatusType.value = 'error';
    creationStatusTitle.value = '小程序生成失败！';
    addLog('error', '生成过程中出现错误，请检查日志或重试。');
    ElMessage.error('小程序创建失败！');
  }
};

const addLog = (type, message) => {
  const timestamp = new Date().toLocaleTimeString();
  logs.value.push({ type, message, timestamp });
  nextTick(() => {
    if (logDisplayArea.value) {
      logDisplayArea.value.scrollTop = logDisplayArea.value.scrollHeight;
    }
  });
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const confirmAndCreate = async () => {
  // 验证所有表单
  const valid = await Promise.all([
    basicInfoFormRef.value?.validate(),
    microConfigFormRef.value?.validate(),
    paymentConfigFormRef.value?.validate(),
    adConfigFormRef.value?.validate(),
    generalConfigFormRef.value?.validate()
  ]).catch(() => [false]);

  if (valid.some(v => !v)) {
    ElMessage.error('请填写完整的配置信息！');
    return;
  }

  // 保存配置数据到本地存储
  const configData = {
    basicInfo: basicInfoForm.value,
    microConfig: microConfigForm.value,
    paymentConfig: paymentConfigForm.value,
    adConfig: adConfigForm.value,
    generalConfig: generalConfigForm.value
  };
  localStorage.setItem('appConfigData', JSON.stringify(configData));

  // 跳转到生成模块
  router.push('/ai-generate');
};

const resetWizard = () => {
  // Reset all forms and state to initial values
  currentStep.value = 0;
  currentSubStep.value = 0;
  basicInfoFormRef.value?.resetFields();
  microConfigFormRef.value?.resetFields();
  paymentConfigFormRef.value?.resetFields();
  adConfigFormRef.value?.resetFields();
  generalConfigFormRef.value?.resetFields();

  // Reset creation specific states
  creationProgress.value = 0;
  creationStatusTitle.value = '准备开始生成...';
  creationStatusType.value = 'info';
  logs.value = [];
  selectedPayCardImage.value = '';
  selectedThemeImage.value = '';
};

const retryCreation = async () => {
  // Simply re-run the simulation
  await simulateCreationProcess(formattedConfigData.value);
};

const copyLogs = async () => {
  const logText = logs.value.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
  try {
    await navigator.clipboard.writeText(logText);
    ElMessage.success('日志已成功复制到剪贴板！');
  } catch (err) {
    console.error('复制日志失败:', err);
    ElMessage.error('复制日志失败，请手动复制。');
  }
};

// 导航函数
const nextStep = async () => {
  // 步骤1的校验
  if (currentStep.value === 0) {
    if (currentSubStep.value === 0) {
      const valid = await basicInfoStepRef.value.validate().catch(() => false);
      if (!valid) {
        ElMessage.error('Please fill in the complete "Basic Info"');
        return;
      }
      currentSubStep.value = 1; // Move to theme selection sub-step
      return;
    } else if (currentSubStep.value === 1) {
      // Validate theme colors before proceeding from sub-step 1
      if (!basicInfoForm.value.mainTheme || !basicInfoForm.value.secondTheme) {
        ElMessage.error('还未确定小程序的主题色哦！');
        return;
      }
    }
  } else if (currentStep.value === 1) {
    // 步骤2的子步骤校验
    if (currentSubStep.value === 0) {
      const valid = await microConfigFormRef.value.validate().catch(() => false);
      if (!valid) {
        ElMessage.error('请填写完整的"微距配置"！');
        return;
      }
      currentSubStep.value++; // 进入支付配置
      return;
    } else if (currentSubStep.value === 1) {
      const valid = await paymentConfigFormRef.value.validate().catch(() => false);
      if (!valid) {
        ElMessage.error('请填写完整的"支付配置"！');
        return;
      }
      
      // 检查是否至少启用了一个支付方式
      const hasEnabledPayment = Object.values(paymentConfigForm.value).some(payment => 
        payment.enabled && 
        ((payment.gatewayAndroid && payment.gatewayIos) || 
         (basicInfoForm.value.platform === '抖音' && payment === paymentConfigForm.value.douzuanPay) ||
         (basicInfoForm.value.platform === '微信' && payment === paymentConfigForm.value.wxVirtualPay))
      );
      
      if (!hasEnabledPayment) {
        ElMessage.error('请至少启用并配置一种支付方式！');
        return;
      }
      
      currentSubStep.value++; // 进入广告配置
      return;
    } else if (currentSubStep.value === 2) {
      const valid = await adConfigFormRef.value.validate().catch(() => false);
      if (!valid) {
        ElMessage.error('请填写完整的"广告配置"！');
        return;
      }
      
      // 检查是否至少启用了一个广告类型
      const hasEnabledAd = Object.values(adConfigForm.value).some(ad => 
        ad.enabled && 
        ((ad.rewardAdId && ad.rewardCount > 0) || 
         (ad.interstitialAdId && ad.interstitialCount > 0) ||
         ad.nativeAdId)
      );
      
      if (!hasEnabledAd) {
        ElMessage.error('请至少启用并配置一种广告类型！');
        return;
      }
    }
  } else if (currentStep.value === 2) { // 步骤3: 配置其他通用信息校验
    const valid = await generalConfigFormRef.value.validate().catch(() => false);
    if (!valid) {
      ElMessage.error('请填写完整的"其他通用信息"！');
      return;
    }
    // 如果是最后一步配置且校验通过，则进入数据展示确认页
    currentStep.value++; // Move to the new confirmation step (index 3)
    currentSubStep.value = 0; // Reset sub-step for the new step
    return;
  } else if (currentStep.value === 3) { // New condition for confirmation step
    currentStep.value--; // Go back to step 2 (General Config)
    currentSubStep.value = 0; // General config only has one view, reset sub-step
    return;
  }

  if (currentStep.value < stepsData.value.length - 1) {
    currentStep.value++;
    currentSubStep.value = 0; // Reset sub-step when moving to a new main step
  }
};

const prevStep = () => {
  if (currentStep.value === 0) {
    if (currentSubStep.value === 1) {
      currentSubStep.value = 0; // Go back to basic info form sub-step
      return;
    }
  } else if (currentStep.value === 1) {
    if (currentSubStep.value > 0) {
      currentSubStep.value--; // 在当前主步骤内回退子步骤
      return;
    } else if (currentSubStep.value === 0) {
      // 如果是第一个子步骤，则回退到上一个主步骤的最后一个子步骤
      currentStep.value--;
      currentSubStep.value = 1; // 回退到基本信息的主题色选择子步骤
      return;
    }
  } else if (currentStep.value === 2) {
    // If on step 2 (General Config), go back to step 1, sub-step 2 (Ad Config)
    currentStep.value--; // Go back to step 1
    currentSubStep.value = 2; // Set to the last sub-step of step 1 (Ad Config)
    return;
  } else if (currentStep.value === 3) { // New condition for confirmation step
    currentStep.value--; // Go back to step 2 (General Config)
    currentSubStep.value = 0; // General config only has one view, reset sub-step
    return;
  }

  // This general decrement will only be reached if no specific case applies
  if (currentStep.value > 0) {
    currentStep.value--;
    currentSubStep.value = 0; // Reset sub-step when moving back to a new main step
  }
};

// 提交函数
const handleSubmit = () => {
  // This handleSubmit is now only called after creation completes (success/failure)
  // It should probably navigate to a final summary or back to a list.
  // For now, it will just show a success message as per original intent.
  ElMessage.success('创意小程序创建完成！(演示)')
  console.log('Final Data (After creation simulation):', { // Keep for debugging and confirmation purpose
    basicInfo: basicInfoForm.value,
    microConfig: microConfigForm.value,
    paymentConfig: paymentConfigForm.value,
    adConfig: adConfigForm.value,
    generalConfig: generalConfigForm.value,
  })
};

</script>

<style scoped>
.ai-create-module {
  padding: 20px;
}
.workflow-container {
  max-width: 1200px; /* 控制容器最大宽度，调整为更大尺寸 */
  margin: 0 auto; /* 居中显示 */
}
.header {
  display: flex;
  align-items: center;
  justify-content: center; /* 标题居中 */
}
.workflow-content {
  padding: 20px;
}
.create-steps {
  margin-bottom: 40px;
}
.step-panel {
  padding: 20px 0;
  min-height: 250px; /* 确保内容区域有最小高度 */
}
.step-form {
  /* Removed max-width and margin: 0 auto; from here */
  /* Removed display: flex and related styles */
}

.narrow-form-container {
  max-width: 600px;
  margin: 0 auto;
}

.wide-form-container {
  max-width: 1000px; /* Adjust this value as needed, larger than 600px */
  margin: 0 auto;
}

.step-form h4 {
  margin-bottom: 20px;
  text-align: left; /* Align title to left within its column */
  color: #303133;
}

.sub-section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-top: 20px;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.step-actions {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 15px;
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
  white-space: nowrap; /* Prevent text wrapping */
}

/* 美化 el-steps 样式 */
.fancy-steps :deep(.el-step) {
  cursor: pointer; /* 使整个步骤可点击 */
  /* 移除之前添加的 display: flex, flex-direction: column, align-items */
}

.fancy-steps :deep(.el-step__head) {
  border-color: #dcdfe6; /* 默认边框颜色 */
  transition: border-color 0.3s;
  /* 移除之前添加的 flex-shrink */
}
.fancy-steps :deep(.el-step__head:hover) {
  /* No transform here */
}
.fancy-steps :deep(.el-step__head.is-process) {
  border-color: var(--el-color-primary);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
}
.fancy-steps :deep(.el-step__head.is-success) {
  border-color: var(--el-color-success);
}

.fancy-steps :deep(.el-step__icon) {
  width: 36px; /* 增大图标尺寸 */
  height: 36px;
  font-size: 18px; /* 调整图标字体大小 */
  display: flex; /* Ensure flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  background-color: #f5f7fa; /* 默认背景色 */
  border: 2px solid #dcdfe6; /* 默认边框 */
  color: #909399; /* 默认图标颜色 */
  transition: all 0.3s, box-shadow 0.3s; /* 添加box-shadow过渡 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); /* 柔和的默认阴影 */
}
.fancy-steps :deep(.el-step__icon.is-text) {
  border-radius: 50%;
}
.fancy-steps :deep(.el-step__icon.is-icon) {
  border-radius: 50%;
}
.fancy-steps :deep(.el-step__icon-inner) {
  font-weight: bold; /* 数字加粗 */
  line-height: 1; /* 确保数字没有额外的行高 */
  display: flex; /* Ensure flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  width: 100%; /* Take full width */
  height: 100%; /* Take full height */
  position: relative; /* Enable positioning for fine-tuning */
  top: -1px; /* Adjust vertically by 1px for pixel-perfect alignment */
}

.fancy-steps :deep(.el-step__head.is-process .el-step__icon) {
  background-color: var(--el-color-primary);
  color: #fff;
  border-color: var(--el-color-primary);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
  animation: pulse 1.5s infinite;
}
.fancy-steps :deep(.el-step__head.is-success .el-step__icon) {
  background-color: var(--el-color-success);
  color: #fff;
  border-color: var(--el-color-success);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.25);
}

.fancy-steps :deep(.el-step__main) {
  /* Removed explicit margin-left, text-align, flex properties */
  /* Ensure text is horizontal */
  writing-mode: unset; /* Reset writing mode */
  transform: none; /* Reset any rotation */
}
.fancy-steps :deep(.el-step__title) {
  font-size: 17px;
  font-weight: 600;
  color: #606266;
  transition: color 0.3s;
  line-height: 1.2;
  writing-mode: unset; /* Reset writing mode */
  transform: none; /* Reset any rotation */
}
.fancy-steps :deep(.el-step__title.is-process) {
  color: var(--el-color-primary);
}
.fancy-steps :deep(.el-step__title.is-success) {
  color: var(--el-color-success);
}

.fancy-steps :deep(.el-step__description) {
  font-size: 14px;
  color: #909399;
  line-height: 1.5;
  transition: color 0.3s;
  writing-mode: unset; /* Reset writing mode */
  transform: none; /* Reset any rotation */
}
.fancy-steps :deep(.el-step__description.is-process) {
  color: var(--el-color-primary-light-3);
}
.fancy-steps :deep(.el-step__description.is-success) {
  color: var(--el-color-success-light-3);
}

.fancy-steps :deep(.el-step__line) {
  background-color: #dcdfe6;
  transition: background-color 0.3s, border-color 0.3s;
  position: absolute; /* Keep absolute positioning */
  top: 50%; /* Vertically center relative to parent */
  transform: translateY(-50%); /* Adjust for its own height */
}
.fancy-steps :deep(.el-step__line-inner) {
  border-width: 1.5px;
  transition: border-color 0.3s;
}
.fancy-steps :deep(.el-step__line.is-process .el-step__line-inner),
.fancy-steps :deep(.el-step__line.is-success .el-step__line-inner) {
  border-color: var(--el-color-primary);
}

/* 脉冲动画 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.theme-image-preview {
  width: 250px; /* Adjust width as needed */
  height: 400px; /* Adjust height as needed */
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Ensure image doesn't overflow */
  background-color: #f5f7fa;
  flex-shrink: 0; /* Prevent image container from shrinking */
}

.theme-image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Scale image down to fit, maintaining aspect ratio */
}

/* New style for the content wrapper within theme selection */
.theme-selection-content {
  display: flex;
  justify-content: space-between; /* Space between form and image */
  align-items: flex-start; /* Align items to the start (top) */
  gap: 20px; /* Gap between form and image */
}

/* New styles for payment configuration */
.payment-config-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px;
}

.payment-type-card {
  transition: all 0.3s ease;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.payment-type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
}

.payment-card-wrapper {
  display: flex;
  flex-direction: column;
}

.payment-card-content {
  padding: 20px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  gap: 0; /* Managed by .payment-info-list now */
}

.payment-card-content :deep(.el-form-item) {
  margin-bottom: 0;
  padding: 0; /* Ensure no default padding from el-form-item */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-card-content :deep(.el-form-item__label) {
  display: none; /* Hide el-form-item default label */
}

.payment-card-content :deep(.el-form-item__content) {
  flex: 1; /* Allow content to take full width */
  justify-content: flex-end; /* Align content to the right */
}

.payment-card-content :deep(.el-input) {
  width: 100%; /* Make input take full width within its flex item */
}

/* Styles to make el-input look like plain text */
/* Reverting to default el-input styles but keeping custom text styling */
.payment-card-content :deep(.el-input .el-input__wrapper) {
  /* Revert to Element Plus default background and border/shadow */
  /* background-color: var(--el-fill-color-light) !important; */
  /* box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color-lighter)) inset !important; */
  /* padding: 1px 11px !important; */
  /* border: 1px solid var(--el-border-color-lighter) !important; */
  /* outline: none !important; */
  /* height: var(--el-input-height, 32px); */
  /* line-height: var(--el-input-height, 32px); */
  /* text-overflow: clip; */
  /* white-space: normal; */
  /* box-sizing: border-box; */
}
.payment-card-content :deep(.el-input .el-input__inner) {
  text-align: left; /* Changed from right to left */
  color: #303133; /* Keep color to match Payment.vue value */
  font-weight: 500; /* Keep font weight to match Payment.vue value */
  font-size: 14px; /* Keep font size to match Payment.vue value */
  /* padding: 0 !important; */
  /* border: none !important; */
  /* outline: none !important; */
  /* -webkit-appearance: none; */
  /* -moz-appearance: none; */
  /* appearance: none; */
  /* cursor: text; */
  /* height: var(--el-input-height, 32px); */
  /* line-height: var(--el-input-height, 32px); */
  /* min-width: 0; */
  /* box-sizing: content-box; */
}

.payment-card-content :deep(.el-input.is-focus .el-input__wrapper),
.payment-card-content :deep(.el-input__wrapper.is-focused),
.payment-card-content :deep(.el-input__wrapper:hover) {
  /* Apply Element Plus primary color border/shadow on focus/hover */
  /* box-shadow: 0 0 0 1px var(--el-color-primary) inset !important; */
  /* border-color: var(--el-color-primary) !important; */
}

.payment-card-content :deep(.el-switch) {
  width: auto; /* Ensure it doesn't take up too much space */
  flex-shrink: 0; /* Prevent switch from shrinking */
  height: auto; /* Let element-plus handle height */
  line-height: normal; /* Let element-plus handle line-height */
  display: flex; /* Ensure flex context for alignment */
  align-items: center; /* Center vertically */
}

/* Styles for payment-info-list and payment-info-item from Payment.vue */
.payment-info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%; /* Ensure it takes full width of card content */
}

.payment-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-info-item .label {
  color: #909399;
  font-size: 14px;
}

.payment-info-item .value {
  color: #303133;
  font-weight: 500;
}

.payment-card-footer {
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.payment-card-header {
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-card-header.configured {
  background-color: #f0f9eb;
  /* Add a subtle box-shadow for a 'gradient' feel, if it's present in Payment.vue */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04); /* Very light shadow */
}

.payment-card-header :deep(.el-tag.el-tag--success.el-tag--plain) {
  /* Revert to default el-tag styles */
  background-color: var(--el-tag-bg-color, var(--el-fill-color-light)); /* Default tag background */
  border-color: var(--el-tag-border-color, var(--el-border-color-light)); /* Default tag border */
  color: var(--el-tag-text-color, var(--el-color-success)); /* Default success text color */
}

.payment-type-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-type-info .el-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.payment-type-title {
  display: flex;
  flex-direction: column;
}

.payment-type-title h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

/* Styles for el-form-item to mimic payment-info-item for gateway inputs */
.gateway-form-item {
  display: flex !important; /* Override default el-form-item display */
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 0 !important; /* Remove default margin-bottom */
}

.gateway-form-item :deep(.el-form-item__label) {
  flex-shrink: 0;
  text-align: left !important; /* Ensure label is left-aligned */
  color: #909399;
  font-size: 14px;
  padding: 0 !important; /* Remove default padding */
  margin-right: 12px; /* Add some spacing between label and input */
  line-height: var(--el-input-height, 32px); /* Match input height */
}

.gateway-form-item :deep(.el-form-item__content) {
  flex-grow: 1; /* Allow content to take remaining space */
  display: flex; /* Make content a flex container to align its children (input) */
  justify-content: flex-start; /* Align content to the start (left) */
  align-items: center; /* Vertically align */
  margin-left: 0 !important; /* Remove default margin-left */
  line-height: var(--el-input-height, 32px); /* Match input height */
}

/* New wrapper for rewardPay input to ensure it takes full space */
.reward-input-wrapper {
  flex-grow: 1;
  display: flex; /* Make it a flex container so its children can align */
  align-items: center; /* Center items vertically */
}

/* Specific style for el-input-number's inner input to ensure text is visible */
.gateway-form-item .el-input-number {
  flex-grow: 1; /* Ensure el-input-number takes available space */
  width: auto !important; /* Override explicit width to allow flex-grow */
  flex-shrink: 0 !important; /* Prevent el-input-number from shrinking */
  min-width: 100px !important; /* Ensure a minimum width for visibility */
}

.gateway-form-item .el-input-number :deep(.el-input__inner) {
  text-align: left !important; /* Ensure text starts from the left */
  color: #303133; /* Keep text color consistent */
  font-weight: 500; /* Keep font weight consistent */
  font-size: 14px; /* Keep font size consistent */
  overflow: visible !important; /* Ensure content is not clipped */
}

.gateway-form-item .el-input-number :deep(.el-input) {
  width: 100% !important; /* Ensure the internal el-input takes full width */
}

.gateway-form-item .el-input-number :deep(.el-input__wrapper) {
  overflow: visible !important; /* Ensure its wrapper does not clip content */
}

/* New wrapper for rewardPay input to ensure it takes full space */
.reward-input-wrapper {
  flex-grow: 1;
  display: flex; /* Make it a flex container so its children can align */
  align-items: center; /* Center items vertically */
}

/* Specific styles for el-input-number within reward-input-wrapper */
.reward-input-wrapper .el-input-number {
  flex-grow: 1; /* Allow el-input-number to take available space */
  width: auto !important; /* Ensure it's not fixed width if inside flex */
}

.reward-input-wrapper .el-input-number :deep(.el-input__inner) {
  text-align: left !important; /* Force left alignment */
  color: #303133; /* Consistent text color */
  font-weight: 500; /* Consistent font weight */
  font-size: 14px; /* Consistent font size */
  overflow: visible !important; /* Prevent text clipping */
}

.reward-input-wrapper .el-input-number :deep(.el-input__wrapper) {
  overflow: visible !important; /* Prevent wrapper clipping */
}

.reward-input-wrapper .el-input-number :deep(.el-input) {
  width: 100% !important; /* Ensure the internal input takes full width */
}

/* Restore default el-form-item styles that were previously overridden globally */
/* The following block was previously commented out / removed from previous turns */
.payment-card-content :deep(.el-form-item) {
  display: block; /* Restore default block display */
  margin-bottom: 22px; /* Restore default margin */
  padding: 0;
}

.payment-card-content :deep(.el-form-item__label) {
  display: flex; /* Restore default label display */
  text-align: right;
  vertical-align: middle;
  font-size: var(--el-form-label-font-size, inherit);
  color: var(--el-text-color-regular);
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}

.payment-card-content :deep(.el-form-item__content) {
  line-height: 32px;
  position: relative;
  font-size: 14px;
  display: flex; /* Restore default content display */
  align-items: center;
}

.payment-card-content :deep(.el-input) {
  width: 100%; /* Default width for el-input in form item */
}

.payment-card-content :deep(.el-switch) {
  width: auto; /* Ensure it doesn't take up too much space */
  flex-shrink: 0; /* Prevent switch from shrinking */
  height: auto; /* Let element-plus handle height */
  line-height: normal; /* Let element-plus handle line-height */
  display: flex; /* Ensure flex context for alignment */
  align-items: center; /* Center vertically */
}

.payment-card-header :deep(.el-tag.el-tag--success.el-tag--plain) {
  background-color: var(--el-tag-bg-color, var(--el-fill-color-light)); /* Default tag background */
  border-color: var(--el-tag-border-color, var(--el-border-color-light)); /* Default tag border */
  color: var(--el-tag-text-color, var(--el-color-success)); /* Default success text color */
}

.login-type-item {
  white-space: nowrap;
}

.login-type-item :deep(.el-form-item__content) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.login-type-item :deep(.el-form-item__content .el-radio-group) {
  align-self: center;
  flex-shrink: 0;
}

.login-type-item :deep(.el-radio__label) {
  display: inline-flex;
  align-items: center;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 15px;
  white-space: nowrap;
}

.pay-card-style-item {
  width: 100%; /* Ensure the form item takes full width of its parent */
}

.pay-card-style-item :deep(.el-form-item__content) {
  display: flex;
  align-items: center;
  gap: 20px; /* Space between radio group and image */
}

.pay-card-style-item :deep(.el-radio-group) {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto; /* Allow radio group to take flexible width */
}

.pay-card-image-preview {
  width: 120px; /* Adjust as needed */
  height: 180px; /* Adjust as needed */
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f5f7fa;
  flex-shrink: 0;
}

.pay-card-image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* New styles for data confirmation step */
.data-confirm-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  display: flex; /* Added for block layout */
  flex-direction: column; /* Arrange blocks vertically */
  gap: 20px; /* Space between blocks */
}

.data-confirm-container h4 {
  margin-bottom: 20px;
  text-align: center;
  color: #303133;
}

.config-data-blocks {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.config-block {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  /* overflow: auto; -- REMOVED THIS to allow inner content to fully expand */
}

.config-block h5 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
  font-size: 16px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 8px;
  border-radius: 4px;
  padding: 10px;
  /* max-height: Removed for full expansion */
  /* overflow-y: Removed for full expansion */
  font-family: 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 13px; /* Slightly smaller font for compactness */
  line-height: 1.4; /* Adjusted line height */
  color: #333;
  /* width: 100%; -- REMOVED THIS */
}

.config-data-display {
  background-color: #f0f8ff; /* Changed to a subtle light blue for better distinction */
  border: 1px solid #ddd; /* Slightly darker border for code block */
  border-radius: 4px;
  padding: 10px;
  /* max-height: Removed for full expansion */
  /* overflow-y: Removed for full expansion */
  font-family: 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 13px; /* Slightly smaller font for compactness */
  line-height: 1.4; /* Adjusted line height */
  color: #333;
  /* width: 100%; -- REMOVED THIS */
}

.config-data-display pre {
  margin: 0;
  white-space: pre-wrap !important;
  word-break: break-all;
  overflow-x: auto;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.config-data-display code {
  display: block;
  padding: 0;
  background-color: transparent;
  color: inherit;
  white-space: pre-wrap !important;
  word-break: break-all;
  width: 100%;
  box-sizing: border-box;
}

/* New styles for creation progress step */
.creation-progress-area {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-alert {
  margin-top: 10px;
}

.log-output-card {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: none;
}

.log-output-card :deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #303133;
}

.log-display-area {
  max-height: 400px; /* Fixed height for scrollable log area */
  overflow-y: auto;
  background-color: #fdfdfd;
  padding: 10px;
  font-family: 'Consolas', 'Monaco', 'Andale Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
  color: #555;
  border-radius: 4px;
}

.log-entry {
  margin-bottom: 5px;
  white-space: pre-wrap; /* Preserve whitespace and wrap text */
  word-break: break-all; /* Break long words */
}

.log-timestamp {
  color: #909399;
  margin-right: 8px;
  flex-shrink: 0;
}

.log-message {
  color: #303133;
}

.log-entry.info .log-message {
  color: #409eff; /* Primary blue */
}

.log-entry.success .log-message {
  color: #67c23a; /* Success green */
  font-weight: bold;
}

.log-entry.warning .log-message {
  color: #e6a23c; /* Warning orange */
}

.log-entry.error .log-message {
  color: #f56c6c; /* Danger red */
  font-weight: bold;
}

</style> 