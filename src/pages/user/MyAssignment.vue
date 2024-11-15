<template>
    <div>
        <h1>MyAssignment</h1>
    </div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from "vuex";

export default {
    name: 'MyAssignment',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            listAssignments: [],
        };
    },
    mounted() {
        this.fetchListAssignment();
    },
    watch: {
        getUserInfo(newUserInfo, oldUserInfo) {
            if (newUserInfo !== oldUserInfo) {
                this.fetchListAssignment();
            }
        }
    },
    computed: {
        ...mapGetters(['getUserInfo']),
    },
    methods: {
        async fetchListAssignment() {
            try {
                if (!this.getUserInfo) return;
                const userId = this.getUserInfo.id;
                console.log("USER ID::", userId);
                const response = await axios.get(this.apiUrl + `/api/student-assignment/${userId}`);
                this.listAssignments = response.data.data;
                console.log("LIST ASSIGNMENT BY USER ID::", this.listAssignments);

            } catch (error) {
                console.error(error);
            }
        },
    },
};
</script>