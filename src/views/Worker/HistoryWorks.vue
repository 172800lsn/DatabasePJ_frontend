<template>
  <div class="worker-board">
    <h1>维修历史</h1>

    <!-- 维修任务列表 -->
    <div class="task-section">
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <p>任务描述：{{ task.description }}</p>
          <p>车辆信息：{{ task.vehicleInfo }}</p>
          <p class="feedback">
          <strong>用户反馈：</strong>
          <span v-if="task.feedback">{{ task.feedback }}</span>
          <span v-else>暂无反馈</span>
        </p>
          <p class="score">
            <strong>服务评分：</strong>
            <span v-if="task.score !== null">{{ task.score }}/5</span>
            <span v-else>未评分</span>
          </p>
          <p class="salary">
            <strong>工时收入：</strong>¥{{ task.salary }}
          </p>
        </li>

      </ul>
      <div class="total-salary">
        <h3>累计收入总额：¥{{ totalSalary }}</h3>
      </div>
    </div>
    <!-- 退出按钮 -->
    <div class="logout-section">
      <button class="logout-button" @click="logout">退出</button>
    </div>
  </div>
</template>

<script>
import API from "../../api/config";
export default {
  data() {
    return {
      tasks: []
    };
  },mounted() {
    this.fetchWorkerTasks();
  },computed: {
    totalSalary() {
      return this.tasks.reduce((sum, task) => sum + (task.salary || 0), 0)
    }
  },
  methods: {
    async fetchWorkerTasks() {
      try {
        const response = await API.post("/repair-orders/worker/history-tasks",{username:JSON.parse(localStorage.getItem("user"))?.username});
        this.tasks = response.data.tasks;
      } catch (error) {
        console.error("获取任务失败:", error);
        alert("无法加载任务数据");
      }

    }
    ,

    // 退出
    logout() {
      // 跳转到登录页面
      this.$router.push("/workerboard");
    },
  },
};
</script>

<style scoped>
/* 主体布局 */
.worker-board {
  width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.salary {
  color: #27ae60;
  font-weight: bold;
}

.total-salary {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: right;
  font-size: 18px;
}
/* 标题样式 */
h1 {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}
h2 {
  font-size: 20px;
  color: #444;
  margin-bottom: 15px;
}

/* 列表样式 */
ul {
  list-style: none;
  padding: 0;
}

/* 任务项样式 */
li {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

/* 按钮样式 */
button {
  padding: 5px 10px;
  background-color: #5cb85c;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #4cae4c;
}

/* 退出按钮样式 */
.logout-section {
  margin-top: 20px;
  text-align: center;
}
.logout-button {
  padding: 10px 20px;
  background-color: #d9534f;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.logout-button:hover {
  background-color: #c9302c;
}
</style>