<template>
    <div class="container rounded-3">
        <div class="new-post border d-flex justify-content-center rounded-3 mb-2 p-3 align-items-center bg-white"
            data-bs-toggle="modal" data-bs-target="#addNewPostModal">
            <span class="text-body-tertiary">What's on your mind? Click to post something ...
                <i class="bi bi-balloon-heart"></i></span>
        </div>
        <div class="modal fade" id="addNewPostModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="addNewPostModal" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-4 fw-bold" id="staticBackdropLabel">Adding new post</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-2">
                            <label for="postContent" class="form-label fw-bold">Content:</label>
                            <textarea v-model="newPostContent" class="form-control" placeholder="What's on your mind?">
                        </textarea>
                        </div>
                        <div>
                            <label for="postImage" class="form-label fw-bold">Image:</label>
                            <input type="file" class="form-control" @change="onFileChange" accept="image/*" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="submitPost">Post</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!newFeeds.length" class="text-center text-body-tertiary">No post yet! Let's post something to your
            class.</div>
        <div class="post border rounded-3 p-3 bg-white mb-2" v-for="(newfeed, index) in newFeeds" :key="newfeed.id">
            <div class="user-info d-flex align-items-center justify-content-between">
                <div class="d-flex">
                    <img :src="newfeed.user.avatarUrl || require('@/assets/nonAvatar.png')" alt="Avatar"
                        class="avatar" />
                    <div class="user-details d-flex flex-column">
                        <span class="user-name fw-bold">{{ newfeed.user.name }}</span> <small>{{
                            formatTime(newfeed.postedAt)
                        }}</small>
                    </div>
                </div>
                <i class="bi bi-three-dots-vertical"></i>
            </div>
            <div class="post-title mb-2">{{ newfeed.content }}</div>
            <div class="text-center">
                <img :src="newfeed.imageUrl" alt="Post Image" class="newfeeds-post-image rounded-3" />
            </div>

            <div class="d-flex align-items-center justify-content-center mt-2">
                <span class="fs-5 me-1">
                    {{ newfeed.likes }}
                </span>
                <div class="newfeeds-action d-flex align-items-center p-2 rounded-3 me-4">
                    <i class="bx bx-heart me-2 fs-5" @click="likePost(index)"></i>
                    <span>Love</span>
                </div>
                <div class="newfeeds-action d-flex align-items-center p-2 rounded-3">
                    <i class="bi bi-chat-right-heart me-2 fs-5" @click="showComment(index)"></i>
                    <span>Comment</span>
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
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

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
                const modalElement = document.getElementById('addNewPostModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                    modalInstance.dispose();
                }
                toast.success("Post successfully!");
            } catch (error) {
                toast.error("Invalid photo, please try again");
                console.error("Invalid photo, please try again:", error);
            }
            this.fetchNewfeeds();


        },
        formatTime(dateString) {
            return formatTime(dateString);
        }
    }
};
</script>
<style scoped>
.container {
    margin-top: 95px;
}

.new-post {
    cursor: pointer;
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

.user-info img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.newfeeds-post-image {
    width: 35%;
    height: 35%;
}

.newfeeds-action {
    cursor: pointer;
}

.newfeeds-action:hover {
    background: #e0e3e6;
    transform: scale(1.05);
    transition: transform 0.6s ease-in-out;
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