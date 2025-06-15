import { createRouter, createWebHistory } from "vue-router";
import UserLogin from "../views/UserLogin.vue";
import UserRegister from "../views/UserRegister.vue"; // 引入注册页面
import UserDashboard from "../views/User/UserDashboard.vue";
import AdminBoard from "../views/Admin/AdminBoard.vue";
import WorkerMain from "../views/Worker/WorkerMain.vue";

// 路由配置
const routes = [
    { path: "/", redirect: "/login" }, // 根路径重定向到登录页面
    {
        path: "/login",
        component: UserLogin, // 登录页面
        meta: { title: "用户登录", requiresAuth: false },
    },
    {
        path: "/register",
        component: UserRegister, // 注册页面
        meta: { title: "用户注册", requiresAuth: false },
    },
    {
        path: "/dashboard",
        component: UserDashboard, // 用户主界面
        meta: { requiresAuth: true },
        children: [
            {
                path: "report",
                component: () => import("../views/User/ReportRepairInfo.vue"),
                meta: { title: "车辆报修" },
            },
            {
                path: "records",
                component: () => import("../views/User/RepairsInfo.vue"),
                meta: { title: "维修记录" },
            },
            {
                path: "details",
                component: () => import("../views/User/UsersDetails.vue"),
                meta: { title: "账户与车辆信息" },
            },
            {
                path: "feedback",
                component: () => import("../views/User/RepairFeedback.vue"),
                meta: { title: "维修反馈" },
            },
        ],
    },
    {
        path: "/workerboard",
        component: WorkerMain, // 维修人员主界面
        meta: { title: "维修工页面",requiresAuth: true },
        children: [

        ],
    },
    {
        path: "/workerboard/details",
        name: "details",
        component: () => import("../views/Worker/WorkerDetails.vue"),
        meta: { title: "维修人员信息" }
    },
    {
        path: "/workerboard/pending",
        name: "pending",
        component: () => import("../views/Worker/PendingWorks.vue"),
        meta: { title: "待接受维修记录" }
    },
    {
        path:"/workerboard/board",
        name:"board",
        component: () => import("../views/Worker/WorkerBoard.vue"),
        meta: { title: "当前维修" }
    },
    {
        path:"/workerboard/history",
        name:"history",
        component: () => import("../views/Worker/HistoryWorks.vue"),
        meta: { title: "维修历史" }
    },
    {
        path: '/task/:id',
        name: 'TaskDetail',
        component: () => import('../views/Worker/TaskDetail.vue'),
        props: true
    },

    {
        path: "/adminboard",
        component: AdminBoard, // 管理员主界面
        meta: { title: "管理员页面",requiresAuth: true },
        children: [],
    }

];

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 全局路由守卫
router.beforeEach((to, from,
                   next) => {
    document.title = to.meta.title || "车辆维修系统";
    //获取用户信息
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const requiresAuth = to.meta.requiresAuth;

    if(!userInfo && to.path.startsWith("/dashboard")){
        //如果未登录，跳转到登录界面
        return next("/login");
    }
    // 如果登录状态，并尝试访问登录页面，则重定向到对应角色的主页
    if (to.path === "/login" && userInfo) {
        if (userInfo.role === "USER") {
            return next("/dashboard");
        } else if (userInfo.role === "WORKER") {
            return next("/workerboard");
        } else if (userInfo.role === "ADMIN") {
            return next("/adminboard");
        }
    }


    const isAuthenticated = localStorage.getItem("authToken");

    if (requiresAuth && !isAuthenticated) {
        next({ path: "/login", query: { redirect: to.fullPath } });
    }

    next();
});

export default router;