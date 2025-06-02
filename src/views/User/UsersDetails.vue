<template>
  <div>
    <h2>账户与车辆信息</h2>

    <!-- 账户信息展示 -->
    <section v-if="userData">
      <h3>账户信息</h3>
      <p><strong>用户名：</strong>{{ userData.username }}</p>
      <p><strong>邮箱：</strong>{{ userData.email }}</p>
      <p><strong>账户类型：</strong>{{ userData.role }}</p>
      <p><strong>姓名：</strong>{{ userData.name }}</p>
    </section>

    <!-- 车辆信息展示 -->
    <section v-if="vehicles.length > 0">
      <h3>车辆信息</h3>
      <ul>
        <li v-for="vehicle in vehicles" :key="vehicle.id">
          <p><strong>车牌号：</strong>{{ vehicle.licensePlate }}</p>
          <p><strong>品牌：</strong>{{ vehicle.brand }}</p>
          <p><strong>型号：</strong>{{ vehicle.model }}</p>
          <p><strong>颜色：</strong>{{ vehicle.color }}</p>
          <p><strong>年份：</strong>{{ vehicle.year }}</p>
        </li>
      </ul>
    </section>

    <!-- 无车辆信息时展示 -->
    <div v-else>
      <p>暂无车辆信息。</p>
    </div>
  </div>
</template>

<script>
import userDashboard from "./UserDashboard.vue";
import API from "../../api/config";

export default {
  computed: {
    userDashboard() {
      return userDashboard
    }
  },
  data() {
    return {
      username: JSON.parse(localStorage.getItem("user"))?.username || "USER", // 从 localStorage 获取用户信息
      vehicles: [] // 保存用户的车辆信息
    };
  },
  async mounted() {
    await this.getUserDetails();
    await this.getUserVehicles();
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
    },
    // 获取车辆信息
    async getUserVehicles() {
      try {
        const response = await API.post("/test/user/vehicles",
        {
          username: this.username,
        });
        this.vehicles = response.data;
      } catch (error) {
        console.error("获取车辆信息失败：", error);
        alert("无法加载车辆信息，请稍后再试！");
      }
    }
  }
};
</script>