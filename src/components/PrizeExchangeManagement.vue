<template>
  <div class="prize-content">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-field">
          <label>奖品ID :</label>
          <input v-model.trim="filters.id" type="text" placeholder="奖品ID :" />
        </div>
        <div class="filter-field">
          <label>奖品名称 :</label>
          <input v-model.trim="filters.name" type="text" placeholder="奖品名称 :" />
        </div>
        <div class="filter-field">
          <label>奖品状态 :</label>
          <div class="select-wrap">
            <select v-model="filters.status">
              <option value="">全部</option>
              <option value="已上架">已上架</option>
              <option value="待上架">待上架</option>
              <option value="已停售">已停售</option>
            </select>
            <span class="select-arrow">▾</span>
          </div>
        </div>
        <div class="filter-field">
          <label>奖品类型 :</label>
          <div class="select-wrap">
            <select v-model="filters.type">
              <option value="">全部</option>
              <option v-for="t in typeOptions" :key="t" :value="t">{{ t }}</option>
            </select>
            <span class="select-arrow">▾</span>
          </div>
        </div>
        <div class="filter-field">
          <label>所属奖池 :</label>
          <div class="select-wrap">
            <select v-model="filters.pool">
              <option value="">全部</option>
              <option v-for="p in poolOptions" :key="p" :value="p">{{ p }}</option>
            </select>
            <span class="select-arrow">▾</span>
          </div>
        </div>
        <button class="btn btn-primary" @click="applyFilters">查 询</button>
      </div>
      <button class="btn btn-add" @click="openCreateDialog">添加奖品</button>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrapper">
      <table class="prize-table">
        <thead>
          <tr>
            <th>奖品信息</th>
            <th>奖品编码</th>
            <th>奖品图片</th>
            <th>奖品类型</th>
            <th>奖品状态</th>
            <th>奖品份数</th>
            <th>兑换消耗金豆</th>
            <th>所属奖池</th>
            <th>奖品人群包定向<span class="expand-all" @click="toggleAllCrowdPack">展开</span></th>
            <th>生效时间</th>
            <th>操作人/操作时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in displayedPrizes" :key="item.id">
            <!-- 奖品信息 -->
            <td class="prize-info-cell">
              <div class="prize-info-line">
                <span class="info-label">奖品ID：</span>
                <a class="prize-id-link" href="javascript:void(0)" @click="viewPrizeDetail(item)">{{ item.id }}</a>
              </div>
              <div class="prize-info-line">
                <span class="info-label">奖品名称：</span>{{ item.name }}
              </div>
            </td>
            <!-- 奖品编码 -->
            <td>{{ item.code }}</td>
            <!-- 奖品图片 -->
            <td>
              <div class="prize-img">
                <img v-if="item.image" :src="item.image" alt="" />
                <div v-else class="img-placeholder">
                  <svg viewBox="0 0 40 40" width="40" height="40">
                    <rect width="40" height="40" rx="4" fill="#f0f0f5" />
                    <text x="20" y="26" text-anchor="middle" fill="#bbb" font-size="14">图</text>
                  </svg>
                </div>
              </div>
            </td>
            <!-- 奖品类型 -->
            <td>{{ item.type }}</td>
            <!-- 奖品状态 -->
            <td>
              <span class="status-tag" :class="statusClass(item.status)">{{ item.status }}</span>
            </td>
            <!-- 奖品份数 -->
            <td class="stock-cell">
              <div>库存：{{ item.stockDisplay }}</div>
              <div v-if="item.consumed != null">消耗：{{ item.consumed }}</div>
            </td>
            <!-- 兑换消耗金豆 -->
            <td>金豆：{{ item.goldBean }}</td>
            <!-- 所属奖池 -->
            <td>{{ item.pool }}({{ item.poolId }})</td>
            <!-- 奖品人群包定向 -->
            <td class="crowd-cell">
              <template v-if="item.crowdPack && item.crowdPack.length">
                <div class="crowd-tags">
                  <span v-for="(tag, idx) in (item.crowdExpanded ? item.crowdPack : item.crowdPack.slice(0, 1))" :key="idx" class="crowd-tag">
                    <span class="crowd-key">{{ tag.key }}</span>
                    <span class="crowd-op">{{ tag.op }}</span>
                    <span class="crowd-val">{{ tag.value }}</span>
                  </span>
                </div>
                <a v-if="item.crowdPack.length > 1" class="crowd-expand-link" href="javascript:void(0)" @click="item.crowdExpanded = !item.crowdExpanded">
                  {{ item.crowdExpanded ? '收起' : '展开' }}
                </a>
              </template>
              <span v-else class="no-data">-</span>
            </td>
            <!-- 生效时间 -->
            <td class="time-cell">
              <div>{{ item.startTime }}</div>
              <div>- {{ item.endTime }}</div>
            </td>
            <!-- 操作人/操作时间 -->
            <td class="operator-cell">
              <div>{{ item.operator }}</div>
              <div>{{ item.operateTime }}</div>
            </td>
            <!-- 操作 -->
            <td class="action-cell">
              <a class="action-link" href="javascript:void(0)" @click="editPrize(item)">编辑</a>
              <a class="action-link" :href="getExchangeDetailUrl(item)" target="_blank">查看兑换明细</a>
              <a v-if="item.showManualSend" class="action-link" href="javascript:void(0)" @click="manualSend(item)">手动发放</a>
              <a class="action-link" href="javascript:void(0)" @click="copyPrize(item)">复制</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <span class="total-text">共{{ totalCount }}条</span>
      <div class="page-nav">
        <button class="page-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          class="page-btn"
          :class="{ active: p === currentPage }"
          @click="goToPage(p)"
        >
          {{ p }}
        </button>
        <button v-if="showForwardSkip" class="page-btn skip-btn" @click="goToPage(currentPage + 5)">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M5.59 7.41L7 6l6 6-6 6-1.41-1.41L10.17 12z"/><path d="M11.59 7.41L13 6l6 6-6 6-1.41-1.41L16.17 12z"/></svg>
          •••
        </button>
        <button v-if="showLastPage" class="page-btn" @click="goToPage(totalPages)">{{ totalPages }}</button>
        <button class="page-btn" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
        </button>
      </div>
      <div class="page-size-select">
        <div class="select-wrap small">
          <select v-model.number="pageSize" @change="applyFilters">
            <option :value="20">20 条/页</option>
            <option :value="50">50 条/页</option>
            <option :value="100">100 条/页</option>
          </select>
        </div>
        <span class="jump-text">跳至</span>
        <input v-model="jumpPage" class="jump-input" type="text" @keydown.enter="handleJump" />
        <span class="jump-text">页</span>
      </div>
    </div>

    <!-- 弹窗: 添加/编辑/查看 -->
    <div v-if="dialog.visible" class="dialog-overlay" @click.self="closeDialog">
      <div class="dialog-panel">
        <div class="dialog-header">
          <span class="dialog-title">{{ dialogTitle }}</span>
          <button class="dialog-close" @click="closeDialog">×</button>
        </div>
        <div class="dialog-body">
          <!-- 奖品名称(对外展示) -->
          <div class="form-row required">
            <label class="form-label">奖品名称(对外展示)</label>
            <div class="form-field">
              <input v-model.trim="dialog.form.name" :disabled="dialog.mode === 'view'" type="text" placeholder="最多50个字" maxlength="50" />
            </div>
          </div>

          <!-- 奖品图片(对外展示) -->
          <div class="form-row">
            <label class="form-label">奖品图片(对外展示)</label>
            <div class="form-field upload-row">
              <div class="upload-box">+</div>
              <div class="upload-hint-wrap">
                <a class="preview-link" href="javascript:void(0)">预览</a>
                <div class="upload-hint">建议尺寸1280*1280，支持jpg、png、gif、jpeg格式的图片</div>
              </div>
            </div>
          </div>

          <!-- 角标文案 -->
          <div class="form-row">
            <label class="form-label">角标文案</label>
            <div class="form-field compact-field">
              <input v-model.trim="dialog.form.cornerText" :disabled="dialog.mode === 'view'" type="text" placeholder="请输入" maxlength="4" />
            </div>
          </div>

          <!-- 奖品类型 -->
          <div class="form-row required">
            <label class="form-label">奖品类型</label>
            <div class="form-field compact-field">
              <div class="select-wrap">
                <select v-model="dialog.form.type" :disabled="dialog.mode === 'view'">
                  <option value="">请选择</option>
                  <option v-for="t in dialogTypeOptions" :key="t" :value="t">{{ t }}</option>
                </select>
                <span class="select-arrow">▾</span>
              </div>
            </div>
          </div>

          <!-- 关联星火商品（仅星火类型显示） -->
          <div v-if="showXinghuoField" class="form-row required">
            <label class="form-label">关联星火商品</label>
            <div class="form-field compact-field xinghuo-field">
              <div class="select-wrap">
                <select v-model="dialog.form.selectedXinghuoCode" :disabled="dialog.mode === 'view'" @change="onXinghuoSelected">
                  <option value="">请选择</option>
                  <option v-for="prod in xinghuoProducts" :key="prod.code" :value="prod.code">{{ prod.code }}-{{ prod.name }}</option>
                </select>
                <span class="select-arrow">▾</span>
              </div>
              <div v-if="dialog.form.selectedXinghuo" class="xinghuo-info">
                面额（元）：{{ dialog.form.selectedXinghuo.denomination != null ? Number(dialog.form.selectedXinghuo.denomination).toFixed(2) : '/' }}　　最低折扣限制：{{ dialog.form.discountMode === 'limited' && dialog.form.discountValue ? Number(dialog.form.discountValue).toFixed(2) : '无限制' }}
              </div>
            </div>
          </div>

          <!-- 库存 -->
          <div class="form-row required">
            <label class="form-label">库存</label>
            <div class="form-field">
              <label class="checkbox-line">
                <input v-model="dialog.form.stockUnlimited" :disabled="dialog.mode === 'view'" type="checkbox" />
                <span>无上限</span>
              </label>
              <div class="inline-row" style="margin-left: 16px;">
                <input v-model="dialog.form.stockCount" :disabled="dialog.mode === 'view' || dialog.form.stockUnlimited" class="short-input" type="number" min="0" placeholder="库存数量" />
              </div>
            </div>
          </div>

          <div class="form-row no-label">
            <label class="form-label"></label>
            <div class="form-field">
              <label class="checkbox-line">
                <input v-model="dialog.form.enableStockWarning" :disabled="dialog.mode === 'view'" type="checkbox" />
                <span>启用钉钉库存预警</span>
              </label>
            </div>
          </div>

          <!-- 官方价格(元) -->
          <div class="form-row">
            <label class="form-label">官方价格(元)</label>
            <div class="form-field compact-field amount-field">
              <div class="amount-wrap">
                <input v-model="dialog.form.price" :disabled="dialog.mode === 'view'" type="number" min="0" placeholder="请输入" />
                <span class="unit-text">元</span>
              </div>
              <div v-if="priceError" class="field-error">{{ priceError }}</div>
            </div>
          </div>

          <!-- 所属兑换池 -->
          <div class="form-row required">
            <label class="form-label">所属兑换池</label>
            <div class="form-field compact-field">
              <div class="select-wrap">
                <select v-model="dialog.form.pool" :disabled="dialog.mode === 'view'">
                  <option value="">请选择</option>
                  <option v-for="p in poolOptions" :key="p" :value="p">{{ p }}</option>
                </select>
                <span class="select-arrow">▾</span>
              </div>
            </div>
          </div>

          <!-- 使用须知 -->
          <div class="form-row">
            <label class="form-label">使用须知</label>
            <div class="form-field">
              <textarea v-model="dialog.form.usageNote" :disabled="dialog.mode === 'view'" rows="3" placeholder="请输入使用须知"></textarea>
            </div>
          </div>

          <!-- 价格策略（仅金豆兑换显示） -->
          <template v-if="!isNonGoldBeanMenu">
            <div class="section-divider">价格策略</div>

            <div v-for="(strategy, si) in dialog.form.priceStrategies" :key="si" class="strategy-block">
              <div class="strategy-tab-header">
                <span class="strategy-tab" :class="{ active: dialog.form.activeStrategy === si }" @click="dialog.form.activeStrategy = si">策略 {{ si + 1 }}</span>
                <a v-if="dialog.form.priceStrategies.length > 1 && dialog.mode !== 'view'" class="strategy-delete-link" href="javascript:void(0)" @click="removePriceStrategy(si)">删除</a>
              </div>

              <div v-show="dialog.form.activeStrategy === si" class="strategy-body">
                <div class="form-row">
                  <label class="form-label">项 ID</label>
                  <div class="form-field compact-field">
                    <input v-model="strategy.itemId" :disabled="dialog.mode === 'view'" type="text" placeholder="请输入" />
                  </div>
                </div>

                <div class="form-row required">
                  <label class="form-label">兑换1份奖品消耗金豆数</label>
                  <div class="form-field compact-field">
                    <input v-model="strategy.goldBean" :disabled="dialog.mode === 'view'" type="number" min="0" placeholder="请输入金豆数" />
                  </div>
                </div>

                <div class="form-row">
                  <label class="form-label">每用户数量限制</label>
                  <div class="form-field">
                    <div v-for="(limit, li) in strategy.userLimits" :key="li" class="user-limit-row">
                      <div class="user-limit-fields">
                        <span>每</span>
                        <input v-model="limit.everyValue" :disabled="dialog.mode === 'view'" class="step-input" type="number" min="1" />
                        <select v-model="limit.everyUnit" :disabled="dialog.mode === 'view'" class="unit-select">
                          <option value="天">天</option>
                          <option value="周">周</option>
                          <option value="月">月</option>
                        </select>
                        <span>可获得</span>
                        <input v-model="limit.gainValue" :disabled="dialog.mode === 'view'" class="step-input" type="number" min="1" />
                        <span>次</span>
                      </div>
                      <a v-if="strategy.userLimits.length > 1 && dialog.mode !== 'view'" class="limit-delete-link" href="javascript:void(0)" @click="strategy.userLimits.splice(li, 1)">删除</a>
                    </div>
                    <a v-if="dialog.mode !== 'view'" class="add-limit-link" href="javascript:void(0)" @click="addUserLimit(strategy)">添加数量限制</a>
                  </div>
                </div>

                <!-- 奖品人群包定向 -->
                <div class="form-row">
                  <label class="form-label">奖品人群包定向</label>
                  <div class="form-field">
                    <div class="crowd-pack-section">
                      <div v-for="(group, gi) in strategy.crowdGroups" :key="gi" class="crowd-group">
                        <div v-for="(cond, ci) in group.conditions" :key="ci" class="crowd-condition-row">
                          <template v-if="ci > 0">
                            <span class="crowd-logic">且</span>
                          </template>
                          <div class="select-wrap" style="width: 140px;">
                            <select v-model="cond.field" :disabled="dialog.mode === 'view'">
                              <option value="">请选择</option>
                              <option v-for="f in crowdFieldOptions" :key="f" :value="f">{{ f }}</option>
                            </select>
                            <span class="select-arrow">▾</span>
                          </div>
                        </div>
                        <a v-if="dialog.mode !== 'view'" class="crowd-action-link" href="javascript:void(0)" @click="removeCrowdGroup(strategy, gi)">删除条件组</a>
                      </div>
                      <div class="crowd-actions">
                        <a v-if="dialog.mode !== 'view'" class="crowd-action-link" href="javascript:void(0)" @click="addCrowdGroup(strategy)">添加条件组</a>
                        <a v-if="dialog.mode !== 'view' && strategy.crowdGroups.length" class="crowd-action-link clear-link" href="javascript:void(0)" @click="strategy.crowdGroups = []">清除数据</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="dialog.mode !== 'view'" style="margin-bottom: 14px;">
              <a class="add-strategy-link" href="javascript:void(0)" @click="addPriceStrategy">添加价格策略</a>
            </div>
          </template>

          <!-- 简化版：仅非金豆兑换菜单显示 -->
          <template v-if="isNonGoldBeanMenu">
            <div class="form-row required">
              <label class="form-label">兑换1份奖品消耗金豆数</label>
              <div class="form-field compact-field">
                <input v-model="dialog.form.priceStrategies[0].goldBean" :disabled="dialog.mode === 'view'" type="number" min="0" placeholder="请输入金豆数" />
              </div>
            </div>

            <!-- 奖品人群包定向 -->
            <div class="form-row">
              <label class="form-label">奖品人群包定向</label>
              <div class="form-field">
                <div class="crowd-pack-section">
                  <div v-for="(group, gi) in dialog.form.priceStrategies[0].crowdGroups" :key="gi" class="crowd-group">
                    <div v-for="(cond, ci) in group.conditions" :key="ci" class="crowd-condition-row">
                      <template v-if="ci > 0">
                        <span class="crowd-logic">且</span>
                      </template>
                      <div class="select-wrap" style="width: 140px;">
                        <select v-model="cond.field" :disabled="dialog.mode === 'view'">
                          <option value="">请选择</option>
                          <option v-for="f in crowdFieldOptions" :key="f" :value="f">{{ f }}</option>
                        </select>
                        <span class="select-arrow">▾</span>
                      </div>
                    </div>
                    <a v-if="dialog.mode !== 'view'" class="crowd-action-link" href="javascript:void(0)" @click="removeCrowdGroup(dialog.form.priceStrategies[0], gi)">删除条件组</a>
                  </div>
                  <div class="crowd-actions">
                    <a v-if="dialog.mode !== 'view'" class="crowd-action-link" href="javascript:void(0)" @click="addCrowdGroup(dialog.form.priceStrategies[0])">添加条件组</a>
                    <a v-if="dialog.mode !== 'view' && dialog.form.priceStrategies[0].crowdGroups.length" class="crowd-action-link clear-link" href="javascript:void(0)" @click="dialog.form.priceStrategies[0].crowdGroups = []">清除数据</a>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 奖品排序 -->
          <div class="form-row">
            <label class="form-label">奖品排序</label>
            <div class="form-field compact-field">
              <input v-model="dialog.form.sortOrder" :disabled="dialog.mode === 'view'" type="number" min="0" placeholder="请输入排序值" />
            </div>
          </div>

          <!-- 生效时间 -->
          <div class="form-row required">
            <label class="form-label">生效时间</label>
            <div class="form-field">
              <div class="date-range-wrap">
                <input v-model="dialog.form.startDate" :disabled="dialog.mode === 'view'" type="date" />
                <span class="date-sep">-</span>
                <input v-model="dialog.form.endDate" :disabled="dialog.mode === 'view'" type="date" />
                <span class="date-icon">◫</span>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn btn-cancel" @click="closeDialog">取 消</button>
          <button v-if="dialog.mode !== 'view'" class="btn btn-primary" @click="saveDialog">保 存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'

// ============ 模拟数据 ============
const createInitialPrizes = () => [
  {
    id: '3381', name: '美团外卖1', code: '1251', type: '福利直充', status: '待上架',
    stockDisplay: '无上限', consumed: null, goldBean: '380000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2036-06-18 10:14:00', endTime: '2036-06-18 10:14:00',
    operator: '系统', operateTime: '2026-06-18 10:19:55', showManualSend: false
  },
  {
    id: '3373', name: '会员体验双月卡（永久1次）', code: '9', type: '美柚会员', status: '已上架',
    stockDisplay: '332', consumed: 1, goldBean: '111', pool: '会员权益商品池', poolId: '2906',
    crowdPack: null, crowdExpanded: false,
    startTime: '2026-06-15 11:26:26', endTime: '2026-06-30 11:25:28',
    operator: '余敏', operateTime: '2026-06-18 10:32:19', showManualSend: false
  },
  {
    id: '3372', name: '头像C（每年3次）', code: '13', type: '头像挂件', status: '已上架',
    stockDisplay: '20', consumed: 2, goldBean: '11', pool: '社区商品池', poolId: '2907',
    crowdPack: null, crowdExpanded: false,
    startTime: '2026-06-15 11:25:25', endTime: '2026-06-30 11:24:00',
    operator: '余敏', operateTime: '2026-06-18 10:40:28', showManualSend: true
  },
  {
    id: '3370', name: '908新增字段校验', code: '1249', type: '福利卡券', status: '已停售',
    stockDisplay: '无上限', consumed: 1, goldBean: '100000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2026-06-15 10:32:10', endTime: '2026-06-30 10:34:18',
    operator: '系统', operateTime: '2026-06-22 14:06:11', showManualSend: false
  },
  {
    id: '3360', name: '美团外卖兑换码-失败', code: '1248', type: '福利卡券', status: '已停售',
    stockDisplay: '无上限', consumed: 1, goldBean: '100000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2026-06-12 16:56:10', endTime: '2026-06-30 16:59:25',
    operator: '系统', operateTime: '2026-06-22 14:06:11', showManualSend: false
  },
  {
    id: '3359', name: '平台api', code: '1247', type: '福利直充', status: '已上架',
    stockDisplay: '无上限', consumed: 2, goldBean: '100000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2026-06-12 16:22:10', endTime: '2026-06-30 16:23:55',
    operator: '系统', operateTime: '2026-06-18 11:34:11', showManualSend: false
  },
  {
    id: '3358', name: '美团外卖', code: '1246', type: '福利直充', status: '已上架',
    stockDisplay: '无上限', consumed: 2, goldBean: '380000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2026-06-12 16:16:10', endTime: '2026-06-30 16:23:32',
    operator: '系统', operateTime: '2026-06-18 10:14:01', showManualSend: false
  },
  {
    id: '3357', name: '饿了么api1天1次标准教程图', code: '1245', type: '福利直充', status: '已上架',
    stockDisplay: '无上限', consumed: 2, goldBean: '100000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2026-06-12 09:50:10', endTime: '2026-06-30 16:23:03',
    operator: '余敏', operateTime: '2026-06-15 16:33:27', showManualSend: false
  },
  {
    id: '3356', name: '饿了么api1天1次无教程图', code: '1244', type: '福利直充', status: '已上架',
    stockDisplay: '无上限', consumed: 3, goldBean: '100000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2026-06-12 09:40:10', endTime: '2026-06-30 09:48:02',
    operator: '余敏', operateTime: '2026-06-15 16:29:00', showManualSend: false
  },
  {
    id: '3348', name: '美团', code: '1243', type: '福利直充', status: '已上架',
    stockDisplay: '无上限', consumed: 6, goldBean: '19900', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2026-06-10 14:12:10', endTime: '2026-07-11 14:18:44',
    operator: '系统', operateTime: '2026-06-18 10:14:01', showManualSend: false
  },
  {
    id: '3347', name: '领取后1天失效', code: '1222', type: '福利URL', status: '已上架',
    stockDisplay: '无上限', consumed: 3, goldBean: '50000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2026-06-10 11:38:10', endTime: '2026-06-30 13:50:34',
    operator: '系统', operateTime: '2026-06-22 14:06:11', showManualSend: false
  },
  {
    id: '3346', name: 'copy饿了么api1天1次', code: '1241', type: '福利直充', status: '待上架',
    stockDisplay: '无上限', consumed: null, goldBean: '100000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2036-06-10 10:00:10', endTime: '2036-06-10 10:00:10',
    operator: '系统', operateTime: '2026-06-10 10:00:11', showManualSend: false
  },
  {
    id: '3341', name: '会员体验1天(一天1次)', code: '10', type: '美柚会员', status: '已上架',
    stockDisplay: '39978', consumed: 1, goldBean: '4001', pool: '会员权益商品池', poolId: '2906',
    crowdPack: [{ key: '是否会员', op: '等于', value: '否' }], crowdExpanded: false,
    startTime: '2026-06-09 16:31:43', endTime: '2027-05-31 19:35:47',
    operator: '余敏', operateTime: '2026-06-18 10:41:31', showManualSend: false
  },
  {
    id: '3340', name: '会员体验1天(终生1次)', code: '10', type: '美柚会员', status: '已上架',
    stockDisplay: '39978', consumed: 1, goldBean: '4001', pool: '会员权益商品池', poolId: '2906',
    crowdPack: [{ key: '是否会员', op: '等于', value: '否' }], crowdExpanded: false,
    startTime: '2026-06-09 16:31:43', endTime: '2027-05-31 19:35:47',
    operator: '余敏', operateTime: '2026-06-09 18:16:38', showManualSend: false
  },
  {
    id: '3339', name: 'copycopy平台url', code: '122200', type: '福利URL', status: '已停售',
    stockDisplay: '无上限', consumed: null, goldBean: '50000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2036-06-09 16:04:10', endTime: '2036-06-09 16:04:10',
    operator: '系统', operateTime: '2026-06-22 14:06:11', showManualSend: false
  },
  {
    id: '3338', name: 'copy平台url', code: '1226', type: '福利URL', status: '待上架',
    stockDisplay: '无上限', consumed: null, goldBean: '50000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2036-06-09 16:04:10', endTime: '2036-06-09 16:04:10',
    operator: '系统', operateTime: '2026-06-22 14:06:11', showManualSend: false
  },
  {
    id: '3337', name: 'copy平台url', code: '1225', type: '福利URL', status: '待上架',
    stockDisplay: '无上限', consumed: null, goldBean: '50000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2036-06-09 16:04:10', endTime: '2036-06-09 16:04:10',
    operator: '系统', operateTime: '2026-06-22 14:06:11', showManualSend: false
  },
  {
    id: '3336', name: 'copy平台url', code: '1221', type: '福利URL', status: '待上架',
    stockDisplay: '无上限', consumed: null, goldBean: '50000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2036-06-09 16:04:10', endTime: '2036-06-09 16:04:10',
    operator: '系统', operateTime: '2026-06-22 14:06:11', showManualSend: false
  },
  {
    id: '3335', name: 'copy平台url', code: '1219', type: '福利URL', status: '待上架',
    stockDisplay: '无上限', consumed: null, goldBean: '50000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2036-06-09 16:04:10', endTime: '2036-06-09 16:04:10',
    operator: '系统', operateTime: '2026-06-22 14:06:11', showManualSend: false
  },
  {
    id: '3334', name: 'copy平台url', code: '1218', type: '福利URL', status: '待上架',
    stockDisplay: '无上限', consumed: null, goldBean: '50000', pool: '福利商品池', poolId: '3253',
    crowdPack: null, crowdExpanded: false,
    startTime: '2036-06-09 16:04:10', endTime: '2036-06-09 16:04:10',
    operator: '系统', operateTime: '2026-06-22 14:06:11', showManualSend: false
  }
]

const createXinghuoProducts = () => [
  { code: 'DG202604171541350362', name: '5元星火数品卡券', denomination: '5.00', stock: 9999, price: '5.00' },
  { code: 'DG202604291750400378', name: '1点星火数品直充', denomination: '1.00', stock: 5000, price: '1.00' },
  { code: 'DG20260501001', name: '10元星火数品卡券', denomination: '10.00', stock: 3000, price: '10.00' },
  { code: 'DG20260501002', name: '20元星火数品卡券', denomination: '20.00', stock: 2000, price: '20.00' },
  { code: 'DG20260501003', name: '50元星火数品直充', denomination: '50.00', stock: 800, price: '50.00' },
  { code: 'DG20260501004', name: '100元星火数品卡券', denomination: '100.00', stock: 500, price: '100.00' },
  { code: 'DG20260501005', name: '2点星火数品直充', denomination: '2.00', stock: 1500, price: '2.00' },
  { code: 'DG20260501006', name: '30元星火数品卡券', denomination: '30.00', stock: 1200, price: '30.00' }
]

const createEmptyPriceStrategy = () => ({
  itemId: '',
  goldBean: '',
  userLimits: [{ everyValue: 1, everyUnit: '天', gainValue: 1 }],
  crowdGroups: []
})

const createEmptyDialogForm = () => ({
  name: '', type: '', cornerText: '', 
  stockUnlimited: true, stockCount: '', enableStockWarning: false,
  price: '', pool: '', usageNote: '',
  priceStrategies: [createEmptyPriceStrategy()],
  activeStrategy: 0,
  sortOrder: '',
  startDate: '', endDate: '',
  selectedXinghuoCode: '', selectedXinghuo: null,
  discountMode: 'unlimited', discountValue: ''
})

export default {
  name: 'PrizeExchangeManagement',
  props: {
    activeMenu: { type: String, default: 'goldBean' }
  },
  setup(props) {
    const isNonGoldBeanMenu = computed(() => props.activeMenu && props.activeMenu !== 'goldBean')

    const typeOptions = ['福利直充', '福利卡券', '福利URL', '美柚会员', '头像挂件', '星火数品直充', '星火数品卡券']
    const dialogTypeOptions = ['头像挂件', '星火数品直充', '星火数品卡券', '美柚会员', '福利直充', '福利URL', '福利卡券']
    const poolOptions = ['福利商品池', '会员权益商品池', '社区商品池']
    const crowdFieldOptions = ['是否会员', '是否新用户', '用户等级', '注册时间', '活跃度']
    const xinghuoProducts = createXinghuoProducts()

    const filters = reactive({
      id: '', name: '', status: '', type: '', pool: ''
    })

    const allPrizes = ref(createInitialPrizes())
    const displayedPrizes = ref([...allPrizes.value])

    const currentPage = ref(1)
    const pageSize = ref(20)
    const jumpPage = ref('')
    const filteredData = ref([...allPrizes.value])

    // 分页计算
    const totalCount = computed(() => filteredData.value.length)
    const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)))

    const visiblePages = computed(() => {
      const pages = []
      const maxShow = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxShow / 2))
      const end = Math.min(totalPages.value, start + maxShow - 1)
      if (end - start + 1 < maxShow) {
        start = Math.max(1, end - maxShow + 1)
      }
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    const showForwardSkip = computed(() => {
      const lastVisible = visiblePages.value[visiblePages.value.length - 1] || 0
      return lastVisible < totalPages.value - 1
    })

    const showLastPage = computed(() => {
      const lastVisible = visiblePages.value[visiblePages.value.length - 1] || 0
      return lastVisible < totalPages.value
    })

    const applyPageData = () => {
      const start = (currentPage.value - 1) * pageSize.value
      displayedPrizes.value = filteredData.value.slice(start, start + pageSize.value)
    }

    const applyFilters = () => {
      filteredData.value = allPrizes.value.filter(item => {
        if (filters.id && !item.id.includes(filters.id)) return false
        if (filters.name && !item.name.includes(filters.name)) return false
        if (filters.status && item.status !== filters.status) return false
        if (filters.type && item.type !== filters.type) return false
        if (filters.pool && item.pool !== filters.pool) return false
        return true
      })
      currentPage.value = 1
      applyPageData()
    }

    const goToPage = (p) => {
      const target = Math.max(1, Math.min(totalPages.value, p))
      if (target !== currentPage.value) {
        currentPage.value = target
        applyPageData()
      }
    }

    const handleJump = () => {
      const num = parseInt(jumpPage.value, 10)
      if (!isNaN(num)) {
        goToPage(num)
      }
      jumpPage.value = ''
    }

    const statusClass = (status) => ({
      'status-online': status === '已上架',
      'status-pending': status === '待上架',
      'status-stopped': status === '已停售'
    })

    const toggleAllCrowdPack = () => {
      allPrizes.value.forEach(item => {
        if (item.crowdPack && item.crowdPack.length > 1) {
          item.crowdExpanded = !item.crowdExpanded
        }
      })
      applyFilters()
    }

    const getExchangeDetailUrl = (item) => {
      const tabMap = {
        '福利直充': 'welfare', '福利卡券': 'welfare', '福利URL': 'welfare',
        '美柚会员': 'my_vip', '头像挂件': 'pendant'
      }
      return `https://test-admin.meiyou.com/app/test-exchange-admin.seeyouyima.com/wallet/product-management/order?product_ids=${item.id}&activeTab=${tabMap[item.type] || 'welfare'}`
    }

    // ============ Dialog ============
    const dialog = reactive({
      visible: false,
      mode: 'create',
      form: createEmptyDialogForm()
    })

    const dialogTitle = computed(() => {
      if (dialog.mode === 'view') return '查看奖品'
      if (dialog.mode === 'edit') return '编辑奖品'
      return '添加奖品'
    })

    const showXinghuoField = computed(() =>
      ['星火数品直充', '星火数品卡券'].includes(dialog.form.type)
    )

    const minDiscountPrice = computed(() => {
      if (!showXinghuoField.value || !dialog.form.selectedXinghuo) return null
      if (dialog.form.discountMode !== 'limited' || !dialog.form.discountValue) return null
      const face = Number(dialog.form.selectedXinghuo.denomination)
      const discount = Number(dialog.form.discountValue)
      if (!face || !discount) return null
      return +(face * discount).toFixed(2)
    })

    const priceError = computed(() => {
      if (!minDiscountPrice.value) return ''
      const price = Number(dialog.form.price)
      if (price && price < minDiscountPrice.value) {
        return `官方价格不能低于最低折扣价${minDiscountPrice.value}`
      }
      return ''
    })

    const onXinghuoSelected = () => {
      const code = dialog.form.selectedXinghuoCode
      dialog.form.selectedXinghuo = xinghuoProducts.find(p => p.code === code) || null
      dialog.form.discountMode = 'unlimited'
      dialog.form.discountValue = ''
    }

    const openCreateDialog = () => {
      dialog.mode = 'create'
      dialog.form = createEmptyDialogForm()
      dialog.form.selectedXinghuoCode = ''
      dialog.form.selectedXinghuo = null
      dialog.visible = true
    }

    const viewPrizeDetail = (item) => {
      dialog.mode = 'view'
      dialog.form = {
        name: item.name || '',
        type: item.type || '',
        cornerText: '',
        stockUnlimited: item.stockDisplay === '无上限',
        stockCount: item.stockDisplay === '无上限' ? '' : (item.stockDisplay || ''),
        enableStockWarning: false,
        price: '',
        pool: item.pool || '',
        usageNote: '',
        priceStrategies: [createEmptyPriceStrategy()],
        activeStrategy: 0,
        sortOrder: '',
        startDate: (item.startTime || '').split(' ')[0],
        endDate: (item.endTime || '').split(' ')[0],
        selectedXinghuoCode: '', selectedXinghuo: null,
        discountMode: 'unlimited', discountValue: ''
      }
      dialog.visible = true
    }

    const editPrize = (item) => {
      dialog.mode = 'edit'
      dialog.form = {
        name: item.name || '',
        type: item.type || '',
        cornerText: '',
        stockUnlimited: item.stockDisplay === '无上限',
        stockCount: item.stockDisplay === '无上限' ? '' : (item.stockDisplay || ''),
        enableStockWarning: false,
        price: '',
        pool: item.pool || '',
        usageNote: '',
        priceStrategies: [createEmptyPriceStrategy()],
        activeStrategy: 0,
        sortOrder: '',
        startDate: (item.startTime || '').split(' ')[0],
        endDate: (item.endTime || '').split(' ')[0],
        selectedXinghuoCode: '', selectedXinghuo: null,
        discountMode: 'unlimited', discountValue: ''
      }
      dialog.visible = true
    }

    const closeDialog = () => {
      dialog.visible = false
    }

    const copyPrize = (item) => {
      const newItem = {
        ...item,
        id: String(Math.max(...allPrizes.value.map(p => Number(p.id))) + 1),
        name: `${item.name}-复制`,
        status: '待上架',
        operateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
      allPrizes.value.unshift(newItem)
      applyFilters()
    }

    const manualSend = (item) => {
      alert(`手动发放: ${item.name} (ID: ${item.id})`)
    }

    // 价格策略操作
    const addPriceStrategy = () => {
      dialog.form.priceStrategies.push(createEmptyPriceStrategy())
      dialog.form.activeStrategy = dialog.form.priceStrategies.length - 1
    }

    const removePriceStrategy = (index) => {
      if (dialog.form.priceStrategies.length <= 1) return
      dialog.form.priceStrategies.splice(index, 1)
      if (dialog.form.activeStrategy >= dialog.form.priceStrategies.length) {
        dialog.form.activeStrategy = dialog.form.priceStrategies.length - 1
      }
    }

    const addUserLimit = (strategy) => {
      strategy.userLimits.push({ everyValue: 1, everyUnit: '天', gainValue: 1 })
    }

    const addCrowdGroup = (strategy) => {
      strategy.crowdGroups.push({ conditions: [{ field: '' }] })
    }

    const removeCrowdGroup = (strategy, index) => {
      strategy.crowdGroups.splice(index, 1)
    }

    const saveDialog = () => {
      if (!dialog.form.name.trim()) return
      if (!dialog.form.type) return
      if (showXinghuoField.value && !dialog.form.selectedXinghuo) return

      if (dialog.mode === 'edit') {
        const idx = allPrizes.value.findIndex(p => p.id === dialog.form.id)
        if (idx > -1) {
          allPrizes.value[idx] = {
            ...allPrizes.value[idx],
            name: dialog.form.name,
            type: dialog.form.type,
            pool: dialog.form.pool || allPrizes.value[idx].pool,
            stockDisplay: dialog.form.stockUnlimited ? '无上限' : (dialog.form.stockCount || '0'),
            startTime: dialog.form.startDate + ' 00:00:00',
            endTime: dialog.form.endDate + ' 23:59:59'
          }
        }
      } else if (dialog.mode === 'create') {
        const newId = String(Math.max(...allPrizes.value.map(p => Number(p.id))) + 1)
        const codeMap = {
          '福利直充': String(Math.floor(Math.random() * 9000) + 1200),
          '福利卡券': String(Math.floor(Math.random() * 9000) + 1200),
          '福利URL': String(Math.floor(Math.random() * 9000) + 1200),
          '美柚会员': '10',
          '头像挂件': '13'
        }
        const xinghuoCode = showXinghuoField.value && dialog.form.selectedXinghuo
          ? dialog.form.selectedXinghuo.code : ''
        const primaryStrategy = dialog.form.priceStrategies[0]
        const targetPool = dialog.form.pool || '福利商品池'
        const poolMap = { '福利商品池': '3253', '会员权益商品池': '2906', '社区商品池': '2907' }
        allPrizes.value.unshift({
          id: newId,
          name: dialog.form.name,
          code: codeMap[dialog.form.type] || xinghuoCode || String(Math.floor(Math.random() * 9000) + 1000),
          type: dialog.form.type,
          status: '待上架',
          stockDisplay: dialog.form.stockUnlimited ? '无上限' : (dialog.form.stockCount || '0'),
          consumed: 0,
          goldBean: primaryStrategy.goldBean || '0',
          pool: targetPool,
          poolId: poolMap[targetPool] || '3253',
          crowdPack: primaryStrategy.crowdGroups.length
            ? primaryStrategy.crowdGroups.flatMap(g => g.conditions.filter(c => c.field).map(c => ({ key: c.field, op: '等于', value: '...' })))
            : null,
          crowdExpanded: false,
          startTime: dialog.form.startDate + ' 00:00:00',
          endTime: dialog.form.endDate + ' 23:59:59',
          operator: '张家敏',
          operateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          showManualSend: dialog.form.type === '头像挂件'
        })
      }
      applyFilters()
      closeDialog()
    }

    return {
      typeOptions, dialogTypeOptions, poolOptions, crowdFieldOptions, xinghuoProducts,
      filters, displayedPrizes, allPrizes,
      currentPage, pageSize, jumpPage, totalCount, totalPages,
      visiblePages, showForwardSkip, showLastPage,
      applyFilters, goToPage, handleJump, statusClass, toggleAllCrowdPack,
      getExchangeDetailUrl,
      dialog, dialogTitle, showXinghuoField, isNonGoldBeanMenu, minDiscountPrice, priceError, onXinghuoSelected,
      openCreateDialog, viewPrizeDetail, editPrize, copyPrize, manualSend,
      closeDialog, saveDialog,
      addPriceStrategy, removePriceStrategy, addUserLimit,
      addCrowdGroup, removeCrowdGroup
    }
  }
}
</script>

<style scoped>
/* ============ Page Layout ============ */
.prize-content {
  padding: 16px 24px;
  font-size: 13px;
  color: #333;
  flex: 1;
  overflow-y: auto;
}

/* ============ Filter ============ */
.filter-section {
  background: #fff;
  border-radius: 6px;
  padding: 16px 20px;
  margin-bottom: 12px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.filter-field {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-field label {
  white-space: nowrap;
  color: #666;
  font-size: 13px;
}

.filter-field input[type="text"] {
  width: 140px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 13px;
  outline: none;
  transition: border-color .2s;
}

.filter-field input[type="text"]:focus {
  border-color: #ff5c9b;
}

.select-wrap {
  position: relative;
  display: inline-block;
}

.select-wrap select {
  appearance: none;
  width: 130px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 28px 0 10px;
  font-size: 13px;
  background: #fff;
  outline: none;
  cursor: pointer;
}

.select-wrap .select-arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
  font-size: 11px;
}

.btn {
  height: 32px;
  border: none;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 13px;
  cursor: pointer;
  transition: opacity .2s;
}

.btn:hover { opacity: .85; }

.btn-primary {
  background: linear-gradient(135deg, #ff5c9b, #ff4081);
  color: #fff;
}

.btn-add {
  background: linear-gradient(135deg, #ff5c9b, #ff4081);
  color: #fff;
}

.btn-cancel {
  background: #f5f5f7;
  color: #666;
  border: 1px solid #dcdfe6;
}

/* ============ Table ============ */
.table-wrapper {
  background: #fff;
  border-radius: 6px;
  overflow-x: auto;
}

.prize-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1400px;
}

.prize-table thead {
  background: #fafafa;
}

.prize-table th {
  padding: 12px 10px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: #555;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}

.expand-all {
  color: #ff5c9b;
  cursor: pointer;
  font-weight: 400;
  margin-left: 4px;
  font-size: 12px;
}

.prize-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #f0f0f5;
  font-size: 13px;
  vertical-align: top;
}

.prize-table tbody tr:hover {
  background: #fdf2f7;
}

/* 奖品信息列 */
.prize-info-cell .prize-info-line {
  margin-bottom: 2px;
  line-height: 1.6;
}

.prize-info-cell .info-label {
  color: #999;
}

.prize-id-link {
  color: #ff5c9b;
  text-decoration: none;
  cursor: pointer;
}

.prize-id-link:hover {
  text-decoration: underline;
}

/* 图片 */
.prize-img {
  width: 44px;
  height: 44px;
  border-radius: 4px;
  overflow: hidden;
  background: #f8f8fc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prize-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 状态标签 */
.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  white-space: nowrap;
}

.status-online {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-pending {
  background: #fff3e0;
  color: #e65100;
}

.status-stopped {
  background: #fce4ec;
  color: #c62828;
}

/* 库存 */
.stock-cell div {
  line-height: 1.6;
}

/* 人群包 */
.crowd-cell {
  max-width: 180px;
}

.crowd-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 2px;
}

.crowd-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f3f4f8;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.crowd-key { color: #666; }
.crowd-op { color: #ff5c9b; }
.crowd-val { color: #333; font-weight: 500; }

.crowd-expand-link {
  color: #ff5c9b;
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
  margin-top: 2px;
}

.no-data {
  color: #ccc;
}

/* 时间/操作人 */
.time-cell div, .operator-cell div {
  line-height: 1.6;
}

/* 操作列 */
.action-cell {
  white-space: nowrap;
}

.action-link {
  color: #ff5c9b;
  text-decoration: none;
  margin-right: 8px;
  cursor: pointer;
  font-size: 13px;
}

.action-link:hover {
  text-decoration: underline;
}

/* ============ Pagination ============ */
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 6px;
  margin-top: 12px;
}

.total-text {
  color: #999;
  font-size: 13px;
  margin-right: 8px;
}

.page-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s;
}

.page-btn:hover:not(:disabled) {
  color: #ff5c9b;
  border-color: #ff5c9b;
}

.page-btn:disabled {
  opacity: .4;
  cursor: not-allowed;
}

.page-btn.active {
  background: linear-gradient(135deg, #ff5c9b, #ff4081);
  color: #fff;
  border-color: transparent;
}

.skip-btn {
  border: none;
  color: #999;
}

.page-size-select {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.page-size-select .select-wrap.small select {
  width: 100px;
  height: 28px;
  font-size: 12px;
}

.jump-input {
  width: 44px;
  height: 28px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  text-align: center;
  font-size: 13px;
  outline: none;
}

.jump-input:focus {
  border-color: #ff5c9b;
}

.jump-text {
  font-size: 13px;
  color: #666;
}

/* ============ Dialog ============ */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-panel {
  background: #fff;
  border-radius: 8px;
  width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(0,0,0,.15);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #eee;
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
}

.dialog-close {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
}

.dialog-close:hover {
  background: #f5f5f7;
  color: #333;
}

.dialog-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}

.dialog-section-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f5;
}

.section-divider {
  font-weight: 600;
  font-size: 14px;
  margin: 20px 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f5;
}

/* Form Rows */
.form-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 14px;
}

.form-row.required .form-label::before {
  content: '*';
  color: #ff5c9b;
  margin-right: 2px;
}

.form-row.compact {
  margin-bottom: 10px;
}

.form-row.no-label {
  margin-top: -6px;
}

.form-label {
  width: 130px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 12px;
  line-height: 32px;
  font-size: 13px;
  color: #555;
}

.form-field {
  flex: 1;
  min-width: 0;
}

.form-field input[type="text"],
.form-field input[type="number"],
.form-field input[type="date"] {
  width: 100%;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 13px;
  outline: none;
}

.form-field input:focus {
  border-color: #ff5c9b;
}

.form-field select {
  width: 100%;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 13px;
  background: #fff;
  outline: none;
}

.compact-field {
  max-width: 260px;
}

.field-tip {
  font-size: 12px;
  color: #999;
  margin-left: 6px;
}

.hint-icon {
  display: inline-flex;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ddd;
  color: #fff;
  font-size: 10px;
  align-items: center;
  justify-content: center;
  cursor: help;
}

/* Upload */
.upload-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upload-box {
  width: 80px;
  height: 80px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #ccc;
  cursor: pointer;
  background: #fafafa;
  flex-shrink: 0;
}

.upload-box:hover {
  border-color: #ff5c9b;
  color: #ff5c9b;
}

.upload-hint-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-link {
  color: #ff5c9b;
  text-decoration: none;
  font-size: 13px;
  cursor: pointer;
}

.preview-link:hover {
  text-decoration: underline;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

/* Radio / Checkbox */
.radio-line, .checkbox-line {
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 32px;
  font-size: 13px;
}

.checkbox-line input[type="checkbox"] {
  width: 15px;
  height: 15px;
  cursor: pointer;
  accent-color: #ff5c9b;
}

.checkbox-line span {
  user-select: none;
}

.inline-row {
  display: inline-flex;
  align-items: center;
}

.short-input {
  width: 100px;
  height: 28px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 13px;
  text-align: center;
  outline: none;
}

.short-input:focus {
  border-color: #ff5c9b;
}

/* Amount */
.amount-field .amount-wrap {
  position: relative;
  display: inline-block;
}

.amount-field .amount-wrap input {
  width: 200px;
  padding-right: 30px;
}

.unit-text {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

/* Date Range */
.date-range-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-range-wrap input[type="date"] {
  width: 180px;
}

.date-sep {
  color: #999;
  font-size: 14px;
}

.date-icon {
  color: #bbb;
  font-size: 14px;
}

/* Textarea */
textarea {
  width: 100%;
  min-height: 60px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 13px;
  outline: none;
  resize: vertical;
  font-family: inherit;
}

textarea:focus {
  border-color: #ff5c9b;
}

/* Strategy Block */
.strategy-block {
  margin-bottom: 12px;
  border: 1px solid #e8e8ec;
  border-radius: 6px;
  overflow: hidden;
}

.strategy-tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafafa;
  padding: 8px 14px;
  border-bottom: 1px solid #e8e8ec;
}

.strategy-tab {
  font-size: 13px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
  background: transparent;
  transition: all .2s;
}

.strategy-tab:hover {
  color: #ff5c9b;
}

.strategy-tab.active {
  color: #ff5c9b;
  background: #fff0f6;
}

.strategy-delete-link {
  color: #ff5c9b;
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
}

.strategy-delete-link:hover {
  text-decoration: underline;
}

.strategy-body {
  padding: 14px 14px 4px;
  background: #fff;
}

.add-strategy-link {
  color: #ff5c9b;
  font-size: 13px;
  text-decoration: none;
  cursor: pointer;
}

.add-strategy-link:hover {
  text-decoration: underline;
}

/* User Limit */
.user-limit-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.user-limit-fields {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.step-input {
  width: 50px;
  height: 28px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  text-align: center;
  font-size: 13px;
  outline: none;
}

.step-input:focus {
  border-color: #ff5c9b;
}

.unit-select {
  height: 28px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 6px;
  font-size: 13px;
  background: #fff;
}

.add-limit-link, .limit-delete-link {
  color: #ff5c9b;
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
}

.add-limit-link:hover, .limit-delete-link:hover {
  text-decoration: underline;
}

/* Crowd Pack */
.crowd-pack-section {
  font-size: 13px;
}

.crowd-group {
  margin-bottom: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 4px;
}

.crowd-condition-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.crowd-logic {
  color: #ff5c9b;
  font-weight: 500;
  font-size: 13px;
  margin: 0 4px;
}

.crowd-action-link {
  color: #ff5c9b;
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
  margin-right: 8px;
}

.crowd-action-link:hover {
  text-decoration: underline;
}

.crowd-action-link.clear-link {
  color: #999;
}

.crowd-actions {
  margin-top: 6px;
}

/* Xinghuo Field */
.xinghuo-field .xinghuo-info {
  margin-top: 6px;
  font-size: 12px;
  color: #999;
  line-height: 1.6;
}

.field-error {
  margin-top: 4px;
  font-size: 12px;
  color: #e74c3c;
  line-height: 1.4;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #eee;
}

.dialog-footer .btn {
  min-width: 80px;
}
</style>
