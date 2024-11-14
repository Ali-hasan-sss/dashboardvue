<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col cols="12" md="6">انواع العقارات</v-col>
      <v-col>
        <v-btn @click="openNewForm" color="primary" style="margin-bottom: 10px">
          إضافة نوع عقار
        </v-btn>

        <!-- قائمة الأنواع -->
        <v-data-table
          :headers="headers"
          :items="estateTypes"
          item-key="id"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:body="{ items }">
            <draggable
              v-model="estateTypes"
              :options="{ handle: '.drag-handle', animation: 300 }"
              @end="onDragEnd"
              tag="tbody"
            >
              <tr v-for="item in items" :key="item.id">
                <td>
                  <v-icon class="drag-handle" small>mdi-drag</v-icon>
                  {{ item.index }}
                </td>
                <td>{{ item.name_ar }}</td>
                <td>{{ item.name_en }}</td>
                <td>{{ item.created_at }}</td>
                <td>
                  <v-switch
                    v-model="item.isActive"
                    @change="toggleActivation(item)"
                    color="primary"
                    inset
                  ></v-switch>
                </td>
                <td>
                  <v-icon small color="green" @click.stop="openEditForm(item)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon small color="red" @click.stop="confirmDelete(item.id)"
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </draggable>
          </template>
        </v-data-table>

        <!-- مكون الإضافة والتعديل لنوع العقار -->
        <v-dialog v-model="dialog_form" max-width="500px">
          <!-- داخل مكون EstateTypeForm -->
          <v-dialog v-model="dialog_form" max-width="500px">
            <EstateTypeForm
              :formData="currentFormData"
              @save="handleSaveOrEdit"
              @dialogForm="dialog_form = false"
              :isNew="isNew"
            />
          </v-dialog>
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
              <v-btn color="red darken-1" text @click="deleteItem">حذف</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EstateTypeForm from "@/components/Forms/System Categories/EstateTypeForm.vue";
import axios from "axios";
import draggable from "vuedraggable";

export default {
  components: { EstateTypeForm, draggable },
  data() {
    return {
      isNew: true,
      dialog_form: false,
      dialog_confirm_delete: false,
      itemToDelete: null,
      api: {
        getAll: "/estateTypes",
        create: "/newEstateType",
        update: "/editEstateType",
        delete: "/deleteEstateType",
        saveOrder: "/editEstateTypeOrder",
      },
      estateTypes: [],
      currentFormData: {},
      headers: [
        { text: "#", align: "start", value: "id", sortable: false },
        {
          text: "الأسم بالعربي",
          align: "start",
          value: "name_ar",
          sortable: false,
        },
        {
          text: "الأسم بالإنجليزي",
          align: "start",
          value: "name_en",
          sortable: false,
        },
        { text: "الحالة", align: "start", value: "isActive", sortable: false },
        {
          text: "العمليات",
          align: "center",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  methods: {
    async fetchEstateTypes() {
      try {
        const response = await axios.get(this.api.getAll);
        // تحويل قيمة is_active إلى boolean
        this.estateTypes = response.data.data.map((item) => ({
          ...item,
          isActive: item.is_active === "1", // تحويل القيمة من string إلى boolean
        }));
        this.updateIndexing();
      } catch (error) {
        console.error("Error fetching estate types:", error);
      }
    },

    async toggleActivation(item) {
      try {
        // إرسال القيمة كـ 1 أو 0 حسب حالة isActive
        const updatedStatus = item.isActive ? "1" : "0";
        await axios.put(`${this.api.update}/${item.id}`, {
          is_active: updatedStatus, // إرسال is_active بدلاً من isActive
        });
        this.$toast.success(
          `تم ${item.isActive ? "تفعيل" : "تعطيل"} نوع العقار بنجاح`
        );
      } catch (error) {
        console.error("Error updating activation status:", error);
        this.$toast.error("فشل في تعديل حالة التفعيل");
        item.isActive = !item.isActive; // إعادة الحالة الأصلية عند حدوث خطأ
      }
    },

    openNewForm() {
      this.isNew = true;
      this.currentFormData = {};
      this.dialog_form = true;
    },
    openEditForm(item) {
      this.isNew = false;
      this.currentFormData = { ...item };
      this.dialog_form = true;
      console.log("Editing item:", item); // تأكد أن item يحتوي على id هنا
    },
    // داخل دالة handleSave

    async handleSaveOrEdit(formData) {
      if (!formData.id && !this.isNew) {
        console.error("Error: ID is missing for update.");
        this.$toast.error("فشل في تعديل النوع - المعرف مفقود.");
        return;
      }
      try {
        if (this.isNew) {
          await axios.post(this.api.create, formData);
          this.$toast.success("تم إضافة نوع العقار بنجاح");
        } else {
          await axios.put(`${this.api.update}/${formData.id}`, formData);
          this.$toast.success("تم تحديث النوع بنجاح");
        }
        this.fetchEstateTypes();
        this.dialog_form = false;
      } catch (error) {
        console.error("Error saving or updating estate type:", error);
        this.$toast.error("فشل في حفظ أو تحديث نوع العقار");
      }
    },
    confirmDelete(itemId) {
      this.itemToDelete = itemId;
      this.dialog_confirm_delete = true;
    },
    async deleteItem() {
      try {
        await axios.delete(`${this.api.delete}/${this.itemToDelete}`);
        this.fetchEstateTypes();
        this.dialog_confirm_delete = false;
        this.$toast.success("تم حذف العنصر بنجاح");
      } catch (error) {
        console.error("Error deleting item:", error);
        this.$toast.error("فشل في حذف العنصر");
      }
    },
    async saveOrder() {
      const orderedEstateTypes = this.estateTypes.map((item, index) => ({
        id: item.id,
        order: index + 1,
      }));
      try {
        await axios.put(this.api.saveOrder, {
          estateTypes: orderedEstateTypes,
        });
      } catch (error) {
        console.error("Error saving order:", error);
      }
    },
    onDragEnd() {
      this.saveOrder().then(this.updateIndexing);
    },
    updateIndexing() {
      this.estateTypes = this.estateTypes.map((item, index) => ({
        ...item,
        index: index + 1,
      }));
    },
  },
  mounted() {
    this.fetchEstateTypes();
  },
};
</script>
<style scoped>
.drag-handle {
  cursor: move;
}
</style>
