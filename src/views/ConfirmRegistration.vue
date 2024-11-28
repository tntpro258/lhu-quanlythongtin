<template>
    <v-container fluid class="confirm-registration fill-height pa-0" style="min-height: 100vh;">
      <v-row align="center" justify="center" class="fill-height ma-0">
        <v-col cols="12" class="pa-0">
          <v-card flat tile class="fill-height d-flex flex-column justify-center align-center">
            <v-card-title class="text-h2 font-weight-bold mb-6">
              Xác nhận đăng ký
            </v-card-title>
            <v-card-text>
              <div class="loading-animation mb-8">
                <svg width="240" height="60" viewBox="0 0 240 60" xmlns="http://www.w3.org/2000/svg" fill="#1976D2">
                  <circle cx="30" cy="30" r="30">
                    <animate attributeName="r" from="30" to="30" begin="0s" dur="1s" values="30;18;30" calcMode="linear" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="1s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
                  </circle>
                  <circle cx="120" cy="30" r="18" fill-opacity="0.3">
                    <animate attributeName="r" from="18" to="18" begin="0s" dur="1s" values="18;30;18" calcMode="linear" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="1s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" />
                  </circle>
                  <circle cx="210" cy="30" r="30">
                    <animate attributeName="r" from="30" to="30" begin="0s" dur="1s" values="30;18;30" calcMode="linear" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="1s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
              <p class="text-h4 text-center">Đang xác nhận đăng ký...</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { supabase } from '@/supabase'
  
  export default {
    name: 'ConfirmRegistration',
    setup() {
      const router = useRouter()
      const route = useRoute()
  
      onMounted(async () => {
        try {
          // Delay for 2 seconds to show the loading animation
          await new Promise(resolve => setTimeout(resolve, 2000))
  
          const { error } = await supabase.auth.verifyOtp({
            token_hash: route.hash.substring(1),
            type: 'signup'
          })
  
          if (error) throw error
  
          // Xác nhận đăng ký thành công, chuyển hướng đến trang đăng nhập
          router.push('/login')
        } catch (error) {
          console.error('Lỗi xác nhận đăng ký:', error)
          // Trong trường hợp lỗi, vẫn chuyển hướng đến trang đăng nhập
          router.push('/login')
        }
      })
    }
  }
  </script>
  
  <style scoped>
  .confirm-registration {
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
  
  