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
        <div v-if="isHaveHistory" class="m-3">You have not had any conversation before, let's chat...</div>
        <div v-else v-for="(message, index) in messageDetails" :key="index" class="chat-message mb-3">
          <p v-if="message.messageUser" class="user-message mb-2 p-2">{{ message.messageUser }}</p>
          <p v-if="message.messageBot" class="chatbot-message p-2 " v-html="formatMessage(message.messageBot)"></p>
        </div>
      </div>

      <div class="chatbot-footer">
        <input v-model="questionSend" placeholder="Type your message..." />
        <i :class="isLoading ? 'loader' : 'bx bx-send send-btn'" @click="sendMessage" title="Send message"></i>
      </div>
    </div>
  </div>
</template>

<script>
import ToastNotify from '../../components/ToastNotify.vue';
import Header from '../../components/Header.vue';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import { mapGetters, mapState, mapActions } from 'vuex';
import axios from 'axios';

export default {
  name: 'HomePage',
  components: {
    Header,
    ToastNotify
  },
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      isChatbotOpen: false,
      isChatHistoryOpen: false,
      messageHistory: {},
      messageDetails: [],
      questionSend: '',
      userInfo: null,
      isHaveHistory: false
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
    ...mapGetters(['getUserInfo', 'getUserId']),
    ...mapState(['isChatbotOpen', 'isLoading']),
  },
  methods: {
    ...mapActions(['stopLoading', 'startLoading']),
    toggleChatbot() {
      this.isChatbotOpen = !this.isChatbotOpen;
      this.isChatHistoryOpen = false;
    },
    async sendMessage() {
      if (!this.questionSend.trim()) return;
      this.startLoading();
      try {
        const response = await axios.post(this.apiUrl + '/api/chat/ask-ai', {
          userId: this.getUserId,
          question: this.questionSend
        });
        console.log("RESPONSE::", response.data);
        this.fetchMessageHistory();
        this.questionSend = '';
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message, please try again.');
      } finally {
        this.stopLoading();
      }
    },
    async fetchMessageHistory() {
      const response = await axios.get(this.apiUrl + `/api/history-chatbot/user/${this.userInfo?.id}`);
      console.log("RESPONSE::", response.data);
      if (response.data.data == null) {
        this.isHaveHistory = true;
      } else {
        this.messageHistory = response.data.data;
        this.messageDetails = this.messageHistory.messageDetails;
      }
      this.scrollToBottom();
    },
    formatMessage(message) {
      return message
        .replace(/### (.+)/g, '<strong>$1</strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatbotBody = this.$el.querySelector('.chatbot-body');
        if (chatbotBody) {
          chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }
      });
    },
  }
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background: linear-gradient(180deg, #E7F5DC, #728156); */
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
  transform: scale(1.2);
  transition: transform 0.4s ease-in-out;
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
  max-height: 60vh;
  overflow-y: auto;
}

.chat-message {
  border-radius: 5px;
  width: 100%;
  word-wrap: break-word;
}

.user-message {
  border-radius: 10px;
  background-color: #728156;
  color: #ffffff;
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

/* HTML: <div class="loader"></div> */
.loader {
  width: 40px;
  aspect-ratio: 1;
  display: grid;
  -webkit-mask: conic-gradient(from 15deg, #0000, #000);
  mask: conic-gradient(from 15deg, #0000, #000);
  animation: l26 1s infinite steps(12);
}

.loader,
.loader:before,
.loader:after {
  background:
    radial-gradient(closest-side at 50% 12.5%,
      #5a683e 96%, #0000) 50% 0/20% 80% repeat-y,
    radial-gradient(closest-side at 12.5% 50%,
      #5a683e 96%, #0000) 0 50%/80% 20% repeat-x;
}

.loader:before,
.loader:after {
  content: "";
  grid-area: 1/1;
  transform: rotate(30deg);
}

.loader:after {
  transform: rotate(60deg);
}

@keyframes l26 {
  100% {
    transform: rotate(1turn)
  }
}
</style>