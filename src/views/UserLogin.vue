<template>
  <div class="login">
    <h1>用户登录</h1>
    <form @submit.prevent="login">
      <div>
        <label>用户名：</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>密码：</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">登录</button>
    </form>

    <!-- 注册按钮，用于跳转到注册页面 -->
    <p>还没有账号？</p>
    <router-link to="/register">
      <button class="register-button">注册</button>
    </router-link>
  </div>
</template>

<script>
import API from "../api/config";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        console.log("username:", this.username);
        console.log("password:", this.password);
        const response = await API.post("/auth/login", {
          username: this.username,
          password: this.password,
          // id: "",
          // role: "",
          // email: "",
          // name: "",
          // workType: "",
          // hourlyRate: "",
        });

        //获取用户登录信息对像
        const user = response.data;
        console.log("user:", user.username);
        // 打印后端返回的完整响应
        console.log("Response data:", response.data);


        //将用户信息存储在localStorage中
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("authToken", user.username);

        if(user.role == "USER"){
          //跳转到/dashboard页面
          console.log("user.role:", user.role);
          this.$router.push("/dashboard");
          alert("登录成功!");
        } else if(user.role == "WORKER"){
          this.$router.push("/worker");
        }else if(user.role == "ADMIN"){
          this.$router.push("/admin");
        } else{
          alert("用户名或密码错误1");
        }
      } catch (error) {
        console.error("Error during login:", error.response.data);
        alert("登录失败：" + error.response.data);
      }
    },
  },
};
</script>

<style scoped>
.login {
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px 15px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #4cae4c;
}
</style>