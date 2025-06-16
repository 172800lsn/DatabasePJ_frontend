<template>
  <div class="task-detail">
    <!-- 头部样式优化 -->
    <div class="detail-header">
      <h2>任务详情 #{{ taskId }}</h2>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="taskData" class="detail-content">
      <!-- 详情卡片式布局 -->
      <div class="info-card">
        <p><strong>任务描述：</strong>{{ taskData.description }}</p>
        <p><strong>车辆信息：</strong>{{ taskData.vehicleInfo }}</p>
      </div>

      <!-- 表格样式优化 -->
      <h3 class="section-title">维修材料</h3>
      <table class="materials-table">
        <thead>
        <tr>
          <th v-for="(col, idx) in ['材料名称', '单价', '数量', '小计', '操作']"
              :key="idx">{{ col }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(material, index) in taskData.materials" :key="index">
          <td><input v-model="material.name" placeholder="输入名称"></td>
          <td><input type="number" v-model.number="material.price" placeholder="输入单价"></td>
          <td><input type="number" v-model.number="material.quantity" placeholder="输入数量"></td>
          <td>{{ (material.price * material.quantity).toFixed(2) }}</td>
          <td>
            <button @click="removeMaterial(index)" class="btn-danger">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="action-buttons">
        <button @click="addMaterial" class="btn btn-add">
          <i class="icon-plus"></i> 添加材料
        </button>
        <div class="form-actions">
          <button @click="submitMaterials" class="btn btn-primary">提交修改</button>
          <button @click="completeTask" class="btn btn-success">完成任务</button>
        </div>
      </div>
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
    }, addMaterial() {
      this.taskData.materials.push({
        name: '',
        price: 0,
        quantity: 1,
        total: 0
      });
    },
    removeMaterial(index) {
      this.taskData.materials.splice(index, 1);
    },
    async submitMaterials() {
      try {
        const payload = {
          taskId: this.taskId,
          materials: this.taskData.materials
        };
        console.log("提交材料数据:", payload);
        await API.put(`/repair-orders/${this.taskId}/materials`, payload);
        alert('材料清单更新成功！');
      } catch (error) {
        console.error("提交材料失败:", error);
        alert('提交失败，请检查数据格式');
      }
    },
    async completeTask() {
      if (confirm('确认要标记该任务为已完成吗？')) {
        try {
          await API.put(`/repair-orders/${this.taskId}/complete`);
          alert('任务状态已更新！');
          this.$router.push('/workerboard/board'); // 跳转到工人面板
        } catch (error) {
          console.error("完成任务失败:", error);
          alert('操作失败，请稍后重试');
        }
      }
    },
  }
};
</script>
<style scoped>
/* 新增样式 */
.task-detail {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.info-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 2rem;
}

.materials-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.materials-table th,
.materials-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.materials-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.materials-table input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #007bff;
  color: white;
  &:hover { background: #0056b3; }
}

.btn-success {
  background: #28a745;
  color: white;
  &:hover { background: #1e7e34; }
}

.btn-add {
  background: #17a2b8;
  color: white;
  &:hover { background: #117a8b; }
}

.btn-danger {
  background: #dc3545;
  color: white;
  &:hover { background: #bb2d3b; }
}

.status-pending { color: #ffc107; }
.status-completed { color: #28a745; }

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}
</style>