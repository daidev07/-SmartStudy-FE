<template>
  <div class="home-page">
    <Header />
    <router-view />
    <ToastNotify />

    <div class="chatbot-icon" @click="toggleChatbot" title="ASK AI">
      <img src="@/assets/chatbotLogo.jpg" alt="Chatbot Logo" />
    </div>

    <div v-if="isChatbotOpen" class="chatbot-dialog">
      <div class="chatbot-header">
        <h5> {{ userInfo?.username }}'s Chatbot</h5>
        <button @click="toggleChatbot">&times;</button>
      </div>
      <div class="chatbot-body mb-3">
        <div v-for="(message, index) in messageDetails" :key="index" class="chat-message mb-3">
          <p v-if="message.messageUser" class="user-message mb-2 p-2">{{ message.messageUser }}</p>
          <p v-if="message.messageBot" class="chatbot-message p-2 ">{{ message.messageBot }}</p>
        </div>
      </div>

      <div class="chatbot-footer">
        <input v-model="userMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
        <i class='bx bx-send send-btn' @click="sendMessage" title="Send message"></i>
      </div>
    </div>
  </div>
</template>

<script>
import ToastNotify from '../../components/ToastNotify.vue';
import Header from '../../components/Header.vue';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'HomePage',
  components: {
    Header,
    ToastNotify
  },
  data() {
    return {
      apiUri: process.env.VUE_APP_API_URL,
      isChatbotOpen: false,
      isChatHistoryOpen: false,
      messageHistory: {},
      messageDetails: [],
      userMessage: '',
      userInfo: null
    };
  },
  mounted() {
    const loginSuccess = localStorage.getItem('loginSuccess');
    if (loginSuccess) {
      const { type, message, options } = JSON.parse(loginSuccess);
      toast[type](message, options);
      localStorage.removeItem('loginSuccess');
    }
  },
  watch: {
    getUserInfo(newUserInfo, oldUserInfo) {
      if (newUserInfo !== oldUserInfo) {
        this.userInfo = newUserInfo;
        this.fetchMessageHistory();
      }
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  methods: {
    toggleChatbot() {
      this.isChatbotOpen = !this.isChatbotOpen;
      this.isChatHistoryOpen = false;
    },
    sendMessage() {

    },
    async fetchMessageHistory() {

      const response = await axios.get(this.apiUri + `/api/chat/message-history/user/${this.userInfo?.id}`);
      this.messageHistory = response.data.data;
      console.log("MESSAGE HISTORY", this.messageHistory);

      this.messageDetails = this.messageHistory.messageDetails;
      console.log("MESSAGE DETAILS", this.messageDetails);
    }
  }
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #E7F5DC, #728156);
  min-height: 100vh;
}

.chatbot-icon {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 70px;
  height: 70px;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.chatbot-icon:hover {
  transform: scale(1.3);
  transition: transform 0.3s ease-in-out;
}

.chatbot-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chatbot-dialog {
  position: fixed;
  bottom: 120px;
  right: 20px;
  width: 450px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1000;
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #7f8d65;
  color: white;
  padding: 10px;
}

.chatbot-header button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.chatbot-body {
  padding: 7px 15px 0px 15px;
  color: #555;
}

.chat-message {
  border-radius: 5px;
  width: 100%;
  word-wrap: break-word;
}

.user-message {
  border-radius: 10px;
  background-color: #728156;
  color: #E7F5DC;
  justify-self: flex-end;
  align-items: center;
}

.chatbot-message {
  border-radius: 10px;
  background-color: #E7F5DC;
  color: #728156;
  justify-self: flex-start;
  align-items: center;
}

.chatbot-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f1f1f1;
}

.chatbot-footer i {
  font-size: 24px;
  cursor: pointer;
  margin-right: 10px;
}

.chatbot-footer input {
  flex-grow: 1;
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

.chatbot-footer .send-btn {
  background-color: #728156;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 8px 12px;
}

.chatbot-footer .send-btn:hover {
  background-color: #5a683e;
}
</style>