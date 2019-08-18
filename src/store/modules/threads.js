import axios from 'axios'
import Vue from 'vue'
import axiosInstance from '@/services/axios'
import {applyFilters} from '@/helpers'
export default {
    namespaced: true, 
    state: {
        isAllThreadsLoaded: false,
        items: []
    },
    actions: {
        fetchThreads({commit, state}, {meetupId, filter = {}, init}) {
            if (!init) {
                commit('setItems', {resource: 'threads', items: []}, {root: true})
            }
            const url = applyFilters(`/api/v1/threads?meetupId=${meetupId}`, filter)
            return axios.get(url)
                .then( res => {
                    const {threads, isAllDataLoaded} = res.data
                    commit('setAllDataLoaded', isAllDataLoaded)
                    commit('mergeThreads', threads)
                    return state.items
                })
        },
        postThread({commit, state}, {title, meetupId}) {
            const thread = {}
            thread.title = title
            thread.meetup = meetupId
            return axiosInstance.post('/api/v1/threads', thread)
                .then(res => {
                    const createdThread = res.data
                    const index = state.items.length

                    commit('addItemToArray', {item: createdThread, index, resource: 'threads'}, {root: true})
                    return createdThread
                })
        },
        sendPost({commit, state, dispatch}, {text, thread}) {
            return axiosInstance.post('/api/v1/posts', {text, thread})
                .then(res => {
                    const createdPost = res.data
                    dispatch('addPostToThread', {post: createdPost, thread})
                    return createdPost
                })
        },
        addPostToThread({commit, state}, {post, thread}) {
            const threadIndex = state.items.findIndex(item => item._id === thread)
            if(threadIndex > -1) {
                const posts = state.items[threadIndex].posts
                posts.unshift(post)
                commit('savePostToThread', {posts, index: threadIndex})
            }
        }
    },
    mutations: {
        savePostToThread(state, {posts, index}) {
            Vue.set(state.items[index], 'posts', posts)
        },
        setAllDataLoaded(state, isAllDataLoaded) {
            state.isAllThreadsLoaded = isAllDataLoaded
        },
        mergeThreads(state, threads) {
            state.items = [...state.items, ...threads]
        }
    }
}