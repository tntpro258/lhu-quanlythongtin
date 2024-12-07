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
    </v-container>
  </template>
<script setup>
import { reactive, onMounted } from "vue";
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

// Hàm để lấy thông tin người dùng hiện tại (bao gồm ID và role)
const loadCurrentUser = async () => {
  try {
    const { data: userData, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (userData) {
      currentUser.id = userData.user.id;  // Lấy ID của người dùng hiện tại
      currentUser.role = userData.user.role || "user";  // Lấy role của người dùng (nếu có)
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng hiện tại:", error);
  }
};

// Hàm tải thông tin cá nhân
const loadPersonalInfo = async () => {
  try {
    const id = route.params.id; // Lấy ID từ params trong đường dẫn URL

    // Nếu người dùng không phải admin và cố gắng xem thông tin của người khác
    if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
      alert("Bạn không có quyền truy cập vào thông tin của người dùng khác.");
      router.push("/admin-dashboard");  // Điều hướng về trang cá nhân của người dùng
      return;
    }

    // Kiểm tra nếu ID không hợp lệ
    if (!id || !validateUUID(id)) {
      alert("Không tìm thấy thông tin người dùng hoặc ID không hợp lệ!");
      router.push("/admin-dashboard");
      return;
    }

    // Tiến hành truy vấn nếu ID hợp lệ
    const { data, error } = await supabase
      .from("personal_info")
      .select("*")
      .eq("user_id", id)
      .limit(1);

    if (error) {
      throw error;
    }

    // Log dữ liệu để kiểm tra
    console.log(data);

    if (data && data.length > 0) {
      Object.assign(personalInfo, data[0]);
    } else {
      alert("Không tìm thấy thông tin người dùng!");
      router.push("/admin-dashboard");
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ Supabase:", error);
    alert("Có lỗi xảy ra khi tải dữ liệu: " + error.message);
  }
};

// Hàm kiểm tra UUID hợp lệ
const validateUUID = (uuid) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

// Tải thông tin người dùng hiện tại khi component được mount
onMounted(async () => {
  await loadCurrentUser();  // Lấy thông tin người dùng hiện tại
  loadPersonalInfo();  // Tiến hành tải thông tin cá nhân
});
</script>

