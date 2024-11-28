<template>
  <BaseInfoPage
    title="Cuộc Thi"
    cardTitle="Xem hồ sơ cuộc thi của bạn"
    :cardDescription="cardDescription"
    fileName="cuoc-thi"
    placeholder="Nhập thông tin cuộc thi bạn đã tham gia..."
  />
</template>

<script>
import BaseInfoPage from '@/components/BaseInfoPage.vue';

export default {
  name: 'ContestsPage',
  components: {
    BaseInfoPage
  },
  setup() {
    const cardDescription = "Xem lại hồ sơ đã lưu và chỉnh sửa hay cập nhật thêm các thông tin mới nhất về các cuộc thi khoa học và công nghệ mà bạn đã tham gia.";

    return {
      cardDescription
    };
  }
};
</script>

