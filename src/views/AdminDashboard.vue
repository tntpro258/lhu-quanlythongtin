<template>
  <v-container fluid>
    <v-card class="elevation-2 pa-4">
      <v-card-title class="text-h4 mb-4">
        Quản lý người dùng
        <v-spacer></v-spacer>
        <v-btn v-if="isAdmin" color="primary" @click="openDialog" prepend-icon="mdi-plus">
          Thêm người dùng
        </v-btn>
      </v-card-title>

      <!-- Bảng danh sách người dùng -->
      <v-data-table
        v-if="users.length > 0"
        :headers="headers"
        :items="users"
        :items-per-page="10"
        class="elevation-1"
      >
        <!-- Tô màu vai trò -->
        <template v-slot:[`item.role`]="{ item }">
          <v-chip
            :color="item.role === 'ADMIN' ? 'red lighten-2' : 'blue lighten-2'"
            dark
          >
            {{ item.role.toUpperCase() }}
          </v-chip>
        </template>

        <!-- Các nút thao tác -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon color="info" @click="viewProfile(item)" class="mr-2">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            v-if="isAdmin"
            icon
            color="warning"
            @click="editItem(item)"
            class="mr-2"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="isAdmin"
            icon
            color="error"
            @click="deleteItem(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Hộp thoại Thêm/Chỉnh sửa người dùng -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 bg-primary text-white">
          {{ formTitle }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Tên đăng nhập"
                  prepend-icon="mdi-account"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.email"
                  label="Email"
                  prepend-icon="mdi-email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.role"
                  :items="['USER', 'ADMIN']"
                  label="Vai trò"
                  prepend-icon="mdi-shield-account"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="!editedItem.id">
                <v-text-field
                  v-model="editedItem.password"
                  label="Mật khẩu"
                  type="password"
                  prepend-icon="mdi-lock"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">Hủy</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Hộp thoại xác nhận xóa -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 bg-error text-white">
          Xác nhận xóa
        </v-card-title>
        <v-card-text class="pt-4">
          Bạn có chắc chắn muốn xóa người dùng này?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Hủy
          </v-btn>
          <v-btn color="error" variant="text" @click="confirmDelete">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase";

export default {
  name: "UserManagement",
  setup() {
    const router = useRouter();
    const dialog = ref(false);
    const deleteDialog = ref(false);
    const formTitle = ref("Thêm người dùng");
    const users = ref([]);
    const isAdmin = ref(false);
    const headers = [
      { title: "Tên đăng nhập", align: "start", key: "name" },
      { title: "Email", align: "start", key: "email" },
      { title: "Vai trò", align: "start", key: "role" },
      { title: "Thao tác", align: "center", key: "actions", sortable: false },
    ];
    const editedItem = ref({
      id: null,
      name: "",
      email: "",
      role: "USER",
      password: "",
    });
    const defaultItem = {
      id: null,
      name: "",
      email: "",
      role: "USER",
      password: "",
    };
    const editedIndex = ref(-1);
    const userToDelete = ref(null);

    const fetchUsers = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        const { data, error } = await supabase.from("users").select("*");
        if (error) throw error;
        users.value = data;

        // Check if the logged-in user is an admin
        const currentUser = await supabase.from("users").select("role").eq("id", user.id).single();
        if (currentUser.data.role === 'ADMIN') {
          isAdmin.value = true;
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    const openDialog = () => {
      editedItem.value = { ...defaultItem };
      formTitle.value = "Thêm người dùng";
      dialog.value = true;
    };

    const close = () => {
      dialog.value = false;
      editedItem.value = { ...defaultItem };
      editedIndex.value = -1;
    };

    const save = async () => {
      try {
        if (editedItem.value.id) {
          const { error } = await supabase
            .from("users")
            .update(editedItem.value)
            .eq("id", editedItem.value.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("users")
            .insert(editedItem.value);
          if (error) throw error;
        }
        await fetchUsers();
        close();
      } catch (error) {
        console.error("Lỗi khi lưu người dùng:", error);
      }
    };

    const editItem = (item) => {
      editedIndex.value = users.value.indexOf(item);
      editedItem.value = { ...item };
      formTitle.value = "Chỉnh sửa người dùng";
      dialog.value = true;
    };

    const deleteItem = (item) => {
      userToDelete.value = item;
      deleteDialog.value = true;
    };

    const confirmDelete = async () => {
      try {
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", userToDelete.value.id);
        if (error) throw error;
        await fetchUsers();
        deleteDialog.value = false;
        userToDelete.value = null;
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
      }
    };

    const viewProfile = (item) => {
      router.push({ name: "UserProfile", params: { id: item.id } });
    };

    onMounted(fetchUsers);

    return {
      dialog,
      deleteDialog,
      formTitle,
      users,
      isAdmin,
      headers,
      editedItem,
      editedIndex,
      openDialog,
      close,
      save,
      editItem,
      deleteItem,
      confirmDelete,
      viewProfile,
    };
  },
};
</script>
