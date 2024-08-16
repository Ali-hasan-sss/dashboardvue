<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- القائمة -->
        <Table
          newItemLabel="تصنيف داخلي"
          :filter="filter"
          :title="title"
          :api="api"
          :edit="edit"
          :del="del"
          :headers="headers"
          :items="items"
          @openForm="setForm"
        >
          <!-- تخصيص السويتش لتفعيل/تعطيل لكل عنصر -->
          <template v-slot:item.active="{ item }">
            <v-switch
              v-model="item.is_active"
              @change="toggleActivation(item)"
              :label="item.is_active ? 'مفعل' : 'معطل'"
            ></v-switch>
          </template>

          <!-- تخصيص العمليات لكل عنصر -->
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="editItem(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteItem(item.id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </Table>

        <!-- نموذج التعديل/الإنشاء -->
        <v-dialog class="form" v-model="dialog_form" max-width="500px">
          <EstateTypeFormSingle
            newItemLabel="تصنيف داخلي"
            :isNew="isNew"
            :api="api"
            @dialogForm="dialog_form = false"
          ></EstateTypeFormSingle>
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
      edit: true, // يجب أن تكون موجودة ومعرفة
      del: true, // يجب أن تكون موجودة ومعرفة
      items: [], // تخزين العناصر هنا
      api: {
        getAll: "interiorStatuses",
        create: "newInteriorStatus",
        update: "updateInteriorStatus",
        delete: "deleteInteriorStatus",
        toggleActivation: "toggleInteriorStatusActivation",
      },
      filter: "interior statuses",
      title: "الحالات الداخلية",
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "id",
        },
        {
          text: "الأسم بالعربي",
          align: "start",
          sortable: false,
          value: "name_ar",
        },
        {
          text: "الأسم بالاجنبي",
          sortable: false,
          value: "name_en",
        },
        {
          text: "تفعيل/تعطيل",
          value: "active", // لاحظ أن القيمة هنا تتطابق مع v-slot
          sortable: false,
        },
        {
          text: "العمليات",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },

  methods: {
    setForm(val) {
      let form = {
        name: "",
      };
      this.$store.dispatch("initForm", form);
      if (val != null) {
        this.isNew = false;
        this.$store.dispatch("setForm", val);
      } else {
        this.isNew = true;
      }
      this.dialog_form = true;
    },
    async deleteItem(itemId) {
      try {
        await axios.delete(`${this.api.delete}/${itemId}`);
        this.fetchItems(); // إعادة جلب البيانات بعد الحذف
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
    async toggleActivation(item) {
      try {
        await axios.post(`${this.api.toggleActivation}/${item.id}`, {
          is_active: item.is_active,
        });
        this.fetchItems(); // إعادة جلب البيانات بعد التفعيل/التعطيل
      } catch (error) {
        console.error("Error toggling activation:", error);
      }
    },
    async fetchItems() {
      try {
        console.log("Starting to fetch items..."); // تحقق من بدء التنفيذ
        const response = await axios.get(this.api.getAll);
        console.log("Data fetched:", response.data); // تحقق من البيانات المستلمة
        this.items = response.data; // تخزين البيانات في المصفوفة
        console.log(this.items); // عرض البيانات في وحدة التحكم للتحقق
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    editItem(item) {
      this.setForm(item);
    },
  },
  mounted() {
    console.log("Component mounted");
    this.fetchItems(); // جلب البيانات عند تحميل المكون
  },
};
</script>
