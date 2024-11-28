<template>
  <BaseInfoPage
    title="Hợp Tác Nghiên Cứu"
    cardTitle="Xem hồ sơ hợp tác nghiên cứu của bạn"
    :cardDescription="cardDescription"
    fileName="hop-tac-nghien-cuu"
    placeholder="Nhập thông tin hợp tác nghiên cứu của bạn..."
  />
</template>

<script>
import BaseInfoPage from '@/components/BaseInfoPage.vue';

export default {
  name: 'ResearchCollaborationPage',
  components: {
    BaseInfoPage
  },
  setup() {
    const cardDescription = "Xem lại hồ sơ đã lưu và chỉnh sửa hay cập nhật thêm các thông tin mới nhất về các dự án hợp tác, đối tác nghiên cứu và kết quả đạt được.";

    return {
      cardDescription
    };
  }
};
</script>

