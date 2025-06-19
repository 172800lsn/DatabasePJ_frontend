<template>
  <div class="worker-board">
    <h1>维修当中</h1>

    <!-- 维修任务列表 -->
    <div class="task-section">
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <p>任务描述：{{ task.description }}</p>
          <p>车辆信息：{{ task.vehicleInfo }}</p>
          <p class="urgency-tag" :class="{ 'urgent': task.isUrgent }">
            {{ task.isUrgent ? '🔥 紧急订单' : '🟢 普通订单' }}
          </p>
          <button @click.stop="navigateToDetail(task.id)">查看详情</button>
        </li>
      </ul>
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
  },
  methods: {
    async fetchWorkerTasks() {
      try {
        const response = await API.post("/repair-orders/worker/tasks",{username:JSON.parse(localStorage.getItem("user"))?.username});
        this.tasks = response.data.tasks;
      } catch (error) {
        console.error("获取任务失败:", error);
        alert("无法加载任务数据");
      }

    },
    navigateToDetail(taskId) {
      this.$router.push({
        name: 'TaskDetail',
        params: { id: taskId }
      });
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