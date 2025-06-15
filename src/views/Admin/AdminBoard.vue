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
          <button @click="editUser(user)">编辑</button>
          <button @click="deleteUser(user.id)">删除</button>
        </li>
      </ul>
      <!-- 编辑用户模态框 -->
      <div v-if="editingUser" class="edit-user-modal">
        <h3>编辑用户</h3>
        <label>
          用户名:
          <input v-model="editingUser.username" />
        </label>
        <label>
          姓名:
          <input v-model="editingUser.name" />
        </label>
        <label>
          电子邮箱:
          <input v-model="editingUser.email" />
        </label>
        <label>
          角色:
          <select v-model="editingUser.role">
            <option value="USER">普通用户</option>
            <option value="WORKER">维修工</option>
            <option value="ADMIN">管理员</option>
          </select>
        </label>
        <button @click="updateUser">保存</button>
        <button @click="cancelEdit">取消</button>
      </div>
      <!-- 分页控制 -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="goToPage('prev')" :disabled="currentPage === 0">上一页</button>
        <span>当前页: {{ currentPage + 1 }} / {{ totalPages }}</span>
        <button @click="goToPage('next')" :disabled="currentPage === totalPages - 1">下一页</button>
      </div>
    </div>


    <!-- 车辆管理 -->
    <div class="vehicle-management">
      <h2>车辆管理</h2>
      <button @click="fetchVehicles">刷新车辆列表</button>
      <ul>
        <li v-for="vehicle in vehicles" :key="vehicle.id">
          车牌号: {{ vehicle.licensePlate }} | 品牌: {{ vehicle.brand }} | 型号: {{ vehicle.model }} | 颜色: {{ vehicle.color }}
          <button @click="deleteVehicle(vehicle.id)">删除</button>
        </li>
      </ul>
      <!-- 分页控制 -->
      <div v-if="totalVehiclePages > 1" class="pagination">
        <button @click="goToVehiclePage('prev')" :disabled="currentVehiclePage === 0">上一页</button>
        <span>当前页: {{ currentVehiclePage + 1 }} / {{ totalVehiclePages }}</span>
        <button @click="goToVehiclePage('next')" :disabled="currentVehiclePage === totalVehiclePages - 1">下一页</button>
      </div>
      <!-- 添加车辆 -->
      <div class="add-vehicle">
        <h3>新增车辆</h3>
        <form @submit.prevent="addVehicle">
          <label>
            所属用户ID:
            <input v-model="newVehicle.ownerId" type="number" required />
          </label>
          <label>
            车牌号:
            <input v-model="newVehicle.licensePlate" required />
          </label>
          <label>
            品牌:
            <input v-model="newVehicle.brand" required />
          </label>
          <label>
            型号:
            <input v-model="newVehicle.model" required />
          </label>
          <label>
            年份:
            <input v-model="newVehicle.year" type="number" required />
          </label>
          <label>
            颜色:
            <input v-model="newVehicle.color" />
          </label>
          <button type="submit">添加车辆</button>
        </form>
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
      editingUser: null, // 正在编辑的用户
      vehicles: [], // 车辆列表
      currentVehiclePage: 0, // 当前车辆页
      vehiclePageSize: 5, // 每页显示的车辆数
      totalVehiclePages: 1, // 总车辆页数
      newVehicle: {
        ownerId: "",
        licensePlate: "",
        brand: "",
        model: "",
        year: "",
        color: "",
      }, // 新车辆信息
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
    // 编辑用户
    editUser(user) {
      this.editingUser = { ...user }; // 复制用户信息，防止直接修改
    },
    // 保存用户更新
    async updateUser() {
      try {
        const { id } = this.editingUser;
        await API.patch(`/test/user/update/${id}`, this.editingUser);
        alert("用户信息已更新！");
        this.editingUser = null;
        this.fetchUsers(); // 刷新用户列表
      } catch (error) {
        alert("更新用户时出错: " + error.response?.data || error.message);
      }
    },
    // 取消编辑
    cancelEdit() {
      this.editingUser = null;
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

    // 获取车辆列表
    async fetchVehicles() {
      try {
        const params = { page: this.currentVehiclePage, size: this.vehiclePageSize };
        const response = await API.post("/admin/vehicles", params);
        this.vehicles = response.data.vehicles;
        this.totalVehiclePages = response.data.totalPages;
      } catch (error) {
        alert("获取车辆列表时出错: " + error.response?.data || error.message);
      }
    },
    // 删除车辆
    async deleteVehicle(vehicleId) {
      if (confirm("确认要删除该车辆吗？")) {
        try {
          await API.delete(`/admin/vehicles/${vehicleId}`);
          alert("车辆删除成功！");
          this.fetchVehicles(); // 重新获取车辆列表
        } catch (error) {
          alert("删除车辆时出错: " + error.response?.data || error.message);
        }
      }
    },
    // 添加车辆
    async addVehicle() {
      try {
        await API.post("/admin/vehicles/add", this.newVehicle);
        alert("车辆添加成功！");
        this.newVehicle = { ownerId: "", brand: "", model: "", year: "", color: "" };
        this.fetchVehicles();
      } catch (error) {
        alert("添加车辆时出错: " + error.response?.data || error.message);
      }
    },
    // 分页导航
    goToVehiclePage(direction) {
      if (direction === "prev" && this.currentVehiclePage > 0) {
        this.currentVehiclePage--;
      } else if (direction === "next" && this.currentVehiclePage < this.totalVehiclePages - 1) {
        this.currentVehiclePage++;
      }
      this.fetchVehicles();
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
    this.fetchVehicles(); // 初始化加载车辆列表
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