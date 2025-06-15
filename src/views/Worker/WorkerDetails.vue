<template>
  <div>
    <h2>账户详细信息</h2>

    <!-- 账户信息展示 -->
    <section v-if="userData">
      <h3>账户信息</h3>
      <p><strong>用户名：</strong>{{ userData.username }}</p>
      <p><strong>邮箱：</strong>{{ userData.email }}</p>
      <p><strong>账户类型：</strong>{{ userData.role }}</p>
      <p><strong>姓名：</strong>{{ userData.name }}</p>
      <p><strong>工种：</strong>{{ userData.jobType || '未设置' }}</p>
      <p><strong>时薪：</strong>{{ userData.hourlyRate ? `¥${userData.hourlyRate}/小时` : '未设置' }}</p>
    </section>

  </div>
</template>

<script>
import API from "../../api/config";

export default {

  data() {
    return {
      userData: null,
      username: JSON.parse(localStorage.getItem("user"))?.username || "USER" // 从 localStorage 获取用户信息
    };
  },
  async mounted() {
    await this.getUserDetails();
  },
  methods: {
    // 获取账户信息
    async getUserDetails() {
      try {
        console.log("username:", this.username);
        const response = await API.post("/test/user/details" ,
            {
              username: this.username,
            });
        console.log("response", response);
        this.userData = response.data;
      } catch (error) {
        console.error("获取用户信息失败：", error);
        alert("无法加载账户信息，请稍后再试！");
      }
    }

  }
};
</script>