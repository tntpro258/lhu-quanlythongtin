<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Đăng nhập Admin</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login" v-model="isFormValid">
              <!-- Email Input -->
              <v-text-field
                v-model="email"
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                :rules="[rules.required, rules.email]"
                @keyup.enter="login"
              ></v-text-field>

              <!-- Password Input -->
              <v-text-field
                v-model="password"
                label="Mật khẩu"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[rules.required]"
                @keyup.enter="login"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- Login Button -->
            <v-btn
              color="primary"
              @click="login"
              :disabled="!isFormValid || isLoading"
            >
              Đăng nhập
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            <!-- Link to User Login -->
            <v-btn text color="primary" @click="goToUserLogin">
              Quay lại đăng nhập người dùng
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Snackbar for showing notifications -->
  <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase"; // Importing supabase client

export default {
  name: "AdminLogin",
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const isLoading = ref(false);
    const isFormValid = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");

    // Validation rules for email and password
    const rules = {
      required: (v) => !!v || "Trường này là bắt buộc",
      email: (v) => /.+@.+\..+/.test(v) || "Email không hợp lệ",
    };

    // Function to show snackbar notifications
    const showSnackbar = (text, color = "success") => {
      snackbarText.value = text;
      snackbarColor.value = color;
      snackbar.value = true;
    };

    // Admin login function
    const login = async () => {
      try {
        isLoading.value = true;

        // Perform login with email and password
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        });

        if (error) throw error;

        // Check if the user is an admin
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (userError) {
          console.error("Error fetching user role:", userError.message);
          throw new Error("Không thể xác minh quyền truy cập");
        }

        if (userData.role !== "ADMIN") {
          throw new Error("Bạn không có quyền truy cập trang admin");
        }

        showSnackbar("Đăng nhập thành công!", "success");
        console.log("Login successful"); // Debugging log
        // Redirect to user management page after successful login
        setTimeout(() => {
          router.push("/admin-dashboard");
        }, 500); // Add a slight delay to ensure the snackbar is visible
      } catch (error) {
        console.error("Lỗi đăng nhập:", error.message);
        showSnackbar(error.message, "error");
      } finally {
        isLoading.value = false;
      }
    };

    // Redirect to user login page
    const goToUserLogin = () => {
      router.push("/user-login");
    };

    return {
      email,
      password,
      isLoading,
      isFormValid,
      snackbar,
      snackbarText,
      snackbarColor,
      rules,
      login,
      goToUserLogin,
    };
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
