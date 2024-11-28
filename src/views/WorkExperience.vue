<template>
  <BaseInfoPage
    title="Quá Trình Công Tác"
    cardTitle="Xem hồ sơ quá trình công tác của bạn"
    :cardDescription="cardDescription"
    fileName="qua-trinh-cong-tac"
    placeholder="Nhập thông tin quá trình công tác của bạn..."
  />
</template>

<script>
import BaseInfoPage from '@/components/BaseInfoPage.vue';

export default {
  name: 'WorkExperiencePage',
  components: {
    BaseInfoPage
  },
  setup() {
    const cardDescription = "Xem lại hồ sơ đã lưu và chỉnh sửa hay cập nhật thêm các thông tin mới nhất về quá trình công tác, vị trí làm việc và kinh nghiệm của bạn.";

    return {
      cardDescription
    };
  }
};
</script>
