<template>
  <BaseInfoPage
    title="Sản Phẩm"
    cardTitle="Xem hồ sơ sản phẩm của bạn"
    :cardDescription="cardDescription"
    fileName="san-pham"
    placeholder="Nhập thông tin sản phẩm của bạn..."
  />
</template>

<script>
import BaseInfoPage from '@/components/BaseInfoPage.vue';

export default {
  name: 'ProductsPage',
  components: {
    BaseInfoPage
  },
  setup() {
    const cardDescription = "Xem lại hồ sơ đã lưu và chỉnh sửa hay cập nhật thêm các thông tin mới nhất về các sản phẩm nghiên cứu, kết quả ứng dụng và thương mại hóa của bạn.";

    return {
      cardDescription
    };
  }
};
</script>

