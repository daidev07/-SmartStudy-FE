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
                        <button type="button" class="btn btn-primary" @click="submitPost">
                            <span v-if="isSpinnerLoading" class="spinner-border spinner-border-sm" role="status"
                                aria-hidden="true">
                            </span>
                            <span v-else>Post</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isNotStudent">
            <div v-if="!listNewsfeedNotPermit.length" class="text-center text-body-tertiary mb-2">No post need to
                permit!
            </div>
            <div v-else class="mb-2">
                <div class="border d-flex justify-content-center rounded-3 mb-2 p-3 align-items-center bg-white"
                    data-bs-toggle="modal" data-bs-target="#notPermitPostModal" style="cursor: pointer;">
                    <span class="text-primary">Some post need to permit! Click to view ... </span>
                </div>
                <div class="modal fade" id="notPermitPostModal" tabindex="-1" aria-labelledby="notPermitPost"
                    aria-hidden="true">
                    <div class="modal-dialog  modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-4 fw-bold">NOT PERMIT POST</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="post border rounded-3 p-3 bg-white mb-2"
                                    v-for="(newsfeed) in listNewsfeedNotPermit" :key="newsfeed.id">
                                    <div class="user-info d-flex align-items-center justify-content-between">
                                        <div class="d-flex">
                                            <img :src="newsfeed.user.avatarFile || require('@/assets/nonAvatar.png')"
                                                alt="Avatar" class="avatar" />
                                            <div class="user-details d-flex flex-column">
                                                <span class="user-name fw-bold">{{ newsfeed.user.name }}</span>
                                                <small>{{
                                                    formatTimeChatbot(newsfeed.postedAt)
                                                    }}</small>
                                            </div>
                                        </div>
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </div>
                                    <div class="post-title mb-2">{{ newsfeed.content }}</div>
                                    <div class="mb-3 text-center">
                                        <img :src="newsfeed.imageFile" alt="Post Image"
                                            class="newfeeds-post-image rounded-3 w-50" />
                                    </div>
                                    <div class="text-end">
                                        <button type="button" class="btn btn-danger me-3"
                                            @click="declinePost(newsfeed.id)">Decline</button>
                                        <button type="button" class="btn btn-primary" @click="permitPost(newsfeed.id)">
                                            <span v-if="isSpinnerLoading" class="spinner-border spinner-border-sm"
                                                role="status" aria-hidden="true">
                                            </span>
                                            <span v-else>Accept</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                                        id="btnCloseNotPermitPostModal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!newFeeds.length" class="text-center text-body-tertiary">No post yet! Let's post something to your
            class.</div>
        <div class="post border rounded-3 p-3 bg-white mb-2" v-for="(newfeed) in newFeeds" :key="newfeed.id">
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
                <i v-if="this.getUserInfo.role !== 'STUDENT'" class="bi bi-x-circle-fill text-danger"
                    data-bs-toggle="modal" data-bs-target="#deletePostModal"></i>
                <!-- DELETE POST MODAL -->
                <div class="modal fade" id="deletePostModal" tabindex="-1" aria-labelledby="deletePostModal"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5 text-danger" id="deletePostModal">
                                    Delete
                                    Post</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-danger">
                                Delete post will delete all comments its have. Are you sure you want to delete this
                                post?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                                    id="btnCloseDeletePostModal">Close</button>
                                <button type="button" class="btn btn-danger"
                                    @click="deletePost(newfeed.id)">Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="post-title mb-2">{{ newfeed.content }}</div>
            <div class="d-flex jsutiify-content-between gap-3">
                <div class="img-newsfeed w-50 text-center border-end">
                    <img :src="newfeed.imageFile" alt="Post Image" class="newfeeds-post-image rounded-3 w-75" />
                </div>
                <div class=" text-start w-50">
                    <div class="fw-bold mb-2">Comments: </div>
                    <div class=" comments d-flex flex-column justify-content-between">
                        <div class="comment-list overflow-y-auto" :ref="'commentList-' + newfeed.id">
                            <div class="text-body-tertiary" v-if="newfeed.comments.length === 0">
                                No comments yet! Be the first to comment ^^.
                            </div>
                            <div v-for="(comment, idx) in newfeed.comments" :key="idx" class="comment">
                                <div class="d-flex align-items-center  mb-3 ">
                                    <img :src="comment.userResponse.avatarUrl || require('@/assets/nonAvatar.png')"
                                        alt="Avatar" class="avatar" width="8%" />
                                    <div class="comment-content ms-2 w-100">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span class="fw-bold bg-info text-white rounded-3 p-1 me-2"
                                                    :class="{ 'bg-danger': !comment.userResponse?.classroom }"
                                                    style="font-size: x-small;">{{
                                                        comment.userResponse?.classroom ?
                                                            comment.userResponse.classroom.className : 'TEACHER' }}</span>
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
                                                <i class="bi bi-x-circle-fill" v-tooltip:bottom="'Delete this comment'"
                                                    data-bs-toggle="modal" data-bs-target="#deleteCommentModal"
                                                    @click="commentToDelete = comment.id"></i>
                                            </div>
                                        </div>
                                        <div class="mt-1">{{ comment.content }}</div>
                                    </div>
                                </div>
                                <!-- DELETE COMMENT MODAL -->
                                <div class="modal fade" id="deleteCommentModal" tabindex="-1"
                                    aria-labelledby="deleteCommentModal" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5 text-danger" id="deleteCommentModal">
                                                    Delete
                                                    Comment</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body text-danger">
                                                Are you sure you want to delete this comment?
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                                                    id="btnDeleteCommentModal">Close</button>
                                                <button type="button" class="btn btn-danger"
                                                    @click="deleteComment">Yes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="comment-input d-flex align-items-center justify-content-between">
                            <textarea v-model="newCommentContent[newfeed.id]" class="form-control mt-2"
                                placeholder="Write a comment ..." rows="1" id="textComment"></textarea>
                            <div v-if="isSpinnerLoading" class="spinner-border mx-3 text-info" role="status"
                                aria-hidden="true">
                            </div>
                            <div v-else>
                                <i class="bi bi-send fs-4 mx-3" v-tooltip:bottom="'Send Comment'"
                                    @click="postComment(newfeed.id, newCommentContent[newfeed.id])"></i>
                            </div>
                        </div>
                    </div>
                </div>
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
            isSpinnerLoading: false,
            newCommentContent: {},
            userInfo: {},
            commentToDelete: null,
            listNewsfeedNotPermit: [],
        };
    },

    mounted() {
        if (this.getUserInfo) {
            this.userInfo = this.getUserInfo;
            console.log("USER INFO:: ", this.userInfo);
            this.classroomId = this.getUserInfo.classroom?.id || null;
            this.userId = this.getUserInfo.id || null;
            this.fetchNewfeeds();
            this.fetchNotPermitNewsfeed();
        }
    },
    computed: {
        ...mapGetters(['getUserInfo']),
        isNotStudent() {
            return this.getUserInfo?.role && this.getUserInfo.role !== 'STUDENT';
        }
    },
    watch: {
        getUserInfo(newUserInfo) {
            if (newUserInfo) {
                this.classroomId = newUserInfo.classroom?.id || null;
                this.userId = newUserInfo.id || null;
                this.fetchNewfeeds();
                this.fetchNotPermitNewsfeed();
            }
        }
    },
    methods: {
        formatTimeChatbot,
        async deletePost(newsfeedId) {
            this.isSpinnerLoading = true;
            try {
                await axios.delete(`${this.apiUrl}/newsfeed/delete-post/${newsfeedId}`);
                document.getElementById("btnCloseDeletePostModal").click();
                this.fetchNewfeeds();
                toast.success("Post deleted successfully!");
            } catch (error) {
                console.error("Failed to delete post:", error);
                toast.error("Failed to delete post. Please try again.");
            } finally {
                this.isSpinnerLoading = false;
            }
        },
        async declinePost(newsfeedId) {
            this.isSpinnerLoading = true;
            try {
                await axios.delete(`${this.apiUrl}/newsfeed/delete-post/${newsfeedId}`);
                this.fetchNotPermitNewsfeed();
                toast.success("Post deleted successfully!");
            } catch (error) {
                console.error("Failed to delete post:", error);
                toast.error("Failed to delete post. Please try again.");
            } finally {
                this.isSpinnerLoading = false;
            }
        },
        async permitPost(newsfeedId) {
            this.isSpinnerLoading = true;
            try {
                const response = await axios.put(`${this.apiUrl}/newsfeed/permit-post/${newsfeedId}`);
                if (response.data && response.data.code == 200) {
                    this.fetchNotPermitNewsfeed();
                    toast.success("Post permitted successfully!");
                }
            } catch (error) {
                console.error("Failed to permit post:", error);
                toast.error("Failed to permit post. Please try again.");
            } finally {
                this.isSpinnerLoading = false;
            }
        },
        async deleteComment() {
            if (!this.commentToDelete) {
                toast.error("No comment selected for deletion.");
                return;
            }
            try {
                const response = await axios.delete(`${this.apiUrl}/comment/${this.commentToDelete}`);
                if (response.data && response.data.code == 200) {
                    document.getElementById("btnDeleteCommentModal").click();
                    this.fetchNewfeeds();
                    toast.success("Comment deleted successfully!");
                }
            } catch (error) {
                console.error("Failed to delete comment:", error);
                toast.error("Failed to delete comment. Please try again.");
            } finally {
                this.commentToDelete = null;
            }
        },
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
            if (!commentContent) {
                toast.error("Comment content cannot be empty!");
                return;
            }
            this.isSpinnerLoading = true;
            const payload = {
                newsfeedId: newsfeedId,
                userId: this.userId,
                content: commentContent,
            };
            try {
                const response = await axios.post(`${this.apiUrl}/comment/post-to-newsfeed`, payload);
                if (response.data && response.data.data) {
                    const newComment = response.data.data;
                    const isUserComment = await this.isCommentByUser(newComment.id);
                    newComment.isUserComment = isUserComment;
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
                this.isSpinnerLoading = false;
            }
        },
        async fetchCommentsByNewsfeedId(newsfeedId) {
            try {
                const response = await axios.get(this.apiUrl + `/comment/get-all-by-newsfeedId/${newsfeedId}`);
                const comments = response.data.data;
                for (const comment of comments) {
                    comment.isUserComment = await this.isCommentByUser(comment.id);
                }
                for (const comment of comments) {
                    comment.isUserPost = await this.isPostByUser(newsfeedId);
                }
                return comments;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchNewfeeds() {
            try {
                const response = await axios.get(this.apiUrl + `/newsfeed/permitted`);
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
        async fetchNotPermitNewsfeed() {
            try {
                const response = await axios.get(this.apiUrl + `/newsfeed/not-permit`);
                this.listNewsfeedNotPermit = response.data.data.reverse();
                console.log("listNewsfeedNotPermit:: ", this.listNewsfeedNotPermit);
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
            this.isSpinnerLoading = true;
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
                this.isSpinnerLoading = false;
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

.comments {
    min-height: 48vh;
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