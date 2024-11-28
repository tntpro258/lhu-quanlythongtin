<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Thông Tin Cá Nhân</v-card-title>
          <v-card-text>
            <v-form v-model="valid" @submit.prevent="savePersonalInfo">
              <v-text-field
                v-model="personalInfo.full_name"
                label="Họ Tên"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                v-model="personalInfo.email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>

              <v-text-field
                v-model="personalInfo.phone_number"
                label="Số Điện Thoại"
                type="tel"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                v-model="personalInfo.address"
                label="Địa Chỉ"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                v-model="personalInfo.current_job"
                label="Công Việc Hiện Tại"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                v-model="personalInfo.workplace"
                label="Nơi Làm Việc"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-textarea
                v-model="personalInfo.other"
                label="Khác"
                rows="3"
                :rules="[rules.required]"
              ></v-textarea>

              <v-btn type="submit" color="primary" :disabled="!valid || isLoading" :loading="isLoading">
                Lưu vào Database
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { supabase } from '@/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const valid = ref(false);
const isLoading = ref(false);

const personalInfo = reactive({
  full_name: '',
  email: '',
  phone_number: '',
  address: '',
  current_job: '',
  workplace: '',
  other: '',
});

const rules = {
  required: (value) => !!value || 'Trường này là bắt buộc',
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Email không hợp lệ';
  },
};

const loadPersonalInfo = async () => {
  try {
    isLoading.value = true;
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này!');
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('Không tìm thấy thông tin cá nhân, có thể đây là người dùng mới.');
      } else {
        throw error;
      }
    }

    if (data) {
      Object.assign(personalInfo, data);
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu từ Supabase:', error);
    alert('Có lỗi xảy ra khi tải dữ liệu: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

const savePersonalInfo = async () => {
  if (!valid.value) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  try {
    isLoading.value = true;
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này!');
      router.push('/login');
      return;
    }

    const { error } = await supabase
      .from('personal_info')
      .upsert({
        user_id: user.id,
        ...personalInfo
      });

    if (error) throw error;
    alert('Thông tin cá nhân đã được lưu vào Supabase!');
  } catch (error) {
    console.error('Lỗi khi lưu vào Supabase:', error);
    alert('Có lỗi xảy ra khi lưu dữ liệu: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadPersonalInfo();
});
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}
</style>