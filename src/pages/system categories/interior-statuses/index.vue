<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col cols="12" md="6">
        <h3>{{ title }}</h3>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-text-field
          v-model="searchQuery"
          label="بحث بالاسم"
          prepend-icon="mdi-magnify"
          outlined
          dense
        ></v-text-field>
        <v-btn color="primary" @click="openAddForm">
          <v-icon left>mdi-plus</v-icon> إضافة نوع ملكية جديد
        </v-btn>
      </v-col>
      <v-col>
        <v-simple-table>
          <thead>
            <tr>
              <th>#</th>
              <th>الأسم بالعربي</th>
              <th>الأسم بالاجنبي</th>
              <th>الحالة</th>
              <!-- إضافة عمود للحالة -->
              <th>العمليات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filteredItems"
              :key="item.id"
              draggable="true"
              @dragstart="onDragStart(index)"
              @dragover.prevent
              @drop="onDrop(index)"
            >
              <td>
                <v-icon small class="mr-2" color="grey" @mousedown.stop>
                  mdi-drag
                </v-icon>
                {{ index + 1 }}
              </td>
              <td>{{ item.name_ar }}</td>
              <td>{{ item.name_en }}</td>
              <td>
                <v-switch
                  v-model="item.is_active"
                  :label="item.is_active === '1' ? 'نشط' : 'غير نشط'"
                  @change="updateActiveStatus(item)"
                ></v-switch>
              </td>
              <td>
                <v-btn icon @click="editItem(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="confirmDelete(item)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>

        <!-- نموذج التعديل/الإنشاء -->
        <v-dialog class="form" v-model="dialog_form" max-width="500px">
          <EstateTypeFormSingle
            :newItemLabel="newItemLabel"
            :initialData="currentItem"
            :isNew="isNew"
            @submitForm="saveItem"
            @closeDialog="closeDialog"
          ></EstateTypeFormSingle>
        </v-dialog>

        <!-- نموذج تأكيد الحذف -->
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
              <v-btn color="red darken-1" text @click="deleteItem"> حذف </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EstateTypeFormSingle from "@/components/Forms/System Categories/EstateTypeFormSingle.vue";
import axios from "axios";

export default {
  components: { EstateTypeFormSingle },
  data() {
    return {
      isNew: true,
      dialog_form: false,
      dialog_confirm_delete: false,
      items: [],
      searchQuery: "",
      draggedItemIndex: null,
      api: {
        getAll: "interiorStatuses",
        create: "newInteriorStatus",
        update: "editInteriorStatus",
        delete: "deleteInteriorStatus",
      },
      title: "الحالات الداخلية",
      newItemLabel: "تصنيف داخلي",
      currentItem: null,
      itemToDelete: null,
    };
  },

  computed: {
    filteredItems() {
      if (!this.searchQuery) return this.items;
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      return this.items.filter(
        (item) =>
          item.name_ar.toLowerCase().includes(lowerCaseQuery) ||
          item.name_en.toLowerCase().includes(lowerCaseQuery)
      );
    },
  },

  methods: {
    openAddForm() {
      this.isNew = true;
      this.currentItem = null;
      this.dialog_form = true;
    },

    async editItem(item) {
      this.isNew = false;
      this.currentItem = { ...item };
      this.dialog_form = true;
    },
    confirmDelete(item) {
      this.itemToDelete = item;
      this.dialog_confirm_delete = true;
    },

    async deleteItem() {
      try {
        await axios.delete(this.api.delete, {
          data: { id: this.itemToDelete.id },
        });
        this.fetchItems();
        this.$toast.success("تم الحذف بنجاح");
        this.dialog_confirm_delete = false;
      } catch (error) {
        console.error("Error deleting item:", error);
        this.$toast.error("فشل في الحذف");
      }
    },

    async saveItem(item) {
      console.log("Item to save:", item); // للتأكد من أن `item` يحتوي على `id`

      try {
        if (this.isNew) {
          await axios.post(this.api.create, item);
        } else {
          if (!item.id) {
            console.error("Error: Item ID is missing for update operation.");
            this.$toast.error("المعرف مفقود، لا يمكن إتمام عملية التحديث");
            return;
          }

          await axios.put(this.api.update, {
            ...item,
            id: item.id,
          });
        }

        this.fetchItems();
        this.closeDialog();
      } catch (error) {
        console.error("Error saving item:", error);
        this.$toast.error("فشل في حفظ العنصر");
      }
    },
    closeDialog() {
      this.dialog_form = false;
      this.currentItem = null;
    },

    onDragStart(index) {
      this.draggedItemIndex = index;
    },

    onDrop(index) {
      if (this.draggedItemIndex !== null && this.draggedItemIndex !== index) {
        const itemsCopy = [...this.items];
        const draggedItem = itemsCopy[this.draggedItemIndex];
        itemsCopy.splice(this.draggedItemIndex, 1);
        itemsCopy.splice(index, 0, draggedItem);
        this.items = itemsCopy;
        this.draggedItemIndex = null;
      }
    },

    async fetchItems() {
      try {
        const response = await axios.get(this.api.getAll);
        // تحويل البيانات عند الاستلام إلى منطقية
        this.items = response.data.data.map((item) => ({
          ...item,
          is_active: item.is_active === "1", // تحويل "1" و "0" إلى true و false
        }));
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    async updateActiveStatus(item) {
      try {
        // نحدد القيمة الجديدة بناءً على حالة التبديل
        const updatedStatus = item.is_active ? "1" : "0"; // تأكد من إرسال القيمة "1" أو "0"

        // تحديث الحالة في العنصر المحلي
        item.is_active = updatedStatus === "1"; // تحديث القيمة من منطقية إلى نصية في العرض

        // إرسال التحديث إلى الخادم
        await axios.put(`${this.api.update}`, {
          is_active: updatedStatus, // إرسال القيمة النصية الصحيحة (1 أو 0)
          id: item.id,
        });

        // إظهار رسالة تأكيد للمستخدم
        this.$toast.success(
          `تم تغيير حالة العنصر إلى ${
            updatedStatus === "1" ? "نشط" : "غير نشط"
          }`
        );
      } catch (error) {
        console.error("Error updating status:", error);
        this.$toast.error("فشل في تغيير الحالة");
      }
    },
  },

  mounted() {
    this.fetchItems();
  },
};
</script>
