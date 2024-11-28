<template>
  <v-container class="py-4">
    <v-row>
      <v-col cols="12" class="text-center">
        <h2 class="text-h3 font-weight-bold">{{ title }}</h2>
      </v-col>
    </v-row>

    <v-row class="mx-auto">
      <v-col cols="12" md="7" class="mb-6">
        <v-card elevation="4" class="project-card rounded-lg shadow-lg">
          <v-card-title
            class="headline text-center font-weight-bold text-primary"
          >
            {{ cardTitle }}
          </v-card-title>
          <v-card-text>
            <p class="text-body-2 mb-4 text-center" style="font-size: 1.1rem">
              {{ cardDescription }}
            </p>
            <v-btn
              @click="viewFullContent"
              color="primary"
              class="d-flex align-center justify-center mx-auto mt-4"
              large
              width="250"
            >
              <v-icon left>mdi-eye</v-icon>
              Xem toàn bộ thông tin
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="5" class="mb-6">
        <v-card elevation="2" class="rounded-lg shadow-lg">
          <v-card-title class="font-weight-bold text-center text-primary">
            Tải lên file Word
          </v-card-title>
          <v-card-text>
            <v-file-input
              accept=".docx"
              label="Chọn hoặc kéo thả file Word (.docx)"
              prepend-icon="mdi-file-upload"
              @change="handleFileUpload"
              :loading="isUploading"
              :disabled="isUploading"
              class="mb-4"
            ></v-file-input>
          </v-card-text>
          <v-card-text v-if="uploadedFileName" class="text-center">
            <strong>File đã tải lên:</strong> {{ uploadedFileName }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="3" class="rounded-lg shadow-lg">
          <v-card-title class="headline text-center">
            Chỉnh sửa thông tin của bạn
          </v-card-title>
          <v-card-text>
            <QuillEditor
              v-model:content="content"
              :placeholder="placeholder"
              @update:content="handleContentChange"
            />
          </v-card-text>
          <v-card-actions class="d-flex justify-center mt-8 pt-8">
            <v-btn
              @click="saveToSupabase"
              color="primary"
              :loading="isSaving"
              :disabled="isSaving"
              class="mx-2"
              large
            >
              <v-icon left>mdi-content-save</v-icon>
              Lưu vào Database
            </v-btn>
            <v-btn
              @click="copyToWord"
              color="blue"
              :loading="isExporting"
              :disabled="isExporting"
              class="mx-2"
              large
            >
              <v-icon left>mdi-file-word</v-icon>
              Tải file Word
            </v-btn>
            <v-btn @click="exportToHTML" color="secondary" class="mx-2" large>
              <v-icon left>mdi-content-copy</v-icon>
              Sao chép nội dung HTML
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="fullContentVisible" max-width="100%">
      <v-card>
        <v-card-title>
          <span class="headline">Toàn bộ thông tin</span>
        </v-card-title>
        <v-card-actions>
          <v-btn @click="fullContentVisible = false" color="primary"
            >Đóng</v-btn
          >
        </v-card-actions>
        <v-card-text>
          <div v-html="fullContent"></div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="5000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="white" text @click="snackbar = false">Đóng</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { saveAs } from "file-saver";
import { supabase } from "@/supabase";
import mammoth from "mammoth";
import * as docx from "html-docx-js/dist/html-docx.js";
import { useNotifications } from "@/composables/useNotifications";
import QuillEditor from "@/components/QuillEditor.vue";

export default {
  name: "BaseInfoPage",
  components: {
    QuillEditor,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    cardTitle: {
      type: String,
      required: true,
    },
    cardDescription: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const content = ref("");
    const isSaving = ref(false);
    const isExporting = ref(false);
    const isUploading = ref(false);
    const uploadedFileName = ref("");
    const fullContentVisible = ref(false);
    const fullContent = ref("");
    const originalContent = ref("");
    const hasInteracted = ref(false);
    const isContentChanged = ref(false);

    const {
      snackbar,
      snackbarText,
      snackbarColor,
      showSnackbar,
      showLoginNotification,
      showEmptyDataNotification,
    } = useNotifications();

    onMounted(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        showLoginNotification();
        return;
      }

      await loadFromSupabase();

      window.addEventListener("beforeunload", handleBeforeUnload);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    });

    const handleBeforeUnload = (event) => {
      if (hasInteracted.value && isContentChanged.value) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    const handleContentChange = (newContent) => {
      content.value = newContent;
      hasInteracted.value = true;
      isContentChanged.value = content.value !== originalContent.value;
    };

    const viewFullContent = () => {
      fullContent.value = content.value;
      fullContentVisible.value = true;
    };

    const saveToSupabase = async () => {
      try {
        isSaving.value = true;
        const htmlContent = content.value;
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const fileName = `user-info/${user.id}/${props.fileName}`;
        const blob = new Blob([htmlContent], { type: "text/html" });

        const { error } = await supabase.storage
          .from("user-info")
          .upload(fileName, blob, {
            contentType: "text/html",
            cacheControl: "3600",
            upsert: true,
          });

        if (error) throw error;
        showSnackbar("Đã lưu nội dung thành công!", "success");
        originalContent.value = content.value;
        isContentChanged.value = false;
      } catch (error) {
        console.error("Error saving to Supabase:", error.message);
        showSnackbar(`Có lỗi xảy ra khi lưu: ${error.message}`, "error");
      } finally {
        isSaving.value = false;
      }
    };

    const exportToHTML = async () => {
      try {
        isExporting.value = true;
        const htmlContent = content.value;

        const blob = new Blob(
          [
            `
            <html>
              <head>
                <meta charset="utf-8">
                <title>${props.title}</title>
              </head>
              <body>
                ${htmlContent}
              </body>
            </html>
          `,
          ],
          { type: "text/html" }
        );

        saveAs(blob, `${props.fileName}.html`);

        showSnackbar(
          "Đã tải file HTML thành công! Bạn có thể mở file này bằng Chrome",
          "success"
        );
      } catch (error) {
        console.error("Error exporting to HTML:", error.message);
        showSnackbar(`Có lỗi xảy ra khi tải file: ${error.message}`, "error");
      } finally {
        isExporting.value = false;
      }
    };

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) {
        showSnackbar("Chưa chọn file. Vui lòng thử lại.", "error");
        return;
      }

      try {
        isUploading.value = true;
        uploadedFileName.value = file.name;

        const arrayBuffer = await file.arrayBuffer();
        const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

        content.value = html;
        hasInteracted.value = true;
        isContentChanged.value = true;
        showSnackbar(
          "File đã được tải lên và nội dung đã được cập nhật!",
          "success"
        );
      } catch (error) {
        console.error("Error processing file:", error.message);
        showSnackbar(`Có lỗi xảy ra khi xử lý file: ${error.message}`, "error");
      } finally {
        isUploading.value = false;
      }
    };

    const loadFromSupabase = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const fileName = `user-info/${user.id}/${props.fileName}`;
        const { data, error } = await supabase.storage
          .from("user-info")
          .download(fileName);

        if (error) {
          if (error.message === "The resource was not found") {
            console.log("No file found. Starting with empty content.");
            showEmptyDataNotification();
            return;
          }
          throw error;
        }

        const text = await data.text();
        content.value = text;
        originalContent.value = text;
        showSnackbar(
          "Nội dung của bạn đã được tải lên kho dữ liệu!",
          "success"
        );
      } catch (error) {
        console.error("Error loading from Supabase:", error.message);
        showSnackbar(
          `Lỗi khi tải nội dung từ Supabase: ${error.message}`,
          "error"
        );
      }
    };

    const copyToWord = () => {
      const htmlContent = content.value;

      const styledHtml = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Arial', 'Times New Roman', sans-serif;
              font-size: 12pt;
            }
            p {
              margin-bottom: 10pt;
              text-align: justify;
            }
            h1, h2, h3, h4, h5, h6 {
              font-weight: bold;
              margin-top: 12pt;
              margin-bottom: 6pt;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;

      const converted = docx.asBlob(styledHtml, {
        orientation: "portrait",
        margins: { top: 720, right: 720, bottom: 720, left: 720 },
      });

      saveAs(converted, `${props.fileName}.docx`);

      showSnackbar("Nội dung đã được xuất ra file Word thành công!", "success");
    };

    // Add a watch effect to update the QuillEditor when content changes
    watch(content, (newContent) => {
      if (newContent !== originalContent.value) {
        isContentChanged.value = true;
      }
    });

    return {
      content,
      isSaving,
      isExporting,
      isUploading,
      snackbar,
      snackbarText,
      snackbarColor,
      uploadedFileName,
      fullContentVisible,
      fullContent,
      saveToSupabase,
      exportToHTML,
      handleFileUpload,
      copyToWord,
      viewFullContent,
      handleContentChange,
    };
  },
};
</script>
