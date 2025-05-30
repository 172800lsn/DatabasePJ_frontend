<template>
  <div>
    <h2>维修反馈与催单</h2>
    <div v-if="repairs.length > 0">
      <div v-for="repair in repairs" :key="repair.id">
        <p><strong>维修单ID：</strong>{{ repair.id }}</p>
        <p><strong>状态：</strong>{{ repair.status }}</p>
        <p>
          <button @click="urgeRepair(repair.id)">催单</button>
          <button @click="rateService(repair.id)">服务评分</button>
        </p>
      </div>
    </div>
    <div v-else>
      <p>暂无维修记录。</p>
    </div>
  </div>
</template>

<script>
import API from "../api/config";

export default {
  data() {
    return {
      repairs: [], // 用户维修单列表
    };
  },
  mounted() {
    this.getRepairs();
  },
  methods: {
    async getRepairs() {
      const response = await API.get("/user/repairs"); // 请求用户维修单
      this.repairs = response.data || [];
    },
    async urgeRepair(id) {
      alert(`维修单 ${id} 已成功催单！`);
    },
    async rateService(id) {
      alert(`维修单 ${id} 评分成功！`);
    },
  },
};
</script>