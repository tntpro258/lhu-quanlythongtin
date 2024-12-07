<template>
  <v-container>
    <v-btn color="primary" @click="openDialog" class="mb-2">Thêm người dùng</v-btn>

    <v-data-table
      v-if="users.length > 0"
      :headers="headers"
      :items="users"
      item-key="id"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          class="mb-2"
          v-bind="attrs"
          v-on="on"
        >
          Thêm người dùng mới
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.username" label="Tên đăng nhập" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.email" label="Email" />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.role"
                  :items="['user', 'admin']"
                  label="Vai trò"
                />
              </v-col>
              <v-col cols="12" v-if="!editedItem.id">
                <v-text-field v-model="editedItem.password" label="Mật khẩu" type="password" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close">Hủy</v-btn>
          <v-btn color="blue darken-1" text @click="save">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/supabase.js'; // Đảm bảo file supabase.js đã được cấu hình

export default {
  name: 'MainComponent',
  data() {
    return {
      dialog: ref(false),
      formTitle: 'Thêm người dùng',
      users: ref([]),
      headers: [
        { text: 'Tên đăng nhập', align: 'start', key: 'username' },
        { text: 'Email', align: 'start', key: 'email' },
        { text: 'Vai trò', align: 'start', key: 'role' },
        { text: 'Actions', align: 'center', key: 'actions', sortable: false }
      ],
      editedItem: ref({
        id: null,
        username: '',
        email: '',
        role: 'user',
        password: ''
      }),
      editedIndex: ref(-1)
    };
  },
  methods: {
    async fetchUsers() {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      } else {
        this.users.value = data;
      }
    },
    openDialog() {
      this.editedItem.value = { id: null, username: '', email: '', role: 'user', password: '' };
      this.formTitle = 'Thêm người dùng';
      this.dialog.value = true;
    },
    close() {
      this.dialog.value = false;
    },
    async save() {
      try {
        let { error } = this.editedItem.value.id
          ? await supabase
              .from('users')
              .update(this.editedItem.value)
              .eq('id', this.editedItem.value.id)
          : await supabase
              .from('users')
              .insert(this.editedItem.value);
        if (error) {
          console.error('Lỗi khi lưu:', error);
        } else {
          this.fetchUsers();
          this.close();
        }
      } catch (err) {
        console.error('Lỗi khi lưu người dùng:', err);
      }
    },
    editItem(item) {
      this.editedIndex.value = this.users.value.indexOf(item);
      this.editedItem.value = { ...item };
      this.formTitle = 'Chỉnh sửa người dùng';
      this.dialog.value = true;
    },
    async deleteItem(item) {
      if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        try {
          const { error } = await supabase.from('users').delete().eq('id', item.id);
          if (error) {
            console.error('Lỗi khi xóa người dùng:', error);
          } else {
            this.fetchUsers();
          }
        } catch (error) {
          console.error('Lỗi khi xóa:', error);
        }
      }
    }
  },
  onMounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
</style>
