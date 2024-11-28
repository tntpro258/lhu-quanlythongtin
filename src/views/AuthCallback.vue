<template>
    <v-container fluid class="auth-callback fill-height pa-0" style="min-height: 100vh;">
      <v-row align="center" justify="center" class="fill-height ma-0">
        <v-col cols="12" class="pa-0">
          <v-card flat tile class="fill-height d-flex flex-column justify-center align-center">
            <v-card-title class="text-h2 font-weight-bold mb-6">
              Đang xử lý xác thực
            </v-card-title>
            <v-card-text>
              <div class="loading-animation mb-8">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
              </div>
              <p class="text-h4 text-center">Vui lòng đợi trong giây lát...</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { supabase } from '@/supabase'
  
  export default {
    name: 'AuthCallback',
    setup() {
      const router = useRouter()
  
      onMounted(async () => {
        try {
          const { data, error } = await supabase.auth.getSession()
          if (error) throw error
  
          if (data?.session) {
            // Xác thực thành công
            if (data.session.user.email_confirmed_at) {
              // Email đã được xác nhận
              router.push('/')
            } else {
              // Email chưa được xác nhận
              router.push({
                name: 'ConfirmRegistration',
                params: { email: data.session.user.email }
              })
            }
          } else {
            // Không có phiên đăng nhập, chuyển hướng đến trang đăng nhập
            router.push('/login')
          }
        } catch (error) {
          console.error('Lỗi xử lý callback:', error)
          router.push('/login')
        }
      })
    }
  }
  </script>
  
  <style scoped>
  .auth-callback {
    background-color: #f5f5f5;
  }
  
  .loading-animation {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .v-card {
    background-color: transparent !important;
    box-shadow: none !important;
  }
  </style>
  
  