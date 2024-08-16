<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- List -->
        <Table
          newItemLabel="مجال سعر"
          :filter="filter"
          :title="title"
          :api="api"
          :edit="edit"
          :del="del"
          :headers="headers"
          :items="items"
          @openForm="setForm"
        >
          <!-- تخصيص سويتش التفعيل/إلغاء التفعيل لكل عنصر -->
          <template v-slot:item.is_active="{ item }">
            <!-- تأكد من استخدام is_active هنا -->
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

        <!-- Form -->
        <v-dialog class="form" v-model="dialog_form" max-width="500px">
          <PriceDomainForm
            newItemLabel="مجال السعر"
            :isNew="isNew"
            :api="api"
            @dialogForm="dialog_form = false"
          ></PriceDomainForm>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PriceDomainForm from "@/components/Forms/System Categories/PriceDomainForm.vue";
import axios from "axios";

export default {
  components: { PriceDomainForm },
  data() {
    return {
      isNew: true,
      dialog_form: false,
      edit: true,
      del: true,
      items: [], // قائمة العناصر
      api: {
        getAll: "priceDomains",
        create: "newPriceDomain",
        update: "updatePriceDomain",
        delete: "deletePriceDomain",
        toggleActivation: "togglePriceDomainActivation",
        changeOrder: "changePriceDomainOrder",
      },
      filter: "price-domains",
      title: "مجالات الأسعار",
      headers: [
        { text: "#", align: "start", sortable: false, value: "id" },
        { text: "الحد الأدنى", align: "start", sortable: false, value: "min" },
        { text: "الحد الأعلى", align: "start", sortable: false, value: "max" },
        {
          text: "التفعيل",
          align: "start",
          sortable: false,
          value: "is_active",
        }, // القيمة هنا يجب أن تكون is_active
        { text: "العمليات", value: "actions", sortable: false },
      ],
    };
  },

  methods: {
    setForm(val) {
      let form = {
        min: null,
        max: null,
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

    async fetchItems() {
      try {
        const response = await axios.get(this.api.getAll);
        this.items = response.data; // تخزين البيانات في المصفوفة
      } catch (error) {
        console.error("Error fetching items:", error);
      }
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

    editItem(item) {
      this.setForm(item);
    },
  },

  mounted() {
    this.fetchItems(); // جلب البيانات عند تحميل المكون
  },
};
</script>
