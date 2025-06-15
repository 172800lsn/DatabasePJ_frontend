<template>
  <div class="adminboard">
    <h1>管理员系统</h1>

    <!-- 用户/维修工管理 -->
    <div class="user-management">
      <h2>用户与维修工管理</h2>
      <button @click="fetchUsers">刷新用户列表</button>
      <ul>
        <li v-for="user in users" :key="user.id">
          用户名: {{ user.username }} | 姓名: {{ user.name }} | 角色: {{ user.role }}
          <button @click="deleteUser(user.id)">删除</button>
        </li>
      </ul>
      <!-- 分页控制 -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="goToPage('prev')" :disabled="currentPage === 0">上一页</button>
        <span>当前页: {{ currentPage + 1 }} / {{ totalPages }}</span>
        <button @click="goToPage('next')" :disabled="currentPage === totalPages - 1">下一页</button>
      </div>
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

    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <button class="logout-button" @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
import API from "../../api/config";

export default {
  data() {
    return {
      users: [], // 用户列表
      currentPage: 0, // 当前页
      pageSize: 5, // 每页显示的用户数
      totalPages: 1, // 总页数
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
    // 获取用户列表
    async fetchUsers() {
      try {
        const params = { page: this.currentPage, size: this.pageSize };
        const response = await API.post("/test/user/get-all", params);
        this.users = response.data.users;
        this.totalPages = response.data.pages;
      } catch (error) {
        alert("获取用户列表时出错: " + error.response?.data || error.message);
      }
    },

    // 删除用户
    async deleteUser(userId) {
      if (confirm("确认要删除该用户吗？")) {
        try {
          await API.delete(`/test/user/delete/${userId}`);
          alert("用户删除成功！");
          this.fetchUsers(); // 重新拉取用户列表
        } catch (error) {
          alert("删除用户时出错: " + error.response?.data || error.message);
        }
      }
    },
    // 分页导航
    goToPage(direction) {
      if (direction === "prev" && this.currentPage > 0) {
        this.currentPage--;
      } else if (direction === "next" && this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
      this.fetchUsers();
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
      // 退出登录
      logout() {
        // 清除用户信息
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");

        // 跳转到登录页面
        this.$router.push("/login");
        alert("已成功退出！");
      },
  },

  mounted() {
    this.fetchUsers();
  }
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