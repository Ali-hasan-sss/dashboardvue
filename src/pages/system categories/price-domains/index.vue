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
          :del="del"
          :headers="headers"
          :items="items"
          @openForm="setForm"
        >
        </Table>

        <!-- Form -->
        <v-dialog class="form" v-model="dialog_form" max-width="500px">
          <PriceDomainForm
            newItemLabel="مجال السعر"
            :isNew="isNew"
            :api="api"
            :edit="edit"
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
      edit: {},
      del: true,
      items: [],
      api: {
        getAll: "priceDomains",
        create: "newPriceDomain",
        delete: "deletePriceDomain",
        edit: "updatePriceDomain",
      },
      filter: "price-domains",
      title: "مجالات الأسعار",
      headers: [
        { text: "#", align: "start", sortable: false, value: "id" },
        { text: "الحد الأدنى", align: "start", sortable: false, value: "min" },
        { text: "الحد الأعلى", align: "start", sortable: false, value: "max" },
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
        this.edit = val;
        this.$store.dispatch("setForm", val);
      } else {
        this.isNew = true;
        this.edit = null;
      }
      this.dialog_form = true;
    },

    async fetchItems() {
      try {
        const response = await axios.get(this.api.getAll);
        this.items = response.data;
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },

    async deleteItem(itemId) {
      try {
        await axios.delete(`${this.api.delete}/${itemId}`);
        this.fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
    editItem(item) {
      this.setForm(item);
    },
  },

  mounted() {
    this.fetchItems();
  },
};
</script>
