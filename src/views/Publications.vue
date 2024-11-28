<template>
  <BaseInfoPage
    title="Công Bố Khoa Học"
    cardTitle="Xem hồ sơ công bố khoa học của bạn"
    :cardDescription="cardDescription"
    fileName="cong-bo-khoa-hoc"
    placeholder="Nhập thông tin công bố khoa học của bạn..."
  />
</template>

<script>
import BaseInfoPage from '@/components/BaseInfoPage.vue';

export default {
  name: 'ScientificPublicationsPage',
  components: {
    BaseInfoPage
  },
  setup() {
    const cardDescription = "Xem lại hồ sơ đã lưu và chỉnh sửa hay cập nhật thêm các thông tin mới nhất về các công bố khoa học, bài báo, và nghiên cứu của bạn.";

    return {
      cardDescription
    };
  }
};
</script>

