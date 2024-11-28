<template>
  <BaseInfoPage
    title="Bằng Sáng Chế"
    cardTitle="Xem hồ sơ bằng sáng chế của bạn"
    :cardDescription="cardDescription"
    fileName="bang-sang-che"
    placeholder="Nhập thông tin bằng sáng chế của bạn..."
  />
</template>

<script>
import BaseInfoPage from '@/components/BaseInfoPage.vue';

export default {
  name: 'PatentsPage',
  components: {
    BaseInfoPage
  },
  setup() {
    const cardDescription = "Xem lại hồ sơ đã lưu và chỉnh sửa hay cập nhật thêm các thông tin mới nhất về các bằng sáng chế mà bạn đã đăng ký hoặc được cấp.";

    return {
      cardDescription
    };
  }
};
</script>

