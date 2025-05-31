<template>
  <div class="admin-board">
    <h1>管理员系统</h1>

    <!-- 用户/维修工管理 -->
    <div class="user-management">
      <h2>用户与维修工管理</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }} - {{ user.role }}
          <button @click="editUser(user.id)">编辑</button>
          <button @click="deleteUser(user.id)">删除</button>
        </li>
      </ul>
    </div>

    <!-- 任务分配 -->
    <div class="task-allocation">
      <h2>任务分配</h2>
      <div>
        <label>选择维修工：</label>
        <select v-model="selectedWorker">
          <option v-for="worker in workers" :key="worker.id" :value="worker.id">
            {{ worker.name }}
          </option>
        </select>
      </div>
      <div>
        <label>任务描述：</label>
        <input v-model="newTaskDescription" type="text" />
      </div>
      <button @click="assignTask">分配任务</button>
    </div>

    <!-- 系统统计数据 -->
    <div class="system-stats">
      <h2>系统统计</h2>
      <p>总用户数：{{ users.length }}</p>
      <p>总任务数：{{ tasks.length }}</p>
      <p>已完成任务数：{{ completedTasks }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        { id: 1, name: "用户1", role: "USER" },
        { id: 2, name: "维修工1", role: "WORKER" },
      ],
      workers: [
        { id: 1, name: "维修工1" },
        { id: 2, name: "维修工2" },
      ],
      tasks: [],
      completedTasks: 5,
      selectedWorker: null,
      newTaskDescription: "",
    };
  },
  methods: {
    editUser(userId) {
      alert("编辑用户：" + userId);
    },
    deleteUser(userId) {
      this.users = this.users.filter((user) => user.id !== userId);
      alert("用户已删除");
    },
    assignTask() {
      if (this.selectedWorker && this.newTaskDescription) {
        this.tasks.push({
          workerId: this.selectedWorker,
          description: this.newTaskDescription,
        });
        alert("任务已分配");
      } else {
        alert("请填写完整任务信息");
      }
    },
  },
};
</script>

<style scoped>
.admin-board {
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
h1, h2 {
  text-align: center;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  margin-left: 10px;
  padding: 5px 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>