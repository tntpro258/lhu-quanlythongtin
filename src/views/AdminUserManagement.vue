<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3 mb-5">Quản lý người dùng</h1>

        <!-- User list -->
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          class="elevation-1 mb-5"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Danh sách người dùng</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
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
                          <v-text-field
                            v-model="editedItem.username"
                            label="Tên đăng nhập"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.email"
                            label="Email"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="editedItem.role"
                            :items="['user', 'admin']"
                            label="Vai trò"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" v-if="!editedItem.id">
                          <v-text-field
                            v-model="editedItem.password"
                            label="Mật khẩu"
                            type="password"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Hủy</v-btn>
                    <v-btn color="blue darken-1" text @click="save">Lưu</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false"> Đóng </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { supabase } from "@/supabase";

export default {
  name: "AdminUserManagement",
  setup() {
    const users = ref([]);
    const loading = ref(true);
    const dialog = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");

    const headers = [
      { text: "ID", value: "id" },
      { text: "Tên đăng nhập", value: "username" },
      { text: "Email", value: "email" },
      { text: "Vai trò", value: "role" },
      { text: "Thao tác", value: "actions", sortable: false },
    ];

    const editedIndex = ref(-1);
    const editedItem = ref({
      id: "",
      username: "",
      email: "",
      role: "user",
      password: "",
    });
    const defaultItem = {
      id: "",
      username: "",
      email: "",
      role: "user",
      password: "",
    };

    const formTitle = computed(() => {
      return editedIndex.value === -1
        ? "Thêm người dùng mới"
        : "Chỉnh sửa người dùng";
    });

    const fetchUsers = async () => {
      try {
        loading.value = true;
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        users.value = data;
      } catch (error) {
        console.error("Error fetching users:", error);
        showSnackbar("Có lỗi xảy ra khi tải danh sách người dùng", "error");
      } finally {
        loading.value = false;
      }
    };

    const editItem = (item) => {
      editedIndex.value = users.value.indexOf(item);
      editedItem.value = Object.assign({}, item);
      dialog.value = true;
    };

    const deleteItem = async (item) => {
      if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        try {
          const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", item.id);

          if (error) throw error;

          const index = users.value.indexOf(item);
          users.value.splice(index, 1);
          showSnackbar("Người dùng đã được xóa thành công", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          showSnackbar("Có lỗi xảy ra khi xóa người dùng", "error");
        }
      }
    };

    const close = () => {
      dialog.value = false;
      editedItem.value = Object.assign({}, defaultItem);
      editedIndex.value = -1;
    };

    const save = async () => {
      try {
        if (editedIndex.value > -1) {
          // Updating existing user
          const { error } = await supabase
            .from("users")
            .update({
              username: editedItem.value.username,
              email: editedItem.value.email,
              role: editedItem.value.role,
            })
            .eq("id", editedItem.value.id);

          if (error) throw error;

          Object.assign(users.value[editedIndex.value], editedItem.value);
          showSnackbar("Người dùng đã được cập nhật thành công", "success");
        } else {
          // Adding new user
          const { data, error } = await supabase.auth.signUp({
            email: editedItem.value.email,
            password: editedItem.value.password,
            options: {
              data: {
                username: editedItem.value.username,
                role: editedItem.value.role,
              },
            },
          });

          if (error) throw error;

          // Inserting into users table after creating Supabase Auth user
          const { error: insertError } = await supabase
            .from("users")
            .insert({
              id: data.user.id,
              username: editedItem.value.username,
              email: editedItem.value.email,
              role: editedItem.value.role,
            });

          if (insertError) throw insertError;

          users.value.push({
            id: data.user.id,
            username: editedItem.value.username,
            email: editedItem.value.email,
            role: editedItem.value.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          showSnackbar("Người dùng mới đã được tạo thành công", "success");
        }

        close();
      } catch (error) {
        console.error("Lỗi khi lưu thông tin người dùng:", error);
        showSnackbar("Có lỗi xảy ra khi lưu thông tin người dùng", "error");
      }
    };

    const showSnackbar = (text, color) => {
      snackbarText.value = text;
      snackbarColor.value = color;
      snackbar.value = true;
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      loading,
      headers,
      dialog,
      editedIndex,
      editedItem,
      formTitle,
      snackbar,
      snackbarText,
      snackbarColor,
      editItem,
      deleteItem,
      close,
      save,
    };
  },
};
</script>
