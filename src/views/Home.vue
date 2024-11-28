<template>
  <v-container fluid class="home-page pa-4">
    <v-row>
      <v-col cols="12" class="text-center mb-6">
        <h1 class="text-h2 font-weight-bold">Hồ Sơ Khoa Học</h1>
        <p class="text-subtitle-1 mt-2">Tổng quan thông tin khoa học của bạn</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="item in infoItems" :key="item.title" cols="12" sm="6" md="4" lg="3">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 8 : 2"
            :class="{ 'on-hover': isHovering }"
            class="mx-auto card-transition"
          >
            <v-card-text class="text-center">
              <v-icon :icon="item.icon" size="64" :color="item.color" class="mb-4"></v-icon>
              <h2 class="text-h5 mb-2">{{ item.title }}</h2>
              <p class="mb-4">{{ item.description }}</p>
              <v-btn
                :to="item.route"
                color="primary"
                variant="tonal"
                block
              >
                Xem chi tiết
              </v-btn>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'HomePage',
  setup() {
    const infoItems = ref([
      {
        title: 'Thông Tin Cá Nhân',
        description: 'Thông tin cơ bản và liên hệ',
        icon: 'mdi-account',
        color: 'blue',
        route: '/personal-info'
      },
      {
        title: 'Quá Trình Học Vấn',
        description: 'Lịch sử học tập và bằng cấp',
        icon: 'mdi-school',
        color: 'green',
        route: '/education'
      },
      {
        title: 'Quá Trình Đào Tạo',
        description: 'Các khóa học và chương trình bồi dưỡng',
        icon: 'mdi-teach',
        color: 'deep-purple',
        route: '/training'
      },
      {
        title: 'Quá Trình Công Tác',
        description: 'Kinh nghiệm làm việc và vị trí',
        icon: 'mdi-briefcase',
        color: 'orange',
        route: '/work-experience'
      },
      {
        title: 'Dự Án Nghiên Cứu',
        description: 'Các dự án nghiên cứu đã tham gia',
        icon: 'mdi-flask',
        color: 'red',
        route: '/research-projects'
      },
      {
        title: 'Công Bố Khoa Học',
        description: 'Các bài báo và ấn phẩm khoa học',
        icon: 'mdi-book-open-page-variant',
        color: 'indigo',
        route: '/scientific-publications'
      },
      {
        title: 'Bằng Sáng Chế',
        description: 'Các bằng sáng chế đã đăng ký',
        icon: 'mdi-certificate',
        color: 'teal',
        route: '/patents'
      },
      {
        title: 'Hợp Tác Nghiên Cứu',
        description: 'Thông tin về hợp tác nghiên cứu',
        icon: 'mdi-account-group',
        color: 'cyan',
        route: '/research-collaboration'
      },
      {
        title: 'Cuộc Thi',
        description: 'Các cuộc thi khoa học đã tham gia',
        icon: 'mdi-trophy',
        color: 'amber',
        route: '/contests'
      },
      {
        title: 'Sản Phẩm',
        description: 'Sản phẩm nghiên cứu và ứng dụng',
        icon: 'mdi-package-variant-closed',
        color: 'brown',
        route: '/products'
      }
    ]);

    return {
      infoItems
    };
  }
};
</script>

<style scoped>
.home-page {
  background-color: #f5f5f5;
}

.card-transition {
  transition: all 0.3s ease-in-out;
}

.on-hover {
  transform: translateY(-5px);
}
</style>

