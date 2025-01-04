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
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            id="btnCloseNewPostModal">Cancel</button>
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
                    <img :src="newfeed.user.avatarFile || require('@/assets/nonAvatar.png')" alt="Avatar"
                        class="avatar" />
                    <div class="user-details d-flex flex-column">
                        <span class="user-name fw-bold">{{ newfeed.user.name }}</span> <small>{{
                            formatTimeChatbot(newfeed.postedAt)
                            }}</small>
                    </div>
                </div>
                <i class="bi bi-three-dots-vertical"></i>
            </div>
            <div class="post-title mb-2">{{ newfeed.content }}</div>
            <div class="d-flex jsutiify-content-between gap-3">
                <div class="img-newsfeed w-50 text-center border-end">
                    <img :src="newfeed.imageFile" alt="Post Image" class="newfeeds-post-image rounded-3 w-75" />
                </div>
                <div class="comments text-start w-50">
                    <div class="fw-bold mb-2">Comments: </div>
                    <div class="comment-list overflow-y-auto" :ref="'commentList-' + newfeed.id">
                        <div v-for="(comment, idx) in newfeed.comments" :key="idx" class="comment">
                            <div class="d-flex align-items-center  mb-3 ">
                                <img :src="comment.userResponse.avatarUrl || require('@/assets/nonAvatar.png')"
                                    alt="Avatar" class="avatar" width="8%" />
                                <div class="comment-content ms-2 w-100">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span class="fw-bold bg-info text-white rounded-3 p-1 me-2"
                                                style="font-size: x-small;">{{
                                                    comment.userResponse.classroom.className }}</span>
                                            <span class="fw-bold">
                                                {{ comment.userResponse.name }}
                                            </span>
                                            <span class="text-body-tertiary ms-2" style="font-size: small;">
                                                {{ formatTimeChatbot(comment.createdAt) }}
                                            </span>
                                        </div>
                                        <div class="text-danger me-3" v-if="comment.isUserComment ||
                                            comment.isUserPost ||
                                            this.getUserInfo.role !== 'STUDENT'">
                                            <i class="bi bi-x-circle-fill" v-tooltip:bottom="'Delete this comment'"></i>
                                        </div>
                                    </div>
                                    <div class="mt-1">{{ comment.content }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="comment-input d-flex align-items-center justify-content-between">
                        <textarea v-model="newCommentContent[newfeed.id]" class="form-control mt-2"
                            placeholder="Write a comment ..." rows="1" id="textComment"></textarea>
                        <div v-if="isLoading" class="spinner-border mx-3 text-info" role="status" aria-hidden="true">
                        </div>
                        <div v-else>
                            <i class="bi bi-send fs-4 mx-3" v-tooltip:bottom="'Send Comment'"
                                @click="postComment(newfeed.id, newCommentContent[newfeed.id])"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex align-items-center justify-content-center">
                <div class="newfeeds-action d-flex align-items-center p-2 rounded-3 me-2">
                    <i class="bx bx-heart me-2 fs-5" @click="likePost(index)"></i>
                    <span>Love</span>
                </div>
                <span class="fs-5">
                    {{ newfeed.likes }}
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { mapGetters } from 'vuex';
import { formatTimeChatbot } from '../../utils/FormatDateAndTime.js';

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
            isLoading: false,
            newCommentContent: {},
            userInfo: {},
        };
    },

    mounted() {
        if (this.getUserInfo) {
            this.getUserInfo = this.userInfo;
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
        formatTimeChatbot,
        async isPostByUser(postId) {
            try {
                const response = await axios.get(`${this.apiUrl}/newsfeed/is-post-by-user`, {
                    params: {
                        postId: postId,
                        userId: this.userId
                    }
                });
                return response.data.data;
            } catch (error) {
                console.error("Failed to check if post belongs to user:", error);
                return false;
            }
        },
        async isCommentByUser(commentId) {
            try {
                const response = await axios.get(`${this.apiUrl}/comment/is-comment-by-user`, {
                    params: {
                        commentId: commentId,
                        userId: this.userId
                    }
                });
                return response.data.data;
            } catch (error) {
                console.error("Failed to check if comment belongs to user:", error);
                return false;
            }
        },
        async postComment(newsfeedId, commentContent) {
            if (!commentContent.trim()) {
                toast.error("Comment content cannot be empty!");
                return;
            }
            this.isLoading = true;
            const payload = {
                newsfeedId: newsfeedId,
                userId: this.userId,
                content: commentContent,
            };
            try {
                const response = await axios.post(`${this.apiUrl}/comment/post-to-newsfeed`, payload);
                if (response.data && response.data.data) {
                    const newComment = response.data.data;
                    const newsfeed = this.newFeeds.find(feed => feed.id === newsfeedId);
                    if (newsfeed) {
                        newsfeed.comments.push(newComment);
                        this.newCommentContent[newsfeedId] = "";
                        this.scrollToBottom(newsfeedId);
                    }
                    toast.success("Comment posted successfully!");
                }
            } catch (error) {
                console.error("Failed to post comment:", error);
                toast.error("Failed to post comment. Please try again.");
            } finally {
                this.isLoading = false;
            }
        },
        async fetchCommentsByNewsfeedId(newsfeedId) {
            try {
                const response = await axios.get(this.apiUrl + `/comment/get-all-by-newsfeedId/${newsfeedId}`);
                const comments = response.data.data;
                for (const comment of comments) {
                    comment.isUserComment = await this.isCommentByUser(comment.id);
                }
                const isUserPost = await this.isPostByUser(newsfeedId);
                for (const comment of comments) {
                    comment.isUserPost = isUserPost;
                }
                return comments;
            } catch (error) {
                console.error(error);
            }
        },

        async fetchNewfeeds() {
            try {
                const response = await axios.get(this.apiUrl + `/newsfeed`);
                const feeds = response.data.data.reverse();
                for (const feed of feeds) {
                    const comments = await this.fetchCommentsByNewsfeedId(feed.id);
                    feed.comments = comments || [];
                    console.log("COMMENTS:: ", comments);
                }
                this.newFeeds = feeds;
                console.log("LIST NEW FEEDS WITH COMMENTS:: ", this.newFeeds);
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
                await axios.post(`${this.apiUrl}/newsfeed/all`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (error) {
                toast.error("Invalid photo, please try again");
                console.error("Invalid photo, please try again:", error);
            } finally {
                this.newPostContent = "";
                this.selectedFile = null;
                document.getElementById("btnCloseNewPostModal").click();
                toast.success("Post successfully!");
                this.fetchNewfeeds();
            }
        },
        scrollToBottom(newsfeedId) {
            this.$nextTick(() => {
                const commentList = this.$refs['commentList-' + newsfeedId];
                if (commentList) {
                    commentList.scrollTop = commentList.scrollHeight;
                }
            });
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

.comment-list {
    max-height: 43vh;
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