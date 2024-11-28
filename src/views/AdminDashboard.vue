<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="openAddUserDialog" class="mb-4">
          Thêm người dùng
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Quản lý người dùng</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Tìm kiếm người dùng"
              append-icon="mdi-magnify"
              single-line
              hide-details
              class="mb-4"
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="filteredUsers"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Tất cả người dùng</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-pagination
                    v-model="page"
                    :length="Math.ceil(filteredUsers.length / 5)"
                    class="mt-2"
                  ></v-pagination>
                </v-toolbar>
              </template>

              <template v-slot:[`item.name`]="{ item }">
                {{ item.name }}
              </template>
              <template v-slot:[`item.email`]="{ item }">
                {{ item.email }}
              </template>
              <template v-slot:[`item.role`]="{ item }">
                <v-chip :color="getRoleColor(item.role)" dark>
                  {{ item.role }}
                </v-chip>
              </template>
              <template v-slot:[`item.created_at`]="{ item }">
                {{ new Date(item.created_at).toLocaleDateString() }}
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>

            <v-alert v-if="!filteredUsers.length" type="info" color="info">
              Không có dữ liệu người dùng
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog thêm người dùng -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Thêm người dùng mới</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <v-text-field
              v-model="newUser.name"
              label="Tên"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-text-field
              v-model="newUser.email"
              label="Email"
              :rules="[rules.required, rules.email]"
              required
            ></v-text-field>

            <v-text-field
              v-model="newUser.password"
              label="Mật khẩu"
              type="password"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="closeAddUserDialog">Hủy</v-btn>
          <v-btn color="primary" @click="addUser" :disabled="!isFormValid">
            Thêm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { mdiPencil, mdiDelete, mdiMagnify } from "@mdi/js";
import { supabase } from "@/supabase"; // Import Supabase client

export default {
  name: "AdminDashboard",
  setup() {
    const users = ref([]);
    const dialog = ref(false);
    const newUser = ref({
      name: "",
      email: "",
      password: "",
    });
    const isFormValid = ref(false);
    const search = ref("");
    const page = ref(1);

    const headers = [
      { text: "Tên", align: "start", value: "name", sortable: true },
      { text: "Email", value: "email", sortable: true },
      { text: "Vai trò", value: "role", sortable: true },
      { text: "Ngày tạo", value: "created_at", sortable: true },
      { text: "Actions", value: "actions", sortable: false }
    ];

    const rules = {
      required: (v) => !!v || "Trường này là bắt buộc",
      email: (v) => /.+@.+\..+/.test(v) || "Email không hợp lệ",
    };

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, name, email, role, created_at");

        if (error) throw error;

        users.value = data;
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    const getRoleColor = (role) => {
      switch (role) {
        case "ADMIN":
          return "red";
        case "USER":
        default:
          return "green";
      }
    };

    const openAddUserDialog = () => {
      dialog.value = true;
    };

    const closeAddUserDialog = () => {
      dialog.value = false;
      newUser.value = { name: "", email: "", password: "" }; // Reset form
    };

    const addUser = async () => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: newUser.value.email,
          password: newUser.value.password,
        });

        if (error) throw error;

        const { error: dbError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            name: newUser.value.name,
            email: newUser.value.email,
            role: "USER", // Default role
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (dbError) throw dbError;

        closeAddUserDialog();
        fetchUsers(); // Refresh the list of users
        console.log("User added successfully");
      } catch (error) {
        console.error("Error adding user:", error.message);
      }
    };

    const editItem = (item) => {
      // Logic to handle editing the user
      console.log("Editing item:", item);
    };

    const deleteItem = async (item) => {
      try {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
          const { error: authError } = await supabase.auth.api.deleteUser(item.id);
          if (authError) throw authError;

          const { error: dbError } = await supabase.from("users").delete().eq("id", item.id);
          if (dbError) throw dbError;

          fetchUsers(); // Refresh the list of users
          console.log("User deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting user:", error.message);
      }
    };

    const filteredUsers = computed(() => {
      return users.value.filter(
        (user) =>
          user.name.toLowerCase().includes(search.value.toLowerCase()) ||
          user.email.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    // Fetch users on component mount
    onMounted(fetchUsers);

    return {
      users,
      headers,
      dialog,
      newUser,
      isFormValid,
      rules,
      getRoleColor,
      fetchUsers,
      openAddUserDialog,
      closeAddUserDialog,
      addUser,
      editItem,
      deleteItem,
      search,
      filteredUsers,
      page,
      mdiPencil,
      mdiDelete,
      mdiMagnify
    };
  },
};
</script>

<style scoped>
/* Add custom styles for the Admin Dashboard */
</style>
