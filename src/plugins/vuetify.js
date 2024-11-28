import 'vuetify/styles'; // Import các style mặc định
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'


export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
  theme: {
    defaultTheme: 'lhTheme', // Đặt theme mặc định
    themes: {
      lhTheme: {
        dark: false, // Chọn chế độ sáng
        colors: {
          primary: '#003399', // Màu chính (xanh dương)
          secondary: '#FF0000', // Màu phụ (đỏ)
          accent: '#FFFFFF', // Màu nhấn (trắng)
          background: '#F5F5F5', // Màu nền sáng
          error: '#b00020', // Màu lỗi
          success: '#4CAF50', // Màu thành công
        },
      },
    },
  },
});
