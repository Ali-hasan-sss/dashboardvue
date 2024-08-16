<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- List -->
        <SettingsForm
          newItemLabel="الإعدادات"
          :isNew="isNew"
          :api="api"
          @openForm="dialog_form = true"
        />

        <!-- Form -->
        <v-dialog v-model="dialog_form" max-width="600px">
          <v-card>
            <v-card-title>
              <span>{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <!-- Fields for settings -->
                  <v-col
                    cols="12"
                    sm="6"
                    v-for="(field, index) in formFields"
                    :key="index"
                  >
                    <v-text-field
                      :label="field.label"
                      v-model="form[field.key]"
                      :rules="[field.required ? (v) => !!v || 'مطلوب' : '']"
                    />
                  </v-col>

                  <!-- Image upload and reordering -->
                  <v-col cols="12">
                    <v-file-input
                      label="إضافة الصور"
                      multiple
                      v-model="images"
                      @change="handleImageUpload"
                    />
                    <draggable
                      v-model="images"
                      class="drag-area"
                      @end="handleImageReorder"
                    >
                      <div
                        v-for="image in images"
                        :key="image.name"
                        class="drag-image"
                      >
                        <v-img :src="image.url" />
                      </div>
                    </draggable>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="dialog_form = false">إلغاء</v-btn>
              <v-btn color="blue darken-1" @click="save">حفظ</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SettingsForm from "../../components/Forms/SettingsForm.vue";
import draggable from "vuedraggable"; // استيراد مكتبة السحب والإفلات

export default {
  data() {
    return {
      isNew: false,
      dialog_form: false,
      images: [], // قائمة الصور
      api: {
        getAll: "systemVariables",
        edit: "updateSystemVariable",
      },
      formFields: [
        {
          label: "كلمة المرور النظامية",
          key: "system_password",
          required: true,
        },
        // إضافة الحقول الأخرى هنا...
      ],
    };
  },
  components: { SettingsForm, draggable }, // إضافة مكون draggable
  methods: {
    setForm() {
      this.form = {
        system_password: 0,
        days_of_contract_expiration_to_notify: 0,
        days_of_estate_order_to_delete: 0,
        maximum_count_of_estate_images: 0,
        maximum_count_of_floor_plan_images: 0,
        maximum_count_of_nearby_places: 0,
        maximum_count_of_street_images: 0,
        minimum_count_of_estate_images_to_publish: 0,
        minimum_count_of_street_images_to_publish: 0,
        normal_company_phone_number: 0,
        permanent_company_phone_number: 0,
        search_radius: 0,
        summer_estates_status: 0,
      };
      this.dialog_form = true;
    },
    handleImageUpload(event) {
      // تحميل الصور المرفوعة ومعالجتها
      this.images = event.target.files.map((file) => {
        return {
          name: file.name,
          url: URL.createObjectURL(file),
        };
      });
    },
    handleImageReorder() {
      // معالجة ترتيب الصور بعد السحب والإفلات
      console.log("تم إعادة ترتيب الصور", this.images);
    },
    save() {
      // عملية حفظ البيانات مع الصور
      const formData = new FormData();
      for (let field in this.form) {
        formData.append(field, this.form[field]);
      }
      this.images.forEach((image) => {
        formData.append("images[]", image);
      });

      // إرسال البيانات إلى السيرفر عبر API
      this.$store.dispatch("sendForm", {
        api: this.api,
        form: formData,
        isNew: this.isNew,
      });
      this.dialog_form = false;
    },
  },
  mounted() {
    this.setForm();
  },
};
</script>

<style scoped>
.drag-area {
  display: flex;
  flex-wrap: wrap;
}
.drag-image {
  width: 100px;
  height: 100px;
  margin: 10px;
}
</style>
