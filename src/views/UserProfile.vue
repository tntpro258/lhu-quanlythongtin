<template>
  <v-container class="scientific-profile py-8">
    <v-row>
      <v-col cols="12" class="text-center mb-8">
        <h1 class="text-h4 font-weight-bold">Thông Tin Cá Nhân</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Thông Tin Cá Nhân</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Họ Tên:</v-list-item-title>
                  <v-list-item-subtitle>{{ personalInfo.full_name }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Email:</v-list-item-title>
                  <v-list-item-subtitle>{{ personalInfo.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Số Điện Thoại:</v-list-item-title>
                  <v-list-item-subtitle>{{ personalInfo.phone_number }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Địa Chỉ:</v-list-item-title>
                  <v-list-item-subtitle>{{ personalInfo.address }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Công Việc Hiện Tại:</v-list-item-title>
                  <v-list-item-subtitle>{{ personalInfo.current_job }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Nơi Làm Việc:</v-list-item-title>
                  <v-list-item-subtitle>{{ personalInfo.workplace }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item v-if="personalInfo.other">
                <v-list-item-content>
                  <v-list-item-title>Khác:</v-list-item-title>
                  <v-list-item-subtitle>{{ personalInfo.other }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Scientific Profile Section -->
    <v-row>
      <v-col cols="12" class="text-center mb-8">
        <h1 class="text-h2 font-weight-bold mb-4">Hồ Sơ Khoa Học</h1>
        <p class="text-h5 text-medium-emphasis">Thông tin hồ sơ khoa học của bạn</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="(item, index) in profileItems" :key="index">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 8 : 2"
            :class="{ 'on-hover': isHovering }"
            @click="navigateTo(item.path)"
            class="mx-auto pa-4 d-flex flex-column align-center justify-center transition-swing"
            height="200"
          >
            <v-icon :icon="item.icon" size="large" class="mb-4" :color="item.color"></v-icon>
            <v-card-title class="text-center">{{ item.name }}</v-card-title>
            <v-card-subtitle class="text-center">{{ item.description }}</v-card-subtitle>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { supabase } from "@/supabase";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const personalInfo = reactive({
  full_name: "",
  email: "",
  phone_number: "",
  address: "",
  current_job: "",
  workplace: "",
  other: "",
});

const currentUser = reactive({
  id: "",
  role: "", // "admin" hoặc "user"
});

const profileItems = ref([
  { name: "Thông Tin Cá Nhân", description: "Cập nhật thông tin cá nhân", path: `/personal-info/${route.params.id}`, icon: "mdi-account", color: "blue" },
  { name: "Quá Trình Đào Tạo", description: "Thông tin về quá trình đào tạo", path: `/education/${route.params.id}`, icon: "mdi-school", color: "green" },
  { name: "Quá Trình Công Tác", description: "Thông tin về quá trình công tác", path: `/work-process/${route.params.id}`, icon: "mdi-briefcase", color: "orange" },
  { name: "Dự Án Nghiên Cứu", description: "Danh sách các dự án nghiên cứu", path: `/research-projects/${route.params.id}`, icon: "mdi-flask", color: "purple" },
  { name: "Công Bố Khoa Học", description: "Thông tin công bố khoa học", path: `/scientific-publications/${route.params.id}`, icon: "mdi-book-open-page-variant", color: "red" },
  { name: "Bằng Sáng Chế", description: "Danh sách các bằng sáng chế", path: `/patents/${route.params.id}`, icon: "mdi-certificate", color: "teal" },
  { name: "Hợp Tác Nghiên Cứu", description: "Thông tin hợp tác nghiên cứu", path: `/research-collaboration/${route.params.id}`, icon: "mdi-account-group", color: "indigo" },
  { name: "Cuộc Thi", description: "Danh sách các cuộc thi đã tham gia", path: `/contests/${route.params.id}`, icon: "mdi-trophy", color: "amber" },
  { name: "Sản Phẩm", description: "Thông tin về sản phẩm nghiên cứu", path: `/products/${route.params.id}`, icon: "mdi-package-variant-closed", color: "deep-purple" },
]);

const navigateTo = (path) => {
  router.push(path);
};

const isAdmin = ref(false);

// Function to load the current user information
const loadCurrentUser = async () => {
  try {
    const { data: userData, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (userData) {
      currentUser.id = userData.user.id;  // Fetch current user ID
      currentUser.role = "user";  // Default role
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", currentUser.id)
        .single();
      
      if (error) throw error;
      if (data.role === "ADMIN") {
        isAdmin.value = true;
        currentUser.role = "ADMIN";
      }
    }
  } catch (error) {
    console.error("Error fetching current user information:", error);
  }
};

// Function to load personal information
const loadPersonalInfo = async () => {
  try {
    const id = route.params.id; // Fetch ID from URL params

    // If the user is not an admin and tries to view someone else's information
    if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
      alert("You do not have permission to access another user's information.");
      router.push("/");  // Redirect to the user's own profile page
      return;
    }

    // Check if the ID is invalid
    if (!id || !validateUUID(id)) {
      alert("Invalid user information or ID!");
      router.push("/");
      return;
    }

    // Proceed with the query if the ID is valid
    const { data, error } = await supabase
      .from("personal_info")
      .select("*")
      .eq("user_id", id)
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (error) {
      throw error;
    }

    if (data) {
      Object.assign(personalInfo, data);
    } else {
      alert("User information not found!");
      router.push("/admin-dashboard");
    }
  } catch (error) {
    console.error("Error loading data from Supabase:", error);
    alert("An error occurred while loading data: " + error.message);
  }
};

// Function to validate a UUID
const validateUUID = (uuid) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

// Load current user information when the component mounts
onMounted(async () => {
  await loadCurrentUser();  // Fetch current user information
  loadPersonalInfo();  // Proceed to load personal information
});
</script>

<style scoped>
.scientific-profile {
  max-width: 1200px;
  margin: 0 auto;
}

.v-card {
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.v-card:hover {
  transform: translateY(-5px);
}

.on-hover {
  background-color: var(--v-primary-lighten5);
}
</style>
