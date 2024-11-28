import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useNotifications() {
  const snackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref('')
  const router = useRouter()

  const showSnackbar = (message, color = 'info', timeout = 3000) => {
    snackbarText.value = message
    snackbarColor.value = color
    snackbar.value = true
    setTimeout(() => {
      snackbar.value = false
    }, timeout)
  }

  const showLoginNotification = () => {
    showSnackbar('Vui lòng đăng nhập để sử dụng trang này.', 'warning', 5000)
    router.push('/login') // Assuming you have a login route
  }


  const showEmptyDataNotification = () => {
    showSnackbar('Bạn chưa cập nhật thông tin nào. Hãy bắt đầu nhập dữ liệu!', 'info', 5000)
  }

  return {
    snackbar,
    snackbarText,
    snackbarColor,
    showSnackbar,
    showLoginNotification,
    showEmptyDataNotification
  }
}