<template>
  <header class="header">
    <div class="logo-container">
      <img src="https://cdn.haitrieu.com/wp-content/uploads/2021/12/Logo-DH-Lac-Hong-LHU-EN.png" alt="Đại học Lạc Hồng Logo" class="logo">
      <h1 class="title">Đại học Lạc Hồng</h1>
    </div>
    <nav class="nav desktop-nav">
      <router-link to="/" class="nav-item">
        <HomeIcon class="icon" />
        Trang chủ
      </router-link>
      <div class="dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
        <router-link to="/scientific-profile" class="nav-item">
          <FileTextIcon class="icon" />
          Hồ sơ khoa học
          <ChevronDownIcon class="icon-small" />
        </router-link>
        <div v-if="showDropdown" class="dropdown-content">
          <router-link v-for="item in scientificProfileItems" :key="item.path" :to="item.path" class="dropdown-item">
            {{ item.title }}
          </router-link>
        </div>
      </div>
    </nav>
    <div class="user-actions desktop-nav">
      <template v-if="isLoggedIn">
        <span class="user-greeting">
          <UserIcon class="icon" />
          Xin chào, {{ userName }}
        </span>
        <button @click="logout" class="logout-btn">
          <LogOutIcon class="icon-small" />
          Đăng xuất
        </button>
      </template>
      <button v-else @click="goToLogin" class="login-btn">
        <LogInIcon class="icon-small" />
        Đăng nhập
      </button>
    </div>
    <button @click="toggleMobileMenu" class="mobile-menu-button">
      <MenuIcon class="icon" />
    </button>
    <div v-if="mobileMenuOpen" class="mobile-menu">
      <router-link to="/" class="mobile-nav-item" @click="closeMobileMenu">
        <HomeIcon class="icon" />
        Trang chủ
      </router-link>
      <router-link to="/scientific-profile" class="mobile-nav-item" @click="closeMobileMenu">
        <FileTextIcon class="icon" />
        Hồ sơ khoa học
      </router-link>
      <div class="mobile-submenu">
        <router-link v-for="item in scientificProfileItems" :key="item.path" :to="item.path" class="mobile-nav-item" @click="closeMobileMenu">
          {{ item.title }}
        </router-link>
      </div>
      <template v-if="isLoggedIn">
        <span class="mobile-nav-item user-greeting">
          <UserIcon class="icon" />
          Xin chào, {{ userName }}
        </span>
        <button @click="logout" class="mobile-nav-item logout-btn">
          <LogOutIcon class="icon-small" />
          Đăng xuất
        </button>
      </template>
      <button v-else @click="goToLogin" class="mobile-nav-item login-btn">
        <LogInIcon class="icon-small" />
        Đăng nhập
      </button>
    </div>
  </header>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import { HomeIcon, FileTextIcon, ChevronDownIcon, UserIcon, LogInIcon, LogOutIcon, MenuIcon } from 'lucide-vue-next';

export default {
  name: "CustomHeader",
  components: {
    HomeIcon,
    FileTextIcon,
    ChevronDownIcon,
    UserIcon,
    LogInIcon,
    LogOutIcon,
    MenuIcon
  },
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(false);
    const userName = ref("");
    const showDropdown = ref(false);
    const mobileMenuOpen = ref(false);

    const scientificProfileItems = [
      { title: 'Thông Tin Cá Nhân', path: '/personal-info' },
      { title: 'Quá Trình Đào Tạo', path: '/education' },
      { title: 'Quá Trình Công Tác', path: '/work-experience' },
      { title: 'Dự Án Nghiên Cứu', path: '/research-projects' },
      { title: 'Công Bố Khoa Học', path: '/scientific-publications' },
      { title: 'Bằng Sáng Chế', path: '/patents' },
      { title: 'Hợp Tác Nghiên Cứu', path: '/research-collaboration' },
      { title: 'Cuộc Thi', path: '/contests' },
      { title: 'Sản Phẩm', path: '/products' },
    ];

    const goToLogin = () => {
      router.push("/login");
      closeMobileMenu();
    };

    const logout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        isLoggedIn.value = false;
        userName.value = "";
        router.push("/login");
        closeMobileMenu();
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        alert("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.");
      }
    };

    const fetchUserInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          isLoggedIn.value = true;
          const { data, error } = await supabase
            .from('personal_info')
            .select('full_name')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            userName.value = "Người dùng";
          } else if (data) {
            userName.value = data.full_name || "Người dùng";
          } else {
            console.warn("Không tìm thấy thông tin người dùng");
            userName.value = "Người dùng";
          }
        } else {
          isLoggedIn.value = false;
          userName.value = "";
        }
      } catch (error) {
        console.error("Lỗi khi fetch thông tin người dùng:", error);
        isLoggedIn.value = false;
        userName.value = "";
      }
    };

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false;
    };

    onMounted(() => {
      fetchUserInfo();
      supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
          fetchUserInfo();
        } else if (event === 'SIGNED_OUT') {
          isLoggedIn.value = false;
          userName.value = "";
        }
      });
    });

    return {
      isLoggedIn,
      userName,
      goToLogin,
      logout,
      scientificProfileItems,
      showDropdown,
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #1976D2;
  color: white;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 50px;
  height: auto;
  margin-right: 1rem;
}

.title {
  font-size: 1.5rem;
  margin: 0;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav-item {
  color: white;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.dropdown {
  position: relative;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  z-index: 1;
  min-width: 200px;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-greeting {
  font-weight: bold;
  display: flex;
  align-items: center;
}

.logout-btn, .login-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.logout-btn {
  background-color: #FFD700;
  color: #333;
}

.login-btn {
  background-color: #FFD700;
  color: #333;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

.icon-small {
  width: 16px;
  height: 16px;
  margin-left: 0.25rem;
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1976D2;
  padding: 1rem;
  z-index: 1000;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 0.5rem 0;
  font-size: 1.1rem;
}

.mobile-submenu {
  margin-left: 1rem;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: 1.2rem;
  }

  .logo {
    width: 40px;
  }
}
</style>