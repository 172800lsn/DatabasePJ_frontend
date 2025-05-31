<template>
  <div>
    <h2>维修记录</h2>

    <div v-if="repairs.length > 0">
      <ul>
        <li v-for="repair in repairs" :key="repair.id">
          <p><strong>维修单号：</strong>{{ repair.id }}</p>
          <p><strong>车辆名称：</strong>{{ repair.vehicleName }}</p>
          <p><strong>维修状态：</strong>{{ repair.status }}</p>
          <p><strong>描述：</strong>{{ repair.description }}</p>
          <p><strong>开始时间：</strong>{{ repair.startTime || "未开始" }}</p>
          <p><strong>结束时间：</strong>{{ repair.endTime || "未完成" }}</p>
          <p><strong>总费用：</strong>￥{{ repair.totalCost || "待结算" }}</p>
        </li>
      </ul>

      <!-- 分页控制 -->
      <div class="pagination">
        <button @click="fetchRepairs(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页</span>
        <button @click="fetchRepairs(currentPage + 1)" :disabled="repairs.length < pageSize">下一页</button>
      </div>
    </div>
    <div v-else>
      <p>暂无维修记录。</p>
    </div>
  </div>
</template>

<script>
import API from "../../api/config";

export default {
  data() {
    return {
      repairs: [], // 维修记录列表
      currentPage: 1, // 当前页
      pageSize: 5, // 每页数据条数
    };
  },
  mounted() {
    this.fetchRepairs(this.currentPage); // 获取第一页数据
  },
  methods: {
    // 获取维修记录，分页支持
    async fetchRepairs(page) {
      if (page < 1) return; // 禁止向负数页请求

      try {
        const response = await API.get("/user/repairs", {
          params: {
            page: page,
            size: this.pageSize,
          },
        });
        const data = response.data;
        this.repairs = data.repairs || [];
        this.currentPage = page; // 更新当前页
      } catch (error) {
        console.error("获取维修记录失败：", error);
        alert("无法加载维修记录，请稍后再试！");
      }
    },
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
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

.pagination {
  margin-top: 20px;
}

button {
  padding: 5px 10px;
  margin-right: 10px;
  border: none;
  background-color: #5cb85c;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>