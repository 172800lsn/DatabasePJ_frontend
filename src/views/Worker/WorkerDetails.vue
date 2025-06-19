<template>
  <div>
    <h2>账户详细信息</h2>
    <div class="action-buttons">
      <button class="btn-return" @click="goBack">返回工作台</button>
    </div>

    <!-- 账户信息展示 -->
    <section v-if="userData">
      <section v-if="userData">
        <h3>账户信息</h3>
        <div v-if="!editMode">
          <p><strong>用户名：</strong>{{ userData.username }}</p>
          <p><strong>邮箱：</strong>{{ userData.email }}</p>
          <p><strong>账户类型：</strong>{{ userData.role }}</p>
          <p><strong>姓名：</strong>{{ userData.name }}</p>
          <p><strong>工种：</strong>{{ userData.jobType || '未设置' }}</p>
          <p><strong>时薪：</strong>{{ userData.hourlyRate ? `¥${userData.hourlyRate}/小时` : '未设置' }}</p>
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
          <div class="form-group">
            <label>工种：</label>
            <input type="text" v-model="editJobType">
          </div>
          <div class="form-group">
            <label>时薪：</label>
            <input type="number" v-model.number="editHourlyRate">
          </div>
          <div class="form-actions">
            <button @click="saveChanges" class="btn-save">保存</button>
            <button @click="cancelEdit" class="btn-cancel">取消</button>
          </div>
        </div>
      </section>
    </section>

  </div>
</template>

<script>
import API from "../../api/config";

export default {

  data() {
    return {
      userData: null,
      username: JSON.parse(localStorage.getItem("user"))?.username || "USER" ,// 从 localStorage 获取用户信息
      editMode: false,
      editEmail: '',
      editName: '',
      editJobType: '',
      editHourlyRate: 0
    };
  },
  async mounted() {
    await this.getUserDetails();
  },
  methods: {
    goBack() {
      this.$router.push('/workerboard');
    },
    // 获取账户信息
    editInfo() {
      this.editEmail = this.userData.email;
      this.editName = this.userData.name;
      this.editJobType = this.userData.jobType || '';
      this.editHourlyRate = this.userData.hourlyRate || 0;
      this.editMode = true;
    },

    async saveChanges() {
      try {
        const response = await API.post("/test/user/update-information", {
          username: this.username,
          email: this.editEmail,
          name: this.editName,
          jobType: this.editJobType,
          hourlyRate: this.editHourlyRate
        });

        if (response.data.success) {
          Object.assign(this.userData, {
            email: this.editEmail,
            name: this.editName,
            jobType: this.editJobType,
            hourlyRate: this.editHourlyRate
          });
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

<style scoped>
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info-card {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.btn-return {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  transition: all 0.3s ease;
}

.btn-return:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* 优化现有按钮样式 */
button {
  margin-right: 10px;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover {
  background-color: #219a52 !important;
}

.btn-cancel:hover {
  background-color: #7f8c8d !important;
}

/* 优化表单样式 */
.form-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.form-group input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52,152,219,0.1);
}
</style>