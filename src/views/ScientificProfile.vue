<template>
  <v-container class="scientific-profile py-8">
    <v-row>
      <v-col cols="12" class="text-center mb-8">
        <h1 class="text-h2 font-weight-bold mb-4">Hồ Sơ Khoa Học</h1>
        <p class="text-h5 text-medium-emphasis">Thông tin hồ sơ khoa học của bạn</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="(item, index) in profileItems" :key="index">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 8 : 2"
            :class="{ 'on-hover': isHovering }"
            @click="navigateTo(item.path)"
            class="mx-auto pa-4 d-flex flex-column align-center justify-center transition-swing"
            height="200"
          >
            <v-icon :icon="item.icon" size="large" class="mb-4" :color="item.color"></v-icon>
            <v-card-title class="text-center">{{ item.name }}</v-card-title>
            <v-card-subtitle class="text-center">{{ item.description }}</v-card-subtitle>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: "ScientificProfile",
  setup() {
    const router = useRouter();

    const profileItems = ref([
      { name: "Thông Tin Cá Nhân", description: "Cập nhật thông tin cá nhân", path: "/personal-info", icon: "mdi-account", color: "blue" },
      { name: "Quá Trình Đào Tạo", description: "Thông tin về quá trình đào tạo", path: "/education", icon: "mdi-school", color: "green" },
      { name: "Quá Trình Công Tác", description: "Thông tin về quá trình công tác", path: "/work-process", icon: "mdi-briefcase", color: "orange" },
      { name: "Dự Án Nghiên Cứu", description: "Danh sách các dự án nghiên cứu", path: "/research-projects", icon: "mdi-flask", color: "purple" },
      { name: "Công Bố Khoa Học", description: "Thông tin công bố khoa học", path: "/scientific-publications", icon: "mdi-book-open-page-variant", color: "red" },
      { name: "Bằng Sáng Chế", description: "Danh sách các bằng sáng chế", path: "/patents", icon: "mdi-certificate", color: "teal" },
      { name: "Hợp Tác Nghiên Cứu", description: "Thông tin hợp tác nghiên cứu", path: "/research-collaboration", icon: "mdi-account-group", color: "indigo" },
      { name: "Cuộc Thi", description: "Danh sách các cuộc thi đã tham gia", path: "/contests", icon: "mdi-trophy", color: "amber" },
      { name: "Sản Phẩm", description: "Thông tin về sản phẩm nghiên cứu", path: "/products", icon: "mdi-package-variant-closed", color: "deep-purple" },
    ]);

    const navigateTo = (path) => {
      router.push(path);
    };

    return {
      profileItems,
      navigateTo,
    };
  },
};
</script>

<style scoped>
.scientific-profile {
  max-width: 1200px;
  margin: 0 auto;
}

.v-card {
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.v-card:hover {
  transform: translateY(-5px);
}

.on-hover {
  background-color: var(--v-primary-lighten5);
}
</style>

