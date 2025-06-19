<template>
  <div>
    <h2>维修记录</h2>

    <!-- 维修记录部分 -->
    <div v-if="pagedRepairs.length > 0">
      <ul>
        <li v-for="repair in pagedRepairs" :key="repair.id">
          <p><strong>维修单号：</strong>{{ repair.id }}</p>
          <p><strong>车牌号：</strong>{{ repair.licensePlate }}</p>
          <p><strong>车辆品牌：</strong>{{ repair.brand }}</p>
          <p><strong>车辆型号：</strong>{{ repair.model }}</p>
          <p><strong>描述：</strong>{{ repair.description }}</p>
          <p><strong>状态：</strong>
            <span v-if="repair.status === 'TO_ACCEPT'||repair.status === 'PENDING'">待处理</span>
            <span v-else-if="repair.status === 'IN_PROGRESS'">维修中</span>
            <span v-else-if="repair.status === 'COMPLETED'">已完成</span>
            <span v-else>{{ repair.status }}</span>
          </p>
          <p><strong>开始时间：</strong>{{ repair.startTime ? formatDate(repair.startTime) : "未开始" }}</p>
          <p v-if="repair.completionTime"><strong>结束时间：</strong>{{ formatDate(repair.completionTime) }}</p>
          <p><strong>维修人员：</strong>
            <span v-if="repair.worker">{{ repair.worker.name }}</span>
            <span v-else>暂无</span>
          </p>
          <p><strong>相关材料：</strong></p>
          <ul v-if="repair.materials.length > 0">
            <li v-for="material in repair.materials" :key="material.name">
              {{ material.name }} ({{ material.quantity }} )
            </li>
          </ul>
          <p><strong>总费用：</strong>￥{{ repair.totalCost || "待结算" }}</p>
        </li>
      </ul>

      <!-- 分页按钮 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
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
      username: JSON.parse(localStorage.getItem("user"))?.username || "USER", // 用户名
      repairsAll: [], // 存储所有维修记录
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页显示的数据条数
    };
  },
  computed: {
    // 计算当前页显示的维修记录
    pagedRepairs() {
      const repairs = this.repairsAll || [];
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return repairs.slice(start, end);
    },
    // 总页数
    totalPages() {
      return Math.ceil((this.repairsAll?.length || 0) / this.pageSize);
    },
  },
  mounted() {
    this.fetchRepairs(); // 请求所有数据
  },
  methods: {
    // 获取所有维修记录
    async fetchRepairs() {
      try {
        console.log("username:", this.username);
        const response = await API.post("/repair-orders/repairs",
            {
              username: this.username,
            });
        this.repairsAll = response.data.repairs || []; // 存储数据
      } catch (error) {
        console.error("获取维修记录失败：", error);
        alert("无法加载维修记录，请稍后再试！");
      }
    },
    // 分页：上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // 分页：下一页
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    // 格式化日期
    formatDate(datetime) {
      const date = new Date(datetime);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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