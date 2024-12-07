import { ref, onMounted, onBeforeUnmount } from 'vue';
import { saveAs } from 'file-saver';
import { supabase } from '@/supabase';
import mammoth from 'mammoth';
import { Document, Paragraph, TextRun, Packer } from 'docx';

export function useBaseInfo(props) {
  const content = ref('');
  const isSaving = ref(false);
  const isExporting = ref(false);
  const isUploading = ref(false);
  const uploadedFileName = ref('');
  const fullContentVisible = ref(false);
  const fullContent = ref('');
  const originalContent = ref('');
  const hasInteracted = ref(false);
  const isContentChanged = ref(false);
  const snackbar = ref(false);
  const snackbarText = ref('');
  const snackbarColor = ref('');

  onMounted(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showSnackbar('Vui lòng đăng nhập để tiếp tục.', 'error');
      return;
    }

    await loadFromSupabase();

    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  const handleBeforeUnload = (event) => {
    if (hasInteracted.value && isContentChanged.value) {
      event.preventDefault();
      event.returnValue = '';
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileName = `user-info/${user.id}/${props.fileName}`;
      const blob = new Blob([htmlContent], { type: 'text/html' });

      const { error } = await supabase.storage
        .from('user-info')
        .upload(fileName, blob, {
          contentType: 'text/html',
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;
      showSnackbar('Đã lưu nội dung thành công!', 'success');
      originalContent.value = content.value;
      isContentChanged.value = false;
    } catch (error) {
      console.error('Error saving to Supabase:', error.message);
      showSnackbar(`Có lỗi xảy ra khi lưu: ${error.message}`, 'error');
    } finally {
      isSaving.value = false;
    }
  };

  const exportToHTML = async () => {
    try {
      isExporting.value = true;
      const htmlContent = content.value;

      const blob = new Blob([
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
      `
      ], { type: 'text/html' });

      saveAs(blob, `${props.fileName}.html`);

      showSnackbar('Đã tải file HTML thành công! Bạn có thể mở file này bằng Chrome', 'success');
    } catch (error) {
      console.error('Error exporting to HTML:', error.message);
      showSnackbar(`Có lỗi xảy ra khi tải file: ${error.message}`, 'error');
    } finally {
      isExporting.value = false;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      showSnackbar('Chưa chọn file. Vui lòng thử lại.', 'error');
      return;
    }

    try {
      isUploading.value = true;
      uploadedFileName.value = file.name;

      const arrayBuffer = await file.arrayBuffer();
      const { value: html, messages } = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: [
            'p[style-name=\'Heading 1\'] => h1:fresh',
            'p[style-name=\'Heading 2\'] => h2:fresh',
            'p[style-name=\'Normal\'] => p:fresh',
          ],
        }
      );

      if (messages.length > 0) {
        console.warn('Mammoth warnings:', messages);
      }

      content.value = html;
      hasInteracted.value = true;
      isContentChanged.value = true;
      showSnackbar('File đã được tải lên và nội dung đã được cập nhật!', 'success');
    } catch (error) {
      console.error('Error processing file:', error.message);
      showSnackbar(`Có lỗi xảy ra khi xử lý file: ${error.message}`, 'error');
    } finally {
      isUploading.value = false;
    }
  };

  const loadFromSupabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileName = `user-info/${user.id}/${props.fileName}`;
      const { data, error } = await supabase.storage
        .from('user-info')
        .download(fileName);

      if (error) {
        if (error.message === 'The resource was not found') {
          console.log('No file found. Starting with empty content.');
          showSnackbar('Không tìm thấy dữ liệu. Bắt đầu với nội dung trống.', 'info');
          return;
        }
        throw error;
      }

      const text = await data.text();
      content.value = text;
      originalContent.value = text;
      showSnackbar('Nội dung của bạn đã được tải lên kho dữ liệu!', 'success');
    } catch (error) {
      console.error('Error loading from Supabase:', error.message);
      showSnackbar(`Lỗi khi tải nội dung từ Supabase: ${error.message}`, 'error');
    }
  };

  const copyToWord = async () => {
    try {
      isExporting.value = true;
      const htmlContent = content.value;

      // Simple HTML to docx conversion
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(htmlContent.replace(/<[^>]*>/g, ''))],
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${props.fileName}.docx`);

      showSnackbar('Nội dung đã được xuất ra file Word thành công!', 'success');
    } catch (error) {
      console.error('Error exporting to Word:', error.message);
      showSnackbar(`Có lỗi xảy ra khi xuất file: ${error.message}`, 'error');
    } finally {
      isExporting.value = false;
    }
  };

  const showSnackbar = (text, color) => {
    snackbarText.value = text;
    snackbarColor.value = color;
    snackbar.value = true;
  };

  return {
    content,
    isSaving,
    isExporting,
    isUploading,
    uploadedFileName,
    fullContentVisible,
    fullContent,
    snackbar,
    snackbarText,
    snackbarColor,
    saveToSupabase,
    exportToHTML,
    handleFileUpload,
    copyToWord,
    viewFullContent,
    handleContentChange,
  };
}

