<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col cols="12" md="6">أنواع الملكية</v-col>
      <v-col>
        <!-- شريط البحث وزر إضافة نوع ملكية -->
        <v-row>
          <!-- حقل البحث -->
          <v-col cols="6" md="8">
            <v-text-field
              v-model="searchQuery"
              label="بحث بالاسم"
              append-icon="mdi-magnify"
              single-line
              clearable
              @input="filterEstateTypes"
            ></v-text-field>
          </v-col>
          <!-- زر إضافة نوع ملكية -->
          <v-col cols="6" md="4" class="d-flex align-center justify-center">
            <v-btn
              @click="openFormDialog(null)"
              color="primary"
              style="margin-bottom: 10px"
            >
              إضافة نوع ملكية
            </v-btn>
          </v-col>
        </v-row>

        <!-- قائمة الأنواع -->
        <v-data-table
          :headers="headers"
          :items="filteredEstateTypes"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:body>
            <draggable
              v-model="estateTypes"
              handle=".drag-handle"
              @end="onDragEnd"
              tag="tbody"
            >
              <tr v-for="item in filteredEstateTypes" :key="item.id">
                <td>
                  <v-icon
                    small
                    class="drag-handle"
                    style="cursor: move; margin-right: 5px"
                  >
                    mdi-drag
                  </v-icon>
                  {{ item.id }}
                </td>
                <td>{{ item.name_ar }}</td>
                <td>{{ item.name_en }}</td>
                <td>
                  <v-switch
                    v-model="item.isActive"
                    @change="toggleActivation(item)"
                    :label="item.isActive ? 'مفعل' : 'معطل'"
                  ></v-switch>
                </td>
                <td>
                  <v-icon
                    small
                    color="green"
                    @click.stop="openFormDialog(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    small
                    color="red"
                    @click.stop="openDeleteConfirmDialog(item.id)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </draggable>
          </template>
        </v-data-table>

        <!-- نموذج التعديل والإضافة -->
        <v-dialog class="form" v-model="dialog_form" max-width="500px">
          <EstateTypeFormSingle
            :newItemLabel="'نوع ملكية'"
            :isNew="isNew"
            :initialData="initialData"
            @submitForm="handleFormSubmit"
            @dialogForm="dialog_form = false"
          ></EstateTypeFormSingle>
        </v-dialog>
        <v-dialog v-model="dialog_confirm_delete" max-width="400px">
          <v-card>
            <v-card-title class="headline">تأكيد الحذف</v-card-title>
            <v-card-text>هل أنت متأكد أنك تريد حذف هذا العنصر؟</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialog_confirm_delete = false"
                >إلغاء</v-btn
              >
              <v-btn color="red darken-1" text @click="confirmDeleteItem"
                >حذف</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EstateTypeFormSingle from "@/components/Forms/System Categories/EstateTypeFormSingle.vue";
import draggable from "vuedraggable";
import axios from "axios";

export default {
  components: { EstateTypeFormSingle, draggable },
  data() {
    return {
      isNew: true, // تحديد وضع الإدخال إلى true بشكل افتراضي
      dialog_form: false,
      currentFormData: { name_ar: "", name_en: "" },
      initialData: {},
      estateTypes: [],
      searchQuery: "",
      filteredEstateTypes: [],
      api: {
        getAll: "ownershipTypes",
        create: "newOwnershipType",
        update: "editOwnershipType",
        delete: "deleteOwnershipType",
        toggleActivation: "editOwnershipType",
        reorder: "reorderOwnershipTypes",
      },
      dialog_confirm_delete: false,
      itemIdToDelete: null,
      headers: [
        { text: "#", align: "start", sortable: false, value: "id" },
        {
          text: "الأسم بالعربي",
          align: "start",
          sortable: false,
          value: "name_ar",
        },
        {
          text: "الأسم بالإنجليزي",
          align: "start",
          sortable: false,
          value: "name_en",
        },
        {
          text: "الحالة",
          align: "center",
          sortable: false,
          value: "is_active",
        },
        { text: "العمليات", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    async fetchEstateTypes() {
      try {
        const response = await axios.get(this.api.getAll);
        if (response.data && Array.isArray(response.data.data)) {
          this.estateTypes = response.data.data.map((item) => ({
            ...item,
            // تحويل is_active إلى Boolean (false لـ "0" و true لـ "1")
            isActive: item.is_active === "1", // تحويل القيمة إلى Boolean
          }));
          this.filteredEstateTypes = this.estateTypes;
        } else {
          console.error("Unexpected data structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching estate types:", error);
        this.$toast.error("فشل في تحميل البيانات");
      }
    },
    openFormDialog(item = null) {
      this.isNew = !item;
      if (item) {
        this.currentFormData = { ...item }; // نقل البيانات بالكامل للتعديل
      } else {
        this.currentFormData = { name_ar: "", name_en: "" }; // إذا كانت حالة إضافة
      }
      this.initialData = { ...this.currentFormData };
      this.dialog_form = true;
    },

    async handleFormSubmit(formData) {
      try {
        const apiUrl = this.isNew ? this.api.create : this.api.update;
        let requestData = this.isNew
          ? formData
          : { ...formData, id: this.currentFormData.id };

        if (!requestData.id && !this.isNew) {
          this.$toast.error("الحقل id مطلوب .");
          return;
        }

        const response = this.isNew
          ? await axios.post(apiUrl, requestData)
          : await axios.put(apiUrl, requestData);

        console.log("Response:", response); // اعرض الاستجابة بشكل كامل

        // تحقق من حالة الاستجابة و عرض رسالة النجاح
        if (response.status === 200) {
          // في حال كانت البيانات فارغة، يمكن اعتبار الاستجابة ناجحة
          if (this.isNew) {
            this.$toast.success("تم إضافة البيانات بنجاح");
          } else {
            this.$toast.success("تم تعديل البيانات بنجاح");
          }

          this.dialog_form = false;

          // في حال كانت الإضافة جديدة، أضف العنصر المضاف إلى القائمة
          if (this.isNew) {
            this.estateTypes.push(response.data);
          }

          this.fetchEstateTypes(); // قم بتحديث البيانات بعد الحفظ
        } else {
          // في حال لم يكن status 200
          this.$toast.error("فشل في حفظ البيانات");
        }
      } catch (error) {
        console.error("Error saving form:", error);
        this.$toast.error("فشل في حفظ البيانات");
      }
    },
    async toggleActivation(item) {
      try {
        // تحويل القيمة إلى "1" إذا كانت true، و "0" إذا كانت false
        const updatedStatus = item.isActive ? "1" : "0"; // استخدام isActive هنا بعد التعديل

        // إرسال الطلب مع القيمة المعدلة
        await axios.put(this.api.toggleActivation, {
          id: item.id,
          is_active: updatedStatus,
        });

        // إعادة تحميل البيانات
        this.fetchEstateTypes();

        // عرض رسالة النجاح
        this.$toast.success("تم تحديث الحالة بنجاح");
      } catch (error) {
        console.error("Error toggling activation:", error);
        this.$toast.error("فشل في تحديث الحالة");
      }
    },
    openDeleteConfirmDialog(itemId) {
      this.itemIdToDelete = itemId; // حفظ المعرف العنصر الذي سيتم حذفه
      this.dialog_confirm_delete = true; // فتح نافذة التأكيد
    },

    async confirmDeleteItem() {
      try {
        // إرسال المعرف في جسم الطلب باستخدام data
        await axios.delete(this.api.delete, {
          data: { id: this.itemIdToDelete },
        });

        // إعادة تحميل البيانات بعد الحذف
        this.fetchEstateTypes();

        // عرض رسالة النجاح
        this.$toast.success("تم الحذف بنجاح");

        // إغلاق نافذة التأكيد
        this.dialog_confirm_delete = false;
      } catch (error) {
        console.error("Error deleting item:", error);
        this.$toast.error("فشل في الحذف");
      }
    },
    async onDragEnd() {
      try {
        const ownershipTypes = this.estateTypes.map((item, index) => ({
          id: item.id,
          order: index + 1,
        }));
        const response = await axios.put(this.api.update, { ownershipTypes });
        if (response.data?.success) {
          this.fetchEstateTypes();
          this.$toast.success("تم حفظ الترتيب الجديد بنجاح");
        } else {
          console.error("Failed response:", response);
        }
      } catch (error) {
        console.error("Error saving new order:", error);
      }
    },
    filterEstateTypes() {
      const query = this.searchQuery.trim().toLowerCase();
      this.filteredEstateTypes = query
        ? this.estateTypes.filter(
            (item) =>
              item.name_ar.toLowerCase().includes(query) ||
              item.name_en.toLowerCase().includes(query)
          )
        : this.estateTypes;
    },
  },

  mounted() {
    this.fetchEstateTypes();
  },
};
</script>
