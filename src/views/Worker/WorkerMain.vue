<template>
  <div class="worker-main">
    <h1>维修工工作台</h1>

    <div class="function-grid">
      <!-- 个人信息 -->
      <div class="function-card" @click="navigateToProfile">
        <div class="card-icon user-profile"></div>
        <h3>个人信息</h3>
        <p>查看/修改个人资料</p>
      </div>

      <!-- 待接收订单 -->
      <div class="function-card" @click="navigateToPendingOrders">
        <div class="card-icon new-orders"></div>
        <h3>待接收订单</h3>
        <p>查看新分配的维修任务</p>
      </div>

      <!-- 当前订单 -->
      <div class="function-card" @click="navigateToCurrentOrders">
        <div class="card-icon current-work"></div>
        <h3>当前订单</h3>
        <p>进行中的维修任务</p>
      </div>

      <!-- 历史订单 -->
      <div class="function-card" @click="navigateToHistory">
        <div class="card-icon history"></div>
        <h3>历史订单</h3>
        <p>已完成任务记录</p>
      </div>
      <div class="logout-section">
        <button class="logout-button" @click="logout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const navigationMethods = {
      navigateToProfile: () => router.push({ name: 'details' }),
      navigateToPendingOrders: () => router.push({ name: 'pending' }),
      navigateToCurrentOrders: () => router.push({ name: 'board' }),
      navigateToHistory: () => router.push({ name: 'history' })
    };
    const logout = () => {
      // 清除登录信息
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      // 跳转到登录页
      router.push("/login");
      alert("已成功退出！");
    };

    return {
      ...navigationMethods,
      logout
    };
  }
};
</script>

<style scoped>
.worker-main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 20px;
}

.function-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.function-card:hover {
  transform: translateY(-5px);
}



h3 {
  color: #34495e;
  margin-bottom: 0.5rem;
}

p {
  color: #7f8c8d;
  font-size: 0.9rem;
}
</style>
<style scoped>
/* 新增退出按钮样式 */
.logout-section {
  margin-top: 40px;
  text-align: center;
}

.logout-button {
  padding: 12px 24px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #bb2d3b;
}
</style>