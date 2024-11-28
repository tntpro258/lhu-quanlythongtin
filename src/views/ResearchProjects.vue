<template>
  <BaseInfoPage
    title="Dự Án Nghiên Cứu"
    cardTitle="Xem hồ sơ dự án nghiên cứu của bạn"
    :cardDescription="cardDescription"
    fileName="du-an-nghien-cuu"
    placeholder="Nhập thông tin dự án nghiên cứu của bạn..."
  />
</template>

<script>
import BaseInfoPage from '@/components/BaseInfoPage.vue';

export default {
  name: 'ResearchProjectsPage',
  components: {
    BaseInfoPage
  },
  setup() {
    const cardDescription = "Xem lại hồ sơ đã lưu và chỉnh sửa hay cập nhật thêm các thông tin mới nhất về các dự án nghiên cứu mà bạn đã và đang tham gia.";

    return {
      cardDescription
    };
  }
};
</script>

