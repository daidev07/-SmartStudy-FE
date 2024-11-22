<template>
    <div class="classroom-detail-container">
        <!-- Header với tên lớp -->
        <div class="class-header">
            <h1 class="class-name">{{ classDetail.name }}</h1>
            <h4> Level {{ classDetail.level?.name }}</h4>
        </div>
        <hr>

        <!-- Menu cho Classwork và Students -->
        <div class="menu-header">
            <button :class="{ active: activeTab === 'classwork' }" @click="setActiveTab('classwork')">
                Classwork
            </button>
            <button :class="{ active: activeTab === 'students' }" @click="setActiveTab('students')">
                Students
            </button>
        </div>

        <!-- Nội dung hiển thị dựa trên tab đang chọn -->
        <div class="content">
            <div v-if="activeTab === 'classwork'" class="classwork-tab">
                <h2>Classwork</h2>
                <ul v-if="classDetail.classwork && classDetail.classwork.length">
                    <li v-for="(work, index) in classDetail.classwork" :key="index">
                        {{ work.title }} - Due: {{ work.dueDate }}
                    </li>
                </ul>
                <p v-else>No classwork assigned yet.</p>
            </div>

            <div v-else-if="activeTab === 'students'" class="students-tab">
                <h2>Students</h2>
                <ul v-if="classDetail.students && classDetail.students.length">
                    <li v-for="(student, index) in classDetail.students" :key="index">
                        {{ student.name }} - {{ student.email }}
                    </li>
                </ul>
                <p v-else>No students enrolled yet.</p>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';


export default {
    data() {
        return {
            apirUrl: process.env.VUE_APP_API_URL,
            classDetail: [],
            classId: this.$route.params.id,
            activeTab: 'classwork',
        };
    },
    mounted() {
        this.fetchClass();
    },
    methods: {
        async fetchClass() {
            this.classDetailLoading = true;
            this.classDetailError = null;
            try {
                const response = await axios.get(this.apirUrl + '/class/' + this.classId);
                this.classDetail = response.data.data;
                console.log("CLASS DETAILS:: ", this.classDetail);
            } catch (error) {
                this.classDetailError = error;
            } finally {
                this.classDetailLoading = false;
            }
        },
        setActiveTab(tab) {
            this.activeTab = tab;
        },
    },
};
</script>
<style scoped>
.classroom-detail-container {
    padding: 20px;
}

.class-header {
    margin-bottom: 20px;
}

.class-name {
    font-size: 2em;
    font-weight: bold;
}

.menu-header {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.menu-header button {
    border-radius: 7px;
    background-color: #f0f0f0;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.1s;
}

.menu-header button.active {
    background-color: #303030;
    color: white;
}

.menu-header button:hover {
    background-color: #747373;
}

.content {
    padding: 10px;
}

.classwork-tab ul,
.students-tab ul {
    list-style-type: none;
    padding: 0;
}

.classwork-tab li,
.students-tab li {
    margin-bottom: 10px;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}
</style>