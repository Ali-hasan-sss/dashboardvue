<!-- ExportToExcelButton.vue -->
<template>
  <v-btn color="secondary" @click="exportToExcel">تصدير إلى Excel</v-btn>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  props: {
    tableData: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  methods: {
    exportToExcel() {
      // التحقق من وجود بيانات
      if (!this.tableData || this.tableData.length === 0) {
        alert("لا توجد بيانات لتصديرها.");
        return;
      }
      // تحويل البيانات إلى ورقة Excel
      const worksheet = XLSX.utils.json_to_sheet(this.tableData, {
        header: Object.keys(this.tableData[0]), // استخدام مفاتيح الكائن كعناوين للأعمدة
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "RealEstateOffices");

      // إنشاء اسم ملف ديناميكي
      const date = new Date();
      const fileName = `RealEstateOffices_${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}.xlsx`;

      // تحميل الملف
      XLSX.writeFile(workbook, fileName);
    },
  },
};
</script>
