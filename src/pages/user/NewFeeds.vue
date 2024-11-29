<template>
    <div class="container w-50">
        <div class="new-post justify-content-center" @click="showModal = true">
            Click to post something ... <i class="bi bi-balloon-heart"></i>
        </div>
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h3>New Post</h3>
                <textarea v-model="newPostContent" placeholder="Enter the content post" class="post-input">
        </textarea>
                <input type="file" @change="onFileChange" accept="image/*" />

                <div class="actions">
                    <button class="btn btn-secondary me-2" @click="closeModal">Cancel</button>
                    <button class="btn btn-primary" @click="submitPost">Submit</button>
                </div>
            </div>
        </div>
        <h3 v-if="!newFeeds.length" class="text-center">No post yet!</h3>
        <div v-else class="newfeeds">
            <div class="post" v-for="(newfeed, index) in newFeeds" :key="newfeed.id">
                <div class="user-info">
                    <img :src="newfeed.user.avatarUrl || require('@/assets/nonAvatar.png')" alt="Avatar"
                        class="avatar" />
                    <div class="user-details">
                        <h5 class="user-name">{{ newfeed.user.name }}</h5> <small>{{ formatTime(newfeed.postedAt)
                            }}</small>
                    </div>
                </div>
                <h4 class="post-title">{{ newfeed.content }}</h4>
                <img :src="newfeed.imageUrl" alt="Post Image" class="post-image" />

                <div class="actions">
                    <button class="like-btn" @click="likePost(index)">
                        <i class="bx bx-heart"></i> {{ newfeed.likes }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { mapGetters } from 'vuex';
import { formatTime } from '../../services/TimeService.js';

export default {
    name: 'NewFeeds',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            newFeeds: [],
            classroomId: null,
            userId: null,
            newPostContent: "",
            selectedFile: null,
            showModal: false,
        };
    },

    mounted() {
        if (this.getUserInfo) {
            this.classroomId = this.getUserInfo.classroom?.id || null;
            this.userId = this.getUserInfo.id || null;
            this.fetchNewfeeds();
        }
    },
    computed: {
        ...mapGetters(['getUserInfo']),
    },
    watch: {
        getUserInfo(newUserInfo) {
            if (newUserInfo) {
                this.classroomId = newUserInfo.classroom?.id || null;
                this.userId = newUserInfo.id || null;
                this.fetchNewfeeds();
            }
        }
    },
    methods: {
        async fetchNewfeeds() {
            try {
                const response = await axios.get(this.apiUrl + `/newfeed/class/${this.classroomId}`);
                this.newFeeds = response.data.data.reverse();
                console.log("LIST NEW FEEDS:: ", this.newFeeds);
            } catch (error) {
                console.error(error);
            }
        },
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.newPostContent = "";
            this.selectedFile = null;
        },
        onFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async submitPost() {
            if (!this.newPostContent || !this.selectedFile) {
                alert("Pleses enter content or choose image");
                return;
            }

            const formData = new FormData();
            formData.append("content", this.newPostContent);
            formData.append("classId", this.classroomId);
            formData.append("userId", Number(this.userId));
            formData.append("image", this.selectedFile);
            console.log("USER ID:: ", this.userId);

            try {
                await axios.post(`${this.apiUrl}/newfeed/all`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                this.fetchNewfeeds();
                this.closeModal();
                toast.success("Post successfully!");
            } catch (error) {
                console.error("Lỗi khi đăng bài:", error);
            }
        },
        formatTime(dateString) {
            return formatTime(dateString);
        }
    }
};
</script>
<style scoped>
.container {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    min-height: 88vh;
    margin-top: 95px;
    padding: 20px;
    width: 600px;
    margin-top: 95px auto;
}

.new-post {
    background-color: #f0f2f5;
    border-radius: 10px;
    padding: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 20px;
}

.new-post .post-input {
    width: calc(100% - 40px);
    height: 50px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 14px;
    background-color: transparent;
    outline: none;
    color: #4b4f56;
}

.new-post .post-input::placeholder {
    color: #a8b0b6;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    width: 500px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.modal-content h3 {
    font-size: 18px;
    color: #333;
    font-weight: 600;
    margin-bottom: 15px;
}

.modal .post-input {
    width: 100%;
    height: 120px;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
    outline: none;
    margin-bottom: 10px;
    color: #4b4f56;
    background-color: #f0f2f5;
}

.modal .post-input::placeholder {
    color: #a8b0b6;
}

.modal .actions {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
}

.submit-btn,
.cancel-btn {
    padding: 8px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
}

.submit-btn {
    background-color: #4e74fe;
    color: white;
    border: none;
}

.cancel-btn {
    background-color: #f0f2f5;
    color: #4b4f56;
    border: none;
}

.newfeeds {
    margin-top: 20px;
}

.post {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.user-info img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.user-details {
    display: flex;
    flex-direction: column;
}

.user-details h5 {
    font-size: 20px;
    font-weight: 600;
    color: #3b5998;
}

.user-details small {
    font-size: 12px;
    color: #a8b0b6;
}

.post-title {
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    margin-bottom: 10px;
}

.post-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    margin-top: 10px;
}

.actions {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.like-btn {
    background: transparent;
    border: none;
    color: #3b5998;
    cursor: pointer;
    font-size: 20px;
}

.like-btn i {
    margin-right: 5px;
}
</style>