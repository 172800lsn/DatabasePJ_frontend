<template>
  <div>
    <h2>维修订单反馈</h2>

    <div v-if="pagedRepairs.length > 0">
      <ul>
        <li v-for="repair in pagedRepairs" :key="repair.id">
          <p><strong>维修单号：</strong>{{ repair.id }}</p>
          <p><strong>车牌号：</strong>{{ repair.licensePlate }}</p>
          <p><strong>描述：</strong>{{ repair.description }}</p>

          <!-- 催单选项 -->
          <label>
            <input
                type="checkbox"
                :value="repair.id"
                v-model="urgentOrders"
            />
            催单
          </label>

          <!-- 反馈描述 -->
          <p>
            <label>反馈描述：</label>
            <textarea
                v-model="feedbackDescriptions[repair.id]"
                placeholder="输入您对该订单的反馈"
            ></textarea>
          </p>

          <!-- 评分 -->
          <p>
            <label>评分：</label>
            <select v-model="scores[repair.id]">
              <option disabled value="">请选择评分</option>
              <option v-for="n in scoreRange" :key="n" :value="n">
                {{ n }} 分
              </option>
            </select>
          </p>

          <!-- 提交反馈按钮 -->
          <button @click="submitFeedback(repair.id)">提交反馈</button>
        </li>
      </ul>

      <!-- 分页 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>

    <div v-else>
      <p>暂无维修订单。</p>
    </div>
  </div>
</template>

<script>
import API from "../../api/config";

export default {
  data() {
    return {
      username: JSON.parse(localStorage.getItem("user"))?.username || "USER", // 用户名
      repairs: [], // 所有维修订单
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页数据量
      urgentOrders: [], // 催单的订单ID
      feedbackDescriptions: {}, // 用户输入的反馈描述
      scores: {}, // 用户评分（订单ID -> 评分值）
      scoreRange: [1, 2, 3, 4, 5], // 分数范围
    };
  },
  computed: {
    // 分页数据
    pagedRepairs() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.repairs.slice(start, start + this.pageSize);
    },
    // 总页数
    totalPages() {
      return Math.ceil(this.repairs.length / this.pageSize);
    },
  },
  mounted() {
    this.fetchRepairs(); // 加载维修记录
  },
  methods: {
    // 获取维修订单
    async fetchRepairs() {
      try {
        const response = await API.post("/repair-orders/repairs", {
          username: this.username,
        });
        this.repairs = response.data.repairs || [];
      } catch (error) {
        console.error("获取维修订单失败：", error);
        alert("无法加载维修订单，请稍后再试！");
      }
    },
    // 提交反馈
    async submitFeedback(orderId) {
      try {
        const feedbackData = {
          orderId,
          isUrgent: this.urgentOrders.includes(orderId),
          feedback: this.feedbackDescriptions[orderId] || "",
          score: this.scores[orderId] || null,
        };

        const response = await API.post("/repair-orders/submit-feedback", feedbackData);
        alert(response.data.message || "反馈提交成功！");
      } catch (error) {
        console.error("提交反馈失败：", error);
        alert("提交反馈失败，请重试！");
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
  margin-bottom: 20px;
  border-radius: 5px;
}

textarea {
  width: 100%;
  height: 60px;
  margin: 10px 0;
}

.pagination {
  margin-top: 20px;
}
</style>