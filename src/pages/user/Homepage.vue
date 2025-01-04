<template>
  <div class="home-page">
    <Header />
    <router-view />
    <ToastNotify />

    <div class="chatbot-icon" @click="toggleChatbotOrClose" title="ASK AI">
      <img src="@/assets/logoHeader.jpg" alt="Chatbot Logo" />
    </div>

    <div v-if="this.$store.state.isChatbotOpen" class="chatbot-dialog">
      <div class="chatbot-header align-items-center justify-content-between">
        <h5> {{ userInfo?.username }}'s Chatbot</h5>
        <button @click="toggleChatbotOrClose"><i class='bx bxs-x-circle fs-3'></i></button>
      </div>
      <div class="chatbot-body">
        <div v-if="messageDetails.length == 0" class="m-3">You have not had any conversation before, let's chat...</div>
        <div v-else v-for="(message, index) in messageDetails" :key="index" class="chat-message ">
          <p v-if="message.messageUser" class="user-message mb-2 p-2">{{ message.messageUser }}</p>
          <p v-if="message.messageBot" class="chatbot-message p-2" v-html="formatBotMessage(message.messageBot)"></p>
          <p class="text-body-tertiary">{{ formatTimeChatbot(message?.respondedAt) }}</p>
        </div>
      </div>

      <div class="chatbot-footer">
        <input v-model="questionSend" placeholder="Type your message..." />
        <button :class="isLoading ? 'loader' : 'bx bx-send send-btn'" @click="sendMessage" title="Send message"
          :disabled="!questionSend.trim()"></button>
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
import { formatTimeChatbot } from '../../utils/FormatDateAndTime.js';

export default {
  name: 'HomePage',
  components: {
    Header,
    ToastNotify
  },
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      messageHistory: {},
      messageDetails: [],
      questionSend: '',
      userInfo: null,
      isHaveHistory: true
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
    },
    askAIKey(newAskAIKey, oldAskAIKey) {
      if (newAskAIKey !== oldAskAIKey) {
        this.fetchMessageHistory();
      }
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getUserId']),
    ...mapState(['isLoading', 'askAIKey']),
  },
  methods: {
    formatTimeChatbot,
    ...mapActions(['stopLoading', 'startLoading', 'toggleChatbot']),
    toggleChatbotOrClose() {
      this.toggleChatbot();
      this.scrollToBottom();
    },
    async sendMessage() {
      if (!this.questionSend.trim()) return;
      this.startLoading();
      try {
        const response = await axios.post(this.apiUrl + '/chat/ask-ai', {
          userId: this.getUserId,
          question: this.questionSend
        });
        console.log("RESPONSE::", response.data);
        this.isHaveHistory = true;
        this.fetchMessageHistory();
        this.questionSend = '';
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message, please try again.');
      } finally {
        this.stopLoading();
        this.scrollToBottom();
      }
    },
    async fetchMessageHistory() {
      const response = await axios.get(this.apiUrl + `/history-chatbot/user/${this.userInfo?.id}`);
      if (response.data.data == null) {
        this.isHaveHistory = false;
      } else {
        this.messageHistory = response.data.data;
        this.messageDetails = this.messageHistory.messageDetails;
      }
      this.scrollToBottom();
    },
    formatBotMessage(message) {
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
Header {
  z-index: 2000 !important;
}

.home-page {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background-color: #6280e4;
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

.bxs-x-circle {
  transition: transform 0.3s ease;
}

.bxs-x-circle:hover {
  transform: scale(1.2);
}

.chatbot-body {
  padding: 7px 15px 0px 15px;
  color: #555;
  max-height: 64vh;
  overflow-y: auto;
}

.chat-message {
  border-radius: 5px;
  width: 100%;
  word-wrap: break-word;
}

.user-message {
  border-radius: 10px;
  background-color: #3b62e6;
  color: #ffffff;
  justify-self: flex-end;
  align-items: center;
  margin-left: 50px;
}

.chatbot-message {
  margin-bottom: 3px;
  border-radius: 10px;
  background-color: #dee5fc;
  color: #415bb1;
  justify-self: flex-start;
  align-items: center;
  margin-right: 50px;
}

.chatbot-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f1f1f1;
}

.chatbot-footer button {
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
  background-color: #6280e4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 8px 12px;
}

.chatbot-footer .send-btn:hover {
  background-color: #0a38cf;
}

.loader {
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #3b62e6;
  --_m:
    conic-gradient(#0000 10%, #000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}

@keyframes l3 {
  to {
    transform: rotate(1turn)
  }
}

@keyframes l26 {
  100% {
    transform: rotate(1turn)
  }
}

.text-body-tertiary {
  font-size: 13px;
}
</style>