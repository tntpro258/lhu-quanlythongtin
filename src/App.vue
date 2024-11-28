<template>
  <v-app>
    <!-- Sử dụng CustomHeader component -->
    <custom-header
      :isLoggedIn="isLoggedIn"
      :routes="routes"
      :drawer="drawer"
      @toggle-drawer="toggleDrawer"
      @logout="handleLogout"
    />

    <!-- Navigation Drawer cho màn hình nhỏ -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          v-for="route in routes"
          :key="route.name"
          :to="route.path"
          @click="drawer = false"
          class="menu-item"
        >
          <v-list-item-title>{{ route.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Nội dung chính -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <v-footer color="#1976D2" class="footer">
      <v-container class="text-center">
        © {{ new Date().getFullYear() }} Đại học Lạc Hồng. Tất cả các quyền được bảo lưu.
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import CustomHeader from './components/CustomHeader.vue';

export default {
  name: "App",
  components: {
    CustomHeader
  },
  data() {
    return {
      drawer: false, // Trạng thái của menu xổ xuống
      isLoggedIn: false, // Trạng thái đăng nhập
      routes: [
        { path: "/", name: "Trang Chủ" },
        { path: "/scientific-profile", name: "Hồ Sơ Khoa Học" },
        { path: "/research-cooperation", name: "Hợp Tác Nghiên Cứu" },
        { path: "/contests", name: "Cuộc Thi" },
        { path: "/products", name: "Sản Phẩm" },
      ],
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer; // Thay đổi trạng thái của drawer
    },
    handleLogout() {
      this.isLoggedIn = false;
      localStorage.removeItem("isLoggedIn");
    }
  },
  mounted() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  }
};
</script>

<style scoped>
.v-application {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.v-main {
  flex: 1 0 auto;
}

.footer {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}

.menu-item {
  cursor: pointer;
}
</style>

