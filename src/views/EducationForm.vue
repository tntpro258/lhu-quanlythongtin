<template>
  <BaseInfoPage
    title="Quá Trình Đào Tạo"
    cardTitle="Xem hồ sơ quá trình đào tạo của bạn"
    :cardDescription="cardDescription"
    fileName="qua-trinh-dao-tao"
    placeholder="Nhập thông tin quá trình đào tạo của bạn..."
  />
</template>

<script>
import BaseInfoPage from '@/components/BaseInfoPage.vue';

export default {
  name: 'TrainingPage',
  components: {
    BaseInfoPage
  },
  setup() {
    const cardDescription = "Xem lại hồ sơ đã lưu và chỉnh sửa hay cập nhật thêm các thông tin mới nhất về quá trình đào tạo, các khóa học và chương trình bồi dưỡng mà bạn đã tham gia.";

    return {
      cardDescription
    };
  }
};
</script>

