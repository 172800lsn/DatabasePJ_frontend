<template>
  <div class="task-detail">
    <h2>任务详情 #{{ taskId }}</h2>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="taskData" class="detail-content">
      <p><strong>任务描述：</strong>{{ taskData.description }}</p>
      <p><strong>车辆信息：</strong>{{ taskData.vehicleInfo }}</p>
      <p><strong>当前状态：</strong>{{ taskData.status }}</p>
      <p><strong>提交时间：</strong>{{ taskData.createdAt }}</p>
    </div>

    <div v-else class="error">无法加载任务信息</div>
  </div>
</template>

<script>
import API from "../../api/config";

export default {
  props: ['id'], // 接收路由参数
  data() {
    return {
      taskId: this.id,
      taskData: null,
      loading: true
    };
  },
  watch: {
    // 监听路由参数变化
    id(newVal) {
      this.taskId = newVal;
      this.loadTaskData();
    }
  },
  mounted() {
    this.loadTaskData();
  },
  methods: {
    async loadTaskData() {
      try {
        this.loading = true;
        const response = await API.get(`/repair-orders/${this.taskId}`);
        this.taskData = response.data;
      } catch (error) {
        console.error("获取任务详情失败:", error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>