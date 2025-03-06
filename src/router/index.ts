import { createRouter, createWebHistory } from 'vue-router';
import FlashcardSelector from '@/views/FlashcardSelector.vue';
import FlashcardView from '@/views/FlashcardView.vue';

const routes = [
  { path: '/', name: 'Home', component: FlashcardSelector },
  { path: '/:level/:type', name: 'Flashcard', component: FlashcardView },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});