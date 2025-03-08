<template>
  <div class="min-h-screen flex flex-col items-center gap-4 p-4">
    <h1 class="text-2xl font-bold">Remembered Word</h1>
    <button @click="back" class="px-4 py-2 bg-gray-800 rounded cursor-pointer">Back</button>
    <button @click="startLearning" class="flex justify-center flex-auto px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
      Start Learning
    </button>
    
    <div v-for="data in flashcardData" :key="data.kanji">
      <label class="flex items-center gap-2">
        <input type="checkbox" :value="savedData[data.kanji]" v-model="savedData[data.kanji]" />
        {{ data.kanji }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { JLPTLevel, TypeFlashCard } from './FlashcardSelector.vue';

export interface JapaneseWordInterface {
  kanji: string,
  furigana: string
  translation: string
  check: boolean
}

const jsonFiles = import.meta.glob('/public/jlpt-*/**/*.json', { eager: true })

const router = useRouter();
const route = useRoute();
const level = route.params.level as JLPTLevel
const type = route.params.type as TypeFlashCard
const savedData = ref<Record<string, boolean>>({})

const flashcardData = computed(() => {
  for (const [path, moduleUnknown] of Object.entries(jsonFiles)) {
    const category = path.split('/').pop()?.replace('.json', '')
    if (path.includes(level) && type === category) {
      const module = moduleUnknown as { default: JapaneseWordInterface[] }
      return module.default
    }
  }
})


const isLoaded = loadSelection()
if (isLoaded) savedData.value = isLoaded

watch(savedData, () => saveSelection(), { deep: true })

function saveSelection () {
  localStorage.setItem(`saved-${level}-${type}`, JSON.stringify(savedData.value));
}

function loadSelection (): Record<string, boolean> | undefined {
  const data = localStorage.getItem(`saved-${level}-${type}`)
  if (!data) return undefined
  return JSON.parse(data);
}

function startLearning() {
  router.push({ name: 'Flashcard' });
}

function back() {
  router.push({ name: 'Home' });
}
</script>