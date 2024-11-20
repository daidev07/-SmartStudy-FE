import { createStore } from 'vuex';

const store = createStore({
    state: {
        userInfo: null,
        selectedAssignment: null,
        isChatbotOpen: false,
        isLoading: false,
        askAIKey: 0
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setSelectedAssignment(state, assignment) {
            state.selectedAssignment = assignment;
        },
        toggleChatbot(state) {
            state.isChatbotOpen = !state.isChatbotOpen;
        },
        setLoading(state, status) {
            state.isLoading = status;
        },
        setChatbotOpen(state, status) {
            state.isChatbotOpen = status;
        },
        setAskAIKey(state) {
            state.askAIKey = state.askAIKey + 1;
        },
    },
    actions: {
        saveUserInfo({ commit }, userInfo) {
            commit('setUserInfo', userInfo);
        },
        saveSelectedAssignment({ commit }, assignment) {
            commit('setSelectedAssignment', assignment); 
        },
        openChatbotWithLoader({ commit }) {
            commit('setChatbotOpen', true);
            commit('setLoading', true);
        },
        toggleChatbot({ commit }) {
            commit('toggleChatbot');
        },
        openChatbot({ commit }) {
            commit('setChatbotOpen', true);
        },
        closeChatbot({ commit }) {
            commit('setChatbotOpen', false);
        },
        startLoading({ commit }) {
            commit('setLoading', true);
        },
        stopLoading({ commit }) {
            commit('setLoading', false);
        },
        setAskAIKey({ commit }) {
            commit('setAskAIKey');
        }
    },
    getters: {
        getUserInfo: (state) => state.userInfo,
        getUserId: (state) => state.userInfo?.id,
        getSelectedAssignment: state => state.selectedAssignment,
        isChatbotOpen: (state) => state.isChatbotOpen,
    },
});

export default store;
