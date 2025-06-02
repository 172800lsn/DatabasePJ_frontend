<template>
  <div class="dashboard">
    <h1>欢迎，{{ username }}</h1>

    <!-- 导航按钮 -->
    <nav class="nav-bar">
      <router-link to="/dashboard/report">
        <button>车辆报修</button>
      </router-link>
      <router-link to="/dashboard/records">
        <button>维修记录</button>
      </router-link>
      <router-link to="/dashboard/details">
        <button>账户与车辆信息</button>
      </router-link>
      <router-link to="/dashboard/feedback">
        <button>维修反馈</button>
      </router-link>
    </nav>

    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <button class="logout-button" @click="logout">退出登录</button>
    </div>

    <!-- 子路由数据显示区域 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: JSON.parse(localStorage.getItem("user"))?.username || "USER", // 从 localStorage 获取用户信息
    };
  },
  methods: {
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
};
</script>

<style scoped>
/* 整体居中布局 */
.dashboard {
  width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 标题样式，居中对齐 */
h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

/* 导航栏样式 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

/* 导航按钮样式 */
.nav-bar button {
  padding: 10px 15px;
  background-color: #5cb85c;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.nav-bar button:hover {
  background-color: #4cae4c;
}

/* 退出按钮区域 */
.logout-section {
  margin-top: 20px;
}

/* 退出按钮样式 */
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