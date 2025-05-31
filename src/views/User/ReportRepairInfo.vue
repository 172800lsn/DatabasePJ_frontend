<template>
  <div>
    <h2>提交车辆报修信息</h2>
    <form @submit.prevent="submitReport">
      <div>
        <label>车辆名称：</label>
        <input v-model="vehicleName" required />
      </div>
      <div>
        <label>问题描述：</label>
        <textarea v-model="description" required></textarea>
      </div>
      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script>
import API from "../../api/config";

export default {
  data() {
    return {
      vehicleName: "",
      description: "",
    };
  },
  methods: {
    async submitReport() {
      try {
        const response = await API.post("/report", {
          vehicleName: this.vehicleName,
          description: this.description,
        });
        alert("报修提交成功：" + response.data);
      } catch (error) {
        alert("提交失败，请重试！");
      }
    },
  },
};
</script>