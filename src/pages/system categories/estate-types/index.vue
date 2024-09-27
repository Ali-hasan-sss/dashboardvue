<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <v-btn @click="setForm()" color="primary" style="margin-bottom: 10px"
          >إضافة نوع عقار</v-btn
        >

        <!-- قائمة الأنواع -->
        <v-data-table
          :headers="headers"
          :items="estateTypes"
          item-key="id"
          class="elevation-1"
          hide-default-footer
        >
          <!-- استخدام slot لتغليف tbody بـ draggable -->
          <template v-slot:body="{ items }">
            <draggable
              v-model="estateTypes"
              :options="{
                handle: '.drag-handle',
                animation: 300,
              }"
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
                  <v-icon
                    small
                    color="green"
                    style="margin-left: 20px"
                    @click.stop="setForm(item)"
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

        <v-dialog v-model="dialog_form" max-width="500px">
          <EstateTypeForm
            :formData="currentFormData"
            :isNew="isNew"
            :api="api"
            @save="handleSave"
            @dialogForm="dialog_form = false"
          ></EstateTypeForm>
        </v-dialog>
        <v-dialog v-model="dialog_confirm_delete" max-width="400px">
          <v-card>
            <v-card-title class="headline">تأكيد الحذف</v-card-title>
            <v-card-text> هل أنت متأكد أنك تريد حذف هذا العنصر؟ </v-card-text>
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
        getAll: "estateTypes",
        create: "newEstateType",
        update: "updateEstateType",
        delete: "deleteEstateType",
        saveOrder: "editEstateTypeOrder",
      },
      title: "أنواع العقارات",
      filter: "estate-types",
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
        if (response.data && Array.isArray(response.data.data)) {
          this.estateTypes = response.data.data;
          this.updateIndexing();
        } else {
          console.error("Unexpected data structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching estate types:", error);
      }
    },
    setForm(item = null) {
      this.isNew = !item;
      this.currentFormData = item ? { ...item } : {};
      this.dialog_form = true;
    },

    async handleSave(formData) {
      console.log("البيانات المرسلة:", formData);
      console.log("هل هو تعديل؟", !this.isNew);

      try {
        if (this.isNew) {
          // إضافة جديدة
          await axios.post(this.api.create, formData);
        } else if (formData.id) {
          // تعديل
          await axios.put(`${this.api.update}/${formData.id}`, formData);
        } else {
          console.error("Missing estate type ID for update");
        }

        this.fetchEstateTypes();
        this.dialog_form = false;
      } catch (error) {
        console.error("Error saving estate type:", error);
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
      try {
        const orderedEstateTypes = this.estateTypes.map((item, index) => ({
          id: item.id,
          order: index + 1,
        }));
        await axios.put(`${this.api.saveOrder}`, {
          estateTypes: orderedEstateTypes,
        });
      } catch (error) {
        console.error("Error saving order:", error);
      }
    },
    onDragEnd() {
      this.saveOrder().then(() => {
        this.updateIndexing();
      });
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
    console.log("API update URL:", this.api.update);
  },
};
</script>
<style scoped>
.drag-handle {
  font-size: 24px;
  cursor: move;
  color: #1976d2;
}
</style>
