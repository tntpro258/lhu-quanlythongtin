<template>
  <v-container class="login-form-container">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-card-title class="text-h5 text-center py-4">
            Đăng ký tài khoản
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="createAccount" v-model="isFormValid">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                :rules="[rules.required, rules.email]"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Mật khẩu"
                type="password"
                required
                :rules="[rules.required, rules.minLength]"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                required
                :rules="[rules.required, rules.passwordMatch]"
                prepend-inner-icon="mdi-lock-check"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-btn
                type="submit"
                color="primary"
                block
                :loading="isLoading"
                :disabled="!isFormValid || isLoading"
                class="mb-4"
              >
                Đăng ký
              </v-btn>
            </v-form>
            <v-divider class="my-4">Hoặc</v-divider>
            <v-btn
              block
              color="red"
              @click="signUpWithGoogle"
              :loading="isGoogleLoading"
              :disabled="isGoogleLoading"
            >
              <v-icon left>mdi-google</v-icon>
              Đăng ký bằng Google
            </v-btn>
          </v-card-text>
          <v-card-actions class="justify-center pb-4">
            <v-btn variant="text" @click="$router.push('/login')">
              Đã có tài khoản? Đăng nhập
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="5000">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn color="white" text @click="snackbar = false">
        Đóng
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { supabase } from "@/supabase";

export default {
  name: 'RegisterForm',
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const isLoading = ref(false);
    const isGoogleLoading = ref(false);
    const isFormValid = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");

    const rules = {
      required: v => !!v || 'Trường này là bắt buộc',
      email: v => /.+@.+\..+/.test(v) || 'Email không hợp lệ',
      minLength: v => v.length >= 6 || 'Mật khẩu phải có ít nhất 6 ký tự',
      passwordMatch: () => password.value === confirmPassword.value || 'Mật khẩu không khớp'
    };

    const showSnackbar = (text, color = 'success') => {
      snackbarText.value = text;
      snackbarColor.value = color;
      snackbar.value = true;
    };

    const createAccount = async () => {
      if (!isFormValid.value) return;

      try {
        isLoading.value = true;
        const { error } = await supabase.auth.signUp({
          email: email.value,
          password: password.value,
          options: {
            emailRedirectTo: `${window.location.origin}/confirm-registration`
          }
        });

        if (error) throw error;

        showSnackbar('Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác nhận tài khoản.', 'success');
        router.push('/login');
      } catch (error) {
        console.error('Lỗi đăng ký:', error.message);
        let errorMessage = 'Có lỗi xảy ra khi đăng ký';
        
        if (error.message.includes('Email already registered')) {
          errorMessage = 'Email này đã được đăng ký. Vui lòng sử dụng email khác.';
        } else if (error.message.includes('Password should be at least 6 characters')) {
          errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email không hợp lệ. Vui lòng kiểm tra lại.';
        }
        
        showSnackbar(errorMessage, 'error');
      } finally {
        isLoading.value = false;
      }
    };

    const signUpWithGoogle = async () => {
      try {
        isGoogleLoading.value = true;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });
        
        if (error) throw error;

      } catch (error) {
        console.error('Lỗi đăng ký với Google:', error.message);
        showSnackbar('Có lỗi xảy ra khi đăng ký bằng Google. Vui lòng thử lại sau.', 'error');
      } finally {
        isGoogleLoading.value = false;
      }
    };

    return {
      email,
      password,
      confirmPassword,
      isLoading,
      isGoogleLoading,
      isFormValid,
      snackbar,
      snackbarText,
      snackbarColor,
      rules,
      createAccount,
      signUpWithGoogle,
    };
  }
};
</script>

