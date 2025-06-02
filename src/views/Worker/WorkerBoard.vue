<template>
  <div class="worker-board">
    <h1>维修工系统</h1>

    <!-- 维修任务列表 -->
    <div class="task-section">
      <h2>待完成任务</h2>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <p>任务描述：{{ task.description }}</p>
          <p>车辆信息：{{ task.vehicleInfo }}</p>
          <p>截止日期：{{ task.deadline }}</p>
          <button @click="markAsCompleted(task.id)">标记为已完成</button>
        </li>
      </ul>
    </div>

    <!-- 历史任务 -->
    <div class="history-section">
      <h2>维修记录</h2>
      <ul>
        <li v-for="record in history" :key="record.id">
          <p>任务描述：{{ record.description }}</p>
          <p>车辆信息：{{ record.vehicleInfo }}</p>
          <p>完成时间：{{ record.completedAt }}</p>
        </li>
      </ul>
    </div>

    <!-- 退出按钮 -->
    <div class="logout-section">
      <button class="logout-button" @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        { id: 1, description: "更换轮胎", vehicleInfo: "丰田卡罗拉", deadline: "2023-12-01" },
        { id: 2, description: "修复发动机", vehicleInfo: "大众帕萨特", deadline: "2023-12-05" },
      ],
      history: [
        { id: 1, description: "清洗冷却系统", vehicleInfo: "日产天籁", completedAt: "2023-11-10" },
      ],
    };
  },
  methods: {
    // 标记任务为已完成
    markAsCompleted(taskId) {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        const completedTask = this.tasks.splice(taskIndex, 1)[0];
        this.history.push({
          ...completedTask,
          completedAt: new Date().toLocaleDateString(),
        });
        alert("任务已标记完成！");
      }
    },

    // 退出登录
    logout() {
      // 清除登录信息
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");

      // 跳转到登录页面
      this.$router.push("/login");
      alert("已成功退出！");
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