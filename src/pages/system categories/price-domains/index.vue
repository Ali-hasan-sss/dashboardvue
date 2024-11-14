<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col cols="12" md="6">مجالات الاسعار</v-col>

      <v-col>
        <v-row>
          <!-- حقل البحث -->
          <v-col cols="6" md="8">
            <v-text-field
              v-model="searchQuery"
              label="بحث بالاسم"
              append-icon="mdi-magnify"
              single-line
              clearable
              @input="filterItems"
            ></v-text-field>
          </v-col>
          <!-- زر إضافة نوع جديد -->
          <v-col cols="6" md="4" class="d-flex align-center justify-center">
            <v-btn color="primary" @click="openAddForm"> إضافة مجال سعر </v-btn>
          </v-col>
        </v-row>

        <!-- قائمة العناصر مع خاصية السحب والإفلات وعمود التفعيل -->
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr :key="item.id">
              <!-- عمود السحب والإفلات -->
              <td>
                <v-icon small class="drag-handle" style="cursor: move"
                  >mdi-drag</v-icon
                >
                {{ item.id }}
              </td>
              <!-- الأعمدة العادية -->
              <td>{{ item.min }}</td>
              <td>{{ item.max }}</td>
              <!-- عمود التفعيل -->
              <td>
                <v-switch
                  v-model="item.is_active"
                  @change="(value) => toggleActivation(item, value)"
                  :label="item.is_active ? 'مفعل' : 'معطل'"
                ></v-switch>
              </td>
              <td>
                <v-icon small @click.stop="openEditForm(item)"
                  >mdi-pencil</v-icon
                >
              </td>
            </tr>
          </template>
        </v-data-table>

        <!-- نموذج التعديل والإضافة -->
        <v-dialog class="form" v-model="dialog_form" max-width="500px">
          <v-form ref="form" class="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="edit.min"
              label="الحد الأدنى"
              type="number"
              required
              :rules="[(v) => v >= 0 || 'الحد الأدنى يجب أن يكون أكبر من 0']"
            ></v-text-field>
            <v-text-field
              v-model="edit.max"
              label="الحد الأعلى"
              type="number"
              required
              :rules="[
                (v) =>
                  v > edit.min || 'الحد الأعلى يجب أن يكون أكبر من الحد الأدنى',
              ]"
            ></v-text-field>
            <v-btn class="btn" @click="saveItem(edit)" :disabled="!valid">
              {{ isNew ? "إضافة" : "تعديل" }}
            </v-btn>
            <v-btn text @click="dialog_form = false"> إلغاء </v-btn>
          </v-form>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isNew: true, // القيمة الافتراضية هي 'إضافة'
      dialog_form: false,
      edit: { min: null, max: null },
      valid: false, // للتحقق من صحة النموذج
      items: [],
      searchQuery: "",
      filteredItems: [],
      api: {
        getAll: "priceDomains",
        create: "newPriceDomain",
        edit: "editPriceDomain",
      },
      headers: [
        { text: "#", align: "start", sortable: false, value: "id" },
        { text: "الحد الأدنى", align: "start", sortable: false, value: "min" },
        { text: "الحد الأعلى", align: "start", sortable: false, value: "max" },
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
    openAddForm() {
      this.isNew = true; // تحديد أنه سيتم إضافة عنصر جديد
      this.edit = { min: null, max: null }; // قيم فارغة للإضافة الجديدة
      this.dialog_form = true; // فتح النموذج
    },

    openEditForm(item) {
      this.isNew = false; // تحديد أنه سيتم تعديل عنصر موجود
      this.edit = { ...item };
      this.dialog_form = true; // فتح النموذج
    },

    async fetchItems() {
      try {
        const response = await axios.get(this.api.getAll);
        // تحويل is_active من نص إلى قيمة منطقية
        this.items = response.data.data.map((item) => ({
          ...item,
          is_active: item.is_active === "1", // تحويل '1' إلى true و '0' إلى false
        }));
        this.filteredItems = this.items;
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    async saveItem(formData) {
      if (this.$refs.form.validate()) {
        try {
          let request;
          if (this.isNew) {
            request = await axios.post(this.api.create, formData);
          } else {
            const updatedFormData = {
              ...formData,
              price_domain_id: formData.id,
            };
            request = await axios.put(this.api.edit, updatedFormData);
          }

          // التحقق من حالة الاستجابة
          if (request.status === 200) {
            if (this.isNew) {
              this.$toast.success("تم إضافة البيانات بنجاح");
            } else {
              this.$toast.success("تم تعديل البيانات بنجاح");
            }

            // إعادة جلب العناصر وإغلاق النموذج بعد نجاح العملية
            this.fetchItems();
            this.dialog_form = false;
          }
        } catch (error) {
          console.error("Error saving item:", error);

          // عرض رسالة خطأ عند حدوث مشكلة
          this.$toast.error("حدث خطأ أثناء العملية");
        }
      } else {
        console.log("الرجاء ملء النموذج بشكل صحيح");
      }
    },
    async toggleActivation(item, value) {
      try {
        // تحويل القيمة إلى '1' إذا كانت true وإلى '0' إذا كانت false
        const updatedStatus = value ? "1" : "0";
        await axios.put(`${this.api.edit}`, {
          is_active: updatedStatus,
          price_domain_id: item.id,
        });

        // تحديث حالة العنصر كقيمة منطقية بعد الحفظ
        item.is_active = value; // تعيين القيمة كـ true أو false
        this.$toast.success(`تم ${value ? "تفعيل" : "تعطيل"} نوع العقار بنجاح`);
        this.fetchItems();
      } catch (error) {
        console.error("Error toggling activation:", error);
        this.$toast.error("حدث خطأ أثناء تغيير الحالة");
      }
    },
    filterItems() {
      const query = this.searchQuery.trim();
      this.filteredItems = query
        ? this.items.filter(
            (item) =>
              item.min.toString().includes(query) ||
              item.max.toString().includes(query)
          )
        : this.items;
    },
  },

  mounted() {
    this.fetchItems();
  },
};
</script>

<style scoped>
.form {
  background-color: rgb(247, 247, 246);
  padding: 10px;
}
.btn {
  background-color: rgb(75, 75, 247);
  z-index: 10;
}
</style>
