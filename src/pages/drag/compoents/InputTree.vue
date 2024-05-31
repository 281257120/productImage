<!--
* @Description:
* @Author: Liu Yang
* @Date: 2023-03-17 14:02:49
 * @LastEditTime: 2024-05-31 11:24:12
 * @LastEditors: Liu Yang
-->
<template>
  <div class="input-card" :class="menuItem.prop, store.system.useUserStore(pinia).className">
    <div :class="{
    'input-card-wrap': true,
    'imput-card-tree-list': ['subordinate_regions', 'river_system', 'data_sources', 'xticks', 'level_str', 'extend', 'alpha', 'shp_file', 'lon_ticks', 'lat_ticks', 'levels'].includes(menuItem.prop)
  }" v-if="'value' in menuItem">
      <div class="title" v-if="!menuItem.isTop">
        {{ menuItem.title }}
        <span v-if="menuItem.prop"> ({{ menuItem.prop == 'levels' ? 'levels,color_code,level_str' : menuItem.prop
          }})</span>
        <el-popover class="prpover-btn" v-if="menuItem.popup" placement="top-start" :width="menuItem.popupWidth"
          trigger="click">
          <template #reference>
            <span class="iconfont icon-bangzhu"></span>
          </template>

          <div v-if="menuItem.popup == 'btn'">
            <div class="title">{{ menuItem.popupObj.title }}</div>
            <div class="cont">
              <div class="line" v-for="(item, index) in menuItem.popupObj.children" ::key="index">
                <div>{{ index + 1 }}、{{ item.label }} {{ item.label_ }}</div>
                <div class="popup-msg">{{ item.msg }}</div>
                <div>{{ item.value }}</div>
              </div>
            </div>
          </div>
          <div v-else class="cont" :innerText="menuItem.popup"></div>
        </el-popover>
      </div>
      <div class="cont">
        <!-- 自定义内容 -->
        <div class="card " v-if="menuItem.isCuntom">
          <!-- 单选框 -->
          <!-- {{ menuItem.popupObj }}
          <div>11111111111111111111111111111</div>
          {{ menuItem.children }}11 -->
          <div class="card radio" v-if="menuItem.popupObj.type == 'radio'">
            <el-radio-group v-model="menuItem.popupObj.value" size="small">
              <el-radio-button @change=customChange(menuItem) v-for="(item, index) in menuItem.popupObj.children"
                :label="item.label" :value="item.value" />
            </el-radio-group>
          </div>
        </div>

        <!-- 单选框 -->
        <div class="card radio" v-if="menuItem.type == 'radio'">
          <el-radio-group @change="inputChange(menuItem.prop)" v-model="menuItem.value" size="small">
            <el-radio-button v-for="(item, index) in menuItem.children" :label="item.label" :value="item.value" />
          </el-radio-group>
        </div>
        <!-- 多选框 -->
        <div class="card" v-if="menuItem.type == 'checkbox'">
          <el-checkbox-group @change="inputChange(menuItem.prop)" v-model="menuItem.value" size="small">
            <el-checkbox v-for="(item, index) in menuItem.children" :label="item.label" :value="item.value" />
          </el-checkbox-group>
        </div>
        <!-- 输入框 -->
        <div class="card input" v-if="menuItem.type == 'input'">
          <el-input :show-password="menuItem.showPassword" size="small" @input="inputChange" v-model="menuItem.value"
            :placeholder="'请输入' + menuItem.title" />
        </div>
        <!-- 输入框文本域 -->
        <div class="card input" v-if="menuItem.type == 'textarea'">
          <el-input autosize type="textarea" :show-password="menuItem.showPassword" size="small" @input="inputChange"
            v-model="menuItem.value" placeholder="Please input" />
        </div>
        <!-- 数字输入框 -->
        <div class="card input" v-if="menuItem.type == 'input-number'">
          <el-input-number size="small" :min="menuItem.min" :max="menuItem.max" @input="inputChange(menuItem.prop)"
            v-model="menuItem.value" placeholder="Please input" />
        </div>
        <!-- 开关 -->
        <div class="card " v-if="menuItem.type == 'switch'">
          <el-switch @change="inputChange(menuItem.prop)" v-model="menuItem.value" />
        </div>
        <!-- 滑块 -->
        <div class="card " v-if="menuItem.type == 'slider'">
          <el-slider size="small" @change="inputChange(menuItem.prop)" v-model="menuItem.value" show-input
            :max="menuItem.max" :min="menuItem.min" :show-stops="menuItem.showStops" :step="menuItem.step" />
        </div>
        <!-- 取色器 -->
        <div class="card " v-if="menuItem.type == 'color-picker'">
          <el-color-picker size="small" @change="inputChange" v-model="menuItem.value" />
        </div>
        <!-- 取色器组 -->
        <div class="card " v-if="menuItem.type == 'color-picker-list'">
          <el-color-picker size="small" v-for="(item, index) in menuItem.value" :key="index" @change="inputChange"
            v-model="menuItem.value[index]"></el-color-picker>
        </div>
        <!-- 输入框组 -->
        <div class="card input" v-if="menuItem.type == 'input-list'">
          <!-- <span v-if="menuItem.value.length <= 0" class="" @click="addLevels(menuItem.value, 0, '低等级')">添加</span> -->
          <div class="wrap" v-for="(item, index) in  menuItem.value " :key="index">
            <!-- <span class="" @click="addLevels(menuItem.value, index)">添加</span> -->
            <el-input :show-password="menuItem.showPassword" size="small" @input="inputChange"
              v-model="menuItem.value[index]" :placeholder="'请输入' + menuItem.title" />
            <!-- <span class="" @click="delLevels(menuItem.value, index)">删除</span> -->
          </div>
        </div>
        <!-- 数字输入框组 -->
        <div class="card input" v-if="menuItem.type == 'input-number-list'">
          <span v-if="menuItem.value.length <= 0" class="add-btn" @click="addLevels(menuItem.value, 0, 1)">添加</span>
          <div class="wrap" v-for="(item, index) in  menuItem.value " :key="index">
            <span class="add-btn" @click="addLevels(menuItem.value, index)">添加</span>
            <el-input-number
              :max="'max' in menuItem && menuItem.prop == 'xticks' && index == menuItem.value.length - 1 ? menuItem.max : menuItem.value[index + 1]"
              :min="'min' in menuItem ? menuItem.min : menuItem.value[index - 1]" size="small"
              @input="inputChange(menuItem.prop)" v-model="menuItem.value[index]" placeholder="Please input" />
            <span class="delete-btn" @click="delLevels(menuItem.value, index)">删除</span>
          </div>
        </div>
        <!-- 图标 -->
        <div class="card " v-if="menuItem.type == 'tree-list'">
          <span v-if="menuItem.value.length <= 0" class="add-btn"
            @click="addLevels(menuItem.value, 0, iconImgTem)">添加</span>
          <div class="card" v-for="(item, index) in menuItem.value" :key="index">
            <span class="add-btn" @click="addLevels(menuItem.value, index)">添加</span>
            <div class="cart flex">
              <div class="title">图{{ index + 1 }}：图标路径 (img_path)</div>
              <el-input style="width: 300px;" size="small" @input="inputChange" v-model="item.img_path"
                :placeholder="'请输入'" />
            </div>
            <div class="cart">
              <div class="title">图标大小及位置 (rect_size)</div>
              <div class="flex" v-for="(ele, index) in item.rect_size" :key="index">
                <div class="title">{{ index == 0 ? '左' : index == 1 ? '下' : index == 2 ? '宽' : '高' }}</div>
                <el-input-number v-model="item.rect_size[index]" size="small" :min="ele.min" :max="ele.max"
                  @input="inputChange('icon_img')" placeholder="Please input" />
              </div>
            </div>
            <div class="cart flex">
              <div class="title">沿x轴对齐方式 (x_alalignment)</div>
              <div class="card radio">
                <el-radio-group @change="inputChange('icon_img')" v-model="item.x_alalignment" size="small">
                  <el-radio-button v-for="(item, index) in radioChildrenTem" :label="item.label" :value="item.value" />
                </el-radio-group>
              </div>
            </div>
            <div class="cart flex">
              <div class="title">沿y轴对齐方式 (y_alalignment)</div>
              <div class="card radio">
                <el-radio-group @change="inputChange('icon_img')" v-model="item.y_alalignment" size="small">
                  <el-radio-button v-for="(item, index) in radioChildrenTem" :label="item.label" :value="item.value" />
                </el-radio-group>
              </div>
            </div>
            <span class="delete-btn" @click="delLevels(menuItem.value, index)">删除</span>

          </div>
        </div>
        <!-- 文组描述 -->
        <div class="card " v-if="menuItem.type == 'tree-list2'">
          <div class="tiile">{{ menuItem.title }}({{ menuItem.prop }})</div>
          <div class='input-card'>
            <span v-if="menuItem.value.length <= 0" class="add-btn"
              @click="addLevels(menuItem.value, 0, otherDescTem)">添加</span>
            <div class="card" v-for="(item, index) in menuItem.value" :key="index">
              <span class="add-btn" @click="addLevels(menuItem.value, index)">添加</span>
              <div class="cart flex">
                <div class="title">x轴坐标位置 (x)</div>
                <el-input-number size="small" @change="inputChange('other_desc')" v-model="item.x"
                  placeholder="请输入内容" />
              </div>
              <div class="cart flex">
                <div class="title">y轴坐标位置 (y)</div>
                <el-input-number size="small" @change="inputChange('other_desc')" v-model="item.y"
                  placeholder="请输入内容" />
              </div>
              <div class="cart flex">
                <div class="title">沿x轴对齐方式 (x_alalignment)565656</div>
                <div class="card radio">
                  <el-radio-group @change="inputChange('other_desc')" v-model="item.x_alalignment" size="small">
                    <el-radio-button v-for="(item, index) in radioChildrenTem" :label="item.label"
                      :value="item.value" />
                  </el-radio-group>
                </div>
              </div>
              <div class="cart flex">
                <div class="title">沿y轴对齐方式 (y_alalignment)</div>
                <div class="card radio">
                  <el-radio-group @change="inputChange('other_desc')" v-model="item.y_alalignment" size="small">
                    <el-radio-button v-for="(item, index) in radioChildrenTem" :label="item.label"
                      :value="item.value" />
                  </el-radio-group>
                </div>
              </div>
              <div class="cart flex">
                <div class="title">标题描述 (s)</div>
                <el-input style="width:300px;" size="small" @input="inputChange" v-model="item.s"
                  :placeholder="'请输入标题描述'" />
              </div>
              <div class="cart " v-if="item.pop">
                <div class="title">字体设置 (pop)</div>
                <div class="cart flex">
                  <div class="title">字体大小 (fontsize)</div>
                  <el-input-number size="small" @input="inputChange('other_desc')" v-model="item.pop.fontsize"
                    placeholder="请输入内容" />
                </div>
                <div class="cart flex">
                  <div class="title">水平对齐 (horizontalalignment)</div>
                  <el-radio-group @change="inputChange('other_desc')" v-model="item.pop.horizontalalignment"
                    size="small">
                    <el-radio-button v-for="(item, index) in radioChildrenTem" :label="item.label"
                      :value="item.value" />
                  </el-radio-group>
                </div>
                <div class="cart flex">
                  <div class="title">垂直对齐 (verticalalignment)</div>
                  <el-radio-group @change="inputChange('other_desc')" v-model="item.pop.verticalalignment" size="small">
                    <el-radio-button v-for="(item, index) in verticalalignmentChildrenTem" :label="item.label"
                      :value="item.value" />
                  </el-radio-group>
                </div>
              </div>
              <span class="delete-btn" @click="delLevels(menuItem.value, index)">删除</span>
            </div>
          </div>
        </div>
        <!-- 更多shp -->
        <div class="card3 " v-if="menuItem.type == 'tree-list3'">
          <div class="flex">
            <div class="m-check" v-for="(item, index) in menuItem.checkeds" :key="index">
              <el-checkbox :disabled="item.isDisabled" @change="checkChange(menuItem, item)" v-model="item.value"
                :label="item.label" size="small" />
            </div>
          </div>
          <div class="card " v-for="(item, index) in menuItem.value" :key="index">
            <div class="title text-center">
              {{ item.lower_level == 1 ? '省' : item.lower_level == 2 ? '市' : item.lower_level == 3
    ? '县' : '镇' }}
            </div>
            <div class="card">
              <div class="title">自定义shp路径，默认空字符为程序自带的shp (shp_file)</div>
              <el-input size="small" @input="inputChange" v-model="item.shp_file" :placeholder="'请输入标题描述'" />
            </div>
            <div class="card flex">
              <div class="title">shp线形宽度 (lw)</div>
              <el-input-number size="small" @input="inputChange('subordinate_regions')" v-model="item.lw"
                placeholder="请输入内容" />
            </div>
            <div class="card flex">
              <div class="title">线形 (ec)</div>
              <el-color-picker size="small" @change="inputChange" v-model="item.ec"></el-color-picker>
            </div>
            <div class="card flex">
              <div class="title">图层顺序 (zorder)</div>
              <el-input-number size="small" :disabled="true" @input="inputChange('subordinate_regions')"
                v-model="item.zorder" placeholder="请输入内容" />
            </div>
            <div class="card">
              <div class="title">是否添加矢量标记 (vector_markers)</div>
              <el-switch @change="changeVectorMarkers(item)" v-model="item.is_display" />
              <div class="card flex" v-if="item.is_display">
                <div class="card flex">
                  <div class="title">需要标记的值在shp中对应的属性名称，如FNAME (attr_info)</div>
                  <el-input size="small" @input="inputChange" v-model="item.vector_markers.attr_info"
                    :placeholder="'请输入'" />
                </div>
                <div class="card flex">
                  <div class="title">通过out_attr_path将标记值导出为csv进行位置的微调后自定义使用,(out_attr_path)</div>
                  <el-input size="small" @input="inputChange" v-model="item.vector_markers.out_attr_path"
                    :placeholder="'请输入'" />
                </div>
                <div class="card flex">
                  <div class="title">图层顺序 (zorder)</div>
                  <el-input-number size="small" @input="inputChange('vector_markers')"
                    v-model="item.vector_markers.zorder" placeholder="请输入内容" />
                </div>
                <div class="input-card">
                  <div class="card flex">
                    <div class="title">绘制标记图形 (draw_mark)</div>
                    <div class="card flex">
                      <div class="title">是否绘制 (is_display)</div>
                      <el-switch @change="inputChange(menuItem.prop)"
                        v-model="item.vector_markers.draw_mark.is_display" />
                    </div>
                    <div class="card flex">
                      <div class="title">颜色 (color)</div>
                      <el-color-picker size="small" @change="inputChange"
                        v-model="item.vector_markers.draw_mark.color"></el-color-picker>
                    </div>
                    <div class="card flex">
                      <div class="title">半径 (radius)</div>
                      <el-input-number size="small" @input="inputChange('subordinate_regions')"
                        v-model="item.vector_markers.draw_mark.radius" placeholder="请输入内容" />
                    </div>

                    <div class="card flex">
                      <div class="title">样式 (style)</div>
                      <el-radio-group @change="inputChange(menuItem.prop)" v-model="item.vector_markers.draw_mark.style"
                        size="small">
                        <el-radio-button v-for="(item, index) in colorChildrenTem" :label="item.label"
                          :value="item.value" />
                      </el-radio-group>
                    </div>
                  </div>
                </div>
                <div class="input-card">
                  <div class="card flex">
                    <div class="title">绘制名称 (draw_name)</div>
                    <div class="card flex">
                      <div class="title">是否绘制 (is_display)</div>
                      <el-switch @change="inputChange(menuItem.prop)"
                        v-model="item.vector_markers.draw_name.is_display" />
                    </div>
                    <div class="card flex">
                      <div class="title">字体大小 (fontsize)</div>
                      <el-input-number size="small" @input="inputChange()"
                        v-model="item.vector_markers.draw_name.fontsize" placeholder="请输入内容" />
                    </div>
                    <div class="card flex">
                      <div class="title">颜色 (color)</div>
                      <el-color-picker size="small" @change="inputChange"
                        v-model="item.vector_markers.draw_name.color"></el-color-picker>
                    </div>
                    <div class="cart flex">
                      <div class="title">水平对齐 (horizontalalignment)</div>
                      <el-radio-group @change="inputChange(menuItem.prop)"
                        v-model="item.vector_markers.draw_name.horizontalalignment" size="small">
                        <el-radio-button v-for="(item, index) in radioChildrenTem" :label="item.label"
                          :value="item.value" />
                      </el-radio-group>
                    </div>
                    <div class="cart flex">
                      <div class="title">垂直对齐 (verticalalignment)</div>
                      <el-radio-group @change="inputChange(menuItem.prop)"
                        v-model="item.vector_markers.draw_name.verticalalignment" size="small">
                        <el-radio-button v-for="(item, index) in verticalalignmentChildrenTem" :label="item.label"
                          :value="item.value" />
                      </el-radio-group>
                    </div>
                    <div class="card flex">
                      <div class="title">半径距离x轴的外边距 (x_pad)</div>
                      <el-input-number size="small" @input="inputChange()" v-model="item.vector_markers.draw_name.x_pad"
                        placeholder="请输入内容" />
                    </div>

                    <div class="card flex">
                      <div class="title">距离y轴的外边距 (y_pad)</div>
                      <el-input-number size="small" @input="inputChange()" v-model="item.vector_markers.draw_name.y_pad"
                        placeholder="请输入内容" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 是否叠加流域图层 -->
        <div class="card3 " v-if="menuItem.type == 'tree-list4'">
          <div class="flex">
            <div class="m-check" v-for="(item, index) in menuItem.checkeds" :key="index">
              <el-checkbox :disabled="item.isDisabled" @change="checkChange2(menuItem, item)" v-model="item.value"
                :label="item.label" size="small" />
            </div>
          </div>
          <div class="card " v-for="(item, index) in menuItem.value" :key="index">
            <div class="title text-center">
              {{ item.lower_level == 1 ? '1级' : item.lower_level == 2 ? '2级' : item.lower_level == 3
    ? '3级' : item.lower_level == 4 ? '4级' : '5级' }}
            </div>
            <div class="card">
              <div class="title">自定义shp路径，默认空字符为程序自带的shp (shp_file)</div>
              <el-input size="small" @input="inputChange" v-model="item.shp_file" :placeholder="'请输入标题描述'" />
            </div>
            <div class="card flex">
              <div class="title">shp线形宽度 (lw)</div>
              <el-input-number size="small" @input="inputChange('river_system')" v-model="item.lw"
                placeholder="请输入内容" />
            </div>
            <div class="card flex">
              <div class="title">线形 (ec)</div>
              <el-color-picker size="small" @change="inputChange" v-model="item.ec"></el-color-picker>
            </div>
            <div class="card flex">
              <div class="title">图层顺序 (zorder)</div>
              <el-input-number size="small" @input="inputChange('river_system')" v-model="item.zorder"
                placeholder="请输入内容" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="input-card-wrap2">
      <div class="title" v-if="!menuItem.isTop"> {{ menuItem.title }}
        <span v-if="menuItem.prop"> ({{ menuItem.prop }})</span>
        <el-popover class="prpover-btn" v-if="menuItem.popup" placement="top-start" :width="menuItem.popupWidth"
          trigger="click">
          <template #reference>
            <span class="iconfont icon-bangzhu"></span>
          </template>
          <div v-if="menuItem.popup == 'btn'">
            <div class="title">{{ menuItem.popupObj.title }}</div>
            <div class="cont">
              <div class="line" v-for="( item, index ) in  menuItem.popupObj.children " ::key="index">
                <div>{{ index + 1 }}、{{ item.label }} {{ item.label_ }}</div>
                <div class="popup-msg">{{ item.msg }}</div>
                <div>{{ item.value }}</div>
              </div>
            </div>
          </div>
          <div v-else class="cont" :innerText="menuItem.popup"></div>
        </el-popover>
      </div>
      <!-- 自定义内容 -->
      <div class="card " v-if="menuItem.isCuntom">
        <!-- {{ menuItem.popupObj }}
        {{ menuItem.children }}11 -->
        <!-- 单选框 -->
        <div class="card radio" v-if="menuItem.popupObj.type == 'radio'">
          <el-radio-group v-model="menuItem.popupObj.value" size="small">
            <el-radio-button @change=customChange(menuItem) v-for="( item, index ) in  menuItem.popupObj.children "
              :label="item.label" :value="item.value" />
          </el-radio-group>
        </div>
      </div>
      <div class="negligible" v-if="menuItem.isNegligible">
        <el-switch @change="inputChange(menuItem.prop)" v-model="menuItem.ngligibleVal" />
      </div>
      <!-- && !(menuItem.isNegligible && !menuItem.ngligibleVal) -->
      <InputTree
        v-if="(!menuItem.isCuntom || menuItem.popupObj.value) && !(menuItem.isNegligible && !menuItem.ngligibleVal)"
        @inputChange="inputChange" v-for=" child  in  menuItem.children " :key="child.name" :menuItem="child"
        :topItem=menuItem :defaultData=defaultData />

    </div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, computed, nextTick, reactive, ref, watch } from 'vue'
import InputTree from './InputTree.vue'
import MenuTree from './MenuTree.vue';
import { store, pinia } from '@src/store'
import { useRouter, useRoute } from 'vue-router'
import { ThemeOptions } from '@src/types/theme'
import { ElMessage } from 'element-plus'
import { classNameToArray } from 'element-plus/es/utils';
const emits = defineEmits(['inputChange'])
const tempArr = ref(['cia'])

const colorChildrenTem = [
  {
    "value": 1,
    "label": "小1"
  },
  {
    "value": 2,
    "label": "大2"
  }
] as any
const radioChildrenTem = [
  {
    "value": "top",
    "label": "靠上"
  },
  {
    "value": "right",
    "label": "靠右"
  },
  {
    "value": "bottom",
    "label": "靠下"
  },
  {
    "value": "left",
    "label": "靠左"
  }
] as any
//垂直对齐
const verticalalignmentChildrenTem = [
  {
    "value": "left",
    "label": "靠左"
  },
  {
    "value": "center",
    "label": "居中"
  },
  {
    "value": "right",
    "label": "靠右"
  },
  {
    "value": "bottom",
    "label": "靠下"
  }
] as any


const iconImgTem = {
  "img_path": "{root_dir}/data/icon/img_1.jpg",
  "rect_size": [
    0.0,
    0.045,
    0.035,
    0.035
  ],
  "x_alalignment": "left",
  "y_alalignment": "top"
} as any

const otherDescTem = {
  "x": 0.04,
  "y": 0.05,
  "x_alalignment": "left",
  "y_alalignment": "top",
  "s": "",
  "pop": {
    "fontsize": 25,
    "horizontalalignment": "left",
    "verticalalignment": "bottom"
  }
} as any
const props = defineProps({
  menuItem: {
    type: Object,
    default: () => {
      return {}
    }
  },
  topItem: {
    type: Object,
    default: () => {
      return {}
    }
  },
  defaultData: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const theme = computed<ThemeOptions>(() => {
  const themeStore = store.system.useThemeStore()
  return themeStore.themeConfig[themeStore.activeName]
})

const changeVectorMarkers = (item: any) => {
  if (item.is_display) {
    item.vector_markers = {
      "attr_info": "FNAME",
      "out_attr_path": "D:/neo_share/fxds/data/绍兴市.csv",
      "zorder": 8,
      "draw_mark": {
        "is_display": true,
        "color": "#FF0000",
        "radius": 0.01,
        "style": 1
      },
      "draw_name": {
        "is_display": true,
        "fontsize": 15,
        "color": "#FF0000",
        "horizontalalignment": "left",
        "verticalalignment": "center",
        "x_pad": 0.01,
        "y_pad": 0.00
      }
    }
  } else {
    item.vector_markers = {}
  }
  inputChange('subordinate_regions')
}

const customChange = (menuItem: any) => {
  if (menuItem.popupObj.type == 'radio') {
    let arr = []
    if (menuItem.popupObj.value) {
      arr = menuItem.popupObj.value.split(',').map((ele) => +ele)
    }
    menuItem.popupObj.valueArr = arr
    if (menuItem.prop == 'data_sources') {
      menuItem.value = menuItem.popupObj.value
    }
  }
  inputChange(menuItem.prop)
}
const inputChange = (targetProperty = '') => {
  let contour_f_obj = props.defaultData.filter(ele => ele.prop == "contour_f")[0]
  let color_code_obj = contour_f_obj.children.filter(ele => ele.prop == "color_code")[0]
  let leg_para_obj = contour_f_obj.children.filter(ele => ele.prop == "leg_para")[0]
  let level_str_obj = leg_para_obj.children.filter(ele => ele.prop == "level_str")[0]
  let grade_para_obj = props.defaultData.filter(ele => ele.prop == "grade_para")[0]
  let n_classes_obj = grade_para_obj.children.filter(ele => ele.prop == "n_classes")[0]

  //length控制标签最后一个的最大值
  if (props.topItem.prop == 'scale') {
    let len = props.topItem.children.filter(ele => ele.prop == "length")
    let xticks = props.topItem.children.filter(ele => ele.prop == "xticks")
    xticks[0].max = len[0].value
  }
  //如果使用 grade_para 分级方法，该参数失效，
  //如没有使用grade_para分级方法，该参数必填
  //ncolor_code：区间对应的色标\nvel_str：主要用于色块对应的描述；色条可忽略此参数，默认使用levels来描述
  if (targetProperty == 'grade_para') { }
  //区间个数改变同步 区间对应的色标,色块对应的描述
  if (targetProperty == 'n_classes') {
    if (color_code_obj.value.length > n_classes_obj.value) {
      store.system.useUserStore(pinia).deleteLevelsTemp()
      color_code_obj.value.splice(-1, 1)
    }
    if (color_code_obj.value.length < n_classes_obj.value) {
      store.system.useUserStore(pinia).addLevelsTemp()
      color_code_obj.value.push(color_code_obj.value[color_code_obj.value.length - 1])
    }
    if (level_str_obj.value.length && level_str_obj.value.length > n_classes_obj.value) {
      for (let i = 0; i < level_str_obj.value.length - n_classes_obj.value; i++) {
        level_str_obj.value.splice(-1, 1)
      }
    }
    if (level_str_obj.value.length && level_str_obj.value.length < n_classes_obj.value) {
      for (let i = 0; i < n_classes_obj.value - level_str_obj.value.length; i++) {
        level_str_obj.value.push(level_str_obj.value[level_str_obj.value.length - 1])
      }
    }
  }
  nextTick(() => {
    if (!props.menuItem.prop) {
      targetProperty = props.topItem.prop
    }
    if (targetProperty == 'type') {
      targetProperty = 'leg_para'
      if (props.topItem.title == "是否填值") {
        targetProperty = 'fill_val'
      }
    }
    if (['rect_size', 'alpha', 'linewidth', 'vector_markers', 'lw', 'zorder', 'style', 'horizontalalignment', 'verticalalignment', 'fontsize', 'is_display', 'x', 'y', 'x_alalignment', 'y_alalignment', 'width', 'length', 'pad', 'top', 'right', 'labeltop', 'labelright', 'verticalalignment'].includes(targetProperty)) targetProperty = props.topItem.prop

    //颜色扩展方向，更改区间、色标、描述规则
    if (props.menuItem.prop == "extend") {
      let value = props.menuItem.value
      store.system.useUserStore(pinia).changeClassName(value)

      let grade_para_obj = props.defaultData.filter(ele => ele.prop == "grade_para")[0]
      //不使用分级方法才改变数量
      if (!grade_para_obj.ngligibleVal) {
        let contour_f_obj = props.defaultData.filter(ele => ele.prop == "contour_f")[0]
        let levels_obj = contour_f_obj.children.filter(ele => ele.prop == "levels")[0]
        let leg_para_obj = contour_f_obj.children.filter(ele => ele.prop == "leg_para")[0]
        let level_str_obj = leg_para_obj.children.filter(ele => ele.prop == "level_str")[0]

        let length = levels_obj.value.length
        let strArr = level_str_obj.value
        for (let prop in props.defaultData) {
          if (props.defaultData[prop].prop == "contour_f") {
            props.defaultData[prop].children.forEach((ele, index) => {
              if (ele.prop == "color_code") {
                switch (value) {
                  case "neither":
                    if (length - ele.value.lengt != 1) {
                      for (let i = 0; i <= ele.value.length - length + 1; i++) {
                        ele.value.splice(ele.value.length - 1, 1)
                        strArr.splice(strArr.length - 1, 1)
                      }
                    }
                    break;
                  case "both":
                    if (length - ele.value.length != -1) {
                      for (let i = 0; i <= length - ele.value.length + 1; i++) {
                        ele.value.push(ele.value[ele.value.length - 1])
                        strArr.length && strArr.push(strArr[strArr.length - 1])
                      }
                    }
                    break
                  case "min":
                  case "max":
                    if (length != ele.value.length) {
                      if (length > ele.value.length) {
                        for (let i = 0; i <= length - ele.value.length; i++) {
                          ele.value.push(ele.value[ele.value.length - 1])
                          strArr.push(strArr[strArr.length - 1])
                        }
                      } else {
                        for (let i = 0; i <= ele.value.length - length; i++) {
                          ele.value.splice(ele.value.length - 1, 1)
                          strArr.splice(strArr.length - 1, 1)
                        }
                      }
                    }
                }
              }
            })
          }
        }
      }
    }
    emits('inputChange', targetProperty)
  })
}

const checkChange = (menuItem, item) => {
  if (item.value) { //添加
    let tempObj = {
      "lower_level": 3,
      "shp_file": "",
      "lw": 1.2,
      "ec": "#A57346",
      "zorder": 6 - item.lower_level,
      "vector_markers": {
        "attr_info": "FNAME",
        "out_attr_path": "D:/neo_share/fxds/data/绍兴市.csv",
        "zorder": 8,
        "draw_mark": {
          "is_display": true,
          "color": "#FF0000",
          "radius": 0.01,
          "style": 1
        },
        "draw_name": {
          "is_display": true,
          "fontsize": 15,
          "color": "#FF0000",
          "horizontalalignment": "left",
          "verticalalignment": "center",
          "x_pad": 0.01,
          "y_pad": 0.00
        }
      },
      "is_display": true
    }
    // if (menuItem.value.length) {
    //   tempObj = JSON.parse(JSON.stringify(menuItem.value[0]))
    // }
    tempObj.lower_level = item.lower_level
    //根据lower_level大小，在menuItem.value相应位置插入
    let index = 0
    for (let i = 0; i < menuItem.value.length; i++) {
      if (item.lower_level > menuItem.value[i].lower_level) {
        index = i + 1
      }
    }
    menuItem.value.splice(index, 0, tempObj)
  } else { //删除
    menuItem.value.forEach((ele, index) => {
      if (ele.lower_level == item.lower_level) menuItem.value.splice(index, 1)
    })
  }
  inputChange('subordinate_regions')
}
const checkChange2 = (menuItem, item) => {
  if (item.value) { //添加
    let tempObj = {
      "lower_level": item.lower_level,
      "shp_file": "",
      "lw": 0.8,
      "ec": "#A0D7F9",
      "zorder": 7
    }
    tempObj.lower_level = item.lower_level
    //根据lower_level大小，在menuItem.value相应位置插入
    let index = 0
    for (let i = 0; i < menuItem.value.length; i++) {
      if (item.lower_level > menuItem.value[i].lower_level) {
        index = i + 1
      }
    }
    menuItem.value.splice(index, 0, tempObj)
  } else { //删除
    menuItem.value.forEach((ele, index) => {
      if (ele.lower_level == item.lower_level) menuItem.value.splice(index, 1)
    })
  }
  inputChange('river_system')
}

const addLevels = (arr: any, index: number, num = 0) => {
  let num_ = num ? num : arr[index]
  arr.splice(index + 1, 0, JSON.parse(JSON.stringify(num_)))
  if ('children' in props.topItem && props.topItem?.children.length) {
    props.topItem?.children.forEach(ele => {
      if (ele.prop == "color_code") {
        let arr = ele.value
        let index_ = index - 1 >= 0 ? index - 1 : 0
        arr.splice(index, 0, arr[index_])
      }
      if (ele.prop == "leg_para") {
        ele.children.forEach(ele => {
          if (ele.prop == "level_str") {
            let arr = ele.value
            let index_ = index - 1 >= 0 ? index - 1 : 0
            arr.splice(index, 0, arr[index_])
          }
        })
      }
    })
  }
  inputChange()
}
const delLevels = (arr: any, index: number) => {
  if (props.menuItem.minLen && arr.length <= props.menuItem.minLen) {
    ElMessage({
      showClose: true,
      message: `至少保留两个${props.menuItem.title}`,
      type: 'warning',
    })
    return
  }
  arr.splice(index, 1)
  if ('children' in props.topItem && props.topItem?.children.length) {
    props.topItem?.children.forEach(ele => {
      if (ele.prop == "color_code") {
        let arr = ele.value
        arr.splice(index, 1)
      }
      if (ele.prop == "leg_para") {
        ele.children.forEach(ele => {
          if (ele.prop == "level_str") {
            let arr = ele.value
            arr.splice(index, 1)
          }
        })
      }
    })
  }
  inputChange()
}
</script>
<style lang='scss' scoped>
@import '@assets/style/mixin.scss';

.input-card {
  padding: 0 .5rem;

  .input-card-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      // max-width: 10rem;
    }

    .cont,
    .card {
      display: flex;
      align-items: center;
    }

  }

  .imput-card-tree-list {
    display: block;

    .title {
      max-width: 100%;
    }

    .cont,
    .card {
      display: block;
    }
  }
}

//文组描述样式
.other_desc {
  .input-card-wrap {
    display: block;

    .cont {
      display: block;

      .card {
        display: block;
      }

    }
  }
}

//图标样式
.icon_img {
  .input-card-wrap {
    display: block;

    .cont {
      display: block;

      .card {
        display: block;
      }

    }
  }
}


// 数据填充样式
.contour_f {
  position: relative;
}


.levels.both .input-card-wrap .cont {
  padding: 10px 0;
}

.color_code.neither .input-card-wrap .cont,
.level_str.neither .input-card-wrap .cont {
  padding: 10px 0;
}



.leg_para .level_str,
.color_code {
  .title {
    display: none;
  }
}

.levels {
  .wrap {
    width: 180px;
  }
}

.level_str {
  position: absolute;
  top: 119px;
  left: 11rem;
  left: 220px;

  .title {
    height: 24px;
    @include ellipsis();
  }

  .cont {
    .card {
      flex-wrap: wrap;
      justify-content: end;
      white-space: wrap;

      .wrap {
        width: 5rem;
      }
    }
  }
}

.levels {
  position: absolute;
  top: 93px;
  left: 0;
}

.color_code {
  position: relative;
  top: 37px;
  left: 180px;
  z-index: 1;
  width: 3rem;


  .input-card-wrap {
    display: block;

    .title {
      height: 24px;
      @include ellipsis();
    }

    .cont {
      .card {
        display: block;

        :deep(.el-color-picker) {
          display: block;
        }
      }

    }
  }
}

.leg_para {
  margin-top: 3rem;
}

.flex {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.text-center {
  color: var(--el-menu-active-color);
  text-align: center;
}




.iconfont {
  color: var(--el-menu-active-color);
  cursor: pointer;
}

.delete-btn {
  color: red;
}

.add-btn {
  color: var(--el-color-primary);
}
</style>
