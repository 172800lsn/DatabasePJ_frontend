<template>
  <div>
    <h1>欢迎，{{ username }}</h1>
    <nav>
      <router-link to="/dashboard/report">车辆报修</router-link> |
      <router-link to="/dashboard/records">维修记录</router-link> |
      <router-link to="/dashboard/details">账户与车辆信息</router-link> |
      <router-link to="/dashboard/feedback">维修反馈</router-link>
    </nav>
    <router-view></router-view> <!-- 子路由显示对应子页面 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem("username") || "用户", // 获取登录用户信息
    };
  },
};
</script>

<style scoped>
nav {
  margin: 20px 0;
}
nav a {
  margin: 0 15px;
  color: blue;
  text-decoration: none;
}
nav a:hover {
  text-decoration: underline;
  color: darkblue;
}
</style>