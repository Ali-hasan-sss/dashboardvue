<template>
    <v-btn @click="exportToExcel">تصدير إلى Excel</v-btn>
</template>

<script>
import * as XLSX from "xlsx";

export default {
    props: {
        tableData: {
            type: Array,
            required: true
        }
    },
    methods: {
        exportToExcel() {
            if (
                !this.tableData ||
                !Array.isArray(this.tableData) ||
                this.tableData.length === 0
            ) {
                console.error("No data available to export");
                this.$toast.error("لايوجد بيانات للتصدير");
                return;
            }

            //  to  Excel sheet
            const ws = XLSX.utils.json_to_sheet(this.tableData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Data");
            XLSX.writeFile(wb, "data.xlsx");
        }
    }
};
</script>
