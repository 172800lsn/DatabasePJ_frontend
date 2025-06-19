<template>
  <div>
    <h2>账户与车辆信息</h2>

    <!-- 账户信息展示 -->
    <section v-if="userData">
      <h3>账户信息</h3>
      <div v-if="!editMode">
        <p><strong>用户名：</strong>{{ userData.username }}</p>
        <p><strong>邮箱：</strong>{{ userData.email }}</p>
        <p><strong>姓名：</strong>{{ userData.name }}</p>
        <button @click="editInfo">修改信息</button>
      </div>

      <!-- 编辑表单 -->
      <div v-else>
        <div class="form-group">
          <label>邮箱：</label>
          <input type="email" v-model="editEmail">
        </div>
        <div class="form-group">
          <label>姓名：</label>
          <input type="text" v-model="editName">
        </div>
        <div class="form-actions">
          <button @click="saveChanges" class="btn-save">保存</button>
          <button @click="cancelEdit" class="btn-cancel">取消</button>
        </div>
      </div>
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
      vehicles: [] ,// 保存用户的车辆信息
      editMode: false,
      editEmail: '',
      editName: '',
      userData: null // 初始化 userData
    };
  },
  async mounted() {
    await this.getUserDetails();
    await this.getUserVehicles();
  },
  methods: {
    editInfo() {
      this.editEmail = this.userData.email;
      this.editName = this.userData.name;
      this.editMode = true;
    },

    async saveChanges() {
      try {
        const response = await API.post("/test/user/update-information", {
          username: this.username,
          email: this.editEmail,
          name: this.editName
        });

        if (response.data.success) {
          this.userData.email = this.editEmail;
          this.userData.name = this.editName;
          this.editMode = false;
          alert('信息更新成功！');
        }
      } catch (error) {
        console.error("更新失败：", error);
        alert('更新失败，请检查输入内容');
      }
    },

    cancelEdit() {
      this.editMode = false;
    },
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

<style scoped>
.form-group {
  margin: 15px 0;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  padding: 8px;
  width: 300px;
}
.form-actions {
  margin-top: 20px;
}
button {
  margin-right: 10px;
  padding: 8px 15px;
  cursor: pointer;
}
.btn-save {
  background-color: #4CAF50;
  color: white;
}
.btn-cancel {
  background-color: #f44336;
  color: white;
}
</style>