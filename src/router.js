import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
    return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: "history",
    routes:[
        {
            path: "/",
            component: importComponent("DashboardLayout"),
            children: [
                // Dashboard
                {
                    path: "/dashboard",
                    name: "Dashboard",
                    meta: { title: 'Dashboard'},
                    component: importComponent("Dashboard"),
                },
                // Courses
                {
                    path: '/product',
                    name: 'Product',
                    meta: { title: 'Products'},
                    component: importComponent('DataMaster/Products'),
                },
                {
                    path: '/wishlist',
                    name: 'Wishlist',
                    meta: { title: 'Wishlists'},
                    component: importComponent('DataMaster/Wishlists')
                },
                // Users
                {
                    path: '/user',
                    name: 'User',
                    meta: { title: 'Users'},
                    component: importComponent('DataMaster/Users')
                },
                {
                    path: '/toko',
                    name: 'Toko',
                    meta: { title: 'tokos'},
                    component: importComponent('DataMaster/Tokos')
                },
            ],
        },

        // Login
        {
            path: '/login',
            name: 'Login',
            meta: { title: 'Login'},
            component: importComponent('Login'),
        },
        // Register
        {
            path: '/register',
            name: 'Register',
            meta: { title: 'Register'},
            component: importComponent('Register'),
        },
        {
            path: '*',
            redirect: '/'
        },
    ],
});

// set judul
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    if(to.name !== "Login" && localStorage.getItem("token") == null && to.name !== "Register"){
        next({name: 'Login'});
    }
    else{
        next();
    }
});

export default router;