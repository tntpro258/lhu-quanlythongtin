<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Đăng nhập User</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login" v-model="isFormValid">
              <v-text-field
                v-model="username"
                label="Tên đăng nhập hoặc Mã sinh viên"
                name="username"
                prepend-icon="mdi-account"
                :rules="[rules.required]"
                outlined
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Mật khẩu"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[rules.required]"
                outlined
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="login" 
              :disabled="!isFormValid || isLoading"
              :loading="isLoading"
            >
              Đăng nhập
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            <v-btn 
              color="primary" 
              outlined 
              @click="signInWithGoogle" 
              :loading="isGoogleLoading"
            >
              <v-icon left>mdi-google</v-icon>
              Đăng nhập bằng Google
            </v-btn>
          </v-card-text>
          <v-card-text class="text-center">
            <v-btn 
              color="secondary" 
              text 
              @click="goToAdminLogin"
            >
              Đăng nhập Admin
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar 
      v-model="snackbar" 
      :color="snackbarColor" 
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';

export default {
  name: 'UserLogin',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const isGoogleLoading = ref(false);
    const isFormValid = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('success');

    const rules = {
      required: (v) => !!v || 'Trường này là bắt buộc',
    };

    const showSnackbar = (text, color = 'success') => {
      snackbarText.value = text;
      snackbarColor.value = color;
      snackbar.value = true;
    };

    const login = async () => {
      try {
        isLoading.value = true;

        // Lấy email từ username
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('username', username.value)
          .single();

        if (userError) throw new Error('Tên đăng nhập không tồn tại');

        // Đăng nhập bằng email và mật khẩu
        const { data, error } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: password.value,
        });

        if (error) throw new Error('Mật khẩu không chính xác');

        // Kiểm tra xác nhận email
        if (data.user && !data.user.email_confirmed_at) {
          showSnackbar('Vui lòng xác nhận email của bạn trước khi đăng nhập.', 'warning');
          router.push({ 
            name: 'ConfirmRegistration',
            params: { email: data.user.email }
          });
          return;
        }

        // Kiểm tra và cập nhật role nếu cần
        await ensureUserRole(data.user.id);

        showSnackbar('Đăng nhập thành công!', 'success');
        router.push('/'); // Chuyển đến trang user chính
      } catch (error) {
        console.error('Lỗi đăng nhập:', error.message);
        showSnackbar(error.message, 'error');
      } finally {
        isLoading.value = false;
      }
    };

    const signInWithGoogle = async () => {
      try {
        isGoogleLoading.value = true;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        // Không cần xử lý chuyển hướng ở đây vì nó sẽ được xử lý bởi Supabase OAuth
      } catch (error) {
        console.error('Lỗi đăng nhập Google:', error.message);
        showSnackbar('Có lỗi khi đăng nhập bằng Google.', 'error');
      } finally {
        isGoogleLoading.value = false;
      }
    };

    const ensureUserRole = async (userId) => {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // Nếu không tìm thấy user hoặc có lỗi, tạo mới với role 'user'
        await supabase
          .from('users')
          .upsert({ id: userId, role: 'user' });
      } else if (data.role !== 'user') {
        // Nếu role khác 'user', cập nhật thành 'user'
        await supabase
          .from('users')
          .update({ role: 'user' })
          .eq('id', userId);
      }
    };

    const goToAdminLogin = () => {
      router.push('/admin-login');
    };

    return {
      username,
      password,
      isLoading,
      isGoogleLoading,
      isFormValid,
      snackbar,
      snackbarText,
      snackbarColor,
      rules,
      login,
      signInWithGoogle,
      goToAdminLogin,
    };
  },
};
</script>