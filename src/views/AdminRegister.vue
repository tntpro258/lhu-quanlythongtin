<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Đăng ký Admin</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="register" v-model="isFormValid">
                <v-text-field
                  v-model="email"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="email"
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
  
                <v-text-field
                  v-model="password"
                  label="Mật khẩu"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="[rules.required, rules.minLength(6)]"
                ></v-text-field>
  
                <v-text-field
                  v-model="confirmPassword"
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  prepend-icon="mdi-lock-check"
                  type="password"
                  :rules="[rules.required, rules.matchPassword]"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="register"
                :disabled="!isFormValid || isLoading"
              >
                Đăng ký
              </v-btn>
            </v-card-actions>
            <v-card-text class="text-center">
              <v-btn text color="primary" @click="goToLogin">
                Quay lại đăng nhập
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
        {{ snackbarText }}
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { supabase } from "@/supabase";
  
  export default {
    name: "AdminRegister",
    setup() {
      const router = useRouter();
      const email = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const isLoading = ref(false);
      const isFormValid = ref(false);
      const snackbar = ref(false);
      const snackbarText = ref("");
      const snackbarColor = ref("success");
  
      const rules = {
        required: (v) => !!v || "Trường này là bắt buộc",
        email: (v) => /.+@.+\..+/.test(v) || "Email không hợp lệ",
        minLength: (length) => (v) =>
          v.length >= length || `Phải chứa ít nhất ${length} ký tự`,
        matchPassword: (v) =>
          v === password.value || "Mật khẩu không khớp",
      };
  
      const showSnackbar = (text, color = "success") => {
        snackbarText.value = text;
        snackbarColor.value = color;
        snackbar.value = true;
      };
  
      const register = async () => {
        if (password.value !== confirmPassword.value) {
          showSnackbar("Mật khẩu không khớp", "error");
          return;
        }
  
        try {
          isLoading.value = true;
  
          // Tạo tài khoản trong Supabase
          const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
          });
  
          if (error) throw error;
  
          // Thêm người dùng vào bảng 'profiles' với vai trò 'admin'
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id, // Sử dụng ID của người dùng
                role: "admin", // Gán vai trò admin
              },
            ]);
  
          if (profileError) {
            console.error("Error adding profile:", profileError);
            throw new Error("Không thể tạo hồ sơ người dùng.");
          }
  
          showSnackbar("Đăng ký thành công!", "success");
          router.push("/admin-login"); // Chuyển hướng tới trang đăng nhập admin
        } catch (error) {
          console.error("Lỗi đăng ký:", error.message);
          showSnackbar(error.message, "error");
        } finally {
          isLoading.value = false;
        }
      };
  
      const goToLogin = () => {
        router.push("/admin-login");
      };
  
      return {
        email,
        password,
        confirmPassword,
        isLoading,
        isFormValid,
        snackbar,
        snackbarText,
        snackbarColor,
        rules,
        register,
        goToLogin,
      };
    },
  };
  </script>
  