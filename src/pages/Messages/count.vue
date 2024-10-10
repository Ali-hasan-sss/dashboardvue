<template>
  <v-container>
    <div v-if="messageCount > 0" class="message-count-circle">
      {{ messageCount }}
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import { GET_URL } from "../app_settings/url";

export default {
  data() {
    return {
      messageCount: 0,
      intervalId: null,
    };
  },
  methods: {
    async fetchMessageCount() {
      try {
        const response = await axios.get(`${GET_URL}/message/count`);
        this.messageCount = response.data.messagesCount;
      } catch (error) {
        console.error("Error fetching message count:", error);
      }
    },
  },
  mounted() {
    this.fetchMessageCount();

    this.intervalId = setInterval(() => {
      this.fetchMessageCount();
    }, 300000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
};
</script>

<style scoped>
.message-count-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgb(227, 40, 33);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
}
</style>
