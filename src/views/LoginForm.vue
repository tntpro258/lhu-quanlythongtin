<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Đăng nhập</v-toolbar-title>
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
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar for showing notifications -->
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
  name: "LoginPage",
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const isLoading = ref(false);
    const isFormValid = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");

    const rules = {
      required: (v) => !!v || "Trường này là bắt buộc",
      email: (v) => /.+@.+\..+/.test(v) || "Email không hợp lệ",
    };

    const showSnackbar = (text, color = "success") => {
      snackbarText.value = text;
      snackbarColor.value = color;
      snackbar.value = true;
    };

    const login = async () => {
      try {
        isLoading.value = true;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        });

        if (error) throw error;

        const { data: claimsData, error: claimsError } = await supabase
          .rpc("get_custom_claims", {
            user_id: data.user.id,
          });

        if (claimsError) {
          console.error("Error fetching custom claims:", claimsError.message);
          throw new Error("Không thể xác minh quyền truy cập");
        }

        const redirectPath = claimsData.role === "ADMIN" ? "/admin-dashboard" : "/";
        showSnackbar(
          claimsData.role === "ADMIN"
            ? "Chào mừng Admin!"
            : "Xin chào người dùng!",
          "success"
        );
        setTimeout(() => {
          router.push(redirectPath);
        }, 500);
      } catch (error) {
        console.error("Lỗi đăng nhập:", error.message);
        showSnackbar(error.message, "error");
      } finally {
        isLoading.value = false;
      }
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
    };
  },
};

</script>

<style scoped>
/* Add custom styles if needed */
</style>
