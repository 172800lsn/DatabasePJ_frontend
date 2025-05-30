<template>
  <div>
    <h2>账户与车辆信息</h2>

    <section v-if="user">
      <h3>账户信息</h3>
      <p><strong>用户名：</strong>{{ user.username }}</p>
      <p><strong>邮箱：</strong>{{ user.email }}</p>
      <p><strong>电话号码：</strong>{{ user.phone || "暂无信息" }}</p>
    </section>

    <section v-if="vehicles.length > 0">
      <h3>车辆信息</h3>
      <ul>
        <li v-for="vehicle in vehicles" :key="vehicle.id">
          <p><strong>车辆名称：</strong>{{ vehicle.name }}</p>
          <p><strong>车型：</strong>{{ vehicle.type }}</p>
          <p><strong>车牌号：</strong>{{ vehicle.plateNumber }}</p>
        </li>
      </ul>
    </section>

    <div v-else>
      <p>暂无车辆信息。</p>
    </div>
  </div>
</template>

<script>
import API from "../api/config";

export default {
  data() {
    return {
      user: null, // 用户基本信息
      vehicles: [], // 用户车辆信息列表
    };
  },
  async mounted() {
    await this.getUserDetails();
    await this.getUserVehicles();
  },
  methods: {
    // 获取用户基本信息
    async getUserDetails() {
      try {
        const response = await API.get("/user/details");
        this.user = response.data;
      } catch (error) {
        console.error("获取用户信息失败：", error);
        alert("无法加载账户信息，请稍后再试！");
      }
    },
    // 获取车辆信息
    async getUserVehicles() {
      try {
        const response = await API.get("/user/vehicles");
        this.vehicles = response.data;
      } catch (error) {
        console.error("获取车辆信息失败：", error);
        alert("无法加载车辆信息，请稍后再试！");
      }
    },
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}

section {
  margin-bottom: 30px;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
}

strong {
  font-weight: bold;
}
</style>