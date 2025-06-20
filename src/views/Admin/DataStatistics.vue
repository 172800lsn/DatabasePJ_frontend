<template>
  <div class="data-statistics">
    <h1>数据统计</h1>

    <section>
      <h2>统计各车型的维修次数与平均维修费用</h2>
      <button @click="fetchVehicleRepairStatistics">刷新数据</button>
      <table v-if="repairStatistics.length > 0">
        <thead>
        <tr>
          <th>车型</th>
          <th>维修次数</th>
          <th>平均维修费用</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stat in repairStatistics" :key="stat.model">
          <td>{{ stat.model }}</td>
          <td>{{ stat.repairCount }}</td>
          <td>{{ stat.averageRepairCost }}</td>
        </tr>
        </tbody>
      </table>
      <p v-else>暂无统计数据，请点击刷新按钮加载。</p>
    </section>

    <section>
      <h2>统计所有车型的维修频率</h2>
      <button @click="fetchRepairFrequency">刷新数据</button>
      <table v-if="repairFrequency.length > 0">
        <thead>
        <tr>
          <th>车型</th>
          <th>维修次数</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="data in repairFrequency" :key="data.model">
          <td>{{ data.model }}</td>
          <td>{{ data.repairCount }}</td>
        </tr>
        </tbody>
      </table>
      <p v-else>暂无数据，请点击刷新按钮加载。</p>
    </section>

    <section>
      <h2>统计特定车型最常出现的故障类型</h2>
      <label>
        输入车型:
        <input v-model="selectedModel" placeholder="请输入车型" />
      </label>
      <button @click="fetchMostFrequentIssue">查询</button>
      <div v-if="mostFrequentIssue">
        <p>故障描述: {{ mostFrequentIssue.issueDescription }}</p>
        <p>出现次数: {{ mostFrequentIssue.issueCount }}</p>
      </div>
      <p v-else-if="selectedModel">暂无数据，请检查输入的车型。</p>
    </section>

  </div>
</template>

<script>
import API from "../../api/config";


export default {
  data() {
    return {
      repairStatistics: [], // 车型统计数据
      repairFrequency: [], // 所有车型的维修频率
      selectedModel: "", // 用户输入的具体车型
      mostFrequentIssue: null, // 特定车型最常见的故障类型
    };
  },
  methods: {
    // 获取车型维修统计数据
    async fetchVehicleRepairStatistics() {
      try {
        const response = await API.get("/admin/statistics/vehicle-repairs");
        this.repairStatistics = response.data;
      } catch (error) {
        alert("加载车型维修统计时出错: " + (error.response?.data || error.message));
      }
    },

    // 获取所有车型的维修频率
    async fetchRepairFrequency() {
      try {
        const response = await API.get("/admin/statistics/vehicle-repair-frequency");
        this.repairFrequency = response.data;
      } catch (error) {
        alert("加载维修频率数据时出错: " + (error.response?.data || error.message));
      }
    },

    // 获取特定车型最常见的故障类型
    async fetchMostFrequentIssue() {
      try {
        if (!this.selectedModel) {
          alert("请输入车型名称！");
          return;
        }
        const response = await API.get("/admin/statistics/most-frequent-issue", {
          params: {
            model: this.selectedModel,
          }
        });
        this.mostFrequentIssue = response.data;
      } catch (error) {
        alert("加载故障统计数据时出错: " + (error.response?.data || error.message));
        this.mostFrequentIssue = null;
      }
    },

  },
  mounted() {
    this.fetchVehicleRepairStatistics(); // 页面加载时初始化数据
    this.fetchRepairFrequency(); // 页面加载时初始化维修频率数据
  },
};

</script>

<style scoped>
.data-statistics {
  padding: 20px;
}
h1, h2 {
  color: #333;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  font-weight: bold;
  background-color: #f4f4f4;
}
p {
  margin-top: 10px;
}
</style>